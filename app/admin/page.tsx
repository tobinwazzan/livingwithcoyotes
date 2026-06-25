import { isAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { dollars } from "@/lib/membership";
import { adminLogout } from "./actions";
import AdminLogin from "./AdminLogin";

export const dynamic = "force-dynamic";

type Member = {
  full_name: string | null;
  email: string;
  role: string;
  city: string;
  source: string | null;
  membership_status: string;
  membership_method: string | null;
  paid_amount_cents: number | null;
  created_at: string;
};
type FunnelEvent = { event: string; is_bot: boolean };

const ROLE_LABEL: Record<string, string> = {
  resident: "Residents", municipality: "Municipalities",
  expert: "Experts & pros", partner: "Experts & pros (partner)", other: "Other",
};

function tally(rows: Member[], key: (m: Member) => string) {
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

  const [{ data: membersRaw }, { data: eventsRaw }] = await Promise.all([
    supabaseAdmin
      .from("signups")
      .select("full_name, email, role, city, source, membership_status, membership_method, paid_amount_cents, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("funnel_events").select("event, is_bot"),
  ]);

  const members = (membersRaw ?? []) as Member[];
  const events = (eventsRaw ?? []) as FunnelEvent[];
  const fev = (e: string) => ({
    humans: events.filter((x) => x.event === e && !x.is_bot).length,
    bots: events.filter((x) => x.event === e && x.is_bot).length,
  });

  const active = members.filter((m) => m.membership_status === "active");
  const founding = active.filter((m) => m.membership_method === "founding");
  const revenue = active.reduce((s, m) => s + (m.paid_amount_cents ?? 0), 0);

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
        <Stat label="Paid / active" value={active.length} sub={dollars(revenue) + " collected"} />
        <Stat label="Leads (unpaid)" value={members.length - active.length} />
        <Stat label="Founding members" value={`${founding.length} / 100`} sub={`${Math.max(0, 100 - founding.length)} free spots left`} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Breakdown title="By segment" rows={tally(members, (m) => ROLE_LABEL[m.role] ?? m.role)} />
        <Breakdown title="By city" rows={tally(members, (m) => m.city)} />
        <Breakdown title="By channel" rows={tally(members, (m) => m.source ?? "(none)")} />
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
              <tr key={i} className="border-t border-line/10">
                <td className="px-3 py-2 text-ink/85">{m.full_name || m.email}</td>
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
    </main>
  );
}
