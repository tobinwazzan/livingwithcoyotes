import { NextResponse, type NextRequest } from "next/server";

// MAINTENANCE MODE — every route serves an "under construction" page.
// To bring the site back, delete this file (or flip MAINTENANCE to false) and redeploy.
const MAINTENANCE = true;

// Assets the maintenance page itself needs are allowed through.
const ALLOW = new Set(["/logo-ccc.png", "/favicon.ico"]);

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

export function middleware(req: NextRequest) {
  if (!MAINTENANCE) return NextResponse.next();
  if (ALLOW.has(req.nextUrl.pathname)) return NextResponse.next();
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
