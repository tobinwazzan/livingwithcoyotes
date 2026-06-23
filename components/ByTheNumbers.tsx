import Reveal from "@/components/Reveal";
import { STATS, STATS_SOURCE, STATS_CAVEAT } from "@/content/stats";

export default function ByTheNumbers() {
  return (
    <section className="relative overflow-hidden bg-dusk py-16 text-sand sm:py-20">
      {/* Soft moss glow to tie the band to the home hero and interior headers */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 0%, rgba(90,107,74,0.40), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-clay">
            What the neighbors are saying
          </p>
          <h2 className="mt-3 text-center text-2xl font-bold sm:text-3xl">
            By the numbers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sand/75">
            We read the public conversation so we could meet it honestly. Here's
            what Orange County is actually talking about when it talks about
            coyotes — drawn from neighbors' own posts, in aggregate.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 70} className="h-full">
              <div className="flex h-full flex-col rounded-xl border border-sand/15 bg-sand/5 p-5 sm:p-6">
                <div className="text-2xl font-extrabold leading-tight text-clay sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm font-semibold text-sand sm:text-base">
                  {stat.label}
                </div>
                {stat.sub && (
                  <p className="mt-2 text-xs leading-relaxed text-sand/65 sm:text-sm">
                    {stat.sub}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-sand/55">
            {STATS_SOURCE} {STATS_CAVEAT}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
