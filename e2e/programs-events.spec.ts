import { expect, test } from "@playwright/test";
import { axeViolations } from "./a11y";

/* Slices 3.2 and 3.3: Programs and Events (spec §10.2–10.4). */
const PROGRAMS = ["servingHope", "educationHope", "wellnessHope", "outdoorHope", "internationalHope"];

test.describe("programs", () => {
  test("the index lists five programs, one h1, no WCAG A/AA violations", async ({ page }) => {
    await page.goto("/programs");
    await expect(page.getByRole("heading", { level: 1, name: "Our programs" })).toBeVisible();
    await expect(page.getByRole("main").getByRole("listitem").getByRole("link")).toHaveCount(5);
    expect(await axeViolations(page)).toEqual([]);
  });

  for (const key of PROGRAMS) {
    test(`${key}: one h1, sections in order, Hub links carry the program`, async ({ page }) => {
      await page.goto(`/programs/${key}`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      const h2s = await page.locator("main h2").allTextContents();
      expect(h2s[0]).toBe("What it is");
      expect(h2s).toContain("Upcoming events");
      expect(h2s).toContain("How to help");
      await expect(page.getByRole("link", { name: "Give to this program" }).first()).toHaveAttribute("href", `/programs/${key}?action=give&designation=${key}`);
      expect(await axeViolations(page)).toEqual([]);
    });
  }

  test("an unknown program is a 404", async ({ request }) => {
    expect((await request.get("/programs/notAProgram")).status()).toBe(404);
  });
});

test.describe("events", () => {
  test("one h1, filters as links with the current one marked, no WCAG A/AA violations", async ({ page }) => {
    await page.goto("/events");
    await expect(page.getByRole("heading", { level: 1, name: "Events" })).toBeVisible();
    const filters = page.getByRole("navigation", { name: "Show events" });
    await expect(filters.getByRole("link", { name: "All" })).toHaveAttribute("aria-current", "page");
    await filters.getByRole("link", { name: "Volunteer" }).click();
    await expect(page).toHaveURL(/\/events\?show=volunteer$/);
    await expect(filters.getByRole("link", { name: "Volunteer" })).toHaveAttribute("aria-current", "page");
    expect(await axeViolations(page)).toEqual([]);
  });

  test("the old volunteer agreement PDFs are gone", async ({ page }) => {
    await page.goto("/events");
    await expect(page.locator('a[href$=".pdf"]')).toHaveCount(0);
  });
});
