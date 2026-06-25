-- ============================================================================
-- Wave 1 QA fixes (from the verification gate):
--  * Make activation idempotent + report what actually happened, so funnel
--    metrics aren't corrupted by success-page refreshes and a bad/foreign
--    signup_id can't be logged as a successful activation.
--  * Tighten the e2e purge to a 24h window (defense in depth).
-- Activation RPCs now RETURN text: 'activated' | 'already_active' | 'not_found'.
-- ============================================================================

drop function if exists public.activate_stripe_membership(uuid, int, text);
create or replace function public.activate_stripe_membership(
  p_signup_id uuid, p_amount_cents int, p_stripe_session_id text default null
) returns text
language plpgsql security definer set search_path = public as $$
declare v_status text;
begin
  select membership_status into v_status from public.signups where id = p_signup_id;
  if not found then return 'not_found'; end if;          -- bad/foreign id — caller logs invalid
  if v_status = 'active' then return 'already_active'; end if;  -- refresh — no new activation
  update public.signups
     set membership_status='active', membership_method='stripe',
         paid_amount_cents=p_amount_cents, stripe_session_id=p_stripe_session_id,
         membership_started_at=now(),
         membership_expires_at=(current_date + interval '1 year')::date
   where id = p_signup_id;
  return 'activated';
end $$;
revoke all on function public.activate_stripe_membership(uuid, int, text) from public;
grant execute on function public.activate_stripe_membership(uuid, int, text) to anon;

drop function if exists public.record_manual_payment(uuid, text, text);
create or replace function public.record_manual_payment(p_signup_id uuid, p_method text, p_receipt_path text)
returns text language plpgsql security definer set search_path = public as $$
declare v_status text;
begin
  if p_method not in ('venmo','zelle') then raise exception 'bad_method'; end if;
  select membership_status into v_status from public.signups where id = p_signup_id;
  if not found then return 'not_found'; end if;
  if v_status = 'active' then return 'already_active'; end if;
  update public.signups
     set membership_status='active', membership_method=p_method,
         paid_amount_cents=1900, receipt_path=p_receipt_path,
         membership_started_at=now(),
         membership_expires_at=(current_date + interval '1 year')::date
   where id = p_signup_id;
  return 'activated';
end $$;
revoke all on function public.record_manual_payment(uuid, text, text) from public;
grant execute on function public.record_manual_payment(uuid, text, text) to anon;

-- e2e purge: only ever touch test-pattern rows AND only recent ones.
create or replace function public.purge_e2e_signups()
returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  delete from public.funnel_events fe
   using public.signups s
   where fe.signup_id = s.id
     and s.email like 'zz-e2e-%@example.com'
     and s.created_at > now() - interval '24 hours';
  delete from public.signups
   where email like 'zz-e2e-%@example.com'
     and created_at > now() - interval '24 hours';
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.purge_e2e_signups() from public;
grant execute on function public.purge_e2e_signups() to anon;
-- NOTE (Wave 3): when the service-role key lands, move funnel logging + this
-- purge off the anon grant and behind service-role / CI only.
-- ============================================================================
