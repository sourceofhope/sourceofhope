import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, ENABLED_LOCALES, LOCALE_PREFIXES } from "./locales";

export const routing = defineRouting({
  locales: ENABLED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: { mode: "as-needed", prefixes: LOCALE_PREFIXES },
  // No Accept-Language or cookie redirects (Google guidance; ADR-0004).
  localeDetection: false,
  // hreflang comes from our metadata helper, only for pages that exist in a locale.
  alternateLinks: false,
});
