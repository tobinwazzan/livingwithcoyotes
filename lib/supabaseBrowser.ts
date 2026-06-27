import { createBrowserClient } from "@supabase/ssr";

// Auth-aware Supabase client for Client Components (the login form). Shares the
// session cookies with the server client.
export function getSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
