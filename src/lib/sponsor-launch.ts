/**
 * Thanksgiving 2026 launch of Community Sponsors on /members. Sponsors who
 * join before the deadline are recognized as Founding Sponsors. The launch
 * messaging hides itself once the deadline passes (the page revalidates hourly).
 */

/** End of Giving Tuesday, December 1, 2026, in Central time. */
export const FOUNDING_SPONSOR_DEADLINE = new Date("2026-12-02T06:00:00Z");

export const FOUNDING_SPONSOR_DEADLINE_LABEL = "Giving Tuesday, December 1";

export function isFoundingSponsorWindowOpen(now: Date = new Date()): boolean {
  return now < FOUNDING_SPONSOR_DEADLINE;
}
