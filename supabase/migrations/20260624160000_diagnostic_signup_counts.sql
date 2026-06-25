-- Read-only diagnostic: surface current signup counts via NOTICE (no schema change).
do $$
declare r record;
begin
  raise notice 'TOTAL signups: %', (select count(*) from public.signups);
  for r in select membership_status, count(*) c from public.signups group by membership_status order by c desc loop
    raise notice 'status % : %', r.membership_status, r.c;
  end loop;
  for r in select role, count(*) c from public.signups group by role order by c desc loop
    raise notice 'role % : %', r.role, r.c;
  end loop;
  for r in select coalesce(source,'(none)') s, count(*) c from public.signups group by source order by c desc loop
    raise notice 'source % : %', r.s, r.c;
  end loop;
end $$;
