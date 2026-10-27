# Debug Payment and Webhook Issues

Payments run through Route Handlers under `/src/app/api/checkout/`. There are four flows:

| Flow | Page | Provider | Route(s) |
| ---- | ---- | -------- | -------- |
| Store self checkout | `/store/checkout` | Stripe Elements (PaymentIntent + draft invoice) | `create-stripe-payment-intent`, then the webhook |
| Store express checkout | `/store/checkout` | Stripe Checkout (hosted) or PayPal | `create-stripe-checkout`, `create-paypal-order` |
| Donation | `/donate` | Stripe Elements | `create-donation-payment-intent` |
| Membership | `/members` | Stripe subscription | `create-membership-payment-intent` |

Store prices are always computed on the server from Sanity by `quoteStoreOrder()` in `/src/lib/store-pricing.ts`. For the full design see `/docs/developers/10_PAYMENTS_AND_CHECKOUT.md`.

---

## Testing with sandbox accounts

Use test/sandbox credentials everywhere except production.

### Stripe test cards

| Result | Card number |
| ------ | ----------- |
| Success | `4242 4242 4242 4242` |
| Decline | `4000 0000 0000 0002` |

Use any future expiry date and any CVC.

### PayPal sandbox

Set `PAYPAL_API=development` (or leave it unset) so the app talks to `api.sandbox.paypal.com`, and use sandbox client credentials. Log in at the PayPal approval screen with a sandbox **buyer** account from the PayPal Developer Dashboard (not your real PayPal login).

---

## Test and live keys don't match

Each Stripe key pair belongs to one mode. Mixing them fails in confusing ways:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (`pk_test_...` / `pk_live_...`) and `STRIPE_SECRET_KEY` (`sk_test_...` / `sk_live_...`) must be the same mode. A PaymentIntent created with a live secret can't be confirmed with a test publishable key (Stripe reports it can't find the PaymentIntent).
- `STRIPE_WEBHOOK_SECRET` must belong to the webhook endpoint for that environment and mode.

PayPal is the same: `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` must come from the same app as `PAYPAL_API` (`production` → live, anything else → sandbox). A mismatch logs `PayPal auth error` / `Failed to get PayPal access token: 401` and the route returns `500 Failed to create PayPal checkout session`.

Remember that `NEXT_PUBLIC_*` values are baked in at build time: redeploy after changing them on Vercel.

---

## Stripe webhook failures

The webhook is `POST /api/checkout/stripe-webhook` (`/src/app/api/checkout/stripe-webhook/route.ts`). It verifies the `stripe-signature` header against `STRIPE_WEBHOOK_SECRET` using the raw request body, and only handles `payment_intent.succeeded`.

### Symptoms

- Stripe's dashboard shows webhook deliveries failing with 400.
- Self-checkout invoices stay in **draft** with metadata `checkout_status: pending`.

### Fixes

- **Endpoint URL:** in Stripe, each environment needs its own endpoint pointing at `https://<that environment's domain>/api/checkout/stripe-webhook`, subscribed to `payment_intent.succeeded`.
- **Secret:** copy that endpoint's signing secret (`whsec_...`) into `STRIPE_WEBHOOK_SECRET` for the matching Vercel environment, then redeploy. A secret from another endpoint or mode fails signature verification (logged as `Stripe webhook error`, response `400 Failed to process Stripe webhook`).
- **Missing header:** `400 Missing stripe-signature header.` means the request didn't come from Stripe (or a proxy stripped the header).
- **Not configured:** `500 Stripe webhook is not configured.` means `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` is missing.

### Testing locally

Use the Stripe CLI to forward events to your dev server:

```bash
stripe listen --forward-to localhost:3000/api/checkout/stripe-webhook
```

It prints a signing secret (`whsec_...`). Put it in `.env.local` as `STRIPE_WEBHOOK_SECRET` and restart `npm run dev`. Then complete a self checkout with a test card and watch the CLI output for a `200`.

(`stripe trigger payment_intent.succeeded` is useful for testing the signature only; triggered events have no `invoice_id`, so the handler just acknowledges them.)

---

## Invoice problems (self checkout only)

Only the self-checkout flow creates invoices. Stripe Checkout and PayPal orders don't.

| Invoice state | Meaning | What to do |
| ------------- | ------- | ---------- |
| Draft, `checkout_status: pending` | Payment never succeeded, or the webhook never arrived. | Check the PaymentIntent in Stripe. If it succeeded, fix the webhook and resend the event from the Stripe dashboard. |
| `checkout_status: amount_mismatch` | The amount received was less than the invoice total, so the webhook refused to mark it paid. | Investigate manually in Stripe before fulfilling the order. |
| Paid, `checkout_status: paid` | Normal. The invoice was finalized and marked paid out of band. | Nothing. |

---

## PayPal order approved but not captured

PayPal only moves money when an order is **captured**. The app captures it in `GET /api/checkout/retrieve-paypal-order-status`, which `/store/success` calls when the buyer returns with `?token=<order id>`.

If the buyer approves and then closes the tab before returning, the order stays `APPROVED` and no funds are collected. Check the order in the PayPal dashboard. The capture is idempotent (it sends `PayPal-Request-Id: capture-<token>`), so calling the status route again with that token captures it safely:

```
GET /api/checkout/retrieve-paypal-order-status?token=<PAYPAL_ORDER_ID>
```

---

## An express checkout button is missing or does nothing

Express buttons come from **Checkout Provider** documents in Sanity, served by `GET /api/checkout-providers` (enabled providers only).

- **Button missing:** the provider's **Enabled** box is off, or it isn't published. Check `/api/checkout-providers` to see what the page receives.
- **Button shows no icon:** the **Icon** field must be one of `stripe`, `paypal`, `googlepay`, `applepay`.
- **Button does nothing:** the **Name** field must be exactly `Stripe` or `PayPal`; the click handler in `/src/components/store/checkout/ExpressCheckoutSection.tsx` matches on it. `Google Pay` and `Apple Pay` buttons render but aren't implemented yet.
- Turning **Enabled** off in the Studio is the fastest way to hide a broken provider (it takes effect within about 30 seconds).

---

## "Prices in your cart have changed" (409)

`create-stripe-payment-intent` compares the total the checkout page showed with the server's own quote, to the cent. A mismatch usually means a product's price was changed in Sanity after the customer added it to their cart (the cart stores the price at the time it was added). The customer should remove and re-add the item.

If it happens for every order, check that nobody changed the totals logic in only one place. The cart (`/src/context/StoreCartContext.tsx`) and the server (`/src/lib/store-pricing.ts`) both read `/src/lib/store-constants.ts` and must use the same rounding.

Related 400s from `quoteStoreOrder()`:

- `One or more items are no longer available`: the product was deleted, unpublished, or has no positive price in Sanity.
- `Invalid item quantity`: quantity isn't an integer from 1 to 99.
- `Too many items in cart`: more than 50 line items.

---

## Membership errors

From `POST /api/checkout/create-membership-payment-intent`:

| Message | Cause |
| ------- | ----- |
| `Invalid membership type` | `membershipPlanId` isn't in the route's `membershipProducts` table, or it's a legacy plan without a price (`bronze`, `silver`, `gold`). Plan ids must match `/src/components/members/MembersPlansSection.tsx`. |
| `Invalid membership amount` | The individual plan amount is outside $1–$10,000 per month. |
| `A valid email address is required` | Email missing or malformed. |
| `Company name and contact name are required` | Company plan without those fields. |
| `First name and last name are required` | Individual plan without those fields. |

See `/docs/recipes/tutorials/UPDATE_MEMBERSHIP_PLANS.md` when changing plans.

---

## Donation errors

From `POST /api/checkout/create-donation-payment-intent`: the amount must be above 0 and at most $100,000, and the total (including the optional 3% fee) must be at least $0.50. After a redirect-based payment method, Stripe returns to `/donate` with `redirect_status=succeeded`, and the page shows the confirmation.

---

## Rate limits while testing

Checkout routes are rate limited per IP (store checkout 10, donation 5, membership 5, status lookups 30 per 10 minutes). Repeated local test runs can hit `429`; restarting `npm run dev` clears the in-memory limiter. See `/docs/recipes/fixes/FIX_API_REQUEST_ERRORS.md`.

---

## Validation checklist

- A test-card self checkout reaches `/store/success`, the cart clears, and the Stripe invoice ends up paid with `checkout_status: paid`.
- Stripe express checkout and PayPal sandbox checkout both reach `/store/success` and report complete.
- The PayPal sandbox order shows as captured (completed) in the PayPal dashboard.
- Webhook deliveries show `200` in the Stripe dashboard (or the Stripe CLI locally).
- A test donation and a test membership succeed with `4242 4242 4242 4242` and fail cleanly with `4000 0000 0000 0002`.
