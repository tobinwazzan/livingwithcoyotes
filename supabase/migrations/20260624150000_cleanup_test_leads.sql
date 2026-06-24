-- Remove any zz-*@example.com leads created while diagnosing the join flow.
delete from public.signups where lower(email) like 'zz-%@example.com';
