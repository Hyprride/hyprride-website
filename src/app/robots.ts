import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /admin/login is publicly reachable (the middleware lets it through so
    // admins can sign in), so keep the whole admin area and the API routes out
    // of the index and out of crawl budget.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
