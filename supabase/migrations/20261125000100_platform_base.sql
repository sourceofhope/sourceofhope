-- Slice 2.1: platform base (02 §4 "Staff and platform", §7, §8).
--
-- Rules for every table in this project:
--   * id uuid primary key, created_at and updated_at (trigger-maintained);
--   * row level security enabled with NO policies for anon or authenticated;
--   * anon and authenticated have no table privileges at all (the browser
--     keys can't read or write anything); server code uses the service role
--     after checking permissions in the app (src/lib/permissions.ts).
-- Forward-only. Rollback note: drop the tables below in reverse order.

create extension if not exists pgcrypto with schema extensions;
create extension if not exists citext with schema extensions;

-- Nothing in public is reachable from the browser keys, now or later.
revoke all on schema public from anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke all on functions from anon, authenticated, public;

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Staff --------------------------------------------------------------------

create table public.staff_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users (id) on delete set null,
  email extensions.citext not null unique,
  name text not null,
  active boolean not null default true,
  is_admin boolean not null default false,
  last_sign_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The permission keys (02 §7). A check constraint keeps typos out.
create table public.staff_permissions (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff_users (id) on delete cascade,
  permission_key text not null check (permission_key in (
    'events.manage', 'events.publish', 'volunteers.manage', 'volunteers.contact', 'rosters.export',
    'agreements.manage', 'giving.view', 'inquiries.manage', 'store.manage', 'content.edit',
    'reports.view', 'people.manage', 'integrations.manage'
  )),
  granted_by uuid references public.staff_users (id) on delete set null,
  granted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (staff_id, permission_key)
);

-- Audit (append-only) ------------------------------------------------------

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_staff_id uuid references public.staff_users (id) on delete set null,
  actor_kind text not null default 'staff' check (actor_kind in ('staff', 'system')),
  action text not null,
  target_type text not null,
  target_id text,
  before jsonb,
  after jsonb,
  at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index audit_log_target_idx on public.audit_log (target_type, target_id, at desc);

create or replace function public.audit_log_is_append_only() returns trigger
language plpgsql as $$
begin
  raise exception 'audit_log is append-only';
end;
$$;

create trigger audit_log_no_update before update or delete on public.audit_log
  for each row execute function public.audit_log_is_append_only();
create trigger audit_log_no_truncate before truncate on public.audit_log
  for each statement execute function public.audit_log_is_append_only();

-- Integrations and jobs ----------------------------------------------------

-- The webhook ledger: dedupe by provider event id, record outcome, allow retry.
create table public.integration_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  external_event_id text not null,
  type text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  status text not null default 'received' check (status in ('received', 'processed', 'failed')),
  attempts integer not null default 1,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, external_event_id)
);

create table public.job_runs (
  id uuid primary key default gen_random_uuid(),
  job text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running' check (status in ('running', 'succeeded', 'failed')),
  summary jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index job_runs_job_idx on public.job_runs (job, started_at desc);

-- Machine translations are made once and reused (ADR-0004).
create table public.translation_cache (
  id uuid primary key default gen_random_uuid(),
  source_hash text not null,
  source_locale text not null,
  target_locale text not null,
  text text not null,
  provider text not null,
  glossary_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_hash, source_locale, target_locale, glossary_version)
);

-- Rate limits (spike 0.6 decision: Postgres is the shared store) ------------

create table public.rate_limits (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  window_start timestamptz not null,
  hits integer not null default 0,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (key, window_start)
);
create index rate_limits_expires_idx on public.rate_limits (expires_at);

-- One atomic upsert per request; returns the hit count for the window.
create or replace function public.rate_limit_hit(p_key text, p_window_start timestamptz, p_window_seconds integer)
returns integer
language sql
security invoker
set search_path = ''
as $$
  insert into public.rate_limits (key, window_start, hits, expires_at)
  values (p_key, p_window_start, 1, p_window_start + make_interval(secs => p_window_seconds))
  on conflict (key, window_start) do update set hits = public.rate_limits.hits + 1, updated_at = now()
  returning hits;
$$;

-- Ledger claim in one statement: insert, or bump attempts and return the row.
create or replace function public.webhook_claim(p_provider text, p_external_event_id text, p_type text)
returns table (status text, attempts integer, is_new boolean)
language sql
security invoker
set search_path = ''
as $$
  insert into public.integration_events as e (provider, external_event_id, type)
  values (p_provider, p_external_event_id, p_type)
  on conflict (provider, external_event_id) do update set attempts = e.attempts + 1, updated_at = now()
  returning e.status, e.attempts, (xmax = 0) as is_new;
$$;

-- updated_at triggers and RLS for every table above -------------------------

do $$
declare t text;
begin
  foreach t in array array['staff_users', 'staff_permissions', 'integration_events', 'job_runs', 'translation_cache', 'rate_limits'] loop
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_updated_at', t);
  end loop;
  foreach t in array array['staff_users', 'staff_permissions', 'audit_log', 'integration_events', 'job_runs', 'translation_cache', 'rate_limits'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end;
$$;

revoke execute on function public.rate_limit_hit(text, timestamptz, integer) from public, anon, authenticated;
revoke execute on function public.webhook_claim(text, text, text) from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.audit_log_is_append_only() from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, timestamptz, integer) to service_role;
grant execute on function public.webhook_claim(text, text, text) to service_role;
