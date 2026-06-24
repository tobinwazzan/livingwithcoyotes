import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Join the Coyote Coexistence Council. Membership is $19 a year — free for invited municipal representatives, experts, and Council members with a code.",
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
    body: "We measure whether conflicts actually go down, and we say so when they don't. Your membership funds an evidence-first, non-lethal-first effort.",
  },
];

export default function JoinPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Join"
        title="Be part of the plan"
        subtitle="Membership is $19 a year — and free for invited municipal representatives, experts, and Council members with a code. Either way, tell us your city and how you'd like to help."
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
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-heading sm:text-3xl">
              Join in two steps
            </h2>
            <p className="mx-auto mt-3 mb-8 max-w-lg text-center text-ink/75">
              First tell us about yourself — your info is saved either way. Then
              choose how to become a member: card, Venmo, Zelle, or a free code.
            </p>
            <SignupForm />
          </Reveal>

          <Reveal>
            <p className="mt-6 text-center text-xs leading-relaxed text-ink/55">
              Card payments are processed securely by Stripe (a small processing
              fee is added so the Council nets the full $19). Venmo and Zelle
              members upload a receipt. Invited municipal, expert, and Council
              members join free with a single-use code.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
