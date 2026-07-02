"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import Script from "next/script";
import { submitVideo, type VideoState } from "@/app/videos/actions";
import { TURNSTILE_SITE_KEY } from "@/lib/membership";
import { parseVideoUrl, PLATFORM_LABELS } from "@/lib/video";

const initialState: VideoState = { status: "idle", message: "" };
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
      {pending ? "Sending…" : "Submit video"}
    </button>
  );
}

function Done() {
  return (
    <div className="rounded-2xl border border-line/25 bg-card/60 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-heading">Thank you — it&apos;s in the queue.</h2>
      <p className="mt-3 leading-relaxed text-ink/85">
        A person from the Council will take a look before it appears, to keep the
        page useful and kind. Check back on the videos page soon.
      </p>
      <div className="mt-6">
        <Link href="/videos" className="rounded-lg border border-line/30 px-4 py-2 text-sm font-semibold text-heading transition hover:bg-card">
          Back to videos →
        </Link>
      </div>
    </div>
  );
}

export default function VideoForm() {
  const [state, formAction] = useFormState(submitVideo, initialState);
  const [url, setUrl] = useState("");

  if (state.status === "done") return <Done />;

  const parsed = url.trim() ? parseVideoUrl(url) : null;

  return (
    <form action={formAction} className="space-y-6">
      <input
        type="text"
        name="hp_token"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div>
        <label className={labelCls} htmlFor="url">
          Video link <span className="text-clay">*</span>
        </label>
        <input
          id="url"
          type="url"
          name="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a YouTube, TikTok, Instagram, or X link"
          className={inputCls}
        />
        {url.trim() && (
          <p className="mt-1 text-xs text-ink/60">
            {parsed
              ? `Looks like a ${PLATFORM_LABELS[parsed.platform]} link — we'll embed it with credit.`
              : "That doesn't look like a video link yet."}
          </p>
        )}
      </div>

      <div>
        <label className={labelCls} htmlFor="title">
          Title <span className="text-clay">*</span>
        </label>
        <input id="title" type="text" name="title" required maxLength={140} placeholder="e.g. Coyote crossing the greenbelt at dawn" className={inputCls} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="credit">
            Who made it? <span className="text-ink/40">(credit)</span>
          </label>
          <input id="credit" type="text" name="credit" maxLength={120} placeholder="Original poster or source" className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="city">
            City <span className="text-ink/40">(optional)</span>
          </label>
          <input id="city" type="text" name="city" maxLength={80} placeholder="e.g. Mission Viejo" className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="note">
          Anything to add? <span className="text-ink/40">(optional)</span>
        </label>
        <textarea id="note" name="note" rows={3} maxLength={600} placeholder="A sentence of context. Please keep it factual and kind." className={inputCls} />
      </div>

      <fieldset className="rounded-lg border border-line/15 bg-card/40 p-4">
        <legend className="px-1 text-sm font-medium text-ink/80">
          Your contact <span className="text-ink/40">(optional)</span>
        </legend>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <input type="text" name="submitter_name" placeholder="Your name" aria-label="Your name" className={inputCls} />
          <input type="email" name="submitter_email" placeholder="Email" aria-label="Your email" className={inputCls} />
        </div>
      </fieldset>

      <label className="flex items-start gap-3 rounded-lg border border-clay/40 bg-clay/10 p-4 text-sm text-ink">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 shrink-0 accent-clay" />
        <span>
          I filmed this video myself, or I have the poster&apos;s permission to share it.{" "}
          <span className="text-clay">*</span>
        </span>
      </label>

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
