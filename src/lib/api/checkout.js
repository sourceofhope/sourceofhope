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
export async function createStripeCheckoutSession({
  items,
  shippingMethod,
  shippingCost,
  taxAmount,
  successUrl,
  cancelUrl,
}) {
  return post("/checkout/create-stripe-session", {
    items: items.map((item) => ({
      id: item.id,
      name: item.name || item.title || "Product",
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

/**
 * Creates a PayPal checkout order for the cart items
 * @param {Object} params - Checkout parameters
 * @param {Array} params.items - Cart items with id, name, price, quantity, size
 * @param {string} params.shippingMethod - Selected shipping method
 * @param {number} params.shippingCost - Calculated shipping cost
 * @param {number} params.taxAmount - Calculated tax amount
 * @param {string} params.successUrl - URL to redirect after successful payment
 * @param {string} params.cancelUrl - URL to redirect if payment is cancelled
 * @returns {Promise} Response containing PayPal approval URL
 */
export async function createPaypalCheckoutSession({
  items,
  shippingMethod,
  shippingCost,
  taxAmount,
  successUrl,
  cancelUrl,
}) {
  return post("/checkout/create-paypal-order", {
    items: items.map((item) => ({
      id: item.id,
      name: item.name || item.title || "Product",
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
