-- ============================================================================
-- Wall of Fame (public Supporters wall) — OPT-IN ONLY.
--  * wall_display consent on each signup: hidden (default) | first | full.
--  * public_supporters(): the ONLY public read — returns just the name (per the
--    member's chosen format) + city + a "Founding Patron" flag ($50+). No email,
--    phone, or exact amount ever leaves the server.
--  * variable contributions: record_manual_payment now takes an amount so a
--    member can give more than $19 (Patron = $50+).
-- ============================================================================

alter table public.signups
  add column if not exists wall_display text not null default 'hidden';
alter table public.signups drop constraint if exists signups_wall_display_chk;
alter table public.signups add constraint signups_wall_display_chk
  check (wall_display in ('hidden','first','full')) not valid;

-- Public, sanitized supporters list. Safe to grant anon: opt-in rows only, no PII.
create or replace function public.public_supporters()
returns table(display text, city text, is_patron boolean, joined date)
language sql security definer set search_path = public stable as $$
  select
    case wall_display
      when 'full'  then full_name
      when 'first' then split_part(full_name, ' ', 1)
    end as display,
    city,
    coalesce(paid_amount_cents, 0) >= 5000 as is_patron,
    membership_started_at::date as joined
  from public.signups
  where membership_status = 'active'
    and wall_display in ('first','full')
  order by (coalesce(paid_amount_cents,0) >= 5000) desc, membership_started_at asc nulls last;
$$;
revoke all on function public.public_supporters() from public;
grant execute on function public.public_supporters() to anon, service_role;

-- Manual payment now records the actual contribution amount (>= $19).
drop function if exists public.record_manual_payment(uuid, text, text);
create or replace function public.record_manual_payment(
  p_signup_id uuid, p_method text, p_receipt_path text, p_amount_cents int
) returns text language plpgsql security definer set search_path = public as $$
declare v_status text;
begin
  if p_method not in ('venmo','zelle') then raise exception 'bad_method'; end if;
  select membership_status into v_status from public.signups where id = p_signup_id;
  if not found then return 'not_found'; end if;
  if v_status = 'active' then return 'already_active'; end if;
  update public.signups
     set membership_status='active', membership_method=p_method,
         paid_amount_cents=greatest(coalesce(p_amount_cents,1900), 1900),
         receipt_path=p_receipt_path,
         membership_started_at=now(),
         membership_expires_at=(current_date + interval '1 year')::date
   where id = p_signup_id;
  return 'activated';
end $$;
revoke all on function public.record_manual_payment(uuid, text, text, int) from public, anon;
grant execute on function public.record_manual_payment(uuid, text, text, int) to service_role;
-- ============================================================================
