import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ChecklistInteractive from "@/components/ChecklistInteractive";
import { CHECKLIST_INTRO } from "@/content/checklist";

export const metadata: Metadata = {
  title: "Coyote-Proofing Checklist",
  description:
    "A free, printable coyote-proofing checklist for your yard — secure food and trash, protect pets, block denning sites, and more. The single most effective way to prevent coyote conflict.",
};

export default function ChecklistPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Free tool"
        title="Coyote-proof your yard"
        subtitle="A printable checklist of the changes that actually prevent conflict — most of them free, and most starting in your own yard."
      />

      <div className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <p className="text-lg leading-relaxed text-ink/85">
            {CHECKLIST_INTRO}
          </p>
        </Reveal>

        {/* Not wrapped in Reveal — the inner progress bar is sticky, which a
            transformed ancestor would break. */}
        <div className="mt-10">
          <ChecklistInteractive />
        </div>

        <div className="mt-14 rounded-xl border-y border-line/20 bg-panel p-8 text-center print:hidden">
          <p className="text-ink/80">
            Your membership keeps tools like this free for everyone in your city.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/join"
              className="rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
            >
              Join the Council
            </Link>
            <Link
              href="/resources"
              className="rounded-lg border border-line/30 px-6 py-3 font-semibold text-heading transition hover:bg-panel"
            >
              More resources
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
