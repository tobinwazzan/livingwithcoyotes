"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { supabase as anon } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type PostResult = { ok: boolean; message?: string };

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

export async function createPost(body: string): Promise<PostResult> {
  const text = (body ?? "").trim();
  if (text.length < 2) return { ok: false, message: "Say a little more." };
  if (text.length > 5000)
    return { ok: false, message: "That's a lot — keep it under 5000 characters." };

  const signupId = await mySignupId();
  if (!signupId) return { ok: false, message: "Please sign in to post." };

  const db = supabaseAdmin ?? anon;
  const { error } = await db
    .from("forum_posts")
    .insert({ author_id: signupId, body: text });
  if (error) return { ok: false, message: "Couldn't post — please try again." };

  revalidatePath("/forum");
  return { ok: true };
}

export async function createComment(
  postId: string,
  body: string,
): Promise<PostResult> {
  const text = (body ?? "").trim();
  if (text.length < 1) return { ok: false, message: "Write a reply first." };
  if (text.length > 5000)
    return { ok: false, message: "Keep it under 5000 characters." };

  const signupId = await mySignupId();
  if (!signupId) return { ok: false, message: "Please sign in to reply." };

  const db = supabaseAdmin ?? anon;
  const { error } = await db
    .from("forum_comments")
    .insert({ post_id: postId, author_id: signupId, body: text });
  if (error) return { ok: false, message: "Couldn't reply — please try again." };

  revalidatePath(`/forum/${postId}`);
  return { ok: true };
}
