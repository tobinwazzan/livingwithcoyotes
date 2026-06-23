import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly in dev if env vars are missing.
  console.warn(
    "Supabase env vars missing. Copy .env.local.example to .env.local and fill in your values.",
  );
}

// Fall back to a syntactically-valid placeholder so the client constructs at
// build time even when env vars are absent (local/CI). Production sets the real
// values in Vercel. Pages that actually query are request-time (dynamic) only.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
);
