/** @type {import('next').NextConfig} */

// Content Security Policy.
// - 'unsafe-inline' on script/style is required because Next's hydration
//   bootstrap and our inline style props (Reveal transition-delay, hero bg)
//   are inlined without a nonce. A nonce-based strict CSP is a future upgrade.
// - connect-src allows the browser to reach Supabase directly if ever needed.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  // Supabase Storage serves member wall photos; data:/blob: for inline/preview.
  "img-src 'self' data: blob: https://*.supabase.co",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  // Cloudflare Turnstile loads its widget script (challenges.cloudflare.com).
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  // Turnstile renders inside an iframe from the same origin.
  "frame-src https://challenges.cloudflare.com",
  "connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Two years of HTTPS-only, applied to subdomains too. Add `; preload` and
  // submit to hstspreload.org once you're confident every subdomain is HTTPS.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
