// Turn a pasted video URL into an embeddable form. We never re-host the video —
// it stays on the original platform; we only build the official embed URL and
// credit the source. Returns null for anything that isn't a real http(s) URL.

export type ParsedVideo = {
  platform: "youtube" | "tiktok" | "instagram" | "x" | "facebook" | "other";
  videoId: string | null;
  embedUrl: string | null; // null => no inline embed; render a "watch on…" link card
  canonicalUrl: string;
};

export const PLATFORM_LABELS: Record<ParsedVideo["platform"], string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  instagram: "Instagram",
  x: "X",
  facebook: "Facebook",
  other: "the web",
};

export function parseVideoUrl(raw: string): ParsedVideo | null {
  const url = (raw || "").trim();
  if (!/^https?:\/\//i.test(url)) return null;
  let u: URL;
  try { u = new URL(url); } catch { return null; }
  const host = u.hostname.replace(/^www\./, "").toLowerCase();

  if (host === "youtube.com" || host === "m.youtube.com") {
    const v = u.searchParams.get("v");
    const shorts = u.pathname.match(/^\/shorts\/([\w-]+)/);
    const id = v || (shorts ? shorts[1] : null);
    if (id) return { platform: "youtube", videoId: id, embedUrl: `https://www.youtube.com/embed/${id}`, canonicalUrl: url };
  }
  if (host === "youtu.be") {
    const id = u.pathname.slice(1).split("/")[0];
    if (id) return { platform: "youtube", videoId: id, embedUrl: `https://www.youtube.com/embed/${id}`, canonicalUrl: url };
  }
  if (host === "tiktok.com" || host.endsWith(".tiktok.com")) {
    const m = u.pathname.match(/\/video\/(\d+)/);
    if (m) return { platform: "tiktok", videoId: m[1], embedUrl: `https://www.tiktok.com/embed/v2/${m[1]}`, canonicalUrl: url };
    return { platform: "tiktok", videoId: null, embedUrl: null, canonicalUrl: url };
  }
  if (host === "instagram.com") {
    const m = u.pathname.match(/\/(reel|reels|p|tv)\/([\w-]+)/);
    if (m) {
      const kind = m[1] === "reels" ? "reel" : m[1];
      return { platform: "instagram", videoId: m[2], embedUrl: `https://www.instagram.com/${kind}/${m[2]}/embed`, canonicalUrl: url };
    }
  }
  if (host === "x.com" || host === "twitter.com") {
    const m = u.pathname.match(/\/status\/(\d+)/);
    if (m) return { platform: "x", videoId: m[1], embedUrl: `https://platform.twitter.com/embed/Tweet.html?id=${m[1]}`, canonicalUrl: url };
  }
  if (host === "facebook.com" || host === "fb.watch") {
    return { platform: "facebook", videoId: null, embedUrl: `https://www.facebook.com/plugins/video.php?show_text=false&href=${encodeURIComponent(url)}`, canonicalUrl: url };
  }
  return { platform: "other", videoId: null, embedUrl: null, canonicalUrl: url };
}

// Portrait-shaped platforms want a tall frame; the rest are 16:9-ish.
export function isPortrait(platform: ParsedVideo["platform"]): boolean {
  return platform === "tiktok" || platform === "instagram";
}
