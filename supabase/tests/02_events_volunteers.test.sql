-- Event and volunteer invariants the database must hold whatever code runs.
begin;
select plan(11);

-- Events ---------------------------------------------------------------------

select throws_ok(
  $$ insert into public.events (slug, starts_at, ends_at) values ('bad', now(), now() - interval '1 hour') $$,
  '23514', null, 'an event must end after it starts'
);
select throws_ok(
  $$ insert into public.events (slug, ownership, starts_at, ends_at) values ('p', 'partner', now(), now() + interval '1 hour') $$,
  '23514', null, 'a partner event needs a partner name and sign-up link'
);
select throws_ok(
  $$ insert into public.event_shifts (event_id, label, starts_at, ends_at, capacity)
     values ('00000000-0000-4000-8000-000000000004', 'x', now(), now() + interval '1 hour', 5) $$,
  '23514', 'partner events have no shifts', 'partner events can''t have shifts'
);
select throws_ok(
  $$ insert into public.events (slug, starts_at, ends_at, required_agreements) values ('r', now(), now() + interval '1 hour', '{waiver}') $$,
  '23514', null, 'only known agreement types are allowed'
);
select is(
  (select count(*)::int from public.events where status = 'published'), 4,
  'the seed has guest-only, volunteer-only, two-sided and partner events published'
);

-- Volunteers -------------------------------------------------------------------

insert into public.people (id, first_name, last_name, email) values
  ('10000000-0000-4000-8000-000000000001', 'Test', 'Registrant', 'registrant@example.com');
insert into public.volunteer_parties (id, event_id, registrant_person_id)
values ('20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001');
insert into public.volunteer_registrations (id, party_id, event_id, person_id, status)
values ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002',
        '10000000-0000-4000-8000-000000000001', 'awaiting_agreement');

select throws_ok(
  $$ insert into public.volunteer_registrations (party_id, event_id, person_id, status)
     values ('20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002',
             '10000000-0000-4000-8000-000000000001', 'incomplete') $$,
  '23505', null, 'one registration per person per event'
);
select throws_ok(
  $$ insert into public.volunteer_registrations (party_id, event_id, person_id, status)
     values ('20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003',
             '10000000-0000-4000-8000-000000000001', 'incomplete') $$,
  '23503', null, 'a registration belongs to its party''s event'
);
select throws_ok(
  $$ insert into public.registration_shifts (registration_id, shift_id, event_id)
     values ('30000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000031', '00000000-0000-4000-8000-000000000002') $$,
  '23503', null, 'a shift must belong to the registration''s event'
);

-- Fill the party to 10 active people, then the 11th is refused.
insert into public.people (id, first_name, last_name)
  select ('10000000-0000-4000-8000-0000000001' || lpad(i::text, 2, '0'))::uuid, 'Member', i::text from generate_series(1, 10) i;
insert into public.volunteer_registrations (party_id, event_id, person_id, status)
  select '20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002',
         ('10000000-0000-4000-8000-0000000001' || lpad(i::text, 2, '0'))::uuid, 'incomplete' from generate_series(1, 9) i;
select throws_ok(
  $$ insert into public.volunteer_registrations (party_id, event_id, person_id, status)
     values ('20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002',
             '10000000-0000-4000-8000-000000000110', 'incomplete') $$,
  '23514', 'a volunteer party holds at most 10 people', 'parties hold at most 10 active people'
);
-- A cancelled member frees a place.
update public.volunteer_registrations set status = 'cancelled'
  where person_id = '10000000-0000-4000-8000-000000000101';
select lives_ok(
  $$ insert into public.volunteer_registrations (party_id, event_id, person_id, status)
     values ('20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002',
             '10000000-0000-4000-8000-000000000110', 'incomplete') $$,
  'a cancelled member frees a place in the party'
);
select throws_ok(
  $$ insert into public.volunteer_registrations (party_id, event_id, person_id, status, is_minor)
     values ('20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002',
             '10000000-0000-4000-8000-000000000001', 'incomplete', true) $$,
  '23514', null, 'a minor''s registration names a guardian'
);

select * from finish();
rollback;
