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
    body: "Wildlife biologists, vets, animal-control, and shelter staff — grounding the conversation in evidence and frontline data.",
  },
  {
    title: "Stewards",
    body: "Admins who keep the dialogue open, respectful, and moving toward action.",
  },
];

const beliefs = [
  {
    title: "Every side has a seat",
    body: "We bring residents, officials, and experts to one table, and we work to see that every perspective has a place in the conversation — especially the ones easy to overlook.",
  },
  {
    title: "Assumptions welcome — and questioned",
    body: "We bring data, research, and lived experience into the open, and we invite every assumption — our own included — to be examined. The best conversations start when someone is willing to rethink what they were sure of.",
  },
  {
    title: "We convene; the table concludes",
    body: "Our role is to host the discussion and describe what we hear. The conclusions belong to the people in the room.",
  },
  {
    title: "Open to every community",
    body: "Taking part stays within reach for everyone, whatever their time, money, or language — and our tools are built that way, so more voices are heard.",
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
              The conversation works best when everyone affected is in the room —
              and every voice is heard.
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
            How we work
          </h2>
          <p className="mt-3 text-ink/70">
            These are our commitments — about how the conversation runs, and
            about making sure every voice in it is heard.
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
              We wanted this conversation informed by many disciplines rather
              than a single point of view. So we began with an advisory board
              spanning the fields this work touches — urban coyote science, field
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
              discipline. It is a way to weigh what we hear against the best of
              what each field knows, and to surface our blind spots before they
              harden into assumptions — not a claim that any individual expert
              endorses us. The disciplines do not always point
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
