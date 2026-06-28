"use client";

import { useState } from "react";
import LeanScale, { LEAN_ANCHORS } from "../LeanScale";
import { saveRevisit, setReflectionVisibility } from "../actions";
import ReflectionTimeline from "../ReflectionTimeline";
import type {
  ReflectionInput,
  ReflectionResult,
  ReflectionRow,
} from "@/lib/reflections";

type Visibility = "private" | "shared_anon" | "shared_named";

function ShareControl({
  token,
  initial,
}: {
  token: string;
  initial: Visibility;
}) {
  const [vis, setVis] = useState<Visibility>(initial);
  const [saving, setSaving] = useState(false);
  const opts: { v: Visibility; label: string }[] = [
    { v: "private", label: "Keep it private" },
    { v: "shared_anon", label: "Share anonymously" },
    { v: "shared_named", label: "Share with my name" },
  ];
  async function choose(v: Visibility) {
    setSaving(true);
    const res = await setReflectionVisibility(token, v);
    setSaving(false);
    if (res.ok) setVis(v);
  }
  return (
    <div>
      <p className="text-sm leading-relaxed text-ink/70">
        This reflection is yours. If it might help others think, you can share
        your case for the other side on the wall of understanding:
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {opts.map((o) => (
          <button
            key={o.v}
            type="button"
            disabled={saving}
            onClick={() => choose(o.v)}
            className={`rounded-full px-4 py-2 text-sm transition disabled:opacity-60 ${
              vis === o.v
                ? "bg-clay font-semibold text-sand"
                : "border border-line/30 text-ink/70 hover:border-clay"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="mt-2.5 text-xs leading-relaxed text-ink/50">
        Shared entries appear on the public wall — anonymous shows no name; “with
        my name” shows your first name only. You can change or remove this
        anytime.
      </p>
    </div>
  );
}

export type Round = {
  round: number;
  lean: number | null;
  certainty: number | null;
  steelman: string | null;
  moved: string | null;
  created_at: string;
};

function monthYear(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

// Static lean read-out for the mirror — a dot at the saved position.
function MiniLean({ lean }: { lean: number | null }) {
  const pct = lean ? ((lean - 1) / 6) * 100 : 50;
  return (
    <div className="relative my-1.5 h-2 rounded-full bg-line/30">
      <span
        className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay"
        style={{ left: `${pct}%` }}
      />
    </div>
  );
}

function Snapshot({
  label,
  emphasis,
  round,
}: {
  label: string;
  emphasis: boolean;
  round: Round;
}) {
  return (
    <div
      className={`flex-1 rounded-xl p-4 ${
        emphasis ? "border border-line/20 bg-card" : "bg-panel"
      }`}
    >
      <p
        className={`text-[11px] font-bold uppercase tracking-[0.1em] ${
          emphasis ? "text-clay" : "text-ink/50"
        }`}
      >
        {label}
      </p>
      <p className="mt-2 text-xs text-ink/60">Lean</p>
      <MiniLean lean={round.lean} />
      <p className="mt-2 text-xs text-ink/60">
        Certainty <strong className="text-ink">{round.certainty}%</strong>
      </p>
    </div>
  );
}

function Mirror({ round1, round2 }: { round1: Round; round2: Round }) {
  return (
    <div>
      <div className="mb-6 flex gap-3">
        <Snapshot label={`When you joined · ${monthYear(round1.created_at)}`} emphasis={false} round={round1} />
        <Snapshot label={`Today · ${monthYear(round2.created_at)}`} emphasis round={round2} />
      </div>

      <p className="text-sm font-bold text-heading">
        Your case for the side you lean against
      </p>
      <div className="mt-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink/50">
          Then
        </p>
        <blockquote className="mt-1 border-l-[3px] border-line/40 pl-3 text-sm italic leading-relaxed text-ink/60">
          {round1.steelman || "—"}
        </blockquote>
      </div>
      <div className="mt-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-clay">
          Now
        </p>
        <blockquote className="mt-1 border-l-[3px] border-clay pl-3 text-sm italic leading-relaxed text-ink/85">
          {round2.steelman || "—"}
        </blockquote>
      </div>

      {round2.moved && (
        <div className="mt-6 rounded-xl bg-card/60 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-clay">
            What moved
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink/80">{round2.moved}</p>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-ink/60">
        This is yours, and yours alone. Thank you for doing the real work.
      </p>
    </div>
  );
}

export default function RevisitClient({
  token,
  round1,
  round2,
  reflections,
  addAction,
  latestVisibility,
}: {
  token: string;
  round1: Round | null;
  round2: Round | null;
  reflections: ReflectionRow[];
  addAction: (input: ReflectionInput) => Promise<ReflectionResult>;
  latestVisibility: Visibility;
}) {
  const [lean, setLean] = useState<number | null>(null);
  const [certainty, setCertainty] = useState(50);
  const [steelman, setSteelman] = useState("");
  const [moved, setMoved] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [justSaved, setJustSaved] = useState<Round | null>(null);

  if (!round1) {
    return (
      <p className="text-center text-ink/70">
        We couldn&apos;t find your original reflection.
      </p>
    );
  }

  const existingRound2 = round2 ?? justSaved;
  if (existingRound2) {
    return (
      <div>
        <Mirror round1={round1} round2={existingRound2} />
        <div className="mt-10 border-t border-line/15 pt-8">
          <ShareControl token={token} initial={latestVisibility} />
        </div>
        {reflections.length > 0 && (
          <div className="mt-10 border-t border-line/15 pt-8">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-clay">
              Your full record
            </h3>
            <ReflectionTimeline entries={reflections} addAction={addAction} />
          </div>
        )}
      </div>
    );
  }

  async function submit() {
    if (lean === null) {
      setMsg("Mark where you lean today to begin.");
      return;
    }
    setState("saving");
    setMsg("");
    const res = await saveRevisit(token, { lean, certainty, steelman, moved });
    if (res.ok) {
      setJustSaved({
        round: 2,
        lean,
        certainty,
        steelman,
        moved,
        created_at: new Date().toISOString(),
      });
    } else {
      setState("error");
      setMsg(res.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      <p className="mb-8 text-ink/75">
        Fresh, before we show you where you began: where do you stand today?
      </p>

      <div className="mb-8">
        <p className="mb-4 text-sm font-bold text-heading">
          Which way do you lean today?
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
        <p className="text-lg font-bold leading-snug text-heading">
          Again — the best possible case for the side{" "}
          <span className="text-clay underline decoration-2 underline-offset-2">
            you lean against
          </span>
          .
        </p>
        <p className="mt-2 text-sm text-ink/60">
          Write it fresh, without peeking back. We&apos;ll show you your first
          attempt right after.
        </p>
        <textarea
          rows={5}
          value={steelman}
          onChange={(e) => setSteelman(e.target.value)}
          placeholder="The strongest version of what they believe — so well that someone who holds the view would say, 'yes, exactly.'"
          className="mt-3 w-full resize-y rounded-lg border border-line/30 bg-surface p-3.5 text-sm leading-relaxed text-ink placeholder:text-ink/40 focus:border-clay focus:outline-none"
        />
      </div>

      <div className="mt-7">
        <p className="text-sm font-bold text-heading">What moved — or what held?</p>
        <textarea
          rows={2}
          value={moved}
          onChange={(e) => setMoved(e.target.value)}
          placeholder="A line for yourself: what changed your mind even a little, or what hardened it."
          className="mt-2 w-full resize-y rounded-lg border border-line/30 bg-surface p-3.5 text-sm leading-relaxed text-ink placeholder:text-ink/40 focus:border-clay focus:outline-none"
        />
      </div>

      {msg && <p className="mt-5 text-sm text-clay">{msg}</p>}

      <div className="mt-7">
        <button
          type="button"
          onClick={submit}
          disabled={state === "saving"}
          className="rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark disabled:opacity-60"
        >
          {state === "saving" ? "Saving…" : "Show me the mirror"}
        </button>
      </div>
    </div>
  );
}
