-- ============================================================================
-- Founding Members — the first 100 join free. Race-safe: a transaction-level
-- advisory lock serializes concurrent claims so the cap can never be exceeded,
-- even under a traffic spike. After 100, the offer closes and $19 resumes.
-- claim returns: 'claimed' | 'full' | 'already_active' | 'not_found'
-- ============================================================================

create or replace function public.claim_founding_membership(p_signup_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v_status text; v_count int;
begin
  -- Serialize all founding claims (any txn-scoped key works; released at commit).
  perform pg_advisory_xact_lock(740274027);

  select membership_status into v_status from public.signups where id = p_signup_id;
  if not found then return 'not_found'; end if;
  if v_status = 'active' then return 'already_active'; end if;

  select count(*) into v_count
    from public.signups
   where membership_status = 'active' and membership_method = 'founding';
  if v_count >= 100 then return 'full'; end if;

  update public.signups
     set membership_status = 'active',
         membership_method = 'founding',
         paid_amount_cents = 0,
         membership_started_at = now(),
         membership_expires_at = (current_date + interval '1 year')::date
   where id = p_signup_id;
  return 'claimed';
end $$;
revoke all on function public.claim_founding_membership(uuid) from public;
grant execute on function public.claim_founding_membership(uuid) to anon;

-- Live count for the "X of 100 claimed" badge. Read-only, safe for anon.
create or replace function public.founding_count()
returns int language sql security definer set search_path = public stable as $$
  select count(*)::int
    from public.signups
   where membership_status = 'active' and membership_method = 'founding';
$$;
revoke all on function public.founding_count() from public;
grant execute on function public.founding_count() to anon;
-- ============================================================================
