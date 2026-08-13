import type { MetadataRoute } from "next";
import { liveWorlds } from "@/lib/brands";

const RENT_PROPERTY_SLUGS = [
  "/rent/trini-house",
  "/rent/apartamentos",
  ...Array.from({ length: 16 }, (_, i) => `/rent/apartamentos/apt-${String(i + 1).padStart(2, "0")}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://trinity-bga.vercel.app";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...liveWorlds.map((w) => ({
      url: `${base}${w.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...RENT_PROPERTY_SLUGS.map((slug) => ({
      url: `${base}${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
