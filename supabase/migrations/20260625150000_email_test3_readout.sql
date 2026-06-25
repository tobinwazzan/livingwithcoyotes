-- Latest welcome-email outcome after the SMTP_USER=tobin@ + fresh password fix.
do $$
declare r record;
begin
  select event, created_at into r
    from public.funnel_events
   where event in ('email_sent','email_failed')
   order by created_at desc limit 1;
  raise notice 'LATEST EMAIL EVENT: % at %', coalesce(r.event,'(none)'), r.created_at;
end $$;
