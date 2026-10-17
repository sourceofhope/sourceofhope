# Security

The site handles payments and accepts public form submissions without user accounts. Every API route is reachable by anyone, so each one must defend itself.

This document describes the protections in place and the rules new code must follow.

---

## 1. The Server Decides Every Amount

Never trust prices, totals, fees, or redirect URLs from the browser.

- **Store** — `quoteStoreOrder()` (`/src/lib/store-pricing.ts`) reprices every order from Sanity. Only product ids, quantities, sizes, the shipping method id, and the fee opt-in are read from the request. Max 50 lines; quantities 1–99.
- **Self-checkout** — the displayed total is compared to the server quote; any difference returns 409 instead of charging a different amount.
- **Donations** — the processing fee is recomputed on the server; amounts are bounded ($0.50 minimum total, $100,000 maximum).
- **Memberships** — fixed plans always charge their listed price from the server table; only the individual plan accepts a custom amount ($1–$10,000).
- **Redirects** — Stripe and PayPal return/cancel URLs are built from the request origin (`getSiteOrigin`), never from the body, so checkout cannot send buyers to another site.
- **Webhook** — an invoice is never marked paid if the amount received is less than its total.
- **PayPal** — orders are captured on the server before being reported complete.

---

## 2. Secrets Stay on the Server

- All environment variables are read through `getEnvironment()` in `/src/lib/environment.server.ts`, which imports `server-only`. Importing it (or `sanity-client`, `sanity-content`, `store-pricing`) from a Client Component fails the build.
- Only `NEXT_PUBLIC_*` variables reach the browser. Never prefix a secret with `NEXT_PUBLIC_`.
- `.env`, `.env.local`, and other `.env.*` files are gitignored. Never commit real keys; `.env.template` holds placeholders only.

---

## 3. Input Handling

- **JSON only** — `readJsonObject()` (`/src/lib/validation.ts`) rejects requests that are not `application/json` or whose body is not an object. This also blocks cross-site HTML form posts, which cannot send that content type without a CORS preflight.
- **Validate and bound every field** — trim strings, cap lengths, check types and patterns. Strings written to Stripe metadata are capped.
- **Identifiers** — Stripe and PayPal ids are checked with strict regexes before being used in API paths (`cs_…`, `pi_…`, PayPal `^[A-Z0-9]{8,32}$`).
- **Email** — user input is HTML-escaped in the email body; newlines are stripped from the subject to prevent header injection; reply-to is the validated visitor address.
- **GROQ** — user values are passed as query parameters, and list sizes are clamped (`clampLimit`).

---

## 4. Rate Limiting

`rateLimit()` (`/src/lib/rate-limit.ts`) applies per-IP sliding-window limits (see the table in `/docs/developers/06_API_ROUTES.md`).

- Client IP comes from Vercel's `x-real-ip`, falling back to the right-most `x-forwarded-for` entry (the one added by the platform, which the client cannot forge).
- The store holds at most 10,000 keys, evicting the oldest, so a flood of unique IPs cannot exhaust memory.
- Limits are **per serverless instance**, not global. They slow abuse; they do not guarantee a hard cap. For strict limits, replace the in-memory store with a shared one such as Upstash Redis.

---

## 5. Spam Protection

Email forms include a honeypot input (`/src/components/ui/HoneypotField.tsx`, field name `businessName`):

- Positioned off-screen, `aria-hidden`, removed from the tab order, so people never fill it
- Read from the DOM with `readHoneypot()` at submit time
- `/api/email/send` returns a fake success and sends nothing when it is filled

Combined with the 3-per-10-minutes rate limit.

---

## 6. Error Messages

Routes return generic messages (`"Failed to create payment intent"`) and log the real error server-side with `console.error`. Do not return stack traces, provider error bodies, or configuration details to the browser. Validation messages that are safe for customers (`PricingError`) are the exception.

---

## 7. HTTP Security Headers

Set for every response in `/next.config.ts`:

| Header                      | Value / purpose                                                         |
| --------------------------- | ----------------------------------------------------------------------- |
| `Content-Security-Policy`   | `frame-ancestors 'none'; base-uri 'self'; object-src 'none'`             |
| `X-Frame-Options`           | `DENY` (no clickjacking)                                                |
| `X-Content-Type-Options`    | `nosniff`                                                               |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`                                       |
| `Permissions-Policy`        | camera, microphone, geolocation off; `payment` limited to self, Stripe, PayPal |
| `Strict-Transport-Security` | `max-age=63072000` (no `includeSubDomains`, because some older subdomains may still be HTTP-only) |

`poweredByHeader: false` removes `X-Powered-By`.

The CSP intentionally has no `script-src`/`connect-src` allow-lists yet, so Stripe, PayPal, Google Tag Manager, YouTube, and Maps embeds keep working. If you tighten it, test every checkout flow, the donate and members forms, analytics, and embedded media.

---

## 8. Dependencies

- Keep `next` patched; the upgrade to 16.3.8 fixed critical image-optimizer advisories.
- Run `npm audit` periodically and before releases.
- The unused `paypal-rest-sdk` was removed; PayPal is called directly over its REST API.

---

## Checklist for New API Routes

- [ ] `rateLimit()` with an appropriate scope and limit
- [ ] `readJsonObject()` for POST bodies
- [ ] Every field type-checked, trimmed, and length-limited
- [ ] Secrets via `getEnvironment()` with a "not configured" guard
- [ ] No client-supplied prices, totals, or URLs
- [ ] Generic error responses, details logged with `console.error`
- [ ] Documented in `/docs/developers/06_API_ROUTES.md`

Template: `/docs/recipes/tutorials/ADD_AN_API_ROUTE.md`.
