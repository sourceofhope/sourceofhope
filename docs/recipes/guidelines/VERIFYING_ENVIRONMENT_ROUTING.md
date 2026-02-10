# Verify Environment Routing (Local vs Dev vs Prod)

The frontend chooses the API base URL dynamically at runtime in:

- `/src/lib/api/client.js`

Logic summary:

- Localhost → `http://localhost:3001/api`
- Dev site hostname → `https://api.thesourceofhope.org/dev/api`
- Prod site hostname → `https://api.thesourceofhope.org/app/api`

---

## 1) Confirm the site hostname behavior

In the browser console, inspect:

- `window.location.hostname`

Then confirm the computed base URL:

- `API_BASE_URL`

---

## 2) Confirm API prefixes exist on the server

The Express server mounts routes under:

- `/api/...` (local + Vercel)
- `/dev/api/...` (routing project / dev path)
- `/app/api/...` (routing project / prod path)

If you remove these prefixes, requests from `api.thesourceofhope.org` will fail.

---

## 3) Test expected health endpoints

Local:

- `http://localhost:3001/api/health`

Vercel/routed (examples):

- `https://api.thesourceofhope.org/dev/api/health`
- `https://api.thesourceofhope.org/app/api/health`

Expected response shape is the same.
