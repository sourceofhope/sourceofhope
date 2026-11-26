import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { env } from "@/lib/env.server";
import { checkPermission, PermissionError, type Assurance, type PermissionKey, type Requirement, type StaffMember } from "@/lib/permissions";
import { authClient } from "./supabase-session";

export type StaffSession = { staff: StaffMember & { name: string; email: string }; assurance: Assurance; hasVerifiedFactor: boolean };

/**
 * The signed-in staff member, or null. Checked on every request: a user
 * deactivated in People & Access is refused on their next click, even
 * though their auth token hasn't expired yet. Cached per request.
 */
export const getStaffSession = cache(async (): Promise<StaffSession | null> => {
  // No Supabase configured (CI, a local build without the stack): nobody is signed in.
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = env();
  if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) return null;
  const auth = await authClient();
  // getUser() validates the token with Supabase Auth; never trust getSession() alone.
  const { data: userData } = await auth.auth.getUser();
  const user = userData.user;
  if (!user) return null;

  const { data: row } = await db()
    .from("staff_users")
    .select("id, email, name, active, is_admin, staff_permissions!staff_permissions_staff_id_fkey (permission_key)")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (!row) return null;

  const { data: aal } = await auth.auth.mfa.getAuthenticatorAssuranceLevel();
  const { data: factors } = await auth.auth.mfa.listFactors();
  return {
    staff: {
      id: row.id,
      email: row.email,
      name: row.name,
      active: row.active,
      isAdmin: row.is_admin,
      permissions: row.staff_permissions.map((p) => p.permission_key as PermissionKey),
    },
    assurance: aal?.currentLevel === "aal2" ? "aal2" : "aal1",
    hasVerifiedFactor: (factors?.totp ?? []).some((f) => f.status === "verified"),
  };
});

/**
 * The guard every server action, route handler and job that touches private
 * data calls first (02 §7). Throws PermissionError (401/403) when denied.
 */
export async function requirePermission(requirement: Requirement): Promise<StaffSession> {
  const session = await getStaffSession();
  const result = checkPermission(session?.staff ?? null, session?.assurance ?? null, requirement);
  if (!result.ok) throw new PermissionError(result.denial);
  return session!;
}

/** For pages: send signed-out or deactivated people to sign-in instead of throwing. */
export async function requireStaffPage(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (!session || !session.staff.active) redirect("/staff/sign-in");
  return session;
}

/** For pages behind a permission: redirect to sign-in, the second-factor step, or the overview. */
export async function requirePermissionPage(requirement: Requirement): Promise<StaffSession> {
  const session = await requireStaffPage();
  const result = checkPermission(session.staff, session.assurance, requirement);
  if (result.ok) return session;
  if (result.denial.reason === "second_factor_required") redirect(`/staff/security?next=${encodeURIComponent(`/staff`)}`);
  redirect("/staff?denied=1");
}
