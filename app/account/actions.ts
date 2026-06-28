"use server";

import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { supabase as anon } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  appendReflection,
  type ReflectionInput,
  type ReflectionResult,
} from "@/lib/reflections";

// Resolve the signed-in member's signup id (by email), or null.
async function mySignupId(): Promise<string | null> {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;
  const db = supabaseAdmin ?? anon;
  const { data } = await db
    .from("signups")
    .select("id")
    .ilike("email", user.email.trim())
    .order("created_at", { ascending: false })
    .limit(1);
  return (data?.[0]?.id as string | undefined) ?? null;
}

// Add a new check-in from the logged-in member's account.
export async function addReflectionForMe(
  input: ReflectionInput,
): Promise<ReflectionResult> {
  const signupId = await mySignupId();
  if (!signupId) return { ok: false, message: "Please sign in to add a reflection." };
  return appendReflection(signupId, input);
}

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
