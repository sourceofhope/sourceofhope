import { describe, expect, it } from "vitest";
import {
  cascadeRemovals,
  covers,
  cutoffAt,
  dueForCutoff,
  earliestEighteenthBirthday,
  initialStatus,
  isMinor,
  linkExpiresAt,
  missingAgreements,
  REGISTRATION_STATUSES,
  requiredAgreements,
  transition,
  unaccompanied,
  validateParty,
  validUntil,
  youngestAgeOn,
  type Agreement,
  type PartyEvent,
  type PartyMember,
} from "./index";

const EVENT: PartyEvent = {
  startsAt: new Date("2027-03-13T16:00:00Z"), // Sat, Mar 13 2027, 11:00 a.m. CT
  timezone: "America/Chicago",
  minAge: null,
  accompanyUnderAge: 16,
};

let n = 0;
const member = (over: Partial<PartyMember>): PartyMember => ({
  key: `m${(n += 1)}`,
  firstName: `First${n}`,
  lastName: "Smith",
  email: `p${n}@example.com`,
  birthYear: null,
  shiftIds: ["s1"],
  isRegistrant: false,
  ...over,
});

describe("ages from a birth year", () => {
  it("uses the youngest age the person could be", () => {
    expect(youngestAgeOn(2011, EVENT.startsAt)).toBe(15);
    expect(youngestAgeOn(2011, new Date("2027-12-31T18:00:00Z"))).toBe(16);
  });

  it("the earliest 18th birthday is Jan 1, midnight Central", () => {
    expect(earliestEighteenthBirthday(2010).toISOString()).toBe("2028-01-01T06:00:00.000Z");
  });
});

describe("registration states", () => {
  it("every status is listed in the transition table", () => {
    for (const s of REGISTRATION_STATUSES) expect(() => transition(s, "cancelled", { kind: "system" })).not.toThrow();
  });

  it("starts incomplete for added members, then agreements or confirmed for the registrant", () => {
    expect(initialStatus({ confirmedByPerson: false, hasValidAgreements: true })).toBe("incomplete");
    expect(initialStatus({ confirmedByPerson: true, hasValidAgreements: false })).toBe("awaiting_agreement");
    expect(initialStatus({ confirmedByPerson: true, hasValidAgreements: true })).toBe("confirmed");
  });

  it.each([
    ["incomplete", "awaiting_agreement"],
    ["awaiting_agreement", "confirmed"],
    ["incomplete", "removed_at_cutoff"],
    ["awaiting_agreement", "removed_at_cutoff"],
    ["incomplete", "cancelled"],
    ["awaiting_agreement", "cancelled"],
    ["confirmed", "cancelled"],
    ["confirmed", "checked_in"],
    ["confirmed", "no_show"],
  ] as const)("allows %s → %s and records it", (from, to) => {
    const result = transition(from, to, { kind: "system" });
    expect(result).toEqual({ ok: true, entry: { fromStatus: from, toStatus: to, actor: { kind: "system" }, reason: null } });
  });

  it.each([
    ["incomplete", "confirmed"],
    ["cancelled", "confirmed"],
    ["checked_in", "cancelled"],
    ["no_show", "checked_in"],
    ["removed_at_cutoff", "cancelled"],
    ["confirmed", "awaiting_agreement"],
  ] as const)("refuses %s → %s", (from, to) => {
    expect(transition(from, to, { kind: "system" })).toEqual({ ok: false, error: { code: "not_allowed", from, to } });
  });

  it("restoring after the cutoff is a staff exception with a written reason", () => {
    expect(transition("removed_at_cutoff", "confirmed", { kind: "system" })).toMatchObject({ ok: false, error: { code: "staff_only" } });
    expect(transition("removed_at_cutoff", "confirmed", { kind: "staff", staffId: "st1" }, "  ")).toMatchObject({
      ok: false,
      error: { code: "reason_required" },
    });
    expect(transition("removed_at_cutoff", "confirmed", { kind: "staff", staffId: "st1" }, " Signed on paper ")).toMatchObject({
      ok: true,
      entry: { reason: "Signed on paper", actor: { kind: "staff", staffId: "st1" } },
    });
  });
});

describe("agreements", () => {
  const signed = new Date("2026-06-01T15:00:00Z");

  it("are valid for 12 months", () => {
    expect(validUntil(signed).toISOString()).toBe("2027-06-01T15:00:00.000Z");
  });

  it("for a minor, end when they could first turn 18 if that's sooner", () => {
    expect(validUntil(signed, 2009).toISOString()).toBe("2027-01-01T06:00:00.000Z");
    expect(validUntil(signed, 2012).toISOString()).toBe("2027-06-01T15:00:00.000Z");
  });

  it("an event needs the general agreement plus its addenda", () => {
    expect(requiredAgreements({ requiredAgreements: [] })).toEqual(["general"]);
    expect(requiredAgreements({ requiredAgreements: ["serving_hope_addendum", "general"] })).toEqual(["general", "serving_hope_addendum"]);
  });

  it("cover an event that starts on or before valid_until, only when completed", () => {
    const a: Agreement = { type: "general", status: "completed", completedAt: signed, validUntil: validUntil(signed) };
    expect(covers(a, new Date("2027-06-01T15:00:00Z"))).toBe(true);
    expect(covers(a, new Date("2027-06-01T15:00:01Z"))).toBe(false);
    expect(covers({ ...a, status: "sent" }, EVENT.startsAt)).toBe(false);
    expect(covers({ ...a, status: "voided" }, EVENT.startsAt)).toBe(false);
  });

  it("lists what's still missing for an event", () => {
    const general: Agreement = { type: "general", status: "completed", completedAt: signed, validUntil: validUntil(signed) };
    const event = { startsAt: EVENT.startsAt, requiredAgreements: ["serving_hope_addendum"] as const };
    expect(missingAgreements([], event)).toEqual(["general", "serving_hope_addendum"]);
    expect(missingAgreements([general], event)).toEqual(["serving_hope_addendum"]);
    expect(missingAgreements([general, { ...general, type: "serving_hope_addendum" }], event)).toEqual([]);
  });
});

describe("party rules", () => {
  it("a single adult registrant with a shift is fine", () => {
    expect(validateParty([member({ isRegistrant: true })], EVENT)).toEqual([]);
  });

  it("parties are 1 to 10 people", () => {
    expect(validateParty([], EVENT)).toContainEqual({ code: "party_too_small" });
    const eleven = Array.from({ length: 11 }, (_, i) => member({ isRegistrant: i === 0 }));
    expect(validateParty(eleven, EVENT)).toContainEqual({ code: "party_too_large", max: 10 });
    const ten = eleven.slice(0, 10);
    expect(validateParty(ten, EVENT)).toEqual([]);
  });

  it("needs a registrant, and every adult needs an email and every person a shift", () => {
    const adult = member({ email: " " });
    const noShift = member({ shiftIds: [] });
    const issues = validateParty([adult, noShift], EVENT);
    expect(issues).toContainEqual({ code: "no_registrant" });
    expect(issues).toContainEqual({ code: "adult_needs_email", key: adult.key });
    expect(issues).toContainEqual({ code: "needs_shift", key: noShift.key });
  });

  it("minors are signed for by the registrant or need a guardian email", () => {
    const parent = member({ isRegistrant: true });
    const signedFor = member({ birthYear: 2012, email: null, signedForByRegistrant: true });
    const friend = member({ birthYear: 2012, email: null });
    const friendWithGuardian = member({ birthYear: 2012, email: null, guardianEmail: "mom@example.com" });
    const issues = validateParty([parent, signedFor, friend, friendWithGuardian], EVENT);
    expect(issues).toEqual([{ code: "minor_needs_guardian", key: friend.key }]);
  });

  it("a minor registrant must give a guardian email and can't sign for others", () => {
    const teen = member({ isRegistrant: true, birthYear: 2010, email: "teen@example.com" });
    const sibling = member({ birthYear: 2010, email: null, signedForByRegistrant: true });
    const issues = validateParty([teen, sibling], EVENT);
    expect(issues).toContainEqual({ code: "registrant_minor_needs_guardian", key: teen.key });
    expect(issues).toContainEqual({ code: "minor_needs_guardian", key: sibling.key });
  });

  it("enforces the event's minimum age", () => {
    const kid = member({ birthYear: 2016, email: null, signedForByRegistrant: true });
    const issues = validateParty([member({ isRegistrant: true }), kid], { ...EVENT, minAge: 12 });
    expect(issues).toContainEqual({ code: "below_min_age", key: kid.key, minAge: 12 });
  });

  it("people under the accompaniment age need an adult on one of the same shifts", () => {
    const adult = member({ isRegistrant: true, shiftIds: ["s1"] });
    const kidSameShift = member({ birthYear: 2013, email: null, signedForByRegistrant: true, shiftIds: ["s1", "s2"] });
    const kidOtherShift = member({ birthYear: 2013, email: null, signedForByRegistrant: true, shiftIds: ["s2"] });
    const sixteenPlus = member({ birthYear: 2009, email: "older@example.com", guardianEmail: "g@example.com", shiftIds: ["s3"] });
    expect(unaccompanied([adult, kidSameShift, kidOtherShift, sixteenPlus], EVENT)).toEqual([kidOtherShift.key]);
    expect(validateParty([adult, kidOtherShift], EVENT)).toContainEqual({ code: "needs_accompaniment", key: kidOtherShift.key, underAge: 16 });
  });

  it("an older minor doesn't count as the accompanying adult", () => {
    const registrant = member({ isRegistrant: true, shiftIds: ["s9"] });
    const seventeen = member({ birthYear: 2009, email: "s@example.com", guardianEmail: "g@example.com", shiftIds: ["s1"] });
    const twelve = member({ birthYear: 2014, email: null, guardianEmail: "g@example.com", shiftIds: ["s1"] });
    expect(unaccompanied([registrant, seventeen, twelve], EVENT)).toEqual([twelve.key]);
  });

  it("flags the same person entered twice", () => {
    const a = member({ isRegistrant: true, firstName: "Ana", lastName: "Diaz", email: "ana@example.com" });
    const b = member({ firstName: " ana ", lastName: "DIAZ", email: "Ana@Example.com" });
    expect(validateParty([a, b], EVENT)).toContainEqual({ code: "duplicate_person", keys: [a.key, b.key] });
  });
});

describe("cascade", () => {
  it("removes minors whose only accompanying adult left, and nobody else", () => {
    const parent = member({ isRegistrant: true, shiftIds: ["s1"] });
    const otherAdult = member({ shiftIds: ["s2"] });
    const kid1 = member({ birthYear: 2015, email: null, signedForByRegistrant: true, shiftIds: ["s1"] });
    const kid2 = member({ birthYear: 2015, email: null, signedForByRegistrant: true, shiftIds: ["s2"] });
    expect(cascadeRemovals([parent, otherAdult, kid1, kid2], [parent.key], EVENT)).toEqual([kid1.key]);
    expect(cascadeRemovals([parent, otherAdult, kid1, kid2], [], EVENT)).toEqual([]);
  });
});

describe("cutoff and link expiry", () => {
  const event = { startsAt: EVENT.startsAt, endsAt: new Date("2027-03-13T19:00:00Z") };

  it("is 24 hours before the start by default", () => {
    expect(cutoffAt(event).toISOString()).toBe("2027-03-12T16:00:00.000Z");
    expect(cutoffAt({ ...event, cutoffOffsetHours: 48 }).toISOString()).toBe("2027-03-11T16:00:00.000Z");
  });

  it("removes only unfinished registrations, and only after the cutoff", () => {
    const regs = [
      { id: 1, status: "incomplete" as const },
      { id: 2, status: "awaiting_agreement" as const },
      { id: 3, status: "confirmed" as const },
      { id: 4, status: "cancelled" as const },
    ];
    expect(dueForCutoff(event, regs, new Date("2027-03-12T15:59:59Z"))).toEqual([]);
    expect(dueForCutoff(event, regs, new Date("2027-03-12T16:00:00Z")).map((r) => r.id)).toEqual([1, 2]);
  });

  it("sign-up links end at the cutoff, manage links at the event's end, subscription links after 7 days", () => {
    const issuedAt = new Date("2027-03-01T12:00:00Z");
    expect(linkExpiresAt("complete", { issuedAt, event })).toEqual(cutoffAt(event));
    expect(linkExpiresAt("guardian", { issuedAt, event })).toEqual(cutoffAt(event));
    expect(linkExpiresAt("manage", { issuedAt, event })).toEqual(event.endsAt);
    expect(linkExpiresAt("subscription_manage", { issuedAt }).toISOString()).toBe("2027-03-08T12:00:00.000Z");
    expect(() => linkExpiresAt("sign", { issuedAt })).toThrow();
  });

  it("isMinor follows the event date", () => {
    expect(isMinor({ birthYear: 2009 }, EVENT)).toBe(true);
    expect(isMinor({ birthYear: 2008 }, EVENT)).toBe(false);
    expect(isMinor({ birthYear: null }, EVENT)).toBe(false);
  });
});
