import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Webhook safety (02 §8.1): verify the signature, dedupe by the provider's
 * event id through the ledger (`integration_events`), and keep handlers
 * safe to retry.
 */

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** Plain HMAC check (DocuSign Connect: base64 HMAC-SHA256 of the raw body). */
export function verifyHmac({
  payload,
  signature,
  secret,
  algorithm = "sha256",
  encoding = "base64",
}: {
  payload: string;
  signature: string | null | undefined;
  secret: string;
  algorithm?: "sha256" | "sha1";
  encoding?: "base64" | "hex";
}): boolean {
  if (!signature) return false;
  const expected = createHmac(algorithm, secret).update(payload, "utf8").digest(encoding);
  return safeEqual(expected, signature.trim());
}

/**
 * Standard Webhooks (https://www.standardwebhooks.com), used by Supabase
 * Auth hooks: `webhook-id`, `webhook-timestamp`, `webhook-signature: v1,<b64>`.
 * The secret is `v1,whsec_<base64>`. Rejects timestamps more than five
 * minutes off, which stops replays.
 */
export function verifyStandardWebhook({
  payload,
  headers,
  secret,
  now = new Date(),
  toleranceSeconds = 300,
}: {
  payload: string;
  headers: { get(name: string): string | null };
  secret: string;
  now?: Date;
  toleranceSeconds?: number;
}): boolean {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatures = headers.get("webhook-signature");
  if (!id || !timestamp || !signatures) return false;
  const sentAt = Number(timestamp);
  if (!Number.isFinite(sentAt) || Math.abs(now.getTime() / 1000 - sentAt) > toleranceSeconds) return false;
  const key = Buffer.from(secret.replace(/^v1,/, "").replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${payload}`, "utf8").digest("base64");
  return signatures.split(" ").some((entry) => {
    const [version, value] = entry.split(",");
    return version === "v1" && value !== undefined && safeEqual(expected, value);
  });
}

/** The ledger's view of one provider event. */
export type LedgerEntry = { status: "received" | "processed" | "failed"; attempts: number };

/** Storage for the webhook ledger. The Postgres version lives in `src/lib/db/`. */
export interface WebhookLedger {
  /** Record the event if new; return its current entry either way. Must be atomic. */
  claim(provider: string, externalEventId: string, type: string): Promise<LedgerEntry & { isNew: boolean }>;
  markProcessed(provider: string, externalEventId: string): Promise<void>;
  markFailed(provider: string, externalEventId: string, error: string): Promise<void>;
}

export type ProcessResult = "processed" | "duplicate" | "failed";

/**
 * Run a webhook handler at most once per provider event. A duplicate
 * delivery of an already processed event is acknowledged without running
 * the handler again; a failed one is retried. Handler errors are recorded
 * and rethrown so the provider retries with backoff.
 */
export async function processOnce(
  ledger: WebhookLedger,
  event: { provider: string; externalEventId: string; type: string },
  handler: () => Promise<void>,
): Promise<ProcessResult> {
  const entry = await ledger.claim(event.provider, event.externalEventId, event.type);
  if (!entry.isNew && entry.status === "processed") return "duplicate";
  try {
    await handler();
    await ledger.markProcessed(event.provider, event.externalEventId);
    return "processed";
  } catch (error) {
    await ledger.markFailed(event.provider, event.externalEventId, error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/** An in-memory ledger for tests and local scripts. */
export function memoryLedger(): WebhookLedger & { entries: Map<string, LedgerEntry & { error?: string }> } {
  const entries = new Map<string, LedgerEntry & { error?: string }>();
  const key = (p: string, id: string) => `${p}:${id}`;
  return {
    entries,
    async claim(provider, id) {
      const existing = entries.get(key(provider, id));
      if (existing) {
        existing.attempts += 1;
        return { ...existing, isNew: false };
      }
      const created: LedgerEntry = { status: "received", attempts: 1 };
      entries.set(key(provider, id), created);
      return { ...created, isNew: true };
    },
    async markProcessed(provider, id) {
      entries.set(key(provider, id), { ...entries.get(key(provider, id))!, status: "processed" });
    },
    async markFailed(provider, id, error) {
      entries.set(key(provider, id), { ...entries.get(key(provider, id))!, status: "failed", error });
    },
  };
}
