-- ============================================================================
-- Member reflections — "The Steelman Mirror".
--
-- A private member self-reflection that measures growth in the SKILL OF DOUBT:
-- can the member make the strongest case for the side they lean against, and
-- does their certainty soften over time? It never measures movement toward a
-- "right" answer — both extremes can grow equally.
--
-- Two rounds per member:
--   round 1 — captured right after joining (the baseline snapshot)
--   round 2 — the "revisit", weeks later, reached via an unguessable magic link
--
-- Privacy: RLS on, NO anon policies — exactly like coyote_reports and signups.
-- All access is server-side via the service-role client. The data is NEVER
-- shown publicly or to other members in v1 (the `visibility` column is
-- communal-ready for a future opt-in "wall of understanding", default private).
-- Before any study uses this data, a data-use line must land in the privacy
-- policy — see memory ccc-steelman-mirror.
-- ============================================================================

create table if not exists public.member_reflections (
  id            uuid primary key default gen_random_uuid(),
  signup_id     uuid not null references public.signups(id) on delete cascade,

  round         smallint not null default 1 check (round in (1, 2)),

  -- Bipolar lean scale, 1 (people/pets first — remove entirely) .. 7 (coyotes'
  -- place first — even above pets and children). 4 = neither has priority.
  lean          smallint check (lean between 1 and 7),
  -- Attitude strength, 0 (still figuring it out) .. 100 (completely sure).
  certainty     smallint check (certainty between 0 and 100),
  -- The steelman: the strongest case for the side they lean AGAINST.
  steelman      text,
  -- round 2 only: a private line on what moved, or what held.
  moved         text,

  -- Communal-ready, default private. No UI exposes anything but 'private' in v1.
  visibility    text not null default 'private'
                  check (visibility in ('private', 'shared_anon', 'shared_named')),

  -- The magic-link key for the revisit. Unguessable; the round-1 token is what
  -- the revisit invite email carries.
  revisit_token uuid not null default gen_random_uuid(),
  -- Set when the revisit invite has been emailed, so the cron never double-sends.
  revisit_emailed_at timestamptz,

  created_at    timestamptz not null default now()
);

-- One row per (member, round) — re-saving a round updates in place.
create unique index if not exists member_reflections_signup_round_idx
  on public.member_reflections (signup_id, round);
create index if not exists member_reflections_token_idx
  on public.member_reflections (revisit_token);
create index if not exists member_reflections_round1_pending_idx
  on public.member_reflections (created_at)
  where round = 1 and revisit_emailed_at is null;

-- RLS on, no policies: the anon role cannot read or write. Service-role only.
alter table public.member_reflections enable row level security;

comment on table public.member_reflections is
  'Steelman Mirror — private member reflections (lean / certainty / steelman). RLS-locked, service-role only. visibility is communal-ready but private in v1.';
