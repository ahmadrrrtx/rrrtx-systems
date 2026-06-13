import { db } from "./db";
import { services, projects, pricingTiers, testimonials, teamMembers, contentPages } from "./schema";
import { eq, and, asc } from "drizzle-orm";

/**
 * Safe, server-side data fetchers for the PUBLIC site.
 *
 * Every function is wrapped in try/catch and returns an empty array on error.
 * This guarantees the public site (and the production build) never crashes if a
 * table is missing, the DB is briefly unreachable, or migrations are pending.
 *
 * Callers should fall back to their existing hardcoded defaults when these
 * return an empty array, so the design never regresses.
 */

export type DbService = typeof services.$inferSelect;
export type DbProject = typeof projects.$inferSelect;
export type DbPricingTier = typeof pricingTiers.$inferSelect;
export type DbTestimonial = typeof testimonials.$inferSelect;
export type DbTeamMember = typeof teamMembers.$inferSelect;

export async function getPublicServices(opts?: { primaryOnly?: boolean }): Promise<DbService[]> {
  try {
    const rows = await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.sortOrder));
    return opts?.primaryOnly ? rows.filter((s) => s.isPrimary) : rows;
  } catch (error) {
    console.error("getPublicServices error:", error);
    return [];
  }
}

export async function getPublicProjects(opts?: { featuredOnly?: boolean }): Promise<DbProject[]> {
  try {
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.status, "published"))
      .orderBy(asc(projects.sortOrder));
    return opts?.featuredOnly ? rows.filter((p) => p.featured) : rows;
  } catch (error) {
    console.error("getPublicProjects error:", error);
    return [];
  }
}

export async function getPublicPricing(): Promise<DbPricingTier[]> {
  try {
    return await db
      .select()
      .from(pricingTiers)
      .where(eq(pricingTiers.isActive, true))
      .orderBy(asc(pricingTiers.sortOrder));
  } catch (error) {
    console.error("getPublicPricing error:", error);
    return [];
  }
}

export async function getFeaturedTestimonials(): Promise<DbTestimonial[]> {
  try {
    return await db
      .select()
      .from(testimonials)
      .where(and(eq(testimonials.isActive, true), eq(testimonials.featured, true)))
      .orderBy(asc(testimonials.sortOrder));
  } catch (error) {
    console.error("getFeaturedTestimonials error:", error);
    return [];
  }
}

export async function getPublicTestimonials(): Promise<DbTestimonial[]> {
  try {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isActive, true))
      .orderBy(asc(testimonials.sortOrder));
  } catch (error) {
    console.error("getPublicTestimonials error:", error);
    return [];
  }
}

export type DbContentPage = typeof contentPages.$inferSelect;

export async function getContentPage(slug: string): Promise<DbContentPage | null> {
  try {
    const rows = await db
      .select()
      .from(contentPages)
      .where(eq(contentPages.slug, slug))
      .limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error("getContentPage error:", error);
    return null;
  }
}

export async function getPublicTeam(): Promise<DbTeamMember[]> {
  try {
    return await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.isActive, true))
      .orderBy(asc(teamMembers.sortOrder));
  } catch (error) {
    console.error("getPublicTeam error:", error);
    return [];
  }
}
