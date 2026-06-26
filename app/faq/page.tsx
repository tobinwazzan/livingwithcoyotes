import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import {
  FAQS,
  FAQ_INTRO,
  NEIGHBORS_ASKING,
  NEIGHBORS_INTRO,
  NEIGHBORS_UPDATED,
} from "@/content/faq";

export const metadata: Metadata = {
  title: "Coyote Q&A",
  description:
    "Plain, evidence-based answers to what Orange County neighbors actually ask about coyotes — is it dangerous, are they getting bolder, why removal doesn't work, pet and cat safety, how to haze, and where to report.",
};

// FAQPage structured data — built from the same source as the visible Q&A
// (the living "neighbors are asking" set plus the evergreen basics).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [...NEIGHBORS_ASKING, ...FAQS].map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHeader
        eyebrow="Coyote Q&A"
        title="Coyote questions, answered"
        subtitle="Plain, evidence-based answers — what's normal, what isn't, and what to actually do."
      />

      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Living layer: what neighbors are asking right now. Visually set apart
            from the evergreen basics, with an "updated" stamp so it reads as
            current and responsive rather than a static page. */}
        <Reveal>
          <section className="rounded-2xl border border-clay/25 bg-card/60 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clay">
                What neighbors are asking now
              </p>
              <span className="rounded-full bg-panel px-3 py-1 text-xs font-medium text-ink/70">
                Updated {NEIGHBORS_UPDATED}
              </span>
            </div>
            <p className="mt-3 leading-relaxed text-ink/80">{NEIGHBORS_INTRO}</p>

            <div className="mt-8 space-y-8">
              {NEIGHBORS_ASKING.map((f) => (
                <div
                  key={f.q}
                  className="border-t border-line/15 pt-6 first:border-t-0 first:pt-0"
                >
                  <h2 className="text-lg font-bold text-heading">{f.q}</h2>
                  <p className="mt-2 leading-relaxed text-ink/80">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Evergreen basics */}
        <Reveal>
          <h2 className="mt-16 text-sm font-semibold uppercase tracking-[0.2em] text-clay">
            The basics, answered
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-ink/85">{FAQ_INTRO}</p>
        </Reveal>

        <div className="mt-10 space-y-8">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={(i % 4) * 60}>
              <div className="border-b border-line/15 pb-8">
                <h3 className="text-lg font-bold text-heading">{f.q}</h3>
                <p className="mt-2 leading-relaxed text-ink/80">{f.a}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 rounded-xl border-y border-line/20 bg-panel p-8 text-center">
            <p className="text-ink/80">
              Want the videos and printable guides behind these answers?
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/resources"
                className="rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
              >
                Browse the resources
              </Link>
              <Link
                href="/join"
                className="rounded-lg border border-line/30 px-6 py-3 font-semibold text-heading transition hover:bg-panel"
              >
                Join the Council
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
