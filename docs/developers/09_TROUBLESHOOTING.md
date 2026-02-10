# Troubleshooting

This file documents common failure modes specific to this codebase.

---

## 1) "CORS policy: Origin not allowed."

Cause:

- The request origin is not in the server allowlist.

Fix:

- Ensure you are using an allowed frontend domain.
- Ensure `FRONTEND_URL` in server `.env` matches the frontend origin (no path; correct protocol).
- Ensure `normalizeOrigin(frontendUrl)` matches the actual Origin header.

---

## 2) Stripe webhook failures (400 / signature verification)

Cause:

- Webhook route is not using raw body parsing
- Webhook secret mismatch

Fix:

- Confirm webhook paths are registered before `express.json()`
- Confirm `STRIPE_WEBHOOK_SECRET` is set
- Confirm the Stripe webhook endpoint is pointing to the correct prefix:
  - `/api/checkout/webhook`
  - `/dev/api/checkout/webhook`
  - `/app/api/checkout/webhook`

---

## 3) Email works locally but fails in dev/prod

Cause:

- `sendEmail` uses a direct URL pattern that may not match the environment routing domain used elsewhere.

Fix:

- Confirm which domain should receive email requests:
  - `https://thesourceofhope.org/api/email/send` (current production behavior in email.js)
  - or `https://api.thesourceofhope.org/app/api/email/send` (client.js canonical approach)
- Consider migrating sendEmail to use `client.js` for consistency.

---

## 4) Route mismatch or broken navigation

Cause:

- CANONICAL routes changed but Header links or router config was not updated.

Fix:

- Update `/src/routes.jsx` and confirm CANONICAL output.
- Update `/src/components/structure/Header.jsx` menu configuration if labels/children changed.
- Confirm router config uses `CANONICAL.*.relative` values.

---

## 5) CMS images look large or page loads slowly

Cause:

- CMS media is not optimized or responsive sizes not used.

Fix:

- Use `_embed` when needed
- Use `getResponsiveImage(image, { width })` rather than original `source_url`
- Ensure content creators follow `/docs/content-creators/MEDIA_IMAGE_RULES.md`
