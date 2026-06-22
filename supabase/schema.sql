-- Coyote Coexistence Council (CCC) — signups table
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).

create table if not exists public.signups (
  id          uuid primary key default gen_random_uuid(),
  role        text not null,              -- resident | municipality | expert | other
  full_name   text not null,
  phone       text not null,
  email       text not null,
  city        text not null,
  linkedin    text,                       -- required only for experts/professionals
  apps        text[] default '{}',        -- which platforms they use (multi-select)
  created_at  timestamptz not null default now()
);

-- One signup per email address.
create unique index if not exists signups_email_key
  on public.signups (lower(email));

-- Row Level Security: allow anonymous visitors to INSERT a signup,
-- but never to read the list (only you, via the dashboard / service role).
alter table public.signups enable row level security;

drop policy if exists "anon can insert signups" on public.signups;
create policy "anon can insert signups"
  on public.signups
  for insert
  to anon
  with check (true);
