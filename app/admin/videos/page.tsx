import Link from "next/link";
import { isAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminLogin from "../AdminLogin";
import { approveVideo, rejectVideo, hideVideo } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

type Row = {
  id: string; platform: string; url: string; title: string | null; credit: string | null;
  city: string | null; note: string | null; submitter_name: string | null; submitter_email: string | null;
  status: string; source: string | null; created_at: string;
};

function Btn({ action, id, label }: { action: (fd: FormData) => void; id: string; label: string }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button className="rounded-md border border-line/30 px-3 py-1.5 text-sm font-semibold text-heading transition hover:bg-card">{label}</button>
    </form>
  );
}

function Card({ v }: { v: Row }) {
  return (
    <div className="rounded-xl border border-line/20 bg-card/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-panel px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-ink/70">{v.platform}</span>
        <span className="text-xs text-ink/50">{new Date(v.created_at).toLocaleDateString()}</span>
      </div>
      <p className="mt-2 font-semibold text-heading">{v.title ?? "(untitled)"}</p>
      <p className="mt-0.5 text-xs text-ink/60">
        {v.credit ? `Credit: ${v.credit}` : "No credit"}{v.city ? ` · ${v.city}` : ""}
      </p>
      {v.note && <p className="mt-2 text-sm text-ink/80">{v.note}</p>}
      <a href={v.url} target="_blank" rel="noopener noreferrer" className="mt-2 block truncate text-xs text-clay underline-offset-2 hover:underline">{v.url}</a>
      {(v.submitter_name || v.submitter_email) && (
        <p className="mt-1 text-xs text-ink/50">by {v.submitter_name ?? "—"} {v.submitter_email ? `· ${v.submitter_email}` : ""}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {v.status !== "approved" && <Btn action={approveVideo} id={v.id} label="Approve" />}
        {v.status !== "rejected" && <Btn action={rejectVideo} id={v.id} label="Reject" />}
        {v.status === "approved" && <Btn action={hideVideo} id={v.id} label="Hide" />}
      </div>
    </div>
  );
}

export default async function AdminVideosPage() {
  if (!isAdmin() || !supabaseAdmin) return <AdminLogin />;

  const { data } = await supabaseAdmin
    .from("videos")
    .select("id, platform, url, title, credit, city, note, submitter_name, submitter_email, status, source, created_at")
    .order("created_at", { ascending: false })
    .limit(300);
  const rows = (data ?? []) as Row[];
  const pending = rows.filter((r) => r.status === "pending");
  const approved = rows.filter((r) => r.status === "approved");
  const other = rows.filter((r) => r.status !== "pending" && r.status !== "approved");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-heading">Video moderation</h1>
        <Link href="/admin" className="text-sm font-semibold text-clay hover:text-ink">← Admin</Link>
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-clay">Pending ({pending.length})</h2>
      {pending.length === 0 ? <p className="mt-2 text-ink/60">Nothing waiting.</p> : (
        <div className="mt-3 grid gap-4 sm:grid-cols-2">{pending.map((v) => <Card key={v.id} v={v} />)}</div>
      )}

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-clay">Live ({approved.length})</h2>
      {approved.length === 0 ? <p className="mt-2 text-ink/60">None live yet.</p> : (
        <div className="mt-3 grid gap-4 sm:grid-cols-2">{approved.map((v) => <Card key={v.id} v={v} />)}</div>
      )}

      {other.length > 0 && (
        <>
          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-ink/50">Rejected / hidden ({other.length})</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">{other.map((v) => <Card key={v.id} v={v} />)}</div>
        </>
      )}
    </main>
  );
}
