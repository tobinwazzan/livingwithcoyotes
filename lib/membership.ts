// Membership pricing & payment config.
export const MEMBERSHIP_CENTS = 2500; // $25 / year, the amount CCC nets.

// Card payments pass Stripe's processing fee to the member so CCC still nets $25.
// Stripe US card: 2.9% + 30¢. Gross up: total = (base + flat) / (1 - pct).
export function cardTotalCents(base = MEMBERSHIP_CENTS): number {
  const pct = 0.029;
  const flat = 30;
  return Math.ceil((base + flat) / (1 - pct)); // $25 -> 2606 = $26.06
}

export const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

// Venmo/Zelle handles are public (shown to members). Set in Vercel env.
export const VENMO_HANDLE = process.env.NEXT_PUBLIC_VENMO_HANDLE || "";
export const ZELLE_HANDLE = process.env.NEXT_PUBLIC_ZELLE_HANDLE || "";
