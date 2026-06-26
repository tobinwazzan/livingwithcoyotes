import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { CATEGORIES } from "@/content/report";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recent activity",
  description:
    "What Orange County neighbors are reporting about coyotes — in aggregate, by area and type. A calm read of the local picture, with an honest note on its limits.",
};

const CAT_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label]),
);
// Short, calm labels for the breakdown (the form labels are first-person).
const CAT_SHORT: Record<string, string> = {
  sighting: "Sightings",
  encounter: "Close encounters",
  pet_chase: "Pet chased / threatened",
  pet_attack: "Pet attacked",
  person: "Aggressive toward a person",
  other: "Other",
};

type Row = {
  category: string;
  city: string | null;
  area: string | null;
  created_at: string;
  occurred_on: string | null;
};

function relativeDay(iso: string): string {
  const then = new Date(iso).getTime();
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "last week";
  if (days < 31) return `${Math.floor(days / 7)} weeks ago`;
  return "over a month ago";
}

function tally(rows: Row[], key: (r: Row) => string) {
  const m = new Map<string, number>();
  for (const r of rows) {
    const k = key(r) || "—";
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export default async function ActivityPage() {
  let rows: Row[] = [];
  if (supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from("coyote_reports")
      .select("category, city, area, created_at, occurred_on")
      .order("created_at", { ascending: false })
      .limit(500);
    rows = (data as Row[]) ?? [];
  }

  const total = rows.length;
  const since = Date.now() - 30 * 86_400_000;
  const last30 = rows.filter((r) => new Date(r.created_at).getTime() >= since).length;
  const byCategory = tally(rows, (r) => r.category);
  const byCity = tally(rows, (r) => (r.city ? r.city.trim() : ""))
    .filter(([k]) => k && k !== "—")
    .slice(0, 8);
  const recent = rows.slice(0, 12);

  return (
    <main>
      <PageHeader
        eyebrow="Recent activity"
        title="What neighbors are reporting"
        subtitle="A calm, aggregate read of what's being reported across Orange County — by area and by type, never by household."
      />

      <div className="mx-auto max-w-4xl px-6 py-14">
        {total === 0 ? (
          <Reveal>
            <div className="rounded-2xl border border-line/20 bg-card/60 p-8 text-center">
              <p className="text-lg font-semibold text-heading">No reports yet.</p>
              <p className="mx-auto mt-2 max-w-md text-ink/75">
                As neighbors start reporting, this page will show the picture in
                aggregate — what&apos;s happening, and where, without ever pointing
                at anyone&apos;s home.
              </p>
              <Link
                href="/report"
                className="mt-6 inline-block rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
              >
                Be the first to report →
              </Link>
            </div>
          </Reveal>
        ) : (
          <>
            <Reveal>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-line/15 bg-card p-5">
                  <p className="text-xs uppercase tracking-wide text-ink/50">Total reports</p>
                  <p className="mt-1 text-3xl font-extrabold text-clay">{total}</p>
                </div>
                <div className="rounded-xl border border-line/15 bg-card p-5">
                  <p className="text-xs uppercase tracking-wide text-ink/50">Last 30 days</p>
                  <p className="mt-1 text-3xl font-extrabold text-clay">{last30}</p>
                </div>
                <div className="col-span-2 rounded-xl border border-line/15 bg-card p-5 sm:col-span-1">
                  <p className="text-xs uppercase tracking-wide text-ink/50">Areas reporting</p>
                  <p className="mt-1 text-3xl font-extrabold text-clay">{byCity.length || "—"}</p>
                </div>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Reveal className="h-full">
                <div className="h-full rounded-xl border border-line/15 bg-card p-5">
                  <h2 className="text-sm font-semibold text-heading">By type</h2>
                  <ul className="mt-3 space-y-1.5">
                    {byCategory.map(([k, n]) => (
                      <li key={k} className="flex justify-between text-sm">
                        <span className="text-ink/80">{CAT_SHORT[k] ?? CAT_LABEL[k] ?? k}</span>
                        <span className="font-semibold text-ink">{n}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal className="h-full">
                <div className="h-full rounded-xl border border-line/15 bg-card p-5">
                  <h2 className="text-sm font-semibold text-heading">By area</h2>
                  <ul className="mt-3 space-y-1.5">
                    {byCity.length === 0 && (
                      <li className="text-sm text-ink/50">No areas yet.</li>
                    )}
                    {byCity.map(([k, n]) => (
                      <li key={k} className="flex justify-between text-sm">
                        <span className="text-ink/80">{k}</span>
                        <span className="font-semibold text-ink">{n}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal>
              <div className="mt-8 rounded-xl border border-line/15 bg-card p-5">
                <h2 className="text-sm font-semibold text-heading">Recent reports</h2>
                <ul className="mt-3 divide-y divide-line/10">
                  {recent.map((r, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                      <span className="text-ink/85">
                        {CAT_SHORT[r.category] ?? CAT_LABEL[r.category] ?? r.category}
                        {r.city && <span className="text-ink/55"> · {r.city}</span>}
                        {r.area && <span className="text-ink/45"> ({r.area})</span>}
                      </span>
                      <span className="shrink-0 text-xs text-ink/45">{relativeDay(r.created_at)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </>
        )}

        {/* Honest limits — reporting bias caveat (Schell). Always shown. */}
        <Reveal>
          <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-ink/55">
            An honest note on these numbers: they reflect who reports, not
            necessarily where coyotes are. Neighborhoods that are more online or
            more worried tend to report more, and areas with real activity can be
            under-counted. We show this to start a conversation, not to rank
            streets — and we&apos;re working to hear from every part of the county.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-8 text-center">
            <Link
              href="/report"
              className="inline-block rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
            >
              Report a coyote →
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
