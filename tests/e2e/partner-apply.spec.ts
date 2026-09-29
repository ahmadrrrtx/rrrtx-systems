import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Regression coverage for the partner application workflow.
 *
 * The bug this guards against: validation failures used to consume the same
 * one-per-hour allowance as successful submissions, so an applicant who simply
 * mistyped a field a few times was locked out with "Too many requests" and
 * could never submit. Each test uses a distinct synthetic client IP so the
 * assertions do not depend on — and do not interfere with — the rest of the
 * suite sharing one rate-limit bucket.
 */

const ENDPOINT = "/api/partner/apply";

/**
 * Unique per test run. Playwright runs this file once per project against the
 * same server and database, so fixed emails would look like duplicate
 * submissions on the second pass and change the expected response.
 */
const RUN_ID = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Minimal payload that passes every server-side rule. */
/** Stable-per-run fourth octet, unique per test within the run. */
function ipSuffix(index: number) {
  let hash = 0;
  for (const ch of RUN_ID) hash = (hash * 31 + ch.charCodeAt(0)) % 200;
  return ((hash + index * 7) % 200) + 10;
}

function validPayload(suffix: string) {
  return {
    name: `Regression Applicant ${suffix}`,
    email: `regression-${RUN_ID}-${suffix}@example.com`,
    country: "Pakistan",
    role: "Consultant",
    company: "Test Co",
    website: "https://example.com",
    linkedin: "https://www.linkedin.com/in/example",
    experience: "Eight years of B2B consulting across the region.",
    referralBackground: "Ecommerce brands and B2B SaaS companies in the Gulf region.",
    whyPartner: "Your engineering-led custom builds fit the exact gap my clients keep describing.",
    howRefer: "Warm introductions through my consulting network and quarterly founder events.",
    hpot: "",
  };
}

test.describe("partner application submission", () => {
  test("repeated validation failures never exhaust the submission allowance", async ({ request }) => {
    // Simulates an applicant repeatedly making a mistake — the exact scenario
    // that previously returned HTTP 429 and made the form look broken.
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const response = await request.post(ENDPOINT, {
        headers: { "cf-connecting-ip": `198.51.100.${ipSuffix(1)}` },
        data: { name: "", email: "not-an-email", country: "" },
      });
      expect(
        response.status(),
        `attempt ${attempt + 1} should be a validation error, not a rate limit`
      ).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("required");
    }

    // And the applicant can still submit successfully afterwards.
    const success = await request.post(ENDPOINT, {
      headers: { "cf-connecting-ip": `198.51.100.${ipSuffix(1)}` },
      data: validPayload("after-errors"),
    });
    expect(success.status()).toBe(201);
    const successBody = await success.json();
    expect(successBody.success).toBe(true);
  });

  test("a valid application is stored and returns a real identifier", async ({ request }) => {
    const response = await request.post(ENDPOINT, {
      headers: { "cf-connecting-ip": `198.51.100.${ipSuffix(2)}` },
      data: validPayload("stored"),
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    // A genuine identifier, not the honeypot placeholder.
    expect(body.applicationId).toMatch(/^RRRTX-APP-\d{4}-\d{4}$/);
    expect(body.applicationId).not.toBe("RRRTX-APP-0000");
  });

  test("short narrative answers are rejected with an actionable message", async ({ request }) => {
    const response = await request.post(ENDPOINT, {
      headers: { "cf-connecting-ip": `198.51.100.${ipSuffix(3)}` },
      data: { ...validPayload("short"), whyPartner: "Too short", howRefer: "Also short" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("20 characters");
    // Identifies which field to fix so the UI can highlight it.
    expect(["whyPartner", "howRefer"]).toContain(body.field);
  });

  test("a double submission returns the existing identifier instead of a duplicate", async ({
    request,
  }) => {
    const headers = { "cf-connecting-ip": `198.51.100.${ipSuffix(4)}` };
    const payload = validPayload("duplicate");

    const first = await request.post(ENDPOINT, { headers, data: payload });
    expect(first.status()).toBe(201);
    const firstBody = await first.json();

    const second = await request.post(ENDPOINT, { headers, data: payload });
    expect(second.status()).toBe(200);
    const secondBody = await second.json();

    expect(secondBody.applicationId).toBe(firstBody.applicationId);
    expect(secondBody.duplicate).toBe(true);
  });

  test("the form blocks short answers client-side and keeps the applicant's input", async ({
    page,
  }) => {
    await page.goto("/partners/apply", { waitUntil: "domcontentloaded" });

    await page.getByLabel("Full name").fill(`Inline Validation ${RUN_ID}`);
    await page.getByLabel("Email").fill(`inline-${RUN_ID}@example.com`);
    await page.getByLabel("Country").fill("Pakistan");
    await page
      .getByLabel("Who could you refer? Describe the kinds of businesses you would introduce.")
      .fill("Ecommerce brands and B2B agencies in the region.");
    await page.getByLabel("Why do you want to partner with RRRTX?").fill("Short");
    await page
      .getByLabel("How would you refer opportunities?")
      .fill("Through my consulting network and founder events.");

    await page.getByRole("button", { name: "Submit Application" }).click();

    // Still on the form, an error is announced, and nothing was lost.
    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(page.getByLabel("Full name")).toHaveValue(`Inline Validation ${RUN_ID}`);
    await expect(page.getByLabel("Why do you want to partner with RRRTX?")).toHaveValue("Short");
    await expect(page.getByRole("heading", { name: "Application received" })).toHaveCount(0);

    // Correcting the answer lets the same page submit successfully.
    await page
      .getByLabel("Why do you want to partner with RRRTX?")
      .fill("Your engineering-led custom builds fit the gap my clients describe.");
    await page.getByRole("button", { name: "Submit Application" }).click();

    await expect(page.getByRole("heading", { name: "Application received" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("p.font-mono")).toContainText(/RRRTX-APP-\d{4}-\d{4}/);
  });

  test("partner application page has no serious accessibility violations", async ({ page }) => {
    await page.goto("/partners/apply", { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact || "")
    );
    expect(serious, `violations: ${serious.map((v) => v.id).join(", ")}`).toEqual([]);
  });
});
