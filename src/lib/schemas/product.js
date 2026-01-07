/**
 * Product Schema
 * Defines the structure for product data
 */

/**
 * @typedef {Object} ProductOption
 * @property {string} id - Unique identifier for the option
 * @property {string} name - Option name (e.g., "Size", "Color")
 * @property {string} type - Option type ("dropdown", "radio", "checkbox")
 * @property {Array<{value: string, label: string, priceModifier?: number}>} values - Available values
 * @property {boolean} required - Whether this option is required
 */

/**
 * @typedef {Object} ProductImage
 * @property {string} id - Unique identifier for the image
 * @property {string} url - Image URL
 * @property {string} alt - Alt text for accessibility
 * @property {boolean} isPrimary - Whether this is the primary image
 * @property {number} order - Display order
 */

/**
 * @typedef {Object} Product
 * @property {string} id - Unique product identifier
 * @property {string} name - Product name
 * @property {string} slug - URL-friendly product identifier
 * @property {number} price - Base price in cents
 * @property {number} [compareAtPrice] - Original price for sale items (in cents)
 * @property {string} shortDescription - Brief product summary
 * @property {string} description - Full product description (supports HTML/Markdown)
 * @property {Array<ProductImage>} images - Product images
 * @property {Array<ProductOption>} options - Product configuration options (size, quantity, etc.)
 * @property {string} sku - Stock keeping unit
 * @property {number} inventory - Available quantity (-1 for unlimited)
 * @property {boolean} inStock - Current stock status
 * @property {string} category - Product category
 * @property {Array<string>} tags - Product tags for filtering
 * @property {Array<string>} relatedProductIds - IDs of related products
 * @property {Object} metadata - Additional custom fields
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {boolean} isActive - Whether product is visible
 * @property {number} weight - Product weight in grams (for shipping)
 * @property {Object} dimensions - Product dimensions {length, width, height} in cm
 */

/**
 * Creates a new product object with default values
 * @param {Partial<Product>} data - Product data
 * @returns {Product}
 */
export function createProduct(data = {}) {
  return {
    id: data.id || crypto.randomUUID(),
    name: data.name || "",
    slug: data.slug || "",
    price: data.price || 0,
    compareAtPrice: data.compareAtPrice || null,
    shortDescription: data.shortDescription || "",
    description: data.description || "",
    images: data.images || [],
    options: data.options || [],
    sku: data.sku || "",
    inventory: data.inventory ?? -1,
    inStock: data.inStock ?? true,
    category: data.category || "general",
    tags: data.tags || [],
    relatedProductIds: data.relatedProductIds || [],
    metadata: data.metadata || {},
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
    isActive: data.isActive ?? true,
    weight: data.weight || 0,
    dimensions: data.dimensions || { length: 0, width: 0, height: 0 },
  };
}

/**
 * Validates product data
 * @param {Product} product
 * @returns {{isValid: boolean, errors: Array<string>}}
 */
export function validateProduct(product) {
  const errors = [];

  if (!product.name) errors.push("Product name is required");
  if (!product.slug) errors.push("Product slug is required");
  if (typeof product.price !== "number" || product.price < 0) {
    errors.push("Valid price is required");
  }
  if (!product.images || product.images.length === 0) {
    errors.push("At least one product image is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates final product price with selected options
 * @param {Product} product
 * @param {Object<string, string>} selectedOptions - Selected option values
 * @returns {number} Final price in cents
 */
export function calculateProductPrice(product, selectedOptions = {}) {
  let finalPrice = product.price;

  product.options.forEach((option) => {
    const selectedValue = selectedOptions[option.id];
    if (selectedValue) {
      const optionValue = option.values.find((v) => v.value === selectedValue);
      if (optionValue?.priceModifier) {
        finalPrice += optionValue.priceModifier;
      }
    }
  });

  return finalPrice;
}

export default {
  createProduct,
  validateProduct,
  calculateProductPrice,
};
