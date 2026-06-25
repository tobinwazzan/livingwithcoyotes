-- Read whether the welcome-email send succeeded (email_sent) or failed
-- (email_failed) server-side, from the funnel. Read-only diagnostic.
do $$
declare r record; found_any boolean := false;
begin
  raise notice '=== WELCOME EMAIL SEND RESULT ===';
  for r in
    select event, count(*) c, max(created_at) last
      from public.funnel_events
     where event in ('email_sent','email_failed')
     group by event order by event
  loop
    found_any := true;
    raise notice '  % : %  (last at %)', rpad(r.event,13), r.c, r.last;
  end loop;
  if not found_any then raise notice '  (no email events logged yet)'; end if;
  raise notice 'test member tobin.wazzan@gmail.com: %',
    (select membership_status || ' / ' || coalesce(membership_method,'-')
       from public.signups where email = 'tobin.wazzan@gmail.com' limit 1);
end $$;
