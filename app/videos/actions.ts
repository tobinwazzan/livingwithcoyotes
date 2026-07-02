"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyTurnstile } from "@/lib/turnstile";
import { parseVideoUrl } from "@/lib/video";

export type VideoState = { status: "idle" | "error" | "done"; message: string };

// RLS-locked table, service-role writes (same posture as coyote_reports).
const db = supabaseAdmin ?? supabase;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitVideo(_prev: VideoState, formData: FormData): Promise<VideoState> {
  // Honeypot.
  if (String(formData.get("hp_token") ?? "").trim() !== "") return { status: "idle", message: "" };

  // Turnstile (skipped behind the preview cookie for end-to-end testing).
  const isPreview = cookies().get("ccc_preview")?.value === "coyote-preview-2026";
  if (!isPreview) {
    const token = formData.get("cf-turnstile-response");
    const passed = await verifyTurnstile(typeof token === "string" ? token : null);
    if (!passed) return { status: "error", message: "Please complete the verification check and try again." };
  }

  const rawUrl = String(formData.get("url") ?? "").trim().slice(0, 500);
  const parsed = parseVideoUrl(rawUrl);
  if (!parsed) return { status: "error", message: "Please paste a valid video link (starting with https://)." };

  const title = String(formData.get("title") ?? "").trim().slice(0, 140);
  if (title.length < 2) return { status: "error", message: "Please add a short title so people know what it is." };

  // Consent is required — the submitter attests they filmed it or have permission.
  const consent = String(formData.get("consent") ?? "") === "on";
  if (!consent) return { status: "error", message: "Please confirm you have the right to share this video." };

  const credit = String(formData.get("credit") ?? "").trim().slice(0, 120) || null;
  const city = String(formData.get("city") ?? "").trim().slice(0, 80) || null;
  const note = String(formData.get("note") ?? "").trim().slice(0, 600) || null;
  const submitter_name = String(formData.get("submitter_name") ?? "").trim().slice(0, 80) || null;
  const emailRaw = String(formData.get("submitter_email") ?? "").trim().slice(0, 120);
  const submitter_email = EMAIL_RE.test(emailRaw) ? emailRaw : null;

  const { error } = await db.from("videos").insert({
    url: parsed.canonicalUrl,
    platform: parsed.platform,
    video_id: parsed.videoId,
    embed_url: parsed.embedUrl,
    title,
    credit,
    city,
    note,
    submitter_name,
    submitter_email,
    consent,
    status: "pending",
    source: "web",
  });

  if (error) return { status: "error", message: "Something went wrong saving your video. Please try again in a moment." };
  return { status: "done", message: "" };
}
