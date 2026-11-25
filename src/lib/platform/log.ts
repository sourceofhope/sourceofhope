/**
 * Structured logging with scrubbing (02 §8.1): no personal data or tokens
 * in logs. Every value passes through `scrub` before it's written, and URLs
 * keep only Hub and UTM query keys.
 */

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
// US-style phone numbers, with or without separators and country code.
const PHONE = /(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
// Long opaque strings: tokens, keys, secrets (24+ base64/hex/url-safe chars).
const TOKEN = /\b[A-Za-z0-9_\-+/]{24,}={0,2}/g;
const BEARER = /\b(Bearer|Basic)\s+[^\s"']+/gi;

/** Field names whose values are always replaced, whatever they contain. */
const SECRET_KEYS = /(pass(word)?|secret|token|authorization|cookie|api[-_]?key|signature|email|phone|first_?name|last_?name|address|birth)/i;

/** Query keys that may stay in logged URLs (02 §3, §6.2). Everything else is dropped. */
export const LOGGABLE_QUERY_KEYS = new Set([
  "action",
  "type",
  "need",
  "event",
  "program",
  "step",
  "view",
  "designation",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
]);

export const REDACTED = "[redacted]";

/** Keep only Hub and UTM keys in a URL's query string; drop the fragment. */
export function scrubUrl(input: string): string {
  try {
    const url = new URL(input, "https://placeholder.invalid");
    for (const key of [...url.searchParams.keys()]) {
      if (!LOGGABLE_QUERY_KEYS.has(key)) url.searchParams.delete(key);
    }
    url.hash = "";
    const out = url.origin === "https://placeholder.invalid" ? `${url.pathname}${url.search}` : url.toString();
    return out;
  } catch {
    return scrubString(input);
  }
}

export function scrubString(value: string): string {
  return value.replace(BEARER, `$1 ${REDACTED}`).replace(EMAIL, REDACTED).replace(PHONE, REDACTED).replace(TOKEN, REDACTED);
}

/** Recursively scrub a value for logging. Errors keep their name and a scrubbed message and stack. */
export function scrub(value: unknown, depth = 0): unknown {
  if (depth > 6) return "[truncated]";
  if (value == null || typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value === "string") return /^(https?:\/\/|\/)/.test(value) && value.includes("?") ? scrubUrl(value) : scrubString(value);
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Error) return { name: value.name, message: scrubString(value.message), stack: value.stack ? scrubString(value.stack) : undefined };
  if (Array.isArray(value)) return value.map((v) => scrub(v, depth + 1));
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, SECRET_KEYS.test(k) ? REDACTED : scrub(v, depth + 1)]),
    );
  }
  return String(value);
}

type Level = "debug" | "info" | "warn" | "error";
type Sink = (line: string, level: Level) => void;

const defaultSink: Sink = (line, level) => {
  (level === "error" ? console.error : level === "warn" ? console.warn : console.log)(line);
};

/**
 * A logger bound to a scope ("webhook.stripe", "job.cutoff"). Writes one JSON
 * line per call: time, level, scope, message and scrubbed fields.
 */
export function createLogger(scope: string, sink: Sink = defaultSink) {
  const write = (level: Level, message: string, fields?: Record<string, unknown>) =>
    sink(JSON.stringify({ at: new Date().toISOString(), level, scope, message: scrubString(message), ...(fields ? (scrub(fields) as object) : {}) }), level);
  return {
    debug: (message: string, fields?: Record<string, unknown>) => write("debug", message, fields),
    info: (message: string, fields?: Record<string, unknown>) => write("info", message, fields),
    warn: (message: string, fields?: Record<string, unknown>) => write("warn", message, fields),
    error: (message: string, fields?: Record<string, unknown>) => write("error", message, fields),
  };
}

export type Logger = ReturnType<typeof createLogger>;
