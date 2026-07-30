import { NextResponse } from "next/server";
import { getPublicProjects, getPublicPosts, getPublicServices } from "@/lib/queries";
import { SITE_URL } from "@/lib/site-config";
import { serviceData } from "@/lib/service-data";

export const dynamic = "force-dynamic";

const STATIC_LAST_MODIFIED = "2026-07-30";

function toDateString(value: unknown, fallback = STATIC_LAST_MODIFIED): string {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value as string | number);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString().split("T")[0];
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function renderSitemap(entries: Array<{ url: string; lastmod: string }>) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

export async function GET() {
  const baseUrl = SITE_URL.replace(/\/$/, "");
  const staticPaths = [
    "/",
    "/work",
    "/services",
    "/process",
    "/pricing",
    "/about",
    "/blog",
    "/resources",
    "/open-source",
    "/audit",
    "/roi",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
  ];
  const staticPages = staticPaths.map((path) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastmod: STATIC_LAST_MODIFIED,
  }));

  const [services, projects, posts] = await Promise.all([
    getPublicServices(),
    getPublicProjects(),
    getPublicPosts(),
  ]);

  const servicePages = new Map(
    Object.keys(serviceData).map((slug) => [
      `${baseUrl}/services/${slug}`,
      { url: `${baseUrl}/services/${slug}`, lastmod: STATIC_LAST_MODIFIED },
    ])
  );
  for (const service of services) {
    servicePages.set(`${baseUrl}/services/${service.slug}`, {
      url: `${baseUrl}/services/${service.slug}`,
      lastmod: toDateString(service.createdAt),
    });
  }

  const entries = [
    ...staticPages,
    ...servicePages.values(),
    ...projects.map((project) => ({
      url: `${baseUrl}/work/${project.slug}`,
      lastmod: toDateString(project.createdAt),
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastmod: toDateString(post.updatedAt || post.publishedAt || post.createdAt),
    })),
  ];

  const uniqueEntries = Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());
  return new NextResponse(renderSitemap(uniqueEntries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
