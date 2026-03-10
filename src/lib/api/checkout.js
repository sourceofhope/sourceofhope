import { get, post } from "./client";

/**
 * Fetch available checkout providers
 * @returns {Promise} Response containing array of checkout providers
 */
export async function fetchCheckoutProviders() {
  return get("/providers/checkout");
}

/**
 * Fetch the Stripe Payment Intent status from the server
 * @param {string} paymentIntentId - The Stripe Payment Intent ID
 * @returns {Promise} Response containing the payment intent status and customer email
 */
export async function fetchPaymentIntentStatus(paymentIntentId) {
  return get("/checkout/retrieve-stripe-payment-intent-status", {
    payment_intent: paymentIntentId,
  });
}

/**
 * Creates a Stripe Payment Intent for direct payment processing
 * @param {Object} params - Payment parameters
 * @param {Array} params.items - Cart items with id, name, price, quantity, size
 * @param {string} params.shippingMethod - Selected shipping method
 * @param {number} params.shippingCost - Calculated shipping cost
 * @param {number} params.taxAmount - Calculated tax amount
 * @param {Object} params.shippingAddress - Shipping address details
 * @param {Object} params.billingAddress - Billing address details
 * @returns {Promise} Response containing payment intent client secret
 */
export async function createPaymentIntent({
  items,
  shippingMethod,
  shippingCost,
  taxAmount,
  processingFee,
  shippingAddress,
  billingAddress,
  totalAmount,
  email, // Add email parameter for receipt email
}) {
  return post("/checkout/create-stripe-payment-intent", {
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
    processingFee,
    shippingAddress,
    billingAddress,
    totalAmount,
    email, // Add email parameter for receipt email
  });
}

/**
 * Fetch the Stripe session status from the server
 * @param {string} sessionId - The Stripe session ID
 * @returns {Promise} Response containing the session status and customer email
 */
export async function fetchStripeSessionStatus(sessionId) {
  return get("/checkout/retrieve-stripe-session-status", {
    session_id: sessionId,
  });
}

/**
 * Fetch the PayPal order status from the server
 * @param {string} token - The PayPal order token
 * @returns {Promise} Response containing the order status and customer email
 */
export async function fetchPaypalOrderStatus(token) {
  return get("/checkout/retrieve-paypal-order-status", {
    token: token,
  });
}

/**
 * Creates a Stripe Payment Intent for membership subscription
 * @param {Object} params - Membership parameters
 * @param {string} params.membershipType - Type of membership (bronze, silver, gold)
 * @param {number} params.amount - Monthly membership amount
 * @param {string} params.firstName - First name
 * @param {string} params.lastName - Last name
 * @param {string} params.email - Email address
 * @param {string} params.phone - Phone number
 * @returns {Promise} Response containing payment intent client secret
 */
export async function createMembershipPaymentIntent({
  membershipPlanId,
  membershipType,
  amount,
  firstName,
  lastName,
  companyName,
  contactName,
  companyInfo,
  email,
  phone,
}) {
  return post("/checkout/create-membership-payment-intent", {
    membershipPlanId,
    membershipType,
    amount,
    firstName,
    lastName,
    companyName,
    contactName,
    companyInfo,
    email,
    phone,
  });
}

/**
 * Fetch the Stripe publishable key from the server
 * @returns {Promise} Response containing the Stripe publishable key
 */
export async function fetchStripePublishableKey() {
  return post("/checkout/retrieve-stripe-publishable-key");
}

/**
 * Create a Stripe checkout session for embedded checkout
 * @param {Object} params - Checkout parameters
 * @param {Array} params.items - Cart items with id, name, price, quantity, size
 * @param {string} params.shippingMethod - Selected shipping method
 * @param {number} params.shippingCost - Calculated shipping cost
 * @param {number} params.taxAmount - Calculated tax amount
 * @param {string} params.return_url - URL to redirect after successful payment
 * @returns {Promise} Response containing checkout session client secret
 */
export async function createStripeCheckoutSession({
  items,
  shippingMethod,
  shippingCost,
  taxAmount,
  return_url,
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
    return_url,
  });
}

/**
 * Creates a Stripe checkout order for the cart items
 * @param {Object} params - Checkout parameters
 * @param {Array} params.items - Cart items with id, name, price, quantity, size
 * @param {string} params.shippingMethod - Selected shipping method
 * @param {number} params.shippingCost - Calculated shipping cost
 * @param {number} params.taxAmount - Calculated tax amount
 * @param {number} params.processingFee - Optional processing fee support
 * @param {string} params.successUrl - URL to redirect after successful payment
 * @param {string} params.cancelUrl - URL to redirect if payment is cancelled
 * @returns {Promise} Response containing checkout session URL
 */
export async function createStripeCheckout({
  items,
  shippingMethod,
  shippingCost,
  taxAmount,
  processingFee,
  successUrl,
  cancelUrl,
}) {
  return post("/checkout/create-stripe-checkout", {
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
    processingFee,
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
 * @param {number} params.processingFee - Optional processing fee support
 * @param {string} params.successUrl - URL to redirect after successful payment
 * @param {string} params.cancelUrl - URL to redirect if payment is cancelled
 * @returns {Promise} Response containing PayPal approval URL
 */
export async function createPaypalCheckout({
  items,
  shippingMethod,
  shippingCost,
  taxAmount,
  processingFee,
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
    processingFee,
    successUrl,
    cancelUrl,
  });
}
