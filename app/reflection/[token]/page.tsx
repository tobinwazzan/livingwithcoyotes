import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import RevisitClient, { type Round } from "./RevisitClient";

const db = supabaseAdmin ?? supabase;

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your reflection, revisited",
  robots: { index: false, follow: false },
};

export default async function RevisitPage({
  params,
}: {
  params: { token: string };
}) {
  const token = params.token;

  const { data: r1 } = await db
    .from("member_reflections")
    .select("signup_id")
    .eq("revisit_token", token)
    .eq("round", 1)
    .limit(1);

  if (!r1 || r1.length === 0) {
    return (
      <main>
        <PageHeader eyebrow="Reflection" title="This link isn't valid" />
        <section className="mx-auto max-w-xl px-6 py-14 text-center">
          <p className="text-ink/75">
            This revisit link doesn&apos;t match a reflection. If it came from an
            email, try opening it again from there — or reply to that email and
            we&apos;ll send a fresh one.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg border border-line/30 px-5 py-2.5 font-semibold text-heading transition hover:bg-card"
          >
            Back to home
          </Link>
        </section>
      </main>
    );
  }

  const signupId = r1[0].signup_id as string;
  const { data: all } = await db
    .from("member_reflections")
    .select("round, lean, certainty, steelman, moved, created_at")
    .eq("signup_id", signupId)
    .order("round");

  const round1 = (all?.find((r) => r.round === 1) ?? null) as Round | null;
  const round2 = (all?.find((r) => r.round === 2) ?? null) as Round | null;

  return (
    <main>
      <PageHeader
        eyebrow="Revisited"
        title="What's shifted"
        subtitle="You marked where you stood when you joined. Here's a fresh look — then we'll set it beside where you began, just for you."
      />
      <section className="mx-auto max-w-2xl px-6 py-14">
        <RevisitClient token={token} round1={round1} round2={round2} />
      </section>
    </main>
  );
}
