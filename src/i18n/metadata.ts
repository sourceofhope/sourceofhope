import type { Metadata } from "next";
import { DEFAULT_LOCALE, ENABLED_LOCALES, LOCALE_LABELS, LOCALE_PREFIXES, type AppLocale } from "./locales";

export const SITE_URL = "https://thesourceofhope.org";

/** The public path of `pathname` in `locale` ("/events" → "/es/events"). */
export function localizedPath(pathname: string, locale: AppLocale): string {
  const path = pathname === "/" ? "" : pathname;
  const prefix = LOCALE_PREFIXES[locale] ?? "";
  return `${prefix}${path}` || "/";
}

/**
 * Canonical + hreflang alternates for a page (spec §14, research §4).
 * Each language version is its own canonical; alternates list only the real
 * locales the page exists in, plus x-default → English. The pseudo-locale is
 * never advertised.
 */
export function localeAlternates(
  pathname: string,
  locale: AppLocale,
  availableIn: readonly AppLocale[] = ENABLED_LOCALES,
): NonNullable<Metadata["alternates"]> {
  const canonical = `${SITE_URL}${localizedPath(pathname, locale)}`;
  const real = availableIn.filter((l) => l !== "en-XA");
  if (real.length < 2) return { canonical };
  const languages: Record<string, string> = {};
  for (const l of real) languages[LOCALE_LABELS[l].lang] = `${SITE_URL}${localizedPath(pathname, l)}`;
  languages["x-default"] = `${SITE_URL}${localizedPath(pathname, DEFAULT_LOCALE)}`;
  return { canonical, languages };
}
