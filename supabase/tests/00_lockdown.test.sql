-- Every table in public is locked to the browser keys (02 §4, §7):
-- RLS on (and forced), no policies for anon or authenticated, and no table
-- privileges for either. Written over the catalog, so new tables are
-- covered without editing this file.
begin;
select plan(7);

select is(
  (select array_agg(c.relname order by c.relname) from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity),
  null,
  'every public table has row level security enabled'
);

select is(
  (select array_agg(c.relname order by c.relname) from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r' and not c.relforcerowsecurity),
  null,
  'every public table forces row level security'
);

select is(
  (select array_agg(tablename || ':' || policyname) from pg_policies
    where schemaname = 'public' and roles && array['anon', 'authenticated', 'public']::name[]),
  null,
  'no policy lets anon or authenticated see rows'
);

select is(
  (select array_agg(distinct table_name || ':' || grantee || ':' || privilege_type) from information_schema.role_table_grants
    where table_schema = 'public' and grantee in ('anon', 'authenticated', 'PUBLIC')),
  null,
  'anon and authenticated have no privileges on any public table'
);

select is(
  (select array_agg(p.proname) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and (has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('authenticated', p.oid, 'execute'))),
  null,
  'anon and authenticated can execute no public function'
);

-- Acting as the anonymous browser key, every table read is refused.
set local role anon;
select throws_ok('select count(*) from public.staff_users', '42501', null, 'anon cannot read staff_users');
reset role;

-- The audit log can't be rewritten, even by the server.
insert into public.audit_log (action, target_type, actor_kind) values ('test.write', 'test', 'system');
select throws_ok('update public.audit_log set action = ''changed''', 'P0001', 'audit_log is append-only', 'audit_log rejects updates');

select * from finish();
rollback;
