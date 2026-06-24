"use client";

import { useEffect, useState } from "react";
import { CHECKLIST } from "@/content/checklist";

const STORAGE_KEY = "ccc-coyote-checklist";

export default function ChecklistInteractive() {
  const keys = CHECKLIST.flatMap((g, gi) => g.items.map((_, ii) => `${gi}-${ii}`));
  const total = keys.length;

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  // Restore saved progress.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  // Persist progress.
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {}
  }, [checked, loaded]);

  const done = keys.filter((k) => checked[k]).length;
  const toggle = (k: string) => setChecked((c) => ({ ...c, [k]: !c[k] }));

  return (
    <div>
      {/* Progress + actions — sticky under the header, hidden when printing */}
      <div className="sticky top-16 z-10 -mx-6 mb-8 flex items-center justify-between gap-4 border-y border-line/15 bg-surface/95 px-6 py-3 backdrop-blur print:hidden sm:top-20">
        <p className="text-sm font-medium text-ink/80">
          <span className="font-bold text-clay">{done}</span> of {total} done
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-line/30 px-3 py-1.5 text-sm font-medium text-heading transition hover:bg-panel"
          >
            Print
          </button>
          <button
            type="button"
            onClick={() => setChecked({})}
            className="text-sm text-ink/50 transition hover:text-clay"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-10">
        {CHECKLIST.map((g, gi) => (
          <section key={g.id}>
            <h2 className="text-xl font-bold text-heading">{g.title}</h2>
            {g.note && <p className="mt-1 text-sm text-ink/60">{g.note}</p>}
            <ul className="mt-4 space-y-2.5">
              {g.items.map((item, ii) => {
                const k = `${gi}-${ii}`;
                const on = !!checked[k];
                return (
                  <li key={k}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line/15 bg-card/60 p-3.5 transition hover:border-clay/40">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(k)}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-clay"
                      />
                      <span
                        className={`text-sm leading-relaxed ${
                          on ? "text-ink/40 line-through" : "text-ink/85"
                        }`}
                      >
                        {item}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
