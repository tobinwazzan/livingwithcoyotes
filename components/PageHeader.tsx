import { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
  sticky = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  /** Pin the header to the top so content scrolls up beneath it. */
  sticky?: boolean;
}) {
  return (
    <section
      data-sticky-header={sticky ? "" : undefined}
      className={`overflow-hidden border-b border-line/15 bg-surface text-ink ${
        sticky ? "sticky top-0 z-40" : "relative"
      }`}
    >
      {/* A whisper of warm moss at the top so the header has a little depth
          without the heavy dark band it used to carry. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 0%, rgba(90,107,74,0.10), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 pb-14 pt-28 text-center sm:pt-32">
        {eyebrow && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-clay">
            {eyebrow}
          </p>
        )}
        <h1 className="text-balance text-3xl font-extrabold leading-tight text-heading sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          // text-pretty (not balance): balance gives up past ~6 lines and lets a
          // single-word widow strand on the last line; pretty keeps the orphan
          // tucked up regardless of length.
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink/70 sm:text-lg">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
