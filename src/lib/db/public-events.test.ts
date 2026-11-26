import { describe, expect, it } from "vitest";
import { intervalToHours, toPublicEvent, type EventRow } from "./public-events";

const row: EventRow = {
  id: "e1",
  slug: "serving-hope-meal-service",
  status: "published",
  ownership: "tsoh",
  partner_name: null,
  partner_signup_url: null,
  program_key: "servingHope",
  starts_at: "2027-03-13T16:00:00+00:00",
  ends_at: "2027-03-13T19:00:00+00:00",
  timezone: "America/Chicago",
  venue_name: "The Source of Hope",
  address: "Plano, TX",
  hero_image_asset: null,
  open_to_public: true,
  need_categories: ["food"],
  languages: ["en", "es"],
  min_age: 10,
  accompany_under_age: 16,
  required_agreements: ["serving_hope_addendum"],
  cutoff_offset: "24:00:00",
  event_texts: [
    { locale: "en", title: "Meal service", summary: "A hot meal.", description: null, guest_who: "Anyone", guest_bring: null, guest_cost: "Free", accessibility: null, volunteer_expect: "Serve", volunteer_wear: null, machine_translated: false },
    { locale: "es", title: "Servicio de comida", summary: null, description: null, guest_who: null, guest_bring: null, guest_cost: null, accessibility: null, volunteer_expect: null, volunteer_wear: null, machine_translated: true },
  ],
  event_shifts: [
    { id: "s2", label: "Second", starts_at: "2027-03-13T17:00:00+00:00", ends_at: "2027-03-13T19:00:00+00:00", capacity: 10 },
    { id: "s1", label: "First", starts_at: "2027-03-13T15:00:00+00:00", ends_at: "2027-03-13T17:00:00+00:00", capacity: 10 },
  ],
};

describe("public event read model", () => {
  it("maps a two-sided event with shifts in time order", () => {
    const event = toPublicEvent(row)!;
    expect(event).toMatchObject({ slug: "serving-hope-meal-service", hasGuestInfo: true, hasVolunteerInfo: true, cutoffHours: 24 });
    expect(event.shifts.map((s) => s.id)).toEqual(["s1", "s2"]);
    expect(event.text.title).toBe("Meal service");
    expect(event).not.toHaveProperty("created_by");
    expect(event).not.toHaveProperty("status");
  });

  it("uses the requested locale and falls back to English", () => {
    expect(toPublicEvent(row, "es")!.text).toMatchObject({ title: "Servicio de comida", machineTranslated: true });
    expect(toPublicEvent(row, "fr")!.text.title).toBe("Meal service");
  });

  it("never returns a draft, cancelled or archived event", () => {
    for (const status of ["draft", "cancelled", "archived"]) expect(toPublicEvent({ ...row, status })).toBeNull();
  });

  it("guest-only, volunteer-only and partner events get the right sides", () => {
    expect(toPublicEvent({ ...row, event_shifts: [] })).toMatchObject({ hasGuestInfo: true, hasVolunteerInfo: false });
    expect(toPublicEvent({ ...row, open_to_public: false, need_categories: [] })).toMatchObject({ hasGuestInfo: false, hasVolunteerInfo: true });
    const partner = toPublicEvent({ ...row, ownership: "partner", partner_name: "Partner", partner_signup_url: "https://example.org" })!;
    expect(partner).toMatchObject({ partner: { name: "Partner", signupUrl: "https://example.org" }, hasVolunteerInfo: false, shifts: [] });
  });

  it("reads Postgres interval text", () => {
    expect(intervalToHours("24:00:00")).toBe(24);
    expect(intervalToHours("1 day 02:00:00")).toBe(26);
    expect(intervalToHours("2 days")).toBe(48);
    expect(intervalToHours("00:30:00")).toBe(0.5);
  });
});
