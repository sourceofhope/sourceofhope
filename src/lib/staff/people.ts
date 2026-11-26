import "server-only";
import { audit } from "@/lib/audit";
import { requirePermission } from "@/lib/auth/guard";
import { db } from "@/lib/db/client";
import { requireEnv } from "@/lib/env.server";
import { PERMISSION_KEYS, type PermissionKey } from "@/lib/permissions";

/*
 * People & Access operations (slice 2.2; the portal screens are 5.2). Each
 * one checks people.manage (which needs a second factor), changes the data,
 * and writes the audit log with before and after.
 */

const confirmUrl = () => new URL("/staff/auth/confirm", requireEnv("NEXT_PUBLIC_SITE_URL")).toString();

export class PeopleError extends Error {
  constructor(readonly code: "last_admin" | "already_staff" | "not_found" | "invite_failed") {
    super(code);
    this.name = "PeopleError";
  }
}

/** Invite someone: creates their auth user (email via our Send Email hook) and a staff row with the given toggles. */
export async function inviteStaff(input: { email: string; name: string; permissions: readonly PermissionKey[] }) {
  const { staff: actor } = await requirePermission("people.manage");
  const email = input.email.trim().toLowerCase();
  const { data: existing } = await db().from("staff_users").select("id").eq("email", email).maybeSingle();
  if (existing) throw new PeopleError("already_staff");

  const { data: invited, error } = await db().auth.admin.inviteUserByEmail(email, { redirectTo: confirmUrl() });
  if (error || !invited.user) throw new PeopleError("invite_failed");

  const { data: created, error: insertError } = await db()
    .from("staff_users")
    .insert({ auth_user_id: invited.user.id, email, name: input.name.trim() })
    .select("id")
    .single();
  if (insertError || !created) throw new PeopleError("invite_failed");

  const keys = input.permissions.filter((k) => PERMISSION_KEYS.includes(k));
  if (keys.length) {
    await db().from("staff_permissions").insert(keys.map((permission_key) => ({ staff_id: created.id, permission_key, granted_by: actor.id })));
  }
  await audit({ actorStaffId: actor.id, action: "staff.invite", targetType: "staff_user", targetId: created.id, after: { email, name: input.name, permissions: keys } });
  return created.id;
}

/** Replace someone's toggles. */
export async function setPermissions(staffId: string, permissions: readonly PermissionKey[]) {
  const { staff: actor } = await requirePermission("people.manage");
  const { data: before } = await db().from("staff_permissions").select("permission_key").eq("staff_id", staffId);
  const previous = (before ?? []).map((r) => r.permission_key).sort();
  const next = [...new Set(permissions.filter((k) => PERMISSION_KEYS.includes(k)))].sort();

  const removed = previous.filter((k) => !next.includes(k as PermissionKey));
  const added = next.filter((k) => !previous.includes(k));
  if (removed.length) await db().from("staff_permissions").delete().eq("staff_id", staffId).in("permission_key", removed);
  if (added.length) await db().from("staff_permissions").insert(added.map((permission_key) => ({ staff_id: staffId, permission_key, granted_by: actor.id })));

  await audit({ actorStaffId: actor.id, action: "staff.permissions.set", targetType: "staff_user", targetId: staffId, before: { permissions: previous }, after: { permissions: next } });
}

/** Grant or remove Admin. At least one active admin always remains. */
export async function setAdmin(staffId: string, isAdmin: boolean) {
  const { staff: actor } = await requirePermission("admin");
  if (!isAdmin) await assertAnotherActiveAdmin(staffId);
  await db().from("staff_users").update({ is_admin: isAdmin }).eq("id", staffId);
  await audit({ actorStaffId: actor.id, action: "staff.admin.set", targetType: "staff_user", targetId: staffId, before: { isAdmin: !isAdmin }, after: { isAdmin } });
}

/**
 * Deactivate: refused on the next request (the guard checks `active`), and
 * the auth user is banned so their session can't refresh.
 */
export async function deactivateStaff(staffId: string) {
  const { staff: actor } = await requirePermission("people.manage");
  const { data: target } = await db().from("staff_users").select("id, auth_user_id, active, is_admin").eq("id", staffId).maybeSingle();
  if (!target) throw new PeopleError("not_found");
  if (target.is_admin) await assertAnotherActiveAdmin(staffId);

  await db().from("staff_users").update({ active: false }).eq("id", staffId);
  if (target.auth_user_id) await db().auth.admin.updateUserById(target.auth_user_id, { ban_duration: "876000h" });
  await audit({ actorStaffId: actor.id, action: "staff.deactivate", targetType: "staff_user", targetId: staffId, before: { active: target.active }, after: { active: false } });
}

async function assertAnotherActiveAdmin(exceptId: string) {
  const { count } = await db().from("staff_users").select("id", { count: "exact", head: true }).eq("is_admin", true).eq("active", true).neq("id", exceptId);
  if (!count) throw new PeopleError("last_admin");
}
