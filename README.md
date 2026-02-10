# The Source of Hope

**The Source of Hope (TSOH)** is a 501(c)(3) nonprofit organization dedicated to improving the lives of individuals and families.

This repository powers our mission of spreading awareness for our mission: serving communities though education, wellness, and outreach.

This monorepo contains the front and backend used by the Source of Hope website. For full system documentation, see the `/docs` folder in the root of the project.

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

1. Frontend application (React + Vite)
2. Headless CMS (content only)
3. This API server (payments, forms, email)

The frontend calls the API whenever a task requires security, payment processing, or server-side logic; the CMS is called for pulling content like event cards or team-member profiles.

| Failure                | What to do         |
| ---------------------- | ------------------ |
| Content is wrong       | Check the CMS      |
| Layout is wrong        | Check the frontend |
| Checkout or forms fail | Check this server  |

---

## Quick Setup

Clone the repository:

```bash

git clone https://github.com/sourceofhope/sourceofhope.git
cd sourceofhope
```

Install dependencies:

```bash
cd server
npm i --legacy-peer-deps
```

## Configure environment variables

Copy the template:

```bash
cp .env.template .env
```

Minimum required variables:

```
STRIPE_SECRET_KEY=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=sandbox
FRONTEND_URL=http://localhost:5173
PORT=3001
```

## Running the Server & Frontend

### Development (localhost)

```bash
npm run dev
```

### Production (server)

```bash
npm build
```

View the built frontend: visit `localhost:5317` in your browser;
by default, the server runs at: `http://localhost:3001`.

Health check:

```
GET /health
```

Should return JSON: { status: "ok", message: "Source of Hope API is running" }

## Endpoints Used by the Frontend

### Stripe Checkout

```
POST /api/checkout/create-stripe-session
```

Creates a Stripe checkout session and returns a checkout URL.

### PayPal Checkout

```
POST /api/checkout/create-paypal-session
```

Creates a PayPal checkout session and returns a checkout URL.

Both endpoints use the same request structure from the frontend cart.
Testing Payments

| Result  | Card Number           |
| ------- | --------------------- |
| Success | `4242 4242 4242 4242` |
| Decline | `4000 0000 0000 0002` |

Any future expiry date and any CVC.

### PayPal Sandbox

Use sandbox buyer accounts from the PayPal Developer Dashboard.

## Environment Behavior

The frontend automatically selects the correct API based on the domain:

| Environment | API Used                    |
| ----------- | --------------------------- |
| Local       | `localhost:3001`            |
| Development | `/dev/api (Vercel rewrite)` |
| Production  | `/app/api (Vercel rewrite)` |

This allows the same frontend code to work safely across environments.

## Going Live With Payments

When moving from testing to production:

- Replace Stripe test key with live secret key
- Create a Live PayPal app and update credentials
- Set `PAYPAL_MODE=live`

No code changes are required.

## Deployment Options

This server can be deployed as:

- Vercel serverless functions
- Railway / Render Node app
- Containerized on AWS/GCP/Azure
- Hosted at https://api.thesourceofhope.org

Important Rules

- Never expose secret keys to the frontend
- Never edit environment variables directly on a live server without version control
- Always test checkout in sandbox before production deploy

Where to Learn More

For full documentation on:

- System architecture
- Project structure
- Deployment flow
- Developer task recipes
- CMS and content workflows

See `/docs`.
