"use server";

import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function setStatus(id: string, status: "approved" | "rejected" | "hidden" | "pending") {
  if (!isAdmin() || !supabaseAdmin) return;
  await supabaseAdmin.from("videos").update({ status }).eq("id", id);
  revalidatePath("/admin/videos");
  revalidatePath("/videos");
}

export async function approveVideo(formData: FormData) { await setStatus(String(formData.get("id")), "approved"); }
export async function rejectVideo(formData: FormData) { await setStatus(String(formData.get("id")), "rejected"); }
export async function hideVideo(formData: FormData) { await setStatus(String(formData.get("id")), "hidden"); }
