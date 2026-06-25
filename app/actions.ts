"use server";

import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { stripe } from "@/lib/stripe";
import { MEMBERSHIP_CENTS, cardTotalCents, FOUNDING_CAP } from "@/lib/membership";
import { sendWelcomeIfClaimed } from "@/lib/email";
import { logFunnel } from "@/lib/funnel";
import { verifyTurnstile } from "@/lib/turnstile";
import { cookies } from "next/headers";

export type LeadState = {
  status: "idle" | "error" | "lead";
  message: string;
  signupId?: string;
  email?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "ymail.com", "hotmail.com", "outlook.com",
  "live.com", "msn.com", "icloud.com", "me.com", "mac.com", "aol.com",
  "proton.me", "protonmail.com", "gmx.com", "comcast.net", "sbcglobal.net",
  "att.net", "verizon.net", "cox.net", "pacbell.net",
]);

const VALID_ROLES = new Set([
  "resident", "municipality", "expert", "partner", "other",
]);
const digits = (s: string) => s.replace(/\D/g, "");

// Prefer the service-role client so the public anon RPC grants can be revoked.
const db = supabaseAdmin ?? supabase;

// Step 1 — always capture the lead (so an abandoned payment still reaches us).
export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  // Every Continue click is logged — humans AND bots — so "attempts vs leads"
  // is always visible. This is the signal that was missing when the form broke.
  await logFunnel("continue_clicked");

  // Honeypot: a hidden field real users never see. Bots fill everything, so a
  // non-empty value means a bot — silently drop it (no row, no progression).
  // NB: field is named "hp_token" (not an autofill keyword) so real members'
  // browser autofill / password managers don't accidentally trip it.
  if (String(formData.get("hp_token") ?? "").trim() !== "") {
    await logFunnel("dropped_bot", { isBot: true, meta: { reason: "honeypot" } });
    return { status: "idle", message: "" };
  }

  // Human verification (Cloudflare Turnstile). A scripted form/RPC abuser has no
  // valid token, so this blocks the founding-spot-burning attack. Skipped for
  // trusted testers behind the maintenance wall (the ?preview cookie) so the
  // E2E suite still runs.
  const isPreview = cookies().get("ccc_preview")?.value === "coyote-preview-2026";
  if (!isPreview) {
    const tsToken = formData.get("cf-turnstile-response");
    const passed = await verifyTurnstile(typeof tsToken === "string" ? tsToken : null);
    if (!passed) {
      await logFunnel("dropped_bot", { isBot: true, meta: { reason: "turnstile" } });
      return { status: "error", message: "Please complete the verification check and try again." };
    }
  }

  const role = String(formData.get("role") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const linkedin = String(formData.get("linkedin") ?? "").trim();
  const apps = formData.getAll("apps").map((a) => String(a));

  // Attribution — which channel sent them, where they landed from.
  const source = String(formData.get("source") ?? "").trim().slice(0, 120);
  const referrer = String(formData.get("referrer") ?? "").trim().slice(0, 500);
  let meta: Record<string, string> = {};
  try {
    const raw = JSON.parse(String(formData.get("meta") ?? "{}"));
    if (raw && typeof raw === "object") {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === "string" && v) meta[String(k).slice(0, 40)] = v.slice(0, 200);
      }
    }
  } catch {
    meta = {};
  }

  // Log the drop reason so we can see *where* people fall off, then show the error.
  const invalid = async (reason: string, message: string): Promise<LeadState> => {
    await logFunnel("invalid", { meta: { reason } });
    return { status: "error", message };
  };

  if (!VALID_ROLES.has(role)) return invalid("role", "Please tell us how you're joining.");
  if (fullName.length < 2) return invalid("name", "Please enter your full name.");
  if (digits(phone).length < 10) return invalid("phone", "Please enter a valid phone number.");
  if (!EMAIL_RE.test(email)) return invalid("email", "Please enter a valid email address.");
  if (city.length < 2) return invalid("city", "Please enter your city.");

  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (role === "municipality") {
    if (FREE_EMAIL_DOMAINS.has(domain)) {
      return invalid("muni_free_email", "City officials must sign up with an official government email (e.g., name@cityofirvine.org), not a personal address.");
    }
    const citySlug = city.toLowerCase().replace(/[^a-z]/g, "");
    const domainCore = domain.replace(/\.[a-z.]+$/, "");
    const looksGov = domain.endsWith(".gov") || domainCore.includes(citySlug);
    if (!looksGov) {
      return invalid("muni_not_gov", `Please use your official ${city} government email so we can verify your role (e.g., name@cityof${citySlug}.org).`);
    }
  }
  if (role === "expert" && !/^https?:\/\/.+\..+/i.test(linkedin)) {
    return invalid("expert_url", "Please add a link to your LinkedIn or professional website (starting with https://).");
  }

  const { data, error } = await db.rpc("create_membership_lead", {
    p_role: role, p_full_name: fullName, p_phone: phone, p_email: email,
    p_city: city, p_linkedin: linkedin, p_apps: apps,
    p_source: source || null, p_referrer: referrer || null, p_meta: meta,
  });
  if (error || !data) {
    await logFunnel("invalid", { meta: { reason: "rpc_error", detail: error?.message ?? "no_data" } });
    return { status: "error", message: "Something went wrong. Please try again in a moment." };
  }

  await logFunnel("lead_created", { signupId: String(data), meta: { role, source: source || "(none)" } });
  return { status: "lead", message: "", signupId: String(data), email };
}

// Step 2a — redeem a free honorary/council code.
export async function redeemCode(signupId: string, code: string): Promise<{ ok: boolean; message: string }> {
  if (!signupId) return { ok: false, message: "Please complete the form first." };
  if (!code.trim()) return { ok: false, message: "Enter your code." };
  await logFunnel("payment_started", { signupId, meta: { method: "code" } });
  const { error } = await db.rpc("redeem_membership_code", { p_code: code, p_signup_id: signupId });
  if (error) {
    await logFunnel("invalid", { signupId, meta: { reason: "bad_code" } });
    return { ok: false, message: "That code isn't valid or has already been used." };
  }
  await logFunnel("activated", { signupId, meta: { method: "code" } });
  await sendWelcomeIfClaimed(signupId);
  return { ok: true, message: "Code accepted — your membership is active. Welcome aboard!" };
}

// Step 2b — record a Venmo/Zelle payment after the receipt is uploaded.
export async function recordManual(
  signupId: string, method: "venmo" | "zelle", receiptPath: string,
): Promise<{ ok: boolean; message: string }> {
  if (!signupId) return { ok: false, message: "Please complete the form first." };
  await logFunnel("payment_started", { signupId, meta: { method } });
  const { data: result, error } = await db.rpc("record_manual_payment", {
    p_signup_id: signupId, p_method: method, p_receipt_path: receiptPath,
  });
  if (error) {
    await logFunnel("invalid", { signupId, meta: { reason: "record_manual_rpc", method } });
    return { ok: false, message: "We couldn't record that. Please try again." };
  }
  if (result === "not_found") {
    await logFunnel("invalid", { signupId, meta: { reason: "record_manual_not_found", method } });
    return { ok: false, message: "We couldn't find your signup — please start again." };
  }
  if (result === "activated") {
    await logFunnel("activated", { signupId, meta: { method } });
  }
  await sendWelcomeIfClaimed(signupId);
  return { ok: true, message: "Thank you — your membership is active." };
}

// Log a client-side failure (e.g. a receipt upload that failed in the browser
// before any RPC ran) so even those leave a trace in the funnel.
export async function logClientIssue(signupId: string, reason: string): Promise<void> {
  await logFunnel("invalid", { signupId: signupId || null, meta: { reason: `client_${reason}` } });
}

// Step 2d — claim a free Founding membership (first 100). Race-safe in the RPC.
export async function claimFounding(
  signupId: string,
): Promise<{ ok: boolean; status: string; message: string }> {
  if (!signupId) return { ok: false, status: "no_signup", message: "Please complete the form first." };
  await logFunnel("payment_started", { signupId, meta: { method: "founding" } });
  const { data: result, error } = await db.rpc("claim_founding_membership", {
    p_signup_id: signupId,
  });
  if (error) {
    await logFunnel("invalid", { signupId, meta: { reason: "founding_rpc" } });
    return { ok: false, status: "error", message: "Something went wrong. Please try again." };
  }
  if (result === "full") {
    await logFunnel("invalid", { signupId, meta: { reason: "founding_full" } });
    return { ok: false, status: "full", message: "All founding spots are taken — you can still join for $19." };
  }
  if (result === "not_found") {
    await logFunnel("invalid", { signupId, meta: { reason: "founding_not_found" } });
    return { ok: false, status: "not_found", message: "We couldn't find your signup — please start again." };
  }
  if (result === "already_active") {
    // Already a member by some other method — don't mislabel them a founder.
    return { ok: true, status: "already_active", message: "You're already a member — check your email for your welcome note." };
  }
  if (result === "claimed") {
    await logFunnel("activated", { signupId, meta: { method: "founding" } });
  }
  await sendWelcomeIfClaimed(signupId);
  return { ok: true, status: String(result), message: "You're a Founding Member — welcome aboard!" };
}

// Live founding count for the "X of 100 claimed" badge.
export async function foundingStatus(): Promise<{ count: number; cap: number; remaining: number; open: boolean }> {
  const { data } = await db.rpc("founding_count");
  const count = typeof data === "number" ? data : 0;
  const remaining = Math.max(0, FOUNDING_CAP - count);
  return { count, cap: FOUNDING_CAP, remaining, open: remaining > 0 };
}

// Step 2c — start a Stripe Checkout session ($19 + card fee). Returns a URL.
export async function startCheckout(signupId: string, email: string): Promise<{ url?: string; error?: string }> {
  if (!stripe) return { error: "Card payments aren't set up yet — please use Venmo, Zelle, or a code." };
  if (!signupId) return { error: "Please complete the form first." };
  const origin = process.env.NEXT_PUBLIC_SITE_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: cardTotalCents(),
          product_data: {
            name: "Coyote Coexistence Council — Annual Membership",
            description: "1 year · includes card processing fee",
          },
        },
      }],
      metadata: { signupId, base_cents: String(MEMBERSHIP_CENTS) },
      success_url: `${origin}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=1#join`,
    });
    await logFunnel("payment_started", { signupId, meta: { method: "card" } });
    return { url: session.url ?? undefined };
  } catch (e) {
    await logFunnel("invalid", { signupId, meta: { reason: "stripe_session_create", detail: e instanceof Error ? e.message : "unknown" } });
    return { error: "We couldn't start the card checkout. Please try again, or use Venmo/Zelle." };
  }
}
