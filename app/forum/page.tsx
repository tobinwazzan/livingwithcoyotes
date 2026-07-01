import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { supabase as anon } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Avatar from "./Avatar";
import PostComposer from "./PostComposer";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const metadata: Metadata = {
  title: "Forum",
  description: "Where neighbors trade stories, questions, and what's working.",
};

const db = supabaseAdmin ?? anon;

type Author = { full_name: string | null; avatar_url: string | null };
type Post = {
  id: string;
  body: string;
  created_at: string;
  signups: Author | Author[] | null;
};

function authorOf(row: { signups: Author | Author[] | null }): Author {
  const s = Array.isArray(row.signups) ? row.signups[0] : row.signups;
  return s ?? { full_name: null, avatar_url: null };
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default async function ForumPage() {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const signedIn = !!user;

  const { data: postsRaw } = await db
    .from("forum_posts")
    .select("id, body, created_at, signups(full_name, avatar_url)")
    .eq("hidden", false)
    .order("created_at", { ascending: false })
    .limit(100);
  const posts = (postsRaw ?? []) as Post[];

  const ids = posts.map((p) => p.id);
  const { data: commentsRaw } = ids.length
    ? await db
        .from("forum_comments")
        .select("post_id")
        .eq("hidden", false)
        .in("post_id", ids)
    : { data: [] as { post_id: string }[] };
  const counts = new Map<string, number>();
  for (const c of (commentsRaw ?? []) as { post_id: string }[]) {
    counts.set(c.post_id, (counts.get(c.post_id) ?? 0) + 1);
  }

  return (
    <main>
      <PageHeader
        eyebrow="Community"
        title="The Forum"
        subtitle="Where neighbors trade stories, questions, and what's working — one honest post at a time."
      />

      <section className="mx-auto max-w-2xl px-6 py-12">
        {signedIn ? (
          <PostComposer />
        ) : (
          <div className="rounded-2xl border border-line/15 bg-card/60 p-6 text-center">
            <p className="text-ink/75">Sign in to join the conversation.</p>
            <Link
              href="/login"
              className="mt-3 inline-block rounded-lg bg-clay px-5 py-2.5 font-semibold text-sand transition hover:bg-bark"
            >
              Sign in
            </Link>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {posts.map((p) => {
            const a = authorOf(p);
            const name = a.full_name || "Member";
            const n = counts.get(p.id) ?? 0;
            return (
              <Link
                key={p.id}
                href={`/forum/${p.id}`}
                className="block rounded-2xl border border-line/15 bg-card/60 p-5 transition hover:border-clay/40"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={name} url={a.avatar_url} />
                  <div>
                    <p className="font-semibold text-heading">{name}</p>
                    <p className="text-xs text-ink/50">{timeAgo(p.created_at)}</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-ink/85">{p.body}</p>
                <p className="mt-3 text-xs font-medium text-clay">
                  {n === 0 ? "Be the first to reply" : `${n} ${n === 1 ? "reply" : "replies"}`} →
                </p>
              </Link>
            );
          })}
          {posts.length === 0 && (
            <p className="rounded-2xl border border-line/15 bg-card/60 p-8 text-center text-ink/55">
              No posts yet. Start the conversation.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
