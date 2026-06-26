"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyTurnstile } from "@/lib/turnstile";
import {
  CATEGORY_VALUES,
  TIME_OF_DAY,
  BEHAVIORS,
  PETS,
  ATTRACTANTS,
  ACTIONS,
} from "@/content/report";

export type ReportState = {
  status: "idle" | "error" | "done";
  message: string;
  category?: string;
};

// Prefer the service-role client: the coyote_reports table is RLS-locked with
// no anon policies (same posture as signups), so writes go through the server.
const db = supabaseAdmin ?? supabase;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Keep a submitted value only if it's one of the known options; else null.
const oneOf = (raw: FormDataEntryValue | null, opts: { value: string }[]) => {
  const v = String(raw ?? "").trim();
  return opts.some((o) => o.value === v) ? v : null;
};

export async function submitReport(
  _prev: ReportState,
  formData: FormData,
): Promise<ReportState> {
  // Honeypot — a hidden field humans never fill. Non-empty = bot; drop silently.
  if (String(formData.get("hp_token") ?? "").trim() !== "") {
    return { status: "idle", message: "" };
  }

  // Cloudflare Turnstile (skipped for trusted testers behind the preview cookie,
  // so the form can be exercised end-to-end without a live widget token).
  const isPreview = cookies().get("ccc_preview")?.value === "coyote-preview-2026";
  if (!isPreview) {
    const token = formData.get("cf-turnstile-response");
    const passed = await verifyTurnstile(typeof token === "string" ? token : null);
    if (!passed) {
      return {
        status: "error",
        message: "Please complete the verification check and try again.",
      };
    }
  }

  // --- Required: a valid category and a city -------------------------------
  const category = String(formData.get("category") ?? "").trim();
  if (!CATEGORY_VALUES.includes(category)) {
    return { status: "error", message: "Please choose what happened." };
  }
  const city = String(formData.get("city") ?? "").trim().slice(0, 80);
  if (city.length < 2) {
    return { status: "error", message: "Please tell us which city." };
  }

  // --- Optional, validated against their known option sets -----------------
  const time_of_day = oneOf(formData.get("time_of_day"), TIME_OF_DAY);
  const behavior = oneOf(formData.get("behavior"), BEHAVIORS);
  const pet_involved = oneOf(formData.get("pet_involved"), PETS);
  const action_taken = oneOf(formData.get("action_taken"), ACTIONS);

  const allowedAttractants = new Set(ATTRACTANTS.map((a) => a.value));
  const attractants = formData
    .getAll("attractants")
    .map((a) => String(a))
    .filter((a) => allowedAttractants.has(a));

  // Coarse location only — a cross-street, park, or landmark. We deliberately
  // do not ask for (or store) an exact street address.
  const area = String(formData.get("area") ?? "").trim().slice(0, 120) || null;

  // Optional "when" — accept a plain YYYY-MM-DD or leave null.
  const occurredRaw = String(formData.get("occurred_on") ?? "").trim();
  const occurred_on = /^\d{4}-\d{2}-\d{2}$/.test(occurredRaw) ? occurredRaw : null;

  // Short optional free text, hard-capped (a free-text box is a fear-amplifier
  // if left unbounded — keep it small and factual).
  const note = String(formData.get("note") ?? "").trim().slice(0, 600) || null;

  // Optional contact, only for follow-up. Never shown in any public view.
  const reporter_name = String(formData.get("reporter_name") ?? "").trim().slice(0, 80) || null;
  const emailRaw = String(formData.get("reporter_email") ?? "").trim().slice(0, 120);
  const reporter_email = EMAIL_RE.test(emailRaw) ? emailRaw : null;
  const contact_ok = String(formData.get("contact_ok") ?? "") === "on" && !!reporter_email;

  const { error } = await db.from("coyote_reports").insert({
    category,
    city,
    area,
    occurred_on,
    time_of_day,
    behavior,
    pet_involved,
    attractants,
    action_taken,
    note,
    reporter_name,
    reporter_email,
    contact_ok,
    source: "web",
  });

  if (error) {
    return {
      status: "error",
      message: "Something went wrong saving your report. Please try again in a moment.",
    };
  }

  return { status: "done", message: "", category };
}
