-- ============================================================================
-- Abuse-defense layer 2: revoke the public/anon EXECUTE grants on the sensitive
-- RPCs, so the ONLY way to create a lead, claim a founding spot, redeem a code,
-- record a payment, activate, log, or read the founding count is through our
-- server (which now uses the service-role key). A script hitting the public
-- REST API directly with the anon key is rejected — closing the direct-RPC
-- bypass that sidestepped the form + Turnstile.
--
-- service_role is granted explicitly so the server keeps working. purge_e2e_
-- signups stays anon (pattern-locked, 24h window) for the test teardown.
-- ============================================================================

do $$
declare fn text;
begin
  foreach fn in array array[
    'create_membership_lead(text,text,text,text,text,text,text[],text,text,jsonb)',
    'redeem_membership_code(text,uuid)',
    'record_manual_payment(uuid,text,text)',
    'activate_stripe_membership(uuid,int,text)',
    'claim_welcome_email(uuid)',
    'log_funnel_event(text,uuid,boolean,jsonb)',
    'claim_founding_membership(uuid)',
    'founding_count()'
  ]
  loop
    execute format('revoke execute on function public.%s from public', fn);
    execute format('revoke execute on function public.%s from anon', fn);
    execute format('grant execute on function public.%s to service_role', fn);
  end loop;
end $$;
-- ============================================================================
