import { NextResponse } from "next/server";

/**
 * Simple in-memory sliding-window rate limiter for Next.js API routes.
 *
 * NOTE: This is per-serverless-function-instance. It is sufficient for
 * low-traffic endpoints where the goal is to slow down abuse rather than
 * enforce hard global limits. For stricter enforcement, replace the store
 * with Redis (e.g. @upstash/ratelimit).
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Upper bound on tracked callers so a flood of unique keys can't exhaust memory.
const MAX_KEYS = 10_000;

// Prune entries older than the window to keep memory bounded.
function prune(entry: RateLimitEntry, windowMs: number, now: number) {
  const cutoff = now - windowMs;
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
}

/**
 * Check whether the caller identified by `key` is within the allowed limit.
 *
 * @param key        Unique identifier for the caller (e.g. IP address).
 * @param limit      Maximum number of requests allowed within `windowMs`.
 * @param windowMs   Sliding window duration in milliseconds.
 * @returns `{ allowed: boolean; retryAfterMs: number }`
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();

  let entry = store.get(key);
  if (!entry) {
    if (store.size >= MAX_KEYS) {
      // Evict the oldest-inserted key (Map preserves insertion order).
      const oldestKey = store.keys().next().value;
      if (oldestKey !== undefined) store.delete(oldestKey);
    }
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  prune(entry, windowMs, now);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0];
    const retryAfterMs = windowMs - (now - oldest);
    return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 0) };
  }

  entry.timestamps.push(now);
  return { allowed: true, retryAfterMs: 0 };
}

/**
 * Best-effort client IP. On Vercel `x-real-ip` is set by the platform; the
 * right-most `x-forwarded-for` entry is the one added by our own proxy, so
 * it can't be spoofed by the client the way the left-most entry can.
 */
export function getClientIp(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return forwarded?.at(-1) ?? "unknown";
}

/**
 * Apply a per-IP limit for a named endpoint. Returns a 429 response when the
 * caller is over the limit, or `null` when the request may proceed.
 */
export function rateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number,
): NextResponse | null {
  const { allowed, retryAfterMs } = checkRateLimit(
    `${scope}:${getClientIp(request)}`,
    limit,
    windowMs,
  );

  if (allowed) return null;

  return NextResponse.json(
    { error: "Too many requests. Please wait before trying again." },
    {
      status: 429,
      headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
    },
  );
}
