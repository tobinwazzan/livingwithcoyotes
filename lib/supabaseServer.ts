import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Auth-aware Supabase client for Server Components, Route Handlers, and Server
// Actions. Reads/writes the session cookies. In a Server Component the cookie
// write is a no-op (Next forbids it) — the middleware refreshes the session, so
// reads stay valid.
export function getSupabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — safe to ignore (middleware refreshes).
          }
        },
      },
    },
  );
}
