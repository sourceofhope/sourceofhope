# Verify Environment Configuration (Local vs Development vs Production)

The site no longer switches API base URLs by hostname. Pages and the API are deployed together, and the browser always calls relative, same-origin paths like `/api/email/send`. Local, development, and production run the same code.

What changes between environments is **configuration**: the environment variables each one is given. Most "works locally, broken in production" problems come down to a missing or mismatched variable.

---

## Where Configuration Lives

| Environment             | Source of variables                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| Local                   | `.env.local` (copied from `/.env.template`)                                                             |
| Development / Preview   | Vercel → Project Settings → Environment Variables, scoped to Preview (and/or a `development` branch override) |
| Production              | The same Vercel screen, scoped to Production                                                            |

The `development` branch is the integration branch and `production` is live. Confirm in the Vercel dashboard which domain each branch is served on.

Vercel applies environment variable changes only to **new** deployments, so redeploy after any change. `NEXT_PUBLIC_*` values are also inlined into the browser bundle at build time.

The full variable list is in `/docs/developers/11_ENVIRONMENT_VARIABLES.md`.

---

## 1) Confirm the Deployment Is Up

Every environment exposes the same health route:

- Local: `http://localhost:3000/api/health`
- Deployed: `https://<deployment-domain>/api/health`

Expected:

```json
{ "status": "ok", "message": "Source of Hope API is running" }
```

The health route doesn't touch any third-party service. It only proves the deployment is serving route handlers.

---

## 2) Confirm Each Integration Points at the Right Account

| Integration | Variables                                                                              | Local / development       | Production                         | How to check                                                                                     |
| ----------- | -------------------------------------------------------------------------------------- | ------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| Stripe      | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`                              | `sk_test_` / `pk_test_`   | `sk_live_` / `pk_live_`            | Stripe Checkout (store express checkout) shows a "TEST MODE" badge with test keys. Test payments appear only in the Dashboard's test mode. |
| Stripe webhook | `STRIPE_WEBHOOK_SECRET`                                                             | Secret from `stripe listen`, or the test-mode endpoint | Secret of the live-mode endpoint for this domain | Stripe Dashboard → Webhooks → endpoint `https://<domain>/api/checkout/stripe-webhook` shows 2xx deliveries |
| PayPal      | `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_API`                   | Sandbox app, `PAYPAL_API=development` | Live app, `PAYPAL_API=production` | PayPal express checkout redirects to `sandbox.paypal.com` vs `paypal.com`                        |
| Sanity      | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN` | `sgzdqn9z` / `production` | `sgzdqn9z` / `production` | `/events`, `/media`, `/store` show the same content as the Studio                                 |
| Resend      | `RESEND_API_KEY`                                                                       | Optional. Any valid key sends real email. | The organization's key             | Submit the `/connect` form. It returns success and the email arrives at treasurer@thesourceofhope.org |
| DocuSign    | `DOCUSIGN_*`, `WAIVER_SECRET`                                                          | Developer account, `DOCUSIGN_ENVIRONMENT=demo`, or unset | Production account, `DOCUSIGN_ENVIRONMENT=production` | "Sign online" appears on `/events`; demo envelopes carry a "demonstration" watermark. A completed signing emails info@thesourceofhope.org |

Notes:

- All environments normally read the single `production` Sanity dataset (check each environment's `NEXT_PUBLIC_SANITY_DATASET`). Content published in the Studio appears everywhere within about 30 seconds.
- `PAYPAL_API` defaults to the sandbox when it is unset or anything other than `production`, so a missing value in Production silently sends buyers to the sandbox.
- Each Stripe webhook endpoint has its own signing secret. Test-mode and live-mode endpoints, and each domain, need their own `STRIPE_WEBHOOK_SECRET`.

---

## 3) Read the Logs When Something Fails

API routes return generic errors to the browser, such as `Stripe is not configured.` or `Failed to create payment intent`. The detail is in the server logs:

- Local: the terminal running `npm run dev`
- Vercel: the deployment's Logs (function logs)

A response like `{ "error": "Stripe is not configured." }` means the required variable is missing in that environment.

---

## Quick Checklist per Deployment

- [ ] `/api/health` returns `status: "ok"`
- [ ] CMS pages show current content
- [ ] Stripe keys match the environment (test vs live), and a test donation reaches the payment step
- [ ] Stripe webhook endpoint for this domain shows successful deliveries
- [ ] `PAYPAL_API` matches the environment (sandbox vs production)
- [ ] Contact form on `/connect` delivers email
- [ ] `NEXT_PUBLIC_*` changes were followed by a redeploy
