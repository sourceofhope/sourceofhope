-- Slice 2.4: volunteers, giving and store (02 §4, §5). The rules themselves
-- live in src/lib/volunteer/; the database enforces the invariants that must
-- never break whatever code runs: party size, one registration per person
-- per event, shifts belonging to the registration's event.
-- No card, bank or PayPal account data is ever stored. No inventory counts.
-- Forward-only. Rollback note: drop these tables in reverse order.

-- Volunteers ----------------------------------------------------------------

create table public.people (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  -- Not unique: families share addresses (02 §4).
  email extensions.citext,
  phone text,
  -- Minors only (02 §8.2); adults leave it empty.
  birth_year integer check (birth_year is null or birth_year between 1900 and 2100),
  preferred_locale text not null default 'en',
  last_activity_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index people_email_idx on public.people (email);
create index people_name_idx on public.people (lower(first_name), lower(last_name));

create table public.volunteer_parties (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete restrict,
  registrant_person_id uuid not null references public.people (id) on delete restrict,
  source text not null default 'hub' check (source in ('hub', 'eventbrite_intake')),
  eventbrite_order_id text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  landing_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, event_id)
);
create unique index volunteer_parties_eventbrite_order_idx on public.volunteer_parties (eventbrite_order_id) where eventbrite_order_id is not null;

create table public.volunteer_registrations (
  id uuid primary key default gen_random_uuid(),
  party_id uuid not null,
  event_id uuid not null references public.events (id) on delete restrict,
  person_id uuid not null references public.people (id) on delete restrict,
  status text not null check (status in ('incomplete', 'awaiting_agreement', 'confirmed', 'removed_at_cutoff', 'cancelled', 'checked_in', 'no_show')),
  is_minor boolean not null default false,
  guardian_person_id uuid references public.people (id) on delete restrict,
  photo_consent boolean,
  eventbrite_attendee_id text,
  exception_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- The registration belongs to the party's event.
  foreign key (party_id, event_id) references public.volunteer_parties (id, event_id) on delete cascade,
  -- One registration per person per event (02 §5.3). Re-joining reuses the row.
  unique (event_id, person_id),
  unique (id, event_id),
  constraint volunteer_registrations_minor_guardian check (not is_minor or guardian_person_id is not null)
);
create index volunteer_registrations_party_idx on public.volunteer_registrations (party_id);
create index volunteer_registrations_status_idx on public.volunteer_registrations (event_id, status);

-- Parties hold 1–10 people who still have a place (02 §5.3).
create or replace function public.volunteer_party_size_limit() returns trigger
language plpgsql as $$
declare active_count integer;
begin
  if new.status not in ('incomplete', 'awaiting_agreement', 'confirmed', 'checked_in') then
    return new;
  end if;
  select count(*) into active_count from public.volunteer_registrations
    where party_id = new.party_id and id <> new.id
      and status in ('incomplete', 'awaiting_agreement', 'confirmed', 'checked_in');
  if active_count >= 10 then
    raise exception 'a volunteer party holds at most 10 people' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;
create trigger volunteer_party_size_limit before insert or update of status, party_id on public.volunteer_registrations
  for each row execute function public.volunteer_party_size_limit();

create table public.registration_shifts (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null,
  shift_id uuid not null,
  event_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Both sides belong to the same event.
  foreign key (registration_id, event_id) references public.volunteer_registrations (id, event_id) on delete cascade,
  foreign key (shift_id, event_id) references public.event_shifts (id, event_id) on delete restrict,
  unique (registration_id, shift_id)
);
create index registration_shifts_shift_idx on public.registration_shifts (shift_id);

create table public.registration_status_history (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.volunteer_registrations (id) on delete cascade,
  from_status text,
  to_status text not null,
  actor_kind text not null check (actor_kind in ('system', 'staff', 'self')),
  actor_staff_id uuid references public.staff_users (id) on delete set null,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint registration_history_staff_actor check (actor_kind <> 'staff' or actor_staff_id is not null)
);
create index registration_status_history_reg_idx on public.registration_status_history (registration_id, created_at);

create table public.agreements (
  id uuid primary key default gen_random_uuid(),
  subject_person_id uuid not null references public.people (id) on delete restrict,
  signer_person_id uuid not null references public.people (id) on delete restrict,
  type text not null check (type in ('general', 'serving_hope_addendum')),
  template_id text not null,
  template_version text not null,
  locale text not null default 'en',
  envelope_id text,
  status text not null default 'sent' check (status in ('sent', 'delivered', 'completed', 'declined', 'voided')),
  sent_at timestamptz,
  completed_at timestamptz,
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agreements_completed_fields check (status <> 'completed' or (completed_at is not null and valid_until is not null))
);
create index agreements_subject_idx on public.agreements (subject_person_id, type, status);
create index agreements_envelope_idx on public.agreements (envelope_id);

create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null unique references public.volunteer_registrations (id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  checked_in_by uuid references public.staff_users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Emailed links (02 §5.5): only a SHA-256 hash of the token is stored.
create table public.link_tokens (
  id uuid primary key default gen_random_uuid(),
  purpose text not null check (purpose in ('complete', 'guardian', 'manage', 'finish', 'sign', 'subscription_manage')),
  subject_type text not null,
  subject_id uuid not null,
  token_hash text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  expires_at timestamptz not null,
  used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index link_tokens_subject_idx on public.link_tokens (subject_type, subject_id, purpose);

create table public.intake_review (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('eventbrite_intake', 'hub')),
  external_ref text,
  candidate_person_ids uuid[] not null default '{}',
  status text not null default 'open' check (status in ('open', 'merged', 'kept_separate')),
  resolved_by uuid references public.staff_users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Giving and inquiries -------------------------------------------------------

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('stripe', 'paypal')),
  provider_ref text not null,
  -- Opaque, for ?ref= status lookups; never a provider id (02 §8.1).
  public_ref text not null unique default encode(extensions.gen_random_bytes(16), 'hex'),
  kind text not null check (kind in ('gift', 'subscription_invoice', 'sponsor_invoice', 'store_order')),
  amount_cents integer not null check (amount_cents >= 0),
  fee_covered_cents integer not null default 0 check (fee_covered_cents >= 0),
  designation text,
  tribute_type text check (tribute_type in ('honor', 'memory')),
  tribute_name text,
  person_id uuid references public.people (id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed', 'refunded', 'partially_refunded')),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_ref),
  constraint payments_tribute check ((tribute_type is null) = (tribute_name is null))
);
create index payments_person_idx on public.payments (person_id);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('stripe', 'paypal')),
  provider_ref text not null,
  person_id uuid references public.people (id) on delete set null,
  kind text not null check (kind in ('monthly_gift', 'business_sponsor')),
  amount_cents integer not null check (amount_cents > 0),
  tier_key text,
  business_name text,
  logo_listing_consent boolean not null default false,
  status text not null default 'incomplete' check (status in ('incomplete', 'active', 'past_due', 'canceled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_ref),
  constraint subscriptions_business check (kind <> 'business_sponsor' or (business_name is not null and tier_key is not null))
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('planned_giving', 'business_sponsor')),
  person_id uuid references public.people (id) on delete set null,
  preferred_contact text check (preferred_contact in ('email', 'phone')),
  message text,
  status text not null default 'new' check (status in ('new', 'assigned', 'contacted', 'follow_up', 'closed')),
  owner_staff_id uuid references public.staff_users (id) on delete set null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Store ------------------------------------------------------------------------

create table public.store_orders (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('stripe', 'paypal')),
  provider_ref text not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'processing', 'fulfilled', 'canceled', 'refunded')),
  contact_name text,
  contact_email extensions.citext,
  contact_phone text,
  shipping_line1 text,
  shipping_line2 text,
  shipping_city text,
  shipping_state text,
  shipping_postal_code text,
  shipping_country text,
  subtotal_cents integer not null check (subtotal_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  tax_cents integer not null default 0 check (tax_cents >= 0),
  fee_cents integer not null default 0 check (fee_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_ref),
  constraint store_orders_total check (total_cents = subtotal_cents + shipping_cents + tax_cents + fee_cents)
);

create table public.store_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.store_orders (id) on delete cascade,
  product_id text not null,
  title text not null,
  size text,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array[
    'people', 'volunteer_parties', 'volunteer_registrations', 'registration_shifts', 'registration_status_history',
    'agreements', 'check_ins', 'link_tokens', 'intake_review', 'payments', 'subscriptions', 'inquiries',
    'store_orders', 'store_order_items'
  ] loop
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_updated_at', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end;
$$;
revoke execute on function public.volunteer_party_size_limit() from public, anon, authenticated;
