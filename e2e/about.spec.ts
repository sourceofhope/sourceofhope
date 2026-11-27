import { expect, test } from "@playwright/test";
import { axeViolations } from "./a11y";

/* Slice 3.4: Our Story, Team and profiles, Awards (spec §10.5–10.7). */
test.describe("about", () => {
  for (const [path, h1] of [["/about", "Our Story"], ["/about/team", "Our team"], ["/media/awards", "Awards & Recognition"]] as const) {
    test(`${path}: one h1 and no WCAG A/AA violations`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
      expect(await axeViolations(page)).toEqual([]);
    });
  }

  test("team is a grid of profiles, and a profile has one h1 and a back link", async ({ page }) => {
    await page.goto("/about/team");
    const first = page.getByRole("main").getByRole("listitem").getByRole("link").first();
    test.skip((await first.count()) === 0, "no team content in this dataset");
    const name = (await first.textContent())!.trim();
    await first.click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
    await expect(page.getByRole("link", { name: "All team members" })).toHaveAttribute("href", "/about/team");
    expect(await axeViolations(page)).toEqual([]);
  });

  test("an unknown profile is a 404", async ({ request }) => {
    expect((await request.get("/about/team/no-such-person")).status()).toBe(404);
  });
});
