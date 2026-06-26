import "server-only";
import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabaseAdmin";

export type CertTier = "Founding Member" | "Pack Leader" | "Member";

export type CertData = {
  name: string;
  tier: CertTier;
  since: string | null; // formatted "Member since" date
  through: string | null; // formatted "active through" date
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function fmtDate(value: string | null): string | null {
  if (!value) return null;
  // Accept both timestamptz (started_at) and plain date (expires_at).
  const iso = value.includes("T") ? value : `${value}T00:00:00`;
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? null
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// Look up a member by id and classify their certificate tier. Returns null for
// an unknown id or a member who isn't active — so we never mint a fake cert.
export async function getCertificate(id: string): Promise<CertData | null> {
  if (!UUID_RE.test(id || "")) return null;
  const db = supabaseAdmin ?? supabase;
  const { data } = await db
    .from("signups")
    .select(
      "full_name, membership_status, membership_method, paid_amount_cents, membership_started_at, membership_expires_at",
    )
    .eq("id", id)
    .limit(1);
  const m = data?.[0];
  if (!m || m.membership_status !== "active") return null;

  const tier: CertTier =
    (m.paid_amount_cents ?? 0) >= 5000
      ? "Pack Leader"
      : m.membership_method === "founding"
        ? "Founding Member"
        : "Member";

  return {
    name: (m.full_name || "Member").trim(),
    tier,
    since: fmtDate(m.membership_started_at),
    through: fmtDate(m.membership_expires_at),
  };
}
