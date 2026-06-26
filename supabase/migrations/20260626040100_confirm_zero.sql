do $$ declare n int; begin select count(*) into n from public.signups; raise notice 'FINAL signups=%', n; end $$;
