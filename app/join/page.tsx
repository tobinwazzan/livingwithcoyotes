import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Join the Coyote Coexistence Council. Tell us your city and how you'd like to help shape your neighborhood's coyote plan.",
};

const reasons = [
  {
    title: "A seat at the table",
    body: "Residents are grouped by city, so your experience counts where you actually live — and feeds directly into the plans your city considers.",
  },
  {
    title: "Plain-language guidance",
    body: "Hazing how-tos, a yard-audit checklist, pet-safety protocols, and seasonal explainers — the practical answers neither the fear spiral nor the “don't panic” message gives you.",
  },
  {
    title: "Accountable to results",
    body: "We measure whether conflict actually goes down, and we say so when it doesn't. Your membership funds an evidence-first effort.",
  },
];

export default function JoinPage() {
  return (
    <main>
      <PageHeader
        sticky
        eyebrow="Join"
        title="Be part of the plan"
        subtitle="Tell us your city and how you'd like to help shape your neighborhood's coyote plan."
      />

      {/* Why join */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-6 sm:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 90} className="h-full">
              <div className="h-full rounded-xl border border-line/15 bg-card/60 p-6">
                <h3 className="font-semibold text-clay">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">
                  {r.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The form */}
      <section id="form" className="border-y border-line/20 bg-panel py-16">
        <div className="mx-auto max-w-2xl px-6">
          <SignupForm />
        </div>
      </section>
    </main>
  );
}
