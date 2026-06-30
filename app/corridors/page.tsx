import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Habitat & Movement Corridors",
  description:
    "Where Orange County stays open, and how coyotes move through it — the hills and canyons, the green flood-control corridors, and the routes that thread into every neighborhood. An early, illustrative map.",
};

function Swatch({ color, dashed }: { color: string; dashed?: boolean }) {
  return dashed ? (
    <span className="inline-block h-0 w-5 align-middle" style={{ borderTop: `2px dashed ${color}` }} />
  ) : (
    <span className="inline-block h-3 w-4 rounded-sm align-middle" style={{ background: color }} />
  );
}

export default function CorridorsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Habitat & corridors"
        title="The land they move through"
        subtitle="Coyotes follow the land. They travel the county's open space and its green channels — out of the hills and canyons, along the flood-control creeks, into and back out of every neighborhood. This map shows that connective tissue."
      />

      <section className="mx-auto max-w-3xl px-6 py-14">
        {/* The map */}
        <Reveal>
          <figure className="overflow-hidden rounded-2xl border border-line/20 bg-dusk p-4 sm:p-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/coyote-cities-corridors.svg"
              alt="Map of Orange County: all 34 cities labelled, major open spaces in green italic, and the flood-control corridor network — soft-bottom channels as bright living corridors, concrete channels dim and dashed."
              className="block w-full rounded-xl"
            />
            <figcaption className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-sand/75">
              <span className="inline-flex items-center gap-2"><b className="font-bold text-sand">Aa</b> Cities</span>
              <span className="inline-flex items-center gap-2"><i className="text-[#9ed070]">Aa</i> Parks &amp; open space</span>
              <span className="inline-flex items-center gap-2"><i className="text-[#cfd8b8]">Aa</i> Unincorporated community</span>
              <span className="inline-flex items-center gap-2"><Swatch color="#9bd17a" /> Living corridors (soft-bottom)</span>
              <span className="inline-flex items-center gap-2"><Swatch color="#b3a07d" dashed /> Hardened channels (concrete)</span>
            </figcaption>
          </figure>
        </Reveal>

        {/* How to read it */}
        <Reveal>
          <div className="mt-12">
            <h2 className="text-xl font-bold text-heading">How to read it</h2>
            <ul className="mt-4 space-y-3 text-ink/80">
              <li>
                <span className="font-semibold text-heading">Open &amp; natural land</span> — the hills,
                canyons, wetlands, and coast where coyotes den, rest, and raise young. Crystal Cove,
                Laguna Coast, Chino Hills, Caspers, the Santa Ana Mountains, and more.
              </li>
              <li>
                <span className="font-semibold text-heading">Living corridors</span> — the bright green
                lines are soft-bottom creeks and channels. With water and cover, these are the routes
                coyotes actually travel between the open land and the neighborhoods.
              </li>
              <li>
                <span className="font-semibold text-heading">Hardened channels</span> — the dim dashed
                lines are concrete-lined channels. Still travel routes, but with little cover. Most of
                the county&apos;s network is engineered this way.
              </li>
            </ul>
            <p className="mt-4 text-ink/80">
              Read together, they tell a simple story: a coyote in a Santa Ana or Garden Grove
              neighborhood didn&apos;t appear from nowhere. It followed a green line in from the edge.
              Coexistence works best as one county-wide effort, because the land connects us all.
            </p>
          </div>
        </Reveal>

        {/* Pup season */}
        <Reveal>
          <div className="mt-10 rounded-2xl border border-line/20 bg-card/60 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-clay">A note on spring</p>
            <h2 className="mt-2 text-lg font-bold text-heading">March through May is pup season</h2>
            <p className="mt-3 text-ink/80">
              Pups are born roughly March through May. Near a den, parents grow more watchful for a
              few weeks. A coyote that follows a walker or holds its ground is usually escorting you
              away from pups nearby — not hunting. Give the area room, keep dogs leashed, and it
              passes as the pups grow.
            </p>
          </div>
        </Reveal>

        {/* What helps */}
        <Reveal>
          <div className="mt-10">
            <h2 className="text-xl font-bold text-heading">What helps, wherever you are</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "Keep pets leashed and close, especially near the green corridors and in spring.",
                "Pick up fallen fruit, secure trash, and feed pets indoors — the routes lead to food.",
                "Walk in pairs at dawn and dusk, when coyotes move most.",
                "If one lingers, make yourself big and loud until it moves on. Then let it go.",
              ].map((t) => (
                <li key={t} className="rounded-xl border border-line/15 bg-card/40 px-4 py-3 text-sm text-ink/80">
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink/65">
              More in the{" "}
              <Link href="/faq" className="font-semibold text-clay hover:text-ink">Coyote Q&amp;A</Link>{" "}
              and the{" "}
              <Link href="/resources" className="font-semibold text-clay hover:text-ink">resources</Link>.
              Seen one? You can{" "}
              <Link href="/report" className="font-semibold text-clay hover:text-ink">report a sighting</Link>.
            </p>
          </div>
        </Reveal>

        {/* Honest disclaimer */}
        <Reveal>
          <div className="mt-12 rounded-2xl border border-line/20 bg-panel p-6 text-sm leading-relaxed text-ink/70">
            <p className="font-semibold text-heading">How this map was made — and its limits</p>
            <p className="mt-3">
              This is an early, illustrative map, built with AI assistance by residents — not by
              surveyors or wildlife biologists. The open land is drawn from county boundaries; the
              corridors are the real flood-control network; the soft glows suggest where movement
              tends to concentrate. It shows <strong>habitat and travel routes — not den locations</strong>,
              and coyotes use the whole county, including places not shaded here.
            </p>
            <p className="mt-3">
              Treat it as a starting point, and verify anything that matters to a decision. We&apos;ll
              sharpen it over time with better habitat data and what neighbors report.
            </p>
            <p className="mt-3 text-xs text-ink/55">
              Sources: Orange County Open GIS Data Portal (city boundaries, flood-control channels) ·
              US Census TIGER (ZIP areas) · USGS / MRLC NLCD land cover.
            </p>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
