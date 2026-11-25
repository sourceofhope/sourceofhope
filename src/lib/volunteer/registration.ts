/**
 * Volunteer registration states (02 §5.1). Pure: the database layer calls
 * these to decide and record transitions; nothing here touches storage.
 */

export const REGISTRATION_STATUSES = [
  "incomplete",
  "awaiting_agreement",
  "confirmed",
  "removed_at_cutoff",
  "cancelled",
  "checked_in",
  "no_show",
] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

/** Who caused a transition. Staff ids are recorded for audit; `self` is the volunteer or their registrant. */
export type Actor = { kind: "system" } | { kind: "self" } | { kind: "staff"; staffId: string };

const TRANSITIONS: Record<RegistrationStatus, readonly RegistrationStatus[]> = {
  incomplete: ["awaiting_agreement", "removed_at_cutoff", "cancelled"],
  awaiting_agreement: ["confirmed", "removed_at_cutoff", "cancelled"],
  confirmed: ["cancelled", "checked_in", "no_show"],
  removed_at_cutoff: ["confirmed"],
  cancelled: [],
  checked_in: [],
  no_show: [],
};

/** Statuses that still hold a place on the roster. */
export const ACTIVE_STATUSES: readonly RegistrationStatus[] = ["incomplete", "awaiting_agreement", "confirmed", "checked_in"];

export const isActive = (status: RegistrationStatus) => ACTIVE_STATUSES.includes(status);

/**
 * The status a new registration starts in. People added to a party (or
 * imported from Eventbrite) must confirm their own details first; the
 * registrant goes straight to agreements, or to confirmed when every
 * required agreement is already on file.
 */
export function initialStatus({ confirmedByPerson, hasValidAgreements }: { confirmedByPerson: boolean; hasValidAgreements: boolean }): RegistrationStatus {
  if (!confirmedByPerson) return "incomplete";
  return hasValidAgreements ? "confirmed" : "awaiting_agreement";
}

export type TransitionError =
  | { code: "not_allowed"; from: RegistrationStatus; to: RegistrationStatus }
  | { code: "staff_only" }
  | { code: "reason_required" };

export type HistoryEntry = {
  fromStatus: RegistrationStatus;
  toStatus: RegistrationStatus;
  actor: Actor;
  reason: string | null;
};

/**
 * Check a transition and return the history row to write (every transition
 * writes one, §5.1). Restoring someone removed at the cutoff is a staff
 * exception and needs a written reason (§5.4).
 */
export function transition(
  from: RegistrationStatus,
  to: RegistrationStatus,
  actor: Actor,
  reason?: string,
): { ok: true; entry: HistoryEntry } | { ok: false; error: TransitionError } {
  if (!TRANSITIONS[from].includes(to)) return { ok: false, error: { code: "not_allowed", from, to } };
  const trimmed = reason?.trim() || null;
  if (from === "removed_at_cutoff") {
    if (actor.kind !== "staff") return { ok: false, error: { code: "staff_only" } };
    if (!trimmed) return { ok: false, error: { code: "reason_required" } };
  }
  return { ok: true, entry: { fromStatus: from, toStatus: to, actor, reason: trimmed } };
}

export const canTransition = (from: RegistrationStatus, to: RegistrationStatus) => TRANSITIONS[from].includes(to);
