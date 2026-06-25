import "server-only";
import { cookies } from "next/headers";
import { createHash } from "crypto";

export const ADMIN_COOKIE = "ccc_admin";

// The cookie stores a hash of the admin password — unforgeable without it, and
// the real password is never stored in the cookie.
export function adminToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHash("sha256").update(`ccc-admin:${pw}`).digest("hex");
}

export function isAdmin(): boolean {
  const t = adminToken();
  if (!t) return false;
  return cookies().get(ADMIN_COOKIE)?.value === t;
}
