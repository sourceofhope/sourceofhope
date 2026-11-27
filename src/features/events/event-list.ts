import type { PublicEvent } from "@/lib/db/public-events";

/** Pure helpers for the Events page (spec §10.4): filters, month groups and schema.org data. */

export const EVENT_FILTERS = ["all", "volunteer", "public", "partner"] as const;
export type EventFilter = (typeof EVENT_FILTERS)[number];

export const parseFilter = (value: string | string[] | undefined): EventFilter =>
  typeof value === "string" && (EVENT_FILTERS as readonly string[]).includes(value) ? (value as EventFilter) : "all";

export function applyFilter(events: readonly PublicEvent[], filter: EventFilter): PublicEvent[] {
  switch (filter) {
    case "volunteer":
      return events.filter((e) => e.hasVolunteerInfo);
    case "public":
      return events.filter((e) => e.hasGuestInfo);
    case "partner":
      return events.filter((e) => e.ownership === "partner");
    default:
      return [...events];
  }
}

/** Group events by calendar month in Central time, in order. */
export function groupByMonth(events: readonly PublicEvent[], locale: string): { key: string; label: string; events: PublicEvent[] }[] {
  const key = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", timeZone: "America/Chicago" });
  const label = new Intl.DateTimeFormat(locale === "en-XA" ? "en-US" : locale, { month: "long", year: "numeric", timeZone: "America/Chicago" });
  const groups = new Map<string, { key: string; label: string; events: PublicEvent[] }>();
  for (const event of events) {
    const date = new Date(event.startsAt);
    const k = key.format(date);
    if (!groups.has(k)) groups.set(k, { key: k, label: label.format(date), events: [] });
    groups.get(k)!.events.push(event);
  }
  return [...groups.values()];
}

/**
 * schema.org Event for Google's event results (spec §10.4). Free, in person,
 * organized by TSOH or the partner. `url` opens the event's details.
 */
export function eventJsonLd(event: PublicEvent, siteUrl: string, image: string | null) {
  const organizer =
    event.ownership === "partner" && event.partner
      ? { "@type": "Organization", name: event.partner.name, url: event.partner.signupUrl }
      : { "@type": "Organization", name: "The Source of Hope", url: siteUrl };
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.text.title,
    description: event.text.summary ?? undefined,
    startDate: event.startsAt,
    endDate: event.endsAt,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    location: { "@type": "Place", name: event.venueName ?? "The Source of Hope", address: event.address ?? undefined },
    image: image ? [image.startsWith("http") ? image : `${siteUrl}${image}`] : undefined,
    organizer,
    url: `${siteUrl}/events?event=${encodeURIComponent(event.slug)}`,
  };
}
