import { z } from "zod";

/*
 * Campaign attribution (02 §3, §6.2). Hub links carry UTMs along; the first
 * UTMs of a visit are kept in a session-only, first-party cookie with no
 * personal data. When a registration, gift or inquiry is created, the
 * client sends what it has and the server stores it on that record.
 */

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
export type UtmKey = (typeof UTM_KEYS)[number];

export const FIRST_TOUCH_COOKIE = "tsoh_ft";

const utmValue = z
  .string()
  .trim()
  .max(100)
  .regex(/^[\w.\-+ ]+$/);
const path = z
  .string()
  .max(300)
  .regex(/^\/[^\s?#]*$/);

/** What a record stores: the four UTM columns and `landing_path`. Bad values are dropped, never rejected. */
export const attributionSchema = z
  .object({
    utm_source: utmValue.optional().catch(undefined),
    utm_medium: utmValue.optional().catch(undefined),
    utm_campaign: utmValue.optional().catch(undefined),
    utm_content: utmValue.optional().catch(undefined),
    landing_path: path.optional().catch(undefined),
  })
  .catch({});
export type Attribution = z.output<typeof attributionSchema>;

/** The UTMs in a query string (lowercased, per the naming rules). */
export function readUtm(search: URLSearchParams | string): Partial<Record<UtmKey, string>> {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const out: Partial<Record<UtmKey, string>> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value && utmValue.safeParse(value).success) out[key] = value.toLowerCase();
  }
  return out;
}

function readCookie(cookieHeader: string, name: string): string | undefined {
  for (const part of cookieHeader.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return undefined;
}

/** Parse the first-touch cookie's value (URL-encoded JSON). */
export function parseFirstTouch(value: string | undefined): Attribution {
  if (!value) return {};
  try {
    return attributionSchema.parse(JSON.parse(decodeURIComponent(value)));
  } catch {
    return {};
  }
}

/** Browser: remember the visit's first UTMs and landing page, once per session. */
export function captureFirstTouch() {
  if (typeof document === "undefined") return;
  if (readCookie(document.cookie, FIRST_TOUCH_COOKIE)) return;
  const utm = readUtm(window.location.search);
  if (Object.keys(utm).length === 0) return;
  const value = encodeURIComponent(JSON.stringify({ ...utm, landing_path: window.location.pathname }));
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  // No Expires or Max-Age: a session cookie, gone when the browser closes.
  document.cookie = `${FIRST_TOUCH_COOKIE}=${value}; Path=/; SameSite=Lax${secure}`;
}

/** Browser: what to send with a submission. The current URL's UTMs win; the first touch fills the gaps. */
export function currentAttribution(): Attribution {
  if (typeof document === "undefined") return {};
  const first = parseFirstTouch(readCookie(document.cookie, FIRST_TOUCH_COOKIE));
  const now = readUtm(window.location.search);
  const hasNow = Object.keys(now).length > 0;
  return attributionSchema.parse(hasNow ? { ...now, landing_path: window.location.pathname } : { ...first, landing_path: first.landing_path ?? window.location.pathname });
}
