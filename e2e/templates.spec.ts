import { expect, test } from "@playwright/test";
import { axeViolations } from "./a11y";

/* Slice 1.5: every page template, as a whole page, on desktop and phone. */

const TEMPLATES = ["landing", "content", "program", "listing", "detail", "utility"];

test.describe("page templates", () => {
  test('the styleguide "templates" section has no WCAG A/AA violations', async ({ page }) => {
    await page.goto("/styleguide#templates");
    await expect(page.locator("#templates")).toBeVisible();
    expect(await axeViolations(page, "#templates")).toEqual([]);
  });

  for (const name of TEMPLATES) {
    test(`${name}: one main, one h1, no overflow, no WCAG A/AA violations`, async ({ page }) => {
      await page.goto(`/styleguide/templates/${name}`);
      await expect(page.locator("main#main")).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      // Nothing wider than the screen at 360-412px (spec §5.3).
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      // Headings never skip a level going down (h1 → h2 → h3).
      const levels = await page.locator("main :is(h1, h2, h3, h4)").evaluateAll((els) => els.map((el) => Number(el.tagName[1])));
      levels.forEach((level, i) => {
        if (i > 0) expect(level - levels[i - 1], `heading ${i} jumps from h${levels[i - 1]} to h${level}`).toBeLessThanOrEqual(1);
      });
      expect(await axeViolations(page)).toEqual([]);
    });
  }

  test("an unknown template is a 404", async ({ page }) => {
    const response = await page.goto("/styleguide/templates/nope");
    expect(response?.status()).toBe(404);
  });
});
