# Deployment and Environments

This project has:

Frontend deployment:

- Built via Vite
- Deployed via SFTP through CI for production and development pushes (project convention)

API deployment:

- Multiple Vercel projects exist:
  - dev API project
  - prod API project
  - a routing project at `api.thesourceofhope.org`

The routing project forwards requests to the correct API project based on path prefixes.

---

## Vercel Routing (API)

The root `vercel.json` contains:

- A build mapping for `server/index.js` using `@vercel/node`
- A route mapping:
  - `/api/(.*)` --> `/server/index.js`

This configuration is used to mount the Express app in Vercel’s serverless runtime.

Additionally, your system uses `/dev/api` and `/app/api` prefixes at the server-level to support the routing domain’s rewrite rules.

Developers should always confirm:

- which domain is being used in the frontend (`client.js` vs `email.js`)
- which prefix is expected in that environment (`/dev/api` vs `/app/api`)
