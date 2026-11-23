/**
 * Every locale the site knows (ADR-0004). Locales are full BCP 47 tags so
 * Intl formats correctly ("es-US" → "$1,234.50", "9:30 a.m."); URLs use short
 * prefixes instead (none for English, /es, /pseudo).
 *
 * `en-XA` is a pseudo-locale for catching hard-coded strings and text
 * overflow. It is enabled locally and in CI only, never in production.
 */
export const ALL_LOCALES = ["en-US", "es-US", "en-XA"] as const;
export type AppLocale = (typeof ALL_LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = "en-US";

export const LOCALE_PREFIXES: Partial<Record<AppLocale, `/${string}`>> = {
  "es-US": "/es",
  "en-XA": "/pseudo",
};

/** How each language names itself (language switcher, spec §8.6). */
export const LOCALE_LABELS: Record<AppLocale, { label: string; lang: string }> = {
  "en-US": { label: "English", lang: "en" },
  "es-US": { label: "Español", lang: "es" },
  "en-XA": { label: "Pseudo (test)", lang: "en" },
};

/** Parse NEXT_PUBLIC_ENABLED_LOCALES; English is always enabled and first. */
export function parseEnabledLocales(value: string | undefined): AppLocale[] {
  const requested = (value ?? DEFAULT_LOCALE)
    .split(",")
    .map((l) => l.trim())
    .filter((l): l is AppLocale => (ALL_LOCALES as readonly string[]).includes(l));
  return [DEFAULT_LOCALE, ...requested.filter((l) => l !== DEFAULT_LOCALE)].filter(
    (l, i, all) => all.indexOf(l) === i,
  );
}

export const ENABLED_LOCALES: AppLocale[] = parseEnabledLocales(process.env.NEXT_PUBLIC_ENABLED_LOCALES);

/** The language switcher only appears when there is more than one real language. */
export const hasLanguageChoice = (locales: readonly AppLocale[] = ENABLED_LOCALES) =>
  locales.filter((l) => l !== "en-XA").length > 1;
