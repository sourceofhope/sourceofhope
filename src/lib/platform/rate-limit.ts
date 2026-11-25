import { createHash } from "node:crypto";

/**
 * Rate limiting on a shared store (02 §8.1). Decision (spike 0.6): the store
 * is Postgres, through the `rate_limit_hit` function in our Supabase
 * database, so there is no extra vendor. Fixed windows keep it to one
 * atomic upsert per request.
 */

export type RateLimitRule = {
  /** What's being limited: "newsletter", "link-exchange", "payment-create", … */
  name: string;
  limit: number;
  windowSeconds: number;
};

export type RateLimitResult = { allowed: boolean; remaining: number; retryAfterSeconds: number };

export interface RateLimitStore {
  /** Count one hit for `key` in the window starting at `windowStart`; return the new count. Must be atomic. */
  hit(key: string, windowStart: Date, windowSeconds: number): Promise<number>;
}

/** The rules every public endpoint uses. Tune here, not at call sites. */
export const RATE_LIMITS = {
  newsletter: { name: "newsletter", limit: 5, windowSeconds: 600 },
  contactForm: { name: "contact-form", limit: 5, windowSeconds: 600 },
  inquiry: { name: "inquiry", limit: 5, windowSeconds: 600 },
  linkExchange: { name: "link-exchange", limit: 20, windowSeconds: 600 },
  paymentCreate: { name: "payment-create", limit: 10, windowSeconds: 600 },
  statusLookup: { name: "status-lookup", limit: 60, windowSeconds: 600 },
} as const satisfies Record<string, RateLimitRule>;

/**
 * The stored key: rule name plus a hash of the caller id (an IP address is
 * personal data, so it is never stored in the clear).
 */
export function rateLimitKey(rule: Pick<RateLimitRule, "name">, callerId: string): string {
  return `${rule.name}:${createHash("sha256").update(callerId).digest("hex").slice(0, 32)}`;
}

export function windowStart(now: Date, windowSeconds: number): Date {
  const ms = windowSeconds * 1000;
  return new Date(Math.floor(now.getTime() / ms) * ms);
}

export async function checkRateLimit(store: RateLimitStore, rule: RateLimitRule, callerId: string, now = new Date()): Promise<RateLimitResult> {
  const start = windowStart(now, rule.windowSeconds);
  const count = await store.hit(rateLimitKey(rule, callerId), start, rule.windowSeconds);
  const retryAfterSeconds = Math.max(1, Math.ceil((start.getTime() + rule.windowSeconds * 1000 - now.getTime()) / 1000));
  return count <= rule.limit
    ? { allowed: true, remaining: rule.limit - count, retryAfterSeconds: 0 }
    : { allowed: false, remaining: 0, retryAfterSeconds };
}

/** The caller id for a request: the first forwarded address Vercel sets, else a constant. */
export function callerIdFrom(headers: { get(name: string): string | null }): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

/** An in-memory store for tests and local scripts. Never for production (instances don't share memory). */
export function memoryRateLimitStore(): RateLimitStore {
  const counts = new Map<string, number>();
  return {
    async hit(key, start) {
      const id = `${key}@${start.getTime()}`;
      const next = (counts.get(id) ?? 0) + 1;
      counts.set(id, next);
      return next;
    },
  };
}
