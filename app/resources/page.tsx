import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { RESOURCE_GROUPS, RESOURCE_INTRO } from "@/content/resources";

export const metadata: Metadata = {
  title: "Resources",
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
          <p className="text-lg leading-relaxed text-ink/85">
            {RESOURCE_INTRO}
          </p>
        </Reveal>

        <Reveal>
          <section className="mt-12 rounded-2xl border border-clay/30 bg-clay/5 p-6 sm:p-8">
            <div className="flex items-baseline gap-3">
              <span className="rounded-full bg-clay px-3 py-1 text-xs font-bold uppercase tracking-wide text-sand">
                Start here
              </span>
              <h2 className="text-2xl font-bold text-heading">
                If you only have ten minutes
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">
              Three picks, in order. Watch the first two and you'll know more
              than most of your neighbors.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {[
                {
                  title: "How to Haze a Coyote",
                  url: "https://www.youtube.com/watch?v=rlxMPpFQClM",
                  source: "LA Animal Services",
                  length: "~4 min",
                  why: "The single most useful skill — what to do when a coyote won't move along.",
                },
                {
                  title: "Coexisting With Urban Coyotes",
                  url: "https://www.youtube.com/watch?v=2v4WK65w8pg",
                  source: "Michigan DNR",
                  length: "~5 min",
                  why: "What pulls coyotes into your yard — and how to make your property boring to them.",
                },
                {
                  title: "Coyotes: Safety & Coexistence in California",
                  url: "https://www.youtube.com/watch?v=OdOewqXCS-I",
                  source: "California Dept. of Fish & Wildlife",
                  length: "~12 min",
                  why: "The authoritative explainer: biology, boldness vs. food-conditioning, and what to do.",
                },
              ].map((pick, i) => (
                <Reveal key={pick.url} delay={i * 80} className="h-full">
                  <a
                    href={pick.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-xl border border-clay/30 bg-card/80 p-5 transition hover:-translate-y-0.5 hover:border-clay hover:shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-clay text-sm font-bold text-sand">
                        {i + 1}
                      </span>
                      {pick.length && (
                        <span className="rounded-full bg-clay/10 px-2 py-0.5 text-xs font-medium text-clay">
                          {pick.length}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 font-semibold text-ink transition group-hover:text-clay">
                      {pick.title}
                    </h3>
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-ink/50">
                      {pick.source}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/75">
                      {pick.why}
                    </p>
                  </a>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>

        <div className="mt-14 space-y-16">
          {RESOURCE_GROUPS.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-24">
              <Reveal>
                <h2 className="flex items-baseline gap-3 text-2xl font-bold text-heading">
                  <span aria-hidden="true" className="text-clay">
                    {group.icon}
                  </span>
                  {group.heading}
                </h2>
                {group.note && (
                  <p className="mt-1 text-sm text-ink/60">{group.note}</p>
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
                        className="group block rounded-xl border border-line/15 bg-card/60 p-5 transition hover:-translate-y-0.5 hover:border-clay/40 hover:shadow-md"
                      >
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h3 className="font-semibold text-ink transition group-hover:text-clay">
                            {item.title}
                          </h3>
                          {item.length && (
                            <span className="rounded-full bg-panel px-2 py-0.5 text-xs font-medium text-heading">
                              {item.length}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs uppercase tracking-wide text-ink/50">
                          {item.source}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-ink/75">
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
          <div className="mt-16 rounded-xl bg-panel p-8 text-center">
            <p className="text-ink/80">
              Found a link that's gone stale, or have something we should add?
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-block font-semibold text-clay transition hover:text-ink"
            >
              Tell us and we'll fix it →
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
