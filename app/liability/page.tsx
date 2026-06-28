import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Disclaimers & Release of Liability",
  description:
    "Important safety disclaimers, assumption of risk, and release of liability for using the Coyote Coexistence Council's information, tools, and events.",
};

const EMAIL = "members@livingwithcoyotes.org";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="mt-10">
        <h2 className="text-xl font-bold text-heading">{title}</h2>
        <div className="mt-3 space-y-3 leading-relaxed text-ink/80">{children}</div>
      </section>
    </Reveal>
  );
}

export default function LiabilityPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Disclaimers & Release of Liability"
        title="Disclaimers, Assumption of Risk & Release of Liability"
        subtitle="Please read this carefully. It affects your legal rights when you use our information, tools, or attend our events."
      />

      <div className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <div className="rounded-xl border border-clay/30 bg-clay/10 p-5 text-sm font-medium leading-relaxed text-ink/85">
            Not for emergencies. If a person or pet is in immediate danger, call{" "}
            <strong>911</strong> or your local animal control now. This page is a
            plain-language starting draft, not legal advice, and is intended to be
            reviewed by counsel.
          </div>
        </Reveal>

        <Section title="Information only — not professional advice">
          <p>
            Everything the Coyote Coexistence Council (&ldquo;CCC&rdquo;) shares —
            on the Site, in guides, in the Q&amp;A, in reports, and at meetings —
            is <strong>general educational information</strong>. It is{" "}
            <strong>not</strong> veterinary, medical, legal, wildlife-management,
            or other professional advice, and it is not a substitute for the
            judgment of a qualified professional or your local authorities. Laws
            and conditions vary by city; always check with the appropriate agency
            before acting.
          </p>
        </Section>

        <Section title="Not an emergency or enforcement service">
          <p>
            CCC is not an emergency responder, animal-control agency, or law
            enforcement body. We can&apos;t dispatch help. For an aggressive
            animal, a bite, an injured pet, or any immediate threat, contact{" "}
            <strong>911</strong>, your local animal control, or a veterinarian
            right away. Reports submitted to the Site are{" "}
            <strong>not monitored in real time</strong> and must never be relied on
            for an emergency.
          </p>
        </Section>

        <Section title="Coyotes are wild animals — assumption of risk">
          <p>
            Coyotes are wild animals and can behave unpredictably. Living
            alongside wildlife, hazing a coyote, securing your property, walking
            pets, and similar activities carry inherent risks — including injury
            to people or pets and property damage — that cannot be fully
            eliminated, even when you follow good guidance.
          </p>
          <p>
            <strong>
              By using our information and tools, you knowingly and voluntarily
              assume all risks
            </strong>{" "}
            associated with coyotes and with any action you take based on
            information from CCC. You are responsible for your own safety, your
            family&apos;s, your pets&apos;, and your decisions.
          </p>
        </Section>

        <Section title="Events and in-person activities">
          <p>
            If you attend a CCC meeting, walk, workshop, or other activity, you
            take part voluntarily and at your own risk, and you&apos;re
            responsible for your own conduct and belongings.{" "}
            <em>
              [If CCC will host in-person events, consider a separate signed
              event waiver — counsel to advise.]
            </em>
          </p>
        </Section>

        <Section title="Release of liability">
          <p>
            To the fullest extent permitted by law, you{" "}
            <strong>release, waive, and agree not to sue</strong> CCC and its
            organizers, volunteers, advisors, and partners (the &ldquo;Released
            Parties&rdquo;) from any and all claims, liabilities, or damages
            arising out of or related to your use of the Site, our information or
            tools, or your participation in Council activities — including claims
            based on the Released Parties&apos; ordinary negligence — except where
            a release is not permitted by law (such as gross negligence or willful
            misconduct).
          </p>
          <p>
            You also agree to <strong>indemnify and hold harmless</strong> the
            Released Parties from claims arising out of your own actions, your
            content, or your violation of our{" "}
            <Link href="/terms" className="text-clay hover:underline">
              Terms of Use
            </Link>
            .{" "}
            <em>
              [California note: a release of future ordinary negligence is
              generally enforceable if clear; Civil Code §1542 waiver language and
              scope to be confirmed by counsel.]
            </em>
          </p>
        </Section>

        <Section title="No guarantee of outcomes">
          <p>
            CCC does not guarantee that following any guidance will prevent
            conflict, injury, or loss. Coexistence depends on many factors outside
            our control, including the actions of others, local conditions, and the
            animals themselves.
          </p>
        </Section>

        <Section title="How this fits together">
          <p>
            This page is part of, and incorporated into, our{" "}
            <Link href="/terms" className="text-clay hover:underline">
              Terms of Use
            </Link>
            . How we handle your information is covered by our{" "}
            <Link href="/privacy" className="text-clay hover:underline">
              Privacy Policy
            </Link>
            . Questions? Email{" "}
            <a href={`mailto:${EMAIL}`} className="text-clay hover:underline">
              {EMAIL}
            </a>
            .
          </p>
        </Section>

        <Reveal>
          <p className="mt-12 text-sm text-ink/50">
            Effective June 28, 2026 · Draft pending legal review.
          </p>
        </Reveal>
      </div>
    </main>
  );
}
