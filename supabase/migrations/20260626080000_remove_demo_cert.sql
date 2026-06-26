delete from public.signups where email = 'demo-cert@livingwithcoyotes.org';
do $$ declare n int; begin select count(*) into n from public.signups; raise notice 'SIGNUPS NOW: %', n; end $$;
