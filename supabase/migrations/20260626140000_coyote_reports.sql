-- ============================================================================
-- Coyote incident reports — "Report a coyote".
--
-- The CCC board's MVP after the Q&A digest: turn panic-posting into structured,
-- actionable data. Design follows their guidance:
--   * Collect INTERACTIONS by severity tier, not raw "I saw one" noise (Quinn).
--   * Capture attractants + pet/leash status — the root-cause fields (White).
--   * NEVER store an exact home address; location is coarse (city + area) so a
--     public map can't pin a household (Quinn, privacy).
--   * No account required to submit; the write happens server-side via the
--     service-role client, so the table needs RLS with NO anon policies — anon
--     can neither read nor write it directly (matches the signups lockdown).
--
-- Reads (admin + the calm public aggregate) are server-side via service_role,
-- exactly like the members table — so there is no anon-facing RPC surface here.
-- ============================================================================

create table if not exists public.coyote_reports (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- Severity tier (resident-friendly). Routine sighting → urgent. Validated
  -- again in the server action; the check is the backstop.
  category      text not null check (category in (
    'sighting',      -- saw a coyote (routine)
    'encounter',     -- came close, lingered, or approached
    'pet_chase',     -- chased or threatened a pet (no injury)
    'pet_attack',    -- injured or killed a pet
    'person',        -- acted aggressively toward a person (followed / nipped)
    'other'
  )),

  occurred_on   date,                       -- when it happened (optional; coarse)
  time_of_day   text,                       -- dawn | morning | midday | afternoon | dusk | night | unknown

  city          text not null,              -- required: the only location we rely on
  area          text,                       -- coarse: cross-street / park / landmark — NOT a street address

  behavior      text,                       -- avoided | indifferent | approached | followed | aggressive | unknown
  pet_involved  text,                       -- none | dog_leashed | dog_offleash | dog_unattended | cat_outdoor | other_pet
  attractants   text[] not null default '{}', -- trash | feeding | fruit | pet_food | cat_colony | water | none | unknown
  action_taken  text,                       -- hazed | left | nothing | reported_elsewhere | other
  note          text,                       -- short optional free text (capped server-side)

  -- Optional contact, only if the reporter wants follow-up. Kept out of any
  -- public view; visible to admins only.
  reporter_name  text,
  reporter_email text,
  contact_ok     boolean not null default false,

  source        text not null default 'web',
  status        text not null default 'new' check (status in ('new','reviewed','actioned','archived')),
  meta          jsonb not null default '{}'::jsonb
);

-- RLS on, no policies: the public anon role cannot read or write this table.
-- All access is through the service-role server (admin reads, aggregate reads,
-- and the validated report insert in the server action).
alter table public.coyote_reports enable row level security;

-- Aggregate/admin read indexes.
create index if not exists coyote_reports_created_idx  on public.coyote_reports (created_at desc);
create index if not exists coyote_reports_category_idx on public.coyote_reports (category);
create index if not exists coyote_reports_city_idx     on public.coyote_reports (lower(city));

comment on table public.coyote_reports is
  'CCC incident reports. RLS-locked; service-role access only. Location is coarse (city + area) by design — never an exact address.';
