import { expect, test, type Page } from "@playwright/test";
import { axeViolations } from "./a11y";

/*
 * Phase 4: the Action Hub (spec §9, 02 §3). Uses the seeded local events
 * (supabase/seed.sql): a guest-only food distribution, a volunteer-only
 * packing night, a two-sided meal service and a partner health fair.
 */

const hub = (page: Page) => page.getByRole("dialog");
const title = (page: Page) => hub(page).locator("#hub-title");

async function openFromHeader(page: Page, name: "Give" | "Get Help") {
  await page.getByRole("banner").getByRole("link", { name, exact: true }).click();
  await expect(hub(page)).toBeVisible();
}

test.describe("opening and closing", () => {
  test("a header link opens the Hub in place, focus moves to the title, Escape closes and focus returns", async ({ page }) => {
    await page.goto("/about?utm_source=print");
    await openFromHeader(page, "Give");
    await expect(page).toHaveURL(/\/about\?action=give&utm_source=print$/);
    await expect(title(page)).toBeFocused();
    await expect(hub(page).getByRole("tab", { name: "Give" })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Escape");
    await expect(hub(page)).toBeHidden();
    await expect(page).toHaveURL(/\/about\?utm_source=print$/);
    await expect(page.getByRole("banner").getByRole("link", { name: "Give", exact: true })).toBeFocused();
  });

  test("Back closes the Hub, Forward reopens it", async ({ page }) => {
    await page.goto("/about");
    await openFromHeader(page, "Get Help");
    await page.goBack();
    await expect(hub(page)).toBeHidden();
    await expect(page).toHaveURL(/\/about$/);
    await page.goForward();
    await expect(hub(page)).toBeVisible();
    await expect(page).toHaveURL(/\/about\?action=help$/);
  });

  test("each step is a history entry; closing goes back past all of them", async ({ page }) => {
    await page.goto("/about");
    await openFromHeader(page, "Get Help");
    await hub(page).getByRole("radio", { name: "Food" }).check();
    await hub(page).getByRole("button", { name: "Continue" }).click();
    await expect(title(page)).toHaveText("Free food");
    await expect(page).toHaveURL(/\?action=help&need=food$/);
    await page.goBack();
    await expect(title(page)).toHaveText("What do you need?");
    await page.goForward();
    await expect(title(page)).toHaveText("Free food");
    await hub(page).getByRole("button", { name: "Close" }).click();
    await expect(hub(page)).toBeHidden();
    await expect(page).toHaveURL(/\/about$/);
    // The Hub entries are behind us: Back leaves the page, it doesn't reopen a step.
    await page.goBack();
    await expect(page).not.toHaveURL(/action=/);
  });

  test("switching doors on a landing doesn't add history", async ({ page }) => {
    await page.goto("/about");
    await openFromHeader(page, "Give");
    await hub(page).getByRole("tab", { name: "Volunteer" }).click();
    await expect(page).toHaveURL(/\?action=volunteer$/);
    await page.goBack();
    await expect(hub(page)).toBeHidden();
  });

  test("a deep link opens the step; Back goes up a level; close keeps UTMs; focus goes to main", async ({ page }) => {
    await page.goto("/?action=help&need=food&utm_campaign=flyer_2026_12");
    await expect(title(page)).toHaveText("Free food");
    await hub(page).getByRole("button", { name: "Back" }).click();
    await expect(title(page)).toHaveText("What do you need?");
    await expect(page).toHaveURL(/\/\?action=help&utm_campaign=flyer_2026_12$/);
    await hub(page).getByRole("button", { name: "Close" }).click();
    await expect(hub(page)).toBeHidden();
    await expect(page).toHaveURL(/\/\?utm_campaign=flyer_2026_12$/);
    await expect(page.locator("#main")).toBeFocused();
  });

  test("invalid values are dropped and the URL made canonical", async ({ page }) => {
    await page.goto("/?utm_source=qr&action=give&type=yearly&step=amount&ref=x");
    await expect(title(page)).toHaveText("How would you like to give?");
    await expect(page).toHaveURL(/\/\?action=give&utm_source=qr$/);
  });

  test("the backdrop closes a door landing", async ({ page, isMobile }) => {
    test.skip(isMobile, "On phones the Hub covers the screen");
    await page.goto("/about");
    await openFromHeader(page, "Give");
    await page.mouse.click(5, 5);
    await expect(hub(page)).toBeHidden();
  });
});

test.describe("event details", () => {
  test("a two-sided event opens on the volunteer side; view=guest picks the other", async ({ page }) => {
    await page.goto("/events?event=serving-hope-meal-service");
    await expect(title(page)).toHaveText("Serving Hope meal service");
    await expect(hub(page).getByRole("tab", { name: "For volunteers" })).toHaveAttribute("aria-selected", "true");
    await expect(hub(page).getByText("Setup and serving")).toBeVisible();
    await expect(hub(page).getByRole("button", { name: "Volunteer at this event" })).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);

    await hub(page).getByRole("tab", { name: "For guests" }).click();
    await expect(page).toHaveURL(/\?event=serving-hope-meal-service&view=guest$/);
    await expect(hub(page).getByText("No sign-up needed. Just come.")).toBeVisible();
    await expect(hub(page).getByRole("button", { name: "Volunteer at this event" })).toHaveCount(0);
  });

  test("a guest-only event has no toggle; Add to calendar is an .ics download", async ({ page, request }) => {
    await page.goto("/events?event=community-food-distribution");
    await expect(title(page)).toHaveText("Community food distribution");
    await expect(hub(page).getByRole("tablist")).toHaveCount(0);
    const ics = await request.get("/api/hub/event/community-food-distribution/ics");
    expect(ics.headers()["content-type"]).toContain("text/calendar");
    expect(await ics.text()).toContain("SUMMARY:Community food distribution");
  });

  test("a partner event links out to the partner's sign-up", async ({ page }) => {
    await page.goto("/events?event=partner-health-fair");
    await expect(hub(page).getByRole("link", { name: /Sign up on Partner organization/ })).toHaveAttribute("href", "https://example.org/health-fair");
    expect(await axeViolations(page)).toEqual([]);
  });

  test("an unknown event says so", async ({ page }) => {
    await page.goto("/events?event=no-such-event");
    await expect(title(page)).toHaveText("We couldn't find that event");
  });

  test("Volunteer at this event moves to the volunteer flow", async ({ page }) => {
    await page.goto("/events?event=food-packing-night");
    await hub(page).getByRole("button", { name: "Volunteer at this event" }).click();
    await expect(page).toHaveURL(/\?action=volunteer&event=food-packing-night&step=shift$/);
  });
});

test.describe("get help", () => {
  test("need → services and events → detail, with the emergency footer, no third-party requests and no WCAG A/AA violations", async ({ page, baseURL }) => {
    const origin = new URL(baseURL!).origin;
    const thirdParty: string[] = [];
    page.on("request", (request) => {
      const url = request.url();
      if (!url.startsWith(origin) && !url.startsWith("data:")) thirdParty.push(url);
    });

    await page.goto("/?action=help");
    await expect(title(page)).toHaveText("What do you need?");
    await expect(hub(page).getByRole("complementary", { name: "Emergency numbers" })).toContainText("988");
    expect(await axeViolations(page)).toEqual([]);

    await hub(page).getByRole("radio", { name: "Something else" }).check();
    await expect(hub(page).getByText("for help with housing, bills, food and more")).toBeVisible();

    await hub(page).getByRole("radio", { name: "Food" }).check();
    await hub(page).getByRole("button", { name: "Continue" }).click();
    await expect(hub(page).getByRole("heading", { name: "What we offer" })).toBeVisible();
    await expect(hub(page).getByRole("heading", { name: "Upcoming events" })).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);

    await hub(page).getByRole("button", { name: "Details: Free meals at our events" }).click();
    await expect(title(page)).toHaveText("Free meals at our events");
    await expect(hub(page).getByRole("complementary", { name: "Emergency numbers" })).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);

    await page.goBack();
    await hub(page).getByRole("button", { name: "Details: Community food distribution" }).click();
    await expect(title(page)).toHaveText("Community food distribution");
    await expect(hub(page).getByRole("tablist")).toHaveCount(0);

    // Analytics scripts aren't part of Get Help; filter Vercel's own first-party paths only.
    expect(thirdParty.filter((url) => !url.includes("/_vercel/"))).toEqual([]);
  });

  test("opened from a page that loaded Google's tags, Get Help sends them nothing", async ({ page, baseURL }) => {
    const origin = new URL(baseURL!).origin;
    // Let the page's own tags finish loading and reporting /about first.
    const ga4Loaded = page.waitForResponse(/gtag\/js\?id=G-/, { timeout: 20_000 }).catch(() => null);
    await page.goto("/about");
    await ga4Loaded;
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    const thirdParty: string[] = [];
    page.on("request", (request) => {
      if (!request.url().startsWith(origin)) thirdParty.push(request.url());
    });
    await openFromHeader(page, "Get Help");
    await hub(page).getByRole("radio", { name: "Food" }).check();
    await hub(page).getByRole("button", { name: "Continue" }).click();
    await expect(hub(page).getByRole("heading", { name: "What we offer" })).toBeVisible();
    await page.waitForLoadState("networkidle");
    expect(thirdParty).toEqual([]);
  });

  test("a service that starts with a call offers the phone number", async ({ page }) => {
    await page.goto("/?action=help&need=health&service=wellness-clinic");
    await expect(hub(page).getByRole("link", { name: "Call (469) 969-0244" })).toHaveAttribute("href", "tel:+14699690244");
  });
});

test.describe("volunteer door", () => {
  test("lists events with shifts and spots left", async ({ page }) => {
    await page.goto("/?action=volunteer");
    await expect(title(page)).toHaveText("Choose an event");
    await expect(hub(page).getByRole("heading", { name: "Food packing night" })).toBeVisible();
    await expect(hub(page).getByRole("heading", { name: "Community food distribution" })).toHaveCount(0);
    await expect(hub(page).getByText(/spots left/).first()).toBeVisible();
    expect(await axeViolations(page)).toEqual([]);
  });
});

test.describe("give door", () => {
  test("type cards with the type pre-selected; no WCAG A/AA violations", async ({ page }) => {
    await page.goto("/?action=give&type=monthly");
    await expect(hub(page).getByRole("radio", { name: /Monthly/ })).toBeChecked();
    expect(await axeViolations(page)).toEqual([]);
  });
});
