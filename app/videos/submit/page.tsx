import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import VideoForm from "@/components/VideoForm";

export const metadata: Metadata = {
  title: "Share a video",
  description: "Share a coyote video with the Coyote Coexistence Council. We embed it from its original platform, with credit — only videos you filmed or have permission to share.",
};

export default function SubmitVideoPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Videos"
        title="Share a video"
        subtitle="Paste a link and we&apos;ll embed it, credited, from wherever it was posted. Nothing is copied or re-hosted."
      />

      <div className="mx-auto max-w-2xl px-6 py-14">
        <Reveal>
          <div className="rounded-xl border border-clay/40 bg-clay/10 p-5 text-sm leading-relaxed text-ink">
            <p className="font-semibold text-heading">Only videos you have the right to share.</p>
            <p className="mt-1 text-ink/80">
              Please share videos you filmed yourself, or ones you have the
              poster&apos;s permission to feature. We embed from the original
              platform and credit the source — we don&apos;t download or re-host
              anyone&apos;s video.
            </p>
          </div>
        </Reveal>

        <div className="mt-8">
          <VideoForm />
        </div>

        <Reveal>
          <p className="mt-10 text-center text-sm text-ink/60">
            Just want to watch?{" "}
            <Link href="/videos" className="font-semibold text-clay hover:text-ink">
              See the videos →
            </Link>
          </p>
        </Reveal>
      </div>
    </main>
  );
}
