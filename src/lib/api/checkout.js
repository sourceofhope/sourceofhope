import { post } from "./client";

/**
 * Creates a Stripe checkout session for the cart items
 * @param {Object} params - Checkout parameters
 * @param {Array} params.items - Cart items with id, name, price, quantity, size
 * @param {string} params.shippingMethod - Selected shipping method
 * @param {number} params.shippingCost - Calculated shipping cost
 * @param {number} params.taxAmount - Calculated tax amount
 * @param {string} params.successUrl - URL to redirect after successful payment
 * @param {string} params.cancelUrl - URL to redirect if payment is cancelled
 * @returns {Promise} Response containing checkout session URL
 */
export async function createCheckoutSession({
  items,
  shippingMethod,
  shippingCost,
  taxAmount,
  successUrl,
  cancelUrl,
}) {
  return post("/api/checkout/create-session", {
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      image: item.image,
    })),
    shippingMethod,
    shippingCost,
    taxAmount,
    successUrl,
    cancelUrl,
  });
}
