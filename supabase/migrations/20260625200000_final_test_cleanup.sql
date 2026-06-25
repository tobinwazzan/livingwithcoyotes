-- Final pre-launch cleanup: remove all test signups + funnel noise so real
-- traffic starts at a true zero. (No real members exist yet — site is in
-- maintenance.) Test rows = tobin.wazzan* gmail + zz-e2e-* addresses.
do $$
declare ns int; nf int; ne int;
begin
  delete from public.funnel_events;
  delete from public.signups
   where email like 'tobin.wazzan%@gmail.com' or email like 'zz-e2e-%';
  select count(*) into ns from public.signups;
  select count(*) into nf from public.signups
    where membership_status = 'active' and membership_method = 'founding';
  select count(*) into ne from public.funnel_events;
  raise notice 'CLEAN: signups=% founding=%/100 funnel_events=%', ns, nf, ne;
end $$;
