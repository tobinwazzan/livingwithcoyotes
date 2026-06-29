import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const metadata: Metadata = {
  title: "The Pack",
  description:
    "The Pack — the residents whose contributions keep our cities' coyote plans alive. Every name here gave, and chose to be listed.",
};

// Always reflect the live contributor list — never serve a cached copy.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type Contributor = {
  display: string | null;
  city: string | null;
  tier: number; // 100 | 50 | 20
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

function Avatar({ s, size }: { s: Contributor; size: number }) {
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

// The three contribution levels, richest first. Each gets its own section.
const TIERS: { tier: number; label: string; note: string; size: number; cols: string }[] = [
  { tier: 100, label: "★ Pack Leaders · $100", note: "Neighbors who gave $100 or more to lead the way.", size: 80, cols: "sm:grid-cols-2 lg:grid-cols-3" },
  { tier: 50, label: "Trail Markers · $50", note: "Neighbors who gave $50 to keep us moving.", size: 64, cols: "sm:grid-cols-2 lg:grid-cols-4" },
  { tier: 20, label: "The Pack · $20", note: "Neighbors who chipped in $20 to run with us.", size: 44, cols: "sm:grid-cols-2 lg:grid-cols-3" },
];

function TierCard({ s, size }: { s: Contributor; size: number }) {
  const featured = size >= 72;
  if (featured) {
    return (
      <div className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border-2 border-clay/40 bg-gradient-to-b from-clay/10 to-card/40 px-5 py-7 text-center transition hover:border-clay/70 hover:shadow-md">
        <span className="absolute right-3 top-3 text-sm" aria-hidden>★</span>
        <Avatar s={s} size={size} />
        <div>
          <div className="font-bold text-heading">{s.display}</div>
          {s.city && <div className="text-sm text-ink/60">{s.city}</div>}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line/20 bg-card/60 px-4 py-3 transition hover:border-clay/40 hover:bg-card">
      <Avatar s={s} size={size} />
      <div className="min-w-0">
        <div className="truncate font-semibold text-heading">{s.display}</div>
        {s.city && <div className="truncate text-xs text-ink/55">{s.city}</div>}
      </div>
    </div>
  );
}

export default async function PackPage() {
  // Public, sanitized read — opt-in contributors only, no email/phone/exact amount.
  const db = supabaseAdmin ?? supabase;
  const { data } = await db.rpc("public_contributors");
  const list: Contributor[] = Array.isArray(data) ? data.filter((s) => s.display) : [];
  const cities = new Set(list.map((s) => s.city).filter(Boolean)).size;

  return (
    <main>
      <PageHeader
        eyebrow="🐾 The Pack"
        title="The people keeping the plan alive"
        subtitle="Registering is free for everyone. The Pack is different — these are the neighbors who chose to give, and chose to be named. Their contributions pay for the plain-language guidance, the yard-proofing checklist, pet-safety protocols, and the sightings map, free for every resident in their city."
      />

      <div className="mx-auto max-w-5xl px-6 py-16">
        {list.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-clay/30 bg-clay/5 p-10 text-center">
            <div className="text-4xl">🐾</div>
            <p className="mt-4 text-lg text-ink/80">The Pack is just getting started.</p>
            <Link
              href="/contribute"
              className="mt-5 inline-block rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
            >
              Be the first to give →
            </Link>
          </div>
        ) : (
          <>
            {/* Stat band */}
            <div className="mb-14 flex items-center justify-center divide-x divide-line/20">
              <Stat n={list.length} label={list.length === 1 ? "Contributor" : "Contributors"} />
              <Stat n={cities} label={cities === 1 ? "City" : "Cities"} />
            </div>

            {/* One section per contribution level, richest first */}
            {TIERS.map(({ tier, label, note, size, cols }) => {
              const people = list.filter((s) => s.tier === tier);
              if (people.length === 0) return null;
              return (
                <section key={tier} className="mb-16 last:mb-0">
                  <div className="mb-7 text-center">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">{label}</h2>
                    <p className="mt-1 text-sm text-ink/60">{note}</p>
                  </div>
                  <div className={`grid gap-3 ${cols}`}>
                    {people.map((s, i) => (
                      <TierCard key={i} s={s} size={size} />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* CTA */}
            <div className="mt-16 rounded-2xl border border-line/20 bg-dusk px-8 py-10 text-center text-sand">
              <p className="text-lg font-semibold">Want to run with the Pack?</p>
              <p className="mx-auto mt-2 max-w-md text-sand/70">
                A contribution keeps the guidance, the checklists, and the map free for your whole city.
              </p>
              <Link
                href="/contribute"
                className="mt-6 inline-block rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
              >
                Contribute →
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
