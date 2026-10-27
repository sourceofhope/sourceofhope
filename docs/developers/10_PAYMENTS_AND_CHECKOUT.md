# Payments and Checkout

The site takes money in three ways:

1. **Store** — merchandise from Sanity, paid by card (Stripe Payment Element), Stripe Checkout, or PayPal
2. **Donations** — one-time gifts on `/donate` (Stripe Payment Element)
3. **Memberships** — monthly subscriptions on `/members` (Stripe Payment Element + Stripe Billing)

All payment logic runs in API routes under `/src/app/api/checkout`. The governing rule: **the server decides every amount**. The browser sends what the customer chose; the server looks up prices and computes totals.

---

## Pricing Rules

Store (`/src/lib/store-constants.ts`, shared by the cart UI and the server):

| Item            | Value                                                         |
| --------------- | ------------------------------------------------------------- |
| Shipping        | standard $5.99 · express $12.99 · overnight $24.99            |
| Tax             | 8.25% of subtotal                                             |
| Processing fee  | 3% of (subtotal + tax + shipping), only if the customer opts in |

Rounding matches the cart UI (`parseFloat(x.toFixed(2))` per component, then sum). Change these values in one place: `/docs/recipes/tutorials/CHANGE_SHIPPING_TAX_OR_FEES.md`.

Donations: optional 3% fee on the donation amount (`PROCESSING_RATE` in the donation route).

Memberships: plan table in the membership route (see below).

---

## Store Cart

- State: `StoreCartContext` (`/src/context/StoreCartContext.tsx`), saved to `localStorage`
- Line identity: product `id` + `size`
- `useCartActions()` exposes `addToCart`, `updateCartItem`, `removeFromCart(id, size?)`, `clearCart`, `getCartItemCount`, `getCartCost`, `getTaxCost`, `getShippingCost`, `getProcessingFeeCost`, `getCartTotal`, `updateShippingMethod`, `updateProcessingFee`
- Pages: `/store` → `/store/product/[id]` → `/store/cart` → `/store/checkout` → `/store/success`
- The floating cart button (`/src/components/store/Cart.tsx`) shows the item count, capped at "99+"

The browser's prices are for display. Checkout routes call `quoteStoreOrder()` (`/src/lib/store-pricing.ts`), which:

- accepts only product ids, quantities (1–99), sizes, shipping method id, and the fee opt-in
- loads each product from Sanity (`fetchProductById`) and rejects missing or unpriced products
- returns lines, subtotal, shipping, tax, processing fee, and total

---

## Store: Self Checkout (card form)

Component: `/src/components/store/checkout/SelfCheckoutSection.tsx`

1. Fetch the publishable key (`POST /api/checkout/retrieve-stripe-publishable-key`).
2. `POST /api/checkout/create-stripe-payment-intent` with items, shipping method, fee opt-in, email, shipping address, and `totalAmount` (what the page showed).
3. Server quotes the order. If the quote differs from `totalAmount` by even a cent → `409`, so the customer is never charged a different amount than displayed.
4. Server creates/reuses a Stripe customer (guest customer when no email), a **draft invoice** with itemized lines (products, shipping, tax, fee), and a PaymentIntent whose metadata includes `invoice_id`.
5. The browser confirms the payment with the Payment Element.
6. Stripe sends `payment_intent.succeeded` to the webhook, which finalizes the invoice and marks it paid (see Webhook).
7. The success page checks `retrieve-stripe-payment-intent-status`.

The invoice gives staff an itemized record in the Stripe Dashboard.

---

## Store: Express Checkout

Component: `/src/components/store/checkout/ExpressCheckoutSection.tsx`

- Buttons come from `GET /api/checkout-providers` (Sanity Checkout Provider documents with `enabled: true`).
- Dispatch uses the provider `name`: `"Stripe"` or `"PayPal"`. `"Google Pay"` / `"Apple Pay"` are placeholders (TODO in the component).

Stripe Checkout:

- `POST /api/checkout/create-stripe-checkout` → `{ url }`; the browser redirects to Stripe.
- Products, tax, and processing fee are line items; shipping is a fixed-amount shipping option; US shipping address and billing address are required.
- Returns to `/store/success?session_id=...`; status via `retrieve-stripe-session-status`.

PayPal:

- `POST /api/checkout/create-paypal-order` → `{ approvalUrl }`; the browser redirects to PayPal.
- Returns to `/store/success?token=<orderId>`.
- `GET /api/checkout/retrieve-paypal-order-status` **captures** the approved order (idempotent) and reports `complete`. If the buyer never reaches the success page, the order stays approved but uncaptured and no money moves.

Both express routes build `return_url`/`cancel_url` from the request origin, never from the request body.

---

## Success Page

`/src/app/store/success/page.tsx` (client):

- Reads `session_id`, `token`, or `payment_intent` from the URL and calls the matching status route
- On success: clears the cart, resets the fee opt-in, pushes a GTM `purchase` event
- Product cards and product detail push GTM `add_to_cart` events

---

## Donations

Page `/donate` (server) wraps `DonateFormSection` (client).

1. `POST /api/checkout/create-donation-payment-intent` with `amount`, `coverFee`, and optional `email`, `firstName`, `lastName`, `dedication`.
2. Server validates (> $0, ≤ $100,000, total ≥ $0.50), adds the 3% fee if opted in, stores donor details in PaymentIntent metadata, sets `receipt_email`.
3. Browser confirms with the Payment Element (`redirect: "if_required"`).
4. For redirect-based payment methods Stripe returns to `/donate?...&redirect_status=succeeded`; the page reads `redirect_status` and shows the confirmation.

Donations do not create invoices and are not touched by the webhook.

---

## Memberships

Page `/members`; plan cards in `/src/components/members/MembersPlansSection.tsx`; checkout in `/src/components/members/MembersCheckoutSection.tsx`.

Server plan table (`membershipProducts` in `/src/app/api/checkout/create-membership-payment-intent/route.tsx`):

| Plan id      | Type       | Monthly price                     |
| ------------ | ---------- | --------------------------------- |
| `individual` | individual | Member chooses, $1–$10,000        |
| `partner`    | company    | $50                               |
| `sponsor`    | company    | $100                              |
| `champion`   | company    | $500                              |
| `bronze`, `silver`, `gold` | legacy | No price — rejected     |

Flow:

1. Validate contact details (company plans need company and contact names; individual needs first and last name).
2. Reuse an existing Stripe customer by email (never modified, since the route is unauthenticated) or create one.
3. Retrieve or create the Stripe product `prod_membership_<plan>`; find or create an active monthly price for the amount.
4. Create a subscription with `payment_behavior: "default_incomplete"` and copy metadata onto its PaymentIntent.
5. Return the PaymentIntent `clientSecret`; the browser confirms the first payment. Stripe Billing charges monthly after that.

The UI and the server table must agree. Recipe: `/docs/recipes/tutorials/UPDATE_MEMBERSHIP_PLANS.md`.

---

## Webhook

`POST /api/checkout/stripe-webhook` handles `payment_intent.succeeded` for store self-checkout:

1. Verify the signature with `STRIPE_WEBHOOK_SECRET` against the raw body.
2. If the PaymentIntent has `metadata.invoice_id`, finalize the draft invoice.
3. If `amount_received` is less than the invoice total, set `checkout_status: amount_mismatch` and stop (never mark an underpaid order paid).
4. Otherwise mark the invoice paid out of band and set `checkout_status: paid`.

PaymentIntents without `invoice_id` (donations, memberships, Stripe Checkout) are acknowledged and ignored.

Setup per environment: `/docs/developers/07_DEPLOYMENT.md`.

---

## Testing

Use Stripe test keys and the PayPal sandbox (`PAYPAL_API=development`).

| Result  | Card number           |
| ------- | --------------------- |
| Success | `4242 4242 4242 4242` |
| Decline | `4000 0000 0000 0002` |

Any future expiry date and any CVC. For PayPal, sign in with a sandbox buyer account from the PayPal Developer Dashboard.

Problems: `/docs/recipes/fixes/FIX_PAYMENT_AND_WEBHOOK_ISSUES.md`.
