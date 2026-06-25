-- Latest welcome-email outcome via Resend.
do $$
declare r record;
begin
  select event, meta, created_at into r
    from public.funnel_events
   where event in ('email_sent','email_failed')
   order by created_at desc limit 1;
  raise notice 'LATEST: % | meta=% | at %', coalesce(r.event,'(none)'), r.meta, r.created_at;
end $$;
