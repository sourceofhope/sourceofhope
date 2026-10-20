import "server-only";

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { getEnvironment } from "@/lib/environment.server";
import { isWaiverId, type WaiverId } from "@/lib/waivers";

/**
 * Short-lived, signed state for an online signing session, stored in an
 * HttpOnly cookie scoped to /api/waiver. /start writes it, /return reads it
 * after DocuSign redirects back. Keeping it in a cookie (instead of the
 * returnUrl) ties the session to the browser that started it and avoids
 * DocuSign's returnUrl length limit.
 */
export const FLOW_COOKIE = "tsoh_waiver_flow";
export const FLOW_COOKIE_PATH = "/api/waiver";
export const FLOW_TTL_SECONDS = 2 * 60 * 60;

export interface WaiverFlow {
  /** DocuSign envelope id. */
  envelopeId: string;
  waiverId: WaiverId;
  /** Event to reopen on /events after signing. */
  eventKey?: string;
  /** Same-origin path to send the visitor back to. */
  returnPath: string;
  /** Seed for the embedded signers' clientUserIds. */
  nonce: string;
  /** How the guardian signs, for minors. */
  guardian?: "here" | "email";
  /** Hash of the signer details, so a retry with the same details reuses the envelope. */
  fingerprint: string;
  /** Unix seconds. */
  expiresAt: number;
}

function secret(): string {
  const value = getEnvironment().waiverSecret;
  if (!value) throw new Error("WAIVER_SECRET is not configured");
  return value;
}

const mac = (data: string) => createHmac("sha256", secret()).update(data).digest("base64url");

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function newNonce(): string {
  return randomBytes(12).toString("base64url");
}

/** Stable, unguessable clientUserId per signing session and role. */
export function clientUserIdFor(nonce: string, role: "volunteer" | "guardian"): string {
  return mac(`client:${nonce}:${role}`).slice(0, 32);
}

export function fingerprintSigners(parts: (string | boolean | undefined)[]): string {
  return createHash("sha256")
    .update(JSON.stringify(parts.map((part) => (typeof part === "string" ? part.toLowerCase() : part ?? null))))
    .digest("base64url")
    .slice(0, 22);
}

export function encodeFlow(flow: WaiverFlow): string {
  const payload = Buffer.from(JSON.stringify(flow)).toString("base64url");
  return `${payload}.${mac(payload)}`;
}

/** Returns the flow if the cookie is authentic, well-formed, and unexpired. */
export function decodeFlow(value: string | undefined): WaiverFlow | null {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature || !safeEqual(signature, mac(payload))) return null;

  try {
    const flow = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as WaiverFlow;
    if (
      typeof flow.envelopeId !== "string" ||
      !isWaiverId(flow.waiverId) ||
      typeof flow.returnPath !== "string" ||
      typeof flow.nonce !== "string" ||
      typeof flow.expiresAt !== "number" ||
      flow.expiresAt < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return flow;
  } catch {
    return null;
  }
}
