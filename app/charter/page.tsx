import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { ADVISORS } from "@/content/board";

export const metadata: Metadata = {
  title: "Charter",
  description:
    "The Coyote Coexistence Council Charter — our mission, participants, operating principles, the process we follow, and the founding signatories who put their names to it.",
};

const principles = [
  "Keep discussion open and language respectful.",
  "Solicit an exhaustive range of perspectives.",
  "Build toward a concrete action plan.",
  "Implement the plan and monitor its results.",
  "Adjust and re-implement based on what the data shows.",
  "Repeat until our safety and stewardship goals are met.",
];

const process = [
  "Members share their experiences, observations, and concerns.",
  "Professionals add expertise and evidence.",
  "Everyone weighs it together and updates their positions — experts included.",
  "The Council shapes an action plan and works toward agreement, with a fair way to settle a deadlock.",
  "Municipal representatives bring the plan to their cities for approval.",
  "Implementation begins, closely monitored by the Council.",
  "Results are evaluated and the plan is adjusted.",
  "When the goals are met, the active phase ends and ongoing maintenance passes to the municipalities.",
];

const participants = [
  {
    title: "Residents",
    body: "Citizens grouped by their city of residence, sharing on-the-ground experience and local concerns.",
  },
  {
    title: "Municipalities",
    body: "Cities and their officials, who set policy and carry approved plans into practice.",
  },
  {
    title: "Experts",
    body: "Subject-matter authorities — wildlife biologists and specialists — grounding decisions in evidence.",
  },
  {
    title: "Stewards",
    body: "Admins who keep the dialogue open, respectful, and moving toward action.",
  },
];

export default function CharterPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Our Charter"
        title="Coyote Coexistence Council Charter"
        subtitle="A facilitated forum for developing community coexistence strategies with coyotes — and a public commitment to how we work and what we stand for."
      />

      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Mission */}
        <Reveal>
          <h2 className="text-2xl font-bold text-moss">Mission</h2>
          <p className="mt-4 text-lg leading-relaxed text-bark/85">
            The Coyote Coexistence Council brings together residents, municipal
            officials, and wildlife experts to develop, implement, and refine
            evidence-based safety plans that protect our communities while
            preserving the natural ecological balance we share with coyotes.
            Through open, respectful dialogue and a commitment to including every
            perspective, we work toward practical solutions and stay accountable
            to them — measuring results, adapting our approach, and continuing
            until our safety and stewardship goals are met.
          </p>
        </Reveal>

        {/* Objective */}
        <Reveal>
          <div className="mt-10 rounded-xl border-l-4 border-clay bg-white/60 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-clay">
              Objective
            </h2>
            <p className="mt-2 text-lg leading-relaxed text-bark/85">
              Produce and implement an action plan that meets agreed-upon safety
              standards while minimizing disruption to ecological balance.
            </p>
          </div>
        </Reveal>

        {/* Participants */}
        <Reveal>
          <h2 className="mt-14 text-2xl font-bold text-moss">
            Participants — four tiers
          </h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {participants.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="h-full">
              <div className="h-full rounded-xl bg-white/60 p-5">
                <h3 className="font-semibold text-clay">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-bark/80">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Operating principles */}
        <Reveal>
          <h2 className="mt-14 text-2xl font-bold text-moss">
            Operating principles
          </h2>
        </Reveal>
        <ul className="mt-6 space-y-3">
          {principles.map((p, i) => (
            <Reveal key={p} delay={i * 70}>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-clay" />
                <span className="text-bark/85">{p}</span>
              </li>
            </Reveal>
          ))}
        </ul>

        {/* The process */}
        <Reveal>
          <h2 className="mt-14 text-2xl font-bold text-moss">How we work</h2>
          <p className="mt-2 text-bark/70">
            The cycle every Council effort follows, from first concern to
            handoff.
          </p>
        </Reveal>
        <ol className="mt-6 space-y-3">
          {process.map((s, i) => (
            <Reveal key={s} delay={i * 60}>
              <li className="flex items-start gap-3 rounded-lg bg-white/60 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-clay text-sm font-bold text-sand">
                  {i + 1}
                </span>
                <span className="text-bark/85">{s}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>

      {/* Founding Council / Signatories — the prominent named section */}
      <section className="bg-dusk py-20 text-sand">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-clay">
              Founding Council
            </p>
            <h2 className="mt-3 text-center text-2xl font-bold sm:text-3xl">
              Charter Signatories
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sand/75">
              The people and cities who put their names to this Charter. We're a
              new Council — these seats are filling now, and there is room at the
              table for your city.
            </p>
          </Reveal>

          {/* Founder / Admin */}
          <Reveal>
            <div className="mx-auto mt-12 max-w-md rounded-xl border border-clay/40 bg-sand/5 p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-clay">
                Founder &amp; Steward
              </p>
              <p className="mt-2 text-xl font-bold text-sand">Tobin Wazzan</p>
              <p className="mt-1 text-sm text-sand/70">
                Convener, Coyote Coexistence Council
              </p>
            </div>
          </Reveal>

          {/* Municipal representatives */}
          <Reveal>
            <h3 className="mt-14 text-center text-lg font-semibold text-sand">
              Municipal Representatives
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-sand/60">
              Cities that have committed to bringing Council plans to their
              communities.
            </p>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Reveal key={i} delay={i * 80} className="h-full">
                <div className="flex h-full min-h-[7rem] flex-col items-center justify-center rounded-xl border border-dashed border-sand/25 p-6 text-center">
                  <p className="font-semibold text-sand/80">Your city here</p>
                  <p className="mt-1 text-xs text-sand/50">
                    Be a founding signatory
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Council members */}
          <Reveal>
            <h3 className="mt-12 text-center text-lg font-semibold text-sand">
              Council Members
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-sand/60">
              Experts and community leaders seated on the Council.
            </p>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Reveal key={i} delay={i * 80} className="h-full">
                <div className="flex h-full min-h-[7rem] flex-col items-center justify-center rounded-xl border border-dashed border-sand/25 p-6 text-center">
                  <p className="font-semibold text-sand/80">Open seat</p>
                  <p className="mt-1 text-xs text-sand/50">
                    Invited members join with a code
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Advisory board names */}
          <Reveal>
            <h3 className="mt-14 text-center text-lg font-semibold text-sand">
              Advisory Board
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-sand/60">
              Nine seats, each modeled on the published work of a leading
              authority. See{" "}
              <Link href="/about" className="text-clay hover:underline">
                About
              </Link>{" "}
              for how the advisory board works.
            </p>
          </Reveal>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {ADVISORS.map((a) => (
              <span
                key={a.name}
                className="rounded-full border border-sand/20 bg-sand/5 px-4 py-2 text-sm font-medium text-sand/85"
              >
                {a.name}
              </span>
            ))}
          </div>

          <Reveal>
            <div className="mt-14 text-center">
              <Link
                href="/join"
                className="inline-block rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
              >
                Put your name to the Charter
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <p className="bg-dusk pb-10 text-center text-xs text-sand/40">
        Charter last updated June 21, 2026.
      </p>
    </main>
  );
}
