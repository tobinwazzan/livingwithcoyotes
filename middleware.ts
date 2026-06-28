import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// MAINTENANCE MODE — every route serves an "under construction" page.
// To take the site DOWN again, flip MAINTENANCE back to true and redeploy.
const MAINTENANCE = false;

// Assets the maintenance page itself needs are allowed through.
const ALLOW = new Set(["/logo-ccc.png", "/favicon.ico"]);

// Preview bypass: visiting any URL with ?preview=<token> sets a cookie that lets
// that browser through the wall (so we can build/test while the public stays down).
const PREVIEW_TOKEN = "coyote-preview-2026";

const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Coyote Coexistence Council — Under construction</title>
<meta name="robots" content="noindex" />
<style>
  :root { color-scheme: dark; }
  * { margin: 0; box-sizing: border-box; }
  body {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #23291d; color: #f4f0e6; padding: 24px; text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .wrap { max-width: 560px; }
  img { width: 116px; height: 116px; }
  .eyebrow { margin-top: 22px; font-size: 13px; letter-spacing: .22em; text-transform: uppercase; color: #b5764f; font-weight: 700; }
  h1 { margin-top: 10px; font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: 800; line-height: 1.15; }
  p { margin-top: 16px; font-size: 17px; line-height: 1.6; color: rgba(244,240,230,.78); }
  .small { margin-top: 26px; font-size: 13px; color: rgba(244,240,230,.5); }
</style>
</head>
<body>
  <div class="wrap">
    <img src="/logo-ccc.png" alt="Coyote Coexistence Council" />
    <div class="eyebrow">Coyote Coexistence Council</div>
    <h1>We&rsquo;ll be right back.</h1>
    <p>We&rsquo;re putting the finishing touches on the site. Please check back soon &mdash; we&rsquo;re building something worth the wait.</p>
    <p class="small">livingwithcoyotes.org</p>
  </div>
</body>
</html>`;

export async function middleware(req: NextRequest) {
  // Admin subdomain: admin.livingwithcoyotes.org serves the /admin app at its
  // root (its own password gate handles security; not subject to maintenance).
  const hostname = (req.headers.get("host") ?? "").split(":")[0].replace(/^www\./, "");
  if (hostname === "admin.livingwithcoyotes.org") {
    const p = req.nextUrl.pathname;
    if (ALLOW.has(p) || p.startsWith("/admin")) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.rewrite(url);
  }

  const path = req.nextUrl.pathname;

  // /admin now lives only on admin.livingwithcoyotes.org — bounce the apex there.
  // (Held until the subdomain was confirmed serving, so nobody got locked out.)
  if (hostname === "livingwithcoyotes.org" && path.startsWith("/admin")) {
    return NextResponse.redirect(
      `https://admin.livingwithcoyotes.org${path}${req.nextUrl.search}`,
      308,
    );
  }

  // Member auth: refresh the Supabase session cookie on member/auth paths so
  // server reads stay valid. Scoped to these paths so public pages skip the
  // per-request auth round-trip.
  if (path === "/login" || path.startsWith("/account") || path.startsWith("/auth")) {
    const res = NextResponse.next({ request: req });
    const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supaAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supaUrl && supaAnonKey) {
      const supabase = createServerClient(supaUrl, supaAnonKey, {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options),
            );
          },
        },
      });
      await supabase.auth.getUser();
    }
    return res;
  }

  if (!MAINTENANCE) return NextResponse.next();
  if (ALLOW.has(req.nextUrl.pathname)) return NextResponse.next();
  // The admin tool is reachable during maintenance — it has its own password gate.
  if (req.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();

  // Already-bypassed browser (cookie set) — let every request through, including
  // server-action POSTs (which carry the cookie).
  if (req.cookies.get("ccc_preview")?.value === PREVIEW_TOKEN) return NextResponse.next();
  // First visit with the token — set the cookie and let it through.
  if (req.nextUrl.searchParams.get("preview") === PREVIEW_TOKEN) {
    const res = NextResponse.next();
    res.cookies.set("ccc_preview", PREVIEW_TOKEN, { httpOnly: true, path: "/", maxAge: 60 * 60 * 8 });
    return res;
  }

  return new NextResponse(PAGE, {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "retry-after": "86400",
      "cache-control": "no-store",
    },
  });
}

// Run on everything except Next's internal/static assets.
export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
