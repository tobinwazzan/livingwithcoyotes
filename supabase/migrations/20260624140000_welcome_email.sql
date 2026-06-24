-- ============================================================================
-- Welcome email — send our own branded email exactly once per member, on any
-- join path (Stripe / Venmo / Zelle / code). claim_welcome_email atomically
-- stamps welcome_email_sent_at and returns the member's details ONLY to the
-- first caller; later calls (e.g. a refreshed Stripe success page) get nothing,
-- so no duplicate email. anon can't read signups directly, so this RPC is also
-- how the server fetches the details it needs to compose the email.
-- ============================================================================

alter table public.signups
  add column if not exists welcome_email_sent_at timestamptz;

create or replace function public.claim_welcome_email(p_signup_id uuid)
returns table(
  email                 text,
  full_name             text,
  paid_amount_cents     int,
  membership_method     text,
  membership_expires_at date
)
language plpgsql security definer set search_path = public as $$
begin
  -- Claim: only succeeds for an active member who hasn't been emailed yet.
  update public.signups s
     set welcome_email_sent_at = now()
   where s.id = p_signup_id
     and s.welcome_email_sent_at is null
     and s.membership_status = 'active';

  if not found then
    return;  -- already emailed, or not active — caller sends nothing
  end if;

  return query
    select s.email, s.full_name, s.paid_amount_cents,
           s.membership_method, s.membership_expires_at
      from public.signups s
     where s.id = p_signup_id;
end $$;
revoke all on function public.claim_welcome_email(uuid) from public;
grant execute on function public.claim_welcome_email(uuid) to anon;
