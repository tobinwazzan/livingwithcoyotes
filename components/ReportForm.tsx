"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import Script from "next/script";
import { submitReport, type ReportState } from "@/app/report/actions";
import { TURNSTILE_SITE_KEY } from "@/lib/membership";
import {
  CATEGORIES,
  TIME_OF_DAY,
  BEHAVIORS,
  PETS,
  ATTRACTANTS,
  ACTIONS,
  RESPONSES,
} from "@/content/report";

const initialState: ReportState = { status: "idle", message: "" };

const inputCls =
  "w-full rounded-lg border border-line/20 bg-card px-4 py-3 outline-none focus:border-clay focus:ring-2 focus:ring-clay/30";
const labelCls = "mb-1 block text-sm font-medium text-ink/80";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark disabled:opacity-60"
    >
      {pending ? "Sending…" : "Submit report"}
    </button>
  );
}

// The calibrated thank-you, keyed by the tier they reported.
function Done({ category }: { category: string }) {
  const r = RESPONSES[category] ?? RESPONSES.other;
  return (
    <div className="rounded-2xl border border-line/25 bg-card/60 p-6 sm:p-8">
      {r.emergency && (
        <div className="mb-5 rounded-lg border border-clay/40 bg-clay/10 p-4 text-sm font-medium text-ink">
          If anyone is hurt or in immediate danger, call{" "}
          <a href="tel:911" className="font-bold text-clay underline-offset-2 hover:underline">
            911
          </a>{" "}
          now.
        </div>
      )}
      <h2 className="text-xl font-bold text-heading">{r.title}</h2>
      <p className="mt-3 leading-relaxed text-ink/85">{r.body}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {r.links.map((l) =>
          l.external ? (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-line/30 px-4 py-2 text-sm font-semibold text-heading transition hover:bg-card"
            >
              {l.label} ↗
            </a>
          ) : (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg border border-line/30 px-4 py-2 text-sm font-semibold text-heading transition hover:bg-card"
            >
              {l.label} →
            </Link>
          ),
        )}
      </div>

      <p className="mt-6 text-sm text-ink/60">
        Thank you — every report helps the Council see where conflict is real and
        respond where it matters.
      </p>
    </div>
  );
}

export default function ReportForm() {
  const [state, formAction] = useFormState(submitReport, initialState);
  const [category, setCategory] = useState("");

  if (state.status === "done" && state.category) {
    return <Done category={state.category} />;
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Honeypot — hidden from people; bots fill it and get dropped. */}
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

      {/* 1 — What happened (severity tier). Required. */}
      <fieldset>
        <legend className={labelCls}>
          What happened? <span className="text-clay">*</span>
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {CATEGORIES.map((c) => (
            <label
              key={c.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${
                category === c.value
                  ? "border-clay bg-clay/10"
                  : "border-line/20 bg-card/70 hover:border-clay/50"
              }`}
            >
              <input
                type="radio"
                name="category"
                value={c.value}
                required
                checked={category === c.value}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 h-4 w-4 shrink-0 accent-clay"
              />
              <span>
                <span className="font-semibold text-ink">{c.label}</span>
                <span className="mt-0.5 block text-xs text-ink/60">{c.help}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* 2 — Where. City required; area is deliberately coarse. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="city">
            City <span className="text-clay">*</span>
          </label>
          <input id="city" type="text" name="city" required placeholder="e.g. Irvine" className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="area">
            Area <span className="text-ink/40">(optional)</span>
          </label>
          <input
            id="area"
            type="text"
            name="area"
            placeholder="Cross street, park, or landmark"
            className={inputCls}
          />
          <p className="mt-1 text-xs text-ink/55">
            A general area is plenty — please don&apos;t enter an exact home address.
          </p>
        </div>
      </div>

      {/* 3 — When. Both optional. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="occurred_on">
            Date <span className="text-ink/40">(optional)</span>
          </label>
          <input id="occurred_on" type="date" name="occurred_on" className={inputCls + " text-ink/90"} />
        </div>
        <div>
          <label className={labelCls} htmlFor="time_of_day">
            Time of day <span className="text-ink/40">(optional)</span>
          </label>
          <select id="time_of_day" name="time_of_day" defaultValue="" className={inputCls + " text-ink/90"}>
            <option value="">Choose one …</option>
            {TIME_OF_DAY.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 — Behavior + pet. Both optional. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="behavior">
            How did the coyote behave? <span className="text-ink/40">(optional)</span>
          </label>
          <select id="behavior" name="behavior" defaultValue="" className={inputCls + " text-ink/90"}>
            <option value="">Choose one …</option>
            {BEHAVIORS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="pet_involved">
            Was a pet involved? <span className="text-ink/40">(optional)</span>
          </label>
          <select id="pet_involved" name="pet_involved" defaultValue="" className={inputCls + " text-ink/90"}>
            <option value="">Choose one …</option>
            {PETS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 5 — Attractants (root cause). Multi-select. */}
      <fieldset className="rounded-lg border border-line/15 bg-card/40 p-4">
        <legend className="px-1 text-sm font-medium text-ink/80">
          Anything nearby that might attract coyotes? (select all that apply)
        </legend>
        <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          {ATTRACTANTS.map((a) => (
            <label key={a.value} className="flex items-center gap-2 text-sm text-ink/80">
              <input type="checkbox" name="attractants" value={a.value} className="h-4 w-4 accent-clay" />
              {a.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* 6 — What did you do. Optional. */}
      <div>
        <label className={labelCls} htmlFor="action_taken">
          What did you do? <span className="text-ink/40">(optional)</span>
        </label>
        <select id="action_taken" name="action_taken" defaultValue="" className={inputCls + " text-ink/90"}>
          <option value="">Choose one …</option>
          {ACTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* 7 — Short note. Optional, capped. */}
      <div>
        <label className={labelCls} htmlFor="note">
          Anything else? <span className="text-ink/40">(optional)</span>
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          maxLength={600}
          placeholder="A sentence or two of useful detail. Please keep it factual."
          className={inputCls}
        />
      </div>

      {/* 8 — Optional contact for follow-up. */}
      <fieldset className="rounded-lg border border-line/15 bg-card/40 p-4">
        <legend className="px-1 text-sm font-medium text-ink/80">
          Want us to follow up? <span className="text-ink/40">(optional)</span>
        </legend>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <input type="text" name="reporter_name" placeholder="Your name" aria-label="Your name" className={inputCls} />
          <input type="email" name="reporter_email" placeholder="Email" aria-label="Your email" className={inputCls} />
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm text-ink/75">
          <input type="checkbox" name="contact_ok" className="h-4 w-4 accent-clay" />
          It&apos;s okay to contact me about this report.
        </label>
        <p className="mt-1 text-xs text-ink/55">
          We never publish your name, contact, or exact location.
        </p>
      </fieldset>

      {/* Cloudflare Turnstile — invisible human check. */}
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <div className="flex justify-center">
        <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="auto" />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-clay" role="alert">{state.message}</p>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
