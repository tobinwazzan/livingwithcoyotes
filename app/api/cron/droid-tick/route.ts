import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Autonomous droid life: release ONE pre-generated mini-thread (a post + a few
// replies from other droids) from droid_queue into the live forum. Runs daily
// via Vercel Cron. Cheap, deterministic, Mac-independent — no AI at run time.
//
// Fail-closed: inert until CRON_SECRET is set. Vercel Cron sends
// `Authorization: Bearer <CRON_SECRET>`; a manual run can pass ?secret=.

const db = supabaseAdmin ?? supabase;
export const dynamic = "force-dynamic";

type Reply = { author_designator: string; body: string };
type Payload = { author_designator: string; post_body: string; replies?: Reply[] };

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "CRON_SECRET not configured" }, { status: 503 });
  const url = new URL(req.url);
  const provided =
    url.searchParams.get("secret") ||
    (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (provided !== secret) return NextResponse.json({ ok: false }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ ok: false, error: "no service role" }, { status: 503 });

  // Oldest pending thread.
  const { data: rows } = await db
    .from("droid_queue")
    .select("id, payload")
    .eq("status", "pending")
    .order("seq", { ascending: true })
    .limit(1);
  const item = rows?.[0] as { id: string; payload: Payload } | undefined;
  if (!item) return NextResponse.json({ ok: true, released: 0, note: "queue empty" });

  const p = item.payload;
  const replies = Array.isArray(p.replies) ? p.replies : [];

  // Resolve every designator in this thread to its member_id.
  const designators = [p.author_designator, ...replies.map((r) => r.author_designator)];
  const { data: droids } = await supabaseAdmin
    .from("droids")
    .select("designator, member_id")
    .in("designator", designators);
  const idOf = new Map((droids ?? []).map((d: { designator: string; member_id: string }) => [d.designator, d.member_id]));

  const authorId = idOf.get(p.author_designator);
  if (!authorId) {
    // Bad row — mark released so it doesn't jam the queue, and report.
    await supabaseAdmin.from("droid_queue").update({ status: "released", released_at: new Date().toISOString() }).eq("id", item.id);
    return NextResponse.json({ ok: false, error: "unknown author designator", designator: p.author_designator });
  }

  // Insert the post, then its replies.
  const { data: posted, error: postErr } = await supabaseAdmin
    .from("forum_posts")
    .insert({ author_id: authorId, body: p.post_body })
    .select("id")
    .single();
  if (postErr || !posted) return NextResponse.json({ ok: false, error: "post insert failed" }, { status: 500 });

  const commentRows = replies
    .map((r) => ({ author: idOf.get(r.author_designator), body: r.body }))
    .filter((r) => r.author)
    .map((r) => ({ post_id: posted.id, author_id: r.author as string, body: r.body }));
  if (commentRows.length) await supabaseAdmin.from("forum_comments").insert(commentRows);

  await supabaseAdmin
    .from("droid_queue")
    .update({ status: "released", released_at: new Date().toISOString() })
    .eq("id", item.id);

  return NextResponse.json({ ok: true, released: 1, post_id: posted.id, replies: commentRows.length });
}
