import type { MetadataRoute } from "next";
import { liveWorlds } from "@/lib/brands";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://trinity-bga.vercel.app";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...liveWorlds.map((w) => ({
      url: `${base}${w.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
