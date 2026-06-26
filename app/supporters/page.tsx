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

// Always reflect the live member list — never serve a cached copy of the wall.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type Supporter = {
  display: string | null;
  city: string | null;
  is_patron: boolean;
  photo_url: string | null;
  joined: string | null;
};

// Warm, on-brand palette for monogram avatars (deterministic per name).
const AVATAR_BG = ["#b5764f", "#5a6b4a", "#7d8a5c", "#a8632e", "#6b5a3e", "#8a7a4f"];

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({ s, size }: { s: Supporter; size: number }) {
  const name = s.display || "·";
  const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const bg = AVATAR_BG[hash % AVATAR_BG.length];
  return (
    <div
      className="shrink-0 overflow-hidden rounded-full ring-2 ring-sand/60 shadow-sm"
      style={{ width: size, height: size }}
    >
      {s.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={s.photo_url} alt="" className="h-full w-full object-cover" />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-bold text-sand"
          style={{ background: bg, fontSize: size * 0.38 }}
        >
          {initials(name)}
        </div>
      )}
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="px-5 text-center">
      <div className="text-2xl font-extrabold text-heading sm:text-3xl">{n}</div>
      <div className="text-xs font-medium uppercase tracking-[0.14em] text-ink/55">{label}</div>
    </div>
  );
}

export default async function SupportersPage() {
  // Public, sanitized read — opt-in rows only, no email/phone/amount ever.
  const db = supabaseAdmin ?? supabase;
  const { data } = await db.rpc("public_supporters");
  const list: Supporter[] = Array.isArray(data) ? data.filter((s) => s.display) : [];
  const patrons = list.filter((s) => s.is_patron);
  const members = list.filter((s) => !s.is_patron);
  const cities = new Set(list.map((s) => s.city).filter(Boolean)).size;

  return (
    <main>
      <PageHeader
        eyebrow="Wall of Supporters"
        title="The people funding the plan"
        subtitle="Every name here chose to be listed. Their memberships pay for plain-language guidance, the yard-proofing checklist, pet-safety protocols, and the sightings map — free for every resident in their city, member or not."
      />

      <div className="mx-auto max-w-5xl px-6 py-16">
        {list.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-clay/30 bg-clay/5 p-10 text-center">
            <div className="text-4xl">🐾</div>
            <p className="mt-4 text-lg text-ink/80">The wall is just getting started.</p>
            <Link
              href="/join"
              className="mt-5 inline-block rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
            >
              Be the first name on it →
            </Link>
          </div>
        ) : (
          <>
            {/* Stat band */}
            <div className="mb-14 flex items-center justify-center divide-x divide-line/20">
              <Stat n={list.length} label={list.length === 1 ? "Supporter" : "Supporters"} />
              <Stat n={cities} label={cities === 1 ? "City" : "Cities"} />
              {patrons.length > 0 && <Stat n={patrons.length} label="Patrons" />}
            </div>

            {/* Founding Patrons — featured */}
            {patrons.length > 0 && (
              <section className="mb-16">
                <div className="mb-7 text-center">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
                    ★ Founding Patrons
                  </h2>
                  <p className="mt-1 text-sm text-ink/60">
                    Members who gave $50 or more to get the Council off the ground.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {patrons.map((s, i) => (
                    <div
                      key={i}
                      className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border-2 border-clay/40 bg-gradient-to-b from-clay/10 to-card/40 px-5 py-7 text-center transition hover:border-clay/70 hover:shadow-md"
                    >
                      <span className="absolute right-3 top-3 text-sm" aria-hidden>★</span>
                      <Avatar s={s} size={80} />
                      <div>
                        <div className="font-bold text-heading">{s.display}</div>
                        {s.city && <div className="text-sm text-ink/60">{s.city}</div>}
                        <div className="mt-2 inline-block rounded-full bg-clay/15 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-clay">
                          Founding Patron
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Members */}
            {members.length > 0 && (
              <section>
                {patrons.length > 0 && (
                  <div className="mb-7 text-center">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
                      Members
                    </h2>
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-line/20 bg-card/60 px-4 py-3 transition hover:border-clay/40 hover:bg-card"
                    >
                      <Avatar s={s} size={44} />
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-heading">{s.display}</div>
                        {s.city && <div className="truncate text-xs text-ink/55">{s.city}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <div className="mt-16 rounded-2xl border border-line/20 bg-dusk px-8 py-10 text-center text-sand">
              <p className="text-lg font-semibold">Want your name on the wall?</p>
              <p className="mx-auto mt-2 max-w-md text-sand/70">
                Join the Council, choose how you appear, and add your photo — it takes a minute.
              </p>
              <Link
                href="/join"
                className="mt-6 inline-block rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
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
