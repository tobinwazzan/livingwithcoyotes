import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { ADVISORY_SEATS } from "@/content/board";

export const metadata: Metadata = {
  title: "About",
  description:
    "Coyotes are part of daily life in Orange County. The Coyote Coexistence Council brings residents, wildlife experts, and municipal leaders to one table to weigh the evidence together — a conversation, not a verdict.",
};

const tiers = [
  {
    title: "Residents",
    body: "Neighbors grouped by city, sharing on-the-ground experience and local concerns.",
  },
  {
    title: "Municipalities",
    body: "City staff and officials who set policy and put plans into practice.",
  },
  {
    title: "Experts & professionals",
    body: "Wildlife biologists, vets, animal-control, and shelter staff — grounding decisions in evidence and frontline data.",
  },
  {
    title: "Stewards",
    body: "Admins who keep the dialogue open, respectful, and moving toward action.",
  },
];

const beliefs = [
  {
    title: "Evidence over assumption",
    body: "Every response we endorse must be grounded in what the data show — not in fear, and not in the path of least administrative resistance. We measure whether conflicts actually go down, and we say so when they don't.",
  },
  {
    title: "Coexistence, not removal",
    body: "Our goal is genuine shared space, not the quiet elimination of an inconvenient neighbor. The question is never only “what do we do about this coyote?” but “what created this, and what prevents the next one?”",
  },
  {
    title: "Non-lethal first — stated honestly",
    body: "Non-lethal tools are the first, default, and strongly preferred response, with attractant management underneath everything. We won't pretend “non-lethal first” means “never” — a credible council needs a transparent, last-resort protocol, not an absolutist promise it can't keep.",
  },
  {
    title: "Equity in reach",
    body: "Coexistence infrastructure belongs in every community, not only the ones with the time and resources to ask for it. Our reporting tools will be multilingual and account-free by design.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="About"
        title="A conversation, not a verdict."
        subtitle="Coyotes are a growing part of daily life in Orange County, and the stakes are rising — more pets going missing, and real grief with each. This Council is where the grieving, the environmentalist, the expert, and the executive trade feelings and information. The ultimate goal: a solution everyone can live with. No time to waste. Let's begin."
      />

      {/* Why we exist */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <h2 className="text-2xl font-bold text-heading sm:text-3xl">
            Why we exist
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/85">
            Coyotes live among us in Orange County, and the friction is real and
            rising. Too often the conversation splits between panic and dismissal,
            leaving little room to think it through. This Council is a modest
            attempt to make that room — to bring residents, wildlife experts, and
            municipal leaders to one table, ground the talk in evidence, and keep
            it respectful. We can't promise the outcome; that will depend on the
            input, tone, persistence, patience, and open minds everyone brings.
            What we can promise is to convene it honestly — and to start now.
          </p>
        </Reveal>
      </section>

      {/* Four tiers */}
      <section className="bg-card/50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-heading sm:text-3xl">
              Four tiers, one table
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-ink/70">
              Coexistence works when everyone affected is in the room — and
              accountable to results.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((t, i) => (
              <Reveal key={t.title} delay={i * 100} className="h-full">
                <div className="h-full rounded-xl border border-line/15 bg-card p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-clay">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/80">
                    {t.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What we believe */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <h2 className="text-2xl font-bold text-heading sm:text-3xl">
            What we believe
          </h2>
          <p className="mt-3 text-ink/70">
            A council that launches with vague aspirations gives cover to
            inaction. Here's where we stand.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {beliefs.map((b, i) => (
            <Reveal key={b.title} delay={i * 90} className="h-full">
              <div className="h-full rounded-xl bg-card/60 p-6">
                <h3 className="font-semibold text-clay">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">
                  {b.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-8 text-center">
            <Link
              href="/charter"
              className="font-semibold text-clay transition hover:text-ink"
            >
              Read the full Charter →
            </Link>
          </p>
        </Reveal>
      </section>

      {/* Board of advisors */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-heading sm:text-3xl">
              Our Board of Advisors
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-ink/70">
              We didn't want this Council's positions to be one person's
              opinions. So we began with an advisory board spanning the
              disciplines this work requires — urban coyote science, field
              research, coexistence-program design, humane practice, animal
              ethics, conflict mapping, environmental justice, management
              realism, and risk communication.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ADVISORY_SEATS.map((s, i) => (
              <Reveal key={s.discipline} delay={i * 60} className="h-full">
                <div className="h-full rounded-xl border border-line/15 bg-card p-5 shadow-sm">
                  <h3 className="font-semibold text-clay">{s.discipline}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">
                    {s.focus}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-ink/65">
              In full transparency: these are{" "}
              <strong className="text-ink">nine expertise seats</strong>,
              each modeled on the published work of leading authorities in that
              discipline. It is a way to pressure-test every claim on this site
              against the best of what each field knows, and to argue with our
              blind spots before they become policy — not a claim that any
              individual expert endorses us. The disciplines do not always point
              the same way. That is the point. As real advisors join, we'll name
              them here with their consent.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Invitation */}
      <section className="border-y border-line/20 bg-panel py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-heading sm:text-3xl">
              Help us build the human board
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-ink/75">
              The AI board is the beginning, not the destination. We're inviting
              the real thing — biologists and practitioners, municipal officials
              ready to pilot real tools, residents tired of choosing between
              panic and dismissal, and stewards willing to keep the conversation
              moving.
            </p>
            <Link
              href="/join"
              className="mt-8 inline-block rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
            >
              Join the Council
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
