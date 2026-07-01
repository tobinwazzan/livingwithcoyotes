import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { supabase as anon } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Avatar from "../Avatar";
import CommentComposer from "../CommentComposer";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const metadata: Metadata = {
  title: "Forum thread",
  robots: { index: false, follow: false },
};

const db = supabaseAdmin ?? anon;

type Author = { full_name: string | null; avatar_url: string | null };
type Row = {
  id: string;
  body: string;
  created_at: string;
  hidden?: boolean;
  signups: Author | Author[] | null;
};

function authorOf(row: { signups: Author | Author[] | null }): Author {
  const s = Array.isArray(row.signups) ? row.signups[0] : row.signups;
  return s ?? { full_name: null, avatar_url: null };
}

function when(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Entry({ row, size = 44 }: { row: Row; size?: number }) {
  const a = authorOf(row);
  const name = a.full_name || "Member";
  return (
    <div className="rounded-2xl border border-line/15 bg-card/60 p-5">
      <div className="flex items-center gap-3">
        <Avatar name={name} url={a.avatar_url} size={size} />
        <div>
          <p className="font-semibold text-heading">{name}</p>
          <p className="text-xs text-ink/50">{when(row.created_at)}</p>
        </div>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-ink/85">{row.body}</p>
    </div>
  );
}

export default async function ThreadPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const signedIn = !!user;

  const { data: post } = await db
    .from("forum_posts")
    .select("id, body, created_at, hidden, signups(full_name, avatar_url)")
    .eq("id", params.id)
    .limit(1)
    .maybeSingle();
  if (!post || (post as Row).hidden) notFound();

  const { data: commentsRaw } = await db
    .from("forum_comments")
    .select("id, body, created_at, signups(full_name, avatar_url)")
    .eq("post_id", params.id)
    .eq("hidden", false)
    .order("created_at", { ascending: true });
  const comments = (commentsRaw ?? []) as Row[];

  return (
    <main className="mx-auto max-w-2xl px-6 pb-16 pt-28 sm:pt-32">
      <Link href="/forum" className="text-sm font-medium text-ink/60 transition hover:text-clay">
        ← Back to the forum
      </Link>

      <div className="mt-4">
        <Entry row={post as Row} size={48} />
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-clay">
        {comments.length === 0
          ? "No replies yet"
          : `${comments.length} ${comments.length === 1 ? "reply" : "replies"}`}
      </h2>

      <div className="mt-3 space-y-3">
        {comments.map((c) => (
          <Entry key={c.id} row={c} />
        ))}
      </div>

      <div className="mt-6">
        {signedIn ? (
          <CommentComposer postId={params.id} />
        ) : (
          <div className="rounded-2xl border border-line/15 bg-card/60 p-6 text-center">
            <p className="text-ink/75">Sign in to reply.</p>
            <Link
              href="/login"
              className="mt-3 inline-block rounded-lg bg-clay px-5 py-2.5 font-semibold text-sand transition hover:bg-bark"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
