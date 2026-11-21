# ADR-0005: PostgreSQL on Supabase for operational data and staff auth; Sanity stays editorial

- **Status:** Accepted (setup details pending spike 0.6)
- **Date:** 2026-11-21

## Context

Volunteer registrations, parties, agreement status, gifts, inquiries, orders, staff permissions and audit logs are private, relational and transactional. Sanity's `production` dataset answers unauthenticated queries for published content, which is right for editorial content and wrong for any of this. Staff need invite-only, passwordless sign-in with individual permission toggles.

## Decision

- **PostgreSQL on Supabase** for all operational data, with versioned migrations in `supabase/migrations/`.
- **Supabase Auth** for staff only:
  - invite-only magic links, with branded email via the Send Email Hook → Resend;
  - `@supabase/ssr` session cookies;
  - a TOTP second factor for `people.manage`, `integrations.manage` and `admin`.
- **Two walls:** every server handler calls `requirePermission`, *and* RLS denies anonymous and unpermitted access. Service credentials are server-only and never used for request-scoped reads where a scoped role works.
- **Sanity** remains the CMS for public editorial content. It never stores personal data.
- Volunteers and donors have **no accounts**. They use single-purpose emailed links ([02 §5.5](../02_SYSTEM_DESIGN.md#55-emailed-links-no-accounts)).

## Consequences

- One more managed service, with staging and production projects, backups and point-in-time recovery.
- Supabase-specific pieces (auth, cron) are isolated in `src/lib/auth/` and `src/lib/db/`, so a later move to plain Postgres stays possible.
- Spike 0.6 also decides the scheduler (Vercel Cron vs Supabase cron) and the shared rate-limit store.

## Spike result (0.6)

*To be filled in.*
