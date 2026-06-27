"use client";

import { useState } from "react";
import LeanScale from "./LeanScale";
import { saveReflection } from "./actions";

export default function CaptureForm({ signupId }: { signupId: string }) {
  const [lean, setLean] = useState<number | null>(null);
  const [certainty, setCertainty] = useState(50);
  const [steelman, setSteelman] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit() {
    if (lean === null) {
      setMsg("Mark where you lean to begin.");
      return;
    }
    setState("saving");
    setMsg("");
    const res = await saveReflection(signupId, { lean, certainty, steelman });
    if (res.ok) setState("done");
    else {
      setState("error");
      setMsg(res.message || "Something went wrong. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-line/15 bg-card/60 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">
          Saved
        </p>
        <h2 className="mt-2 text-2xl font-bold text-heading">
          Thank you — this is yours to keep.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-ink/75">
          In a few weeks we&apos;ll email you a private link to revisit it, and
          see what&apos;s shifted. No need to do anything until then.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="mb-4 text-sm font-bold text-heading">
          Which way do you lean right now?
        </p>
        <LeanScale value={lean} onChange={setLean} />
      </div>

      <div className="mb-9">
        <p className="mb-3 text-sm font-bold text-heading">How certain are you?</p>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={certainty}
          onChange={(e) => setCertainty(Number(e.target.value))}
          className="w-full accent-clay"
          aria-label="How certain are you, 0 to 100"
        />
        <div className="mt-1 flex justify-between text-xs text-ink/60">
          <span>Still figuring it out</span>
          <span>Completely sure</span>
        </div>
      </div>

      <div className="border-t border-line/15 pt-7">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">
          Now the real work
        </p>
        <p className="mt-2 text-lg font-bold leading-snug text-heading">
          Make the best possible case for the side{" "}
          <span className="text-clay underline decoration-2 underline-offset-2">
            you lean against
          </span>
          .
        </p>
        <div className="mt-3 flex items-start gap-2.5 rounded-lg bg-clay/10 p-3.5">
          <span aria-hidden className="mt-0.5 text-clay">⇄</span>
          <p className="text-sm leading-relaxed text-ink/80">
            This is the strongest version of what <strong>someone else</strong>{" "}
            believes. It&apos;s about <strong>their</strong> view — not yours.
          </p>
        </div>
        <textarea
          rows={5}
          value={steelman}
          onChange={(e) => setSteelman(e.target.value)}
          placeholder="Write it as they would — strong enough that someone who holds this view would read it and say, 'yes, exactly.'"
          className="mt-3 w-full resize-y rounded-lg border border-line/30 bg-surface p-3.5 text-sm leading-relaxed text-ink placeholder:text-ink/40 focus:border-clay focus:outline-none"
        />
        <p className="mt-2 text-xs text-ink/50">
          No grade. It&apos;s never shown publicly or to other members.
        </p>
      </div>

      {msg && <p className="mt-5 text-sm text-clay">{msg}</p>}

      <div className="mt-7 flex items-center gap-4">
        <button
          type="button"
          onClick={submit}
          disabled={state === "saving"}
          className="rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark disabled:opacity-60"
        >
          {state === "saving" ? "Saving…" : "Save my reflection"}
        </button>
        <a href="/" className="text-sm font-medium text-ink/60 hover:text-clay">
          Skip for now
        </a>
      </div>
    </div>
  );
}
