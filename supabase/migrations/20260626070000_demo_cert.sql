-- A demo member so Tobin has a live certificate to download. Hidden from The
-- Pack, paid_amount marks it Pack Leader; NOT founding, so 0/100 stays intact.
-- Tagged 'demo-cert@' so it's easy to wipe later.
do $$
declare v uuid;
begin
  delete from public.signups where email = 'demo-cert@livingwithcoyotes.org';
  insert into public.signups
    (role, full_name, phone, email, city, membership_status, membership_method,
     paid_amount_cents, membership_started_at, membership_expires_at, wall_display)
  values
    ('resident','Tobin Wazzan','(949) 339-4077','demo-cert@livingwithcoyotes.org','Irvine',
     'active','code', 5000, now(), (current_date + interval '1 year')::date, 'hidden')
  returning id into v;
  raise notice 'DEMO CERT URL: https://livingwithcoyotes.org/certificate/%', v;
end $$;
