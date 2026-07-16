import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    // The booking page is indexable (own metadata + canonical) and is the
    // conversion entry point, so it belongs in the sitemap.
    {
      url: `${siteConfig.url}/book`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
