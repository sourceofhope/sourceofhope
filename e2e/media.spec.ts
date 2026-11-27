import { expect, test } from "@playwright/test";
import { axeViolations } from "./a11y";

/* Slice 3.6: News & Media (spec §10.7). */
test.describe("news and media", () => {
  test("one h1, the sections, and no WCAG A/AA violations", async ({ page }) => {
    await page.goto("/media");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("News & Media");
    for (const name of ["Stories and updates", "Press", "Podcast and radio", "Get the newsletter"]) {
      await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
    }
    expect(await axeViolations(page)).toEqual([]);
  });

  test("no YouTube requests until a video is played", async ({ page }) => {
    const youtube: string[] = [];
    page.on("request", (r) => {
      if (/youtube(-nocookie)?\.com|googlevideo/.test(r.url())) youtube.push(r.url());
    });
    await page.goto("/media");
    await page.waitForLoadState("networkidle");
    expect(youtube).toEqual([]);
    await page.getByRole("button", { name: "Play video: NBC5 - The Source of Hope" }).click();
    await expect(page.locator('iframe[src*="youtube-nocookie.com/embed/6iUccVeIxWw"]')).toBeAttached();
  });

  test("the Vietnamese radio text is marked lang=vi", async ({ page }) => {
    await page.goto("/media");
    await expect(page.locator('[lang="vi"]').first()).toHaveText("Thứ Bảy hàng tuần, lúc 10 giờ sáng");
  });

  test("old Press and Podcast pages redirect to their sections", async ({ request }) => {
    const press = await request.get("/media/press", { maxRedirects: 0 });
    expect(press.status()).toBe(308);
    expect(press.headers()["location"]).toBe("/media#press");
    const podcast = await request.get("/media/podcast", { maxRedirects: 0 });
    expect(podcast.headers()["location"]).toBe("/media#podcast");
  });
});
