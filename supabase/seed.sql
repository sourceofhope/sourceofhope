-- Local and staging seed (slice 2.3): one event of each kind the Hub and
-- the events page must handle. Dates are relative to the reset, so they're
-- always upcoming. No personal data.

-- 1. Guest-only: a food distribution open to the public, no volunteer shifts.
insert into public.events (id, slug, status, ownership, program_key, starts_at, ends_at, venue_name, address, open_to_public, need_categories, languages, published_at)
values (
  '00000000-0000-4000-8000-000000000001', 'community-food-distribution', 'published', 'tsoh', 'servingHope',
  date_trunc('day', now()) + interval '10 days 16 hours', date_trunc('day', now()) + interval '10 days 19 hours',
  'The Source of Hope', '1108 W Parker Rd, Ste 102, Plano, TX 75075',
  true, '{food}', '{en,es}', now()
);
insert into public.event_texts (event_id, locale, title, summary, guest_who, guest_bring, guest_cost, accessibility)
values (
  '00000000-0000-4000-8000-000000000001', 'en', 'Community food distribution',
  'Free groceries and a hot meal for any family that needs them.',
  'Anyone. No sign-up or ID needed.', 'Nothing. We provide bags.', 'Free',
  'Step-free entrance and seating available.'
);

-- 2. Volunteer-only: a packing night with two shifts and the Serving Hope addendum.
insert into public.events (id, slug, status, ownership, program_key, starts_at, ends_at, venue_name, address, open_to_public, min_age, required_agreements, published_at)
values (
  '00000000-0000-4000-8000-000000000002', 'food-packing-night', 'published', 'tsoh', 'servingHope',
  date_trunc('day', now()) + interval '17 days 23 hours', date_trunc('day', now()) + interval '18 days 2 hours',
  'The Source of Hope', '1108 W Parker Rd, Ste 102, Plano, TX 75075',
  false, 12, '{serving_hope_addendum}', now()
);
insert into public.event_texts (event_id, locale, title, summary, volunteer_expect, volunteer_wear)
values (
  '00000000-0000-4000-8000-000000000002', 'en', 'Food packing night',
  'Pack meal kits for next month''s distribution.',
  'Packing boxes at tables, with short breaks. Some lifting up to 20 lb.', 'Closed-toe shoes. Hair tied back.'
);
insert into public.event_shifts (id, event_id, label, starts_at, ends_at, capacity) values
  ('00000000-0000-4000-8000-000000000021', '00000000-0000-4000-8000-000000000002', 'First shift',
   date_trunc('day', now()) + interval '17 days 23 hours', date_trunc('day', now()) + interval '18 days 0 hours 30 minutes', 20),
  ('00000000-0000-4000-8000-000000000022', '00000000-0000-4000-8000-000000000002', 'Second shift',
   date_trunc('day', now()) + interval '18 days 0 hours 30 minutes', date_trunc('day', now()) + interval '18 days 2 hours', 20);

-- 3. Both sides: a meal service guests attend and volunteers staff.
insert into public.events (id, slug, status, ownership, program_key, starts_at, ends_at, venue_name, address, open_to_public, need_categories, languages, min_age, required_agreements, published_at)
values (
  '00000000-0000-4000-8000-000000000003', 'serving-hope-meal-service', 'published', 'tsoh', 'servingHope',
  date_trunc('day', now()) + interval '24 days 16 hours', date_trunc('day', now()) + interval '24 days 19 hours',
  'The Source of Hope', '1108 W Parker Rd, Ste 102, Plano, TX 75075',
  true, '{food}', '{en,es}', 10, '{serving_hope_addendum}', now()
);
insert into public.event_texts (event_id, locale, title, summary, guest_who, guest_bring, guest_cost, volunteer_expect, volunteer_wear)
values (
  '00000000-0000-4000-8000-000000000003', 'en', 'Serving Hope meal service',
  'A hot meal served to our neighbors, with groceries to take home.',
  'Anyone who would like a meal.', 'Nothing.', 'Free',
  'Serve food, greet guests and clean up.', 'Comfortable clothes and closed-toe shoes.'
);
insert into public.event_shifts (id, event_id, label, starts_at, ends_at, capacity) values
  ('00000000-0000-4000-8000-000000000031', '00000000-0000-4000-8000-000000000003', 'Setup and serving',
   date_trunc('day', now()) + interval '24 days 15 hours', date_trunc('day', now()) + interval '24 days 18 hours', 15),
  ('00000000-0000-4000-8000-000000000032', '00000000-0000-4000-8000-000000000003', 'Serving and cleanup',
   date_trunc('day', now()) + interval '24 days 17 hours', date_trunc('day', now()) + interval '24 days 20 hours', 15);

-- 4. Partner: listed on our site; sign-up happens on the partner's site.
insert into public.events (id, slug, status, ownership, partner_name, partner_signup_url, starts_at, ends_at, venue_name, address, open_to_public, need_categories, published_at)
values (
  '00000000-0000-4000-8000-000000000004', 'partner-health-fair', 'published', 'partner',
  'Partner organization (sample)', 'https://example.org/health-fair',
  date_trunc('day', now()) + interval '31 days 15 hours', date_trunc('day', now()) + interval '31 days 20 hours',
  'Community center (sample)', 'Plano, TX', true, '{health}', now()
);
insert into public.event_texts (event_id, locale, title, summary, guest_who, guest_cost)
values (
  '00000000-0000-4000-8000-000000000004', 'en', 'Community health fair',
  'Free screenings and health information, hosted by a partner.', 'Anyone.', 'Free'
);

-- A draft, to prove the read model hides unpublished events.
insert into public.events (id, slug, status, ownership, starts_at, ends_at)
values ('00000000-0000-4000-8000-000000000005', 'draft-event', 'draft', 'tsoh',
  date_trunc('day', now()) + interval '40 days', date_trunc('day', now()) + interval '40 days 2 hours');
insert into public.event_texts (event_id, locale, title) values ('00000000-0000-4000-8000-000000000005', 'en', 'Draft event');
