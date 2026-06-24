import "server-only";
import nodemailer from "nodemailer";
import { dollars } from "./membership";
import { supabase } from "./supabase";

// ── Provider ────────────────────────────────────────────────────────────────
// Today: Google Workspace SMTP. To switch to Resend later, only this transport
// block changes — sendEmail() and the templates below stay the same.
const SMTP_USER = process.env.SMTP_USER; // the Workspace login, e.g. admin@livingwithcoyotes.org
const SMTP_PASS = process.env.SMTP_PASS; // a Google App Password (not the account password)
const EMAIL_FROM =
  process.env.EMAIL_FROM ||
  "Coyote Coexistence Council <members@livingwithcoyotes.org>";

let transporter: nodemailer.Transporter | null = null;
function getTransport() {
  if (!SMTP_USER || !SMTP_PASS) return null; // not configured yet → emails no-op
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ sent: boolean }> {
  const t = getTransport();
  if (!t) {
    console.warn("[email] SMTP not configured — skipping send to", opts.to);
    return { sent: false };
  }
  try {
    await t.sendMail({
      from: EMAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    return { sent: true };
  } catch (e) {
    // Never let an email failure break the join flow — the member is already saved.
    console.error("[email] send failed:", e);
    return { sent: false };
  }
}

// ── Welcome / receipt email ──────────────────────────────────────────────────
const SITE = "https://livingwithcoyotes.org";
const DUSK = "#2e3528";
const SAND = "#f4f0e6";
const CLAY = "#b5764f";
const INK = "#3d352a";

export type WelcomeMember = {
  email: string;
  full_name: string | null;
  paid_amount_cents: number | null;
  membership_method: string | null;
  membership_expires_at: string | null; // ISO date
};

function methodLabel(m: string | null): string {
  switch (m) {
    case "stripe": return "Card";
    case "venmo": return "Venmo";
    case "zelle": return "Zelle";
    case "code": return "Invitation code";
    default: return "—";
  }
}

export async function sendWelcomeEmail(member: WelcomeMember) {
  const first = (member.full_name || "").trim().split(/\s+/)[0] || "neighbor";
  const paid = member.paid_amount_cents ? dollars(member.paid_amount_cents) : null;
  const expires = member.membership_expires_at
    ? new Date(`${member.membership_expires_at}T00:00:00`).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "long", day: "numeric" },
      )
    : null;

  const receiptRows: string[] = [];
  if (paid) receiptRows.push(["Membership", `${paid} · ${methodLabel(member.membership_method)}`]
    .map((c, i) => `<td style="padding:6px 0;color:${i ? INK : "#6f6657"};font-size:14px;${i ? "text-align:right;" : ""}">${c}</td>`).join(""));
  if (expires) receiptRows.push(["Active through", expires]
    .map((c, i) => `<td style="padding:6px 0;color:${i ? INK : "#6f6657"};font-size:14px;${i ? "text-align:right;" : ""}">${c}</td>`).join(""));

  const receiptBlock = receiptRows.length
    ? `<table role="presentation" width="100%" style="border-collapse:collapse;margin:8px 0 4px;border-top:1px solid rgba(90,107,74,.2);border-bottom:1px solid rgba(90,107,74,.2);">
         ${receiptRows.map((r) => `<tr>${r}</tr>`).join("")}
       </table>`
    : "";

  const html = `<!doctype html><html><body style="margin:0;background:${SAND};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" style="background:${SAND};padding:24px 0;"><tr><td align="center">
    <table role="presentation" width="560" style="max-width:560px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid rgba(90,107,74,.15);">
      <tr><td style="background:${DUSK};padding:28px 32px;text-align:center;">
        <img src="${SITE}/logo-ccc.png" width="64" height="64" alt="" style="display:inline-block;border:0;">
        <div style="color:${SAND};font-size:18px;font-weight:700;margin-top:10px;letter-spacing:.2px;">Coyote Coexistence Council</div>
      </td></tr>
      <tr><td style="padding:32px;">
        <h1 style="margin:0 0 12px;color:${DUSK};font-size:22px;">Welcome aboard, ${first}. 🐾</h1>
        <p style="margin:0 0 16px;color:${INK};font-size:15px;line-height:1.6;">
          Thank you for joining — your membership is <strong>active for one year</strong>.
          You're now part of a founding effort to keep our neighborhoods safe and our coyotes wild.
        </p>
        ${receiptBlock}
        <p style="margin:18px 0 16px;color:${INK};font-size:15px;line-height:1.6;">
          Your $19 funds plain-language guidance, the yard-proofing checklist, pet-safety
          protocols, and the sightings map — free for every resident in your city, member or not.
        </p>
        <table role="presentation" style="margin:8px 0 4px;"><tr><td style="border-radius:8px;background:${CLAY};">
          <a href="${SITE}/resources" style="display:inline-block;padding:12px 22px;color:${SAND};font-size:15px;font-weight:600;text-decoration:none;">Explore the resources →</a>
        </td></tr></table>
        <p style="margin:20px 0 0;color:#6f6657;font-size:13px;line-height:1.6;">
          We'll be in touch as the Council takes shape. Questions? Just reply to this email.
        </p>
      </td></tr>
      <tr><td style="padding:18px 32px;background:#faf8f2;border-top:1px solid rgba(90,107,74,.12);text-align:center;color:#6f6657;font-size:12px;">
        Coyote Coexistence Council · <a href="${SITE}" style="color:${CLAY};text-decoration:none;">livingwithcoyotes.org</a><br>
        members@livingwithcoyotes.org
      </td></tr>
    </table>
  </td></tr></table></body></html>`;

  const text = `Welcome aboard, ${first}.

Thank you for joining the Coyote Coexistence Council — your membership is active for one year.${paid ? `\n\nMembership: ${paid} (${methodLabel(member.membership_method)})` : ""}${expires ? `\nActive through: ${expires}` : ""}

Your $19 funds plain-language guidance, the yard-proofing checklist, pet-safety protocols, and the sightings map — free for every resident in your city.

Explore the resources: ${SITE}/resources

We'll be in touch as the Council takes shape. Questions? Just reply to this email.

Coyote Coexistence Council · livingwithcoyotes.org`;

  return sendEmail({
    to: member.email,
    subject: "Welcome to the Coyote Coexistence Council 🐾",
    html,
    text,
  });
}

// Claim-and-send: idempotent across all join paths and page refreshes. Returns
// member details only to the first caller, so the email goes out exactly once.
export async function sendWelcomeIfClaimed(signupId: string) {
  const { data, error } = await supabase.rpc("claim_welcome_email", {
    p_signup_id: signupId,
  });
  if (error || !Array.isArray(data) || data.length === 0) return { sent: false };
  return sendWelcomeEmail(data[0] as WelcomeMember);
}
