import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Wall of Understanding",
  description:
    "Members making the strongest case for the view they lean against — being generous to the other side. The skill of doubt, in their own words.",
};

const db = supabaseAdmin ?? supabase;

type Row = {
  display: string | null;
  lean: number | null;
  certainty: number | null;
  steelman: string | null;
  created_at: string;
};

export default async function UnderstandingPage() {
  // Sanitized server-side read — never reflects email/amount/private rows.
  const { data } = await db.rpc("public_understanding");
  const rows = (data ?? []) as Row[];

  return (
    <main>
      <PageHeader
        eyebrow="Wall of Understanding"
        title="In each other's words"
        subtitle="Every entry here is a member making the strongest case for the view they lean against. No one is arguing their own side — they're being generous to the other. That's the whole point."
      />

      <section className="mx-auto max-w-2xl px-6 py-14">
        {rows.length === 0 ? (
          <Reveal>
            <div className="rounded-2xl border border-line/15 bg-card/60 p-8 text-center">
              <p className="text-ink/75">
                No one has shared yet. The first voice here will be someone
                willing to argue, generously, for the side they don&apos;t hold.
              </p>
              <Link
                href="/login"
                className="mt-5 inline-block font-semibold text-clay hover:text-ink"
              >
                Sign in to your reflection →
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-5">
            {rows.map((r, i) => (
              <Reveal key={i} delay={(i % 4) * 60}>
                <figure className="rounded-2xl border border-line/15 bg-card/60 p-6">
                  <blockquote className="text-lg italic leading-relaxed text-ink/85">
                    “{r.steelman}”
                  </blockquote>
                  <figcaption className="mt-3 text-sm text-ink/55">
                    — {r.display || "A neighbor"}, making the case they lean
                    against
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal>
          <p className="mt-10 text-center text-sm text-ink/55">
            Want to add yours? It starts with the{" "}
            <Link href="/login" className="text-clay hover:underline">
              reflection
            </Link>{" "}
            in your account — sharing is opt-in, and you can stay anonymous.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
