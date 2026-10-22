# Deployment and Environments

The whole site — pages and API routes — deploys as one Next.js app on **Vercel**. Vercel builds directly from the GitHub repository; there are no GitHub Actions workflows, no `vercel.json`, and no SFTP step.

The Sanity Studio deploys separately (see the end of this document).

---

## Branches

| Branch           | Purpose                                  | Deploys to                                     |
| ---------------- | ---------------------------------------- | ---------------------------------------------- |
| `production`     | Live site                                | Production (thesourceofhope.org)               |
| `development`    | Integration and staging                  | Development environment (historically dev.thesourceofhope.org) |
| `feature/*` etc. | Work in progress, opened as PRs          | Vercel preview deployments (per project settings) |

Confirm the exact branch-to-domain assignments in the Vercel project under **Settings → Domains** and **Settings → Git**.

Release flow:

1. Branch from `development`, commit, push, open a PR into `development`.
2. Review, then merge. Vercel deploys `development`.
3. Verify on the development deployment.
4. Merge `development` into `production`. Vercel deploys the live site.
5. Verify production.

---

## What Vercel Runs

- Install: `npm install` (Vercel default)
- Build: `next build`
- Pages are served statically or rendered on demand as Next.js decides; CMS-backed pages refresh every 30 seconds.
- API routes run as serverless functions. Each instance has its own memory, which is why rate limits are per instance (see `/docs/developers/12_SECURITY.md`).
- `/public` is served from the site root.

A failing `next build` (TypeScript errors, a server-only import in a client component, missing required environment variables) stops the deployment and the previous deployment keeps serving traffic. Next.js 16 does not run ESLint during the build, so run `npm run lint` yourself.

---

## Environment Variables

Set every key from `/.env.template` in Vercel → **Settings → Environment Variables**, scoped per environment:

- **Production** — live Stripe keys, `PAYPAL_API=production`, live webhook secret
- **Preview / Development** — Stripe test keys, `PAYPAL_API=development` (sandbox), test webhook secret

`NEXT_PUBLIC_*` values are inlined into browser JavaScript at build time. After changing any variable, **redeploy** for it to take effect.

Reference: `/docs/developers/11_ENVIRONMENT_VARIABLES.md`.

---

## Stripe Webhook Setup

Each environment that takes payments needs its own webhook endpoint in the Stripe Dashboard (Developers → Webhooks), in the matching mode (test or live):

- Endpoint URL: `https://<environment-domain>/api/checkout/stripe-webhook`
- Events: `payment_intent.succeeded`
- Copy the endpoint's signing secret into that environment's `STRIPE_WEBHOOK_SECRET`

Locally, forward events with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/checkout/stripe-webhook
```

and put the printed `whsec_...` secret in `.env.local`.

---

## Post-Deploy Verification

- `GET https://<domain>/api/health` returns `{ "status": "ok", ... }`
- Home page loads, hero video or poster shows, no console errors
- `/events`, `/media`, `/store`, `/about/team` show CMS content (not empty states)
- Header dropdowns and the mobile menu work
- Contact form on `/connect` sends (production: confirm the email arrives)
- On development: a test-card purchase completes and the success page shows "complete"

See `/docs/recipes/guidelines/VERIFYING_ENVIRONMENT_CONFIGURATION.md`.

---

## Rollback

1. Vercel dashboard → Deployments → choose the last good production deployment → **Promote to Production** (instant rollback), or
2. Revert the offending commit on `production` and push; Vercel redeploys.

Then fix forward through the normal branch flow. Never edit production configuration by hand without recording the change.

---

## Deploying the Sanity Studio

The Studio is not part of the Vercel build. After changing schemas in `/sanity/the-source-of-hope/schemaTypes`:

```bash
cd sanity/the-source-of-hope
npm install
npm run deploy
```

`sanity.cli.ts` enables Studio auto-updates for the hosted Studio. Deploy the Studio **before** merging website code that depends on new fields, so editors can fill them in.

---

## Deployment-Critical Files

Be careful when changing:

- `/next.config.ts` — redirects, security headers, allowed image hosts
- `/package.json` and `/package-lock.json` — dependencies and build scripts
- `/src/app/layout.tsx` — wraps every page
- `/src/lib/environment.server.ts` — every secret flows through it
- `/src/app/api/checkout/**` — payments

Validate with `npm run lint` and `npm run build` locally before pushing.
