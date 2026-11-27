import { expect, test } from "@playwright/test";
import { axeViolations } from "./a11y";

/* Slice 3.8: Privacy Policy and Terms drafts. */
test.describe("legal pages", () => {
  for (const [path, h1] of [["/privacy", "Privacy Policy"], ["/terms", "Terms of Use"]] as const) {
    test(`${path}: one h1, marked pending review, no WCAG A/AA violations`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
      await expect(page.getByText(/draft pending review/)).toBeVisible();
      expect(await axeViolations(page)).toEqual([]);
    });
  }

  test("linked from the footer and from every form that collects personal data", async ({ page }) => {
    await page.goto("/contact");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "Privacy", exact: true })).toHaveAttribute("href", "/privacy");
    await expect(footer.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
    await expect(footer.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy");
    await expect(page.getByRole("main").getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy");
  });
});
