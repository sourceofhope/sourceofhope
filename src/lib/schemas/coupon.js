/**
 * Coupon Schema
 * Defines the structure for coupons and promotional codes
 */

/**
 * @typedef {Object} Coupon
 * @property {string} id - Unique coupon identifier
 * @property {string} code - Coupon code (e.g., "WELCOME10", "SUMMER25")
 * @property {string} type - Discount type ("percentage", "fixed_amount", "free_shipping")
 * @property {number} value - Discount value (percentage or cents)
 * @property {string} description - Public coupon description
 * @property {number} [minPurchase] - Minimum purchase amount in cents
 * @property {number} [maxDiscount] - Maximum discount amount in cents (for percentage)
 * @property {Array<string>} [applicableProducts] - Product IDs this coupon applies to (empty for all)
 * @property {Array<string>} [applicableCategories] - Categories this coupon applies to
 * @property {Array<string>} [excludedProducts] - Product IDs excluded from discount
 * @property {number} [usageLimit] - Maximum number of times code can be used
 * @property {number} usageCount - Number of times used
 * @property {number} [usageLimitPerUser] - Max uses per user
 * @property {boolean} firstOrderOnly - Only valid for first-time customers
 * @property {boolean} isActive - Whether coupon is currently active
 * @property {Date} validFrom - Coupon valid start date
 * @property {Date} validUntil - Coupon expiration date
 * @property {Object} metadata - Additional coupon data
 * @property {string} [partnerName] - Partner organization name
 * @property {string} [partnerLogo] - Partner logo URL
 * @property {boolean} isFeatured - Whether to feature on shop page
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * Coupon type enum
 */
export const CouponType = {
  PERCENTAGE: "percentage",
  FIXED_AMOUNT: "fixed_amount",
  FREE_SHIPPING: "free_shipping",
};

/**
 * Creates a new coupon object with default values
 * @param {Partial<Coupon>} data - Coupon data
 * @returns {Coupon}
 */
export function createCoupon(data = {}) {
  return {
    id: data.id || crypto.randomUUID(),
    code: data.code?.toUpperCase() || "",
    type: data.type || CouponType.PERCENTAGE,
    value: data.value || 0,
    description: data.description || "",
    minPurchase: data.minPurchase || null,
    maxDiscount: data.maxDiscount || null,
    applicableProducts: data.applicableProducts || [],
    applicableCategories: data.applicableCategories || [],
    excludedProducts: data.excludedProducts || [],
    usageLimit: data.usageLimit || null,
    usageCount: data.usageCount || 0,
    usageLimitPerUser: data.usageLimitPerUser || null,
    firstOrderOnly: data.firstOrderOnly || false,
    isActive: data.isActive ?? true,
    validFrom: data.validFrom || new Date(),
    validUntil: data.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    metadata: data.metadata || {},
    partnerName: data.partnerName || null,
    partnerLogo: data.partnerLogo || null,
    isFeatured: data.isFeatured || false,
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
  };
}

/**
 * Validates a coupon
 * @param {Coupon} coupon
 * @returns {{isValid: boolean, errors: Array<string>}}
 */
export function validateCoupon(coupon) {
  const errors = [];

  if (!coupon.code) errors.push("Coupon code is required");
  if (!coupon.type) errors.push("Coupon type is required");
  if (typeof coupon.value !== "number" || coupon.value <= 0) {
    errors.push("Valid discount value is required");
  }

  if (coupon.type === CouponType.PERCENTAGE && coupon.value > 100) {
    errors.push("Percentage discount cannot exceed 100%");
  }

  if (coupon.validUntil <= coupon.validFrom) {
    errors.push("Valid until date must be after valid from date");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if coupon is currently valid
 * @param {Coupon} coupon
 * @param {Object} [options] - Validation options
 * @param {string} [options.userId] - User ID to check per-user limits
 * @param {boolean} [options.isFirstOrder] - Whether this is user's first order
 * @returns {{isValid: boolean, reason?: string}}
 */
export function isCouponValid(coupon, options = {}) {
  const now = new Date();

  if (!coupon.isActive) {
    return { isValid: false, reason: "This coupon is no longer active" };
  }

  if (now < coupon.validFrom) {
    return { isValid: false, reason: "This coupon is not yet valid" };
  }

  if (now > coupon.validUntil) {
    return { isValid: false, reason: "This coupon has expired" };
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { isValid: false, reason: "This coupon has reached its usage limit" };
  }

  if (coupon.firstOrderOnly && !options.isFirstOrder) {
    return { isValid: false, reason: "This coupon is only valid for first-time orders" };
  }

  return { isValid: true };
}

/**
 * Calculates discount amount for a cart
 * @param {Coupon} coupon
 * @param {import('./cart').Cart} cart
 * @returns {{discountAmount: number, appliedToItems: Array<string>}}
 */
export function calculateDiscount(coupon, cart) {
  let eligibleSubtotal = 0;
  const appliedToItems = [];

  // Calculate eligible subtotal
  cart.items.forEach((item) => {
    const isApplicable = isCouponApplicableToProduct(
      coupon,
      item.productId,
      item.metadata?.category
    );

    if (isApplicable) {
      eligibleSubtotal += item.unitPrice * item.quantity;
      appliedToItems.push(item.id);
    }
  });

  // Check minimum purchase requirement
  if (coupon.minPurchase && eligibleSubtotal < coupon.minPurchase) {
    return { discountAmount: 0, appliedToItems: [] };
  }

  let discountAmount = 0;

  switch (coupon.type) {
    case CouponType.PERCENTAGE:
      discountAmount = Math.round((eligibleSubtotal * coupon.value) / 100);
      // Apply max discount cap if set
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
      break;

    case CouponType.FIXED_AMOUNT:
      discountAmount = Math.min(coupon.value, eligibleSubtotal);
      break;

    case CouponType.FREE_SHIPPING:
      // Free shipping is handled separately in cart calculation
      discountAmount = 0;
      break;
  }

  return {
    discountAmount: Math.max(0, discountAmount),
    appliedToItems,
  };
}

/**
 * Checks if coupon applies to a specific product
 * @param {Coupon} coupon
 * @param {string} productId
 * @param {string} [category]
 * @returns {boolean}
 */
export function isCouponApplicableToProduct(coupon, productId, category = null) {
  // Check if product is excluded
  if (coupon.excludedProducts.includes(productId)) {
    return false;
  }

  // If no restrictions, applies to all products
  if (
    coupon.applicableProducts.length === 0 &&
    coupon.applicableCategories.length === 0
  ) {
    return true;
  }

  // Check product-specific applicability
  if (coupon.applicableProducts.includes(productId)) {
    return true;
  }

  // Check category applicability
  if (category && coupon.applicableCategories.includes(category)) {
    return true;
  }

  return false;
}

/**
 * Applies coupon to cart
 * @param {import('./cart').Cart} cart
 * @param {Coupon} coupon
 * @returns {import('./cart').Cart} Updated cart with discount applied
 */
export function applyCouponToCart(cart, coupon) {
  const { discountAmount } = calculateDiscount(coupon, cart);

  let updatedCart = {
    ...cart,
    couponCode: coupon.code,
    discount: discountAmount,
  };

  // Handle free shipping
  if (coupon.type === CouponType.FREE_SHIPPING) {
    updatedCart.shippingCost = 0;
  }

  // Recalculate totals with updated discount/shipping
  return {
    ...updatedCart,
    updatedAt: new Date(),
  };
}

/**
 * Gets featured partner coupons for shop page
 * @param {Array<Coupon>} coupons
 * @returns {Array<Coupon>}
 */
export function getFeaturedCoupons(coupons) {
  const now = new Date();

  return coupons
    .filter(
      (coupon) =>
        coupon.isFeatured &&
        coupon.isActive &&
        coupon.partnerName &&
        coupon.validFrom <= now &&
        coupon.validUntil >= now &&
        (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit)
    )
    .sort((a, b) => b.value - a.value); // Sort by discount value descending
}

export default {
  CouponType,
  createCoupon,
  validateCoupon,
  isCouponValid,
  calculateDiscount,
  isCouponApplicableToProduct,
  applyCouponToCart,
  getFeaturedCoupons,
};
