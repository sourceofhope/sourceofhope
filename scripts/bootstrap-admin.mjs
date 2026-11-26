// First-admin bootstrap (slice 2.2). Creates the first staff member as Admin
// and emails them an invite. Run once per environment:
//
//   node --env-file=.env.local scripts/bootstrap-admin.mjs --email you@thesourceofhope.org --name "Your Name"
//
// Needs NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SITE_URL.
// Safe to rerun: an existing staff member is made admin, not duplicated.
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";

const { values } = parseArgs({ options: { email: { type: "string" }, name: { type: "string" } } });
const email = values.email?.trim().toLowerCase();
const name = values.name?.trim();
if (!email || !name) {
  console.error('Usage: node scripts/bootstrap-admin.mjs --email you@example.org --name "Your Name"');
  process.exit(1);
}

for (const key of ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "NEXT_PUBLIC_SITE_URL"]) {
  if (!process.env[key]) {
    console.error(`Missing ${key}`);
    process.exit(1);
  }
}

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: existing } = await db.from("staff_users").select("id, is_admin").eq("email", email).maybeSingle();
if (existing) {
  if (!existing.is_admin) await db.from("staff_users").update({ is_admin: true, active: true }).eq("id", existing.id);
  await db.from("audit_log").insert({ actor_kind: "system", action: "staff.bootstrap_admin", target_type: "staff_user", target_id: existing.id, after: { isAdmin: true } });
  console.log("Already staff; made sure they're an active admin.");
  process.exit(0);
}

const redirectTo = new URL("/staff/auth/confirm", process.env.NEXT_PUBLIC_SITE_URL).toString();
const { data: invited, error } = await db.auth.admin.inviteUserByEmail(email, { redirectTo });
if (error || !invited?.user) {
  console.error(`Invite failed: ${error?.message ?? "no user returned"}`);
  process.exit(1);
}

const { data: staff, error: insertError } = await db
  .from("staff_users")
  .insert({ auth_user_id: invited.user.id, email, name, is_admin: true })
  .select("id")
  .single();
if (insertError) {
  console.error(`Couldn't create the staff row: ${insertError.message}`);
  process.exit(1);
}
await db.from("audit_log").insert({ actor_kind: "system", action: "staff.bootstrap_admin", target_type: "staff_user", target_id: staff.id, after: { email, name, isAdmin: true } });
console.log("Admin created and invite sent. They'll set up two-step sign-in on first use of admin tools.");
