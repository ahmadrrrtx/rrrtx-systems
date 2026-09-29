import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // NOTE: "/partner/" (with trailing slash) blocks the private partner portal
        // without also blocking the public /partners landing page and application form.
        disallow: ["/dashboard", "/api", "/partner/"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        // NOTE: "/partner/" (with trailing slash) blocks the private partner portal
        // without also blocking the public /partners landing page and application form.
        disallow: ["/dashboard", "/api", "/partner/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        // NOTE: "/partner/" (with trailing slash) blocks the private partner portal
        // without also blocking the public /partners landing page and application form.
        disallow: ["/dashboard", "/api", "/partner/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
