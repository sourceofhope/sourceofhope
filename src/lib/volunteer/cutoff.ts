import type { RegistrationStatus } from "./registration";

/**
 * The sign-up cutoff (02 §5.4): `starts_at − cutoff_offset`, 24 hours by
 * default. After it, unfinished registrations are removed (never deleted).
 */

export const DEFAULT_CUTOFF_HOURS = 24;

export function cutoffAt(event: { startsAt: Date; cutoffOffsetHours?: number | null }): Date {
  const hours = event.cutoffOffsetHours ?? DEFAULT_CUTOFF_HOURS;
  return new Date(event.startsAt.getTime() - hours * 60 * 60 * 1000);
}

export const isPastCutoff = (event: { startsAt: Date; cutoffOffsetHours?: number | null }, now: Date) => now >= cutoffAt(event);

/** Statuses the cutoff job removes. */
export const REMOVED_AT_CUTOFF_FROM: readonly RegistrationStatus[] = ["incomplete", "awaiting_agreement"];

/** Which registrations the cutoff job should remove for an event, given the time. */
export function dueForCutoff<T extends { status: RegistrationStatus }>(
  event: { startsAt: Date; cutoffOffsetHours?: number | null },
  registrations: readonly T[],
  now: Date,
): T[] {
  if (!isPastCutoff(event, now)) return [];
  return registrations.filter((r) => REMOVED_AT_CUTOFF_FROM.includes(r.status));
}

/**
 * When an emailed link stops working (02 §5.5). Sign-up links end at the
 * cutoff, `manage` at the event's end, `subscription_manage` after 7 days.
 */
export type LinkPurpose = "complete" | "guardian" | "manage" | "finish" | "sign" | "subscription_manage";

export function linkExpiresAt(
  purpose: LinkPurpose,
  context: { issuedAt: Date; event?: { startsAt: Date; endsAt: Date; cutoffOffsetHours?: number | null } },
): Date {
  if (purpose === "subscription_manage") return new Date(context.issuedAt.getTime() + 7 * 24 * 60 * 60 * 1000);
  if (!context.event) throw new Error(`A ${purpose} link needs its event`);
  return purpose === "manage" ? context.event.endsAt : cutoffAt(context.event);
}
