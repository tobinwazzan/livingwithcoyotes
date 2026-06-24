import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ByTheNumbers from "@/components/ByTheNumbers";

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

const steps = [
  "Members share their experiences, observations, and concerns.",
  "Professionals add expertise and evidence.",
  "Everyone weighs it together and updates their positions — experts included.",
  "The Council shapes an action plan and works toward agreement, with a fair way to settle a deadlock.",
  "Municipal representatives bring the plan to their cities for approval.",
  "Implementation begins, closely monitored by the Council.",
  "Results are evaluated and the plan is adjusted.",
  "When the goals are met, the active phase ends and ongoing maintenance passes to the municipalities.",
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden text-sand">
        {/* Layered hero: background street, dusk overlay, then action characters on top */}
        <Image
          src="/hero-bg-street.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-dusk/65" />
        <Image
          src="/hero-action.png"
          alt="Residents walking a dog as a coyote rests nearby"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
        {/* Logo — top-left, 1.5x size */}
        <Image
          src="/logo-ccc.png"
          alt="Coyote Coexistence Council logo"
          width={384}
          height={384}
          priority
          className="hero-anim hero-anim-1 absolute left-4 top-4 z-20 h-20 w-20 sm:left-8 sm:top-8 sm:h-[168px] sm:w-[168px] lg:h-[192px] lg:w-[192px]"
        />
        {/* Scrim: pools dark behind the centered text, fades out at the edges
            so the corner characters stay vivid. Keeps text clearly on top. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 52% at 50% 48%, rgba(20,27,21,0.6) 0%, rgba(20,27,21,0.28) 48%, transparent 76%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32 hero-text">
          <p className="hero-anim hero-anim-2 mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-clay sm:text-base">
            Welcome to the
          </p>
          <h1 className="hero-anim hero-anim-2 whitespace-nowrap font-extrabold leading-[1.1] text-[clamp(1.4rem,5vw,4.5rem)]">
            Coyote Coexistence Council
          </h1>
          <p className="hero-anim hero-anim-3 mx-auto mt-6 max-w-2xl text-base text-sand/75 sm:text-lg">
            Working together to keep our neighborhoods safe and our coyotes wild.
          </p>
          <div className="hero-anim hero-anim-4 mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/join"
              className="rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-sand hover:text-dusk"
            >
              Join the Council
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-sand/40 px-6 py-3 font-semibold text-sand transition hover:bg-sand/10"
            >
              Why we exist
            </Link>
          </div>
          <a
            href="#mission"
            aria-label="Scroll to mission"
            className="hero-anim hero-anim-5 float-y mx-auto mt-16 block w-fit text-sand/60 transition hover:text-sand"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Reveal>
          <h2 className="text-2xl font-bold text-heading sm:text-3xl">
            Our mission
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/85">
            The Coyote Coexistence Council brings together residents, municipal
            officials, and wildlife experts to develop, implement, and refine
            evidence-based safety plans that protect our communities while
            preserving the natural ecological balance we share with coyotes.
            Through open, respectful dialogue and a commitment to including
            every human perspective, we work toward practical solutions and stay
            accountable to them — measuring results, adapting our approach, and
            continuing until our safety and stewardship goals are met.
          </p>
        </Reveal>
      </section>

      {/* Tiers */}
      <section className="bg-card/50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-heading sm:text-3xl">
              A seat for every voice
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-ink/70">
              Coexistence works when everyone affected is at the table.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((t, i) => (
              <Reveal key={t.title} delay={i * 120} className="h-full">
                <div className="h-full rounded-xl border border-line/15 bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-clay/30 hover:shadow-md">
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

      {/* By the numbers */}
      <ByTheNumbers />

      {/* How we work */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <h2 className="text-center text-2xl font-bold text-heading sm:text-3xl">
            How we work
          </h2>
        </Reveal>
        <ol className="mx-auto mt-10 grid gap-4 sm:grid-cols-2">
          {steps.map((s, i) => (
            <Reveal key={s} delay={i * 80}>
              <li className="flex items-start gap-3 rounded-lg bg-card/60 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-clay text-sm font-bold text-sand">
                  {i + 1}
                </span>
                <span className="text-ink/85">{s}</span>
              </li>
            </Reveal>
          ))}
        </ol>
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

      {/* Watch first */}
      <section className="bg-card/50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-heading sm:text-3xl">
              New here? Watch these first.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-ink/70">
              Three short videos from wildlife agencies — about fifteen minutes
              total, and most of what a neighbor needs to know.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "How to Haze a Coyote",
                url: "https://www.youtube.com/watch?v=rlxMPpFQClM",
                source: "LA Animal Services",
                length: "~4 min",
              },
              {
                title: "Coexisting With Urban Coyotes",
                url: "https://www.youtube.com/watch?v=2v4WK65w8pg",
                source: "Michigan DNR",
                length: "~5 min",
              },
              {
                title: "Coyotes: Safety & Coexistence in California",
                url: "https://www.youtube.com/watch?v=OdOewqXCS-I",
                source: "California Dept. of Fish & Wildlife",
                length: "~12 min",
              },
            ].map((v, i) => (
              <Reveal key={v.url} delay={i * 120} className="h-full">
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-xl border border-line/15 bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-clay/30 hover:shadow-md"
                >
                  <span className="w-fit rounded-full bg-panel px-2 py-0.5 text-xs font-medium text-heading">
                    {v.length}
                  </span>
                  <h3 className="mt-3 font-semibold text-ink transition group-hover:text-clay">
                    {v.title}
                  </h3>
                  <p className="mt-0.5 text-xs uppercase tracking-wide text-ink/50">
                    {v.source}
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-8 text-center">
              <Link
                href="/resources"
                className="font-semibold text-clay transition hover:text-ink"
              >
                See all resources →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Join CTA */}
      <section id="join" className="border-y border-line/20 bg-panel py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-heading sm:text-3xl">
              Be part of the plan
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-ink/75">
              Membership is $25 a year — and free for invited municipal
              representatives, experts, and Council members with a code. Tell us
              your city and how you'd like to help.
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
                Start learning
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
