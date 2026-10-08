import "server-only";

import { fetchProductById } from "@/lib/sanity-content";
import {
  SHIPPING_OPTIONS,
  STANDARD_PROCESSING_RATE,
  STANDARD_TAX_RATE,
} from "@/lib/store-constants";

/** Thrown for bad client input; safe to show to the customer. */
export class PricingError extends Error {}

const MAX_LINE_ITEMS = 50;
const MAX_QUANTITY = 99;

export interface PricedLine {
  id: string;
  name: string;
  size?: string;
  image?: string;
  unitPrice: number;
  quantity: number;
}

export interface StoreQuote {
  lines: PricedLine[];
  shippingMethod: { id: string; name: string };
  subtotal: number;
  shipping: number;
  tax: number;
  processingFee: number;
  total: number;
}

// Same rounding as StoreCartContext (`parseFloat(x.toFixed(2))`); Math.round
// differs from it by a cent on some tax/fee values.
const round2 = (value: number) => parseFloat(value.toFixed(2));

/** Convert a dollar amount to integer cents. */
export const toCents = (value: number) => Math.round(value * 100);

function cleanString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.replace(/[\r\n\t]/g, " ").trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

/**
 * Price a storefront order entirely on the server.
 *
 * Only product ids, quantities, sizes, the shipping method id, and whether
 * the customer opted to cover processing fees are taken from the request.
 * Prices come from the CMS and totals use the same rounding as the cart UI.
 */
export async function quoteStoreOrder(body: {
  items?: unknown;
  shippingMethod?: unknown;
  processingFee?: unknown;
  coverFee?: unknown;
}): Promise<StoreQuote> {
  const { items } = body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new PricingError("Cart items are required");
  }
  if (items.length > MAX_LINE_ITEMS) {
    throw new PricingError("Too many items in cart");
  }

  const requested = items.map((raw) => {
    const item = (raw ?? {}) as Record<string, unknown>;
    const id = cleanString(item.id, 100);
    const quantity = Number(item.quantity);

    if (!id) throw new PricingError("Each cart item needs a product id");
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new PricingError("Invalid item quantity");
    }

    return { id, quantity, size: cleanString(item.size, 30) };
  });

  const uniqueIds = [...new Set(requested.map((item) => item.id))];
  const products = new Map(
    await Promise.all(
      uniqueIds.map(async (id) => [id, await fetchProductById(id)] as const),
    ),
  );

  const lines: PricedLine[] = requested.map((item) => {
    const product = products.get(item.id);
    const price = Number(product?.price);

    if (!product || !Number.isFinite(price) || price <= 0) {
      throw new PricingError("One or more items are no longer available");
    }

    return {
      id: product.id,
      name: product.title || "Product",
      size: item.size,
      image: product.image?.sourceUrl,
      unitPrice: round2(price),
      quantity: item.quantity,
    };
  });

  const shippingOption =
    SHIPPING_OPTIONS.find((option) => option.id === body.shippingMethod) ??
    SHIPPING_OPTIONS[0];

  const coverFee =
    body.coverFee === true || Number(body.processingFee) > 0;

  const subtotal = round2(
    lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
  );
  const shipping = round2(shippingOption.cost);
  const tax = round2(subtotal * STANDARD_TAX_RATE);
  const processingFee = coverFee
    ? round2((subtotal + tax + shipping) * STANDARD_PROCESSING_RATE)
    : 0;
  const total = round2(round2(subtotal + shipping + tax) + processingFee);

  return {
    lines,
    shippingMethod: { id: shippingOption.id, name: shippingOption.name },
    subtotal,
    shipping,
    tax,
    processingFee,
    total,
  };
}

/**
 * Absolute site origin for payment-provider redirects. Derived from the
 * request the browser made to this API (same as `window.location.origin`),
 * never from the request body, so checkout cannot redirect buyers off-site.
 */
export function getSiteOrigin(request: Request): string {
  return new URL(request.url).origin;
}
