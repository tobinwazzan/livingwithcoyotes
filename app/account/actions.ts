"use server";

import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { supabase as anon } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function signOut() {
  const supabase = getSupabaseServer();
  await supabase.auth.signOut();
  redirect("/login");
}

// Lightweight header lookup: is someone signed in, and what's their first name?
export async function getHeaderUser(): Promise<{
  signedIn: boolean;
  firstName: string | null;
}> {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { signedIn: false, firstName: null };

  const db = supabaseAdmin ?? anon;
  const { data } = await db
    .from("signups")
    .select("full_name")
    .ilike("email", (user.email ?? "").trim())
    .order("created_at", { ascending: false })
    .limit(1);
  const full = (data?.[0]?.full_name as string | undefined) ?? "";
  const firstName = full.trim().split(/\s+/)[0] || null;
  return { signedIn: true, firstName };
}
