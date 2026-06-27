import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

// Exchanges the magic-link code for a session and redirects into the account.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = getSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next.startsWith("/") ? next : "/account"}`);
    }
  }
  return NextResponse.redirect(`${origin}/login?error=link`);
}
