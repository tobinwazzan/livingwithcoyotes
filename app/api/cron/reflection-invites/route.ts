import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendReflectionRevisit } from "@/lib/email";

// Sends the "revisit your reflection" magic link to members whose round-1
// reflection is older than DELAY_DAYS and who haven't been invited yet (and
// haven't already done round 2). Idempotent via revisit_emailed_at.
//
// Fail-closed: inert until CRON_SECRET is set in the environment. Vercel Cron
// sends `Authorization: Bearer <CRON_SECRET>`; a manual run can pass ?secret=.

const db = supabaseAdmin ?? supabase;

export const dynamic = "force-dynamic";

const DELAY_DAYS = 42; // ~6 weeks after joining
const BATCH = 50;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET not configured" },
      { status: 503 },
    );
  }
  const url = new URL(req.url);
  const provided =
    url.searchParams.get("secret") ||
    (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (provided !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - DELAY_DAYS * 86_400_000).toISOString();
  const { data: due } = await db
    .from("member_reflections")
    .select("id, signup_id, revisit_token, created_at")
    .eq("round", 1)
    .is("revisit_emailed_at", null)
    .lte("created_at", cutoff)
    .limit(BATCH);

  if (!due || due.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const stamp = () => new Date().toISOString();
  let sent = 0;
  for (const r of due) {
    // Already revisited? Mark invited so we stop reconsidering it.
    const { data: r2 } = await db
      .from("member_reflections")
      .select("id")
      .eq("signup_id", r.signup_id)
      .eq("round", 2)
      .limit(1);
    if (r2 && r2.length > 0) {
      await db.from("member_reflections").update({ revisit_emailed_at: stamp() }).eq("id", r.id);
      continue;
    }

    const { data: su } = await db
      .from("signups")
      .select("email, full_name")
      .eq("id", r.signup_id)
      .limit(1);
    const email = su?.[0]?.email as string | undefined;
    if (!email) continue;

    const res = await sendReflectionRevisit({
      email,
      full_name: (su?.[0]?.full_name as string | null) ?? null,
      token: r.revisit_token as string,
    });
    if (res.sent) {
      await db.from("member_reflections").update({ revisit_emailed_at: stamp() }).eq("id", r.id);
      sent++;
    }
  }

  return NextResponse.json({ ok: true, sent });
}
