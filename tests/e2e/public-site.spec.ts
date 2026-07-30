import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const publicRoutes = [
  "/", "/about", "/services", "/services/ecommerce", "/work", "/process",
  "/pricing", "/blog", "/resources", "/audit", "/roi", "/contact", "/faq", "/open-source", "/search",
];

test("public routes retain unique canonicals, headings, and social metadata", async ({ page }) => {
  for (const route of publicRoutes) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1").first(), route).toBeVisible();
    await expect(page.locator('link[rel="canonical"]'), route).toHaveAttribute(
      "href",
      `https://rrrtx-systems.com${route === "/" ? "" : route}`
    );
    await expect(page.locator('meta[property="og:image"]'), route).toHaveAttribute("content", /^https:\/\/rrrtx-systems\.com\/assets\//);
  }
});

test("service metadata and status behavior are correct", async ({ page }) => {
  await page.goto("/services/ecommerce");
  await expect(page).toHaveTitle(/Custom Ecommerce \| RRRTX SYSTEMS/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index, follow/);
  const missing = await page.goto("/services/not-a-real-service");
  expect(missing?.status()).toBe(404);
});

test("legacy dashboard cookie cannot authenticate", async ({ context, page }) => {
  await context.addCookies([{ name: "rrrtx_session", value: "authenticated", domain: "127.0.0.1", path: "/" }]);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dashboard\/login/);
});

test("key public experiences have no serious accessibility violations", async ({ page }) => {
  for (const route of ["/", "/services/ecommerce", "/contact", "/resources"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""));
    expect(serious, `${route}: ${serious.map((item) => item.id).join(", ")}`).toEqual([]);
  }
});

test("authenticated dashboard surfaces have no serious accessibility violations", async ({ context, page, request }) => {
  const login = await request.post("/api/auth/login", {
    headers: { Origin: "https://rrrtx-systems.com" },
    data: { email: "admin@example.com", password: "e2e-password-12345" },
  });
  expect(login.status()).toBe(200);
  const match = login.headers()["set-cookie"]?.match(/rrrtx_session=([^;]+)/);
  expect(match?.[1]).toBeTruthy();
  await context.addCookies([{ name: "rrrtx_session", value: match![1], domain: "127.0.0.1", path: "/" }]);

  for (const route of ["/dashboard", "/dashboard/leads", "/dashboard/services", "/dashboard/posts", "/dashboard/settings"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""));
    expect(serious, `${route}: ${serious.map((item) => item.id).join(", ")}`).toEqual([]);
  }

  const editorRoutes = [
    ["/dashboard/services", "Add Service"],
    ["/dashboard/posts", "Create Post"],
    ["/dashboard/resources", "Add Resource"],
    ["/dashboard/pricing", "Add Tier"],
    ["/dashboard/projects", "Add Project"],
    ["/dashboard/team", "Add Member"],
    ["/dashboard/testimonials", "Add Testimonial"],
  ] as const;
  for (const [route, buttonName] of editorRoutes) {
    await page.goto(route, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: buttonName }).click();
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""));
    expect(serious, `${route} editor: ${serious.map((item) => item.id).join(", ")}`).toEqual([]);
  }

  const update = await request.post("/api/settings", {
    headers: { Origin: "https://rrrtx-systems.com", Cookie: `rrrtx_session=${match![1]}` },
    data: { hero_title: "E2E Verified,Homepage Revalidation" },
  });
  expect(update.status()).toBe(200);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("h1")).toContainText("E2E Verified");
});
