-- Confirm the latest welcome email (new subject/preheader) sent.
do $$
declare r record;
begin
  select event, created_at into r from public.funnel_events
   where event in ('email_sent','email_failed') order by created_at desc limit 1;
  raise notice 'LATEST: % at %', coalesce(r.event,'(none)'), r.created_at;
end $$;
