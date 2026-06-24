"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  submitLead, redeemCode, recordManual, startCheckout, type LeadState,
} from "@/app/actions";
import { supabase } from "@/lib/supabase";
import {
  cardTotalCents, dollars, MEMBERSHIP_CENTS, VENMO_HANDLE, ZELLE_HANDLE,
} from "@/lib/membership";

const initialState: LeadState = { status: "idle", message: "" };

const APPS = [
  "Ring Neighbors", "Nextdoor", "Citizen", "Facebook groups", "iNaturalist",
  "Coyote Cacher", "PawBoost", "Petco Love Lost", "Other", "None",
];

const inputCls =
  "w-full rounded-lg border border-line/20 bg-card/80 px-4 py-3 outline-none focus:border-clay focus:ring-2 focus:ring-clay/30";

// Display phone as (xxx) xxx-xxxx while the member types digits only.
function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 10);
  if (d.length > 6) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length > 3) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  if (d.length > 0) return `(${d}`;
  return "";
}

// Gamified progress: the three steps shown on a straight line above the form.
const STEPS = ["Your details", "Membership", "Done"];
function Stepper({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="mb-8 flex items-center justify-center gap-2 sm:gap-3" aria-label="Progress">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = current > n;
        const active = current === n;
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-3">
            <span
              aria-current={active ? "step" : undefined}
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold transition ${
                active
                  ? "border-clay bg-clay text-sand"
                  : done
                    ? "border-clay bg-clay/15 text-clay"
                    : "border-line/40 bg-card text-ink/40"
              }`}
            >
              {done ? "✓" : n}
            </span>
            <span
              className={`hidden text-sm font-medium sm:inline ${
                active || done ? "text-heading" : "text-ink/40"
              }`}
            >
              {label}
            </span>
            {n < STEPS.length && (
              <span
                aria-hidden="true"
                className={`h-px w-6 sm:w-10 ${done ? "bg-clay" : "bg-line/30"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function ContinueButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark disabled:opacity-60"
    >
      {pending ? "One moment…" : "Continue"}
    </button>
  );
}

export default function SignupForm() {
  const [state, formAction] = useFormState(submitLead, initialState);
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");

  // Attribution — capture which channel sent them (UTM / ref) and the landing
  // context, so the recruitment plan can see what's working. Best-effort only.
  const [attr, setAttr] = useState({ source: "", referrer: "", meta: "{}" });
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const source = p.get("utm_source") || p.get("ref") || p.get("source") || "";
      const meta: Record<string, string> = {};
      for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "ref"]) {
        const v = p.get(k);
        if (v) meta[k] = v;
      }
      meta.landing_path = window.location.pathname;
      setAttr({
        source,
        referrer: document.referrer || "",
        meta: JSON.stringify(meta),
      });
    } catch {
      /* leave defaults */
    }
  }, []);

  // membership-phase state
  const [method, setMethod] = useState<"" | "card" | "venmo" | "zelle" | "code">("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [done, setDone] = useState<string | null>(null);

  // ---------- PHASE 3: done ----------
  if (done) {
    return (
      <div>
        <Stepper current={3} />
        <div className="rounded-xl border border-line/30 bg-card/60 p-6 text-center">
          <p className="text-lg font-semibold text-heading">Welcome aboard.</p>
          <p className="mt-1 text-ink/80">{done}</p>
        </div>
      </div>
    );
  }

  // ---------- PHASE 2: membership ----------
  if (state.status === "lead" && state.signupId) {
    const signupId = state.signupId;
    const email = state.email || "";
    const cardTotal = cardTotalCents();

    const choose = (m: typeof method) => { setMethod(m); setNote(""); };

    const payCard = async () => {
      setBusy(true); setNote("");
      const r = await startCheckout(signupId, email);
      if (r.url) { window.location.href = r.url; return; }
      setBusy(false); setNote(r.error || "Card checkout is unavailable right now.");
    };

    const redeem = async () => {
      setBusy(true); setNote("");
      const r = await redeemCode(signupId, code);
      setBusy(false);
      r.ok ? setDone(r.message) : setNote(r.message);
    };

    const onReceipt = async (e: ChangeEvent<HTMLInputElement>, m: "venmo" | "zelle") => {
      const file = e.target.files?.[0];
      if (!file) return;
      setBusy(true); setNote("Uploading your receipt…");
      try {
        const safe = file.name.replace(/[^\w.\-]+/g, "_");
        const path = `${signupId}/${Date.now()}-${safe}`;
        const { error } = await supabase.storage.from("receipts").upload(path, file, { upsert: false });
        if (error) throw error;
        const r = await recordManual(signupId, m, path);
        setBusy(false);
        r.ok ? setDone(r.message) : setNote(r.message);
      } catch {
        setBusy(false);
        setNote("That upload didn't go through. Try a different file, or pay by card or code.");
      }
    };

    const optionCls = (m: string) =>
      `rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${
        method === m ? "border-clay bg-clay/10 text-ink" : "border-line/20 bg-card/70 text-ink/80 hover:border-clay/50"
      }`;

    return (
      <div className="space-y-5">
        <Stepper current={2} />
        <div className="rounded-xl border border-line/30 bg-card/60 p-5 text-center">
          <p className="text-lg font-semibold text-heading">You&apos;re on the list. ✅</p>
          <p className="mt-1 text-ink/80">
            Make it official — <strong>annual membership is $19</strong> for the year.
          </p>
        </div>

        <p className="text-center text-sm font-medium text-ink/70">How would you like to join?</p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button type="button" className={optionCls("card")} onClick={() => choose("card")}>
            💳 Card<span className="block text-xs font-normal text-ink/55">{dollars(cardTotal)}</span>
          </button>
          <button type="button" className={optionCls("venmo")} onClick={() => choose("venmo")}>
            Venmo<span className="block text-xs font-normal text-ink/55">{dollars(MEMBERSHIP_CENTS)}</span>
          </button>
          <button type="button" className={optionCls("zelle")} onClick={() => choose("zelle")}>
            Zelle<span className="block text-xs font-normal text-ink/55">{dollars(MEMBERSHIP_CENTS)}</span>
          </button>
          <button type="button" className={optionCls("code")} onClick={() => choose("code")}>
            I have a code<span className="block text-xs font-normal text-ink/55">Free</span>
          </button>
        </div>

        {/* Card */}
        {method === "card" && (
          <div className="rounded-lg border border-line/15 bg-card/50 p-4">
            <p className="text-sm text-ink/75">
              You&apos;ll pay <strong>{dollars(cardTotal)}</strong> — that&apos;s the $19 membership
              plus the card processing fee, so the Council nets the full $19.
            </p>
            <button
              type="button" onClick={payCard} disabled={busy}
              className="mt-3 rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark disabled:opacity-60"
            >
              {busy ? "Redirecting…" : `Pay ${dollars(cardTotal)} by card →`}
            </button>
          </div>
        )}

        {/* Venmo */}
        {method === "venmo" && (
          <div className="rounded-lg border border-line/15 bg-card/50 p-4">
            {VENMO_HANDLE ? (
              <>
                <p className="text-sm text-ink/75">
                  Send <strong>{dollars(MEMBERSHIP_CENTS)}</strong> on Venmo to{" "}
                  <strong>{VENMO_HANDLE}</strong> — please put your name in the note. Then upload a screenshot of your receipt:
                </p>
                <input
                  type="file" accept="image/*,application/pdf" disabled={busy}
                  onChange={(e) => onReceipt(e, "venmo")}
                  className="mt-3 block w-full text-sm text-ink/70 file:mr-3 file:rounded-lg file:border-0 file:bg-clay file:px-4 file:py-2 file:font-semibold file:text-sand"
                />
              </>
            ) : (
              <p className="text-sm text-ink/70">Venmo isn&apos;t set up yet — please use a card or a code for now.</p>
            )}
          </div>
        )}

        {/* Zelle */}
        {method === "zelle" && (
          <div className="rounded-lg border border-line/15 bg-card/50 p-4">
            {ZELLE_HANDLE ? (
              <>
                <p className="text-sm text-ink/75">
                  Send <strong>{dollars(MEMBERSHIP_CENTS)}</strong> via Zelle to{" "}
                  <strong>{ZELLE_HANDLE}</strong> — please put your name in the memo. Then upload a screenshot of your receipt:
                </p>
                <input
                  type="file" accept="image/*,application/pdf" disabled={busy}
                  onChange={(e) => onReceipt(e, "zelle")}
                  className="mt-3 block w-full text-sm text-ink/70 file:mr-3 file:rounded-lg file:border-0 file:bg-clay file:px-4 file:py-2 file:font-semibold file:text-sand"
                />
              </>
            ) : (
              <p className="text-sm text-ink/70">Zelle isn&apos;t set up yet — please use a card or a code for now.</p>
            )}
          </div>
        )}

        {/* Code */}
        {method === "code" && (
          <div className="rounded-lg border border-line/15 bg-card/50 p-4">
            <p className="text-sm text-ink/75">
              Enter your invitation code (honorary or Council). Each code works once.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                type="text" value={code} onChange={(e) => setCode(e.target.value)}
                placeholder="Your code" aria-label="Membership code" className={inputCls}
              />
              <button
                type="button" onClick={redeem} disabled={busy || !code.trim()}
                className="shrink-0 rounded-lg bg-clay px-5 py-3 font-semibold text-sand transition hover:bg-bark disabled:opacity-60"
              >
                {busy ? "…" : "Redeem"}
              </button>
            </div>
          </div>
        )}

        {note && <p className="text-center text-sm text-clay" role="alert">{note}</p>}

        <button
          type="button"
          onClick={() => setDone("No problem — we have your info and we'll be in touch as the Council takes shape.")}
          className="mx-auto block text-sm text-ink/50 underline-offset-2 hover:text-ink/80 hover:underline"
        >
          I&apos;ll decide later — just keep me posted
        </button>
      </div>
    );
  }

  // ---------- PHASE 1: the info form ----------
  return (
    <div>
      <Stepper current={1} />
      <h2 className="text-center text-2xl font-bold text-heading sm:text-3xl">
        Tell us about you
      </h2>
      <p className="mx-auto mb-8 mt-3 max-w-md text-balance text-center text-ink/75">
        First, a little about yourself — your details are saved either way, even
        if you choose to finish joining later.
      </p>

      <form action={formAction} className="space-y-4">
        {/* Attribution (filled client-side) — invisible to the user. */}
        <input type="hidden" name="source" value={attr.source} />
        <input type="hidden" name="referrer" value={attr.referrer} />
        <input type="hidden" name="meta" value={attr.meta} />
        {/* Honeypot — hidden from humans; bots fill it and get silently dropped. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-ink/80">
            I&apos;m joining as <span className="text-clay">*</span>
          </label>
          <select
            name="role" required value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputCls + " text-ink/90"}
          >
            <option value="" disabled>Choose one …</option>
            <option value="resident">Resident / citizen</option>
            <option value="municipality">Municipality / city official</option>
            <option value="expert">Expert / Industry Professional</option>
            <option value="other">Other / Just interested</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input type="text" name="full_name" required placeholder="Full name *" aria-label="Full name" className={inputCls} />
          <input
            type="tel" name="phone" required value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            inputMode="numeric" maxLength={14}
            placeholder="(555) 555-5555 *" aria-label="Phone number" className={inputCls}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="email" name="email" required
            placeholder={role === "municipality" ? "Official government email *" : "Email *"}
            aria-label="Email address" className={inputCls}
          />
          <input type="text" name="city" required placeholder="City *" aria-label="City of residence" className={inputCls} />
        </div>

        {role === "municipality" && (
          <p className="-mt-1 text-xs text-ink/60">
            Use your official city/government email (e.g., name@cityofirvine.org) so we can verify your role.
          </p>
        )}

        {role === "expert" && (
          <input
            type="url" name="linkedin" required
            placeholder="LinkedIn or professional website *"
            aria-label="LinkedIn or professional website" className={inputCls}
          />
        )}

        <fieldset className="rounded-lg border border-line/15 bg-card/40 p-4">
          <legend className="px-1 text-sm font-medium text-ink/80">
            Which of these do you use? (select all that apply)
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
            {APPS.map((app) => (
              <label key={app} className="flex items-center gap-2 text-sm text-ink/80">
                <input type="checkbox" name="apps" value={app} className="h-4 w-4 accent-clay" />
                {app}
              </label>
            ))}
          </div>
        </fieldset>

        {state.status === "error" && (
          <p className="text-sm text-clay" role="alert">{state.message}</p>
        )}
        <div className="flex justify-end">
          <ContinueButton />
        </div>
      </form>
    </div>
  );
}
