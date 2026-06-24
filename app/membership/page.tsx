import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Why membership matters and what it offers. Coexistence takes a funded, organized, accountable effort — $19 a year is how a volunteer council becomes a real one.",
};

const why = [
  {
    title: "The work is real, and it isn't free",
    body: "Hosting the tools, producing plain-language guides, standing up neighborhood hazing programs, and handing cities a turnkey package all cost time and money. Membership funds it directly.",
  },
  {
    title: "Members are the mandate",
    body: "A city listens when its residents organize. Every member is a signal — grouped by city — that coexistence has real local demand behind it.",
  },
  {
    title: "Accountable, not just well-meaning",
    body: "Your dues fund an evidence-first, non-lethal-first effort that measures whether conflicts actually go down — and says so when they don't.",
  },
];

const offers = [
  {
    title: "A seat at the table",
    body: "Grouped by your city, your experience and concerns feed directly into the plans your city considers.",
  },
  {
    title: "You keep it free for everyone",
    body: "Your dues fund the guidance, videos, and tools the Council gives away — free for every resident in your city, member or not.",
  },
  {
    title: "Tools as they launch",
    body: "A coyote-proofing yard checklist, pet-safety protocols, seasonal explainers, and the sightings-and-incidents map.",
  },
  {
    title: "A say and the updates",
    body: "Where the Council is heading, what's working, and a voice in shaping the plan as it takes form.",
  },
  {
    title: "Non-lethal by conviction",
    body: "You're funding coexistence and attractant management — not culling, not panic, not removal that just resets the cycle.",
  },
  {
    title: "A founding member",
    body: "Join now and you're on the ground floor — part of the Council's founding membership, before coexistence was the easy choice.",
  },
];

export default function MembershipPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Membership"
        title="Why join the Council"
        subtitle="Coexistence doesn't happen in a viral thread. It takes a funded, organized effort — and $19 a year is how a volunteer council becomes a real one."
      />

      {/* Top CTA — join without scrolling */}
      <div className="mx-auto max-w-5xl px-6 pt-8 text-center">
        <Link
          href="/join"
          className="inline-block rounded-lg bg-clay px-7 py-3 font-semibold text-sand transition hover:bg-bark"
        >
          Join the Council — $19/yr
        </Link>
      </div>

      {/* Why it matters */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <h2 className="text-center text-2xl font-bold text-heading sm:text-3xl">
            Why membership matters
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {why.map((w, i) => (
            <Reveal key={w.title} delay={i * 100} className="h-full">
              <div className="h-full rounded-xl border border-line/15 bg-card/60 p-6">
                <h3 className="font-semibold text-clay">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">
                  {w.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What it offers */}
      <section className="bg-card/50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-heading sm:text-3xl">
              What your membership offers
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-ink/70">
              For $19 a year.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((o, i) => (
              <Reveal key={o.title} delay={i * 80} className="h-full">
                <div className="h-full rounded-xl border border-line/15 bg-card p-6 shadow-sm">
                  <h3 className="font-semibold text-clay">{o.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/80">
                    {o.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <h2 className="text-2xl font-bold text-heading sm:text-3xl">
            How membership works
          </h2>
          <ul className="mt-6 space-y-3">
            {[
              "Membership is $19 per year.",
              "Pay by card, Venmo, or Zelle — card adds a small processing fee so the Council nets the full $19.",
              "Paying by Venmo or Zelle? Upload a receipt and you're in.",
              "Your information is saved either way — you can join now or decide later and stay on the list.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-clay" />
                <span className="text-ink/85">{line}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="border-y border-line/20 bg-panel py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-heading sm:text-3xl">
              Ready when you are
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-ink/75">
              Tell us your city and how you'd like to help. It takes two minutes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
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
                Browse the resources
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
