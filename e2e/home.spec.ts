import { expect, test } from "@playwright/test";
import { axeViolations } from "./a11y";

/* Slice 3.1: Home (spec §10.1). */
test.describe("home", () => {
  test("one h1, the sections in order, and no WCAG A/AA violations", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Empowering and providing hope through education, health, and wellness");
    const h2s = await page.locator("main h2").allTextContents();
    expect(h2s.slice(0, 4)).toEqual(["Our sponsors", "Our impact", "Upcoming events", "Our programs"]);
    expect(await axeViolations(page)).toEqual([]);
  });

  test("impact numbers are real values in the server HTML (no count-up)", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).toContain("353,000+");
    expect(html).toContain("Free meals served");
  });

  test("links to all five programs and opens the Hub from the hero", async ({ page }) => {
    await page.goto("/");
    const programs = page.getByRole("region", { name: "Our programs" }).getByRole("listitem").getByRole("link");
    await expect(programs).toHaveCount(5);
    await expect(page.getByRole("main").getByRole("link", { name: "Give" }).first()).toHaveAttribute("href", "/?action=give");
  });

  test("the header is transparent over the hero, then solid", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    await expect(header).toHaveAttribute("data-transparent");
    await page.mouse.wheel(0, 900);
    await expect(header).not.toHaveAttribute("data-transparent");
  });
});
