import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How the Coyote Coexistence Council handles your information — what we collect, why, and our promise to never sell or rent it.",
};

const EMAIL = "members@livingwithcoyotes.org";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section className="mt-10">
        <h2 className="text-xl font-bold text-heading">{title}</h2>
        <div className="mt-3 space-y-3 leading-relaxed text-ink/80">
          {children}
        </div>
      </section>
    </Reveal>
  );
}

export default function PrivacyPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy Policy"
        subtitle="Plain language: what we collect, why, and what we'll never do with it."
      />

      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* The short version */}
        <Reveal>
          <div className="rounded-xl border-y border-line/20 bg-panel p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-clay">
              The short version
            </p>
            <ul className="mt-4 space-y-2 text-ink/85">
              <li>• We collect only what we need to run the Council.</li>
              <li>
                • <strong>We never sell, rent, or trade your personal
                information — ever.</strong>
              </li>
              <li>
                • Payments are handled by Stripe; we never see or store your card
                number.
              </li>
              <li>
                • You can ask us to see, correct, or delete your information at
                any time.
              </li>
            </ul>
          </div>
        </Reveal>

        <Section title="Who we are">
          <p>
            The Coyote Coexistence Council (&ldquo;we,&rdquo; &ldquo;us&rdquo;)
            operates livingwithcoyotes.org. This policy explains how we handle
            information for people who visit the site or join the Council.
          </p>
        </Section>

        <Section title="What we collect">
          <p>
            <strong>Information you give us.</strong> When you join or sign up, we
            collect what you enter on the form: your name, email, phone number,
            city, and how you&apos;d like to participate. Depending on your role
            you may also provide a professional profile link, the neighborhood
            apps you use, or — if you pay by Venmo or Zelle — a screenshot of
            your receipt.
          </p>
          <p>
            <strong>Things you create as a member.</strong> If you use member
            features, we store what you submit: coyote <strong>reports</strong> (a
            coarse location — city and general area, never your exact address —
            plus the details you provide); your private{" "}
            <strong>reflections</strong> (the &ldquo;Steelman Mirror&rdquo; — where
            you lean, how certain you are, and what you write); and, only if you
            choose, an opt-in <strong>name, city, and photo</strong> for The Pack
            wall.
          </p>
          <p>
            <strong>Payment information.</strong> Card payments are processed
            securely by <strong>Stripe</strong>. We never receive or store your
            full card number. For Venmo or Zelle, we only see the receipt you
            choose to upload.
          </p>
          <p>
            <strong>On your device.</strong> Your browser stores small
            preferences locally — your light/dark theme and your progress on the
            coyote-proofing checklist. These stay on your device and are not sent
            to us.
          </p>
          <p>
            <strong>Basic technical data.</strong> Like most sites, our host
            keeps standard server logs (e.g., IP address and browser type) to
            keep the site running and secure.
          </p>
        </Section>

        <Section title="How we use it">
          <p>
            We use your information to run the Council: to manage your
            membership, group members by city, process payments, respond to you,
            send you relevant updates, and improve the site. That&apos;s it.
          </p>
        </Section>

        <Section title="What we never do">
          <p>
            <strong>
              We never sell, rent, or trade your personal information to anyone.
            </strong>{" "}
            We don&apos;t run third-party advertising or hand your details to
            data brokers, and we won&apos;t spam you.
          </p>
        </Section>

        <Section title="Who we share it with">
          <p>
            We share information only with the service providers that help us
            operate, and only so they can do that job:
          </p>
          <ul className="ml-1 space-y-1.5">
            <li>• <strong>Stripe</strong> — secure payment processing.</li>
            <li>
              • <strong>Supabase</strong> — our secure database and file storage.
            </li>
            <li>• <strong>Vercel</strong> — website hosting.</li>
            <li>
              • <strong>Resend</strong> — sending our emails (welcome notes and
              sign-in links).
            </li>
            <li>
              • <strong>Cloudflare</strong> — DNS and bot protection (the
              verification check on our forms).
            </li>
            <li>• <strong>Google Workspace</strong> — our staff email.</li>
          </ul>
          <p>
            These providers process data on our behalf and aren&apos;t permitted
            to use it for their own marketing. We may also disclose information
            if the law genuinely requires it. We do not sell to advertisers or
            data brokers.
          </p>
        </Section>

        <Section title="Cookies & tracking">
          <p>
            We keep this minimal. We use small bits of local browser storage for
            your theme and checklist preferences (above). We do not run
            third-party advertising or cross-site tracking cookies.
          </p>
        </Section>

        <Section title="Security & retention">
          <p>
            We take reasonable measures to protect your information, and payment
            data is handled by PCI-compliant Stripe — but no online system is
            ever 100% secure. We keep your membership information while
            you&apos;re a member or as needed to run the Council, and we delete
            it on request.
          </p>
        </Section>

        <Section title="Your choices">
          <p>
            You can ask to see, correct, or delete your information, or opt out
            of updates, at any time — just email{" "}
            <a href={`mailto:${EMAIL}`} className="text-clay hover:underline">
              {EMAIL}
            </a>
            .
          </p>
        </Section>

        <Section title="Your reflections, and research use">
          <p>
            The Steelman Mirror is a <strong>private</strong> space. Your
            reflections — where you lean, your certainty, and what you write — are{" "}
            <strong>never shown publicly or to other members</strong> unless you
            explicitly choose to share them.
          </p>
          <p>
            We may review reflections in <strong>anonymized and aggregate</strong>{" "}
            form to understand how thinking shifts over time, and the Council may
            publish such de-identified, aggregate findings. We will not publish
            content that identifies you without your consent.{" "}
            <em>
              [If formal research or publication is planned, obtain explicit opt-in
              consent and confirm whether IRB review applies — counsel/ethics to
              advise.]
            </em>
          </p>
        </Section>

        <Section title="The Pack & photos">
          <p>
            The Pack supporters wall is{" "}
            <strong>opt-in and anonymous by default</strong>. Nothing about you
            appears there unless you choose it. If you opt in, only the display you
            select is shown — first name or full name, your city, and an optional
            photo — never your email, phone, or contribution amount. You can change
            or remove your Pack display at any time by emailing us.
          </p>
        </Section>

        <Section title="Your California privacy rights">
          <p>
            If you&apos;re a California resident, you have the right to know what
            personal information we hold, to request a copy, to ask us to correct
            or delete it, and to not be treated differently for exercising these
            rights. <strong>We do not sell or share your personal information</strong>{" "}
            for advertising. To make a request, email{" "}
            <a href={`mailto:${EMAIL}`} className="text-clay hover:underline">
              {EMAIL}
            </a>
            ; we may need to verify your identity first.{" "}
            <em>[Confirm CCPA/CPRA applicability and exact rights language with counsel.]</em>
          </p>
        </Section>

        <Section title="Children">

          <p>
            The site is intended for adults and isn&apos;t directed to children
            under 13, and we don&apos;t knowingly collect their information.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If we update this policy, we&apos;ll post the new version here with a
            revised date.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about your privacy? Email{" "}
            <a href={`mailto:${EMAIL}`} className="text-clay hover:underline">
              {EMAIL}
            </a>{" "}
            or see our{" "}
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
