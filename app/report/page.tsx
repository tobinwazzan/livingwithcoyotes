import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ReportForm from "@/components/ReportForm";

export const metadata: Metadata = {
  title: "Report a coyote",
  description:
    "Report a coyote sighting or incident in Orange County. A quick, structured report helps the Coyote Coexistence Council see where conflict is real and respond where it matters. Not for emergencies — call 911.",
};

export default function ReportPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Report a coyote"
        title="Report a coyote"
        subtitle="A minute of structured detail turns a one-off scare into something the Council can actually act on — and helps your neighbors, too."
      />

      <div className="mx-auto max-w-2xl px-6 py-14">
        {/* Emergency disclaimer — front and center, per the board. */}
        <Reveal>
          <div className="rounded-xl border border-clay/40 bg-clay/10 p-5 text-sm leading-relaxed text-ink">
            <p className="font-semibold text-heading">This isn&apos;t for emergencies.</p>
            <p className="mt-1 text-ink/80">
              If someone is hurt or in immediate danger, call{" "}
              <a href="tel:911" className="font-semibold text-clay underline-offset-2 hover:underline">911</a>.
              To reach animal control about an aggressive, sick, or injured coyote,
              contact{" "}
              <a
                href="https://www.ocpetinfo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-clay underline-offset-2 hover:underline"
              >
                OC Animal Care
              </a>
              . This form helps the Council understand the bigger picture — it
              doesn&apos;t dispatch a response.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <p className="mt-8 leading-relaxed text-ink/85">
            Reports are anonymous unless you choose to leave your contact. We ask
            only for a general area — never an exact address — and we never publish
            your name, contact, or precise location.
          </p>
        </Reveal>

        <div className="mt-8">
          <ReportForm />
        </div>

        <Reveal>
          <p className="mt-10 text-center text-sm text-ink/60">
            Curious what neighbors are reporting?{" "}
            <Link href="/activity" className="font-semibold text-clay hover:text-ink">
              See the recent activity →
            </Link>
          </p>
        </Reveal>
      </div>
    </main>
  );
}
