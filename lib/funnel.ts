import "server-only";
import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabaseAdmin";

// Prefer the service-role client so the public anon RPC grants can be revoked.
const db = supabaseAdmin ?? supabase;

export type FunnelEvent =
  | "continue_clicked"
  | "dropped_bot"
  | "invalid"
  | "lead_created"
  | "payment_started"
  | "activated"
  | "email_sent"
  | "email_failed";

/**
 * Record one funnel step. Fire-and-forget and fully swallowed: logging must
 * NEVER break the join flow. The whole point is that we can see what happened,
 * not that logging itself becomes a new failure mode.
 */
export async function logFunnel(
  event: FunnelEvent,
  opts?: { signupId?: string | null; isBot?: boolean; meta?: Record<string, unknown> },
): Promise<void> {
  try {
    await db.rpc("log_funnel_event", {
      p_event: event,
      p_signup_id: opts?.signupId ?? null,
      p_is_bot: opts?.isBot ?? false,
      p_meta: opts?.meta ?? {},
    });
  } catch {
    /* intentionally ignored — observability must not become an outage */
  }
}
