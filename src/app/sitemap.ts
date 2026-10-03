import type { MetadataRoute } from "next";
import { FESTIVAL_INFO, festivalPath } from "@/lib/festivals";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/calendar`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/app`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    ...FESTIVAL_INFO.map((festival) => ({
      url: `${SITE_URL}${festivalPath(festival)}`,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];
}
