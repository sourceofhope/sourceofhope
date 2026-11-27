import { describe, expect, it } from "vitest";
import type { PublicEvent } from "@/lib/db/public-events";
import { applyFilter, eventJsonLd, groupByMonth, parseFilter } from "./event-list";

const event = (over: Partial<PublicEvent>): PublicEvent => ({
  id: "1",
  slug: "e",
  ownership: "tsoh",
  partner: null,
  programKey: null,
  startsAt: "2026-12-12T17:00:00.000Z",
  endsAt: "2026-12-12T20:00:00.000Z",
  timezone: "America/Chicago",
  venueName: "The Source of Hope",
  address: "Plano, TX",
  image: null,
  openToPublic: true,
  needCategories: [],
  languages: ["en"],
  minAge: null,
  accompanyUnderAge: 16,
  requiredAgreements: [],
  cutoffHours: 24,
  hasGuestInfo: true,
  hasVolunteerInfo: false,
  text: { locale: "en", title: "Meal service", summary: "Hot meals", description: null, guestWho: null, guestBring: null, guestCost: null, accessibility: null, volunteerExpect: null, volunteerWear: null, machineTranslated: false },
  shifts: [],
  ...over,
});

describe("events page helpers", () => {
  const guest = event({ id: "g" });
  const volunteer = event({ id: "v", hasGuestInfo: false, hasVolunteerInfo: true });
  const partner = event({ id: "p", ownership: "partner", partner: { name: "Partner", signupUrl: "https://example.org" } });

  it("filters by side and ownership, and ignores unknown filters", () => {
    expect(applyFilter([guest, volunteer, partner], "volunteer").map((e) => e.id)).toEqual(["v"]);
    expect(applyFilter([guest, volunteer, partner], "public").map((e) => e.id)).toEqual(["g", "p"]);
    expect(applyFilter([guest, volunteer, partner], "partner").map((e) => e.id)).toEqual(["p"]);
    expect(parseFilter("nope")).toBe("all");
    expect(parseFilter(["volunteer"])).toBe("all");
  });

  it("groups by month in Central time", () => {
    const lateNight = event({ id: "nye", startsAt: "2027-01-01T03:00:00.000Z" }); // Dec 31, 9 p.m. CT
    const groups = groupByMonth([guest, lateNight, event({ id: "jan", startsAt: "2027-01-09T17:00:00.000Z" })], "en-US");
    expect(groups.map((g) => [g.label, g.events.map((e) => e.id)])).toEqual([
      ["December 2026", ["g", "nye"]],
      ["January 2027", ["jan"]],
    ]);
  });

  it("builds schema.org Event data, with the partner as organizer for partner events", () => {
    const ld = eventJsonLd(guest, "https://thesourceofhope.org", "/v2/core/x.webp");
    expect(ld).toMatchObject({ "@type": "Event", name: "Meal service", startDate: guest.startsAt, isAccessibleForFree: true, image: ["https://thesourceofhope.org/v2/core/x.webp"] });
    expect(ld.url).toBe("https://thesourceofhope.org/events?event=e");
    expect(eventJsonLd(partner, "https://x.org", null).organizer).toEqual({ "@type": "Organization", name: "Partner", url: "https://example.org" });
  });
});
