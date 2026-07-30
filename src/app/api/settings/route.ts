import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";
import { NextResponse } from "next/server";
import { getAuthenticatedSession, requireAuth } from "@/lib/auth-check";
import { isSafePublicUrl, isValidEmail, readJsonBody } from "@/lib/request-security";
import { revalidatePath } from "next/cache";

const PUBLIC_KEYS = new Set(["contact_email", "social_profiles", "navbar_links", "footer_services_links", "footer_company_links"]);
const EDITABLE_KEYS = new Set([
  ...PUBLIC_KEYS, "hero_title", "hero_subtitle", "hero_cta_text", "hero_cta_link",
  "problem_title", "problem_desc", "problem_bullets", "trusted_integrations",
  "homepage_stats", "homepage_stats_verified", "tech_stack", "about_heading",
  "about_description", "chatbot_enabled", "chatbot_name", "chatbot_welcome",
  "chatbot_about", "chatbot_contact_cta",
]);
const ARRAY_SETTINGS = new Set([
  "social_profiles", "navbar_links", "footer_services_links", "footer_company_links",
  "problem_bullets", "trusted_integrations", "homepage_stats", "tech_stack",
]);

type LinkValue = { label?: unknown; href?: unknown; children?: unknown };
function validLinks(value: unknown, depth = 0): boolean {
  if (!Array.isArray(value) || depth > 2) return false;
  return value.every((item) => {
    if (!item || typeof item !== "object") return false;
    const link = item as LinkValue;
    if (typeof link.label !== "string" || link.label.trim().length === 0 || !isSafePublicUrl(link.href)) return false;
    return link.children === undefined || validLinks(link.children, depth + 1);
  });
}

function validateSetting(key: string, valueString: string): boolean {
  if (valueString.length > 20_000) return false;
  if (key === "contact_email") return isValidEmail(valueString.trim());
  if (key === "hero_cta_link") return isSafePublicUrl(valueString.trim());
  if (key === "chatbot_enabled" || key === "homepage_stats_verified") return valueString === "true" || valueString === "false";
  if (!ARRAY_SETTINGS.has(key)) return true;
  try {
    const value: unknown = JSON.parse(valueString);
    if (["navbar_links", "footer_services_links", "footer_company_links"].includes(key)) return validLinks(value);
    if (key === "social_profiles") {
      return Array.isArray(value) && value.every((item) => item && typeof item === "object" && typeof (item as { platform?: unknown }).platform === "string" && isSafePublicUrl((item as { url?: unknown }).url));
    }
    return Array.isArray(value);
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const session = await getAuthenticatedSession();
    const rows = await db.select().from(siteSettings);
    const settings: Record<string, string | null> = {};
    for (const row of rows) {
      if (session?.role === "admin" || PUBLIC_KEYS.has(row.key)) settings[row.key] = row.value;
    }
    return NextResponse.json(settings, {
      headers: session ? { "Cache-Control": "private, no-store" } : { "Cache-Control": "public, max-age=60, s-maxage=300" },
    });
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;
  try {
    const body = await readJsonBody<Record<string, unknown>>(request, 96_000);
    if (!body) return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
    const entries = Object.entries(body);
    if (!entries.length || entries.some(([key]) => !EDITABLE_KEYS.has(key))) {
      return NextResponse.json({ error: "One or more settings cannot be updated." }, { status: 400 });
    }

    for (const [key, value] of entries) {
      const valueString = typeof value === "string" ? value : JSON.stringify(value);
      if (!validateSetting(key, valueString)) {
        return NextResponse.json({ error: `Setting ${key} has an invalid value.` }, { status: 400 });
      }
      await db.insert(siteSettings).values({ key, value: valueString, updatedAt: new Date() }).onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: valueString, updatedAt: new Date() },
      });
    }
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
