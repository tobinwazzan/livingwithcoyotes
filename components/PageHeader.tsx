import { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-dusk text-sand">
      {/* Soft moss glow so interior headers feel related to the home hero */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(65% 90% at 50% 0%, rgba(90,107,74,0.45), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 pb-14 pt-28 text-center sm:pt-32">
        {eyebrow && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-clay">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-sand/75 sm:text-lg">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
