# 10 · Local database and staff sign-in

The relaunch keeps events, volunteers, giving records and staff accounts in Postgres on Supabase ([plan 02 §4](../plan/02_SYSTEM_DESIGN.md#4-data-model-postgresql)). Locally, the Supabase CLI runs the whole stack in Docker, so you can work without access to any hosted project.

## Start it

Docker Desktop must be running.

```bash
npm run db:start     # Postgres, Auth, REST and Mailpit (first run downloads images)
npm run db:reset     # rebuild from supabase/migrations and supabase/seed.sql
npm run db:test      # pgTAP tests in supabase/tests
npm run db:types     # regenerate src/lib/db/types.ts after a migration
npm run db:stop
```

Mailpit, the local inbox, is at http://127.0.0.1:54324. Every email Auth or the app sends locally lands there.

## Environment files (git-ignored)

**`supabase/.env`**, read by the CLI:

```
SUPABASE_AUTH_HOOK_SECRET=v1,whsec_<base64 of 32 random bytes>
```

**`.env.development.local`**, read by `next dev`. The Supabase keys are the CLI's public demo keys; `npx supabase status` prints them.

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY from supabase status>
SUPABASE_SERVICE_ROLE_KEY=<SERVICE_ROLE_KEY from supabase status>
SUPABASE_AUTH_HOOK_SECRET=<same value as supabase/.env>
MAILPIT_URL=http://127.0.0.1:54324
EMAIL_FROM=The Source of Hope <no-reply@localhost>
RESEND_API_KEY=
```

Leave `RESEND_API_KEY` blank locally. With it blank and `MAILPIT_URL` set, emails go to Mailpit instead of Resend, so a test never emails a real person.

## Staff sign-in, locally

Auth calls our Send Email hook (`/api/auth/send-email`) at `http://host.docker.internal:3000`, so run `next dev` on port 3000.

```bash
npx next dev -p 3000
node --env-file=.env.development.local scripts/bootstrap-admin.mjs --email you@example.org --name "Your Name"
```

Open the invite in Mailpit, follow the link, and you're signed in at `/staff`. To check the whole flow automatically (invite, single-use link, TOTP, magic link, deactivation), run `node scripts/verify-staff-auth.mjs`.

## Rules for migrations

- Forward-only, named `YYYYMMDDHHMMSS_description.sql`, each with a rollback note at the top.
- Every table: `id uuid`, `created_at`, `updated_at` (trigger), RLS enabled **and forced**, and `revoke all … from anon, authenticated`. `supabase/tests/00_lockdown.test.sql` checks every table from the catalog, so a table that misses this fails CI.
- Server code reads and writes through `src/lib/db/` with the service role, after `requirePermission` (`src/lib/auth/guard.ts`). The browser keys can't read any table.
- After a schema change, run `npm run db:types` and commit the result; CI fails if the types are stale.

## Decisions recorded here (spike 0.6)

- **Rate-limit store: Postgres** (`rate_limits` and `rate_limit_hit()`), not Upstash or Vercel KV. One atomic upsert per request, and no extra vendor.
- **Scheduler: Vercel Cron**, calling authenticated route handlers (`CRON_SECRET`).
- **Server data access: the service role** behind `server-only` modules and `requirePermission`, with RLS denying the browser roles everything. A narrower database role can replace it later without changing callers.
- **Staff email: the Send Email hook**, so Supabase never sends its own templates; everything goes through Resend with our layout.
