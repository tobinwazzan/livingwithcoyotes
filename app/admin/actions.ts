"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, adminToken, isAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Moderation: hide a shared reflection from the public wall. Admin-gated.
export async function hideReflection(id: string): Promise<void> {
  if (!isAdmin() || !supabaseAdmin) return;
  await supabaseAdmin.from("member_reflections").update({ hidden: true }).eq("id", id);
  revalidatePath("/admin");
}

export type LoginState = { error?: string };

export async function adminLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const pw = String(formData.get("password") ?? "");
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return { error: "Admin password isn't configured on the server yet." };
  if (pw !== real) return { error: "Incorrect password." };
  const token = adminToken();
  if (token) {
    cookies().set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/", // works at /admin on the main domain AND at the admin subdomain root
      maxAge: 60 * 60 * 24 * 365, // 1 year — type the password rarely
    });
  }
  redirect("/admin");
}

export async function adminLogout(): Promise<void> {
  cookies().delete({ name: ADMIN_COOKIE, path: "/" });
  redirect("/admin");
}
