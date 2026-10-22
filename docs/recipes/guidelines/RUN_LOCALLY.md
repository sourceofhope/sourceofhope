# Run the Site Locally

The website is a single Next.js app. Pages and the backend API (`/src/app/api`) run together from one dev server, so there is no separate backend process.

The Sanity Studio (the CMS editing interface) is a separate npm project in `/sanity/the-source-of-hope` and is only needed if you are changing content schemas or editing content locally.

---

## Prerequisites

- Node.js 20.9 or newer (Next.js 16 requirement; Node 22 LTS works)
- npm
- Optional: the [Stripe CLI](https://docs.stripe.com/stripe-cli) for testing webhooks

---

## Install Dependencies

From the repo root:

```bash
npm install
```

If npm reports peer dependency conflicts, use:

```bash
npm install --legacy-peer-deps
```

---

## Configure Environment Variables

```bash
cp .env.template .env.local
```

`.env.local` is gitignored. Fill it in with **test/sandbox** credentials:

- Sanity: `NEXT_PUBLIC_SANITY_PROJECT_ID=sgzdqn9z`, `NEXT_PUBLIC_SANITY_DATASET=production`, `NEXT_PUBLIC_SANITY_API_VERSION` (e.g. `2026-04-10`). `SANITY_API_READ_TOKEN` is optional. These are the minimum for pages to render.
- Stripe: test keys (`sk_test_...`, `pk_test_...`) and a webhook secret (see below)
- PayPal: sandbox client id and secret, with `PAYPAL_API=development`
- Resend: an API key, only if you need to test email forms

Never use live Stripe or PayPal keys locally. The full list is in `/docs/developers/11_ENVIRONMENT_VARIABLES.md`.

Restart the dev server after changing `.env.local`.

---

## Start the Dev Server

```bash
npm run dev
```

Open `http://localhost:3000`.

Health check:

```
GET http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "Source of Hope API is running"
}
```

---

## Test Stripe Webhooks Locally

Store self-checkout relies on the `payment_intent.succeeded` webhook to finalize invoices.

```bash
stripe login
stripe listen --forward-to localhost:3000/api/checkout/stripe-webhook
```

`stripe listen` prints a `whsec_...` signing secret. Put it in `STRIPE_WEBHOOK_SECRET` in `.env.local` and restart `npm run dev`.

Test cards:

| Result  | Card number           |
| ------- | --------------------- |
| Success | `4242 4242 4242 4242` |
| Decline | `4000 0000 0000 0002` |

Use any future expiry date and any CVC. For PayPal, use sandbox buyer accounts from the PayPal Developer Dashboard.

---

## Run the Sanity Studio (Optional)

```bash
cd sanity/the-source-of-hope
npm install
npm run dev
```

Open `http://localhost:3333` and sign in with your Sanity account.

The local Studio edits the **real** `production` dataset (its project and dataset are hardcoded in `sanity.config.ts`). Anything you publish there goes live within about 30 seconds.

Don't use the root `npm run sanity` script. There is no Studio config at the repo root.

---

## Lint and Production Build

Run these before opening a pull request:

```bash
npm run lint
npm run build
npm start
```

- `npm run build` type-checks and builds every page. It catches server/client import mistakes that `npm run dev` may only show when you visit the page.
- `npm start` serves the production build at `http://localhost:3000`.

There is no automated test suite. Click through the pages you changed.

---

## Validation checklist

- `http://localhost:3000` loads with no console errors.
- `/api/health` returns the JSON above.
- `/events`, `/media`, `/store`, and `/about/team` show CMS content, or their empty states if Sanity is unreachable. (If the Sanity project id is missing entirely, the client throws on startup and these pages error instead.)
- `npm run lint` and `npm run build` pass.
