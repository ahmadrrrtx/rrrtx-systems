import { NextResponse } from "next/server";
import {
  getPublicProjects,
  getPublicPosts,
  getPublicServices,
} from "@/lib/queries";
import { SITE_URL } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type SitemapEntry = {
  url: string;
  changefreq: "weekly" | "monthly" | "yearly";
  priority: number;
  lastmod: string;
};

function toDateString(value: unknown): string {
  if (!value) return new Date().toISOString().split("T")[0];
  const d = value instanceof Date ? value : new Date(value as string | number);
  return Number.isNaN(d.getTime())
    ? new Date().toISOString().split("T")[0]
    : d.toISOString().split("T")[0];
}

export async function GET() {
  const baseUrl = SITE_URL.replace(/\/$/, "");
  const today = new Date().toISOString().split("T")[0];

  const staticPages: SitemapEntry[] = [
    { url: `${baseUrl}/`, changefreq: "weekly", priority: 1.0, lastmod: today },
    { url: `${baseUrl}/work`, changefreq: "weekly", priority: 0.8, lastmod: today },
    { url: `${baseUrl}/services`, changefreq: "weekly", priority: 0.9, lastmod: today },
    { url: `${baseUrl}/process`, changefreq: "monthly", priority: 0.7, lastmod: today },
    { url: `${baseUrl}/pricing`, changefreq: "monthly", priority: 0.8, lastmod: today },
    { url: `${baseUrl}/about`, changefreq: "monthly", priority: 0.6, lastmod: today },
    { url: `${baseUrl}/blog`, changefreq: "weekly", priority: 0.7, lastmod: today },
    { url: `${baseUrl}/resources`, changefreq: "monthly", priority: 0.5, lastmod: today },
    { url: `${baseUrl}/contact`, changefreq: "monthly", priority: 0.9, lastmod: today },
    { url: `${baseUrl}/privacy`, changefreq: "yearly", priority: 0.3, lastmod: today },
    { url: `${baseUrl}/terms`, changefreq: "yearly", priority: 0.3, lastmod: today },
  ];

  try {
    const [services, projects, posts] = await Promise.all([
      getPublicServices(),
      getPublicProjects(),
      getPublicPosts(),
    ]);

    const servicePages: SitemapEntry[] = services.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      changefreq: "monthly",
      priority: 0.7,
      lastmod: today,
    }));

    const projectPages: SitemapEntry[] = projects.map((p) => ({
      url: `${baseUrl}/work/${p.slug}`,
      changefreq: "monthly",
      priority: 0.6,
      lastmod: today,
    }));

    const blogPages: SitemapEntry[] = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      changefreq: "monthly",
      priority: 0.6,
      lastmod: toDateString(post.publishedAt ?? post.createdAt),
    }));

    const allPages = [...staticPages, ...servicePages, ...projectPages, ...blogPages];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation failed:", error);

    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new NextResponse(fallbackXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
}
