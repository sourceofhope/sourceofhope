import { expect, test } from "@playwright/test";
import { axeViolations } from "./a11y";

/* Slice 3.5: Contact, Careers, Partners & Sponsors (spec §10.8). */
test.describe("contact, careers, partners", () => {
  for (const [path, h1] of [["/contact", "Contact"], ["/careers", "Careers"], ["/about/partners", "Partners & Sponsors"]] as const) {
    test(`${path}: one h1 and no WCAG A/AA violations`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
      expect(await axeViolations(page)).toEqual([]);
    });
  }

  test("/connect redirects to /contact and keeps UTMs", async ({ page }) => {
    await page.goto("/connect?utm_source=flyer&utm_campaign=spring");
    await expect(page).toHaveURL(/\/contact\?utm_source=flyer&utm_campaign=spring$/);
  });

  test("the contact form shows every error, then fails gracefully when email can't be sent", async ({ page }) => {
    await page.goto("/contact");
    const send = page.getByRole("button", { name: "Send message" });
    await expect(async () => {
      await send.click();
      await expect(page.getByRole("alert").filter({ hasText: "problems with this form" })).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15_000 });
    const summary = page.getByRole("alert").filter({ hasText: "problems with this form" });
    await expect(summary).toContainText("There are 4 problems with this form.");
    expect(await axeViolations(page, "main")).toEqual([]);

    await page.getByRole("textbox", { name: "Full name" }).fill("Test Person");
    await page.getByRole("textbox", { name: "Email", exact: true }).fill("test@example.com");
    await page.getByRole("combobox", { name: "Topic" }).click();
    await page.getByRole("option", { name: "General question" }).click();
    await page.getByRole("textbox", { name: "Message" }).fill("This is a test message from the e2e suite.");
    await send.click();
    // The test server has no email provider, so the honest failure message shows (never a false success).
    await expect(page.getByText(/We couldn't send your message/)).toBeVisible();
    await expect(page.getByText(/We got your message/)).toHaveCount(0);
  });

  test("the privacy policy is linked at the form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("main").getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy");
  });
});
