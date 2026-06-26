do $$ declare n int; f int; begin
  select count(*) into n from public.signups;
  select count(*) into f from public.signups where membership_status='active' and membership_method='founding';
  raise notice 'LAUNCH STATE: signups=% founding=%/100', n, f;
end $$;
