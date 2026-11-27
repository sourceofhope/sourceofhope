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

/** Spec §13.2: "Fri, Dec 25", with the year only when it isn't this year ("Fri, Jan 8, 2027"). */
export function formatEventDate(date: Date, locale: AppLocale, now: Date = new Date()): string {
  const year = (d: Date) => new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: TIME_ZONE }).format(d);
  return clean(
    new Intl.DateTimeFormat(intlLocale(locale), {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: year(date) === year(now) ? undefined : "numeric",
      timeZone: TIME_ZONE,
    }).format(date),
  );
}

/**
 * Spec §13.2: "9:00–11:30 a.m. CT", always Central and labelled. English
 * uses a.m./p.m. per the style guide; other locales keep their own format.
 */
export function formatTimeRange(start: Date, end: Date, locale: AppLocale): string {
  const parts = (d: Date) =>
    new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: TIME_ZONE }).formatToParts(d);
  if (intlLocale(locale) !== "en-US") return `${clean(formatTime(start, locale))}–${clean(formatTime(end, locale))} CT`;
  const label = (d: Date) => {
    const p = parts(d);
    const time = `${p.find((x) => x.type === "hour")!.value}:${p.find((x) => x.type === "minute")!.value}`;
    const period = p.find((x) => x.type === "dayPeriod")!.value.toUpperCase() === "AM" ? "a.m." : "p.m.";
    return { time, period };
  };
  const a = label(start);
  const b = label(end);
  return a.period === b.period ? `${a.time}–${b.time} ${b.period} CT` : `${a.time} ${a.period}–${b.time} ${b.period} CT`;
}
