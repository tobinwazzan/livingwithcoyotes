import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { dollars } from "@/lib/membership";
import { sendWelcomeIfClaimed } from "@/lib/email";
import { logFunnel } from "@/lib/funnel";

export const dynamic = "force-dynamic";

export default async function MembershipSuccess({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sid = searchParams?.session_id;
  let activated = false;
  let amount = 0;

  if (stripe && sid) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sid);
      const signupId = session.metadata?.signupId;
      // Record the contribution (base), not the fee-inclusive total — so the
      // Founding Patron badge ($50+) and the receipt reflect what they gave.
      const baseCents = Number(session.metadata?.base_cents) || session.amount_total || 0;
      if (session.payment_status === "paid" && signupId) {
        const db = supabaseAdmin ?? supabase;
        const { data: result } = await db.rpc("activate_stripe_membership", {
          p_signup_id: signupId,
          p_amount_cents: baseCents,
          p_stripe_session_id: session.id,
        });
        if (result === "activated") {
          // Newly activated — log it ONCE and send the welcome email.
          await logFunnel("activated", { signupId, meta: { method: "stripe" } });
          await sendWelcomeIfClaimed(signupId);
          activated = true;
          amount = baseCents;
        } else if (result === "already_active") {
          // A refresh of an already-active member — no new event, no double count.
          activated = true;
          amount = baseCents;
        } else {
          // Paid at Stripe but no matching signup to activate — must be visible.
          await logFunnel("invalid", { signupId, meta: { reason: "stripe_activate_not_found" } });
        }
      } else {
        // Paid-but-not-activated is exactly the kind of thing that used to vanish.
        // Log it so it's visible; the Stripe webhook (Wave 3) is the hard backstop.
        await logFunnel("invalid", {
          signupId: signupId ?? null,
          meta: { reason: "stripe_not_paid", payment_status: session.payment_status ?? "unknown" },
        });
      }
    } catch (e) {
      await logFunnel("invalid", {
        meta: { reason: "stripe_success_error", detail: e instanceof Error ? e.message : "unknown" },
      });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-card px-6 py-24 text-center">
      <div className="max-w-md">
        {activated ? (
          <>
            <h1 className="text-3xl font-bold text-heading sm:text-4xl">You&apos;re a member 🎉</h1>
            <p className="mt-4 text-lg text-ink/80">
              Thank you for joining the Coyote Coexistence Council
              {amount ? ` — ${dollars(amount)} received` : ""}. Your membership is
              active for one year. We&apos;ll be in touch as the Council takes shape.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-heading sm:text-4xl">Payment received</h1>
            <p className="mt-4 text-lg text-ink/80">
              Thanks! If your membership doesn&apos;t show as active right away, we&apos;ll
              confirm it shortly.
            </p>
          </>
        )}
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
