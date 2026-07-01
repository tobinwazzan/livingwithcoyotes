import { isAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { dollars } from "@/lib/membership";
import { adminLogout, hideReflection } from "./actions";
import AdminLogin from "./AdminLogin";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

type Member = {
  full_name: string | null;
  email: string;
  role: string;
  city: string;
  source: string | null;
  membership_status: string;
  membership_method: string | null;
  paid_amount_cents: number | null;
  is_droid: boolean | null;
  created_at: string;
};
type FunnelEvent = { event: string; is_bot: boolean };
type ForumPost = { id: string; hidden: boolean; signups: { is_droid: boolean | null } | { is_droid: boolean | null }[] | null };
type Report = {
  category: string;
  city: string | null;
  area: string | null;
  behavior: string | null;
  pet_involved: string | null;
  attractants: string[] | null;
  note: string | null;
  reporter_name: string | null;
  reporter_email: string | null;
  contact_ok: boolean;
  status: string;
  created_at: string;
};

type SharedReflection = {
  id: string;
  lean: number | null;
  certainty: number | null;
  steelman: string | null;
  visibility: string;
  hidden: boolean;
  created_at: string;
  signups: { full_name: string | null } | { full_name: string | null }[] | null;
};

function sharedFirstName(row: SharedReflection): string {
  const s = Array.isArray(row.signups) ? row.signups[0] : row.signups;
  return (s?.full_name ?? "").trim().split(/\s+/)[0] || "";
}

const REPORT_CAT_LABEL: Record<string, string> = {
  sighting: "Sighting", encounter: "Encounter", pet_chase: "Pet chased",
  pet_attack: "Pet attack", person: "Aggressive to person", other: "Other",
};

const ROLE_LABEL: Record<string, string> = {
  resident: "Bystander residents", municipality: "Municipalities",
  expert: "Experts & pros", partner: "Experts & pros (partner)", other: "Other",
  sme: "SMEs", municipality_rep: "Municipality reps",
  coordinator: "Coordinators", admin: "Admin / stewards",
};

function tally<T>(rows: T[], key: (row: T) => string) {
  const m = new Map<string, number>();
  for (const r of rows) { const k = key(r) || "(none)"; m.set(k, (m.get(k) ?? 0) + 1); }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-line/15 bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-ink/50">{label}</p>
      <p className="mt-1 text-2xl font-bold text-heading">{value}</p>
      {sub && <p className="text-xs text-ink/55">{sub}</p>}
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: [string, number][] }) {
  return (
    <div className="rounded-xl border border-line/15 bg-card p-5">
      <h3 className="text-sm font-semibold text-heading">{title}</h3>
      <ul className="mt-3 space-y-1.5">
        {rows.length === 0 && <li className="text-sm text-ink/50">No data yet.</li>}
        {rows.map(([k, n]) => (
          <li key={k} className="flex justify-between text-sm">
            <span className="text-ink/80">{k}</span>
            <span className="font-semibold text-ink">{n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function AdminPage() {
  if (!isAdmin()) return <AdminLogin />;

  if (!supabaseAdmin) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-ink/80">The Supabase service-role key isn&apos;t configured on the server.</p>
      </main>
    );
  }

  const [
    { data: membersRaw },
    { data: eventsRaw },
    { data: reportsRaw },
    { data: sharedRaw },
    { data: postsRaw },
    { data: forumCommentsRaw },
  ] = await Promise.all([
    supabaseAdmin
      .from("signups")
      .select("full_name, email, role, city, source, membership_status, membership_method, paid_amount_cents, is_droid, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("funnel_events").select("event, is_bot"),
    supabaseAdmin
      .from("coyote_reports")
      .select("category, city, area, behavior, pet_involved, attractants, note, reporter_name, reporter_email, contact_ok, status, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("member_reflections")
      .select("id, lean, certainty, steelman, visibility, hidden, created_at, signups(full_name)")
      .in("visibility", ["shared_anon", "shared_named"])
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("forum_posts").select("id, hidden, signups(is_droid)"),
    supabaseAdmin.from("forum_comments").select("id, hidden"),
  ]);

  const members = (membersRaw ?? []) as Member[];
  const events = (eventsRaw ?? []) as FunnelEvent[];
  const reports = (reportsRaw ?? []) as Report[];
  const shared = (sharedRaw ?? []) as SharedReflection[];
  const forumPosts = (postsRaw ?? []) as ForumPost[];
  const forumComments = (forumCommentsRaw ?? []) as { id: string; hidden: boolean }[];
  const urgentReports = reports.filter(
    (r) => r.category === "pet_attack" || r.category === "person",
  );
  const fev = (e: string) => ({
    humans: events.filter((x) => x.event === e && !x.is_bot).length,
    bots: events.filter((x) => x.event === e && x.is_bot).length,
  });

  const active = members.filter((m) => m.membership_status === "active");
  const founding = active.filter((m) => m.membership_method === "founding");

  // Real money vs droid (simulated) money — never mixed.
  const realActive = active.filter((m) => !m.is_droid);
  const droidActive = active.filter((m) => m.is_droid);
  const realRevenue = realActive.reduce((s, m) => s + (m.paid_amount_cents ?? 0), 0);
  const droidRevenue = droidActive.reduce((s, m) => s + (m.paid_amount_cents ?? 0), 0);
  const droidMembers = members.filter((m) => m.is_droid);

  // Forum activity, split human vs droid.
  const postIsDroid = (p: ForumPost) => {
    const s = Array.isArray(p.signups) ? p.signups[0] : p.signups;
    return !!s?.is_droid;
  };
  const visiblePosts = forumPosts.filter((p) => !p.hidden);
  const droidPosts = visiblePosts.filter(postIsDroid);
  const visibleComments = forumComments.filter((c) => !c.hidden);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-heading">CCC Admin</h1>
        <form action={adminLogout}>
          <button className="text-sm text-ink/60 underline-offset-2 hover:text-ink hover:underline">Sign out</button>
        </form>
      </div>

      {/* Funnel */}
      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-clay">Funnel (all time)</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Continue clicks" value={fev("continue_clicked").humans} sub={`${fev("continue_clicked").bots} bot`} />
        <Stat label="Leads created" value={fev("lead_created").humans} />
        <Stat label="Activated" value={fev("activated").humans} />
        <Stat label="Bots dropped" value={fev("dropped_bot").humans + fev("dropped_bot").bots} />
        <Stat label="Invalid / drops" value={fev("invalid").humans} />
      </div>

      {/* Members */}
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-clay">Members</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total signups" value={members.length} />
        <Stat label="Paid / active (real)" value={realActive.length} sub={`${droidActive.length} droids excluded`} />
        <Stat label="Leads (unpaid)" value={members.length - active.length} />
        <Stat label="Free members" value={founding.length} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Breakdown title="By segment" rows={tally(members, (m) => ROLE_LABEL[m.role] ?? m.role)} />
        <Breakdown title="By city" rows={tally(members, (m) => m.city)} />
        <Breakdown title="By channel" rows={tally(members, (m) => m.source ?? "(none)")} />
      </div>

      {/* Contributions — real money kept strictly apart from droid (simulated) money */}
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-clay">Contributions</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Stat label="Real money" value={dollars(realRevenue)} sub={`${realActive.length} real members — actually collected`} />
        <Stat label="Droid money (simulated)" value={dollars(droidRevenue)} sub={`${droidActive.length} droids — NOT real, never collected`} />
        <Stat label="Droid accounts" value={droidMembers.length} sub="synthetic test members" />
      </div>

      {/* Forum */}
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-clay">Forum</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Posts" value={visiblePosts.length} />
        <Stat label="Replies" value={visibleComments.length} />
        <Stat label="Droid posts" value={droidPosts.length} sub="by synthetic members" />
        <Stat label="Human posts" value={visiblePosts.length - droidPosts.length} />
      </div>

      {/* Recent */}
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-clay">Recent signups</h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-line/15">
        <table className="w-full text-sm">
          <thead className="bg-card text-left text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-3 py-2">Name</th><th className="px-3 py-2">Segment</th>
              <th className="px-3 py-2">City</th><th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Via</th><th className="px-3 py-2">When</th>
            </tr>
          </thead>
          <tbody>
            {members.slice(0, 25).map((m, i) => (
              <tr key={i} className={`border-t border-line/10 ${m.is_droid ? "bg-clay/5" : ""}`}>
                <td className="px-3 py-2 text-ink/85">
                  {m.full_name || m.email}
                  {m.is_droid && <span className="ml-1 text-xs font-semibold text-clay">(droid)</span>}
                </td>
                <td className="px-3 py-2 text-ink/70">{ROLE_LABEL[m.role] ?? m.role}</td>
                <td className="px-3 py-2 text-ink/70">{m.city}</td>
                <td className="px-3 py-2 text-ink/70">{m.membership_status}</td>
                <td className="px-3 py-2 text-ink/70">{m.membership_method ?? "—"}</td>
                <td className="px-3 py-2 text-ink/55">{new Date(m.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-ink/50">No signups yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Coyote reports */}
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-clay">Coyote reports</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total reports" value={reports.length} />
        <Stat label="Urgent (attack / person)" value={urgentReports.length} sub="pet attack or aggressive-to-person" />
        <Stat label="With contact" value={reports.filter((r) => r.contact_ok && r.reporter_email).length} sub="opted in to follow-up" />
        <Stat label="New / unreviewed" value={reports.filter((r) => r.status === "new").length} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Breakdown title="By type" rows={tally(reports, (r) => REPORT_CAT_LABEL[r.category] ?? r.category)} />
        <Breakdown title="By city" rows={tally(reports, (r) => r.city ?? "(none)")} />
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-line/15">
        <table className="w-full text-sm">
          <thead className="bg-card text-left text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-3 py-2">Type</th><th className="px-3 py-2">City / area</th>
              <th className="px-3 py-2">Pet</th><th className="px-3 py-2">Attractants</th>
              <th className="px-3 py-2">Contact</th><th className="px-3 py-2">When</th>
            </tr>
          </thead>
          <tbody>
            {reports.slice(0, 40).map((r, i) => {
              const urgent = r.category === "pet_attack" || r.category === "person";
              return (
                <tr key={i} className={`border-t border-line/10 ${urgent ? "bg-clay/5" : ""}`}>
                  <td className="px-3 py-2 font-medium text-ink/85">
                    {urgent && <span aria-hidden className="mr-1 text-clay">●</span>}
                    {REPORT_CAT_LABEL[r.category] ?? r.category}
                  </td>
                  <td className="px-3 py-2 text-ink/70">{r.city}{r.area ? ` · ${r.area}` : ""}</td>
                  <td className="px-3 py-2 text-ink/70">{r.pet_involved ?? "—"}</td>
                  <td className="px-3 py-2 text-ink/60">{r.attractants?.length ? r.attractants.join(", ") : "—"}</td>
                  <td className="px-3 py-2 text-ink/70">{r.contact_ok && r.reporter_email ? r.reporter_email : "—"}</td>
                  <td className="px-3 py-2 text-ink/55">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              );
            })}
            {reports.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-ink/50">No reports yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Shared reflections — moderation for the wall of understanding */}
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-clay">
        Shared reflections ({shared.length}) — wall of understanding
      </h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-line/15">
        <table className="w-full text-sm">
          <thead className="bg-card text-left text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-3 py-2">Shown as</th><th className="px-3 py-2">Lean</th>
              <th className="px-3 py-2">Sure</th><th className="px-3 py-2">Steelman</th>
              <th className="px-3 py-2">When</th><th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {shared.map((row) => {
              const display =
                row.visibility === "shared_named"
                  ? sharedFirstName(row) || "—"
                  : "Anonymous";
              return (
                <tr key={row.id} className={`border-t border-line/10 ${row.hidden ? "opacity-50" : ""}`}>
                  <td className="px-3 py-2 text-ink/85">
                    {display}
                    {row.hidden && <span className="ml-1 text-xs text-clay">(hidden)</span>}
                  </td>
                  <td className="px-3 py-2 text-ink/70">{row.lean ?? "—"}/7</td>
                  <td className="px-3 py-2 text-ink/70">{row.certainty ?? "—"}%</td>
                  <td className="max-w-md px-3 py-2 text-ink/70">
                    {(row.steelman ?? "").slice(0, 160)}
                    {(row.steelman ?? "").length > 160 ? "…" : ""}
                  </td>
                  <td className="px-3 py-2 text-ink/55">{new Date(row.created_at).toLocaleDateString()}</td>
                  <td className="px-3 py-2">
                    {!row.hidden && (
                      <form action={hideReflection.bind(null, row.id)}>
                        <button className="text-xs font-semibold text-clay hover:text-ink">Hide</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
            {shared.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-ink/50">No shared reflections yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
