import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/faq", label: "Coyote Q&A" },
  { href: "/resources", label: "Resources" },
  { href: "/report", label: "Report a coyote" },
];

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <Image
        src="/logo-ccc.png"
        alt=""
        width={88}
        height={88}
        className="h-20 w-20 opacity-90"
      />
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-clay">
        404
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-heading sm:text-4xl">
        This trail went cold
      </h1>
      <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-ink/75">
        The page you&apos;re after isn&apos;t here — it may have moved, or the
        link wandered off. Here&apos;s where to pick the trail back up.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {LINKS.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            className={
              i === 0
                ? "rounded-lg bg-clay px-5 py-2.5 font-semibold text-sand transition hover:bg-bark"
                : "rounded-lg border border-line/30 px-5 py-2.5 font-semibold text-heading transition hover:bg-card"
            }
          >
            {l.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
