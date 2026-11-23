import * as rootParams from "next/root-params";
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { DEFAULT_LOCALE } from "./locales";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    // Route Handlers and Server Actions can't read root params; they pass
    // `locale` explicitly. Areas outside [locale] (styleguide, the English-only
    // Staff Portal) have no locale param and use the default.
    const param = await rootParams.locale().catch(() => undefined);
    if (param === undefined) locale = DEFAULT_LOCALE;
    else if (hasLocale(routing.locales, param)) locale = param;
    else notFound();
  }

  return {
    locale,
    timeZone: "America/Chicago",
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
