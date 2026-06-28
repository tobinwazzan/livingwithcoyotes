import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { getSupabaseServer } from "@/lib/supabaseServer";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/account");

  const error = (searchParams?.error ?? "").trim();

  return (
    <main>
      <PageHeader
        eyebrow="Members"
        title="Sign in"
        subtitle="Your account holds your membership, your reflection, and the resources you save. Sign in with a one-time link — no password to remember."
      />
      <section className="mx-auto max-w-2xl px-6 py-14">
        {error && (
          <p className="mx-auto mb-6 max-w-sm rounded-lg border border-clay/30 bg-clay/10 px-4 py-3 text-center text-sm text-ink/80">
            That sign-in link didn&apos;t go through ({error}). Please request a
            fresh one below.
          </p>
        )}
        <LoginForm />
      </section>
    </main>
  );
}
