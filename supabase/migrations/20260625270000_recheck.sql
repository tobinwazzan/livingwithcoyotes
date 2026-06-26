do $$
declare ns int; ne int;
begin
  select count(*) into ns from public.signups;
  select count(*) into ne from public.funnel_events;
  raise notice 'STATE signups=% funnel=%', ns, ne;
end $$;
