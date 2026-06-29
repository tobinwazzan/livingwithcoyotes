"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  submitLead, redeemCode, recordManual, startCheckout, logClientIssue,
  claimFounding, type LeadState,
} from "@/app/actions";
import { supabase } from "@/lib/supabase";
import Script from "next/script";
import {
  cardTotalCents, dollars, MEMBERSHIP_CENTS, VENMO_HANDLE, ZELLE_HANDLE, TURNSTILE_SITE_KEY,
} from "@/lib/membership";

const initialState: LeadState = { status: "idle", message: "" };

const APPS = [
  "Ring Neighbors", "Nextdoor", "Citizen", "Facebook groups", "iNaturalist",
  "Coyote Cacher", "PawBoost", "Petco Love Lost", "Other", "None",
];

const inputCls =
  "w-full rounded-lg border border-line/20 bg-card px-4 py-3 outline-none focus:border-clay focus:ring-2 focus:ring-clay/30";

// Display phone as (xxx) xxx-xxxx while the member types digits only.
function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 10);
  if (d.length > 6) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length > 3) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  if (d.length > 0) return `(${d}`;
  return "";
}

// Gamified progress: one node per screen, on a straight line above the form.
// Three input screens (Role → Contact → Details), then Done.
const STEPS = ["Role", "Contact", "Details", "Done"];
function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-3" aria-label="Progress">
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

// The progress line, pinned just beneath the sticky dark header (top = its
// height, measured at runtime) so it stays visible through the whole intake.
// bg-panel matches the form section so content scrolls under it.
function StickySteps({ current, top }: { current: number; top: number }) {
  return (
    <div
      className="sticky z-30 -mx-6 mb-6 border-b border-line/10 bg-panel px-6 py-3"
      style={{ top }}
    >
      <Stepper current={current} />
    </div>
  );
}

function ContinueButton({ disabled = false, label }: { disabled?: boolean; label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark disabled:opacity-60"
    >
      {pending ? "One moment…" : label}
    </button>
  );
}

// Minimal shape of the global Cloudflare Turnstile API we use.
type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
const getTurnstile = () =>
  (window as unknown as { turnstile?: TurnstileApi }).turnstile;

const ROLES: { key: string; label: string; desc: string }[] = [
  { key: "resident", label: "Active listener", desc: "You live here and want to stay informed and have a say." },
  { key: "sme", label: "Subject-matter expert (SME)", desc: "Wildlife, veterinary, animal-control, or ecology expertise to lend." },
  { key: "municipality_rep", label: "Representative to a municipality", desc: "You can carry this to your city, or speak for it." },
  { key: "coordinator", label: "Local community coordinator", desc: "You'd help organize neighbors, block by block." },
  { key: "admin", label: "Admin / steward", desc: "You'd help keep the conversation open, respectful, and moving." },
  { key: "other", label: "Other", desc: "A role you'd invent — describe it below." },
];

// One title + orienting line per wizard screen.
const STEP_META = [
  { title: "Choose your role", blurb: "Pick any that fit — you can change this anytime." },
  { title: "Your contact information", blurb: "So we can reach you and route you to your city." },
  { title: "A few more details", blurb: "Last step — then you're in." },
];

export default function SignupForm() {
  const [state, formAction] = useFormState(submitLead, initialState);
  const [phone, setPhone] = useState("");
  // Roles are multi-select now (choose all that apply). Default: resident.
  const [roles, setRoles] = useState<string[]>(["resident"]);
  const toggleRole = (k: string) =>
    setRoles((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  // Wizard: one screen per section (1 = Role, 2 = Contact, 3 = Details).
  const TOTAL = 3;
  const [step, setStep] = useState(1);
  const stepRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  // Validate the current screen's required fields before moving on, so nobody
  // reaches the end and bounces back to an empty box.
  const goNext = () => {
    const invalid = stepRefs[step - 1].current?.querySelector<HTMLInputElement>(
      "input:invalid, select:invalid, textarea:invalid",
    );
    if (invalid) {
      invalid.reportValidity();
      return;
    }
    setStep((s) => Math.min(TOTAL, s + 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  // Cloudflare Turnstile — render it explicitly the moment the user reaches
  // screen 3, so the widget always initializes while VISIBLE. (A widget mounted
  // inside a display:none step never issues a token — that was the cause of the
  // silent "Join the Council" failure: the server's human-check gate rejected an
  // empty token before it could reach the duplicate-email / sign-in branch.)
  // The token is held in state and the submit button stays disabled until it
  // arrives, so a missing token can no longer produce a silent dead-click.
  const [tsToken, setTsToken] = useState("");
  const tsRef = useRef<HTMLDivElement>(null);
  const tsWidgetId = useRef<string | null>(null);
  useEffect(() => {
    if (step !== 3) return;
    let cancelled = false;
    const render = () => {
      if (cancelled) return;
      const ts = getTurnstile();
      if (ts && tsRef.current && tsWidgetId.current === null) {
        tsWidgetId.current = ts.render(tsRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "auto",
          callback: (token: string) => setTsToken(token),
          "expired-callback": () => setTsToken(""),
          "error-callback": () => setTsToken(""),
        });
      } else if (!ts) {
        window.setTimeout(render, 200); // API still loading — retry shortly.
      }
    };
    render();
    return () => {
      cancelled = true;
      const ts = getTurnstile();
      if (ts && tsWidgetId.current !== null) {
        try { ts.remove(tsWidgetId.current); } catch { /* already gone */ }
      }
      tsWidgetId.current = null;
      setTsToken("");
    };
  }, [step]);

  // Measure the sticky dark header so the progress line can pin right beneath it.
  const [headerH, setHeaderH] = useState(0);
  useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-sticky-header]");
    if (!el) return;
    const update = () => setHeaderH(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
  const [amountCents, setAmountCents] = useState(MEMBERSHIP_CENTS); // contribution
  const [customAmt, setCustomAmt] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  // Founding offer status (first 100 free) — fetched once when we reach Phase 2.
  type Founding = { count: number; cap: number; remaining: number; open: boolean };
  const [founding, setFounding] = useState<Founding | null>(null);
  void founding;
  void setFounding;

  // Registration is FREE; contributions are entirely separate (the Contribute
  // page, never this flow). So the moment a lead is created, activate the free
  // membership in the background and go straight to the thank-you — no payment.
  useEffect(() => {
    if (state.status === "lead" && state.signupId && !done) {
      claimFounding(state.signupId).catch(() => {});
      setDone(true);
    }
  }, [state.status, state.signupId, done]);

  // ---------- Done ----------
  if (done) {
    const sid = state.signupId;
    return (
      <div>
        <StickySteps current={4} top={headerH} />
        <div className="rounded-2xl border border-line/30 bg-card/60 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">
            You&apos;re in
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-snug text-heading">
            Great — thank you for joining. Your voice means a lot.
          </h2>
          <p className="mt-3 text-ink/75">
            Here are a few ways to put the site to use:
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed">
            {sid && (
              <li>
                <a href={`/reflection?s=${sid}`} className="font-semibold text-clay hover:text-ink">
                  Take the quiet reflection →
                </a>{" "}
                <span className="text-ink/65">
                  where you stand on living with coyotes, just for you.
                </span>
              </li>
            )}
            <li>
              <a href="/understanding" className="font-semibold text-clay hover:text-ink">
                The Wall of Understanding →
              </a>{" "}
              <span className="text-ink/65">
                neighbors making the strongest case for the other side.
              </span>
            </li>
            <li>
              <a href="/resources" className="font-semibold text-clay hover:text-ink">
                Explore the resources →
              </a>{" "}
              <span className="text-ink/65">short, credible, mostly video.</span>
            </li>
            <li>
              <a href="/faq" className="font-semibold text-clay hover:text-ink">
                Coyote Q&amp;A →
              </a>{" "}
              <span className="text-ink/65">what&apos;s normal, what isn&apos;t, what to do.</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // ---------- Already registered → send them to Sign in (not a re-register) ----------
  if (state.status === "already_member") {
    const loginHref = state.email ? `/login?email=${encodeURIComponent(state.email)}` : "/login";
    return (
      <div>
        <StickySteps current={4} top={headerH} />
        <div className="rounded-2xl border border-line/30 bg-card/60 p-6 text-center sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">
            Already registered
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-snug text-heading">
            You&apos;re already on the Council
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ink/75">
            {state.email ? <strong className="text-ink">{state.email}</strong> : "That email"}{" "}
            is already registered — there&apos;s no need to join again. Sign in and
            we&apos;ll email you a secure one-time link to get back in.
          </p>
          <a
            href={loginHref}
            className="mt-5 inline-block rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
          >
            Sign in instead →
          </a>
        </div>
      </div>
    );
  }

  // ---------- PHASE 2: membership ----------
  if (state.status === "lead" && state.signupId) {
    const signupId = state.signupId;
    const email = state.email || "";
    const cardTotal = cardTotalCents(amountCents);
    const isPatron = amountCents >= 5000;

    const choose = (m: typeof method) => { setMethod(m); setNote(""); };

    const pickAmount = (c: number) => { setAmountCents(c); setCustomAmt(""); };
    const onCustom = (v: string) => {
      const clean = v.replace(/[^\d]/g, "").slice(0, 5);
      setCustomAmt(clean);
      const dollarsNum = parseInt(clean || "0", 10);
      setAmountCents(Math.max(MEMBERSHIP_CENTS, dollarsNum * 100));
    };

    const payCard = async () => {
      setBusy(true); setNote("");
      const r = await startCheckout(signupId, email, amountCents);
      if (r.url) { window.location.href = r.url; return; }
      setBusy(false); setNote(r.error || "Card checkout is unavailable right now.");
    };

    const redeem = async () => {
      setBusy(true); setNote("");
      const r = await redeemCode(signupId, code);
      setBusy(false);
      r.ok ? setDone(true) : setNote(r.message);
    };

    const claimFoundingNow = async () => {
      setBusy(true); setNote("");
      const r = await claimFounding(signupId);
      setBusy(false);
      if (r.ok) { setDone(true); return; }
      // Spots just filled — close the offer and fall back to the $19 options.
      if (r.status === "full") {
        setFounding({ count: founding?.cap ?? 100, cap: founding?.cap ?? 100, remaining: 0, open: false });
      }
      setNote(r.message);
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
        const r = await recordManual(signupId, m, path, amountCents);
        setBusy(false);
        r.ok ? setDone(true) : setNote(r.message);
      } catch {
        setBusy(false);
        setNote("That upload didn't go through. Try a different file, or pay by card or code.");
        // A member who chose Venmo/Zelle and whose receipt upload failed used to
        // leave zero trace — log it so it's visible in the funnel.
        logClientIssue(signupId, "receipt_upload");
      }
    };

    const optionCls = (m: string) =>
      `rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${
        method === m ? "border-clay bg-clay/10 text-ink" : "border-line/20 bg-card/70 text-ink/80 hover:border-clay/50"
      }`;

    return (
      <div className="space-y-5">
        <StickySteps current={4} top={headerH} />
        <div className="rounded-xl border border-line/30 bg-card/60 p-5 text-center">
          <p className="text-lg font-semibold text-heading">You&apos;re registered. ✅</p>
          <p className="mt-1 text-ink/80">
            That&apos;s everything — resources, trainings, and alerts — at no cost.
            If you&apos;d like to help keep it going, add a contribution below.
          </p>
        </div>

        {/* Free is the default — confirm and you're done. */}
        {founding?.open && (
          <div className="rounded-xl border-2 border-clay/40 bg-clay/5 p-5 text-center">
            <p className="text-lg font-bold text-heading">Stay free — you&apos;re all set</p>
            <p className="mt-1 text-sm text-ink/75">
              No payment, ever, for the resources, trainings, and alerts.
            </p>
            <button
              type="button" onClick={claimFoundingNow} disabled={busy}
              className="mt-4 w-full rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark disabled:opacity-60 sm:w-auto"
            >
              {busy ? "Confirming…" : "I'm in for free →"}
            </button>
          </div>
        )}

        <p className="text-center text-sm font-medium text-ink/70">
          Or chip in to support the work:
        </p>

        {/* Contribution amount — $20 base; $50+ earns a Pack Leader badge. */}
        <div className="rounded-xl border border-line/15 bg-card/40 p-4">
          <p className="text-center text-sm font-medium text-ink/80">Choose your contribution</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[2000, 5000, 10000].map((c) => (
              <button
                key={c} type="button" onClick={() => pickAmount(c)}
                className={`rounded-lg border px-2 py-2 text-sm font-semibold transition ${
                  amountCents === c && !customAmt
                    ? "border-clay bg-clay/10 text-ink"
                    : "border-line/20 bg-card/70 text-ink/80 hover:border-clay/50"
                }`}
              >
                {dollars(c).replace(".00", "")}
              </button>
            ))}
            <div className={`flex items-center rounded-lg border px-2 transition ${
              customAmt ? "border-clay bg-clay/10" : "border-line/20 bg-card/70"
            }`}>
              <span className="text-sm text-ink/60">$</span>
              <input
                type="text" inputMode="numeric" value={customAmt}
                onChange={(e) => onCustom(e.target.value)}
                placeholder="Other" aria-label="Other amount"
                className="w-full bg-transparent px-1 py-2 text-sm outline-none placeholder:text-ink/40"
              />
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-ink/60">
            {isPatron
              ? "🌟 You'll be a Pack Leader on The Pack — our wall of supporters."
              : "Give $50 or more to become a Pack Leader on The Pack — our wall of supporters."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button type="button" className={optionCls("card")} onClick={() => choose("card")}>
            💳 Card<span className="block text-xs font-normal text-ink/55">{dollars(cardTotal)}</span>
          </button>
          <button type="button" className={optionCls("venmo")} onClick={() => choose("venmo")}>
            Venmo<span className="block text-xs font-normal text-ink/55">{dollars(amountCents)}</span>
          </button>
          <button type="button" className={optionCls("zelle")} onClick={() => choose("zelle")}>
            Zelle<span className="block text-xs font-normal text-ink/55">{dollars(amountCents)}</span>
          </button>
          <button type="button" className={optionCls("code")} onClick={() => choose("code")}>
            I have a code<span className="block text-xs font-normal text-ink/55">Free</span>
          </button>
        </div>

        {/* Card */}
        {method === "card" && (
          <div className="rounded-lg border border-line/15 bg-card/50 p-4">
            <p className="text-sm text-ink/75">
              You&apos;ll pay <strong>{dollars(cardTotal)}</strong> — your {dollars(amountCents)} contribution
              plus the card processing fee, so the Council nets the full {dollars(amountCents)}.
              {isPatron && " You'll be listed as a Pack Leader on The Pack."}
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
                  Send <strong>{dollars(amountCents)}</strong> on Venmo to{" "}
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
                  Send <strong>{dollars(amountCents)}</strong> via Zelle to{" "}
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
          onClick={() => setDone(true)}
          className="mx-auto block text-sm text-ink/50 underline-offset-2 hover:text-ink/80 hover:underline"
        >
          I&apos;ll decide later — just keep me posted
        </button>
      </div>
    );
  }

  // ---------- PHASE 1: the info form, one screen per section ----------
  const meta = STEP_META[step - 1];
  return (
    <div>
      <StickySteps current={step} top={headerH} />
      <h2 className="text-center text-2xl font-bold text-heading sm:text-3xl">
        {meta.title}
      </h2>
      <p className="mx-auto mb-8 mt-3 max-w-md text-balance text-center text-ink/75">
        {meta.blurb}
      </p>

      {/* Load the Turnstile API up front so it's ready by screen 3, where the
          widget is rendered explicitly (see the effect above). */}
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />

      <form action={formAction} className="space-y-4">
        {/* Attribution (filled client-side) — invisible to the user. */}
        <input type="hidden" name="source" value={attr.source} />
        <input type="hidden" name="referrer" value={attr.referrer} />
        <input type="hidden" name="meta" value={attr.meta} />
        {/* Honeypot — hidden from humans; bots fill it and get silently dropped.
            Name must NOT match a browser-autofill field (e.g. "company"), or real
            members' autofill trips it. Also told password managers to ignore it. */}
        <input
          type="text"
          name="hp_token"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          data-lpignore="true"
          data-1p-ignore=""
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />

        {/* All three screens stay mounted (so every field submits together) —
            only the current one is shown. */}

        {/* ── Screen 1 · Choose your role ── */}
        <div ref={stepRefs[0]} className={step === 1 ? "" : "hidden"}>
          <fieldset className="rounded-xl border border-line/15 bg-card/40 p-4 sm:p-5">
            <p className="text-xs text-ink/60">
              These are interests, not titles — the privileged roles are confirmed later.
            </p>
            <div className="mt-3 space-y-2.5">
              {ROLES.map((r) => (
                <label key={r.key} className="flex cursor-pointer gap-2.5">
                  <input
                    type="checkbox" name="roles" value={r.key}
                    checked={roles.includes(r.key)}
                    onChange={() => toggleRole(r.key)}
                    className="mt-1 h-4 w-4 shrink-0 accent-clay"
                  />
                  <span>
                    <span className="block text-sm font-medium text-ink/90">{r.label}</span>
                    <span className="block text-xs text-ink/55">{r.desc}</span>
                  </span>
                </label>
              ))}
            </div>
            {roles.includes("other") && (
              <input
                type="text" name="role_other" maxLength={60}
                placeholder="Describe the role you'd like to play"
                aria-label="Describe your role"
                className={inputCls + " mt-3"}
              />
            )}
          </fieldset>
        </div>

        {/* ── Screen 2 · Contact information ── */}
        <div ref={stepRefs[1]} className={step === 2 ? "" : "hidden"}>
          <fieldset className="space-y-4 rounded-xl border border-line/15 bg-card/40 p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" name="full_name" required placeholder="Full name *" aria-label="Full name" autoComplete="name" className={inputCls} />
              <input
                type="tel" name="phone" required value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                inputMode="numeric" maxLength={14} autoComplete="tel"
                placeholder="(555) 555-5555 *" aria-label="Phone number" className={inputCls}
              />
            </div>
            <input type="email" name="email" required placeholder="Email *" aria-label="Email address" autoComplete="email" className={inputCls} />
            <input type="text" name="address" required placeholder="Street address *" aria-label="Street address" autoComplete="street-address" className={inputCls} />
            <input type="text" name="neighborhood" placeholder="Neighborhood or HOA (if any)" aria-label="Neighborhood or HOA" className={inputCls} />
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" name="city" required placeholder="City *" aria-label="City" autoComplete="address-level2" className={inputCls} />
              <input type="text" name="zip" required placeholder="ZIP *" aria-label="ZIP code" inputMode="numeric" maxLength={10} autoComplete="postal-code" className={inputCls} />
            </div>
            <p className="text-xs text-ink/55">
              Your address stays private — it&apos;s used only to send neighborhood
              alerts and any contribution perk, never shown publicly.
            </p>
          </fieldset>
        </div>

        {/* ── Screen 3 · Other information + verify + agree ── */}
        <div ref={stepRefs[2]} className={step === 3 ? "space-y-4" : "hidden"}>
          <fieldset className="rounded-xl border border-line/15 bg-card/40 p-4 sm:p-5">
            <p className="text-xs text-ink/60">
              Which neighborhood apps do you use? (select all that apply)
            </p>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              {APPS.map((app) => (
                <label key={app} className="flex items-center gap-2 text-sm text-ink/80">
                  <input type="checkbox" name="apps" value={app} className="h-4 w-4 accent-clay" />
                  {app}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Cloudflare Turnstile — human check (stops scripted abuse). Rendered
              explicitly via the effect above so it always initializes visible. */}
          <div className="flex justify-center">
            <div ref={tsRef} />
          </div>

          <label className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/75">
            <input
              type="checkbox"
              name="agree_terms"
              value="yes"
              required
              className="mt-1 h-4 w-4 shrink-0 accent-clay"
            />
            <span>
              I&apos;m 18 or older and I agree to the{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-clay hover:underline">
                Terms of Use
              </a>
              ,{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-clay hover:underline">
                Privacy Policy
              </a>
              , and{" "}
              <a href="/liability" target="_blank" rel="noopener noreferrer" className="text-clay hover:underline">
                Release of Liability
              </a>
              .
            </span>
          </label>
        </div>

        {state.status === "error" && (
          <p className="text-sm text-clay" role="alert">{state.message}</p>
        )}

        {/* Wizard navigation */}
        <div className="flex items-center justify-between pt-2">
          {step > 1 ? (
            <button
              type="button" onClick={goBack}
              className="rounded-lg px-4 py-3 text-sm font-medium text-ink/55 transition hover:text-ink"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          {step < TOTAL ? (
            <button
              type="button" onClick={goNext}
              className="rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
            >
              Continue →
            </button>
          ) : (
            <div className="flex flex-col items-end gap-1.5">
              <ContinueButton
                disabled={!tsToken}
                label={tsToken ? "Join the Council →" : "Verifying you're human…"}
              />
              {!tsToken && (
                <span className="text-xs text-ink/45">
                  One moment — finishing the quick human check above.
                </span>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
