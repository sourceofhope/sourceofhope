/**
 * Store pricing constants shared by the cart UI and the checkout API.
 * The API recomputes every total from these values, so changing them here
 * changes what customers are actually charged.
 */
export const SHIPPING_OPTIONS = [
  {
    id: "standard",
    name: "Standard Shipping",
    time: "5-7 business days",
    cost: 5.99,
  },
  {
    id: "express",
    name: "Express Shipping",
    time: "2-3 business days",
    cost: 12.99,
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    time: "Next business day",
    cost: 24.99,
  },
];

export const STANDARD_TAX_RATE = 0.0825;
export const STANDARD_PROCESSING_RATE = 0.03;
