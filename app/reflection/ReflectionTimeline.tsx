"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LeanScale from "./LeanScale";
import type {
  ReflectionInput,
  ReflectionResult,
  ReflectionRow,
} from "@/lib/reflections";

function sourceLabel(round: number): string {
  if (round === 1) return "Joined";
  if (round === 2) return "Revisit";
  return `Check-in ${round}`;
}

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

function MiniLean({ lean }: { lean: number | null }) {
  const pct = lean ? ((lean - 1) / 6) * 100 : 50;
  return (
    <div className="relative my-1 h-2 w-28 rounded-full bg-line/30">
      <span
        className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay"
        style={{ left: `${pct}%` }}
      />
    </div>
  );
}

function CertaintyTrend({ rows }: { rows: ReflectionRow[] }) {
  const pts = rows
    .map((r) => r.certainty)
    .filter((c): c is number => typeof c === "number");
  if (pts.length < 2) return null;
  return (
    <div className="mb-7 rounded-xl bg-panel p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-heading">
          Certainty across {pts.length} check-ins
        </span>
        <span className="text-[11px] text-ink/50">
          the dips are the doubt doing its work
        </span>
      </div>
      <div className="relative h-10">
        <div className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-line/40" />
        {pts.map((c, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 text-center"
            style={{
              left: `${pts.length === 1 ? 50 : (i / (pts.length - 1)) * 96 + 2}%`,
              top: `${42 - (c / 100) * 28}%`,
            }}
          >
            <span className="mx-auto block h-2.5 w-2.5 rounded-full bg-clay" />
            <span className="mt-1 block text-[10px] text-ink/55">{c}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReflectionTimeline({
  entries,
  addAction,
}: {
  entries: ReflectionRow[];
  addAction: (input: ReflectionInput) => Promise<ReflectionResult>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lean, setLean] = useState<number | null>(null);
  const [certainty, setCertainty] = useState(50);
  const [steelman, setSteelman] = useState("");
  const [moved, setMoved] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const [msg, setMsg] = useState("");

  const asc = [...entries].sort((a, b) => a.round - b.round);
  const desc = [...asc].reverse();

  async function submit() {
    if (lean === null) {
      setMsg("Mark where you lean today to begin.");
      return;
    }
    setState("saving");
    setMsg("");
    const res = await addAction({ lean, certainty, steelman, moved });
    if (res.ok) {
      setOpen(false);
      setLean(null);
      setCertainty(50);
      setSteelman("");
      setMoved("");
      setState("idle");
      router.refresh();
    } else {
      setState("error");
      setMsg(res.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      <CertaintyTrend rows={asc} />

      <div className="mb-7">
        {open ? (
          <div className="rounded-xl border border-line/20 bg-card/60 p-5">
            <p className="mb-3 text-sm font-bold text-heading">
              Where do you lean today?
            </p>
            <LeanScale value={lean} onChange={setLean} />
            <p className="mb-2 mt-6 text-sm font-bold text-heading">
              How certain are you?
            </p>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={certainty}
              onChange={(e) => setCertainty(Number(e.target.value))}
              className="w-full accent-clay"
              aria-label="How certain are you"
            />
            <p className="mb-2 mt-5 text-sm font-bold text-heading">
              The best case for the side you lean against
            </p>
            <textarea
              rows={4}
              value={steelman}
              onChange={(e) => setSteelman(e.target.value)}
              placeholder="Write it as they would — strong enough that someone who holds the view would say, 'yes, exactly.'"
              className="w-full resize-y rounded-lg border border-line/30 bg-surface p-3 text-sm leading-relaxed text-ink placeholder:text-ink/40 focus:border-clay focus:outline-none"
            />
            <textarea
              rows={2}
              value={moved}
              onChange={(e) => setMoved(e.target.value)}
              placeholder="What moved — or what held? (optional)"
              className="mt-3 w-full resize-y rounded-lg border border-line/30 bg-surface p-3 text-sm leading-relaxed text-ink placeholder:text-ink/40 focus:border-clay focus:outline-none"
            />
            {msg && <p className="mt-3 text-sm text-clay">{msg}</p>}
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={submit}
                disabled={state === "saving"}
                className="rounded-lg bg-clay px-5 py-2.5 font-semibold text-sand transition hover:bg-bark disabled:opacity-60"
              >
                {state === "saving" ? "Saving…" : "Save this check-in"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-ink/60 hover:text-clay"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full rounded-lg border border-dashed border-line/40 py-3 text-sm font-semibold text-clay transition hover:border-clay hover:bg-card/40"
          >
            + Add a reflection
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5 border-l-2 border-line/20 pl-5">
        {desc.map((e) => (
          <div key={e.round} className="relative">
            <span
              className={`absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-surface ${
                e.round === desc[0].round ? "bg-clay" : "bg-line/50"
              }`}
            />
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
              <span
                className={`text-[11px] font-bold uppercase tracking-wide ${
                  e.round === desc[0].round ? "text-clay" : "text-ink/55"
                }`}
              >
                {sourceLabel(e.round)} · {monthYear(e.created_at)}
              </span>
              <span className="text-[11px] text-ink/45">
                lean {e.lean ?? "—"}/7 · certainty {e.certainty ?? "—"}%
              </span>
            </div>
            <MiniLean lean={e.lean} />
            {e.steelman && (
              <blockquote
                className={`mt-1 border-l-[3px] pl-3 text-sm italic leading-relaxed ${
                  e.round === desc[0].round
                    ? "border-clay text-ink/85"
                    : "border-line/40 text-ink/65"
                }`}
              >
                {e.steelman}
              </blockquote>
            )}
            {e.moved && (
              <p className="mt-1.5 text-xs text-ink/60">
                <strong className="text-clay">What moved:</strong> {e.moved}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
