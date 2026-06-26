-- Welcome email now also needs the member id (to link their certificate).
drop function if exists public.claim_welcome_email(uuid);
create or replace function public.claim_welcome_email(p_signup_id uuid)
returns table(
  id                    uuid,
  email                 text,
  full_name             text,
  paid_amount_cents     int,
  membership_method     text,
  membership_expires_at date
)
language plpgsql security definer set search_path = public as $$
begin
  update public.signups s
     set welcome_email_sent_at = now()
   where s.id = p_signup_id
     and s.welcome_email_sent_at is null
     and s.membership_status = 'active';

  if not found then
    return;  -- already emailed, or not active — caller sends nothing
  end if;

  return query
    select s.id, s.email, s.full_name, s.paid_amount_cents,
           s.membership_method, s.membership_expires_at
      from public.signups s
     where s.id = p_signup_id;
end $$;
revoke all on function public.claim_welcome_email(uuid) from public, anon;
grant execute on function public.claim_welcome_email(uuid) to anon, service_role;
