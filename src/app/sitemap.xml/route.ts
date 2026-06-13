import { db } from "@/lib/db";
import { services, projects } from "@/lib/schema";
import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = SITE_URL;
  const today = new Date().toISOString().split("T")[0];

  const staticPages = [
    { url: `${baseUrl}/`, changefreq: "weekly", priority: 1.0, lastmod: today },
    { url: `${baseUrl}/work`, changefreq: "weekly", priority: 0.8, lastmod: today },
    { url: `${baseUrl}/services`, changefreq: "weekly", priority: 0.9, lastmod: today },
    { url: `${baseUrl}/process`, changefreq: "monthly", priority: 0.7, lastmod: today },
    { url: `${baseUrl}/pricing`, changefreq: "monthly", priority: 0.8, lastmod: today },
    { url: `${baseUrl}/about`, changefreq: "monthly", priority: 0.6, lastmod: today },
    { url: `${baseUrl}/contact`, changefreq: "monthly", priority: 0.9, lastmod: today },
    { url: `${baseUrl}/privacy`, changefreq: "yearly", priority: 0.3, lastmod: today },
    { url: `${baseUrl}/terms`, changefreq: "yearly", priority: 0.3, lastmod: today },
  ];

  let servicePages: { url: string; changefreq: string; priority: number; lastmod: string }[] = [];
  let projectPages: { url: string; changefreq: string; priority: number; lastmod: string }[] = [];

  try {
    const allServices = await db.select().from(services);
    servicePages = allServices.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      changefreq: "monthly",
      priority: 0.7,
      lastmod: today,
    }));

    const allProjects = await db.select().from(projects);
    projectPages = allProjects.map((p) => ({
      url: `${baseUrl}/work/${p.slug}`,
      changefreq: "monthly",
      priority: 0.6,
      lastmod: today,
    }));
  } catch (e) {
    console.error("Sitemap DB fetch failed, using static pages only:", e);
  }

  const allPages = [...staticPages, ...servicePages, ...projectPages];

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
}
