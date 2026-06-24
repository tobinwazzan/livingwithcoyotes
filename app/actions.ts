"use server";

import { supabase } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { MEMBERSHIP_CENTS, cardTotalCents } from "@/lib/membership";
import { sendWelcomeIfClaimed } from "@/lib/email";

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

// Step 1 — always capture the lead (so an abandoned payment still reaches us).
export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  // Honeypot: a hidden field real users never see. Bots fill everything, so a
  // non-empty value means a bot — silently drop it (no row, no progression).
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { status: "idle", message: "" };
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

  const err = (message: string): LeadState => ({ status: "error", message });

  if (!VALID_ROLES.has(role)) return err("Please tell us how you're joining.");
  if (fullName.length < 2) return err("Please enter your full name.");
  if (digits(phone).length < 10) return err("Please enter a valid phone number.");
  if (!EMAIL_RE.test(email)) return err("Please enter a valid email address.");
  if (city.length < 2) return err("Please enter your city.");

  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (role === "municipality") {
    if (FREE_EMAIL_DOMAINS.has(domain)) {
      return err("City officials must sign up with an official government email (e.g., name@cityofirvine.org), not a personal address.");
    }
    const citySlug = city.toLowerCase().replace(/[^a-z]/g, "");
    const domainCore = domain.replace(/\.[a-z.]+$/, "");
    const looksGov = domain.endsWith(".gov") || domainCore.includes(citySlug);
    if (!looksGov) {
      return err(`Please use your official ${city} government email so we can verify your role (e.g., name@cityof${citySlug}.org).`);
    }
  }
  if (role === "expert" && !/^https?:\/\/.+\..+/i.test(linkedin)) {
    return err("Please add a link to your LinkedIn or professional website (starting with https://).");
  }

  const { data, error } = await supabase.rpc("create_membership_lead", {
    p_role: role, p_full_name: fullName, p_phone: phone, p_email: email,
    p_city: city, p_linkedin: linkedin, p_apps: apps,
    p_source: source || null, p_referrer: referrer || null, p_meta: meta,
  });
  if (error || !data) return err("Something went wrong. Please try again in a moment.");

  return { status: "lead", message: "", signupId: String(data), email };
}

// Step 2a — redeem a free honorary/council code.
export async function redeemCode(signupId: string, code: string): Promise<{ ok: boolean; message: string }> {
  if (!signupId) return { ok: false, message: "Please complete the form first." };
  if (!code.trim()) return { ok: false, message: "Enter your code." };
  const { error } = await supabase.rpc("redeem_membership_code", { p_code: code, p_signup_id: signupId });
  if (error) return { ok: false, message: "That code isn't valid or has already been used." };
  await sendWelcomeIfClaimed(signupId);
  return { ok: true, message: "Code accepted — your membership is active. Welcome aboard!" };
}

// Step 2b — record a Venmo/Zelle payment after the receipt is uploaded.
export async function recordManual(
  signupId: string, method: "venmo" | "zelle", receiptPath: string,
): Promise<{ ok: boolean; message: string }> {
  if (!signupId) return { ok: false, message: "Please complete the form first." };
  const { error } = await supabase.rpc("record_manual_payment", {
    p_signup_id: signupId, p_method: method, p_receipt_path: receiptPath,
  });
  if (error) return { ok: false, message: "We couldn't record that. Please try again." };
  await sendWelcomeIfClaimed(signupId);
  return { ok: true, message: "Thank you — your membership is active." };
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
    return { url: session.url ?? undefined };
  } catch {
    return { error: "We couldn't start the card checkout. Please try again, or use Venmo/Zelle." };
  }
}
