"use client";

// Certainty 0–100 with a live digital readout. The number in the window updates
// proportionally as the slider moves, so the member sees their certainty as a
// concrete figure rather than a vague position. Shared everywhere the scale appears.
export default function CertaintySlider({
  value,
  onChange,
  label = "How certain are you?",
}: {
  value: number;
  onChange: (v: number) => void;
  label?: string;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-end justify-between gap-3">
        <p className="text-sm font-bold text-heading">{label}</p>
        {/* digital window — value changes live as the slider moves */}
        <div className="flex items-baseline gap-1 rounded-lg border border-clay/30 bg-clay/10 px-3 py-1 shadow-inner tabular-nums">
          <span className="min-w-[3ch] text-right text-2xl font-extrabold leading-none text-clay">
            {value}
          </span>
          <span className="text-xs font-bold text-clay/60">/ 100</span>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-clay"
        aria-label="How certain are you, 0 to 100"
      />
      <div className="mt-1 flex justify-between text-xs text-ink/60">
        <span>Still figuring it out</span>
        <span>Completely sure</span>
      </div>
    </div>
  );
}
