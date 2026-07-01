-- Forum: member-authored posts + comments.
-- RLS is enabled with no anon policies; all reads and writes go through the
-- service-role client inside server actions, exactly like signups /
-- coyote_reports / member_reflections.

create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.signups(id) on delete cascade,
  body text not null,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists forum_posts_created_idx on public.forum_posts (created_at desc);

create table if not exists public.forum_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  author_id uuid not null references public.signups(id) on delete cascade,
  body text not null,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists forum_comments_post_idx on public.forum_comments (post_id, created_at);

alter table public.forum_posts enable row level security;
alter table public.forum_comments enable row level security;

-- Public profile fields on signups:
--   avatar_url — shown on forum posts (humans fall back to initials).
--   is_droid   — flags synthetic "droid" members so the admin dashboard can keep
--                real contributions separate from droid (simulated) money.
alter table public.signups add column if not exists avatar_url text;
alter table public.signups add column if not exists is_droid boolean not null default false;
