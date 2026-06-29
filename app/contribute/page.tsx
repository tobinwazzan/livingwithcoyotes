import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { VENMO_HANDLE, ZELLE_HANDLE } from "@/lib/membership";

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "Membership is free. Contributions are optional and entirely separate — they keep the resources, trainings, and neighborhood alerts free for everyone.",
};

const EMAIL = "members@livingwithcoyotes.org";

const tiers = [
  {
    amount: "$20",
    perk: "A Coyote Coexistence Council car sticker",
    note: "Wear the pack on your bumper.",
  },
  {
    amount: "$50",
    perk: "A CCC car license-plate cover",
    note: "Pack Leader — and a little hardware to show it.",
  },
  {
    amount: "Any amount",
    perk: "Pure support",
    note: "Every bit keeps the work free for the next neighbor.",
  },
];

export default function ContributePage() {
  return (
    <main>
      <PageHeader
        eyebrow="Contribute"
        title="Support the work"
        subtitle="Membership is free, and stays free. Contributions are optional and entirely separate — they keep the resources, trainings, and neighborhood alerts free for everyone."
      />

      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-6 sm:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.amount} delay={i * 90} className="h-full">
              <div className="h-full rounded-xl border border-line/15 bg-card/60 p-6">
                <p className="text-2xl font-bold text-heading">{t.amount}</p>
                <p className="mt-2 font-semibold text-clay">{t.perk}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/70">{t.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 rounded-2xl border-y border-line/20 bg-panel p-6 sm:p-8">
            <h2 className="text-xl font-bold text-heading">How to give</h2>
            <p className="mt-2 text-ink/75">
              For now, contributions go through Venmo or Zelle — quick, and every
              dollar reaches the work directly.
            </p>
            <ul className="mt-4 space-y-2 text-ink/85">
              {VENMO_HANDLE && (
                <li>
                  <strong>Venmo:</strong>{" "}
                  <span className="text-clay">{VENMO_HANDLE}</span>
                </li>
              )}
              {ZELLE_HANDLE && (
                <li>
                  <strong>Zelle:</strong>{" "}
                  <span className="text-clay">{ZELLE_HANDLE}</span>
                </li>
              )}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-ink/70">
              Want the sticker ($20) or plate cover ($50)? After you send it, email
              your mailing address to{" "}
              <a href={`mailto:${EMAIL}`} className="text-clay hover:underline">
                {EMAIL}
              </a>{" "}
              and we&apos;ll get it out to you.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-ink/55">
              We&apos;re not a registered charity, so this is support — not a
              tax-deductible donation. Thank you, truly: it&apos;s what keeps the
              door open for everyone.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <p className="mt-8 text-center text-sm text-ink/60">
            Not a member yet? It&apos;s free —{" "}
            <Link href="/join" className="font-semibold text-clay hover:text-ink">
              join the Council →
            </Link>
          </p>
        </Reveal>
      </section>
    </main>
  );
}
