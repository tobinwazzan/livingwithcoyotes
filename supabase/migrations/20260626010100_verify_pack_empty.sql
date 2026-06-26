do $$
declare ns int; np int;
begin
  select count(*) into ns from public.signups;
  select count(*) into np from public.public_supporters();
  raise notice 'PACK STATE: signups=% on_wall=%', ns, np;
end $$;
