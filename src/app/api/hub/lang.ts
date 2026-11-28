import { HELP_NEEDS, type HelpNeed } from "@/lib/hub-url";

/** The content language for a Hub request (`?lang=en`). Unknown values fall back to English, the source. */
export function hubLang(request: Request): "en" | "es" {
  return new URL(request.url).searchParams.get("lang") === "es" ? "es" : "en";
}

export function hubNeed(request: Request): HelpNeed | null {
  const need = new URL(request.url).searchParams.get("need");
  return (HELP_NEEDS as readonly string[]).includes(need ?? "") ? (need as HelpNeed) : null;
}

export const SLUG = /^[a-z0-9][a-z0-9-]{0,99}$/;

/** Public, shared-cacheable for a minute; spots left can't go far out of date. */
export const HUB_CACHE = { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=120" };
