/**
 * Payment Schema
 * Defines the structure for payment and order data
 */

/**
 * @typedef {Object} PaymentMethod
 * @property {string} id - Payment method identifier
 * @property {string} type - Payment type ("card", "paypal", "apple_pay", "google_pay", "bank_transfer")
 * @property {Object} details - Payment method specific details
 * @property {string} [details.last4] - Last 4 digits of card
 * @property {string} [details.brand] - Card brand (visa, mastercard, etc.)
 * @property {string} [details.expiryMonth] - Card expiry month
 * @property {string} [details.expiryYear] - Card expiry year
 * @property {string} [details.email] - PayPal email
 * @property {boolean} isDefault - Whether this is the default payment method
 * @property {Date} createdAt - Creation timestamp
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} id - Order item identifier
 * @property {string} productId - Reference to product
 * @property {string} productName - Product name
 * @property {string} productImage - Product image URL
 * @property {number} quantity - Quantity ordered
 * @property {number} unitPrice - Price per unit in cents
 * @property {Object<string, string>} selectedOptions - Selected options
 * @property {number} subtotal - Line item subtotal in cents
 */

/**
 * @typedef {Object} Order
 * @property {string} id - Unique order identifier
 * @property {string} orderNumber - Human-readable order number (e.g., "SOH-2026-001")
 * @property {string} userId - Customer user ID
 * @property {Array<OrderItem>} items - Ordered items
 * @property {Object} shippingAddress - Shipping address snapshot
 * @property {Object} billingAddress - Billing address (can be same as shipping)
 * @property {Object} shippingMethod - Selected shipping method
 * @property {string} [couponCode] - Applied coupon code
 * @property {number} discount - Discount amount in cents
 * @property {number} subtotal - Subtotal in cents
 * @property {number} shippingCost - Shipping cost in cents
 * @property {number} tax - Tax amount in cents
 * @property {number} total - Order total in cents
 * @property {string} status - Order status
 * @property {string} paymentStatus - Payment status
 * @property {string} fulfillmentStatus - Fulfillment status
 * @property {string} paymentMethod - Payment method used
 * @property {string} [paymentIntentId] - Payment processor intent ID
 * @property {string} [transactionId] - Payment transaction ID
 * @property {Object} metadata - Additional order data
 * @property {string} [customerNotes] - Customer notes
 * @property {string} [internalNotes] - Internal staff notes
 * @property {Date} createdAt - Order creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {Date} [paidAt] - Payment completion timestamp
 * @property {Date} [shippedAt] - Shipment timestamp
 * @property {Date} [deliveredAt] - Delivery timestamp
 * @property {string} [trackingNumber] - Shipping tracking number
 * @property {string} [trackingUrl] - Tracking URL
 */

/**
 * Order status enum
 */
export const OrderStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

/**
 * Payment status enum
 */
export const PaymentStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
  REFUNDED: "refunded",
  PARTIALLY_REFUNDED: "partially_refunded",
};

/**
 * Fulfillment status enum
 */
export const FulfillmentStatus = {
  UNFULFILLED: "unfulfilled",
  PARTIALLY_FULFILLED: "partially_fulfilled",
  FULFILLED: "fulfilled",
  RETURNED: "returned",
};

/**
 * Creates a new order from cart
 * @param {import('./cart').Cart} cart
 * @param {Object} additionalData - Additional order data
 * @returns {Order}
 */
export function createOrderFromCart(cart, additionalData = {}) {
  const orderNumber = generateOrderNumber();

  const orderItems = cart.items.map((item) => ({
    id: crypto.randomUUID(),
    productId: item.productId,
    productName: item.productName,
    productImage: item.productImage,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    selectedOptions: item.selectedOptions,
    subtotal: item.unitPrice * item.quantity,
  }));

  return {
    id: crypto.randomUUID(),
    orderNumber,
    userId: cart.userId || additionalData.userId || "guest",
    items: orderItems,
    shippingAddress: { ...cart.shippingAddress },
    billingAddress: additionalData.billingAddress || { ...cart.shippingAddress },
    shippingMethod: { ...cart.shippingMethod },
    couponCode: cart.couponCode || null,
    discount: cart.discount || 0,
    subtotal: cart.subtotal,
    shippingCost: cart.shippingCost,
    tax: cart.tax,
    total: cart.total,
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    fulfillmentStatus: FulfillmentStatus.UNFULFILLED,
    paymentMethod: additionalData.paymentMethod || "",
    paymentIntentId: additionalData.paymentIntentId || null,
    transactionId: additionalData.transactionId || null,
    metadata: additionalData.metadata || {},
    customerNotes: additionalData.customerNotes || null,
    internalNotes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    paidAt: null,
    shippedAt: null,
    deliveredAt: null,
    trackingNumber: null,
    trackingUrl: null,
  };
}

/**
 * Generates a unique order number
 * @returns {string} Order number (e.g., "SOH-2026-001234")
 */
function generateOrderNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `SOH-${year}-${random}`;
}

/**
 * Updates order status
 * @param {Order} order
 * @param {string} status - New order status
 * @returns {Order} Updated order
 */
export function updateOrderStatus(order, status) {
  const updates = {
    status,
    updatedAt: new Date(),
  };

  // Set timestamps based on status
  if (status === OrderStatus.SHIPPED && !order.shippedAt) {
    updates.shippedAt = new Date();
    updates.fulfillmentStatus = FulfillmentStatus.FULFILLED;
  } else if (status === OrderStatus.DELIVERED && !order.deliveredAt) {
    updates.deliveredAt = new Date();
  }

  return {
    ...order,
    ...updates,
  };
}

/**
 * Updates payment status
 * @param {Order} order
 * @param {string} paymentStatus - New payment status
 * @param {string} [transactionId] - Transaction ID
 * @returns {Order} Updated order
 */
export function updatePaymentStatus(order, paymentStatus, transactionId = null) {
  const updates = {
    paymentStatus,
    updatedAt: new Date(),
  };

  if (transactionId) {
    updates.transactionId = transactionId;
  }

  if (paymentStatus === PaymentStatus.SUCCEEDED && !order.paidAt) {
    updates.paidAt = new Date();
    updates.status = OrderStatus.CONFIRMED;
  }

  return {
    ...order,
    ...updates,
  };
}

/**
 * Validates order data
 * @param {Order} order
 * @returns {{isValid: boolean, errors: Array<string>}}
 */
export function validateOrder(order) {
  const errors = [];

  if (!order.userId) errors.push("User ID is required");
  if (!order.items || order.items.length === 0) errors.push("Order items are required");
  if (!order.shippingAddress) errors.push("Shipping address is required");
  if (!order.shippingMethod) errors.push("Shipping method is required");
  if (typeof order.total !== "number" || order.total <= 0) {
    errors.push("Valid order total is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if order can be cancelled
 * @param {Order} order
 * @returns {boolean}
 */
export function canCancelOrder(order) {
  return (
    order.status !== OrderStatus.SHIPPED &&
    order.status !== OrderStatus.DELIVERED &&
    order.status !== OrderStatus.CANCELLED &&
    order.status !== OrderStatus.REFUNDED
  );
}

/**
 * Checks if order can be refunded
 * @param {Order} order
 * @returns {boolean}
 */
export function canRefundOrder(order) {
  return (
    order.paymentStatus === PaymentStatus.SUCCEEDED &&
    order.status !== OrderStatus.REFUNDED
  );
}

export default {
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
  createOrderFromCart,
  updateOrderStatus,
  updatePaymentStatus,
  validateOrder,
  canCancelOrder,
  canRefundOrder,
};
