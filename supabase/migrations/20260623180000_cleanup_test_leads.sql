-- One-off cleanup: remove the test leads created while verifying the
-- Stripe live checkout flow on 2026-06-23. Safe/idempotent: deletes only
-- the two known verification rows (and any obviously-labeled test row).
delete from public.signups
where lower(email) in (
  'verify+stripe@livingwithcoyotes.org',
  'verify+stripelive@livingwithcoyotes.org'
)
   or full_name ilike 'Stripe %Verify (test%';
