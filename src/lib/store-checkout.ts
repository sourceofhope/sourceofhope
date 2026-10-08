import "server-only";

import { getEnvironment } from "@/lib/environment";
import { fetchProductById } from "@/lib/sanity-content";
import { readString } from "@/lib/validation";

// Mirrors SHIPPING_OPTIONS and the rates in src/context/StoreCartContext.tsx
// (a client module, so it cannot be imported here). Keep the two in sync.
const SHIPPING_OPTIONS = [
  { id: "standard", name: "Standard Shipping", cost: 5.99 },
  { id: "express", name: "Express Shipping", cost: 12.99 },
  { id: "overnight", name: "Overnight Shipping", cost: 24.99 },
];
const TAX_RATE = 0.0825;
const PROCESSING_RATE = 0.03;

const MAX_LINE_ITEMS = 25;
const MAX_QUANTITY = 100;
const MAX_ITEM_ID_LENGTH = 200;

/** A cart problem whose message is safe to show to the customer. */
export class CartError extends Error {}

export interface PricedItem {
  id: string;
  name: string;
  size?: string;
  image?: string;
  unitAmountCents: number;
  quantity: number;
}

export interface PricedCart {
  items: PricedItem[];
  shippingMethod: string;
  shippingName: string;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  processingFeeCents: number;
  totalCents: number;
}

// Same rounding as StoreCartContext so the charged total matches the UI.
const round2 = (value: number) => parseFloat(value.toFixed(2));
const toCents = (value: number) => Math.round(value * 100);

/**
 * Price a cart from the product catalog in Sanity. Only product IDs,
 * quantities, the shipping method and whether to cover the processing fee
 * come from the client; every amount is looked up or computed here.
 */
export async function priceCart(
  rawItems: unknown,
  rawShippingMethod: unknown,
  coverProcessingFee: boolean,
): Promise<PricedCart> {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new CartError("Cart items are required");
  }
  if (rawItems.length > MAX_LINE_ITEMS) {
    throw new CartError("Too many items in cart");
  }

  const requested = rawItems.map((raw) => {
    const item = (raw && typeof raw === "object" ? raw : {}) as Record<
      string,
      unknown
    >;
    const id = readString(item.id, MAX_ITEM_ID_LENGTH);
    const quantity = Number(item.quantity);

    if (
      !id ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_QUANTITY
    ) {
      throw new CartError("Cart contains an invalid item");
    }

    return { id, quantity };
  });

  const uniqueIds = [...new Set(requested.map((item) => item.id))];
  const products = new Map(
    await Promise.all(
      uniqueIds.map(async (id) => [id, await fetchProductById(id)] as const),
    ),
  );

  const items: PricedItem[] = requested.map(({ id, quantity }) => {
    const product = products.get(id);
    const price = product?.price;

    if (!product || typeof price !== "number" || !(price > 0)) {
      throw new CartError("An item in your cart is no longer available");
    }

    return {
      id: product.id,
      name: product.title || "Product",
      size: product.size || undefined,
      image: product.image?.sourceUrl || undefined,
      unitAmountCents: toCents(price),
      quantity,
    };
  });

  const shippingOption = SHIPPING_OPTIONS.find(
    (option) => option.id === (rawShippingMethod ?? "standard"),
  );
  if (!shippingOption) {
    throw new CartError("Invalid shipping method");
  }

  const subtotalCents = items.reduce(
    (sum, item) => sum + item.unitAmountCents * item.quantity,
    0,
  );
  const subtotal = subtotalCents / 100;
  const tax = round2(subtotal * TAX_RATE);
  const shipping = round2(shippingOption.cost);
  const processingFee = coverProcessingFee
    ? round2((subtotal + tax + shipping) * PROCESSING_RATE)
    : 0;

  const shippingCents = toCents(shipping);
  const taxCents = toCents(tax);
  const processingFeeCents = toCents(processingFee);

  return {
    items,
    shippingMethod: shippingOption.id,
    shippingName: shippingOption.name,
    subtotalCents,
    shippingCents,
    taxCents,
    processingFeeCents,
    totalCents: subtotalCents + shippingCents + taxCents + processingFeeCents,
  };
}

/** Whether the client asked to cover the processing fee (it sends the fee amount). */
export function wantsProcessingFee(value: unknown): boolean {
  return value === true || (typeof value === "number" && value > 0);
}

/**
 * Store redirect URLs for Stripe/PayPal, built on the server so the client
 * cannot point the payment provider's redirect at another site.
 */
export function getStoreRedirectUrls(request: Request) {
  const origin = getSiteOrigin(request);

  return {
    successUrl: `${origin}/store/success`,
    cancelUrl: `${origin}/store/checkout`,
  };
}

function getSiteOrigin(request: Request): string {
  const { frontendUrl } = getEnvironment();

  if (frontendUrl) {
    try {
      return new URL(frontendUrl).origin;
    } catch {
      console.error("NEXT_PUBLIC_FRONTEND_URL is not a valid URL");
    }
  }

  return new URL(request.url).origin;
}

export function formatCents(cents: number): string {
  return (cents / 100).toFixed(2);
}
