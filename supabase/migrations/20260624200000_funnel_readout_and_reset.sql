-- One-time: print the funnel readout from the E2E smoke (proof observability
-- works), then clear test signups + all funnel_events so REAL traffic starts at 0.
do $$
declare r record;
begin
  raise notice '=== FUNNEL READOUT (last 1h, from E2E smoke) ===';
  for r in
    select event,
           count(*) filter (where not is_bot) as humans,
           count(*) filter (where is_bot)     as bots
      from public.funnel_events
     where created_at > now() - interval '1 hour'
     group by event order by event
  loop
    raise notice '  % : % human / % bot', rpad(r.event, 16), r.humans, r.bots;
  end loop;

  delete from public.signups where email like 'zz-e2e-%@example.com';
  delete from public.funnel_events;
  raise notice '=== reset done: test rows + funnel_events cleared for real traffic ===';
end $$;
