# Environment Variables

All configuration comes from environment variables. The template lists every key:

- `/.env.template`

Locally, copy it to `.env.local` (gitignored) and fill in test values. In deployed environments, set the same keys in Vercel → **Settings → Environment Variables**, scoped per environment.

---

## How They Are Read

Server code reads variables only through `getEnvironment()`:

- `/src/lib/environment.server.ts` (starts with `import "server-only"`)

```ts
import { getEnvironment } from "@/lib/environment.server";

const { stripeSecretKey } = getEnvironment();
if (!stripeSecretKey) {
  return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
}
```

Rules:

- Do not read `process.env` directly in routes or components; add the key to `getEnvironment()`.
- Only variables prefixed `NEXT_PUBLIC_` are exposed to browser code, and they are inlined at **build time**. Never put a secret in a `NEXT_PUBLIC_` variable.
- After changing any variable in Vercel, redeploy.
- Client-safe constants that are not secrets (like `ASSET_VERSION`) live in `/src/lib/environment.ts`.

---

## Reference

### Stripe

| Variable                              | Used for                                                     |
| ------------------------------------- | ------------------------------------------------------------ |
| `STRIPE_SECRET_KEY`                   | All Stripe API calls (server)                                |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`  | Returned by `retrieve-stripe-publishable-key` for Stripe.js  |
| `STRIPE_WEBHOOK_SECRET`               | Verifying `/api/checkout/stripe-webhook` signatures          |
| `STRIPE_SALES_TAX_RATE_ID`            | Recorded in Stripe Checkout session metadata only (tax is computed by the app) |

Use `sk_test_` / `pk_test_` keys everywhere except production. The secret and publishable keys must come from the same Stripe mode.

### PayPal

| Variable                        | Used for                                                          |
| ------------------------------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID`  | PayPal OAuth (server)                                             |
| `PAYPAL_CLIENT_SECRET`          | PayPal OAuth (server)                                             |
| `PAYPAL_API`                    | `production` → `https://api.paypal.com`; `development` or unset → `https://api.sandbox.paypal.com` |

Client id and secret must belong to the same PayPal app and mode as `PAYPAL_API`.

### Email

| Variable          | Used for                                |
| ----------------- | --------------------------------------- |
| `RESEND_API_KEY`  | Sending email from `/api/email/send` and the waiver-completed notice from `/api/waiver/webhook` |

### DocuSign (volunteer waivers)

Online waiver signing is off until every value below except `DOCUSIGN_BASE_URL` and `DOCUSIGN_CONNECT_HMAC_KEY` is set; until then the site offers only the PDF downloads. Setup: `/docs/recipes/guidelines/SET_UP_DOCUSIGN_WAIVERS.md`.

| Variable                                | Used for                                                          |
| --------------------------------------- | ----------------------------------------------------------------- |
| `DOCUSIGN_INTEGRATION_KEY`              | JWT Grant login (the app's integration key)                       |
| `DOCUSIGN_USER_ID`                      | The DocuSign user the site acts as                                |
| `DOCUSIGN_ACCOUNT_ID`                   | The DocuSign account that owns the templates and envelopes       |
| `DOCUSIGN_PRIVATE_KEY`                  | RSA private key for JWT Grant: PEM, PEM with `\n` escapes, or base64 of the PEM |
| `DOCUSIGN_ENVIRONMENT`                  | `production` → `account.docusign.com`; anything else → the developer (demo) environment |
| `DOCUSIGN_BASE_URL`                     | Optional REST base override; normally looked up from DocuSign's userinfo endpoint |
| `DOCUSIGN_TEMPLATE_GENERAL_ADULT`       | Template id: General Volunteer Agreement, adult signer            |
| `DOCUSIGN_TEMPLATE_GENERAL_MINOR`       | Template id: General Volunteer Agreement, minor plus guardian     |
| `DOCUSIGN_TEMPLATE_SERVING_HOPE_ADULT`  | Template id: Serving Hope Volunteer Agreement, adult signer       |
| `DOCUSIGN_TEMPLATE_SERVING_HOPE_MINOR`  | Template id: Serving Hope Volunteer Agreement, minor plus guardian |
| `DOCUSIGN_CONNECT_HMAC_KEY`             | Verifying `/api/waiver/webhook` signatures (DocuSign Connect HMAC key) |
| `WAIVER_SECRET`                         | Signing the short-lived waiver session cookie and deriving signer ids; any long random string |

### Sanity

| Variable                          | Used for                                                       |
| --------------------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`   | Sanity client (required; missing value fails the build)         |
| `NEXT_PUBLIC_SANITY_DATASET`      | Sanity client (`production`)                                   |
| `NEXT_PUBLIC_SANITY_API_VERSION`  | Sanity API version date, e.g. `2026-04-10`                     |
| `SANITY_API_READ_TOKEN`           | Optional read token; when set the client bypasses the CDN      |
| `SANITY_STUDIO_PROJECT_ID`        | Studio-side variable; `sanity.config.ts` currently hardcodes the value |
| `SANITY_STUDIO_DATASET`           | Studio-side variable; currently hardcoded in `sanity.config.ts` |

### Site

| Variable                    | Used for                                                                 |
| --------------------------- | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_FRONTEND_URL`  | Read by `getEnvironment()` but currently unused (payment redirects use the request origin) |

Next.js sets `NODE_ENV` itself; do not set it manually.

---

## Per-Environment Values

| Variable                 | Local (`.env.local`) | Development / Preview | Production   |
| ------------------------ | -------------------- | --------------------- | ------------ |
| Stripe keys              | test                 | test                  | live         |
| `STRIPE_WEBHOOK_SECRET`  | from `stripe listen` | test endpoint secret  | live endpoint secret |
| `PAYPAL_API`             | `development`        | `development`         | `production` |
| PayPal client id/secret  | sandbox app          | sandbox app           | live app     |
| `RESEND_API_KEY`         | optional             | yes                   | yes          |
| Sanity variables         | same values          | same values           | same values  |
| DocuSign variables       | developer account (`demo`) or unset | developer account (`demo`) | production account (`production`) |
| `WAIVER_SECRET`          | any random string    | its own random string | its own random string |

Verification steps: `/docs/recipes/guidelines/VERIFYING_ENVIRONMENT_CONFIGURATION.md`.

---

## What Breaks When a Variable Is Missing

| Missing                         | Symptom                                                           |
| ------------------------------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Build fails ("Configuration must contain `projectId`")            |
| Other Sanity values             | CMS sections render empty states                                  |
| `STRIPE_SECRET_KEY`             | Checkout, donation, membership routes return 500 "not configured" |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Card forms cannot load Stripe.js                             |
| `STRIPE_WEBHOOK_SECRET`         | Webhook returns 500; store invoices stay in draft                 |
| PayPal values                   | PayPal button returns "PayPal is not configured"                  |
| `RESEND_API_KEY`                | Forms return 500 "Email service not configured"; waiver webhook skips the staff email (logged) |
| Any required DocuSign value or `WAIVER_SECRET` | "Sign online" is hidden; `/api/waiver/start` returns 503; PDF downloads still work |
| `DOCUSIGN_CONNECT_HMAC_KEY`     | Waiver webhook returns 500; signing still works but staff are not emailed |
