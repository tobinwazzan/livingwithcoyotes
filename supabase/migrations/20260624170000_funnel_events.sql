-- ============================================================================
-- Funnel observability — so a silent failure can NEVER again be invisible.
-- Every step of the join flow logs an event here (server-side). Bots are tagged
-- so they don't inflate human numbers. Insert-only via a security-definer RPC;
-- anon can't read it (admin/service-role only).
--
-- Events: continue_clicked, dropped_bot, invalid, lead_created,
--         payment_started, activated, email_sent, email_failed
-- ============================================================================

create table if not exists public.funnel_events (
  id          bigint generated always as identity primary key,
  event       text not null,
  signup_id   uuid,
  is_bot      boolean not null default false,
  meta        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists funnel_events_event_idx   on public.funnel_events (event);
create index if not exists funnel_events_created_idx  on public.funnel_events (created_at desc);
create index if not exists funnel_events_signup_idx   on public.funnel_events (signup_id);

alter table public.funnel_events enable row level security;
-- No anon policies: not readable/writable directly. All writes go through the RPC.

-- Insert-only logger. Whitelisted event names + a hard cap on meta size keep the
-- public anon grant from being abused into a junk/spam sink.
create or replace function public.log_funnel_event(
  p_event text,
  p_signup_id uuid default null,
  p_is_bot boolean default false,
  p_meta jsonb default '{}'::jsonb
) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_event not in (
    'continue_clicked','dropped_bot','invalid','lead_created',
    'payment_started','activated','email_sent','email_failed'
  ) then
    return; -- ignore anything not in the funnel vocabulary
  end if;
  insert into public.funnel_events (event, signup_id, is_bot, meta)
  values (
    p_event,
    p_signup_id,
    coalesce(p_is_bot, false),
    case when pg_column_size(coalesce(p_meta,'{}'::jsonb)) <= 2000
         then coalesce(p_meta,'{}'::jsonb) else '{}'::jsonb end
  );
end $$;
revoke all on function public.log_funnel_event(text, uuid, boolean, jsonb) from public;
grant execute on function public.log_funnel_event(text, uuid, boolean, jsonb) to anon;

-- Convenience read for the admin layer (service-role) and quick diagnostics:
-- a rolling funnel summary over a window.
create or replace function public.funnel_summary(p_since timestamptz default now() - interval '24 hours')
returns table(event text, humans bigint, bots bigint)
language sql security definer set search_path = public as $$
  select event,
         count(*) filter (where not is_bot) as humans,
         count(*) filter (where is_bot)     as bots
    from public.funnel_events
   where created_at >= p_since
   group by event
   order by event;
$$;
revoke all on function public.funnel_summary(timestamptz) from public;
-- Not granted to anon — admin/service-role only.
-- ============================================================================
