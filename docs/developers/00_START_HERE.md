# Developer Documentation

This section is intended to onboard developers to the Source of Hope codebase quickly and safely.

This documentation is not a set of task tutorials. The task tutorials live in `/docs/recipes` (index: `/docs/recipes/README.md`).
This section explains how the system is designed and where changes belong.

Read order:

1. `01_SYSTEM_ARCHITECTURE.md` — Next.js app, Sanity, payment and email services
2. `02_REPOSITORY_LAYOUT.md` — folders, scripts, the Sanity Studio project
3. `03_ROUTING_AND_URLS.md` — file-based routes, redirects, navigation, sitemap
4. `04_CMS_INTEGRATION.md` — Sanity client, GROQ queries, content types
5. `05_DATA_FETCHING.md` — Server Components, client fetches, caching
6. `06_API_ROUTES.md` — every route handler, its inputs, outputs, and limits
7. `07_DEPLOYMENT.md` — Vercel, branches, rollbacks, Stripe webhook setup
8. `08_UI_COMPONENT_CONVENTIONS.md` — layout, primitives, theme tokens, forms
9. `09_TROUBLESHOOTING.md` — common failure modes
10. `10_PAYMENTS_AND_CHECKOUT.md` — store, donations, memberships, webhook
11. `11_ENVIRONMENT_VARIABLES.md` — every variable and where it is used
12. `12_SECURITY.md` — server-side pricing, rate limits, headers, secrets

Quick start: `/docs/recipes/guidelines/RUN_LOCALLY.md`.

Key project rules:

- Never trust prices, totals, or redirect URLs from the browser. The server recomputes them (`/src/lib/store-pricing.ts`).
- Secrets are read only through `getEnvironment()` in `/src/lib/environment.server.ts`, which cannot be imported by client components.
- Call API routes with relative URLs (`fetch("/api/...")`). Do not hardcode domains.
- Reference static assets through `ASSET_VERSION` from `/src/lib/environment.ts`.
- Wrap CMS reads in Server Components with try/catch and render an empty state, so a Sanity outage never breaks a page or a build.
- Run `npm run lint` and `npm run build` before opening a pull request. There is no automated test suite.
