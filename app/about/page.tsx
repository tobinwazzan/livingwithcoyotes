import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { ADVISORS } from "@/content/board";

export const metadata: Metadata = {
  title: "About",
  description:
    "We already live with coyotes — the only question is how. Who the Coyote Coexistence Council is, what we believe, and the advisory board behind our positions.",
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
    title: "Experts",
    body: "Wildlife biologists and specialists grounding decisions in evidence.",
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
        title="We already live with coyotes. The only question is how."
        subtitle="There is a coyote somewhere in your city tonight. It was here before the cul-de-sacs and the dog parks, and it will be here long after the next viral thread scrolls out of view. That is the starting point of every honest conversation."
      />

      {/* Why we exist */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <h2 className="text-2xl font-bold text-moss sm:text-3xl">
            Why we exist
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-bark/85">
            The most important question about coyotes in our neighborhoods was
            settled long ago — <em>whether</em> we share this place with them.
            Almost nobody is working on the question that's actually still open:{" "}
            <strong className="text-bark">how.</strong> The Coyote Coexistence
            Council brings residents, municipal officials, and wildlife experts
            to one table to build, implement, and refine evidence-based safety
            plans — and to stay accountable to them.
          </p>
        </Reveal>

        <Reveal>
          <blockquote className="mt-8 border-l-4 border-clay bg-white/60 p-6 text-lg italic leading-relaxed text-bark/85">
            A sighting is not an incident. A coyote crossing your yard at dusk is
            a healthy animal doing exactly what it should. Real conflict
            concentrates in a few individuals that have learned to associate
            people with food — and that is almost always something we made.
          </blockquote>
        </Reveal>

        <Reveal>
          <p className="mt-8 leading-relaxed text-bark/80">
            So the problem is not the coyote. It's a landscape we've made
            extraordinarily hospitable to coyotes — and the fix starts in your
            own yard: keep cats indoors, supervise small dogs, secure the trash,
            pick up the fallen fruit. There's a second problem too, and it may be
            the one this site exists to solve most directly: residents are caught
            between a neighborhood-app fear spiral and an official “don't panic”
            message, and neither tells you what to actually do. We intend to be
            the first source that tells you plainly what is and isn't dangerous —
            and exactly what to do about it.
          </p>
        </Reveal>
      </section>

      {/* Four tiers */}
      <section className="bg-white/50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-moss sm:text-3xl">
              Four tiers, one table
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-bark/70">
              Coexistence works when everyone affected is in the room — and
              accountable to results.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((t, i) => (
              <Reveal key={t.title} delay={i * 100} className="h-full">
                <div className="h-full rounded-xl border border-moss/15 bg-sand p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-clay">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-bark/80">
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
          <h2 className="text-2xl font-bold text-moss sm:text-3xl">
            What we believe
          </h2>
          <p className="mt-3 text-bark/70">
            A council that launches with vague aspirations gives cover to
            inaction. Here's where we stand.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {beliefs.map((b, i) => (
            <Reveal key={b.title} delay={i * 90} className="h-full">
              <div className="h-full rounded-xl bg-white/60 p-6">
                <h3 className="font-semibold text-clay">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bark/80">
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
              className="font-semibold text-clay transition hover:text-bark"
            >
              Read the full Charter →
            </Link>
          </p>
        </Reveal>
      </section>

      {/* Board of advisors */}
      <section className="bg-dusk py-16 text-sand">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              Our Board of Advisors
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sand/75">
              We didn't want this Council's positions to be one person's
              opinions. So we began with an advisory board spanning the
              disciplines this work requires — urban coyote science, field
              research, coexistence-program design, humane practice, animal
              ethics, conflict mapping, environmental justice, management
              realism, and risk communication.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ADVISORS.map((a, i) => (
              <Reveal key={a.name} delay={i * 60} className="h-full">
                <div className="h-full rounded-xl border border-sand/15 bg-sand/5 p-5">
                  <h3 className="font-semibold text-clay">{a.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-sand/75">
                    {a.seat}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-sand/60">
              In full transparency: this founding board is an{" "}
              <strong className="text-sand/80">AI advisory panel</strong>, each
              member modeled on the published work of a leading real-world
              authority. It is not a substitute for those experts and they have
              not endorsed us — it's a way to pressure-test every claim on this
              site against the best of what each discipline knows, and to argue
              with our blind spots before they become policy. The board does not
              always agree. That is the point.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Invitation */}
      <section className="bg-moss/10 py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-moss sm:text-3xl">
              Help us build the human board
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-bark/75">
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
