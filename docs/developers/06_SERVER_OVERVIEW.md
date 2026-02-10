# Server Overview (Express)

The backend API is implemented in Express and lives under:

- `/server`

Entry point:

- `/server/index.js`

It is deployed in two contexts:

- Local Node server (listens on PORT)
- Vercel serverless handler (exports app; does not listen)

---

## Prefix Strategy

The server supports three prefixes:

- Local: `/api`
- Dev: `/dev/api`
- Prod: `/app/api`

This is implemented explicitly so one server build can handle all environments through URL rewriting.

---

## Middleware Ordering

The order in `/server/index.js` is intentional:

1. CORS allowlist is applied.
2. Stripe webhook routes are defined using `express.raw(...)` BEFORE JSON parsing.
3. `express.json()` is applied for all other routes.

Do not move the webhook registration below `express.json()`.
Stripe signature verification requires raw request bytes.

---

## Health Endpoint

Health endpoints are registered for all prefixes:

- `GET /api/health`
- `GET /dev/api/health`
- `GET /app/api/health`

---

## Routes

Checkout routes:

- Mounted at `/api/checkout`, `/dev/api/checkout`, `/app/api/checkout`

Email routes:

- Mounted at `/api/email`, `/dev/api/email`, `/app/api/email`

404 behavior:

- Server returns JSON with `{ message, path, method }` for unmatched routes.
