/**
 * Date formatting for events. Every value is shown in Central time, where all
 * Source of Hope events take place, regardless of the visitor's time zone.
 *
 * Format on the server and pass strings to client components: Node and
 * browsers can produce slightly different Intl output (spacing before
 * "AM"/"PM"), which would cause hydration mismatches.
 */
const TIME_ZONE = "America/Chicago";
const LOCALE = "en-US";

const fullDate = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const shortDate = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const time = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
});

const dayKey = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const parts = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  month: "short",
  day: "numeric",
  year: "numeric",
  weekday: "short",
});

/** Normalize the narrow no-break spaces some Intl versions emit. */
const clean = (value: string) => value.replace(/[  ]/g, " ");

function toDate(iso?: string): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "Saturday, October 25, 2026" */
export function formatLongDate(iso?: string): string | undefined {
  const date = toDate(iso);
  return date ? clean(fullDate.format(date)) : undefined;
}

/** "Sat, Oct 25, 2026" */
export function formatShortDate(iso?: string): string | undefined {
  const date = toDate(iso);
  return date ? clean(shortDate.format(date)) : undefined;
}

/**
 * "9:00 AM", "9:00 AM – 1:00 PM", or, for events spanning several days,
 * "9:00 AM – Sun, Oct 26, 2026, 1:00 PM".
 */
export function formatTimeRange(startIso?: string, endIso?: string): string | undefined {
  const start = toDate(startIso);
  if (!start) return undefined;

  const startTime = clean(time.format(start));
  const end = toDate(endIso);
  if (!end) return startTime;

  const endTime = clean(time.format(end));
  if (dayKey.format(start) === dayKey.format(end)) {
    return `${startTime} – ${endTime}`;
  }
  return `${startTime} – ${clean(shortDate.format(end))}, ${endTime}`;
}

export interface DateParts {
  month: string;
  day: string;
  year: string;
  weekday: string;
}

/** Calendar-badge pieces: { month: "OCT", day: "25", year: "2026", weekday: "Sat" } */
export function getDateParts(iso?: string): DateParts | undefined {
  const date = toDate(iso);
  if (!date) return undefined;

  const lookup = Object.fromEntries(
    parts.formatToParts(date).map((part) => [part.type, part.value]),
  );

  return {
    month: String(lookup.month ?? "").toUpperCase(),
    day: String(lookup.day ?? ""),
    year: String(lookup.year ?? ""),
    weekday: String(lookup.weekday ?? ""),
  };
}
