-- ============================================================================
-- CCC Membership — $25/yr, unique single-use codes (honorary / council),
-- Stripe + Venmo/Zelle. Run this in the Supabase SQL editor (Dashboard → SQL).
-- Additive and safe: the existing signup form keeps working unchanged.
-- ============================================================================

-- 1) Membership fields on the existing signups table -------------------------
alter table public.signups
  add column if not exists membership_status     text not null default 'lead', -- lead | active
  add column if not exists membership_method     text,                          -- stripe | venmo | zelle | code
  add column if not exists membership_code        text,
  add column if not exists paid_amount_cents      int,
  add column if not exists membership_started_at  timestamptz,
  add column if not exists membership_expires_at   date,
  add column if not exists receipt_path           text;                         -- object path in 'receipts' bucket

-- 2) Codes table — unique, single-use, typed ---------------------------------
create table if not exists public.membership_codes (
  code        text primary key,
  type        text not null check (type in ('honorary_municipal','honorary_expert','council')),
  note        text,                         -- who this code is for
  used_by     uuid references public.signups(id),
  used_email  text,
  used_at     timestamptz,
  created_at  timestamptz not null default now()
);
alter table public.membership_codes enable row level security;
-- No anon policies on purpose: codes are never directly readable/writable by
-- the public. All access goes through the security-definer functions below.

-- 3) Create / upsert a membership lead, returning its id ----------------------
--    (signups is insert-only for anon and not readable, so we need an RPC to
--     hand the new row's id back to the browser for the payment step.)
create or replace function public.create_membership_lead(
  p_role text, p_full_name text, p_phone text, p_email text,
  p_city text, p_linkedin text, p_apps text[]
) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.signups (role, full_name, phone, email, city, linkedin, apps)
  values (p_role, p_full_name, p_phone, p_email, p_city, nullif(p_linkedin,''), coalesce(p_apps,'{}'))
  on conflict (lower(email)) do update
     set full_name = excluded.full_name, phone = excluded.phone,
         city = excluded.city, role = excluded.role,
         linkedin = excluded.linkedin, apps = excluded.apps
  returning id into v_id;
  return v_id;
end $$;
revoke all on function public.create_membership_lead(text,text,text,text,text,text,text[]) from public;
grant execute on function public.create_membership_lead(text,text,text,text,text,text,text[]) to anon;

-- 4) Redeem a code: atomically claim an unused code for a signup --------------
create or replace function public.redeem_membership_code(p_code text, p_signup_id uuid)
returns text  -- returns the code type on success; raises 'invalid_or_used_code' otherwise
language plpgsql security definer set search_path = public as $$
declare v_type text;
begin
  update public.membership_codes c
     set used_by = p_signup_id, used_at = now(),
         used_email = (select email from public.signups where id = p_signup_id)
   where lower(c.code) = lower(btrim(p_code)) and c.used_by is null
   returning c.type into v_type;

  if v_type is null then raise exception 'invalid_or_used_code'; end if;

  update public.signups
     set membership_status='active', membership_method='code',
         membership_code = btrim(p_code),
         membership_started_at = now(),
         membership_expires_at = (current_date + interval '1 year')::date
   where id = p_signup_id;
  return v_type;
end $$;
revoke all on function public.redeem_membership_code(text, uuid) from public;
grant execute on function public.redeem_membership_code(text, uuid) to anon;

-- 5) Record a manual (Venmo/Zelle) payment after receipt upload ---------------
create or replace function public.record_manual_payment(p_signup_id uuid, p_method text, p_receipt_path text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_method not in ('venmo','zelle') then raise exception 'bad_method'; end if;
  update public.signups
     set membership_status='active', membership_method=p_method,
         paid_amount_cents=2500, receipt_path=p_receipt_path,
         membership_started_at=now(),
         membership_expires_at=(current_date + interval '1 year')::date
   where id = p_signup_id;
end $$;
revoke all on function public.record_manual_payment(uuid, text, text) from public;
grant execute on function public.record_manual_payment(uuid, text, text) to anon;

-- 6) Activate a Stripe membership (called server-side after verifying session)-
create or replace function public.activate_stripe_membership(p_signup_id uuid, p_amount_cents int)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.signups
     set membership_status='active', membership_method='stripe',
         paid_amount_cents=p_amount_cents,
         membership_started_at=now(),
         membership_expires_at=(current_date + interval '1 year')::date
   where id = p_signup_id;
end $$;
revoke all on function public.activate_stripe_membership(uuid, int) from public;
grant execute on function public.activate_stripe_membership(uuid, int) to anon;

-- 7) Receipts storage bucket (private) + anon upload-only policy --------------
insert into storage.buckets (id, name, public) values ('receipts','receipts', false)
  on conflict (id) do nothing;
drop policy if exists "anon can upload receipts" on storage.objects;
create policy "anon can upload receipts" on storage.objects
  for insert to anon with check (bucket_id = 'receipts');

-- ============================================================================
-- Issuing codes (examples) — run as needed. Codes are unique & single-use.
--   insert into public.membership_codes (code, type, note) values
--     ('IRVINE-COUNCIL-7F3A', 'honorary_municipal', 'City of Irvine rep'),
--     ('EXPERT-QUINN-22B9',   'honorary_expert',    'Dr. Niamh Quinn'),
--     ('COUNCIL-TW-0001',     'council',            'Founding council member');
-- Generate a random batch:
--   insert into public.membership_codes (code, type, note)
--   select 'CCC-' || upper(substr(md5(random()::text),1,8)), 'council', 'batch'
--   from generate_series(1,10);
-- ============================================================================
