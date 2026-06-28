// Contribution & payment config.
export const MEMBERSHIP_CENTS = 2000; // $20 / year, the amount CCC nets.

// Founding offer: the first 100 members join free. After the cap, $20 resumes.
export const FOUNDING_CAP = 100;

// Cloudflare Turnstile public site key (safe in the browser). The secret key
// lives only in Vercel env (TURNSTILE_SECRET_KEY) and is read server-side.
export const TURNSTILE_SITE_KEY = "0x4AAAAAADqxyv8l9VxYhURV";

// Card payments pass Stripe's processing fee to the member so CCC still nets $20.
// Stripe US card: 2.9% + 30¢. Gross up: total = (base + flat) / (1 - pct).
export function cardTotalCents(base = MEMBERSHIP_CENTS): number {
  const pct = 0.029;
  const flat = 30;
  return Math.ceil((base + flat) / (1 - pct)); // $20 -> 2091 = $20.91
}

export const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

// Venmo/Zelle handles are public (shown to members). Set in Vercel env.
export const VENMO_HANDLE = process.env.NEXT_PUBLIC_VENMO_HANDLE || "";
export const ZELLE_HANDLE = process.env.NEXT_PUBLIC_ZELLE_HANDLE || "";
