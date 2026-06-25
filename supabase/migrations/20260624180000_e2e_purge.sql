-- E2E test-data purge. Pattern-locked to 'zz-e2e-%@example.com' so it can ONLY
-- ever delete test rows — safe to grant to anon for automated teardown.
create or replace function public.purge_e2e_signups()
returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  delete from public.funnel_events fe
   using public.signups s
   where fe.signup_id = s.id and s.email like 'zz-e2e-%@example.com';
  delete from public.signups where email like 'zz-e2e-%@example.com';
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.purge_e2e_signups() from public;
grant execute on function public.purge_e2e_signups() to anon;
