// Server-side Stripe client. Null until STRIPE_SECRET_KEY is set (Vercel env),
// so the rest of the app builds and runs without card payments configured.
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
export const stripe = key ? new Stripe(key) : null;
