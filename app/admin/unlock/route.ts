import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken } from "@/lib/adminAuth";

// One-click admin unlock. Bookmark this URL with your key and clicking it sets a
// long-lived admin cookie — no email, no password typing:
//   https://admin.livingwithcoyotes.org/admin/unlock?key=<ADMIN_PASSWORD>
// The key is your secret, so keep the bookmark private (it's in the URL).
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key") ?? "";
  const real = process.env.ADMIN_PASSWORD;

  // Always land on the admin app root (the subdomain rewrites "/" → /admin).
  const res = NextResponse.redirect(new URL("/", url.origin));

  if (real && key === real) {
    const token = adminToken();
    if (token) {
      res.cookies.set(ADMIN_COOKIE, token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }
  }
  return res;
}
