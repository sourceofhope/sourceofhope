import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "./client";
import { toPublicEvent, type EventRow, type PublicEvent } from "./public-events";

/*
 * Published events for the public site, cached under the `events` tag.
 * Anything that changes an event (portal edits, publishing) calls
 * `revalidateTag(EVENTS_TAG)` so pages update within seconds.
 */

export const EVENTS_TAG = "events";

const SELECT = `
  id, slug, status, ownership, partner_name, partner_signup_url, program_key,
  starts_at, ends_at, timezone, venue_name, address, hero_image_asset,
  open_to_public, need_categories, languages, min_age, accompany_under_age,
  required_agreements, cutoff_offset,
  event_texts (locale, title, summary, description, guest_who, guest_bring, guest_cost,
               accessibility, volunteer_expect, volunteer_wear, machine_translated),
  event_shifts (id, label, starts_at, ends_at, capacity)
`;

async function queryUpcoming(locale: string, programKey: string | null, limit: number): Promise<PublicEvent[]> {
  let query = db().from("events").select(SELECT).eq("status", "published").gte("ends_at", new Date().toISOString()).order("starts_at").limit(limit);
  if (programKey) query = query.eq("program_key", programKey);
  const { data, error } = await query.returns<EventRow[]>();
  if (error) throw new Error(`events query failed: ${error.message}`);
  return data.map((row) => toPublicEvent(row, locale)).filter((e): e is PublicEvent => e !== null);
}

async function queryBySlug(slug: string, locale: string): Promise<PublicEvent | null> {
  const { data, error } = await db().from("events").select(SELECT).eq("slug", slug).eq("status", "published").maybeSingle<EventRow>();
  if (error) throw new Error(`event query failed: ${error.message}`);
  return data ? toPublicEvent(data, locale) : null;
}

/** Upcoming published events, soonest first. `programKey` filters to one program. */
export const getUpcomingEvents = unstable_cache(
  (options: { locale?: string; programKey?: string | null; limit?: number } = {}) =>
    queryUpcoming(options.locale ?? "en", options.programKey ?? null, options.limit ?? 50),
  ["events:upcoming"],
  { tags: [EVENTS_TAG], revalidate: 300 },
);

/** One published event by slug (the Hub's `?event=` and JSON-LD). */
export const getEventBySlug = unstable_cache((slug: string, locale = "en") => queryBySlug(slug, locale), ["events:by-slug"], {
  tags: [EVENTS_TAG],
  revalidate: 300,
});
