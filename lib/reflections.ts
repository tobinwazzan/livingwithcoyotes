import "server-only";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Shared server helpers for member reflections (the Steelman Mirror timeline).
// Kept out of a "use server" file on purpose: appendReflection takes a signup_id
// directly, so it must NOT be exposed as a callable server action. The action
// wrappers (authed / token-bound) live in app/*/actions.ts and call these.
const db = supabaseAdmin ?? supabase;

export type ReflectionInput = {
  lean: number;
  certainty: number;
  steelman: string;
  moved: string;
};
export type ReflectionResult = { ok: boolean; message?: string };

export type ReflectionRow = {
  round: number;
  lean: number | null;
  certainty: number | null;
  steelman: string | null;
  moved: string | null;
  visibility: string;
  created_at: string;
};

const clampInt = (v: unknown, min: number, max: number): number | null => {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return null;
  return Math.max(min, Math.min(n, max));
};
const cleanText = (v: unknown, cap = 5000): string =>
  String(v ?? "").trim().slice(0, cap);

// Append a new check-in (round = current max + 1) for a member.
export async function appendReflection(
  signupId: string,
  input: ReflectionInput,
): Promise<ReflectionResult> {
  if (!signupId) return { ok: false, message: "We couldn't tell which membership this is." };
  const lean = clampInt(input.lean, 1, 7);
  const certainty = clampInt(input.certainty, 0, 100);
  const steelman = cleanText(input.steelman);
  const moved = cleanText(input.moved, 2000);
  if (lean === null || certainty === null)
    return { ok: false, message: "Please set both the lean and the certainty." };

  const { data: rows } = await db
    .from("member_reflections")
    .select("round")
    .eq("signup_id", signupId)
    .order("round", { ascending: false })
    .limit(1);
  const nextRound = ((rows?.[0]?.round as number | undefined) ?? 0) + 1;

  const { error } = await db.from("member_reflections").insert({
    signup_id: signupId,
    round: nextRound,
    lean,
    certainty,
    steelman,
    moved,
  });
  if (error)
    return { ok: false, message: "Something went wrong saving your reflection. Please try again." };
  return { ok: true };
}

// All reflections for a member, oldest → newest.
export async function reflectionsForSignup(signupId: string): Promise<ReflectionRow[]> {
  const { data } = await db
    .from("member_reflections")
    .select("round, lean, certainty, steelman, moved, visibility, created_at")
    .eq("signup_id", signupId)
    .order("round", { ascending: true });
  return (data ?? []) as ReflectionRow[];
}

// Resolve a member's signup_id from a round-1 revisit token (for the magic-link path).
export async function signupIdFromToken(token: string): Promise<string | null> {
  if (!token) return null;
  const { data } = await db
    .from("member_reflections")
    .select("signup_id")
    .eq("revisit_token", token)
    .eq("round", 1)
    .limit(1);
  return (data?.[0]?.signup_id as string | undefined) ?? null;
}

// Set visibility (private | shared_anon | shared_named) on a member's LATEST
// reflection — the one a member shares from the mirror.
export async function setLatestVisibility(
  signupId: string,
  visibility: "private" | "shared_anon" | "shared_named",
): Promise<ReflectionResult> {
  if (!["private", "shared_anon", "shared_named"].includes(visibility))
    return { ok: false, message: "Invalid choice." };
  const { data: rows } = await db
    .from("member_reflections")
    .select("round")
    .eq("signup_id", signupId)
    .order("round", { ascending: false })
    .limit(1);
  const round = rows?.[0]?.round as number | undefined;
  if (!round) return { ok: false, message: "No reflection to share yet." };
  const { error } = await db
    .from("member_reflections")
    .update({ visibility })
    .eq("signup_id", signupId)
    .eq("round", round);
  if (error) return { ok: false, message: "Couldn't update your choice." };
  return { ok: true };
}
