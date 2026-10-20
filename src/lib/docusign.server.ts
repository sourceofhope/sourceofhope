import "server-only";

import { sign } from "node:crypto";
import { getEnvironment } from "@/lib/environment.server";
import type { WaiverId } from "@/lib/waivers";

/**
 * Minimal DocuSign eSignature REST client (no SDK), used for embedded waiver
 * signing. Authenticates with JWT Grant as the impersonated DocuSign user
 * configured in DOCUSIGN_USER_ID; that user must grant consent once (see
 * /docs/recipes/guidelines/SET_UP_DOCUSIGN_WAIVERS.md).
 */

/** Thrown for any failed DocuSign call. Never shown to visitors. */
export class DocusignError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly errorCode?: string,
  ) {
    super(message);
  }
}

export type SignerRole = "Volunteer" | "Guardian";

export interface Signer {
  roleName: string;
  name: string;
  email: string;
  status: string;
  clientUserId?: string;
  recipientId: string;
  routingOrder: string;
}

function config() {
  const env = getEnvironment();
  return {
    integrationKey: env.docusignIntegrationKey,
    userId: env.docusignUserId,
    accountId: env.docusignAccountId,
    privateKey: env.docusignPrivateKey,
    authHost:
      env.docusignEnvironment === "production" ? "account.docusign.com" : "account-d.docusign.com",
    baseUrl: env.docusignBaseUrl,
    templates: env.docusignTemplates,
    waiverSecret: env.waiverSecret,
  };
}

/** True when every value needed for online signing is set. */
export function isDocusignConfigured(): boolean {
  const c = config();
  return Boolean(
    c.integrationKey &&
      c.userId &&
      c.accountId &&
      c.privateKey &&
      c.waiverSecret &&
      c.templates.general.adult &&
      c.templates.general.minor &&
      c.templates["serving-hope"].adult &&
      c.templates["serving-hope"].minor,
  );
}

export function templateFor(waiverId: WaiverId, minor: boolean): string {
  const templateId = config().templates[waiverId][minor ? "minor" : "adult"];
  if (!templateId) throw new DocusignError(`Missing template for ${waiverId}`);
  return templateId;
}

/**
 * Accepts the RSA private key as PEM (with real or `\n`-escaped line breaks)
 * or as base64 of the PEM, since hosting dashboards often strip newlines.
 */
function privateKeyPem(raw: string): string {
  const value = raw.trim();
  if (value.includes("BEGIN")) return value.replace(/\\n/g, "\n");
  return Buffer.from(value, "base64").toString("utf8");
}

const base64url = (input: string | Buffer) => Buffer.from(input).toString("base64url");

let cachedToken: { value: string; expiresAt: number } | null = null;
let cachedBaseUrl: string | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  const c = config();
  if (!c.integrationKey || !c.userId || !c.privateKey) {
    throw new DocusignError("DocuSign is not configured");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: c.integrationKey,
      sub: c.userId,
      aud: c.authHost,
      iat: now,
      exp: now + 3600,
      scope: "signature impersonation",
    }),
  );
  const signature = sign("sha256", Buffer.from(`${header}.${payload}`), privateKeyPem(c.privateKey));
  const assertion = `${header}.${payload}.${base64url(signature)}`;

  const response = await fetch(`https://${c.authHost}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
  };

  if (!response.ok || !data.access_token) {
    // "consent_required" means the impersonated user hasn't granted consent yet.
    throw new DocusignError(`DocuSign token request failed: ${data.error ?? response.status}`, response.status, data.error);
  }

  // Refresh five minutes early; JWT Grant has no refresh token.
  const lifetime = Math.max((data.expires_in ?? 3600) - 300, 60);
  cachedToken = { value: data.access_token, expiresAt: Date.now() + lifetime * 1000 };
  return data.access_token;
}

/** The account's REST base, e.g. https://demo.docusign.net/restapi. */
async function getBaseUrl(token: string): Promise<string> {
  if (cachedBaseUrl) return cachedBaseUrl;

  const c = config();
  if (c.baseUrl) {
    cachedBaseUrl = c.baseUrl.replace(/\/+$/, "");
    return cachedBaseUrl;
  }

  const response = await fetch(`https://${c.authHost}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new DocusignError("DocuSign userinfo request failed", response.status);

  const data = (await response.json()) as {
    accounts?: { account_id: string; base_uri: string }[];
  };
  const account = data.accounts?.find((item) => item.account_id === c.accountId);
  if (!account) throw new DocusignError("DocuSign account not found for this user");

  cachedBaseUrl = `${account.base_uri}/restapi`;
  return cachedBaseUrl;
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  const baseUrl = await getBaseUrl(token);
  const response = await fetch(`${baseUrl}/v2.1/accounts/${config().accountId}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { errorCode?: string; message?: string };
    throw new DocusignError(
      `DocuSign ${init.method ?? "GET"} ${path.split("?")[0]} failed: ${body.errorCode ?? response.status}`,
      response.status,
      body.errorCode,
    );
  }

  return (await response.json()) as T;
}

interface CreateEnvelopeInput {
  templateId: string;
  emailSubject: string;
  volunteer: { name: string; email: string; clientUserId: string };
  /** Omit clientUserId to have DocuSign email the guardian instead. */
  guardian?: { name: string; email: string; clientUserId?: string };
  customFields: Record<string, string>;
  /** Per-envelope webhook; HMAC keys come from the account's Connect settings. */
  webhookUrl: string;
}

/** Creates and sends an envelope from a template; returns its id. */
export async function createWaiverEnvelope(input: CreateEnvelopeInput): Promise<string> {
  const templateRoles: Record<string, string>[] = [
    {
      roleName: "Volunteer" satisfies SignerRole,
      name: input.volunteer.name,
      email: input.volunteer.email,
      clientUserId: input.volunteer.clientUserId,
      routingOrder: "1",
    },
  ];

  if (input.guardian) {
    templateRoles.push({
      roleName: "Guardian" satisfies SignerRole,
      name: input.guardian.name,
      email: input.guardian.email,
      routingOrder: "2",
      ...(input.guardian.clientUserId ? { clientUserId: input.guardian.clientUserId } : {}),
    });
  }

  const envelope = await api<{ envelopeId: string }>("/envelopes", {
    method: "POST",
    body: JSON.stringify({
      templateId: input.templateId,
      status: "sent",
      emailSubject: input.emailSubject.slice(0, 100),
      templateRoles,
      customFields: {
        textCustomFields: Object.entries(input.customFields).map(([name, value]) => ({
          name,
          value: value.slice(0, 100),
          show: "false",
        })),
      },
      eventNotification: {
        url: input.webhookUrl,
        requireAcknowledgment: "true",
        deliveryMode: "SIM",
        includeHMAC: "true",
        events: ["envelope-completed"],
        eventData: { version: "restv2.1", format: "json" },
      },
    }),
  });

  return envelope.envelopeId;
}

/**
 * One-time signing link for an embedded signer. It expires after a few
 * minutes, so redirect to it immediately and never store it.
 */
export async function createSigningUrl(
  envelopeId: string,
  signer: { name: string; email: string; clientUserId: string },
  returnUrl: string,
): Promise<string> {
  const view = await api<{ url: string }>(`/envelopes/${envelopeId}/views/recipient`, {
    method: "POST",
    body: JSON.stringify({
      authenticationMethod: "none",
      clientUserId: signer.clientUserId,
      userName: signer.name,
      email: signer.email,
      returnUrl,
    }),
  });
  return view.url;
}

export async function getSigners(envelopeId: string): Promise<Signer[]> {
  const recipients = await api<{ signers?: Signer[] }>(`/envelopes/${envelopeId}/recipients`);
  return recipients.signers ?? [];
}

export interface EnvelopeSummary {
  status: string;
  completedDateTime?: string;
  signers: Signer[];
  customFields: Record<string, string>;
}

export async function getEnvelopeSummary(envelopeId: string): Promise<EnvelopeSummary> {
  const envelope = await api<{
    status: string;
    completedDateTime?: string;
    recipients?: { signers?: Signer[] };
    customFields?: { textCustomFields?: { name: string; value: string }[] };
  }>(`/envelopes/${envelopeId}?include=recipients,custom_fields`);

  return {
    status: envelope.status,
    completedDateTime: envelope.completedDateTime,
    signers: envelope.recipients?.signers ?? [],
    customFields: Object.fromEntries(
      (envelope.customFields?.textCustomFields ?? []).map((field) => [field.name, field.value]),
    ),
  };
}

/** Signer statuses that mean the person has finished signing. */
export function hasSigned(signer: Signer | undefined): boolean {
  return signer?.status === "completed" || signer?.status === "signed";
}

export function findSigner(signers: Signer[], role: SignerRole): Signer | undefined {
  return signers.find((signer) => signer.roleName === role);
}
