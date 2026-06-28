-- ============================================================================
-- Steelman Mirror — timeline + wall of understanding.
--
--  * Relax the 2-round cap so a member can keep adding check-ins over time
--    (round 1 = join capture, 2 = magic-link revisit, 3+ = self-initiated).
--  * Add a `hidden` flag for admin moderation of shared entries.
--  * Add a SANITIZED public read (public_understanding) so opted-in steelmans
--    can appear on a read-only "wall of understanding" — mirrors the
--    public_supporters() pattern: security-definer, returns only safe fields,
--    never email / amount / private rows. Anonymous rows expose NO identity.
-- ============================================================================

-- 1) Allow unlimited rounds (was: check (round in (1,2))).
alter table public.member_reflections
  drop constraint if exists member_reflections_round_check;
alter table public.member_reflections
  add constraint member_reflections_round_ck check (round >= 1);

-- 2) Moderation flag.
alter table public.member_reflections
  add column if not exists hidden boolean not null default false;

-- 3) Sanitized public wall of shared steelmans. Same posture as
--    public_supporters(): runs at definer privilege, returns only safe columns.
--    'shared_named' → first name only; 'shared_anon' → display is null (the page
--    renders "A neighbor"). Private + hidden + empty rows never appear.
create or replace function public.public_understanding()
returns table (
  display    text,
  lean       smallint,
  certainty  smallint,
  steelman   text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select
    case r.visibility
      when 'shared_named' then nullif(split_part(s.full_name, ' ', 1), '')
      else null
    end as display,
    r.lean,
    r.certainty,
    r.steelman,
    r.created_at
  from public.member_reflections r
  join public.signups s on s.id = r.signup_id
  where r.visibility in ('shared_anon', 'shared_named')
    and r.hidden = false
    and coalesce(r.steelman, '') <> ''
  order by r.created_at desc;
$$;

grant execute on function public.public_understanding() to anon, service_role;

comment on function public.public_understanding() is
  'Sanitized public wall of opted-in shared steelmans. Returns only display (first name if named, else null), lean, certainty, steelman, created_at. Never email/amount/private rows.';
