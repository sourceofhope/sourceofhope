const CMS_HOME_URL = "https://cms.thesourceofhope.org/wp-json/wp/v2";

const DEFAULT_TTL_MS = 60_000;
const DEFAULT_STALE_MS = 10 * 60_000;
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RETRIES = 2;

const memCache = new Map();
const inflight = new Map();

function cacheKey(url, options) {
  const method = (options?.method || "GET").toUpperCase();
  const body = options?.body ? JSON.stringify(options.body) : "";
  return `${method}:${url}:${body}`;
}

function readLocal(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function isRetriable(status) {
  return status === 408 || status === 429 || (status >= 500 && status <= 599);
}

async function fetchWithTimeout(url, init, timeoutMs) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function fetchWithRetry(url, init, { retries, timeoutMs }) {
  let attempt = 0;
  let lastErr;

  while (attempt <= retries) {
    try {
      const res = await fetchWithTimeout(url, init, timeoutMs);

      if (!res.ok && isRetriable(res.status) && attempt < retries) {
        const backoff =
          Math.min(2000, 250 * 2 ** attempt) + Math.random() * 150;
        await sleep(backoff);
        attempt++;
        continue;
      }

      return res;
    } catch (err) {
      lastErr = err;
      if (attempt >= retries) throw err;
      const backoff = Math.min(2000, 250 * 2 ** attempt) + Math.random() * 150;
      await sleep(backoff);
      attempt++;
    }
  }

  throw lastErr;
}

/**
 * fetchContent(endpoint, options, cacheOptions)
 *
 * cacheOptions:
 * - ttlMs: freshness window
 * - staleMs: how long we allow stale as fallback
 * - timeoutMs
 * - retries
 * - cache: true/false
 */
export async function fetchContent(endpoint, options = {}, cacheOptions = {}) {
  const {
    ttlMs = DEFAULT_TTL_MS,
    staleMs = DEFAULT_STALE_MS,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = DEFAULT_RETRIES,
    cache = true,
  } = cacheOptions;

  const url = `${CMS_HOME_URL}${endpoint}`;
  const method = (options.method || "GET").toUpperCase();

  // Only cache GET by default
  const shouldCache = cache && method === "GET";

  const key = cacheKey(url, options);
  const now = Date.now();

  const mem = shouldCache ? memCache.get(key) : null;
  const local = shouldCache ? readLocal(key) : null;

  const cached =
    (mem && (!local || mem.ts >= local.ts) && mem) || (local && local);

  const isFresh = cached && now - cached.ts <= ttlMs;
  const isStaleButOk = cached && now - cached.ts <= staleMs;

  if (shouldCache && isFresh) return cached.data;

  if (inflight.has(key)) {
    if (shouldCache && isStaleButOk) return cached.data;
    return inflight.get(key);
  }

  const doRequest = (async () => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (shouldCache && cached?.etag) {
      headers["If-None-Match"] = cached.etag;
    }

    const init = { ...options, headers };

    let res;
    try {
      res = await fetchWithRetry(url, init, { retries, timeoutMs });
      if (shouldCache && res.status === 304 && cached?.data) {
        const updated = { ...cached, ts: now };
        memCache.set(key, updated);
        writeLocal(key, updated);
        return updated.data;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        const err = new Error(`CMS API Error: ${res.status} - ${text}`);
        err.status = res.status;
        throw err;
      }

      const data = await res.json();
      const etag = res.headers.get("etag") || null;

      if (shouldCache) {
        const entry = { data, ts: now, etag };
        memCache.set(key, entry);
        writeLocal(key, entry);
      }

      return data;
    } catch (err) {
      if (shouldCache && isStaleButOk) return cached.data;
      throw err;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, doRequest);
  if (shouldCache && isStaleButOk) {
    doRequest.catch(() => {});
    return cached.data;
  }

  return doRequest;
}

export function prefetchContent(endpoint, options = {}, cacheOptions = {}) {
  return fetchContent(endpoint, options, cacheOptions).catch(() => {});
}

export function getFeaturedImage(post) {
  return post?._embedded?.["wp:featuredmedia"]?.[0] ?? null;
}

export function getResponsiveImage(image, { width }) {
  if (!image) return null;

  const sizes = image.media_details?.sizes || {};
  const baseW = image.media_details?.width || 0;

  const candidates = [
    sizes.thumbnail,
    sizes.medium,
    sizes.medium_large,
    sizes.large,
    baseW ? { source_url: image.source_url, width: baseW } : null,
  ].filter(Boolean);

  const picked =
    candidates.find((img) => (img.width || 0) >= width) ||
    candidates[candidates.length - 1];

  return picked?.source_url || image.source_url;
}

export function getSrcSet(image) {
  const sizes = image?.media_details?.sizes;
  if (!sizes) return null;

  const all = Object.values(sizes)
    .filter((s) => s?.source_url && s?.width)
    .sort((a, b) => a.width - b.width);

  if (!all.length) return null;

  return all.map((s) => `${s.source_url} ${s.width}w`).join(", ");
}
