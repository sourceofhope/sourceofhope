/**
 * Cart Schema
 * Defines the structure for shopping cart data
 */

/**
 * @typedef {Object} CartItem
 * @property {string} id - Unique cart item identifier
 * @property {string} productId - Reference to product
 * @property {string} productName - Product name (cached)
 * @property {string} productImage - Primary product image URL (cached)
 * @property {number} quantity - Quantity of items
 * @property {number} unitPrice - Price per unit in cents
 * @property {Object<string, string>} selectedOptions - Selected product options {optionId: value}
 * @property {string} [selectedSize] - Quick access to size if applicable
 * @property {Object} metadata - Additional item data
 */

/**
 * @typedef {Object} ShippingAddress
 * @property {string} fullName - Recipient full name
 * @property {string} addressLine1 - Street address line 1
 * @property {string} [addressLine2] - Street address line 2
 * @property {string} city - City
 * @property {string} state - State/Province
 * @property {string} postalCode - ZIP/Postal code
 * @property {string} country - Country code (e.g., "US")
 * @property {string} [phone] - Contact phone number
 */

/**
 * @typedef {Object} ShippingMethod
 * @property {string} id - Shipping method identifier
 * @property {string} name - Display name (e.g., "Standard", "Express")
 * @property {number} cost - Shipping cost in cents
 * @property {string} estimatedDays - Delivery estimate (e.g., "3-5 business days")
 */

/**
 * @typedef {Object} Cart
 * @property {string} id - Unique cart identifier
 * @property {string} [userId] - Associated user ID (null for guest)
 * @property {Array<CartItem>} items - Cart items
 * @property {ShippingAddress} [shippingAddress] - Shipping address
 * @property {ShippingMethod} [shippingMethod] - Selected shipping method
 * @property {string} [couponCode] - Applied coupon code
 * @property {number} [discount] - Discount amount in cents
 * @property {number} subtotal - Subtotal before shipping/tax in cents
 * @property {number} shippingCost - Shipping cost in cents
 * @property {number} tax - Tax amount in cents
 * @property {number} total - Final total in cents
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {Date} [expiresAt] - Cart expiration (for guest carts)
 */

/**
 * Creates a new cart object with default values
 * @param {Partial<Cart>} data - Cart data
 * @returns {Cart}
 */
export function createCart(data = {}) {
  return {
    id: data.id || crypto.randomUUID(),
    userId: data.userId || null,
    items: data.items || [],
    shippingAddress: data.shippingAddress || null,
    shippingMethod: data.shippingMethod || null,
    couponCode: data.couponCode || null,
    discount: data.discount || 0,
    subtotal: data.subtotal || 0,
    shippingCost: data.shippingCost || 0,
    tax: data.tax || 0,
    total: data.total || 0,
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
    expiresAt: data.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };
}

/**
 * Creates a new cart item
 * @param {Partial<CartItem>} data - Cart item data
 * @returns {CartItem}
 */
export function createCartItem(data = {}) {
  return {
    id: data.id || crypto.randomUUID(),
    productId: data.productId || "",
    productName: data.productName || "",
    productImage: data.productImage || "",
    quantity: data.quantity || 1,
    unitPrice: data.unitPrice || 0,
    selectedOptions: data.selectedOptions || {},
    selectedSize: data.selectedSize || null,
    metadata: data.metadata || {},
  };
}

/**
 * Calculates cart totals
 * @param {Cart} cart
 * @param {number} [taxRate=0.0825] - Tax rate (default 8.25% for Texas)
 * @returns {Cart} Updated cart with calculated totals
 */
export function calculateCartTotals(cart, taxRate = 0.0825) {
  // Calculate subtotal
  const subtotal = cart.items.reduce((sum, item) => {
    return sum + item.unitPrice * item.quantity;
  }, 0);

  // Apply discount
  const discountAmount = cart.discount || 0;
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);

  // Calculate tax (on subtotal after discount)
  const tax = Math.round(subtotalAfterDiscount * taxRate);

  // Calculate total
  const total = subtotalAfterDiscount + cart.shippingCost + tax;

  return {
    ...cart,
    subtotal,
    tax,
    total,
    updatedAt: new Date(),
  };
}

/**
 * Adds an item to the cart
 * @param {Cart} cart
 * @param {CartItem} item
 * @returns {Cart} Updated cart
 */
export function addItemToCart(cart, item) {
  // Check if item with same product and options exists
  const existingItemIndex = cart.items.findIndex(
    (i) =>
      i.productId === item.productId &&
      JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions)
  );

  let updatedItems;
  if (existingItemIndex >= 0) {
    // Update quantity of existing item
    updatedItems = cart.items.map((i, idx) =>
      idx === existingItemIndex
        ? { ...i, quantity: i.quantity + item.quantity }
        : i
    );
  } else {
    // Add new item
    updatedItems = [...cart.items, item];
  }

  return calculateCartTotals({
    ...cart,
    items: updatedItems,
  });
}

/**
 * Removes an item from the cart
 * @param {Cart} cart
 * @param {string} itemId
 * @returns {Cart} Updated cart
 */
export function removeItemFromCart(cart, itemId) {
  const updatedItems = cart.items.filter((item) => item.id !== itemId);
  return calculateCartTotals({
    ...cart,
    items: updatedItems,
  });
}

/**
 * Updates item quantity
 * @param {Cart} cart
 * @param {string} itemId
 * @param {number} quantity
 * @returns {Cart} Updated cart
 */
export function updateItemQuantity(cart, itemId, quantity) {
  if (quantity <= 0) {
    return removeItemFromCart(cart, itemId);
  }

  const updatedItems = cart.items.map((item) =>
    item.id === itemId ? { ...item, quantity } : item
  );

  return calculateCartTotals({
    ...cart,
    items: updatedItems,
  });
}

/**
 * Gets cart item count
 * @param {Cart} cart
 * @returns {number} Total number of items
 */
export function getCartItemCount(cart) {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Validates cart for checkout
 * @param {Cart} cart
 * @returns {{isValid: boolean, errors: Array<string>}}
 */
export function validateCart(cart) {
  const errors = [];

  if (!cart.items || cart.items.length === 0) {
    errors.push("Cart is empty");
  }

  if (!cart.shippingAddress) {
    errors.push("Shipping address is required");
  } else {
    if (!cart.shippingAddress.fullName) errors.push("Recipient name is required");
    if (!cart.shippingAddress.addressLine1) errors.push("Address is required");
    if (!cart.shippingAddress.city) errors.push("City is required");
    if (!cart.shippingAddress.state) errors.push("State is required");
    if (!cart.shippingAddress.postalCode) errors.push("Postal code is required");
    if (!cart.shippingAddress.country) errors.push("Country is required");
  }

  if (!cart.shippingMethod) {
    errors.push("Shipping method is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export default {
  createCart,
  createCartItem,
  calculateCartTotals,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  getCartItemCount,
  validateCart,
};
