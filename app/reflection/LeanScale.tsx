"use client";

// Canonical lean: 1 = "Remove the coyotes" … 7 = "Keep the coyotes". The stored
// value is ALWAYS canonical; only the on-screen left/right order may flip (see
// orientation below). Plain, parallel, neutral poles — no values lecture — with a
// real middle, so a "4" actually means something (the case-by-case position most
// evidence lands on), not a forced retreat from two caricatured extremes.
export const LEAN_ANCHORS = {
  remove: "Remove the coyotes",
  mid: "Depends — case by case",
  keep: "Keep the coyotes",
};

// Reading-order counterbalancing. In LTR cultures the left pole is read first and
// the right reads as the "destination" — and since we're the *Coexistence* Council,
// "Keep" drifting rightward could read as "move toward us." So we flip the display
// for half the membership. Orientation is derived deterministically from signupId:
// fixed for one person across every visit (their own timeline stays coherent), but
// ≈50/50 across members (the population-level nudge cancels out). No storage needed.
export function leanFlipped(signupId: string | null | undefined): boolean {
  if (!signupId) return false;
  let h = 0;
  for (let i = 0; i < signupId.length; i++) h = (h * 31 + signupId.charCodeAt(i)) | 0;
  return (h & 1) === 1;
}

// Saved-value read-out position (0–100%), flipped to match the member's own scale
// orientation so the dot sits where they actually clicked.
export function leanPercent(lean: number | null, flipped = false): number {
  if (!lean) return 50;
  const pct = ((lean - 1) / 6) * 100;
  return flipped ? 100 - pct : pct;
}

export default function LeanScale({
  value,
  onChange,
  flipped = false,
}: {
  value: number | null; // canonical 1..7
  onChange: (v: number) => void;
  flipped?: boolean;
}) {
  const order = flipped ? [7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7];
  const leftLabel = flipped ? LEAN_ANCHORS.keep : LEAN_ANCHORS.remove;
  const rightLabel = flipped ? LEAN_ANCHORS.remove : LEAN_ANCHORS.keep;

  return (
    <div>
      <div className="relative flex items-center justify-between px-0.5">
        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-line/40" />
        {order.map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={`Lean position ${n} of 7`}
              aria-pressed={active}
              className={`relative z-10 rounded-full border-2 transition ${
                active
                  ? "h-5 w-5 border-clay bg-clay"
                  : "h-3.5 w-3.5 border-line/60 bg-surface hover:border-clay"
              }`}
            />
          );
        })}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 text-xs leading-snug">
        <span className="w-[34%] text-left font-semibold text-ink/75">{leftLabel}</span>
        <span className="w-[32%] text-center text-ink/55">{LEAN_ANCHORS.mid}</span>
        <span className="w-[34%] text-right font-semibold text-ink/75">{rightLabel}</span>
      </div>
    </div>
  );
}
