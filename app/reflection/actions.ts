"use server";

import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Service-role only (RLS-locked table) — same posture as the signups writes.
const db = supabaseAdmin ?? supabase;

export type ReflectionResult = { ok: boolean; token?: string; message?: string };

const clampInt = (v: unknown, min: number, max: number): number | null => {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return null;
  return Math.max(min, Math.min(n, max));
};
const cleanText = (v: unknown, cap = 5000): string =>
  String(v ?? "").trim().slice(0, cap);

// Round 1 — captured right after joining, keyed by the member's signup id
// (the same id used by the certificate link). Upserts so a re-save is safe.
export async function saveReflection(
  signupId: string,
  input: { lean: number; certainty: number; steelman: string },
): Promise<ReflectionResult> {
  if (!signupId) return { ok: false, message: "We couldn't tell which membership this is." };
  const lean = clampInt(input.lean, 1, 7);
  const certainty = clampInt(input.certainty, 0, 100);
  const steelman = cleanText(input.steelman);
  if (lean === null || certainty === null)
    return { ok: false, message: "Please set both the lean and the certainty." };

  const { data: su } = await db.from("signups").select("id").eq("id", signupId).limit(1);
  if (!su || su.length === 0) return { ok: false, message: "We couldn't find your membership." };

  const { data: existing } = await db
    .from("member_reflections")
    .select("revisit_token")
    .eq("signup_id", signupId)
    .eq("round", 1)
    .limit(1);

  if (existing && existing.length > 0) {
    await db
      .from("member_reflections")
      .update({ lean, certainty, steelman })
      .eq("signup_id", signupId)
      .eq("round", 1);
    return { ok: true, token: existing[0].revisit_token as string };
  }

  const { data: inserted, error } = await db
    .from("member_reflections")
    .insert({ signup_id: signupId, round: 1, lean, certainty, steelman })
    .select("revisit_token")
    .limit(1);
  if (error || !inserted || inserted.length === 0)
    return { ok: false, message: "Something went wrong saving your reflection. Please try again." };
  return { ok: true, token: inserted[0].revisit_token as string };
}

// Round 2 — the revisit, reached via the unguessable magic-link token.
export async function saveRevisit(
  token: string,
  input: { lean: number; certainty: number; steelman: string; moved: string },
): Promise<ReflectionResult> {
  if (!token) return { ok: false, message: "This link is missing its key." };
  const lean = clampInt(input.lean, 1, 7);
  const certainty = clampInt(input.certainty, 0, 100);
  const steelman = cleanText(input.steelman);
  const moved = cleanText(input.moved, 2000);
  if (lean === null || certainty === null)
    return { ok: false, message: "Please set both the lean and the certainty." };

  const { data: round1 } = await db
    .from("member_reflections")
    .select("signup_id")
    .eq("revisit_token", token)
    .eq("round", 1)
    .limit(1);
  if (!round1 || round1.length === 0) return { ok: false, message: "This link isn't valid." };
  const signupId = round1[0].signup_id as string;

  const { data: existing } = await db
    .from("member_reflections")
    .select("id")
    .eq("signup_id", signupId)
    .eq("round", 2)
    .limit(1);

  if (existing && existing.length > 0) {
    await db
      .from("member_reflections")
      .update({ lean, certainty, steelman, moved })
      .eq("signup_id", signupId)
      .eq("round", 2);
  } else {
    await db
      .from("member_reflections")
      .insert({ signup_id: signupId, round: 2, lean, certainty, steelman, moved });
  }
  return { ok: true };
}
