import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { FAQS, FAQ_INTRO } from "@/content/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Plain answers to the questions Orange County residents ask about coyotes — is it dangerous, how to haze, what attracts them, pet safety, why removal doesn't work, and where to report.",
};

// FAQPage structured data — built from the same source as the visible Q&A.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
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
        eyebrow="FAQ"
        title="Coyote questions, answered"
        subtitle="Plain, evidence-based answers — what's normal, what isn't, and what to actually do."
      />

      <div className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <p className="text-lg leading-relaxed text-ink/85">{FAQ_INTRO}</p>
        </Reveal>

        <div className="mt-12 space-y-8">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={(i % 4) * 60}>
              <div className="border-b border-line/15 pb-8">
                <h2 className="text-lg font-bold text-heading">{f.q}</h2>
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
