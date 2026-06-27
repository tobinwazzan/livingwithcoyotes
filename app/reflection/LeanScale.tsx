"use client";

// The 7-point bipolar lean scale — true extremes, professionalized + balanced.
// Shared by the capture step and the revisit step so the anchors never drift.
export const LEAN_ANCHORS = {
  left: "People and pets first — remove coyotes from our neighborhoods entirely",
  mid: "Neither has priority — balance it case by case",
  right: "Coyotes' place on this land first — even above our pets and children",
};

export default function LeanScale({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="relative flex items-center justify-between px-0.5">
        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-line/40" />
        {[1, 2, 3, 4, 5, 6, 7].map((n) => {
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
      <div className="mt-3 flex justify-between gap-3 text-xs leading-snug text-ink/60">
        <span className="w-[31%] text-left">{LEAN_ANCHORS.left}</span>
        <span className="w-[30%] text-center">{LEAN_ANCHORS.mid}</span>
        <span className="w-[31%] text-right">{LEAN_ANCHORS.right}</span>
      </div>
    </div>
  );
}
