import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import VideoEmbed, { type VideoCard } from "@/components/VideoEmbed";
import { supabase as anon } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = {
  title: "Videos",
  description: "Coyote videos from around South Orange County — embedded from their original platforms, with credit. Share your own.",
};

const db = supabaseAdmin ?? anon;

export default async function VideosPage() {
  const { data } = await db
    .from("videos")
    .select("id, platform, embed_url, url, title, credit, city")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(120);
  const videos = (data ?? []) as VideoCard[];

  return (
    <main>
      <PageHeader
        eyebrow="Community"
        title="Videos"
        subtitle="Coyote moments from around South Orange County — shared by neighbors, embedded from where they were posted, always credited."
      />

      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-ink/75">
            Have a clip worth sharing? We embed it from its original platform and
            credit whoever made it — nothing is copied or re-hosted.
          </p>
          <Link
            href="/videos/submit"
            className="shrink-0 rounded-lg bg-clay px-5 py-2.5 font-semibold text-sand transition hover:bg-bark"
          >
            Share a video →
          </Link>
        </div>

        {videos.length === 0 ? (
          <div className="rounded-2xl border border-line/20 bg-card/50 p-10 text-center">
            <p className="text-lg font-semibold text-heading">No videos yet.</p>
            <p className="mx-auto mt-2 max-w-md text-ink/70">
              Be the first to share one — a coyote crossing, a coexistence tip, a
              neighborhood moment. We&apos;ll add it with credit.
            </p>
            <Link href="/videos/submit" className="mt-6 inline-block rounded-lg border border-line/30 px-4 py-2 text-sm font-semibold text-heading transition hover:bg-card">
              Share the first video →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <VideoEmbed key={v.id} v={v} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
