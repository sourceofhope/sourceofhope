/**
 * The public read model for events (slice 2.3): what the website, the Hub
 * and schema.org JSON-LD may show. Published events only, no internal
 * fields (created_by, publication status, cutoff internals). Pure mapping
 * here; the query lives in events.ts so this file is testable anywhere.
 */

export type PublicShift = { id: string; label: string; startsAt: string; endsAt: string; capacity: number };

export type PublicEvent = {
  id: string;
  slug: string;
  ownership: "tsoh" | "partner";
  partner: { name: string; signupUrl: string } | null;
  programKey: string | null;
  startsAt: string;
  endsAt: string;
  timezone: string;
  venueName: string | null;
  address: string | null;
  image: unknown;
  openToPublic: boolean;
  needCategories: string[];
  languages: string[];
  minAge: number | null;
  accompanyUnderAge: number;
  requiredAgreements: string[];
  /** Hours before the start when sign-up closes. */
  cutoffHours: number;
  /** "has guest info" and "has volunteer info" (02 §4) decide which sides the details show. */
  hasGuestInfo: boolean;
  hasVolunteerInfo: boolean;
  text: {
    locale: string;
    title: string;
    summary: string | null;
    description: string | null;
    guestWho: string | null;
    guestBring: string | null;
    guestCost: string | null;
    accessibility: string | null;
    volunteerExpect: string | null;
    volunteerWear: string | null;
    machineTranslated: boolean;
  };
  shifts: PublicShift[];
};

export type EventRow = {
  id: string;
  slug: string;
  status: string;
  ownership: string;
  partner_name: string | null;
  partner_signup_url: string | null;
  program_key: string | null;
  starts_at: string;
  ends_at: string;
  timezone: string;
  venue_name: string | null;
  address: string | null;
  hero_image_asset: unknown;
  open_to_public: boolean;
  need_categories: string[];
  languages: string[];
  min_age: number | null;
  accompany_under_age: number;
  required_agreements: string[];
  cutoff_offset: string;
  event_texts: {
    locale: string;
    title: string;
    summary: string | null;
    description: string | null;
    guest_who: string | null;
    guest_bring: string | null;
    guest_cost: string | null;
    accessibility: string | null;
    volunteer_expect: string | null;
    volunteer_wear: string | null;
    machine_translated: boolean;
  }[];
  event_shifts: { id: string; label: string; starts_at: string; ends_at: string; capacity: number }[];
};

/** Postgres renders intervals like "24:00:00" or "1 day 02:00:00". */
export function intervalToHours(value: string): number {
  const days = /(-?\d+) days?/.exec(value);
  const time = /(-?\d+):(\d{2}):(\d{2})/.exec(value);
  const fromDays = days ? Number(days[1]) * 24 : 0;
  const fromTime = time ? Number(time[1]) + Number(time[2]) / 60 + Number(time[3]) / 3600 : 0;
  return fromDays + fromTime;
}

/**
 * Map a row to the public shape, in the requested locale with English as
 * the fallback (English is the source, ADR-0004). Returns null for anything
 * that isn't published, so a caller can't leak a draft by mistake.
 */
export function toPublicEvent(row: EventRow, locale = "en"): PublicEvent | null {
  if (row.status !== "published") return null;
  const text = row.event_texts.find((t) => t.locale === locale) ?? row.event_texts.find((t) => t.locale === "en");
  if (!text) return null;
  const partner = row.ownership === "partner" && row.partner_name && row.partner_signup_url ? { name: row.partner_name, signupUrl: row.partner_signup_url } : null;
  const shifts = row.ownership === "partner" ? [] : [...row.event_shifts].sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  return {
    id: row.id,
    slug: row.slug,
    ownership: row.ownership === "partner" ? "partner" : "tsoh",
    partner,
    programKey: row.program_key,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    timezone: row.timezone,
    venueName: row.venue_name,
    address: row.address,
    image: row.hero_image_asset,
    openToPublic: row.open_to_public,
    needCategories: row.need_categories,
    languages: row.languages,
    minAge: row.min_age,
    accompanyUnderAge: row.accompany_under_age,
    requiredAgreements: row.required_agreements,
    cutoffHours: intervalToHours(row.cutoff_offset),
    hasGuestInfo: row.open_to_public || row.need_categories.length > 0,
    hasVolunteerInfo: shifts.length > 0,
    text: {
      locale: text.locale,
      title: text.title,
      summary: text.summary,
      description: text.description,
      guestWho: text.guest_who,
      guestBring: text.guest_bring,
      guestCost: text.guest_cost,
      accessibility: text.accessibility,
      volunteerExpect: text.volunteer_expect,
      volunteerWear: text.volunteer_wear,
      machineTranslated: text.machine_translated,
    },
    shifts: shifts.map((s) => ({ id: s.id, label: s.label, startsAt: s.starts_at, endsAt: s.ends_at, capacity: s.capacity })),
  };
}
