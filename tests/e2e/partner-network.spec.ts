import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("partner landing page has unique canonical, headings, and FAQ structured data", async ({ page }) => {
  const response = await page.goto("/partners", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1").first()).toContainText("Refer. Build.");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://rrrtx-systems.com/partners");
  expect(await page.locator('#schema-partner-faq').innerHTML()).toContain("FAQPage");
});

test("partner application page renders and is indexable", async ({ page }) => {
  const response = await page.goto("/partners/apply", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1").first()).toContainText("Tell us who you are");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://rrrtx-systems.com/partners/apply");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index, follow/);
});

test("partner portal is protected and noindexed", async ({ page }) => {
  await page.goto("/partner/dashboard", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/partner\/login/);

  const loginResponse = await page.goto("/partner/login", { waitUntil: "domcontentloaded" });
  expect(loginResponse?.headers()["x-robots-tag"]).toContain("noindex");
  await expect(page.locator("h1").first()).toContainText("Partner Login");
});

test("unknown certificate verification returns 404", async ({ page }) => {
  const response = await page.goto("/verify/RRRTX-CERT-9999-9999", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(404);
});

test("partner landing page has no serious accessibility violations", async ({ page }) => {
  await page.goto("/partners", { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""));
  expect(serious, `violations: ${serious.map((v) => v.id).join(", ")}`).toEqual([]);
});
