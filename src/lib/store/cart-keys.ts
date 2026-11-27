/** Where the store cart lives in the browser, and the event fired when it changes (shared by the cart and the header). */
export const CART_STORAGE_KEY = "sourceofhope_cart";
export const CART_CHANGED_EVENT = "tsoh:cart-changed";

/** Item count from the stored cart, tolerating anything malformed. */
export function storedCartCount(raw: string | null): number {
  try {
    const items = raw ? (JSON.parse(raw) as { quantity?: unknown }[]) : [];
    return Array.isArray(items) ? items.reduce((sum, item) => sum + (typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 0), 0) : 0;
  } catch {
    return 0;
  }
}
