import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const metadata: Metadata = {
  title: "Supporters",
  description:
    "The residents, experts, and patrons whose memberships fund our cities' coyote plans. Every name here chose to be listed.",
};

export const dynamic = "force-dynamic";

type Supporter = {
  display: string | null;
  city: string | null;
  is_patron: boolean;
  joined: string | null;
};

function nameLine(s: Supporter) {
  return [s.display, s.city].filter(Boolean).join(" · ");
}

export default async function SupportersPage() {
  // Public, sanitized read — opt-in rows only, no email/phone/amount ever.
  // Server-side render via the service-role client for reliability; the RPC
  // itself already strips everything but name/city/patron-flag.
  const db = supabaseAdmin ?? supabase;
  const { data } = await db.rpc("public_supporters");
  const list: Supporter[] = Array.isArray(data) ? data.filter((s) => s.display) : [];
  const patrons = list.filter((s) => s.is_patron);
  const members = list.filter((s) => !s.is_patron);

  return (
    <main>
      <PageHeader
        eyebrow="Wall of Supporters"
        title="The people funding the plan"
        subtitle="Every name here chose to be listed. Their memberships pay for plain-language guidance, the yard-proofing checklist, pet-safety protocols, and the sightings map — free for every resident, member or not."
      />

      <div className="mx-auto max-w-4xl px-6 py-16">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-clay/30 bg-clay/5 p-10 text-center">
            <p className="text-lg text-ink/80">
              The wall is just getting started.
            </p>
            <Link
              href="/join"
              className="mt-5 inline-block rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
            >
              Be the first name on it →
            </Link>
          </div>
        ) : (
          <>
            {patrons.length > 0 && (
              <section className="mb-12">
                <h2 className="mb-1 text-center text-xs font-semibold uppercase tracking-[0.18em] text-clay">
                  Founding Patrons
                </h2>
                <p className="mb-6 text-center text-sm text-ink/60">
                  Members who gave $50 or more to get the Council off the ground.
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {patrons.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border-2 border-clay/40 bg-clay/5 px-4 py-3"
                    >
                      <span aria-hidden className="text-lg">🌟</span>
                      <span className="font-semibold text-heading">{nameLine(s)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {members.length > 0 && (
              <section>
                {patrons.length > 0 && (
                  <h2 className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink/50">
                    Members
                  </h2>
                )}
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((s, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-line/20 bg-card/60 px-4 py-2.5 text-sm text-ink/85"
                    >
                      {nameLine(s)}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-14 text-center">
              <p className="text-ink/70">Want your name here?</p>
              <Link
                href="/join"
                className="mt-4 inline-block rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
              >
                Join the Council →
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
