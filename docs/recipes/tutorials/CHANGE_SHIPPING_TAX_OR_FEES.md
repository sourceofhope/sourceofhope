# Change Shipping, Tax, or Processing Fees

Store shipping prices, the sales tax rate, and the optional processing fee are constants in code. Changing them changes what customers are actually charged.

---

## Store Pricing: One File

All store pricing constants live in:

- `/src/lib/store-constants.ts`

```ts
export const SHIPPING_OPTIONS = [
  { id: "standard", name: "Standard Shipping", time: "5-7 business days", cost: 5.99 },
  { id: "express", name: "Express Shipping", time: "2-3 business days", cost: 12.99 },
  { id: "overnight", name: "Overnight Shipping", time: "Next business day", cost: 24.99 },
];

export const STANDARD_TAX_RATE = 0.0825;
export const STANDARD_PROCESSING_RATE = 0.03;
```

This file is imported by both:

- the cart UI (`/src/context/StoreCartContext.tsx`), which shows the estimate, and
- the server pricing function `quoteStoreOrder` (`/src/lib/store-pricing.ts`), which computes the real charge for every checkout route.

Because both read the same constants, the cart and the charge stay in sync automatically. Edit only this file.

How totals are computed (same rounding on both sides):

- subtotal = sum of Sanity product price × quantity
- tax = subtotal × `STANDARD_TAX_RATE`
- processing fee (only if the customer opts in) = (subtotal + tax + shipping) × `STANDARD_PROCESSING_RATE`
- total = subtotal + shipping + tax + processing fee

---

## Common Changes

Change a shipping price or label: edit `cost`, `name`, or `time` in `SHIPPING_OPTIONS`.

Add a shipping option: add an object with a new unique `id`. The cart's shipping selector lists every option.

Remove a shipping option: delete it, but keep a `standard` option. The cart defaults to `"standard"`, and the server falls back to the first option if it receives an unknown id.

Change the tax rate: edit `STANDARD_TAX_RATE` (e.g. `0.0825` = 8.25%). The cart labels tax as an estimate.

Change the processing fee: edit `STANDARD_PROCESSING_RATE`. Also update any user-facing text that states the percentage, such as the "(3%)" labels in `/src/app/api/checkout/create-paypal-order/route.ts` ("Processing Fee Coverage (3%)") and `/src/app/api/checkout/create-stripe-checkout/route.tsx` ("Supporting 100% of the mission (3%)"), and the UI copy in `/src/components/store/cart/CartShippingSection.tsx` and `/src/components/store/checkout/SelfCheckoutSection.tsx` (search `/src` for `3%` to catch any others).

---

## What Follows Automatically

- **Self checkout** (Stripe Elements): the PaymentIntent and its draft invoice use the server quote.
- **Stripe Checkout**: shipping becomes a fixed-amount shipping option, and tax and processing are added as line items.
- **PayPal**: the order's item total, shipping, and tax breakdown use the server quote.

`STRIPE_SALES_TAX_RATE_ID` is only stored as metadata on Stripe Checkout sessions. It does not set the rate; the app computes tax itself.

Self checkout compares the total the page showed against the server's quote. A customer who loaded the cart before your deploy will get "Prices in your cart have changed..." (`409`) and needs to refresh. That is expected.

---

## Donations Are Separate

The donation processing fee on `/donate` does **not** use `store-constants.ts`. It is defined twice and both must match:

- `PROCESSING_RATE` in `/src/app/api/checkout/create-donation-payment-intent/route.tsx` (what is charged)
- `STANDARD_PROCESSING_RATE` near the top of `/src/components/donate/DonateFormSection.tsx` (what the form displays)

The donation fee is 3% of the donation amount (no tax or shipping). Donation limits (`MAX_DONATION` $100,000, $0.50 minimum) are in the same route.

Memberships have no processing fee option.

---

## Test

With Stripe test keys and PayPal sandbox credentials in `.env.local`:

1. Add products to the cart; check subtotal, shipping, tax, and fee on `/store/cart` for each shipping option, with and without the fee
2. Pay with self checkout (`4242 4242 4242 4242`) and confirm the Stripe PaymentIntent amount equals the cart total
3. Pay with Stripe Checkout (express) and confirm the session's line items and shipping
4. Pay with PayPal (sandbox buyer) and confirm the order total
5. For donation fee changes, donate with "cover fees" on and off and compare the form total with the PaymentIntent amount

---

## Validation checklist

- Cart, Stripe, and PayPal all show the same total to the cent
- Text that mentions percentages or shipping prices matches the new values
- `npm run lint` and `npm run build` pass
- `/docs/developers/10_PAYMENTS_AND_CHECKOUT.md` still matches
