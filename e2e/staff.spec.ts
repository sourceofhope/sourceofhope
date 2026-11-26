import { expect, test } from "@playwright/test";
import { axeViolations } from "./a11y";

/*
 * Slice 2.2: the Staff Portal is closed to anyone not signed in. The full
 * sign-in flow (invite, magic link, TOTP, deactivation) needs the local
 * Supabase stack: scripts/verify-staff-auth.mjs.
 */
test.describe("staff portal, signed out", () => {
  for (const path of ["/staff", "/staff/security"]) {
    test(`${path} sends signed-out visitors to sign-in`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/staff\/sign-in$/);
      await expect(page.getByRole("heading", { level: 1, name: "Staff sign-in" })).toBeVisible();
    });
  }

  test("sign-in has one h1, no WCAG A/AA violations, and isn't indexed", async ({ page }) => {
    const response = await page.goto("/staff/sign-in");
    expect(response?.headers()["x-robots-tag"]).toContain("noindex");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    expect(await axeViolations(page)).toEqual([]);
  });

  test("a bad sign-in link explains itself", async ({ page }) => {
    await page.goto("/staff/auth/confirm?token_hash=nope&type=magiclink");
    await expect(page).toHaveURL(/\/staff\/sign-in\?error=link$/);
    await expect(page.getByText(/That sign-in link didn't work/)).toBeVisible();
  });
});
