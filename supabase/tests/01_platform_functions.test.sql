-- The rate limiter and webhook ledger functions behave atomically and count correctly.
begin;
select plan(6);

select is(public.rate_limit_hit('t:abc', '2027-01-01 00:00:00+00', 600), 1, 'first hit in a window counts 1');
select is(public.rate_limit_hit('t:abc', '2027-01-01 00:00:00+00', 600), 2, 'second hit counts 2');
select is(public.rate_limit_hit('t:abc', '2027-01-01 00:10:00+00', 600), 1, 'a new window starts at 1');

select results_eq(
  $$ select status, attempts, is_new from public.webhook_claim('stripe', 'evt_1', 'payment_intent.succeeded') $$,
  $$ values ('received'::text, 1, true) $$,
  'a new provider event is recorded'
);
update public.integration_events set status = 'processed' where external_event_id = 'evt_1';
select results_eq(
  $$ select status, attempts, is_new from public.webhook_claim('stripe', 'evt_1', 'payment_intent.succeeded') $$,
  $$ values ('processed'::text, 2, false) $$,
  'a repeat delivery returns the existing outcome'
);
select results_eq(
  $$ select status, attempts, is_new from public.webhook_claim('paypal', 'evt_1', 'x') $$,
  $$ values ('received'::text, 1, true) $$,
  'event ids are unique per provider'
);

select * from finish();
rollback;
