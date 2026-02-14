# Fix CORS: "Origin not allowed"

The Express server enforces CORS allowlisting in:

- `/server/index.js`

Allowed origins include:

- `https://thesourceofhope.org`
- `https://www.thesourceofhope.org`
- `https://dev.thesourceofhope.org`
- `http://localhost:5173`
- `normalizeOrigin(FRONTEND_URL)` from environment

---

## Symptom

Requests fail with an error similar to:

- `CORS policy: Origin not allowed.`

This typically appears in:

- browser console network errors
- server logs (if logged)

---

## Identify the requesting origin

In browser devtools (Network tab), confirm:

- Request URL
- Request headers include `Origin: ...`

The `Origin` must exactly match one of the allowed origins.

---

## Fix local development

Ensure:

- frontend runs at `http://localhost:5173`
- `server/.env` includes `FRONTEND_URL=http://localhost:5173`

Then restart the server.

---

## Fix dev/prod domain mismatch

If your frontend is served from a new domain (or subdomain), add it to `allowedOrigins` in `/server/index.js`.

Rule:

- Add both `https://domain` and `https://www.domain` if needed.
- Ensure you deploy the server change to the correct Vercel projects.

---

## Validate

After changes:

- restart local server
- reload browser with cache disabled
- verify the request succeeds
