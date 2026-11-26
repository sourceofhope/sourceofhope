/**
 * Staff permissions (02 §7). Individual toggles; new staff start with none.
 * Admin grants every current and future permission. Authority comes from
 * the toggles, never from role names.
 *
 * Pure checks live here so they're testable anywhere; the server guard that
 * loads the signed-in staff member is in src/lib/auth/guard.ts.
 */

export const PERMISSION_KEYS = [
  "events.manage",
  "events.publish",
  "volunteers.manage",
  "volunteers.contact",
  "rosters.export",
  "agreements.manage",
  "giving.view",
  "inquiries.manage",
  "store.manage",
  "content.edit",
  "reports.view",
  "people.manage",
  "integrations.manage",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];
/** What a check can ask for: a toggle, or admin itself. */
export type Requirement = PermissionKey | "admin";

/** These need a second factor (TOTP) in the current session, as does admin. */
export const SECOND_FACTOR_KEYS: readonly Requirement[] = ["people.manage", "integrations.manage", "admin"];

export type StaffMember = {
  id: string;
  active: boolean;
  isAdmin: boolean;
  permissions: readonly PermissionKey[];
};

/** The session's assurance level: aal2 means a second factor was used. */
export type Assurance = "aal1" | "aal2";

export const needsSecondFactor = (requirement: Requirement, staff: Pick<StaffMember, "isAdmin">) =>
  SECOND_FACTOR_KEYS.includes(requirement) || staff.isAdmin;

export function hasPermission(staff: StaffMember, requirement: Requirement): boolean {
  if (!staff.active) return false;
  if (staff.isAdmin) return true;
  return requirement !== "admin" && staff.permissions.includes(requirement);
}

export type Denial =
  | { status: 401; reason: "signed_out" }
  | { status: 403; reason: "inactive" }
  | { status: 403; reason: "missing_permission"; requirement: Requirement }
  | { status: 403; reason: "second_factor_required"; requirement: Requirement };

/**
 * Decide whether a request may go ahead. Admins always need a second factor,
 * because admin covers people.manage and integrations.manage.
 */
export function checkPermission(staff: StaffMember | null, assurance: Assurance | null, requirement: Requirement): { ok: true } | { ok: false; denial: Denial } {
  if (!staff) return { ok: false, denial: { status: 401, reason: "signed_out" } };
  if (!staff.active) return { ok: false, denial: { status: 403, reason: "inactive" } };
  if (!hasPermission(staff, requirement)) return { ok: false, denial: { status: 403, reason: "missing_permission", requirement } };
  if (needsSecondFactor(requirement, staff) && assurance !== "aal2") return { ok: false, denial: { status: 403, reason: "second_factor_required", requirement } };
  return { ok: true };
}

export class PermissionError extends Error {
  constructor(readonly denial: Denial) {
    super(`Permission denied: ${denial.reason}`);
    this.name = "PermissionError";
  }
  get status() {
    return this.denial.status;
  }
}
