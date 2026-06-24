import type { MetadataRoute } from "next";

const BASE = "https://livingwithcoyotes.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/charter", priority: 0.8 },
    { path: "/membership", priority: 0.8 },
    { path: "/resources", priority: 0.8 },
    { path: "/faq", priority: 0.8 },
    { path: "/checklist", priority: 0.7 },
    { path: "/contact", priority: 0.6 },
    { path: "/join", priority: 0.9 },
  ];
  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: r.priority,
  }));
}
