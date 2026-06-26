do $$
declare v uuid; st text; em text; cnt int; r record;
begin
  select id, membership_status into v, st from public.signups where email='tobin.wazzan+golive@gmail.com' limit 1;
  select count(*) into cnt from public.signups where membership_status='active' and membership_method='founding';
  raise notice 'MEMBER id=% status=% founding_count=%', v, st, cnt;
  for r in select event, count(*) c from public.funnel_events group by event order by 1 loop
    raise notice 'FUNNEL % = %', r.event, r.c;
  end loop;
end $$;
