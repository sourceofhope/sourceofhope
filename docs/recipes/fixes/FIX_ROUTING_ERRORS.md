# Debug api.thesourceofhope.org Routing Issues

The API is deployed as three Vercel projects:

1. Dev API project (Express server)
2. Prod API project (Express server)
3. Routing project at `https://api.thesourceofhope.org`

Frontend calls the routing domain using path prefixes:

- Dev: `https://api.thesourceofhope.org/dev/api`
- Prod: `https://api.thesourceofhope.org/app/api`

The server must therefore support these prefixes:

- `/dev/api/...`
- `/app/api/...`

---

## Symptoms

- Requests work locally but fail on dev/prod
- Requests work on one environment but not the other
- 404 responses that include `{ message: "Route not found", path, method }`
- Requests appear to hit the wrong environment

---

## 1) Confirm the frontend is targeting the expected base URL

In the browser console:

- `window.location.hostname`
- `API_BASE_URL` from `/src/lib/api/client.js`

Expected:

- dev site (`dev.thesourceofhope.org`) → `/dev/api`
- prod site (`thesourceofhope.org`) → `/app/api`

---

## 2) Confirm routing project rewrites

The routing project should rewrite:

- `/dev/*` → dev API project
- `/app/*` → prod API project

If rewrites are incorrect, the request may:

- hit the wrong project
- return a Vercel 404
- hit a different route tree than expected

---

## 3) Confirm the API server mounts routes under all prefixes

In `/server/index.js`, the following must exist:

- health:
  - `/api/health`
  - `/dev/api/health`
  - `/app/api/health`

- checkout:
  - `/api/checkout/*`
  - `/dev/api/checkout/*`
  - `/app/api/checkout/*`

- email:
  - `/api/email/*`
  - `/dev/api/email/*`
  - `/app/api/email/*`

If one prefix is missing, only one environment will work.

---

## 4) Confirm the request path matches the mount path

A frequent mismatch is calling:

- `/checkout/...`

when the server expects:

- `/api/checkout/...` (or `/dev/api/checkout/...`, `/app/api/checkout/...`)

Use the server’s 404 response JSON to confirm what path it received.

---

## 5) Quick health probes

These should all return JSON status:

- `https://api.thesourceofhope.org/dev/api/health`
- `https://api.thesourceofhope.org/app/api/health`

If either fails:

- the routing project rewrites are broken, or
- the target API project deployment is broken

---

## 6) Common causes

- Routing project rewrites changed
- A Vercel project is pointing at the wrong repo/branch
- Server route prefixes were removed/refactored
- Client-side environment detection misidentifies hostname
- CORS blocks requests from the active frontend origin
