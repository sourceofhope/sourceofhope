-- Spots taken per shift, for the Hub's "spots left" and "Full" (spec §9.4, §9.6).
-- A place is held by anyone still on the roster: incomplete, awaiting an
-- agreement, confirmed or checked in. Cancelled, removed and no-shows free it.
create or replace function public.shift_spots_taken(p_event_ids uuid[])
returns table (shift_id uuid, taken integer)
language sql
stable
security invoker
set search_path = ''
as $$
  select rs.shift_id, count(*)::integer as taken
  from public.registration_shifts rs
  join public.volunteer_registrations vr on vr.id = rs.registration_id
  where rs.event_id = any (p_event_ids)
    and vr.status in ('incomplete', 'awaiting_agreement', 'confirmed', 'checked_in')
  group by rs.shift_id;
$$;

revoke execute on function public.shift_spots_taken(uuid[]) from public, anon, authenticated;
grant execute on function public.shift_spots_taken(uuid[]) to service_role;
