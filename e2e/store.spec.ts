import { expect, test } from "@playwright/test";
import { axeViolations } from "./a11y";

/* Slice 3.7: Store restyle and fixes (spec §10.9). */
test.describe("store", () => {
  for (const [path, h1] of [["/store", "Store"], ["/store/cart", "Your cart"], ["/store/checkout", "Checkout"], ["/store/success", "Checkout"]] as const) {
    test(`${path}: one h1 and no WCAG A/AA violations`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
      expect(await axeViolations(page)).toEqual([]);
    });
  }

  test("an unknown product is a 404", async ({ request }) => {
    expect((await request.get("/store/product/no-such-product")).status()).toBe(404);
  });

  test("the header shows the cart only when it has items", async ({ page }) => {
    await page.goto("/events");
    await expect(page.getByRole("banner").getByRole("link", { name: /^Cart/ })).toHaveCount(0);
    // A cart filled on the store earlier in the visit.
    await page.addInitScript(() => localStorage.setItem("sourceofhope_cart", JSON.stringify([{ id: "1", name: "Tee", price: 25, quantity: 2 }])));
    await page.goto("/events");
    await expect(page.getByRole("banner").getByRole("link", { name: "Cart, 2 items" })).toHaveAttribute("href", "/store/cart");
  });
});
