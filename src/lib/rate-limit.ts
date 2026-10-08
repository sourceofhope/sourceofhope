/**
 * Simple in-memory sliding-window rate limiter for Next.js API routes.
 *
 * NOTE: This is per-serverless-function-instance. It is sufficient for
 * low-traffic endpoints like payment-intent creation where the goal is to
 * slow down abuse rather than enforce hard global limits. For stricter
 * enforcement, replace the store with Redis (e.g. @vercel/kv).
 */

import { NextResponse } from "next/server";

interface RateLimitEntry {
  timestamps: number[];
  windowMs: number;
}

const store = new Map<string, RateLimitEntry>();

// Upper bound on tracked keys, and how often stale keys are swept.
const MAX_KEYS = 10_000;
const SWEEP_INTERVAL_MS = 60 * 1000;
let lastSweep = 0;

// Prune entries older than the window to keep memory bounded.
function prune(entry: RateLimitEntry, windowMs: number, now: number) {
  const cutoff = now - windowMs;
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
}

// Drop keys whose newest request has aged out of their window.
function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;

  for (const [key, entry] of store) {
    const newest = entry.timestamps[entry.timestamps.length - 1] ?? 0;
    if (newest <= now - entry.windowMs) {
      store.delete(key);
    }
  }
}

/**
 * Best-effort client IP for rate limiting. On Vercel the platform sets
 * `x-forwarded-for` / `x-real-ip`, so the first entry is the real client.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

/**
 * Check whether the caller identified by `key` is within the allowed limit.
 *
 * @param key        Unique identifier for the caller (e.g. "route:IP").
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
  sweep(now);

  let entry = store.get(key);
  if (!entry) {
    // Evict the oldest key (Map keeps insertion order) if we are at capacity.
    if (store.size >= MAX_KEYS) {
      const oldestKey = store.keys().next().value;
      if (oldestKey !== undefined) store.delete(oldestKey);
    }
    entry = { timestamps: [], windowMs };
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
 * Rate-limit the caller's IP within `scope` (e.g. "email"). Returns a 429
 * response when the limit is exceeded, otherwise null.
 */
export function enforceRateLimit(
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
