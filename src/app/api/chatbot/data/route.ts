import { db } from "@/lib/db";
import { services, pricingTiers, projects, testimonials, teamMembers, posts, siteSettings } from "@/lib/schema";
import { eq, asc, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Fetch settings
    const settingsRows = await db.select().from(siteSettings);
    const settingsObj: Record<string, string | null> = {};
    settingsRows.forEach((row: any) => {
      settingsObj[row.key] = row.value;
    });

    // 2. Fetch primary services
    const servicesRows = await db
      .select({ title: services.title, slug: services.slug, shortDescription: services.shortDescription })
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.sortOrder));

    // 3. Fetch pricing
    const pricingRows = await db
      .select({ title: pricingTiers.title, startingPrice: pricingTiers.startingPrice, description: pricingTiers.description })
      .from(pricingTiers)
      .where(eq(pricingTiers.isActive, true))
      .orderBy(asc(pricingTiers.sortOrder));

    // 4. Fetch featured projects
    const projectsRows = await db
      .select({ title: projects.title, client: projects.clientName, industry: projects.industry })
      .from(projects)
      .where(eq(projects.status, "published"))
      .orderBy(asc(projects.sortOrder))
      .limit(5);

    // 5. Fetch a couple of active testimonials
    const testimonialsRows = await db
      .select({ name: testimonials.name, role: testimonials.role, quote: testimonials.quote })
      .from(testimonials)
      .where(eq(testimonials.isActive, true))
      .orderBy(asc(testimonials.sortOrder))
      .limit(3);

    // 6. Fetch team members
    const teamRows = await db
      .select({ name: teamMembers.name, role: teamMembers.role })
      .from(teamMembers)
      .where(eq(teamMembers.isActive, true))
      .orderBy(asc(teamMembers.sortOrder));

    // 7. Fetch recent blog posts
    const blogRows = await db
      .select({ title: posts.title, slug: posts.slug })
      .from(posts)
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.publishedAt))
      .limit(3);

    return NextResponse.json({
      settings: settingsObj,
      services: servicesRows,
      pricing: pricingRows,
      projects: projectsRows,
      testimonials: testimonialsRows,
      team: teamRows,
      blog: blogRows,
    });
  } catch (error) {
    console.error("Chatbot data API error:", error);
    return NextResponse.json({ error: "Failed to load chatbot data" }, { status: 500 });
  }
}
