-- Slice 2.3: events (02 §4 "Events"). Our system is the source of truth for
-- every TSOH event; partner events are listed but sign-up is theirs (ADR-0006).
-- Same rules as the base migration: RLS forced, no browser-key access.
-- Forward-only. Rollback note: drop campaign_links, event_publications,
-- event_shifts, event_texts, events.

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text not null default 'draft' check (status in ('draft', 'published', 'cancelled', 'archived')),
  ownership text not null default 'tsoh' check (ownership in ('tsoh', 'partner')),
  partner_name text,
  partner_signup_url text check (partner_signup_url is null or partner_signup_url ~ '^https://'),
  program_key text check (program_key in ('servingHope', 'educationHope', 'wellnessHope', 'outdoorHope', 'internationalHope')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'America/Chicago',
  venue_name text,
  address text,
  -- Sanity asset id plus crop/hotspot: { "asset": "image-…", "crop": {…}, "hotspot": {…}, "alt": "…" }
  hero_image_asset jsonb,
  open_to_public boolean not null default false,
  need_categories text[] not null default '{}',
  languages text[] not null default '{en}',
  min_age integer check (min_age is null or min_age between 0 and 100),
  accompany_under_age integer not null default 16 check (accompany_under_age between 0 and 21),
  required_agreements text[] not null default '{}' check (required_agreements <@ array['general', 'serving_hope_addendum']),
  cutoff_offset interval not null default interval '24 hours' check (cutoff_offset >= interval '0'),
  created_by uuid references public.staff_users (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_ends_after_start check (ends_at > starts_at),
  -- Partner events name the partner and link to their sign-up (02 §4).
  constraint events_partner_fields check (ownership = 'tsoh' or (partner_name is not null and partner_signup_url is not null)),
  constraint events_published_at check (status <> 'published' or published_at is not null)
);
create index events_public_idx on public.events (status, starts_at);
create index events_program_idx on public.events (program_key, starts_at);

-- `en` is the source; other locales are translated copies (ADR-0004).
create table public.event_texts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  locale text not null check (locale in ('en', 'es')),
  title text not null,
  summary text,
  description text,
  guest_who text,
  guest_bring text,
  guest_cost text,
  accessibility text,
  volunteer_expect text,
  volunteer_wear text,
  source_hash text,
  machine_translated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, locale)
);

create table public.event_shifts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  label text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null check (capacity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_shifts_ends_after_start check (ends_at > starts_at),
  -- Lets registration_shifts check a shift belongs to the registration's event.
  unique (id, event_id)
);
create index event_shifts_event_idx on public.event_shifts (event_id, starts_at);

-- Partner events have no shifts: sign-up isn't ours.
create or replace function public.event_shifts_tsoh_only() returns trigger
language plpgsql as $$
begin
  if (select ownership from public.events where id = new.event_id) = 'partner' then
    raise exception 'partner events have no shifts' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;
create trigger event_shifts_tsoh_only before insert or update on public.event_shifts
  for each row execute function public.event_shifts_tsoh_only();

create table public.event_publications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  platform text not null check (platform in ('website', 'eventbrite', 'facebook_packet')),
  status text not null default 'not_published' check (status in ('not_published', 'publishing', 'published', 'failed', 'manual_needed', 'needs_update')),
  external_id text,
  external_url text,
  last_published_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, platform)
);

create table public.campaign_links (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events (id) on delete set null,
  placement text not null check (placement in ('eventbrite', 'website', 'email', 'social', 'partner', 'print')),
  utm_source text not null,
  utm_medium text not null,
  utm_campaign text not null,
  utm_content text,
  url text not null,
  created_by uuid references public.staff_users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['events', 'event_texts', 'event_shifts', 'event_publications', 'campaign_links'] loop
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_updated_at', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end;
$$;
revoke execute on function public.event_shifts_tsoh_only() from public, anon, authenticated;
