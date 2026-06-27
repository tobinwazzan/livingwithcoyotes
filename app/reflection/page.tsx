import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CaptureForm from "./CaptureForm";

export const metadata: Metadata = {
  title: "A quiet snapshot",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function ReflectionPage({
  searchParams,
}: {
  searchParams: { s?: string };
}) {
  const signupId = (searchParams?.s ?? "").trim();

  return (
    <main>
      <PageHeader
        eyebrow="A quiet snapshot"
        title="Where you stand today"
        subtitle="The Council leaves the conclusions to you. But a real conversation has a way of moving people — so let's mark where you are today, and revisit it later to see what's shifted."
      />

      <section className="mx-auto max-w-2xl px-6 py-14">
        {signupId ? (
          <CaptureForm signupId={signupId} />
        ) : (
          <div className="rounded-2xl border border-line/15 bg-card/60 p-8 text-center">
            <h2 className="text-xl font-bold text-heading">
              Open this from your welcome email
            </h2>
            <p className="mx-auto mt-3 max-w-md text-ink/75">
              This reflection is tied to your membership, so it opens from the
              private link in your welcome email. Already a member and can&apos;t
              find it? Just reply to that email and we&apos;ll resend it.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-lg border border-line/30 px-5 py-2.5 font-semibold text-heading transition hover:bg-card"
            >
              Back to home
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
