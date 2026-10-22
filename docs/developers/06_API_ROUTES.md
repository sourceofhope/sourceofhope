# API Routes

The backend is a set of Next.js **Route Handlers** under `/src/app/api`. Each `route.ts` (or `route.tsx`) exports functions named after HTTP methods (`GET`, `POST`, `OPTIONS`). The URL is the folder path.

Routes deploy with the site and are called from the browser with relative URLs (`/api/...`). There are no environment prefixes (`/dev/api`, `/app/api`) and no CORS configuration.

---

## Shared Building Blocks

Defined in `/src/lib`:

- `rateLimit(request, scope, limit, windowMs)` (`rate-limit.ts`) — returns a 429 `NextResponse` when the caller's IP is over the limit, otherwise `null`.
- `readJsonObject(request)` (`validation.ts`) — returns the parsed body, or `null` if the request is not `application/json` or the body is not a JSON object.
- `getEnvironment()` (`environment.server.ts`) — the only place secrets are read.
- `quoteStoreOrder(body)`, `PricingError`, `toCents`, `getSiteOrigin(request)` (`store-pricing.ts`) — server-side store pricing.

House pattern for a POST route:

1. Rate limit
2. Check required configuration (return 500 "not configured" if a key is missing)
3. Parse the body with `readJsonObject` (400 "Invalid request body" if null)
4. Validate, trim, and length-limit every field
5. Do the work; never trust client-sent prices, totals, or URLs
6. Return generic error messages; log details with `console.error`

Template: `/docs/recipes/tutorials/ADD_AN_API_ROUTE.md`.

---

## Rate Limits

Per client IP, per serverless instance, 10-minute sliding windows. Routes sharing a scope share one budget.

| Scope            | Limit | Routes                                                                            |
| ---------------- | ----- | --------------------------------------------------------------------------------- |
| `email`          | 3     | `POST /api/email/send`                                                            |
| `donation`       | 5     | `POST /api/checkout/create-donation-payment-intent`                               |
| `membership`     | 5     | `POST /api/checkout/create-membership-payment-intent`                             |
| `store-checkout` | 10    | `create-stripe-checkout`, `create-stripe-payment-intent`, `create-paypal-order`   |
| `payment-status` | 30    | `retrieve-stripe-session-status`, `retrieve-stripe-payment-intent-status`, `retrieve-paypal-order-status` |

Over the limit: `429 { "error": "Too many requests. Please wait before trying again." }` with a `Retry-After` header (seconds).

---

## Health

`GET /api/health`

```json
{ "status": "ok", "message": "Source of Hope API is running" }
```

---

## Email

`POST /api/email/send` — `/src/app/api/email/send/route.ts`

Request body:

```json
{ "name": "Jane Doe", "email": "jane@example.com", "message": "Hello", "businessName": "" }
```

- `businessName` is a **honeypot**. If it is non-empty, the route returns success and sends nothing.
- `name` and `message` must be non-empty strings; `email` must match a basic email pattern.
- Limits: name ≤ 120, email ≤ 254, message ≤ 5000 characters.
- User input is HTML-escaped; newlines are stripped from the subject.
- Sent with Resend from `The Source of Hope <onboarding@resend.dev>` to `treasurer@thesourceofhope.org`, with `replyTo` set to the visitor.

Responses: `200 { success: true, message }`, `400 { success: false, error }`, `429`, `500` (missing `RESEND_API_KEY` or unexpected error), `502` (Resend rejected the send).

---

## Store Checkout

All three routes price the order with `quoteStoreOrder(body)`. Trusted inputs: `items[].id`, `items[].quantity` (integer 1–99), `items[].size`, `shippingMethod` (`standard` | `express` | `overnight`), and `coverFee: true` or `processingFee > 0`. At most 50 line items. Invalid input or unavailable products return `400 { error }` with a customer-safe message.

### `POST /api/checkout/create-stripe-payment-intent`

Self-checkout with the Stripe Payment Element.

Extra body fields: `email`, `shippingAddress` (`firstName`, `lastName`, `address`, `city`, `state`, `zipCode`, `country`), `totalAmount` (the total the page displayed).

- Returns `409` with "Prices in your cart have changed..." if `totalAmount` does not equal the server quote to the cent.
- Creates or reuses a Stripe customer (guest customer when no email), a draft invoice with one item per line plus shipping, tax, and processing fee, then a PaymentIntent with `metadata.invoice_id`.

Response: `{ clientSecret, paymentIntentId, invoiceId, amount }`.

### `POST /api/checkout/create-stripe-checkout`

Express checkout via hosted Stripe Checkout. Collects US shipping and billing addresses; tax and processing fee are added as line items; shipping as a fixed-amount shipping option.

Response: `{ url, sessionId }`. Success returns to `/store/success?session_id={CHECKOUT_SESSION_ID}`, cancel to `/store/checkout`.

### `POST /api/checkout/create-paypal-order`

Express checkout via PayPal Orders v2 (`intent: CAPTURE`) with an itemized breakdown.

Response: `{ orderId, approvalUrl }`. PayPal returns the buyer to `/store/success?token=<orderId>`, cancel to `/store/checkout`.

Redirect URLs for both express routes are built from the request origin, never from the body.

---

## Donations and Memberships

### `POST /api/checkout/create-donation-payment-intent`

Body: `amount` (dollars), `coverFee` (boolean), optional `email`, `firstName`, `lastName`, `dedication`.

- `amount` must be > 0 and ≤ 100,000; the total must be at least $0.50.
- When `coverFee` is true, 3% of the amount is added (computed on the server).
- Response: `{ clientSecret }`.

### `POST /api/checkout/create-membership-payment-intent`

Body: `membershipPlanId`, `membershipType` (`individual` | `company`), `amount` (individual plan only), `email`, `phone`, and either `firstName` + `lastName` (individual) or `companyName` + `contactName` + optional `companyInfo` (company).

- Plan prices come from the `membershipProducts` table in the route. Only the `individual` plan accepts a custom amount ($1–$10,000 per month).
- Creates a monthly Stripe subscription (`payment_behavior: default_incomplete`).
- Response: `{ clientSecret, subscriptionId, invoiceId }`.

Details: `/docs/developers/10_PAYMENTS_AND_CHECKOUT.md`.

---

## Payment Status and Keys

| Route                                                                  | Method | Validation                     | Response                                         |
| ---------------------------------------------------------------------- | ------ | ------------------------------ | ------------------------------------------------ |
| `/api/checkout/retrieve-stripe-publishable-key`                        | POST   | —                              | `{ publishableKey }`                             |
| `/api/checkout/retrieve-stripe-session-status?session_id=`             | GET    | `^cs_[A-Za-z0-9_]{10,200}$`    | `{ status, customer_email }`                     |
| `/api/checkout/retrieve-stripe-payment-intent-status?payment_intent=`  | GET    | `^pi_[A-Za-z0-9_]{10,200}$`    | `{ status, customer_email, amount, currency }`   |
| `/api/checkout/retrieve-paypal-order-status?token=`                    | GET    | `^[A-Z0-9]{8,32}$`             | `{ status, customer_email }`                     |

`retrieve-paypal-order-status` **captures** an order that is `APPROVED` (idempotent via the `PayPal-Request-Id` header) and reports `complete` once captured. Funds are not collected until this runs.

Most checkout routes also answer `GET` with an availability message and `OPTIONS` with `204` and an `Allow` header.

---

## Stripe Webhook

`POST /api/checkout/stripe-webhook` — Node.js runtime, reads the raw body with `request.text()` and verifies the `stripe-signature` header with `STRIPE_WEBHOOK_SECRET`.

Handles `payment_intent.succeeded` only: finalizes the draft invoice referenced by `metadata.invoice_id`, then marks it paid out of band — unless the amount received is less than the invoice total, in which case it sets `metadata.checkout_status = "amount_mismatch"` and stops.

Returns `{ received: true }`, or `400` when verification or processing fails. Setup: `/docs/developers/07_DEPLOYMENT.md`.

---

## Content Routes (read-only)

These expose Sanity content as JSON. The site's own pages read Sanity directly; only `/api/checkout-providers` is called by the site. The rest remain for external or legacy consumers.

| Route                                       | Response                                                      |
| ------------------------------------------- | ------------------------------------------------------------- |
| `GET /api/checkout-providers`               | `{ success, data }` — enabled providers only                  |
| `GET /api/banner`                           | Banner Event documents                                        |
| `GET /api/event/featured-event?per_page=12` | Featured events                                               |
| `GET /api/event/recurring-event?per_page=3` | Recurring events                                              |
| `GET /api/publication?per_page=12`          | Publications                                                  |
| `GET /api/newsletter?per_page=12`           | Newsletters                                                   |
| `GET /api/product`                          | All products                                                  |
| `GET /api/product/[id]`                     | One product (slug, external id, or Sanity id); 404 if missing |
| `GET /api/team-member`                      | Team groups with members (members with images first)          |
| `GET /api/product-cat`                      | Legacy stub, always `[]`                                      |
| `GET /api/product/by-cat/[id]`              | Legacy stub, always `[]`                                      |

Content routes are not rate limited and return `500 { error }` if Sanity fails.

---

## Error Handling

- Routes return a generic `{ error }` message to the browser and log the real error with `console.error`.
- Logs appear in the terminal running `npm run dev` locally, and in the Vercel dashboard (deployment → Functions / Logs) in deployed environments.
- Troubleshooting by status code: `/docs/recipes/fixes/FIX_API_REQUEST_ERRORS.md`.
