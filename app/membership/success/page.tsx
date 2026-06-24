import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { dollars } from "@/lib/membership";

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
      if (session.payment_status === "paid" && session.metadata?.signupId) {
        await supabase.rpc("activate_stripe_membership", {
          p_signup_id: session.metadata.signupId,
          p_amount_cents: session.amount_total ?? 0,
          p_stripe_session_id: session.id,
        });
        activated = true;
        amount = session.amount_total ?? 0;
      }
    } catch {
      /* fall through to the graceful message below */
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
