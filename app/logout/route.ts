import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

// Reliable sign-out via a plain link/navigation (more robust than a form action).
// Clears the local session cookies and returns to the login page.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = getSupabaseServer();
  try {
    await supabase.auth.signOut({ scope: "local" });
  } catch {
    // Even if the revoke call hiccups, the cookie clear above is what matters.
  }
  return NextResponse.redirect(new URL("/login", new URL(request.url).origin));
}
