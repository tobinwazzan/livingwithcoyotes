-- Remove the end-to-end launch verification lead (created via the live form on
-- 2026-06-24 to confirm the hardened RPC signup path works). Safe no-op if absent.
delete from public.signups where lower(email) = 'zz-launchtest@example.com';
