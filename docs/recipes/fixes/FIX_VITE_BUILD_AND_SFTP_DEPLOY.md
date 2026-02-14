# Debug Vite Build and SFTP Deployment

The frontend is deployed as static files via GitHub Actions and SFTP.

Build output:

- `/dist`

Critical behavior:

- `dist/index.html` is copied to `dist/404.html` to support SPA routing on static hosts.

Root scripts:

- `build:client`
- `build`

---

## Symptoms

- The site loads but deep links (e.g. `/about/team`) return 404
- Changes are not visible after deployment (stale assets)
- Static assets 404 (images, JS bundles)
- The build succeeds locally but fails in CI

---

## Confirm the CI uses the correct build script

The required step is:

```bash
npm run build:client
```

This must produce:

- `dist/index.html`
- `dist/404.html`

If the workflow uploads only part of dist, routing will break.

## Confirm 404 fallback exists in the deployed output

In the deployed environment, verify:

`/404.html` exists and matches the SPA entrypoint

If missing:

direct navigation and refresh to deep routes will fail

## Confirm static host behavior

Static hosts commonly:

- serve `/404.html` for unknown routes
- or require rewrite rules to map all paths to index.html

This project relies on the `404.html` approach.
If host behavior changes, you must adjust the deployment strategy.

## Debug “changes not showing”

Most common causes:

- browser cache
- CDN cache
- static host cache

Mitigation:

- bump `ASSET_VERSION` if static assets were replaced and caching is stubborn

- ensure new JS/CSS bundles have unique hashed names (Vite does this by default)

## Debug missing assets

If JS bundles or images 404:

- confirm the deployed directory structure matches the built output

- confirm asset paths are correct (especially when using ASSET_VERSION)

- confirm your host serves static assets from the expected root

## Quick validation checklist after deploy

- Homepage loads without console errors

- Refresh on /about/team works

- Header and Footer assets load correctly

- No 404s for Vite-generated bundle files
