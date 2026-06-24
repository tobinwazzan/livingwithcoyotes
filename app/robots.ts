import type { MetadataRoute } from "next";

// Welcome all crawlers — including AI assistants (GPTBot, ClaudeBot,
// PerplexityBot, Google-Extended, etc.) — so the Council's evidence-based
// guidance can be found, cited, and accurately represented.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://livingwithcoyotes.org/sitemap.xml",
    host: "https://livingwithcoyotes.org",
  };
}
