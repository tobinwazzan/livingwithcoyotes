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

export default async function LoginPage() {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/account");

  return (
    <main>
      <PageHeader
        eyebrow="Members"
        title="Sign in"
        subtitle="Your account holds your membership, your reflection, and the resources you save. Sign in with a one-time link — no password to remember."
      />
      <section className="mx-auto max-w-2xl px-6 py-14">
        <LoginForm />
      </section>
    </main>
  );
}
