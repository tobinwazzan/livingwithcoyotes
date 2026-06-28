import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms for using livingwithcoyotes.org and joining the Coyote Coexistence Council — membership, contributions, acceptable use, content, and the legal terms.",
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

export default function TermsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Terms of Use"
        title="Terms of Use"
        subtitle="The plain-language agreement for using this site and joining the Council. Please read it before you join."
      />

      <div className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <div className="rounded-xl border border-clay/25 bg-card/60 p-5 text-sm leading-relaxed text-ink/75">
            This is a plain-language starting draft, not legal advice. The Council
            intends to have it reviewed by counsel; terms may change. Bracketed
            notes mark items to be finalized.
          </div>
        </Reveal>

        <Section title="1. Who these terms are between">
          <p>
            These Terms of Use (&ldquo;Terms&rdquo;) are an agreement between
            you and the <strong>Coyote Coexistence Council</strong>{" "}
            (&ldquo;CCC,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;), which operates{" "}
            livingwithcoyotes.org (the &ldquo;Site&rdquo;).{" "}
            <em>
              [Confirm legal entity: e.g., &ldquo;a California nonprofit public
              benefit corporation&rdquo; / &ldquo;an unincorporated
              association&rdquo; / &ldquo;[LLC name]&rdquo; — and its mailing
              address.]
            </em>{" "}
            By using the Site or joining the Council, you agree to these Terms,
            our{" "}
            <Link href="/privacy" className="text-clay hover:underline">
              Privacy Policy
            </Link>
            , and our{" "}
            <Link href="/liability" className="text-clay hover:underline">
              Disclaimers &amp; Release of Liability
            </Link>
            . If you don&apos;t agree, please don&apos;t use the Site.
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>
            You must be at least <strong>18 years old</strong> to join, make a
            contribution, or submit content. By using the Site you confirm the
            information you give us is accurate and that you&apos;re allowed to
            agree to these Terms.
          </p>
        </Section>

        <Section title="3. What the Council is — and isn't">
          <p>
            CCC is a facilitated forum that brings residents, municipal officials,
            and wildlife experts together to discuss living alongside coyotes. We
            convene the conversation and share evidence-based information. We are{" "}
            <strong>not</strong> an emergency service, a government or
            animal-control agency, or a provider of veterinary, legal, or
            professional advice. Information on the Site is general and
            educational. See our{" "}
            <Link href="/liability" className="text-clay hover:underline">
              Disclaimers &amp; Release of Liability
            </Link>
            .
          </p>
        </Section>

        <Section title="4. Membership and contributions">
          <p>
            Membership is supported by a <strong>yearly contribution</strong> (or
            a free/honorary code where offered). Membership lasts for one year
            from activation and does <strong>not</strong> auto-renew unless we
            tell you otherwise at the time. Membership gives you the benefits
            described on the{" "}
            <Link href="/membership" className="text-clay hover:underline">
              Membership
            </Link>{" "}
            page; we may adjust benefits over time.
          </p>
          <p>
            <strong>Contributions are voluntary support for the Council&apos;s
            work.</strong> They are{" "}
            <strong>not tax-deductible</strong>{" "}
            <em>
              [unless and until CCC obtains 501(c)(3) status — confirm and update;
              do not state tax-deductibility before then]
            </em>
            , and they don&apos;t purchase any specific outcome, vote, or service.
          </p>
          <p>
            <strong>Payments.</strong> Card payments are processed by Stripe;
            Venmo/Zelle are handled by those services. You agree to pay the amount
            shown, including any processing fee disclosed at checkout.
          </p>
          <p>
            <strong>Refunds.</strong>{" "}
            <em>
              [Confirm refund policy. Suggested default: contributions are
              generally non-refundable, but if you believe there&apos;s been an
              error or you change your mind within [14] days, email us and
              we&apos;ll work it out in good faith.]
            </em>{" "}
            To request a refund, email{" "}
            <a href={`mailto:${EMAIL}`} className="text-clay hover:underline">
              {EMAIL}
            </a>
            .
          </p>
        </Section>

        <Section title="5. Acceptable use and community conduct">
          <p>By using the Site or taking part in the Council, you agree not to:</p>
          <ul className="ml-1 space-y-1.5">
            <li>• break the law, or harass, threaten, or harm anyone;</li>
            <li>• post false, misleading, hateful, or abusive content;</li>
            <li>
              • submit someone else&apos;s personal information or content without
              their permission;
            </li>
            <li>
              • disrupt, hack, scrape, or overload the Site, or get around its
              security;
            </li>
            <li>
              • use the Site to promote violence toward people or animals,
              including coyote-killing contests or unlawful wildlife actions.
            </li>
          </ul>
          <p>
            In keeping with the Council&apos;s values, we ask participants to stay
            respectful and evidence-based, and to engage views they disagree with
            in good faith. We may remove content or suspend access that violates
            these Terms.
          </p>
        </Section>

        <Section title="6. Your content, photos, and likeness">
          <p>
            You keep ownership of what you submit (reports, reflections, photos,
            testimonials, messages — &ldquo;Your Content&rdquo;). By submitting it,
            you give CCC a non-exclusive, royalty-free license to store and use
            Your Content to operate the Council and the purposes you choose at the
            time (for example, displaying an opt-in name/photo on{" "}
            <Link href="/pack" className="text-clay hover:underline">
              The Pack
            </Link>{" "}
            wall, or publishing a testimonial you approve).
          </p>
          <p>
            <strong>Photos and likeness.</strong> If you upload a photo or appear
            in event photography, you confirm you have the right to share it and
            you grant CCC permission to display it for the purpose you selected.
            You can withdraw a shared photo, name, or testimonial at any time by
            emailing us; we&apos;ll remove it going forward.
          </p>
          <p>
            <strong>Private by default.</strong> Your reflections and reports are
            kept private and are not shown publicly or to other members unless you
            explicitly choose to share them. How we handle this data — including
            any anonymized, aggregate research use — is described in our{" "}
            <Link href="/privacy" className="text-clay hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </Section>

        <Section title="7. Our content">
          <p>
            The Site&apos;s text, design, logo, and materials belong to CCC or its
            licensors. You may read, share links to, and use the practical
            guidance for your own household. Please don&apos;t copy the Site
            wholesale or use our name or logo to imply endorsement without
            permission.
          </p>
        </Section>

        <Section title="8. Third-party links and tools">
          <p>
            The Site links to other organizations, agencies, and resources, and
            relies on third-party services (such as Stripe, Supabase, Resend,
            Vercel, and Cloudflare). We don&apos;t control third-party sites or
            services and aren&apos;t responsible for their content or practices.
          </p>
        </Section>

        <Section title="9. Disclaimers and limitation of liability">
          <p>
            The Site and Council are provided &ldquo;as is.&rdquo; To the fullest
            extent allowed by law, CCC disclaims warranties and is not liable for
            indirect or consequential damages, and any total liability is limited
            to the amount you paid us in the past 12 months. Your use of coyote
            and safety information is at your own risk. Please read the full{" "}
            <Link href="/liability" className="text-clay hover:underline">
              Disclaimers, Assumption of Risk &amp; Release of Liability
            </Link>
            , which is part of these Terms.
          </p>
        </Section>

        <Section title="10. Indemnification">
          <p>
            You agree to defend and hold CCC and its volunteers and advisors
            harmless from claims arising out of your misuse of the Site, your
            content, or your violation of these Terms — to the extent allowed by
            law.
          </p>
        </Section>

        <Section title="11. Suspension and ending membership">
          <p>
            You can stop using the Site or ask us to close your account at any
            time. We may suspend or end access for anyone who violates these Terms
            or the law. Sections that by their nature should survive (content
            license, disclaimers, liability, governing law) continue after access
            ends.
          </p>
        </Section>

        <Section title="12. Governing law and disputes">
          <p>
            These Terms are governed by the laws of the{" "}
            <strong>State of California</strong>, without regard to conflict-of-law
            rules. The exclusive place for disputes is the state and federal courts
            located in <strong>Orange County, California</strong>.{" "}
            <em>
              [Confirm whether you want mandatory arbitration / class-action
              waiver — counsel decision.]
            </em>
          </p>
        </Section>

        <Section title="13. Changes and contact">
          <p>
            We may update these Terms; we&apos;ll post the new version here with a
            revised date, and significant changes take effect when posted.
            Questions? Email{" "}
            <a href={`mailto:${EMAIL}`} className="text-clay hover:underline">
              {EMAIL}
            </a>{" "}
            or use our{" "}
            <Link href="/contact" className="text-clay hover:underline">
              Contact page
            </Link>
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
