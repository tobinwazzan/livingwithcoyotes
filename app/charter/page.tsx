import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import RoleDetails from "@/components/RoleDetails";
import { ADVISORY_SEATS } from "@/content/board";

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
    role: "Residents join grouped by the city they live in. They bring on-the-ground experience and local concerns, take part in the Council's deliberations, and vote on the plans that shape their own neighborhoods — no expertise required; local knowledge is the qualification.",
  },
  {
    title: "Municipalities",
    body: "Cities and their officials, who set policy and carry approved plans into practice.",
    role: "City staff and officials translate the Council's plans into policy and practice — bringing approved plans to their cities, shaping what's actually workable, and carrying implementation and enforcement on the ground. Voting members of the Council.",
  },
  {
    title: "Experts",
    body: "Subject-matter authorities — wildlife biologists and specialists — grounding decisions in evidence.",
    role: "Wildlife biologists and subject-matter specialists ground the Council's decisions in evidence. They add expertise, challenge assumptions, update their own positions as the data comes in, and vote alongside the other tiers.",
  },
  {
    title: "Stewards",
    body: "Admins who keep the dialogue open, respectful, and moving toward action.",
    role: "Stewards (admins) keep the conversation open, respectful, and moving toward action — facilitating deliberation, safeguarding the operating principles, and making sure every voice is heard without putting a thumb on the scale.",
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
          <h2 className="text-2xl font-bold text-heading">Mission</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/85">
            The Coyote Coexistence Council brings together residents, municipal
            officials, and wildlife experts to develop, implement, and refine
            evidence-based safety plans that protect our communities while
            preserving the natural ecological balance we share with coyotes.
            Through open, respectful dialogue and a commitment to including every
            human perspective, we work toward practical solutions and stay accountable
            to them — measuring results, adapting our approach, and continuing
            until our safety and stewardship goals are met.
          </p>
        </Reveal>

        {/* Objective */}
        <Reveal>
          <div className="mt-10 rounded-xl border-l-4 border-clay bg-card/60 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-clay">
              Objective
            </h2>
            <p className="mt-2 text-lg leading-relaxed text-ink/85">
              Produce and implement an action plan that meets agreed-upon safety
              standards while minimizing disruption to ecological balance.
            </p>
          </div>
        </Reveal>

        {/* Participants */}
        <Reveal>
          <h2 className="mt-14 text-2xl font-bold text-heading">
            Participants — four tiers
          </h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {participants.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="h-full">
              <div className="h-full rounded-xl bg-card/60 p-5">
                <h3 className="font-semibold text-clay">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/80">
                  {p.body}
                </p>
                <RoleDetails text={p.role} variant="light" />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Partners & advisors note */}
        <Reveal>
          <p className="mt-6 rounded-lg border-l-4 border-line/40 bg-card/60 p-5 text-sm leading-relaxed text-ink/75">
            <strong className="text-ink">Partners &amp; advisors.</strong>{" "}
            Beyond the four voting tiers, the Council draws on{" "}
            <strong>Technical Partners</strong> — veterinarians, animal-control
            departments, and shelters — who contribute frontline data and
            opinions but do not vote, and an{" "}
            <Link href="/about" className="text-clay hover:underline">
              Advisory Board
            </Link>{" "}
            of expertise seats that provides guidance.
          </p>
        </Reveal>

        {/* Operating principles */}
        <Reveal>
          <h2 className="mt-14 text-2xl font-bold text-heading">
            Operating principles
          </h2>
        </Reveal>
        <ul className="mt-6 space-y-3">
          {principles.map((p, i) => (
            <Reveal key={p} delay={i * 70}>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-clay" />
                <span className="text-ink/85">{p}</span>
              </li>
            </Reveal>
          ))}
        </ul>

        {/* The process */}
        <Reveal>
          <h2 className="mt-14 text-2xl font-bold text-heading">How we work</h2>
          <p className="mt-2 text-ink/70">
            The cycle every Council effort follows, from first concern to
            handoff.
          </p>
        </Reveal>
        <ol className="mt-6 space-y-3">
          {process.map((s, i) => (
            <Reveal key={s} delay={i * 60}>
              <li className="flex items-start gap-3 rounded-lg bg-card/60 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-clay text-sm font-bold text-sand">
                  {i + 1}
                </span>
                <span className="text-ink/85">{s}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>

      {/* Founding Council / Signatories — a light feature band (the dark
          contrast is reserved for the page header and footer). */}
      <section className="border-t border-line/20 bg-panel py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-clay">
              Founding Council
            </p>
            <h2 className="mt-3 text-center text-2xl font-bold text-heading sm:text-3xl">
              Charter Signatories
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-ink/70">
              The people and cities who put their names to this Charter. We're a
              new Council — these seats are filling now, and there is room at the
              table for your city.
            </p>
          </Reveal>

          {/* Founder / Admin */}
          <Reveal>
            <div className="mx-auto mt-12 max-w-md rounded-xl border border-clay/40 bg-card p-6 text-center shadow-sm">
              <Image
                src="/founder-tobin.png"
                alt="Tobin Wazzan"
                width={500}
                height={500}
                className="mx-auto h-24 w-24 rounded-full object-cover ring-2 ring-clay/40"
              />
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-clay">
                Founder &amp; Steward
              </p>
              <p className="mt-2 text-xl font-bold text-ink">Tobin Wazzan</p>
              <p className="mt-1 text-sm text-ink/70">
                Convener, Coyote Coexistence Council
              </p>
              <RoleDetails
                variant="light"
                center
                text="As Founder and Convener, Tobin Wazzan started the Council and stewards its process — bringing the four tiers (residents, municipalities, experts, and partners) to one table, keeping the dialogue open and respectful, and drawing out the full range of perspectives. The Convener doesn't override the Council; the role is to keep the work moving, fair, and accountable to results — guiding it from first concern toward a concrete, evidence-based plan, ensuring a fair way to settle a deadlock, and handing ongoing maintenance to the municipalities once the goals are met."
              />
            </div>
          </Reveal>

          {/* Municipal representatives */}
          <Reveal>
            <h3 className="mt-14 text-center text-lg font-semibold text-heading">
              Municipal Representatives
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ink/60">
              Cities that have committed to bringing Council plans to their
              communities.
            </p>
            <RoleDetails
              variant="light"
              center
              text="A Municipal Representative commits their city to the Council's table — bringing Council plans to their city for consideration and approval, sharing local data and constraints, and helping carry approved plans into implementation. Signing the Charter signals a city's intent to participate, not a binding obligation to adopt any particular plan."
            />
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Reveal key={i} delay={i * 80} className="h-full">
                <div className="flex h-full min-h-[7rem] flex-col items-center justify-center rounded-xl border border-dashed border-line/40 p-6 text-center">
                  <p className="font-semibold text-ink/80">Your city here</p>
                  <p className="mt-1 text-xs text-ink/50">
                    Be a founding signatory
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Council members */}
          <Reveal>
            <h3 className="mt-12 text-center text-lg font-semibold text-heading">
              Council Members
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ink/60">
              Experts and community leaders seated on the Council.
            </p>
            <RoleDetails
              variant="light"
              center
              text="Council Members are seated experts and community leaders who deliberate on plans, weigh the evidence and the perspectives in the room, and vote. They serve voluntarily, engage honestly, update their positions as the data warrants, and uphold the Council's operating principles."
            />
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Reveal key={i} delay={i * 80} className="h-full">
                <div className="flex h-full min-h-[7rem] flex-col items-center justify-center rounded-xl border border-dashed border-line/40 p-6 text-center">
                  <p className="font-semibold text-ink/80">Open seat</p>
                  <p className="mt-1 text-xs text-ink/50">
                    Invited members join with a code
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Technical partners */}
          <Reveal>
            <h3 className="mt-12 text-center text-lg font-semibold text-heading">
              Technical Partners
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ink/60">
              Veterinarians, animal-control departments, and shelters — they
              advise and inform, without a vote.
            </p>
            <RoleDetails
              variant="light"
              center
              text="Technical Partners — veterinarians, animal-control departments, and shelters — contribute frontline data and operational reality: the injuries treated, the incidents logged, the pets lost and found. They advise and inform the Council with on-the-ground insight, but they do not vote."
            />
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              "A veterinary clinic",
              "An animal-control department",
              "An animal shelter or rescue",
            ].map((label, i) => (
              <Reveal key={label} delay={i * 80} className="h-full">
                <div className="flex h-full min-h-[7rem] flex-col items-center justify-center rounded-xl border border-dashed border-line/40 p-6 text-center">
                  <p className="font-semibold text-ink/80">{label}</p>
                  <p className="mt-1 text-xs text-ink/50">Seat open</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Advisory board names */}
          <Reveal>
            <h3 className="mt-14 text-center text-lg font-semibold text-heading">
              Advisory Board
            </h3>
            <p className="mt-1 text-center text-sm text-ink/55">
              nine expertise seats
            </p>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ink/60">
              Each seat is modeled on the published work of leading authorities
              in that discipline. See{" "}
              <Link href="/about" className="text-clay hover:underline">
                About
              </Link>{" "}
              for how the advisory board works.
            </p>
          </Reveal>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {ADVISORY_SEATS.map((s) => (
              <span
                key={s.discipline}
                className="rounded-full border border-line/25 bg-card px-4 py-2 text-sm font-medium text-ink/85"
              >
                {s.discipline}
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

      <p className="bg-panel pb-10 text-center text-xs text-ink/45">
        Charter last updated June 21, 2026.
      </p>
    </main>
  );
}
