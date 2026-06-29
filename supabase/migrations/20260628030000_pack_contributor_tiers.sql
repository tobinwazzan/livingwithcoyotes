-- ============================================================================
-- The Pack becomes a CONTRIBUTORS wall, organized by level of support.
-- Registration is free, so members no longer appear here automatically — the
-- Pack now honors people who chose to contribute. Three levels: $100 / $50 / $20.
--
-- public_contributors() returns the sanitized, opt-in rows only. It never
-- returns the exact amount — only the tier bucket (100 / 50 / 20), which is the
-- whole point of the wall. Email/phone are never returned. Mirrors the
-- security-definer + anon/service_role grant pattern of public_supporters().
-- ============================================================================

create or replace function public.public_contributors()
returns table(display text, city text, tier int, photo_url text, joined date)
language sql security definer set search_path = public stable as $$
  select
    case wall_display
      when 'full'  then full_name
      when 'first' then split_part(full_name, ' ', 1)
    end as display,
    city,
    case
      when coalesce(paid_amount_cents, 0) >= 10000 then 100
      when coalesce(paid_amount_cents, 0) >= 5000  then 50
      else 20
    end as tier,
    photo_url,
    membership_started_at::date as joined
  from public.signups
  where membership_status = 'active'
    and coalesce(paid_amount_cents, 0) > 0        -- contributors only, never free members
    and wall_display in ('first', 'full')
  order by coalesce(paid_amount_cents, 0) desc, membership_started_at asc nulls last;
$$;

revoke all on function public.public_contributors() from public;
grant execute on function public.public_contributors() to anon, service_role;
-- ============================================================================
