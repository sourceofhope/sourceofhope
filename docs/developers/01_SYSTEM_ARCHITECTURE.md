# System Overview

The Source of Hope website consists of two separate runtimes:

1. Frontend (React + Vite) located under `/src`
2. Backend API (Express) located under `/server`

A third system provides content:

- Headless WordPress CMS used via WP REST API

The frontend renders UI and fetches content.
The backend handles secure operations (payments, email).
The CMS provides editable content for non-technical users.

---

## Responsibilities and Boundaries

Frontend (`/src`) handles:

- Routing and layout
- Rendering CMS content
- Storefront UI and cart flows
- Form UX (client-side)

Backend (`/server`) handles:

- Stripe PaymentIntents and Checkout Sessions
- Stripe webhook verification (raw request body)
- PayPal order creation/status checks
- Email sending (Resend)
- CORS allowlisting

CMS handles:

- Editable content exposed via WP REST
- Featured media embedding and responsive sizes
- Header banner configuration

---

## How Requests Flow

CMS:

- Frontend calls `fetchContent(endpoint)` which hits:
  `https://cms.thesourceofhope.org/wp-json/wp/v2{endpoint}`

API Server:

- Frontend calls server endpoints through API helpers in `/src/lib/api/*`
- Server supports multiple URL prefixes (local/dev/prod) and is also mounted on Vercel via routing config.
