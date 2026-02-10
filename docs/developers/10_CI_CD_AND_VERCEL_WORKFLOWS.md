# CI/CD and Vercel Workflows

This project uses two parallel deployment mechanisms:

1. GitHub Actions (.yml workflows) for building and deploying the frontend via SFTP
2. Vercel projects for running the Express API in serverless mode and routing API traffic

Understanding how these interact is critical before changing build scripts, folder structure, or API paths.

---

## High-Level Architecture

There are three Vercel projects related to the API:

1. **Dev API project** — runs the Express server for development environment
2. **Prod API project** — runs the Express server for production environment
3. **Routing project** — lives at `https://api.thesourceofhope.org` and forwards traffic to the correct API project using path prefixes

Separately, the **frontend is NOT deployed on Vercel**.  
The frontend is built with Vite and deployed via SFTP using GitHub Actions.

---

## Frontend Deployment Flow (GitHub Actions)

When code is pushed:

### Development branch push

1. GitHub Action runs `build:client`
2. Vite builds `/dist`
3. `index.html` is copied to `404.html` to support static routing fallback
4. The `/dist` folder is uploaded via SFTP to the development hosting environment

### Production branch push

1. Same build process runs
2. `/dist` is uploaded via SFTP to the production hosting environment

Important implications:

- The frontend is a static site
- There is no Node server serving the frontend
- React Router must work from static files, which is why `404.html` is required
- Any change to routing must preserve this behavior

---

## Why `404.html` Exists

Vite builds a single-page app.

When a user visits:

/about/team

The server must return `index.html`, not a 404.

Copying `index.html` to `404.html` ensures the static host always returns the SPA entry point.

Do not remove this step from `build:client`.

---

## API Deployment Flow (Vercel)

The Express server in `/server/index.js` is deployed to Vercel.

The root `vercel.json` defines:

- A build for `server/index.js` using `@vercel/node`
- A route mapping:

/api/(.\*) → /server/index.js

This allows Vercel to treat the Express app as a serverless function.

However, your system adds an additional layer:

### Routing Project

The domain:

https://api.thesourceofhope.org

does not run the API itself.  
It rewrites traffic to either:

- Dev API project → `/dev/api/*`
- Prod API project → `/app/api/*`

This is why the server explicitly supports these prefixes.

---

## Why the Server Supports Three Prefixes

In `server/index.js`, routes are mounted for:

- `/api`
- `/dev/api`
- `/app/api`

This allows the same server code to run in:

- Local development
- Dev Vercel project
- Prod Vercel project
- Routing Vercel project

Do not remove these prefixes.

---

## Frontend → API Routing Logic

The frontend determines the correct API base URL in `/src/lib/api/client.js`.

At runtime:

- localhost → `http://localhost:3001/api`
- dev site → `https://api.thesourceofhope.org/dev/api`
- prod site → `https://api.thesourceofhope.org/app/api`

This matches the server’s prefix mounting and the routing project’s rewrites.

If you change API paths, you must update:

1. `client.js`
2. Server route mounting
3. Vercel routing rules

---

## What Triggers What

| Action                             | Result                                                  |
| ---------------------------------- | ------------------------------------------------------- |
| Push to dev branch                 | GitHub Action builds and SFTPs frontend to dev hosting  |
| Push to main/prod branch           | GitHub Action builds and SFTPs frontend to prod hosting |
| Push server code                   | Vercel automatically rebuilds API projects              |
| Request to api.thesourceofhope.org | Routing project forwards to correct API project         |
| Frontend fetch                     | Hits routing project, which hits correct API            |

---

## Common Developer Mistakes

### 1) Changing API paths without updating client.js

Breaks all checkout and email functionality.

### 2) Removing `/dev/api` or `/app/api` prefixes from the server

Breaks routing project forwarding.

### 3) Removing `404.html` copy step

Breaks React Router on static host.

### 4) Hardcoding API URLs in components

Bypasses environment detection and breaks dev/prod behavior.

---

## Safe Rule for Developers

You can safely change:

- React components
- Page sections
- CMS fetching logic
- UI behavior

You must be careful when changing:

- `/src/routes.jsx`
- `/src/lib/api/client.js`
- `/server/index.js`
- `vercel.json`
- `package.json` build scripts
- GitHub workflow files

These control deployment and environment routing.

---

## Mental Model

Think of it as:

Frontend (static) → Routing domain → Correct API project → Express server → Stripe/PayPal/Resend

And:

GitHub → Build → SFTP → Static host

These two pipelines are independent but must stay in sync.
