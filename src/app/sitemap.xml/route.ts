import { db } from "@/lib/db";
import { services, projects } from "@/lib/schema";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = "https://rrrtx.com";

  const staticPages = [
    { url: `${baseUrl}/`, changefreq: "weekly", priority: 1.0 },
    { url: `${baseUrl}/work`, changefreq: "weekly", priority: 0.8 },
    { url: `${baseUrl}/services`, changefreq: "weekly", priority: 0.9 },
    { url: `${baseUrl}/process`, changefreq: "monthly", priority: 0.7 },
    { url: `${baseUrl}/pricing`, changefreq: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, changefreq: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, changefreq: "monthly", priority: 0.9 },
  ];

  let servicePages: { url: string; changefreq: string; priority: number }[] = [];
  let projectPages: { url: string; changefreq: string; priority: number }[] = [];

  try {
    const allServices = await db.select().from(services);
    servicePages = allServices.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      changefreq: "monthly",
      priority: 0.7,
    }));

    const allProjects = await db.select().from(projects);
    projectPages = allProjects.map((p) => ({
      url: `${baseUrl}/work/${p.slug}`,
      changefreq: "monthly",
      priority: 0.6,
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
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
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
