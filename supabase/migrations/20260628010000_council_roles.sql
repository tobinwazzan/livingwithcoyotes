-- ============================================================================
-- Aspirational council roles. People self-select the role they'd like to PLAY
-- on the Council (bystander resident, SME, municipality rep, coordinator, admin,
-- or "other" with a free-text label in meta.role_other). This grants NOTHING —
-- it's a stated interest. Real admin / municipal-rep status stays invitation +
-- approval only. So self-selection is safe; no verification gate.
--
-- Widens the allowed role set on signups + the create_membership_lead whitelist.
-- Keeps the old values too (additive, nothing breaks). Grants stay service-role
-- only, matching the lockdown — never re-grant anon.
-- ============================================================================

alter table public.signups drop constraint if exists signups_role_chk;
alter table public.signups add constraint signups_role_chk
  check (role in (
    'resident','municipality','expert','partner','other',
    'sme','municipality_rep','coordinator','admin'
  )) not valid;

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
  if v_role = '' then v_role := 'resident'; end if;
  if v_role not in (
    'resident','municipality','expert','partner','other',
    'sme','municipality_rep','coordinator','admin'
  ) then
    raise exception 'invalid_role';
  end if;
  if char_length(v_name)  < 2  or char_length(v_name)  > 120 then raise exception 'invalid_name';  end if;
  if char_length(v_phone) < 7  or char_length(v_phone) > 40  then raise exception 'invalid_phone'; end if;
  if char_length(v_email) > 200 or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'invalid_email';
  end if;
  if char_length(v_city)  < 2  or char_length(v_city)  > 120 then raise exception 'invalid_city';  end if;
  if v_link is not null and char_length(v_link) > 300 then raise exception 'invalid_linkedin'; end if;

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
         source   = coalesce(public.signups.source, excluded.source),
         referrer = coalesce(public.signups.referrer, excluded.referrer),
         meta     = public.signups.meta || excluded.meta
  returning id into v_id;
  return v_id;
end $$;

revoke execute on function public.create_membership_lead(text,text,text,text,text,text,text[],text,text,jsonb) from anon;
grant  execute on function public.create_membership_lead(text,text,text,text,text,text,text[],text,text,jsonb) to service_role;
