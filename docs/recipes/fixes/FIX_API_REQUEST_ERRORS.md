# Debug API Request Errors

The backend is a set of Next.js Route Handlers under `/src/app/api/**/route.ts(x)`, served from the same domain as the pages. The browser calls relative URLs such as `/api/email/send`, so there is no API base URL, no separate API server, and no CORS configuration to get wrong.

When a request fails, the HTTP status and the JSON `error` message tell you which check rejected it. Error messages are deliberately generic; the detailed cause is written to the server logs with `console.error`.

For the full list of endpoints see `/docs/developers/06_API_ROUTES.md`.

---

## Where to look

- **Browser:** DevTools → Network → select the request → Response tab shows the JSON body.
- **Local server logs:** the terminal running `npm run dev`.
- **Vercel:** open the deployment and check its runtime (function) logs.

Quick probes:

```bash
# Is the app up?
curl -s http://localhost:3000/api/health
# → {"status":"ok","message":"Source of Hope API is running"}

# Production
curl -s https://thesourceofhope.org/api/health
```

---

## Status code reference

| Status | Typical message | Meaning |
| ------ | --------------- | ------- |
| 400 | `Invalid request body` | Body is not a JSON object or the `Content-Type` header is not `application/json`. |
| 400 | Field-specific message | A field failed validation (see below). |
| 404 | Next.js 404 page / `Product not found` | No route file at that path, or the requested record doesn't exist. |
| 405 | Method Not Allowed | The route exists but doesn't export a handler for that HTTP method. |
| 409 | `Prices in your cart have changed...` | Self-checkout total no longer matches the server's price. |
| 429 | `Too many requests. Please wait before trying again.` | Rate limit exceeded; check the `Retry-After` header (seconds). |
| 500 | `... is not configured` | A required environment variable is missing in this environment. |
| 500 | `Failed to ...` | Unexpected error; read the server logs. |
| 502 | `Failed to send email` | Resend rejected the message. |
| 502 | `We couldn't start online signing...` | DocuSign rejected or didn't answer a waiver request; the server log has DocuSign's message. |
| 503 | `Online signing isn't available right now...` | DocuSign isn't configured in this environment (`/api/waiver/start` only). |

---

## 400 "Invalid request body"

Every POST handler reads its body with `readJsonObject()` from `/src/lib/validation.ts`. It returns `null` (and the route responds 400) when:

- the request has no `Content-Type: application/json` header, or
- the body isn't valid JSON, or
- the body is an array or a primitive instead of an object.

This also blocks cross-site HTML form posts, which cannot send `application/json`.

Fix: send JSON with the header.

```ts
await fetch("/api/email/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, message, businessName }),
});
```

---

## 400 field validation

Common messages and what triggers them:

| Route | Message | Cause |
| ----- | ------- | ----- |
| `/api/email/send` | `Missing required fields: name, email, message` | Name or message empty, or a field isn't a string. |
| `/api/email/send` | `Please provide a valid email address` | Email fails the pattern or exceeds 254 characters. |
| `/api/email/send` | `Message is too long` | Name over 120 or message over 5000 characters. |
| Store checkout routes | `Cart items are required`, `Too many items in cart`, `Invalid item quantity`, `One or more items are no longer available` | Thrown by `quoteStoreOrder()` (max 50 lines, quantity 1–99, product must exist in Sanity with a positive price). |
| `create-donation-payment-intent` | `A valid donation amount is required.`, `Minimum donation amount is $0.50.`, `For donations over $100,000, please contact us directly.` | Amount out of range. |
| `create-membership-payment-intent` | `Invalid membership type`, `Invalid membership amount`, name/company messages | See `/docs/recipes/fixes/FIX_PAYMENT_AND_WEBHOOK_ISSUES.md`. |
| Status routes | `Session ID is required`, `Payment Intent ID is required`, `PayPal token is required` | The id is missing or doesn't match the expected format (`cs_...`, `pi_...`, PayPal `^[A-Z0-9]{8,32}$`). |
| `/api/waiver/start` | `Unknown waiver`, `Please provide the volunteer's full name and a valid email.`, `Please provide the guardian's full name and a valid email.` | Waiver id not in `WAIVER_IDS`, name under 2 or over 120 characters, invalid email, or a minor without guardian details. |

The honeypot is not an error: if the hidden `businessName` field is filled, `/api/email/send` returns `{ success: true }` and sends nothing. If test submissions "succeed" but no email arrives, make sure your test isn't filling that field.

---

## 409 price changed

Only `POST /api/checkout/create-stripe-payment-intent` returns this. It recomputes the order total on the server and compares it, to the cent, with the `totalAmount` the checkout page showed. The usual cause is a product price changed in Sanity after the item was added to a cart (the cart keeps the price from when it was added). Removing and re-adding the item fixes it.

---

## 429 rate limited

Limits come from `rateLimit()` in `/src/lib/rate-limit.ts`. They apply per IP address and per server instance, over a 10-minute window:

| Scope | Limit | Routes |
| ----- | ----- | ------ |
| `email` | 3 | `POST /api/email/send` |
| `donation` | 5 | `POST /api/checkout/create-donation-payment-intent` |
| `membership` | 5 | `POST /api/checkout/create-membership-payment-intent` |
| `store-checkout` | 10 (shared) | `create-stripe-checkout`, `create-stripe-payment-intent`, `create-paypal-order` |
| `payment-status` | 30 (shared) | `retrieve-stripe-session-status`, `retrieve-stripe-payment-intent-status`, `retrieve-paypal-order-status` |
| `waiver` | 5 | `POST /api/waiver/start` |
| `waiver-return` | 30 | `GET /api/waiver/return` |

The publishable-key route, the Stripe and DocuSign webhooks, and the content GET routes are not rate limited.

During local testing the limit is easy to hit. The store is in memory, so restarting `npm run dev` clears it. Don't raise the limits to work around testing.

---

## 404 and 405

- **404:** the URL must match a folder with a `route.ts` (or `route.tsx`) file. For example, `/api/checkout/stripe-webhook` maps to `/src/app/api/checkout/stripe-webhook/route.ts`. Check spelling and nesting.
- **405:** the file exists but doesn't export a function named after the method (`GET`, `POST`, `OPTIONS`, ...). Content routes such as `/api/product` are GET-only; checkout routes export `GET`, `POST`, and `OPTIONS`.
- `GET` on a checkout route returns a short "endpoint is available, use POST" message, which is a quick way to confirm the route is deployed.

---

## 500 "not configured"

These mean an environment variable is missing in the environment that handled the request:

| Message | Missing variable(s) |
| ------- | ------------------- |
| `Stripe is not configured.` / `Stripe configuration missing` | `STRIPE_SECRET_KEY` (or `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` for the publishable-key route) |
| `Stripe webhook is not configured.` | `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` |
| `PayPal is not configured...` | `NEXT_PUBLIC_PAYPAL_CLIENT_ID` or `PAYPAL_CLIENT_SECRET` |
| `Email service not configured` | `RESEND_API_KEY` |

Set the variable (locally in `.env.local`, on Vercel per environment) and restart or redeploy. See `/docs/developers/11_ENVIRONMENT_VARIABLES.md`.

---

## 502 from the email route

Resend returned an error. Check the logged `Resend API Error`. Common causes are an invalid or revoked `RESEND_API_KEY`, or the sender restriction: the route sends from Resend's shared `onboarding@resend.dev` address, which only delivers to addresses Resend allows for that account. Sending from an `@thesourceofhope.org` address requires verifying the domain in Resend and changing `from` in `/src/app/api/email/send/route.ts`.

---

## Validation checklist

- `/api/health` returns `{"status":"ok", ...}` in the environment you're testing.
- The failing request sends `Content-Type: application/json` and a JSON object body.
- The response `error` message matches one of the causes above, and the server log confirms it.
- After a fix, the same request succeeds without restarting anything other than the dev server (or redeploying on Vercel).
