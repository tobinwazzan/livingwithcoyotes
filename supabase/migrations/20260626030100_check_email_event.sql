do $$
declare r record;
begin
  select event, meta into r from public.funnel_events
   where event in ('email_sent','email_failed') order by created_at desc limit 1;
  raise notice 'EMAIL: % meta=%', coalesce(r.event,'(none)'), r.meta;
end $$;
