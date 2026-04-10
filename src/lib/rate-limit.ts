/**
 * Simple in-memory sliding-window rate limiter for Next.js API routes.
 *
 * NOTE: This is per-serverless-function-instance. It is sufficient for
 * low-traffic endpoints like payment-intent creation where the goal is to
 * slow down abuse rather than enforce hard global limits. For stricter
 * enforcement, replace the store with Redis (e.g. @vercel/kv).
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

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

  if (!store.has(key)) {
    store.set(key, { timestamps: [] });
  }

  const entry = store.get(key)!;
  prune(entry, windowMs, now);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0];
    const retryAfterMs = windowMs - (now - oldest);
    return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 0) };
  }

  entry.timestamps.push(now);
  return { allowed: true, retryAfterMs: 0 };
}
