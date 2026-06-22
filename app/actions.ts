"use server";

import { supabase } from "@/lib/supabase";

export type SignupState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "ymail.com", "hotmail.com", "outlook.com",
  "live.com", "msn.com", "icloud.com", "me.com", "mac.com", "aol.com",
  "proton.me", "protonmail.com", "gmx.com", "comcast.net", "sbcglobal.net",
  "att.net", "verizon.net", "cox.net", "pacbell.net",
]);

const VALID_ROLES = new Set(["resident", "municipality", "expert", "other"]);

function digits(s: string) {
  return s.replace(/\D/g, "");
}

export async function signup(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const role = String(formData.get("role") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const linkedin = String(formData.get("linkedin") ?? "").trim();
  const apps = formData.getAll("apps").map((a) => String(a));

  const err = (message: string): SignupState => ({ status: "error", message });

  // Required fields
  if (!VALID_ROLES.has(role)) return err("Please tell us how you're joining.");
  if (fullName.length < 2) return err("Please enter your full name.");
  if (digits(phone).length < 10) return err("Please enter a valid phone number.");
  if (!EMAIL_RE.test(email)) return err("Please enter a valid email address.");
  if (city.length < 2) return err("Please enter your city.");

  const domain = email.split("@")[1]?.toLowerCase() ?? "";

  // Municipality officials must use an official government email
  if (role === "municipality") {
    if (FREE_EMAIL_DOMAINS.has(domain)) {
      return err(
        "City officials must sign up with an official government email (e.g., name@cityofirvine.org), not a personal address.",
      );
    }
    const citySlug = city.toLowerCase().replace(/[^a-z]/g, "");
    const domainCore = domain.replace(/\.[a-z.]+$/, "");
    const looksGov = domain.endsWith(".gov") || domainCore.includes(citySlug);
    if (!looksGov) {
      return err(
        `Please use your official ${city} government email so we can verify your role (e.g., name@cityof${city.toLowerCase().replace(/[^a-z]/g, "")}.org).`,
      );
    }
  }

  // Experts/professionals must provide a LinkedIn profile
  if (role === "expert") {
    if (!/linkedin\.com\/(in|company)\//i.test(linkedin)) {
      return err(
        "Please provide a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/yourname).",
      );
    }
  }

  const { error } = await supabase.from("signups").insert({
    role,
    full_name: fullName,
    phone,
    email,
    city,
    linkedin: linkedin || null,
    apps,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        status: "success",
        message: "You're already on the list — thanks for your interest!",
      };
    }
    return err("Something went wrong. Please try again in a moment.");
  }

  return {
    status: "success",
    message: "You're in. We'll be in touch as the Council takes shape.",
  };
}
