/**
 * Locale-aware formatting for code outside React (emails, metadata, API
 * responses). Inside components use next-intl's useFormatter/getFormatter,
 * which share the same time zone. Every date is shown in Central time.
 */
import type { AppLocale } from "./locales";

export const TIME_ZONE = "America/Chicago";

/** The Intl locale for an app locale (the pseudo-locale formats as US English). */
export const intlLocale = (locale: AppLocale): string => (locale === "en-XA" ? "en-US" : locale);

/** Normalize the narrow no-break spaces some Intl versions emit (hydration-safe). */
const clean = (value: string) => value.replace(/[  ]/g, " ");

export function formatDate(date: Date, locale: AppLocale, style: "full" | "long" | "medium" = "full"): string {
  return clean(new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: style, timeZone: TIME_ZONE }).format(date));
}

export function formatTime(date: Date, locale: AppLocale): string {
  return clean(
    new Intl.DateTimeFormat(intlLocale(locale), { hour: "numeric", minute: "2-digit", timeZone: TIME_ZONE }).format(date),
  );
}

export function formatMoney(amount: number, locale: AppLocale, options: { cents?: boolean } = {}): string {
  const whole = Number.isInteger(amount) && !options.cents;
  return clean(
    new Intl.NumberFormat(intlLocale(locale), {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: whole ? 0 : 2,
      maximumFractionDigits: whole ? 0 : 2,
    }).format(amount),
  );
}

export function formatNumber(value: number, locale: AppLocale): string {
  return clean(new Intl.NumberFormat(intlLocale(locale)).format(value));
}
