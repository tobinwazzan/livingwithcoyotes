import { PLATFORM_LABELS, isPortrait, type ParsedVideo } from "@/lib/video";

export type VideoCard = {
  id: string;
  platform: ParsedVideo["platform"];
  embed_url: string | null;
  url: string;
  title: string | null;
  credit: string | null;
  city: string | null;
};

// One video tile: an inline embed where the platform allows it, otherwise a
// tidy "watch on…" card that links out. The video always stays on its original
// platform — we never re-host it.
export default function VideoEmbed({ v }: { v: VideoCard }) {
  const portrait = isPortrait(v.platform);
  const label = PLATFORM_LABELS[v.platform] ?? "the web";

  return (
    <figure className="overflow-hidden rounded-2xl border border-line/20 bg-card/60">
      {v.embed_url ? (
        <div
          className="relative w-full bg-black/5"
          style={{ aspectRatio: portrait ? "9 / 16" : "16 / 9", maxHeight: portrait ? 640 : undefined }}
        >
          <iframe
            src={v.embed_url}
            title={v.title ?? `Video on ${label}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
          />
        </div>
      ) : (
        <a
          href={v.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex aspect-video items-center justify-center bg-panel/60 text-center transition hover:bg-panel"
        >
          <span className="px-6">
            <span className="block text-sm font-semibold text-heading">Watch on {label} ↗</span>
            <span className="mt-1 block text-xs text-ink/60">Opens on the original platform</span>
          </span>
        </a>
      )}

      <figcaption className="p-4">
        {v.title && <p className="font-semibold leading-snug text-heading">{v.title}</p>}
        <p className="mt-1 text-xs text-ink/60">
          {v.credit ? <>Shared by {v.credit}</> : <>Source: {label}</>}
          {v.city ? <> · {v.city}</> : null}
        </p>
      </figcaption>
    </figure>
  );
}
