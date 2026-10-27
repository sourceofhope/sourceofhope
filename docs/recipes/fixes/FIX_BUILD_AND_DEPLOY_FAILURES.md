# Debug Build and Deployment Failures

The site is one Next.js app deployed on Vercel from Git. Pushing to a deployed branch (such as `development` or `production`) starts a Vercel build that runs `next build`. If the build fails, the previous deployment keeps serving traffic.

See `/docs/developers/07_DEPLOYMENT.md` for the full deployment flow.

---

## Symptoms

- A Vercel deployment shows **Error** / build failed.
- `npm run build` fails locally.
- The deployment succeeded but your change isn't visible.
- The deployment succeeded but a page or API route errors at runtime.

---

## 1) Reproduce locally first

Run the same steps Vercel runs, from the repo root:

```bash
npm install
npm run lint
npm run build
```

- `npm run build` compiles and type-checks the app. TypeScript runs in `strict` mode, so a type error fails the build.
- In Next.js 16, `next build` does not run ESLint. Run `npm run lint` yourself before pushing.
- `npm run start` serves the production build at http://localhost:3000 if you want to click through it.

Fix every error locally before pushing; a green local build almost always means a green Vercel build (apart from environment variables, below).

---

## 2) Common build errors

### `server-only` imported from a Client Component

These modules start with `import "server-only"` and must never reach the browser:

- `/src/lib/environment.server.ts`
- `/src/lib/sanity-client.ts`
- `/src/lib/sanity-content.ts`
- `/src/lib/store-pricing.ts`

If a file with `"use client"` (or anything it imports) imports one of them, the build fails with an error about `server-only` and Client Components.

Fix:

- Fetch the data in a server component (a page or section without `"use client"`) and pass it to the client component as props.
- If you only need a type, use a type-only import: `import type { SanityProduct } from "@/lib/sanity-content";`

See `/docs/recipes/guidelines/SERVER_AND_CLIENT_COMPONENTS.md`.

### Hooks or browser APIs in a Server Component

Errors mentioning `useState`, `useEffect`, `onClick`, or `window` in a component without `"use client"` mean the component needs to be a client component. Add `"use client"` at the top of that file, or move the interactive part into a small client component.

### ``Configuration must contain `projectId` ``

`/src/lib/sanity-client.ts` creates the Sanity client when it is first imported. If `NEXT_PUBLIC_SANITY_PROJECT_ID` is missing in the build environment, every page that imports `sanity-content.ts` fails. Add the Sanity variables in Vercel for that environment (see below).

### Importing from `/sanity`

The Studio at `/sanity/the-source-of-hope` is a separate npm project and is excluded in `/tsconfig.json`. Don't import Studio files into `/src`.

---

## 3) Install failures

- `ERESOLVE` / peer dependency conflicts: install with `npm install --legacy-peer-deps`. If Vercel hits the same error, set the project's Install Command to `npm install --legacy-peer-deps` (or commit an `.npmrc` containing `legacy-peer-deps=true`).
- Node version: Next.js 16 needs Node 20.9 or newer. Node 22 LTS works. The repo has no `engines` field, so set the Node.js version in Vercel's project settings if a build complains.

---

## 4) Environment variables on Vercel

Environment variables are configured per environment (Production, Preview, Development) under Vercel → Project Settings → Environment Variables. A deployment only sees the variables for its environment.

- Missing Sanity variables fail the build (see above).
- Missing Stripe, PayPal, or Resend variables don't fail the build; the matching API route returns `500 "... is not configured"` at runtime. See `/docs/recipes/fixes/FIX_API_REQUEST_ERRORS.md`.
- `NEXT_PUBLIC_*` variables are inlined into the JavaScript at build time. After changing one, **redeploy**; editing the value alone doesn't change a running deployment.

The full list is in `/docs/developers/11_ENVIRONMENT_VARIABLES.md`.

---

## 5) "Deployed, but I don't see my change"

Work out which kind of change it is:

| Change | Why it might not show | Fix |
| ------ | --------------------- | --- |
| Code change | Pushed to a branch that isn't deployed, or the build failed. | Check the branch and the deployment status in Vercel. Confirm which branch maps to which domain in the Vercel dashboard. |
| Sanity content | Still a draft, or the 30-second cache hasn't refreshed. | Publish in the Studio, wait about 30 seconds, reload twice. See `/docs/recipes/fixes/FIX_CMS_FETCH_FAILURE.md`. |
| Replaced static file with the same name | Browser, CDN, or image-optimizer cache serves the old copy. | Use a new file name, or bump `ASSET_VERSION`. See `/docs/recipes/fixes/UPDATE_STATIC_ASSETS.md`. |

---

## 6) Read the logs

- **Build logs:** Vercel → Deployments → select the deployment → build output. The first error is usually the real one; later errors often cascade from it.
- **Runtime logs:** the deployment's logs / functions view shows `console.error` output from pages and API routes.

---

## 7) Roll back

If a deployment breaks the live site:

1. In the Vercel dashboard, promote the last known-good production deployment (Instant Rollback). This restores the site in seconds without a rebuild.
2. Revert the bad commit on the branch (`git revert <sha>`) and push, so the next deployment doesn't reintroduce the problem.
3. Verify the home page, `/api/health`, a CMS page (such as `/events`), and checkout.

Never patch production by hand; every change goes through Git.

---

## Validation checklist

- `npm run lint` and `npm run build` both pass locally.
- The Vercel deployment for your branch shows **Ready**.
- `/api/health` on the deployed URL returns `{"status":"ok", ...}`.
- The change is visible on the deployed site (hard refresh if a static file changed).
