import { youngestAgeOn } from "./age";

/**
 * Party rules (02 §5.3). `validateParty` returns every problem at once so the
 * Hub can show them together; an empty list means the party can be saved.
 */

export const PARTY_MIN = 1;
export const PARTY_MAX = 10;
export const ADULT_AGE = 18;

export type PartyEvent = {
  startsAt: Date;
  timezone: string;
  minAge: number | null;
  /** People younger than this need an adult on one of their shifts (default 16). */
  accompanyUnderAge: number;
};

export type PartyMember = {
  /** Stable key within the party (a form row id or a person id). */
  key: string;
  firstName: string;
  lastName: string;
  email: string | null;
  /** Only collected for minors. Null means the person said they're an adult. */
  birthYear: number | null;
  shiftIds: readonly string[];
  isRegistrant: boolean;
  /** For a minor: the registrant ticked "I'm their parent or guardian". */
  signedForByRegistrant?: boolean;
  /** For a minor not signed for by the registrant. */
  guardianEmail?: string | null;
};

export type PartyIssue =
  | { code: "party_too_small" }
  | { code: "party_too_large"; max: number }
  | { code: "no_registrant" }
  | { code: "adult_needs_email"; key: string }
  | { code: "below_min_age"; key: string; minAge: number }
  | { code: "minor_needs_guardian"; key: string }
  | { code: "registrant_minor_needs_guardian"; key: string }
  | { code: "needs_shift"; key: string }
  | { code: "needs_accompaniment"; key: string; underAge: number }
  | { code: "duplicate_person"; keys: [string, string] };

export function isMinor(member: Pick<PartyMember, "birthYear">, event: Pick<PartyEvent, "startsAt" | "timezone">): boolean {
  return member.birthYear !== null && youngestAgeOn(member.birthYear, event.startsAt, event.timezone) < ADULT_AGE;
}

function ageOf(member: PartyMember, event: PartyEvent): number | null {
  return member.birthYear === null ? null : youngestAgeOn(member.birthYear, event.startsAt, event.timezone);
}

const norm = (value: string | null | undefined) => (value ?? "").trim().toLowerCase();

/**
 * People under the accompaniment age need an adult in the same party who is
 * registered for at least one of the same shifts. Returns the keys of
 * members who are not covered.
 */
export function unaccompanied(members: readonly PartyMember[], event: PartyEvent): string[] {
  const adults = members.filter((m) => !isMinor(m, event));
  return members
    .filter((m) => {
      const age = ageOf(m, event);
      return age !== null && age < event.accompanyUnderAge;
    })
    .filter((m) => !adults.some((a) => a.shiftIds.some((shift) => m.shiftIds.includes(shift))))
    .map((m) => m.key);
}

export function validateParty(members: readonly PartyMember[], event: PartyEvent): PartyIssue[] {
  const issues: PartyIssue[] = [];
  if (members.length < PARTY_MIN) issues.push({ code: "party_too_small" });
  if (members.length > PARTY_MAX) issues.push({ code: "party_too_large", max: PARTY_MAX });
  if (!members.some((m) => m.isRegistrant)) issues.push({ code: "no_registrant" });

  for (const m of members) {
    const minor = isMinor(m, event);
    const age = ageOf(m, event);
    if (m.shiftIds.length === 0) issues.push({ code: "needs_shift", key: m.key });
    if (event.minAge !== null && age !== null && age < event.minAge) issues.push({ code: "below_min_age", key: m.key, minAge: event.minAge });
    if (!minor && !norm(m.email)) issues.push({ code: "adult_needs_email", key: m.key });
    if (minor && m.isRegistrant && !norm(m.guardianEmail)) issues.push({ code: "registrant_minor_needs_guardian", key: m.key });
    if (minor && !m.isRegistrant && !m.signedForByRegistrant && !norm(m.guardianEmail)) issues.push({ code: "minor_needs_guardian", key: m.key });
  }

  // A minor registrant can't sign for anyone else; "signed for by registrant" needs an adult registrant.
  const registrant = members.find((m) => m.isRegistrant);
  if (registrant && isMinor(registrant, event)) {
    for (const m of members) {
      if (m.signedForByRegistrant && isMinor(m, event) && !norm(m.guardianEmail)) issues.push({ code: "minor_needs_guardian", key: m.key });
    }
  }

  for (const key of unaccompanied(members, event)) issues.push({ code: "needs_accompaniment", key, underAge: event.accompanyUnderAge });

  // One registration per person per event: same first + last name and same email (or both without email).
  for (let i = 0; i < members.length; i += 1) {
    for (let j = i + 1; j < members.length; j += 1) {
      const a = members[i];
      const b = members[j];
      if (norm(a.firstName) === norm(b.firstName) && norm(a.lastName) === norm(b.lastName) && norm(a.email) === norm(b.email)) {
        issues.push({ code: "duplicate_person", keys: [a.key, b.key] });
      }
    }
  }

  return dedupeIssues(issues);
}

function dedupeIssues(issues: PartyIssue[]): PartyIssue[] {
  const seen = new Set<string>();
  return issues.filter((issue) => {
    const id = JSON.stringify(issue);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

/**
 * The cascade (02 §5.3): when people leave a party (cancelled, or removed at
 * the cutoff), any minor who is no longer accompanied must leave too. Runs
 * until stable and returns the extra keys to remove, so the registrant can
 * be told why.
 */
export function cascadeRemovals(members: readonly PartyMember[], removedKeys: readonly string[], event: PartyEvent): string[] {
  const removed = new Set(removedKeys);
  const cascaded: string[] = [];
  for (;;) {
    const remaining = members.filter((m) => !removed.has(m.key));
    const orphaned = unaccompanied(remaining, event).filter((key) => !removed.has(key));
    if (orphaned.length === 0) return cascaded;
    for (const key of orphaned) {
      removed.add(key);
      cascaded.push(key);
    }
  }
}
