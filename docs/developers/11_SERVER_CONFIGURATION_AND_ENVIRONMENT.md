# Server Configuration and Environment Variables

The server reads all environment variables through:

- `/server/utility/environment.js`
- `dotenv.config()` in `/server/index.js`

`getEnvironment()` returns:

Stripe:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PUBLISHABLE_KEY`

PayPal:

- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_API_BASE`

Resend:

- `RESEND_API_KEY`

Frontend:

- `FRONTEND_URL`

---

## .env Template

The server expects a `.env` shaped like:

- Stripe keys and webhook secret
- PayPal keys and API base (sandbox/live)
- Resend API key
- Frontend URL for CORS
- PORT and NODE_ENV

---

## CORS Allowlist

Allowed origins include:

- production domains (with and without www)
- dev domain
- localhost:5173
- normalized `FRONTEND_URL`

If the request origin does not match, the server rejects the request with:

- `CORS policy: Origin not allowed.`
