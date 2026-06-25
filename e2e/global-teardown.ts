import { createClient } from "@supabase/supabase-js";

// Purge every tagged E2E row after the run. Uses the pattern-locked
// purge_e2e_signups RPC (can only delete 'zz-e2e-%@example.com'). Needs the
// public Supabase URL + anon key in the environment; if absent, it logs a
// reminder instead of failing the run (clean up via the cleanup migration).
export default async function globalTeardown() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("[e2e] No Supabase env — skipping purge. Run the cleanup migration to remove zz-e2e-* rows.");
    return;
  }
  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase.rpc("purge_e2e_signups");
    if (error) console.warn("[e2e] purge failed:", error.message);
    else console.log(`[e2e] purged ${data} test signup(s).`);
  } catch (e) {
    console.warn("[e2e] purge threw:", e);
  }
}
