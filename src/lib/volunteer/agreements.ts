import { earliestEighteenthBirthday } from "./age";

/**
 * Volunteer agreement policy (02 §5.2, §5.4). Pure functions over plain
 * records; the database and DocuSign layers supply the data.
 */

export const AGREEMENT_TYPES = ["general", "serving_hope_addendum"] as const;
export type AgreementType = (typeof AGREEMENT_TYPES)[number];

export const AGREEMENT_STATUSES = ["sent", "delivered", "completed", "declined", "voided"] as const;
export type AgreementStatus = (typeof AGREEMENT_STATUSES)[number];

export const AGREEMENT_VALIDITY_MONTHS = 12;

export type Agreement = {
  type: AgreementType;
  status: AgreementStatus;
  completedAt: Date | null;
  validUntil: Date | null;
};

function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

/**
 * When a completed agreement stops covering events: 12 months after it was
 * signed, or for a minor the moment they could first turn 18, whichever is
 * sooner.
 */
export function validUntil(completedAt: Date, subjectBirthYear?: number | null): Date {
  const twelveMonths = addMonths(completedAt, AGREEMENT_VALIDITY_MONTHS);
  if (subjectBirthYear == null) return twelveMonths;
  const adult = earliestEighteenthBirthday(subjectBirthYear);
  return adult < twelveMonths ? adult : twelveMonths;
}

/** The agreements an event needs: the general one, plus any addenda it lists. */
export function requiredAgreements(event: { requiredAgreements: readonly AgreementType[] }): AgreementType[] {
  return Array.from(new Set<AgreementType>(["general", ...event.requiredAgreements]));
}

/** An agreement covers an event if it's completed and still valid when the event starts. */
export function covers(agreement: Agreement, eventStartsAt: Date): boolean {
  return agreement.status === "completed" && agreement.validUntil !== null && eventStartsAt <= agreement.validUntil;
}

/** Which required agreements a person still needs for an event. Empty means they're covered. */
export function missingAgreements(
  agreements: readonly Agreement[],
  event: { startsAt: Date; requiredAgreements: readonly AgreementType[] },
): AgreementType[] {
  return requiredAgreements(event).filter((type) => !agreements.some((a) => a.type === type && covers(a, event.startsAt)));
}
