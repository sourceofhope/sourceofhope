import "server-only";
import { getServices, eventImage } from "@/lib/content/loaders";
import type { ContentImage } from "@/lib/content/image";
import type { HelpService } from "@/content/services";
import { FALLBACK_PROGRAMS } from "@/content/programs";
import { db, isDatabaseConfigured } from "@/lib/db/client";
import { getEventBySlug, getUpcomingEvents } from "@/lib/db/events";
import type { PublicEvent } from "@/lib/db/public-events";
import type { HelpNeed } from "@/lib/hub-url";
import { createLogger } from "@/lib/platform/log";

/*
 * What the Hub shows, shaped for the browser (slices 4.2, 4.3). Public data
 * only: published events and content. Spots left are read fresh; everything
 * else comes from the cached event and content loaders.
 */

export type HubShift = { id: string; label: string; startsAt: string; endsAt: string; capacity: number; spotsLeft: number };

export type HubEvent = {
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  startsAt: string;
  endsAt: string;
  timezone: string;
  venueName: string | null;
  address: string | null;
  image: ContentImage;
  partner: { name: string; signupUrl: string } | null;
  hasGuestInfo: boolean;
  hasVolunteerInfo: boolean;
  languages: string[];
  minAge: number | null;
  accompanyUnderAge: number;
  requiredAgreements: string[];
  guest: { who: string | null; bring: string | null; cost: string | null; accessibility: string | null };
  volunteer: { expect: string | null; wear: string | null };
  shifts: HubShift[];
  /** Sign-up closes `cutoffHours` before the start (02 §5.4). */
  signupClosed: boolean;
};

export type HubEventSummary = Pick<HubEvent, "slug" | "title" | "summary" | "startsAt" | "endsAt" | "timezone" | "venueName" | "image" | "partner" | "hasGuestInfo" | "hasVolunteerInfo" | "signupClosed"> & {
  /** Total spots left across shifts; null for events without shifts. */
  spotsLeft: number | null;
};

export type HelpData = { services: HelpService[]; events: HubEventSummary[] };

const log = createLogger("hub.data");

async function spotsTaken(eventIds: string[]): Promise<Map<string, number>> {
  if (!eventIds.length || !isDatabaseConfigured()) return new Map();
  const { data, error } = await db().rpc("shift_spots_taken", { p_event_ids: eventIds });
  if (error) {
    // Better to show full capacity than no event at all; the sign-up re-checks on the server.
    log.error("spots query failed", { error: error.message });
    return new Map();
  }
  return new Map(data.map((row) => [row.shift_id, row.taken]));
}

function toHubEvent(event: PublicEvent, taken: Map<string, number>, now = Date.now()): HubEvent {
  return {
    slug: event.slug,
    title: event.text.title,
    summary: event.text.summary,
    description: event.text.description,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    timezone: event.timezone,
    venueName: event.venueName,
    address: event.address,
    image: eventImage(event),
    partner: event.partner,
    hasGuestInfo: event.hasGuestInfo,
    hasVolunteerInfo: event.hasVolunteerInfo,
    languages: event.languages,
    minAge: event.minAge,
    accompanyUnderAge: event.accompanyUnderAge,
    requiredAgreements: event.requiredAgreements,
    guest: { who: event.text.guestWho, bring: event.text.guestBring, cost: event.text.guestCost, accessibility: event.text.accessibility },
    volunteer: { expect: event.text.volunteerExpect, wear: event.text.volunteerWear },
    shifts: event.shifts.map((s) => ({ ...s, spotsLeft: Math.max(0, s.capacity - (taken.get(s.id) ?? 0)) })),
    signupClosed: new Date(event.startsAt).getTime() - event.cutoffHours * 3_600_000 <= now,
  };
}

function summarize(event: HubEvent): HubEventSummary {
  const { slug, title, summary, startsAt, endsAt, timezone, venueName, image, partner, hasGuestInfo, hasVolunteerInfo, signupClosed } = event;
  const spotsLeft = event.shifts.length ? event.shifts.reduce((sum, s) => sum + s.spotsLeft, 0) : null;
  return { slug, title, summary, startsAt, endsAt, timezone, venueName, image, partner, hasGuestInfo, hasVolunteerInfo, signupClosed, spotsLeft };
}

/** One published event for event details, or null. */
export async function getHubEvent(slug: string, locale = "en"): Promise<HubEvent | null> {
  const event = await getEventBySlug(slug, locale);
  if (!event) return null;
  return toHubEvent(event, await spotsTaken([event.id]));
}

/** Does an event serve this Get Help need? Its categories say so; an open event of the need's program counts too. */
export function servesNeed(event: Pick<PublicEvent, "hasGuestInfo" | "needCategories" | "openToPublic" | "programKey">, need: HelpNeed): boolean {
  if (!event.hasGuestInfo) return false;
  if (event.needCategories.includes(need)) return true;
  const program = FALLBACK_PROGRAMS.find((p) => p.key === event.programKey);
  return event.openToPublic && event.needCategories.length === 0 && program?.participantNeed === need;
}

/** Upcoming events that take volunteers, with spots left (the Volunteer door). */
export async function getVolunteerEvents(locale = "en"): Promise<HubEventSummary[]> {
  const events = (await getUpcomingEvents({ locale })).filter((e) => e.hasVolunteerInfo);
  const taken = await spotsTaken(events.map((e) => e.id));
  return events.map((e) => summarize(toHubEvent(e, taken)));
}

/** Services and upcoming guest events for one need (Get Help step 2). */
export async function getHelpData(need: HelpNeed, locale = "en"): Promise<HelpData> {
  const [services, events] = await Promise.all([getServices(locale), getUpcomingEvents({ locale })]);
  return {
    services: services.filter((s) => s.need === need),
    events: events.filter((e) => servesNeed(e, need)).map((e) => summarize(toHubEvent(e, new Map()))),
  };
}

/** One service by slug, for Get Help's detail step. */
export async function getHelpService(slug: string, locale = "en"): Promise<HelpService | null> {
  return (await getServices(locale)).find((s) => s.slug === slug) ?? null;
}
