-- ============================================================================
-- Wall of Fame, v2: optional member photos.
--  * photo_url on signups (a public URL in the 'avatars' bucket, or null).
--  * 'avatars' public bucket (5MB, images only) so the wall can show faces.
--  * public_supporters() now returns photo_url alongside the sanitized name.
-- ============================================================================

alter table public.signups
  add column if not exists photo_url text;

-- Public avatars bucket — readable by anyone (it's the wall), image uploads only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880,
        array['image/png','image/jpeg','image/webp'])
on conflict (id) do update
  set public = true, file_size_limit = 5242880,
      allowed_mime_types = array['image/png','image/jpeg','image/webp'];

-- Anyone may upload an avatar (a prospective member, pre-signup). The URL is
-- only ever shown if they later opt in to the wall, and we validate server-side
-- that a stored photo_url really points at this bucket.
drop policy if exists "avatars_anon_insert" on storage.objects;
create policy "avatars_anon_insert" on storage.objects
  for insert to anon with check (bucket_id = 'avatars');

-- Recreate the public supporters view with photo_url.
drop function if exists public.public_supporters();
create or replace function public.public_supporters()
returns table(display text, city text, is_patron boolean, photo_url text, joined date)
language sql security definer set search_path = public stable as $$
  select
    case wall_display
      when 'full'  then full_name
      when 'first' then split_part(full_name, ' ', 1)
    end as display,
    city,
    coalesce(paid_amount_cents, 0) >= 5000 as is_patron,
    photo_url,
    membership_started_at::date as joined
  from public.signups
  where membership_status = 'active'
    and wall_display in ('first','full')
  order by (coalesce(paid_amount_cents,0) >= 5000) desc, membership_started_at asc nulls last;
$$;
revoke all on function public.public_supporters() from public;
grant execute on function public.public_supporters() to anon, service_role;
-- ============================================================================
