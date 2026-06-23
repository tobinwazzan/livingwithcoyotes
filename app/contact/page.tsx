import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Coyote Coexistence Council — whether you're a resident, a city official, a wildlife expert, or want to help steward the conversation.",
};

const CONTACT_EMAIL = "hello@livingwithcoyotes.org";

const paths = [
  {
    title: "Residents",
    body: "Tired of choosing between panic and dismissal? Join as a resident — grouped by your city — and get plain-language guidance.",
    cta: "Join the Council",
    href: "/join",
  },
  {
    title: "Cities & officials",
    body: "Ready to pilot real coexistence tools? We hand municipalities a turnkey package: model ordinances, a response matrix, and program guidelines.",
    cta: "Start the conversation",
    href: `mailto:${CONTACT_EMAIL}?subject=Municipal%20partnership`,
  },
  {
    title: "Experts & practitioners",
    body: "Wildlife biologists, animal-control professionals, and coexistence practitioners — help advise the Council and keep us honest.",
    cta: "Reach out",
    href: `mailto:${CONTACT_EMAIL}?subject=Advisory%20%2F%20expert%20interest`,
  },
  {
    title: "Stewards",
    body: "Willing to do the unglamorous work of keeping a community conversation open, respectful, and moving toward action? We'd love to hear from you.",
    cta: "Get in touch",
    href: `mailto:${CONTACT_EMAIL}?subject=Stewardship`,
  },
];

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        subtitle="Four tiers, one table. Whoever you are, there's a way to be part of this — find yours below."
      />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {paths.map((p, i) => (
            <Reveal key={p.title} delay={i * 90} className="h-full">
              <div className="flex h-full flex-col rounded-xl border border-moss/15 bg-white/60 p-6">
                <h3 className="text-lg font-semibold text-clay">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-bark/80">
                  {p.body}
                </p>
                {p.href.startsWith("/") ? (
                  <Link
                    href={p.href}
                    className="mt-4 inline-block font-semibold text-clay transition hover:text-bark"
                  >
                    {p.cta} →
                  </Link>
                ) : (
                  <a
                    href={p.href}
                    className="mt-4 inline-block font-semibold text-clay transition hover:text-bark"
                  >
                    {p.cta} →
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 rounded-xl bg-moss/10 p-8 text-center">
            <h2 className="text-xl font-bold text-moss">
              General questions
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-bark/75">
              For anything else — media, suggestions, or a resource link that's
              gone stale — email us directly.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 inline-block rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
