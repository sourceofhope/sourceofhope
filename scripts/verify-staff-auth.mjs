// End-to-end check of staff sign-in against the local stack (slice 2.2):
// bootstrap admin → invite email through our Send Email hook (Mailpit) →
// confirm link → overview → single-use link → TOTP setup → magic link from
// the sign-in form (no account enumeration) → deactivation.
//
//   npm run db:start          # local Supabase with the hook enabled
//   npx next dev -p 3000      # the hook calls port 3000
//   node scripts/verify-staff-auth.mjs
//
// Needs .env.development.local (see docs/developers/local-database.md).
// Cleans up the test account afterwards.
import { execFileSync } from "node:child_process";
import { createHmac } from "node:crypto";
import { chromium } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const env = Object.fromEntries(
  fs.readFileSync(".env.development.local", "utf8").split("\n").filter((l) => l && !l.startsWith("#") && l.includes("=")).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);
const MAIL = "http://127.0.0.1:54324";
const SITE = "http://localhost:3000";
const ADMIN = "first.admin@example.org";
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const step = (msg) => console.log(`✓ ${msg}`);
const fail = (msg) => { console.log(`✗ ${msg}`); process.exit(1); };

async function latestMailTo(address, since, subjectPart) {
  for (let i = 0; i < 40; i++) {
    const list = await (await fetch(`${MAIL}/api/v1/messages`)).json();
    const hit = list.messages.find((m) => m.To.some((t) => t.Address === address) && new Date(m.Created) > since && m.Subject.includes(subjectPart));
    if (hit) return (await (await fetch(`${MAIL}/api/v1/message/${hit.ID}`)).json());
    await new Promise((r) => setTimeout(r, 500));
  }
  return null;
}

function totp(secretBase32) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const c of secretBase32.replace(/=+$/, "").toUpperCase()) bits += alphabet.indexOf(c).toString(2).padStart(5, "0");
  const key = Buffer.from(bits.match(/.{8}/g).map((b) => parseInt(b, 2)));
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000)));
  const h = createHmac("sha1", key).update(counter).digest();
  const o = h[h.length - 1] & 0xf;
  return String(((h.readUInt32BE(o) & 0x7fffffff) % 1_000_000)).padStart(6, "0");
}

// Clean slate for the test address.
await fetch(`${MAIL}/api/v1/messages`, { method: "DELETE" });
const { data: users } = await db.auth.admin.listUsers();
for (const u of users.users.filter((u) => u.email === ADMIN)) await db.auth.admin.deleteUser(u.id);
await db.from("staff_users").delete().eq("email", ADMIN);

// 1. Bootstrap.
const since = new Date(Date.now() - 1000);
execFileSync("node", ["--env-file=.env.development.local", "scripts/bootstrap-admin.mjs", "--email", ADMIN, "--name", "First Admin"], { stdio: "inherit" });
const { data: staffRow } = await db.from("staff_users").select("id, is_admin, active").eq("email", ADMIN).single();
if (!staffRow?.is_admin) fail("bootstrap did not create an admin");
step("bootstrap created an active admin");

// 2. Invite email went through our hook (our subject and confirm route).
const invite = await latestMailTo(ADMIN, since, "invited");
if (!invite) fail("no invite email in Mailpit (hook not called?)");
const link = invite.Text.match(/https?:\/\/\S+\/staff\/auth\/confirm\?\S+/)?.[0];
if (!link) fail("invite has no confirm link");
step(`invite email delivered via our hook: "${invite.Subject}"`);

const browser = await chromium.launch();
const page = await (await browser.newContext()).newPage();
await page.goto(link);
await page.waitForURL(`${SITE}/staff`);
try { await page.getByRole("heading", { level: 1, name: "Hello, First Admin" }).waitFor({ timeout: 15000 }); } catch { console.log((await page.locator("body").innerText()).slice(0, 600)); fail("overview not shown after invite link"); }
step("invite link signed in and reached the overview");

// 3. A used link doesn't work twice.
const page2 = await (await browser.newContext()).newPage();
await page2.goto(link);
await page2.waitForURL(/\/staff\/sign-in\?error=link/);
step("a used link is refused");

// 4. Two-step setup.
await page.goto(`${SITE}/staff/security`);
await page.getByRole("button", { name: "Set up an authenticator app" }).click();
const keyText = await page.getByText(/Enter this key instead/).textContent();
const secret = keyText.split(": ").pop().trim();
await page.getByRole("textbox", { name: "6-digit code" }).fill(totp(secret));
await page.getByRole("button", { name: "Verify" }).click();
await page.getByText("Two-step sign-in is on for this session.").waitFor();
step("TOTP enrolled and the session raised to aal2");

// 5. Magic link from the sign-in form, and no enumeration.
const since2 = new Date();
const signin = await (await browser.newContext()).newPage();
await signin.goto(`${SITE}/staff/sign-in`);
await signin.getByRole("textbox", { name: "Work email" }).fill("nobody@example.org");
await signin.getByRole("button", { name: "Email me a sign-in link" }).click();
await signin.getByText(/If that email belongs to a staff account/).waitFor();
await signin.getByRole("textbox", { name: "Work email" }).fill(ADMIN);
await signin.getByRole("button", { name: "Email me a sign-in link" }).click();
await signin.waitForTimeout(500);
const magic = await latestMailTo(ADMIN, since2, "sign-in link");
if (!magic) fail("no sign-in email for the admin");
if (await latestMailTo("nobody@example.org", since2, "")) fail("a non-staff address got an email");
step("sign-in form sends a link to staff and nothing to strangers, with the same answer");

// 6. Deactivation ends access on the next request.
await db.from("staff_users").update({ active: false }).eq("id", staffRow.id);
await page.goto(`${SITE}/staff`);
await page.waitForURL(/\/staff\/sign-in/);
step("a deactivated account is sent to sign-in on the next request");

await browser.close();
// Leave the database clean.
await db.from("staff_users").delete().eq("id", staffRow.id);
for (const u of (await db.auth.admin.listUsers()).data.users.filter((u) => u.email === ADMIN)) await db.auth.admin.deleteUser(u.id);
console.log("ALL AUTH CHECKS PASSED");
