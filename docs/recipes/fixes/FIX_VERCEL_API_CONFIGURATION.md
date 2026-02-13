# Debug Vercel API Build Configuration

The Express API is deployed via Vercel and configured by the root `vercel.json`.

Root `vercel.json`:

- builds: `{ "src": "server/index.js", "use": "@vercel/node" }`
- routes: `/api/(.*)` → `/server/index.js`

This means:

- Vercel treats `server/index.js` as the serverless entrypoint
- Requests to `/api/*` are dispatched to the Express app

Your server additionally supports:

- `/dev/api/*`
- `/app/api/*`

Those prefixes are handled inside Express.

---

## Symptoms

- Vercel deployment succeeds but `/api/health` returns 404
- Vercel returns “Cannot find module” errors
- Local server works but Vercel server fails
- Only `/api/*` works, but `/dev/api/*` and `/app/api/*` fail

---

## 1) Confirm the correct file is deployed

The Vercel build must point to:

- `server/index.js`

If the file path changes, update `vercel.json`.

---

## 2) Confirm dependencies are available

Server dependencies must be in:

- `server/package.json`

Vercel must install dependencies for that server project.
If you move dependencies to root or remove them from server, Vercel may fail at runtime.

---

## 3) Confirm route mapping expectations

Vercel routes map `/api/*` to the Express entrypoint.
The Express app then mounts:

- `/api/health` etc.

If you change health route definitions, update your probes and routing expectations.

---

## 4) Confirm dev/app prefixes are implemented by Express

The Vercel routing layer does not know about `/dev/api/*` or `/app/api/*`.
Those are handled by Express itself, so they must remain mounted in `/server/index.js`.

---

## Rule

Treat `vercel.json` and `/server/index.js` as deployment-critical configuration.
Any refactor requires validating:

- local server
- dev routed server
- prod routed server
