/**
 * Review Schema
 * Defines the structure for product reviews and ratings
 */

/**
 * @typedef {Object} Review
 * @property {string} id - Unique review identifier
 * @property {string} productId - Reference to product
 * @property {string} userId - Reference to user who wrote review
 * @property {string} userName - Display name of reviewer
 * @property {number} rating - Star rating (1-5)
 * @property {string} title - Review title/headline
 * @property {string} comment - Review text content
 * @property {Array<string>} images - Review images URLs
 * @property {boolean} isVerifiedPurchase - Whether reviewer purchased the product
 * @property {number} helpfulCount - Number of users who found this helpful
 * @property {number} notHelpfulCount - Number of users who found this not helpful
 * @property {string} [orderId] - Associated order ID (for verified purchases)
 * @property {string} status - Review status ("pending", "approved", "rejected")
 * @property {string} [moderationNotes] - Internal moderation notes
 * @property {Date} createdAt - Review creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {Object} [vendorResponse] - Response from vendor/admin
 * @property {string} [vendorResponse.text] - Response text
 * @property {Date} [vendorResponse.createdAt] - Response timestamp
 */

/**
 * @typedef {Object} ProductRatingSummary
 * @property {string} productId - Product ID
 * @property {number} averageRating - Average rating (1-5, with decimals)
 * @property {number} totalReviews - Total number of reviews
 * @property {Object} ratingDistribution - Count of each rating level
 * @property {number} ratingDistribution.1 - Count of 1-star reviews
 * @property {number} ratingDistribution.2 - Count of 2-star reviews
 * @property {number} ratingDistribution.3 - Count of 3-star reviews
 * @property {number} ratingDistribution.4 - Count of 4-star reviews
 * @property {number} ratingDistribution.5 - Count of 5-star reviews
 * @property {number} verifiedPurchaseCount - Count of verified purchase reviews
 * @property {Date} lastReviewedAt - Timestamp of most recent review
 */

/**
 * Review status enum
 */
export const ReviewStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

/**
 * Creates a new review object with default values
 * @param {Partial<Review>} data - Review data
 * @returns {Review}
 */
export function createReview(data = {}) {
  return {
    id: data.id || crypto.randomUUID(),
    productId: data.productId || "",
    userId: data.userId || "",
    userName: data.userName || "Anonymous",
    rating: data.rating || 5,
    title: data.title || "",
    comment: data.comment || "",
    images: data.images || [],
    isVerifiedPurchase: data.isVerifiedPurchase || false,
    helpfulCount: data.helpfulCount || 0,
    notHelpfulCount: data.notHelpfulCount || 0,
    orderId: data.orderId || null,
    status: data.status || ReviewStatus.PENDING,
    moderationNotes: data.moderationNotes || null,
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
    vendorResponse: data.vendorResponse || null,
  };
}

/**
 * Validates review data
 * @param {Review} review
 * @returns {{isValid: boolean, errors: Array<string>}}
 */
export function validateReview(review) {
  const errors = [];

  if (!review.productId) errors.push("Product ID is required");
  if (!review.userId) errors.push("User ID is required");
  if (typeof review.rating !== "number" || review.rating < 1 || review.rating > 5) {
    errors.push("Rating must be between 1 and 5");
  }
  if (!review.comment || review.comment.trim().length < 10) {
    errors.push("Review comment must be at least 10 characters");
  }
  if (review.title && review.title.length > 200) {
    errors.push("Review title cannot exceed 200 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates rating summary for a product
 * @param {Array<Review>} reviews - All approved reviews for a product
 * @returns {ProductRatingSummary}
 */
export function calculateRatingSummary(reviews) {
  const approvedReviews = reviews.filter(
    (r) => r.status === ReviewStatus.APPROVED
  );

  if (approvedReviews.length === 0) {
    return {
      productId: reviews[0]?.productId || "",
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      verifiedPurchaseCount: 0,
      lastReviewedAt: null,
    };
  }

  const totalReviews = approvedReviews.length;
  const ratingSum = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = ratingSum / totalReviews;

  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let verifiedPurchaseCount = 0;

  approvedReviews.forEach((review) => {
    ratingDistribution[review.rating]++;
    if (review.isVerifiedPurchase) {
      verifiedPurchaseCount++;
    }
  });

  const lastReviewedAt = approvedReviews.reduce((latest, review) => {
    return review.createdAt > latest ? review.createdAt : latest;
  }, approvedReviews[0].createdAt);

  return {
    productId: approvedReviews[0].productId,
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews,
    ratingDistribution,
    verifiedPurchaseCount,
    lastReviewedAt,
  };
}

/**
 * Sorts reviews by helpfulness
 * @param {Array<Review>} reviews
 * @returns {Array<Review>} Sorted reviews
 */
export function sortReviewsByHelpfulness(reviews) {
  return [...reviews].sort((a, b) => {
    // Prioritize verified purchases
    if (a.isVerifiedPurchase !== b.isVerifiedPurchase) {
      return a.isVerifiedPurchase ? -1 : 1;
    }

    // Then sort by helpful votes (helpful - not helpful)
    const aScore = a.helpfulCount - a.notHelpfulCount;
    const bScore = b.helpfulCount - b.notHelpfulCount;

    if (aScore !== bScore) {
      return bScore - aScore;
    }

    // Finally sort by date (most recent first)
    return b.createdAt - a.createdAt;
  });
}

/**
 * Filters reviews by rating
 * @param {Array<Review>} reviews
 * @param {Array<number>} ratings - Rating values to filter by (e.g., [4, 5])
 * @returns {Array<Review>}
 */
export function filterReviewsByRating(reviews, ratings) {
  return reviews.filter((review) => ratings.includes(review.rating));
}

/**
 * Filters reviews to show only verified purchases
 * @param {Array<Review>} reviews
 * @returns {Array<Review>}
 */
export function filterVerifiedPurchases(reviews) {
  return reviews.filter((review) => review.isVerifiedPurchase);
}

/**
 * Adds a helpful vote to a review
 * @param {Review} review
 * @param {boolean} isHelpful - True for helpful, false for not helpful
 * @returns {Review} Updated review
 */
export function addHelpfulVote(review, isHelpful = true) {
  return {
    ...review,
    helpfulCount: isHelpful ? review.helpfulCount + 1 : review.helpfulCount,
    notHelpfulCount: !isHelpful
      ? review.notHelpfulCount + 1
      : review.notHelpfulCount,
    updatedAt: new Date(),
  };
}

/**
 * Adds vendor response to review
 * @param {Review} review
 * @param {string} responseText
 * @returns {Review} Updated review
 */
export function addVendorResponse(review, responseText) {
  return {
    ...review,
    vendorResponse: {
      text: responseText,
      createdAt: new Date(),
    },
    updatedAt: new Date(),
  };
}

/**
 * Checks if user can review a product (based on purchase history)
 * @param {string} userId
 * @param {string} productId
 * @param {Array<import('./payment').Order>} userOrders
 * @returns {boolean}
 */
export function canUserReviewProduct(userId, productId, userOrders) {
  // Check if user has purchased this product
  return userOrders.some((order) =>
    order.items.some((item) => item.productId === productId)
  );
}

export default {
  ReviewStatus,
  createReview,
  validateReview,
  calculateRatingSummary,
  sortReviewsByHelpfulness,
  filterReviewsByRating,
  filterVerifiedPurchases,
  addHelpfulVote,
  addVendorResponse,
  canUserReviewProduct,
};
