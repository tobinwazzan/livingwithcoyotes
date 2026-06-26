do $$
declare ns int;
begin
  delete from public.funnel_events;
  delete from public.signups where email like 'tobin.wazzan%@gmail.com' or email like 'zz-e2e-%';
  select count(*) into ns from public.signups;
  raise notice 'CLEAN: signups=%', ns;
end $$;
