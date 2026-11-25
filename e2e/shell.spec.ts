import { expect, test, type Page } from "@playwright/test";
import { axeViolations } from "./a11y";

/*
 * Slice 1.6: the site shell. A real 404 shows the solid header on every
 * page; /styleguide/shell shows the homepage's overlay header.
 */

const NOT_FOUND = "/this-page-does-not-exist";

/**
 * Is the focused element hidden behind the sticky header (WCAG 2.4.11)?
 * Asks the browser what is on top at the element's center, so things drawn
 * above the header (the skip link) don't count.
 */
async function focusObscured(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    const header = document.querySelector("header");
    if (!el || !header || el === document.body || header.contains(el)) return false;
    const box = el.getBoundingClientRect();
    const top = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    return top !== null && header.contains(top);
  });
}

/**
 * The 404 comes from a page that streams before calling notFound(), so its
 * content arrives a moment after the load event. Wait for it before tabbing.
 */
async function gotoNotFound(page: Page) {
  const response = await page.goto(NOT_FOUND);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeAttached();
  return response;
}

test.describe("site shell", () => {
  test("the 404 page has the full shell, one h1, a 404 status and no WCAG A/AA violations", async ({ page }) => {
    const response = await gotoNotFound(page);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.locator("main#main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
    await expect(page.getByRole("banner")).not.toHaveAttribute("data-transparent");
    expect(await axeViolations(page)).toEqual([]);
  });

  test("the skip link is the first stop and moves focus to the page content", async ({ page }) => {
    await gotoNotFound(page);
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();
    await page.keyboard.press("Tab");
    // The next stop is inside the page, past the header.
    expect(await page.evaluate(() => document.querySelector("main")?.contains(document.activeElement))).toBe(true);
  });

  test("nothing overflows the screen at 360px wide", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await gotoNotFound(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await expect(page.getByRole("banner").getByRole("link", { name: "Give" })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("link", { name: "Get Help" })).toBeVisible();
  });

  test("focus is never hidden under the sticky header", async ({ page }) => {
    await page.goto("/styleguide/shell");
    // Start at the bottom and walk backwards through every stop on the page.
    await page.getByRole("contentinfo").getByRole("link", { name: "Terms" }).focus();
    for (let i = 0; i < 40; i += 1) {
      await page.keyboard.press("Shift+Tab");
      // Smooth scrolling moves the page after each Tab; judge where it settles.
      await expect.poll(() => focusObscured(page), { message: `stop ${i} is under the header` }).toBe(false);
    }
  });

  test("the overlay header is transparent over the hero and solid once it's scrolled past", async ({ page }) => {
    await page.goto("/styleguide/shell");
    const header = page.getByRole("banner");
    await expect(header).toHaveAttribute("data-transparent");
    const hero = await page.locator("#header-solid-sentinel").boundingBox();
    await page.mouse.wheel(0, (hero?.y ?? 800) + 200);
    await expect(header).not.toHaveAttribute("data-transparent");
    expect(await axeViolations(page, "header")).toEqual([]);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(header).toHaveAttribute("data-transparent");
  });
});

test.describe("header on desktop", () => {
  test.skip(({ isMobile }) => isMobile, "desktop layout");

  test("tab order runs logo, nav, then the Hub actions", async ({ page }) => {
    await gotoNotFound(page);
    await page.keyboard.press("Tab"); // skip link
    const expected = ["The Source of Hope", "Programs", "Events", "About", "Store", "Get Help", "Volunteer", "Give"];
    for (const name of expected) {
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(() => (document.activeElement as HTMLElement)?.innerText.trim());
      expect(focused).toBe(name);
    }
  });

  test("About opens with the keyboard and Escape returns focus", async ({ page }) => {
    await gotoNotFound(page);
    const about = page.getByRole("banner").getByRole("button", { name: "About" });
    await expect(async () => {
      if (await page.getByRole("menu").isVisible()) await page.keyboard.press("Escape");
      await about.focus();
      await page.keyboard.press("ArrowDown");
      await expect(page.getByRole("menuitem", { name: "Our Story" })).toBeFocused({ timeout: 1000 });
    }).toPass({ timeout: 15_000 });
    await expect(page.getByRole("menuitem")).toHaveCount(7);
    await page.keyboard.press("Escape");
    await expect(about).toBeFocused();
  });
});

test.describe("menu sheet on phones", () => {
  test.skip(({ isMobile }) => !isMobile, "phone layout");

  test("traps focus, closes on Escape, and returns focus to the menu button", async ({ page }) => {
    await gotoNotFound(page);
    const toggle = page.getByRole("button", { name: "Open menu" });
    const sheet = page.getByRole("dialog", { name: "Main" });
    await expect(async () => {
      await toggle.click();
      await expect(sheet).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15_000 });
    expect(await axeViolations(page, '[role="dialog"]')).toEqual([]);

    for (let i = 0; i < 20; i += 1) {
      await page.keyboard.press("Tab");
      expect(await sheet.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test("expands Programs and closes when a link is followed", async ({ page }) => {
    await gotoNotFound(page);
    const sheet = page.getByRole("dialog", { name: "Main" });
    await expect(async () => {
      await page.getByRole("button", { name: "Open menu" }).click();
      await expect(sheet).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15_000 });
    await sheet.getByRole("button", { name: "Programs" }).click();
    await expect(sheet.getByRole("link", { name: "Hope for the Outdoors" })).toBeVisible();
    await sheet.getByRole("link", { name: "Give" }).click();
    await expect(sheet).toBeHidden();
    await expect(page).toHaveURL(/\?action=give$/);
  });
});
