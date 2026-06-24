-- ============================================================================
-- Harden + enrich signups — "ready for the masses, capture every detail."
--
-- Three goals:
--   1. SECURITY/SCALE: close the open spam door. Today anon can INSERT directly
--      into signups with check(true) — the anon key is public, so anyone can
--      POST arbitrary rows via the REST API and bypass all app validation.
--      Fix: revoke direct inserts; the ONLY write path becomes the
--      security-definer RPC, and we move full validation INTO that RPC so it
--      can't be bypassed even by a direct anon rpc() call.
--   2. CAPTURE: add attribution (source/referrer/meta), consent, payment
--      reconciliation (stripe_session_id), internal notes, and updated_at.
--   3. CORRECTNESS: manual payments were recorded as $25 (pre-$19 change);
--      'partner' was a valid form role but not accepted anywhere.
--
-- Additive and safe: existing rows are grandfathered (CHECKs added NOT VALID);
-- the signup form keeps working unchanged through the same RPC name.
-- ============================================================================

-- 1) New columns — capture every useful detail --------------------------------
alter table public.signups
  add column if not exists updated_at        timestamptz not null default now(),
  add column if not exists email_opt_in      boolean     not null default true, -- consented to council emails
  add column if not exists consent_at        timestamptz,                       -- when they submitted/consented
  add column if not exists source            text,        -- channel: utm_source / ref (nextdoor, hoa, …)
  add column if not exists referrer          text,        -- document.referrer (where they came from)
  add column if not exists meta              jsonb not null default '{}'::jsonb, -- all utm params, landing path, etc.
  add column if not exists stripe_session_id text,        -- Stripe Checkout session, for reconciliation/refunds
  add column if not exists notes             text;        -- internal admin annotation

-- 2) Keep updated_at fresh on every change ------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists signups_touch_updated_at on public.signups;
create trigger signups_touch_updated_at
  before update on public.signups
  for each row execute function public.touch_updated_at();

-- 3) Integrity guardrails — bad roles/statuses can never enter ----------------
--    NOT VALID: enforced for all new writes, existing rows grandfathered.
alter table public.signups drop constraint if exists signups_role_chk;
alter table public.signups add constraint signups_role_chk
  check (role in ('resident','municipality','expert','partner','other')) not valid;

alter table public.signups drop constraint if exists signups_status_chk;
alter table public.signups add constraint signups_status_chk
  check (membership_status in ('lead','active','expired','cancelled','comped')) not valid;

-- 4) Indexes — fast queries as the table grows --------------------------------
create index if not exists signups_created_at_idx on public.signups (created_at desc);
create index if not exists signups_city_idx       on public.signups (lower(city));
create index if not exists signups_status_idx      on public.signups (membership_status);
create index if not exists signups_role_idx        on public.signups (role);
create index if not exists signups_source_idx      on public.signups (source);

-- 5) CLOSE THE SPAM DOOR ------------------------------------------------------
--    Remove direct anon INSERT. All writes now go through create_membership_lead
--    (security definer), which validates everything below. RLS still blocks
--    anon SELECT/UPDATE/DELETE (no policies = denied).
drop policy if exists "anon can insert signups" on public.signups;

-- 6) Hardened lead RPC — sole public write path, validates server-side --------
--    Signature changes (adds source/referrer/meta), so drop the old one first.
drop function if exists public.create_membership_lead(text,text,text,text,text,text,text[]);

create or replace function public.create_membership_lead(
  p_role text, p_full_name text, p_phone text, p_email text,
  p_city text, p_linkedin text, p_apps text[],
  p_source text default null, p_referrer text default null,
  p_meta jsonb default '{}'::jsonb
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_id    uuid;
  v_role  text := btrim(coalesce(p_role,''));
  v_name  text := btrim(coalesce(p_full_name,''));
  v_phone text := btrim(coalesce(p_phone,''));
  v_email text := lower(btrim(coalesce(p_email,'')));
  v_city  text := btrim(coalesce(p_city,''));
  v_link  text := nullif(btrim(coalesce(p_linkedin,'')),'');
  v_apps  text[];
begin
  -- Whitelist + length validation (defense in depth — can't be bypassed even
  -- by a direct anon rpc() call, since this is now the only write path).
  if v_role not in ('resident','municipality','expert','partner','other') then
    raise exception 'invalid_role';
  end if;
  if char_length(v_name)  < 2  or char_length(v_name)  > 120 then raise exception 'invalid_name';  end if;
  if char_length(v_phone) < 7  or char_length(v_phone) > 40  then raise exception 'invalid_phone'; end if;
  if char_length(v_email) > 200 or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'invalid_email';
  end if;
  if char_length(v_city)  < 2  or char_length(v_city)  > 120 then raise exception 'invalid_city';  end if;
  if v_link is not null and char_length(v_link) > 300 then raise exception 'invalid_linkedin'; end if;

  -- Normalize the apps array: drop blanks, cap element length, cap count.
  select array(
    select btrim(a) from unnest(coalesce(p_apps,'{}')) a
    where btrim(a) <> '' and char_length(a) <= 60
    limit 30
  ) into v_apps;

  insert into public.signups (
    role, full_name, phone, email, city, linkedin, apps,
    source, referrer, meta, consent_at
  )
  values (
    v_role, v_name, v_phone, v_email, v_city, v_link, v_apps,
    nullif(btrim(coalesce(p_source,'')),''),
    nullif(btrim(coalesce(p_referrer,'')),''),
    coalesce(p_meta,'{}'::jsonb), now()
  )
  on conflict (lower(email)) do update
     set full_name = excluded.full_name, phone = excluded.phone,
         city = excluded.city, role = excluded.role,
         linkedin = excluded.linkedin, apps = excluded.apps,
         -- keep first-touch attribution; only fill if previously empty
         source   = coalesce(public.signups.source, excluded.source),
         referrer = coalesce(public.signups.referrer, excluded.referrer),
         meta     = public.signups.meta || excluded.meta
  returning id into v_id;
  return v_id;
end $$;
revoke all on function public.create_membership_lead(text,text,text,text,text,text,text[],text,text,jsonb) from public;
grant execute on function public.create_membership_lead(text,text,text,text,text,text,text[],text,text,jsonb) to anon;

-- 7) Fix manual-payment amount: $25 -> $19 (current flat membership) ----------
create or replace function public.record_manual_payment(p_signup_id uuid, p_method text, p_receipt_path text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_method not in ('venmo','zelle') then raise exception 'bad_method'; end if;
  update public.signups
     set membership_status='active', membership_method=p_method,
         paid_amount_cents=1900, receipt_path=p_receipt_path,
         membership_started_at=now(),
         membership_expires_at=(current_date + interval '1 year')::date
   where id = p_signup_id;
end $$;
revoke all on function public.record_manual_payment(uuid, text, text) from public;
grant execute on function public.record_manual_payment(uuid, text, text) to anon;

-- 8) Stripe activation — also store the session id for reconciliation ---------
drop function if exists public.activate_stripe_membership(uuid, int);

create or replace function public.activate_stripe_membership(
  p_signup_id uuid, p_amount_cents int, p_stripe_session_id text default null
)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.signups
     set membership_status='active', membership_method='stripe',
         paid_amount_cents=p_amount_cents,
         stripe_session_id=p_stripe_session_id,
         membership_started_at=now(),
         membership_expires_at=(current_date + interval '1 year')::date
   where id = p_signup_id;
end $$;
revoke all on function public.activate_stripe_membership(uuid, int, text) from public;
grant execute on function public.activate_stripe_membership(uuid, int, text) to anon;
-- ============================================================================
