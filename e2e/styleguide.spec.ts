import { expect, test } from "@playwright/test";
import { axeViolations } from "./a11y";

test.describe("styleguide", () => {
  test("renders the tokens section with no WCAG A/AA violations", async ({ page }) => {
    await page.goto("/styleguide");
    await expect(page.getByRole("heading", { level: 1, name: "Styleguide" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Tokens" })).toBeVisible();
    // Every contrast row printed a numeric ratio (tokens resolved at build time).
    await expect(page.getByRole("cell", { name: /^\d+\.\d{2}:1$/ }).first()).toBeVisible();
    expect(await axeViolations(page, "#tokens")).toEqual([]);
  });

  test("every semantic color token exists as a CSS variable at runtime", async ({ page }) => {
    await page.goto("/styleguide");
    const missing = await page.evaluate(() => {
      const names = [
        "surface", "surface-muted", "surface-inverse", "ink", "ink-soft", "muted", "on-inverse",
        "on-inverse-muted", "line", "input", "action", "action-hover", "focus", "focus-inverse",
        "success", "warning", "danger", "info", "success-subtle", "warning-subtle", "danger-subtle",
        "info-subtle", "tone-public", "tone-public-ink", "tone-volunteer", "tone-volunteer-ink",
        "tone-neutral", "tone-neutral-ink", "tone-danger", "tone-danger-ink", "hero-tint", "scrim",
      ];
      const style = getComputedStyle(document.documentElement);
      return names.filter((n) => style.getPropertyValue(`--color-${n}`).trim() === "");
    });
    expect(missing).toEqual([]);
  });

  test("uses the self-hosted brand fonts", async ({ page }) => {
    await page.goto("/styleguide");
    const heading = await page
      .getByRole("heading", { level: 1, name: "Styleguide" })
      .evaluate((el) => getComputedStyle(el).fontFamily);
    const body = await page.locator("body").evaluate((el) => getComputedStyle(el).fontFamily);
    // next/font hashes the family name, e.g. "__Urbanist_1a2b3c", "Urbanist Fallback".
    expect(heading).toMatch(/Urbanist/);
    expect(body).toMatch(/Inter/);
  });
});
