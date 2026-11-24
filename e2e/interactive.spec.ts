import { expect, test, type Page } from "@playwright/test";
import { axeViolations } from "./a11y";

/*
 * Slice 1.4: the interactive primitives in a real browser. jsdom can't show
 * top-layer popups, focus trapping, layout or motion, so those live here.
 */

async function open(page: Page, hash: string) {
  await page.goto(`/styleguide#${hash}`);
  await expect(page.locator(`#${hash}`)).toBeVisible();
}

test.describe("interactive primitives", () => {
  for (const id of ["overlays", "forms", "media"]) {
    test(`section "${id}" has no WCAG A/AA violations`, async ({ page }) => {
      await open(page, id);
      expect(await axeViolations(page, `#${id}`)).toEqual([]);
    });
  }

  test("dialog traps focus, passes axe while open, and returns focus on Escape", async ({ page }) => {
    await open(page, "overlays");
    const trigger = page.getByRole("button", { name: "Open dialog" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Leave this sign-up?" });
    await expect(dialog).toBeVisible();
    expect(await axeViolations(page, '[role="dialog"]')).toEqual([]);

    // Tab cycles inside the dialog only.
    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("takeover fills a phone screen and is a centered dialog on desktop", async ({ page, isMobile }) => {
    await open(page, "overlays");
    await page.getByRole("button", { name: "Open takeover (controlled)" }).click();
    const dialog = page.getByRole("dialog", { name: "Get Help" });
    await expect(dialog).toBeVisible();
    // Let the enter transition settle before measuring.
    await page.waitForTimeout(400);
    const box = await dialog.boundingBox();
    const viewport = page.viewportSize();
    expect(box && viewport).toBeTruthy();
    if (isMobile) {
      expect(Math.round(box!.width)).toBe(viewport!.width);
    } else {
      expect(box!.width).toBeLessThan(viewport!.width * 0.75);
    }
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toBeHidden();
  });

  test("menu opens with the keyboard and moves with the arrow keys", async ({ page }) => {
    await open(page, "overlays");
    const trigger = page.getByRole("button", { name: "About" });
    // Retry until hydration has attached the menu's key handling (a cold
    // server can still be hydrating when the load event fires).
    await expect(async () => {
      if (await page.getByRole("menu").isVisible()) await page.keyboard.press("Escape");
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("menuitem", { name: "Our story" })).toBeFocused({ timeout: 1000 });
    }).toPass({ timeout: 15_000 });
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitem", { name: "Our team" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("a toast appears fully on screen and can be dismissed", async ({ page }) => {
    await open(page, "overlays");
    await page.getByRole("button", { name: "Success toast" }).click();
    const item = page.locator('[data-slot="toast"]');
    await expect(item).toContainText("You're signed up");
    const box = await item.boundingBox();
    const viewport = page.viewportSize();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
    await item.getByRole("button", { name: "Dismiss" }).click();
    await expect(item).toHaveCount(0);
  });

  test("the empty form lists every problem and links to each field", async ({ page }) => {
    await open(page, "forms");
    await page.getByRole("button", { name: "Check the form" }).click();
    const summary = page.getByRole("alert").filter({ hasText: "problems with this form" });
    await expect(summary).toBeFocused();
    await expect(summary).toContainText("There are 4 problems with this form.");
    await summary.getByRole("link", { name: "Enter your name." }).click();
    await expect(page.getByRole("textbox", { name: "Full name" })).toBeFocused();

    await page.getByRole("textbox", { name: "Full name" }).fill("Ada Lovelace");
    await expect(page.getByText("Enter your name.")).toHaveCount(0);

    // The select opens in a popup and takes a choice from the keyboard.
    const shirt = page.getByRole("combobox", { name: "Volunteer shirt size" });
    await shirt.focus();
    await page.keyboard.press("Enter");
    await page.getByRole("option", { name: "Medium" }).click();
    await expect(shirt).toContainText("Medium");
  });

  test("carousel has one dot per slide and pages with Next", async ({ page }) => {
    await open(page, "media");
    const carousel = page.locator("#media").getByRole("region", { name: "Photos from Serving Hope" });
    await expect(carousel.getByRole("tab")).toHaveCount(4);
    await expect(carousel.getByRole("tab", { name: "1 of 4" })).toHaveAttribute("aria-selected", "true");
    await carousel.getByRole("button", { name: "Next slide" }).click();
    await expect(carousel.getByRole("tab", { name: "2 of 4" })).toHaveAttribute("aria-selected", "true");
  });

  test("the sponsor strip moves at a constant speed and pauses", async ({ page }) => {
    await open(page, "media");
    const strip = page.getByRole("region", { name: "Our sponsors" });
    const track = strip.locator(".animate-marquee");
    expect(await track.evaluate((el) => getComputedStyle(el).animationPlayState)).toBe("running");
    expect(await track.evaluate((el) => getComputedStyle(el).animationTimingFunction)).toBe("linear");
    await strip.getByRole("button", { name: "Pause moving content" }).click();
    expect(await track.evaluate((el) => getComputedStyle(el).animationPlayState)).toBe("paused");
  });

  test("the hero video plays with a pause button", async ({ page }) => {
    await open(page, "media");
    const media = page.locator("#media");
    const pause = media.getByRole("button", { name: "Pause background video" });
    await expect(pause).toBeVisible();
    await pause.click();
    await expect(media.getByRole("button", { name: "Play background video" })).toBeVisible();
    expect(await page.locator("#media video").evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
  });
});

test.describe("interactive primitives with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the hero shows only its poster and the sponsor strip stands still", async ({ page }) => {
    await open(page, "media");
    const video = page.locator("#media video");
    await expect(video).toHaveAttribute("poster", /TSOH-Poster/);
    await expect(video.locator("source")).toHaveCount(0);
    await expect(page.locator("#media").getByRole("button", { name: /background video/ })).toHaveCount(0);

    const strip = page.getByRole("region", { name: "Our sponsors" });
    expect(await strip.locator(".animate-marquee").evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    await expect(strip.getByRole("button")).toHaveCount(0);
    // The strip scrolls by hand instead, and the looping copy is gone.
    expect(await strip.locator("ul").nth(1).isHidden()).toBe(true);
  });

  test("youtube loads nothing until asked", async ({ page }) => {
    await open(page, "media");
    await expect(page.locator("#media iframe")).toHaveCount(0);
    await page.getByRole("button", { name: "Play video: Education Hope" }).click();
    await expect(page.locator("#media iframe")).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/K7WGjKoaqto/);
  });
});
