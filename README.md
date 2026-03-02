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
cd sourceofhope
npm i --legacy-peer-deps
```

```bash
cd server
npm i --legacy-peer-deps
```

## Configure environment variables
Copy the .env template:
```bash
cp .env.template .env
```
Update the .env with test/sandbox api key or live/production api key 


## Running the Server & Frontend
### Development (localhost)
```bash
cd sourceofhope
npm run dev:client

cd server
npm run dev
```

### Production (server)
```bash
npm build
```

### Endpoints used by the Frontend
The API Docs will be available at
```
http://localhost:3001/api/docs
```

Health check:
```
GET /api/health
```
Should return JSON: { status: "ok", message: "Source of Hope API is running" }


### Stripe Checkout
```
POST /api/checkout/create-stripe-session
```

Creates a Stripe checkout session and returns a checkout URL.

| Result  | Card Number           |
| ------- | --------------------- |
| Success | `4242 4242 4242 4242` |
| Decline | `4000 0000 0000 0002` |

Any future expiry date and any CVC.

### PayPal Checkout
```
POST /api/checkout/create-paypal-session
```

Creates a PayPal checkout session and returns a checkout URL.

#### Both endpoints use the same request structure from the frontend cart.

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
