import type { Metadata } from "next";
import Link from "next/link";
import { getCertificate } from "@/lib/certificate";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const cert = await getCertificate(params.id);
  return {
    title: cert ? `${cert.name} — ${cert.tier}` : "Membership Certificate",
    // Members may share it, but it shouldn't be search-indexed.
    robots: { index: false, follow: false },
    openGraph: { images: [`/certificate/${params.id}/image`] },
  };
}

export default async function CertificatePage({
  params,
}: {
  params: { id: string };
}) {
  const cert = await getCertificate(params.id);
  const imgSrc = `/certificate/${params.id}/image`;

  if (!cert) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-card px-6 py-24 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-heading">Certificate not found</h1>
          <p className="mt-3 text-ink/75">
            This link isn&apos;t valid. If you&apos;re a member, use the certificate
            link in your welcome email.
          </p>
          <Link href="/" className="mt-6 inline-block font-semibold text-clay hover:underline">
            ← Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clay">
        🐾 The Pack
      </p>
      <h1 className="mt-3 text-3xl font-bold text-heading">
        Your membership certificate
      </h1>
      <p className="mx-auto mt-3 max-w-md text-ink/75">
        Thank you, {cert.name.split(" ")[0]} — here&apos;s your{" "}
        <strong>{cert.tier}</strong> certificate. Download it, print it, or share it.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={`${cert.name} — ${cert.tier} certificate`}
        className="mx-auto mt-8 w-full rounded-xl border border-line/20 shadow-md"
      />

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href={imgSrc}
          download="ccc-membership-certificate.png"
          className="rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
        >
          Download certificate
        </a>
        <Link
          href="/pack"
          className="rounded-lg border border-line/30 px-6 py-3 font-semibold text-ink/80 transition hover:border-clay/50"
        >
          See The Pack →
        </Link>
      </div>
    </main>
  );
}
