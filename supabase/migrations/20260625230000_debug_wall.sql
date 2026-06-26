do $$
declare r record;
begin
  for r in select email, membership_status, membership_method, paid_amount_cents, wall_display, membership_started_at
           from public.signups order by created_at loop
    raise notice 'SIGNUP: % | status=% method=% paid=% wall=% started=%',
      r.email, r.membership_status, r.membership_method, r.paid_amount_cents, r.wall_display, r.membership_started_at;
  end loop;
  for r in select * from public.public_supporters() loop
    raise notice 'WALL: display=% city=% patron=% joined=%', r.display, r.city, r.is_patron, r.joined;
  end loop;
end $$;
