# API Client Integration (Frontend → Server)

The frontend communicates with the Express API via helper modules.

There are two patterns in the current codebase:

1. A centralized environment-aware API client (`client.js`)
2. A direct environment switch in `sendEmail` (email.js)

Developers should prefer the centralized client approach unless there is a known reason to bypass it.

---

## client.js: Environment-Based API_BASE_URL

`client.js` determines the base URL at runtime:

- Local (`localhost` / `127.0.0.1`):
  `http://localhost:3001/api`

- Dev site (`dev.thesourceofhope.org` or hostname starts with `dev.`):
  `https://api.thesourceofhope.org/dev/api`

- Production (everything else):
  `https://api.thesourceofhope.org/app/api`

This aligns with the server mounting strategy that supports:

- `/api`
- `/dev/api`
- `/app/api`

---

## apiRequest Contract

`apiRequest(path, options)`:

- builds the URL: `${API_BASE_URL}${path}`
- defaults to JSON requests
- parses JSON responses when content-type is JSON
- returns a uniform shape:

Success:

- `{ data, status }`

Failure:

- `{ error, status }` (and status=0 for network failures)

Note:

- `apiRequest` currently logs request and response details to the console.

---

## checkout.js: High-Level Checkout Methods

`checkout.js` wraps `client.js` and exposes explicit functions:

Stripe:

- `fetchStripePublishableKey()` --> POST `/checkout/retrieve-stripe-publishable-key`
- `createPaymentIntent(...)` --> POST `/checkout/create-stripe-payment-intent`
- `fetchPaymentIntentStatus(paymentIntentId)` --> GET `/checkout/retrieve-stripe-payment-intent-status`
- `createStripeCheckoutSession(...)` --> POST `/checkout/create-stripe-session` (embedded)
- `createStripeCheckout(...)` --> POST `/checkout/create-stripe-checkout` (redirect)
- `fetchStripeSessionStatus(sessionId)` --> GET `/checkout/retrieve-stripe-session-status`

PayPal:

- `createPaypalCheckout(...)` --> POST `/checkout/create-paypal-order`
- `fetchPaypalOrderStatus(token)` --> GET `/checkout/retrieve-paypal-order-status`

The wrapper normalizes cart item fields and ensures the server receives stable item objects.

---

## email.js: sendEmail (Direct URL Pattern)

`sendEmail(emailData)` currently bypasses `client.js` and selects API URL as:

- DEV: `http://localhost:3001/api/email/send`
- PROD: `https://thesourceofhope.org/api/email/send`

This differs from the canonical API domain strategy used by `client.js` and may not hit the same Vercel routing project.

If you want consistent behavior across environments, consider migrating sendEmail to use `client.js`:

- POST `/email/send`

Until then, treat this as a special-case integration and verify which domain is expected in each environment.

---

## sanitize

`client.js` exports a `sanitize(str)` helper that strips `<` and `>`.

Use it for defensive UI rendering where user-provided strings might be injected into the DOM.
