# Environments and Deployment

This project operates across multiple environments to ensure safe development and testing before changes reach production (what our visitors see and use).

The whole site — pages and API routes — is one Next.js app deployed to Vercel, so every environment always runs matching frontend and backend code.

---

## Environments

### Local

Used by developers for building and testing changes; changes are visible only on a given device.

- Runs on `http://localhost:3000` (`npm run dev`)
- API routes run in the same process at `http://localhost:3000/api/...`
- Reads environment variables from `.env.local`
- Should use Stripe test keys and the PayPal sandbox
- Completely safe for experimentation

See `/docs/recipes/guidelines/RUN_LOCALLY.md`.

---

### Development / Staging

Used for testing changes in a live-like environment before production.

- Deployed by Vercel from the `development` branch
- Historically served at dev.thesourceofhope.org (confirm the current domain in the Vercel project's Domains settings)
- Should use test/sandbox payment keys
- Used to verify routes, CMS content, forms, and checkout

---

### Production

The live public site at thesourceofhope.org.

- Deployed by Vercel from the `production` branch
- Uses live payment keys
- Only updated through controlled merges
- Must be stable at all times

---

## How the Site Knows Which Environment It Is In

There is no hostname-based API switching anymore. The browser always calls `/api/...` on the domain it is already on, so each deployment automatically talks to its own API routes.

What differs between environments is **configuration**: each Vercel environment has its own environment variables (Stripe keys, PayPal mode, webhook secret, Resend key, Sanity settings). See `/docs/developers/11_ENVIRONMENT_VARIABLES.md`.

The Studio and `.env.template` both use the Sanity `production` dataset, so CMS content is normally shared by every environment. Publishing in Sanity changes what local, development, and production all show.

---

## Deployment Flow

1. Developer creates a feature branch from `development` and makes changes locally.
2. Developer runs `npm run lint` and `npm run build` locally.
3. Developer pushes the branch and opens a pull request into `development`.
4. Pull request is reviewed, approved, and merged into `development`.
5. Vercel builds and deploys `development` to the development environment.
6. After verification, `development` is merged into `production`.
7. Vercel builds and deploys `production` to the live site.
8. Verification is performed after each deploy.

Vercel also creates a preview deployment for pull requests and other branches, depending on project settings.

---

## Rules for Deployment

- Never change production by hand; all changes go through Git.
- Documentation updates must be included when behavior changes.
- Changes to environment variables in Vercel require a redeploy to take effect.
- Verify forms, checkout, routes, and CMS content after deployment.

---

## Rollback Strategy

If a deployment causes issues:

1. In the Vercel dashboard, promote the previous working production deployment (instant rollback), **or** revert the bad commit on `production` and let Vercel redeploy.
2. Verify site functionality.
3. Fix the problem on a branch and redeploy through the normal flow.

See `/docs/developers/07_DEPLOYMENT.md` for details.
