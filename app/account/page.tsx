import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { supabase as anon } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { reflectionsForSignup } from "@/lib/reflections";
import ReflectionTimeline from "@/app/reflection/ReflectionTimeline";
import { addReflectionForMe } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

const db = supabaseAdmin ?? anon;

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line/15 bg-card/60 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-clay">
        {title}
      </h2>
      <div className="mt-3 text-ink/80">{children}</div>
    </div>
  );
}

export default async function AccountPage() {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const email = (user.email ?? "").trim();

  const { data: su } = await db
    .from("signups")
    .select("id, full_name, membership_status, created_at")
    .ilike("email", email)
    .order("created_at", { ascending: false })
    .limit(1);
  const member = su?.[0] ?? null;
  const isMember = member?.membership_status === "active";

  const reflections = member ? await reflectionsForSignup(member.id) : [];
  const hasReflection = reflections.length > 0;

  const first = (member?.full_name ?? "").trim().split(/\s+/)[0];

  return (
    <main>
      <PageHeader
        eyebrow="Your account"
        title={first ? `Welcome back, ${first}` : "Your account"}
        subtitle={`Signed in as ${email}.`}
      />

      <section className="mx-auto max-w-2xl space-y-5 px-6 py-14">
        <Card title="Membership">
          {isMember ? (
            <div>
              <p>
                Your membership is <strong className="text-ink">active</strong>.
                Thank you for keeping this work going.
              </p>
              <Link
                href={`/certificate/${member!.id}`}
                className="mt-3 inline-block font-semibold text-clay hover:text-ink"
              >
                View your certificate →
              </Link>
            </div>
          ) : (
            <div>
              <p>
                You&apos;re signed in, but we don&apos;t see an active membership
                under this email yet.
              </p>
              <Link
                href="/join"
                className="mt-3 inline-block rounded-lg bg-clay px-5 py-2.5 font-semibold text-sand transition hover:bg-bark"
              >
                Join the Council
              </Link>
            </div>
          )}
        </Card>

        {member && (
          <Card title="Your transformation">
            {hasReflection ? (
              <ReflectionTimeline
                entries={reflections}
                addAction={addReflectionForMe}
              />
            ) : (
              <div>
                <p>
                  Take a quiet, private reflection on where you stand — then add
                  more over time and watch your thinking move.
                </p>
                <Link
                  href={`/reflection?s=${member.id}`}
                  className="mt-3 inline-block font-semibold text-clay hover:text-ink"
                >
                  Start your reflection →
                </Link>
              </div>
            )}
          </Card>
        )}

        <Card title="Keep exploring">
          <p className="text-ink/75">Where to go next:</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/resources" className="font-semibold text-clay hover:text-ink">
              Resources →
            </Link>
            <Link href="/faq" className="font-semibold text-clay hover:text-ink">
              Coyote Q&amp;A →
            </Link>
            <Link href="/understanding" className="font-semibold text-clay hover:text-ink">
              Wall of Understanding →
            </Link>
          </div>
        </Card>

        <Card title="Saved resources">
          <p className="text-ink/65">
            Soon you&apos;ll be able to save the guides and videos that help you,
            build your own collection, and share it. Coming shortly.
          </p>
        </Card>

        <div className="pt-2 text-center">
          <a
            href="/logout"
            className="text-sm font-medium text-ink/60 transition hover:text-clay"
          >
            Sign out
          </a>
        </div>
      </section>
    </main>
  );
}
