"use client";

import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMsg("Please enter a valid email address.");
      return;
    }
    setState("sending");
    setMsg("");
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setState("error");
      setMsg(error.message);
    } else {
      setState("sent");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-2xl border border-line/15 bg-card/60 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">
          Check your inbox
        </p>
        <h2 className="mt-2 text-2xl font-bold text-heading">
          Your sign-in link is on its way
        </h2>
        <p className="mx-auto mt-3 max-w-md text-ink/75">
          We sent a one-time link to <strong className="text-ink">{email}</strong>.
          Open it on this device to sign in — no password needed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm">
      <label htmlFor="email" className="block text-sm font-bold text-heading">
        Your email
      </label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="mt-2 w-full rounded-lg border border-line/30 bg-surface px-4 py-3 text-ink placeholder:text-ink/40 focus:border-clay focus:outline-none"
      />
      {msg && <p className="mt-3 text-sm text-clay">{msg}</p>}
      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-5 w-full rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Email me a sign-in link"}
      </button>
      <p className="mt-4 text-center text-xs text-ink/55">
        No passwords. We email you a secure one-time link.
      </p>
      <p className="mt-3 text-center text-xs text-ink/45">
        By continuing, you agree to our{" "}
        <a href="/terms" className="hover:text-clay hover:underline">Terms</a>,{" "}
        <a href="/privacy" className="hover:text-clay hover:underline">Privacy Policy</a>, and{" "}
        <a href="/liability" className="hover:text-clay hover:underline">Release of Liability</a>.
      </p>
    </form>
  );
}
