-- ============================================================================
-- Remove the 100-member cap. Registration is now FREE for everyone, unlimited —
-- the "first 100 free" scarcity belonged to the old pay-after-100 model. The
-- free-activation RPC keeps its name/method ('founding') for continuity, but no
-- longer counts or caps: it always activates. Never returns 'full' anymore.
-- Grants stay service-role only (matching the lockdown) — never re-grant anon.
-- ============================================================================

create or replace function public.claim_founding_membership(p_signup_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v_status text;
begin
  -- (Advisory lock kept harmlessly; there's no cap to serialize against now.)
  perform pg_advisory_xact_lock(740274027);

  select membership_status into v_status from public.signups where id = p_signup_id;
  if not found then return 'not_found'; end if;
  if v_status = 'active' then return 'already_active'; end if;

  update public.signups
     set membership_status = 'active',
         membership_method = 'founding',
         paid_amount_cents = 0,
         membership_started_at = now(),
         membership_expires_at = (current_date + interval '1 year')::date
   where id = p_signup_id;
  return 'claimed';
end $$;

revoke execute on function public.claim_founding_membership(uuid) from anon;
grant  execute on function public.claim_founding_membership(uuid) to service_role;
