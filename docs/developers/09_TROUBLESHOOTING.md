# Troubleshooting

This file documents common failure modes specific to this codebase. Each entry links to a detailed recipe in `/docs/recipes/fixes`.

Where to look first:

- Browser devtools → Network tab (status code and JSON `error` of `/api/...` calls)
- The terminal running `npm run dev` (server logs from `console.error`)
- Vercel dashboard → the deployment → Build Logs (build failures) or Logs (runtime/API errors)

---

## 1) CMS sections are empty ("No products available", "No featured events are scheduled right now")

Cause:

- Sanity is unreachable or misconfigured, and the component fell back to its empty state
- The content exists only as a draft (not published)
- A field was renamed in the schema but not in the GROQ projection

Fix:

- Confirm `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`
- Confirm the document is published, then wait up to 30 seconds and refresh
- Test the query in Sanity Studio's Vision tool

Recipe: `/docs/recipes/fixes/FIX_CMS_FETCH_FAILURE.md`

---

## 2) Build fails with "Configuration must contain `projectId`"

Cause:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` is not set in `.env.local` or in the Vercel environment being built.

Fix:

- Add it (and the other Sanity variables), then rebuild/redeploy.

---

## 3) Build fails with a "server-only" import error

Cause:

- A Client Component (`"use client"`) imports a runtime value from `environment.server.ts`, `sanity-client.ts`, `sanity-content.ts`, or `store-pricing.ts`.

Fix:

- Fetch the data in a Server Component and pass it as props, or call an API route.
- For types only, use `import type { ... }`.

Recipe: `/docs/recipes/guidelines/SERVER_AND_CLIENT_COMPONENTS.md`

---

## 4) API call returns 400, 409, 429, or 500

- `400 Invalid request body` — the request was not `Content-Type: application/json` or the body was not a JSON object
- `400` with a specific message — validation failed (missing field, bad quantity, unavailable product)
- `409 Prices in your cart have changed...` — self-checkout total no longer matches the server quote (a CMS price changed); remove and re-add items
- `429 Too many requests` — per-IP rate limit hit; wait for `Retry-After` seconds
- `500 ... not configured` — a required environment variable is missing in that environment
- `502` from `/api/email/send` — Resend rejected the email

Recipe: `/docs/recipes/fixes/FIX_API_REQUEST_ERRORS.md`

---

## 5) Stripe webhook failures (400 / signature verification)

Cause:

- `STRIPE_WEBHOOK_SECRET` belongs to a different endpoint or mode (test vs live)
- The Stripe endpoint points at the wrong domain or path
- Something altered the raw body before verification

Fix:

- Endpoint must be `https://<domain>/api/checkout/stripe-webhook`, listening for `payment_intent.succeeded`
- Copy that endpoint's signing secret into the matching environment and redeploy
- Locally: `stripe listen --forward-to localhost:3000/api/checkout/stripe-webhook`
- The route reads `request.text()` directly; keep it that way

Recipe: `/docs/recipes/fixes/FIX_PAYMENT_AND_WEBHOOK_ISSUES.md`

---

## 6) Contact form says it failed, or emails never arrive

Cause:

- `RESEND_API_KEY` missing (500) or Resend rejected the send (502)
- Rate limit (3 messages per IP per 10 minutes)
- Sender restriction: the route sends from Resend's shared `onboarding@resend.dev` address, which only delivers to addresses Resend allows for that account

Fix:

- Check the key and the Resend dashboard logs
- To send from an `@thesourceofhope.org` address, verify the domain in Resend and update `from` in `/src/app/api/email/send/route.ts`

Note: a form submission where the hidden honeypot field is filled returns success but sends nothing — by design.

---

## 7) Page 404s or a link goes to the wrong place

Cause:

- Folder or file name does not match the URL (it must be `page.tsx`; segments are case-sensitive, e.g. `servingHope`)
- `href` typo in `getHeaderLinks()` or a component
- Route was renamed without a redirect

Fix:

- Compare the URL to the folder path under `/src/app`
- Add a redirect in `/next.config.ts` for old URLs

Recipe: `/docs/recipes/fixes/FIX_PAGE_ROUTE_MISMATCH.md`

---

## 8) Content change in Sanity not showing

Cause:

- Not published, or still within the 30-second revalidation window
- Browser cache

Fix:

- Publish, wait 30 seconds, hard-refresh. If it still does not appear, check the GROQ projection includes the field.

---

## 9) Images load slowly or look huge

Cause:

- CMS images are served as the original upload (no resizing)

Fix:

- Ask editors to re-upload optimized images (`/docs/creators/MEDIA_FORMAT_RULES.md`)
- Optionally switch the component to `next/image` or `@sanity/image-url` (see `/docs/recipes/fixes/USING_CMS_IMAGES.md`)

---

## 10) Express checkout button missing or does nothing

Cause:

- The Checkout Provider is disabled in Sanity, or its `name` is not exactly `Stripe` / `PayPal`
- Google Pay and Apple Pay are not implemented yet (buttons do nothing)

Fix:

- Correct the provider document in Sanity Studio

---

## 11) "Sign online" is missing, or online waiver signing fails

Cause:

- One or more `DOCUSIGN_*` variables or `WAIVER_SECRET` is missing in that environment; the site then offers only the PDF downloads
- The JWT consent was not granted, or the private key, user ID, or account ID belongs to a different DocuSign environment (demo vs production)
- A template is missing the `Volunteer` or `Guardian` role (names must match exactly)
- Staff emails don't arrive: `DOCUSIGN_CONNECT_HMAC_KEY` doesn't match the key in DocuSign Connect, the deployment is behind Vercel Deployment Protection, or `RESEND_API_KEY` is unset

Fix:

- Check the Vercel runtime logs for `/api/waiver/start`, `/api/waiver/return`, and `/api/waiver/webhook` (errors log DocuSign's message, never form data)
- Follow the checklist and troubleshooting table in `/docs/recipes/guidelines/SET_UP_DOCUSIGN_WAIVERS.md`
- The PDF downloads in `/public/v2/documents/` always work as a fallback

---

## 12) Hydration warnings around the cart

Cause:

- Cart state is read from `localStorage`, which does not exist on the server

Fix:

- Render cart-dependent UI only after mount (follow the existing cart components) — see `/docs/recipes/tutorials/DISPLAY_CART_COUNT.md`
