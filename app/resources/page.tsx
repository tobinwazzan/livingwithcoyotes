import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { RESOURCE_GROUPS, RESOURCE_INTRO } from "@/content/resources";

export const metadata: Metadata = {
  title: "Resources for Learning",
  description:
    "A short, well-rounded, video-forward starter kit to get any member up to speed on living with coyotes — every link from a credible source and verified working.",
};

export default function ResourcesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Resources for Learning"
        title="A Coyote Coexistence Starter Kit"
        subtitle="Built for watching, not just reading. Every link is from a credible source — wildlife agencies, science institutions, and leading coexistence groups — and was verified working in June 2026."
      />

      <div className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <p className="text-lg leading-relaxed text-bark/85">
            {RESOURCE_INTRO}
          </p>
        </Reveal>

        <div className="mt-14 space-y-16">
          {RESOURCE_GROUPS.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-24">
              <Reveal>
                <h2 className="flex items-baseline gap-3 text-2xl font-bold text-moss">
                  <span aria-hidden="true" className="text-clay">
                    {group.icon}
                  </span>
                  {group.heading}
                </h2>
                {group.note && (
                  <p className="mt-1 text-sm text-bark/60">{group.note}</p>
                )}
              </Reveal>

              <ul className="mt-6 space-y-4">
                {group.items.map((item) => (
                  <Reveal key={item.url}>
                    <li>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-xl border border-moss/15 bg-white/60 p-5 transition hover:-translate-y-0.5 hover:border-clay/40 hover:shadow-md"
                      >
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h3 className="font-semibold text-bark transition group-hover:text-clay">
                            {item.title}
                          </h3>
                          {item.length && (
                            <span className="rounded-full bg-moss/10 px-2 py-0.5 text-xs font-medium text-moss">
                              {item.length}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs uppercase tracking-wide text-bark/50">
                          {item.source}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-bark/75">
                          {item.blurb}
                        </p>
                      </a>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 rounded-xl bg-moss/10 p-8 text-center">
            <p className="text-bark/80">
              Found a link that's gone stale, or have something we should add?
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-block font-semibold text-clay transition hover:text-bark"
            >
              Tell us and we'll fix it →
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
