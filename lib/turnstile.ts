import "server-only";

const SECRET = process.env.TURNSTILE_SECRET_KEY;

// Verify a Cloudflare Turnstile token server-side. Behavior:
//  - No secret configured (local / before keys are wired) → allow, so the form
//    keeps working. Production sets the secret, so this enforces.
//  - Secret set + missing/invalid token → reject (fail closed) — a bot scripting
//    the form has no valid token.
export async function verifyTurnstile(token: string | null | undefined): Promise<boolean> {
  if (!SECRET) return true; // not configured — don't block
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: SECRET, response: token }),
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false; // verify failed — fail closed (safer against abuse)
  }
}
