import SignupForm from "@/components/SignupForm";

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

const principles = [
  "Keep discussion open and language respectful",
  "Solicit an exhaustive range of perspectives",
  "Build toward a concrete action plan",
  "Implement the plan and monitor its results",
  "Adjust and re-implement based on the data",
  "Repeat until our safety and stewardship goals are met",
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden text-sand">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-coyote-street-canva.png')" }}
        />
        <div className="absolute inset-0 bg-dusk/80" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
          <img
            src="/logo-round.png"
            alt="Coyote Coexistence Council logo"
            className="mx-auto mb-6 h-28 w-28 sm:h-32 sm:w-32"
          />
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-clay">
            Coyote Coexistence Council
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
            Shared streets, wild balance.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-sand/80">
            A facilitated forum bringing residents, municipal officials, and
            wildlife experts together to build practical, evidence-based coyote
            safety plans — protecting our communities while preserving the
            natural balance we share.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a
              href="#join"
              className="rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-sand hover:text-dusk"
            >
              Join the Council
            </a>
            <a
              href="#mission"
              className="rounded-lg border border-sand/40 px-6 py-3 font-semibold transition hover:bg-sand/10"
            >
              Our mission
            </a>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-moss sm:text-3xl">Our mission</h2>
        <p className="mt-6 text-lg leading-relaxed text-bark/85">
          The Coyote Coexistence Council brings together residents, municipal
          officials, and wildlife experts to develop, implement, and refine
          evidence-based safety plans that protect our communities while
          preserving the natural ecological balance we share with coyotes.
          Through open, respectful dialogue and a commitment to including every
          perspective, we work toward practical solutions and stay accountable
          to them — measuring results, adapting our approach, and continuing
          until our safety and stewardship goals are met.
        </p>
      </section>

      {/* Tiers */}
      <section className="bg-white/50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold text-moss sm:text-3xl">
            A seat for every voice
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-bark/70">
            Coexistence works when everyone affected is at the table.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((t) => (
              <div
                key={t.title}
                className="rounded-xl border border-moss/15 bg-sand p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-clay">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bark/80">
                  {t.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center text-2xl font-bold text-moss sm:text-3xl">
          How we work
        </h2>
        <ul className="mx-auto mt-10 grid gap-4 sm:grid-cols-2">
          {principles.map((p) => (
            <li
              key={p}
              className="flex items-start gap-3 rounded-lg bg-white/60 p-4"
            >
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-clay" />
              <span className="text-bark/85">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Join / signup */}
      <section id="join" className="bg-moss/10 py-20">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-center text-2xl font-bold text-moss sm:text-3xl">
            Be part of the plan
          </h2>
          <p className="mx-auto mt-3 mb-8 max-w-lg text-center text-bark/75">
            Leave your email to get involved as the Council takes shape. Tell us
            your city and how you'd like to contribute.
          </p>
          <SignupForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dusk py-10 text-center text-sm text-sand/70">
        <img
          src="/logo-round.png"
          alt=""
          className="mx-auto mb-3 h-14 w-14"
          aria-hidden="true"
        />
        <p className="font-semibold text-sand">Coyote Coexistence Council</p>
        <p className="mt-1">Shared streets, wild balance.</p>
        <p className="mt-3 text-sand/50">
          © {new Date().getFullYear()} CCC · livingwithcoyotes.org
        </p>
      </footer>
    </main>
  );
}
