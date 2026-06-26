do $$
declare v uuid;
begin
  select id into v from public.signups where email = 'tobin.wazzan+cert@gmail.com' limit 1;
  raise notice 'CERTID: %', v;
end $$;
