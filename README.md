# The Source of Hope

**The Source of Hope (TSOH)** is a 501(c)(3) nonprofit organization dedicated to improving the lives of individuals and families.

This repository powers thesourceofhope.org and our mission: serving communities through education, wellness, and outreach.

It contains a single **Next.js** application (pages and API routes together) and the **Sanity Studio** used to edit site content. For full system documentation, see `/docs` — start with `/docs/00_START_HERE.md`.

---

## Who can contribute

We welcome contributions from everyone:

- Developers & engineers
- Student interns & mentors
- Designers & UX specialists
- Data analysts & researchers
- Community volunteers & partners

We only ask that all contributions follow our values of professionalism, integrity, respect, and service (and a PR).

---

## How Everything Works Together

The website has three major parts:

1. Pages — Next.js App Router (React 19, TypeScript, Tailwind CSS v4) in `/src/app`
2. API routes — payments, donations, memberships, and email, in `/src/app/api`
3. Headless CMS — Sanity, for events, team members, products, publications, and newsletters

Pages read CMS content on the server. Forms and checkout call the site's own `/api/...` routes, which talk to Stripe, PayPal, and Resend. Everything deploys together on Vercel.

| Failure                       | What to do                                  |
| ----------------------------- | ------------------------------------------- |
| Content is wrong              | Check Sanity Studio                         |
| Layout or page wording wrong  | Check the page code in `/src`               |
| Checkout or forms fail        | Check `/src/app/api` and environment variables |

---

## Quick Setup

Requires Node.js 20.9 or newer.

Clone the repository:

```bash
git clone https://github.com/sourceofhope/sourceofhope.git
cd sourceofhope
```

Install dependencies:

```bash
npm install
# if npm reports peer dependency conflicts:
npm install --legacy-peer-deps
```

## Configure environment variables

Copy the template and fill in **test/sandbox** keys:

```bash
cp .env.template .env.local
```

See `/docs/developers/11_ENVIRONMENT_VARIABLES.md` for every variable.

---

## Running Locally

```bash
npm run dev
```

The site and its API run together at `http://localhost:3000`.

Other scripts:

```bash
npm run lint    # ESLint
npm run build   # production build (also type-checks)
npm start       # serve the production build
```

### Sanity Studio

The Studio is a separate project:

```bash
cd sanity/the-source-of-hope
npm install
npm run dev     # http://localhost:3333
```

### Health check

```
GET http://localhost:3000/api/health
```

Should return JSON: `{ "status": "ok", "message": "Source of Hope API is running" }`

---

## Payments

| Flow                    | Endpoint                                                  |
| ----------------------- | --------------------------------------------------------- |
| Store card checkout     | `POST /api/checkout/create-stripe-payment-intent`         |
| Store Stripe Checkout   | `POST /api/checkout/create-stripe-checkout`               |
| Store PayPal            | `POST /api/checkout/create-paypal-order`                  |
| Donations               | `POST /api/checkout/create-donation-payment-intent`       |
| Memberships             | `POST /api/checkout/create-membership-payment-intent`     |
| Stripe webhook          | `POST /api/checkout/stripe-webhook`                       |

Store prices, tax, shipping, and fees are always computed on the server from Sanity product data; the browser only sends product ids, quantities, sizes, and options.

Stripe test cards (any future expiry date and any CVC):

| Result  | Card Number           |
| ------- | --------------------- |
| Success | `4242 4242 4242 4242` |
| Decline | `4000 0000 0000 0002` |

For PayPal, set `PAYPAL_API=development` and use sandbox buyer accounts from the PayPal Developer Dashboard.

Forward Stripe webhooks locally with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/checkout/stripe-webhook
```

Full API reference: `/docs/developers/06_API_ROUTES.md`. Payment flows: `/docs/developers/10_PAYMENTS_AND_CHECKOUT.md`.

---

## Environments and Deployment

Vercel deploys from Git:

| Branch        | Environment               |
| ------------- | ------------------------- |
| `development` | Development / staging     |
| `production`  | Live site                 |

Open pull requests into `development`; release by merging `development` into `production`. Each Vercel environment has its own environment variables (test keys outside production). Details: `/docs/02_ENVIRONMENTS_AND_DEPLOY.md`.
