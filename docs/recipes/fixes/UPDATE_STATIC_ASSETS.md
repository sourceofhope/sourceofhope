# Update Static Assets

This project version-controls static asset URLs using:

- `ASSET_VERSION` in `/src/routes.jsx`

Assets are referenced like:

- `/${ASSET_VERSION}/core/TSOH-Family.webp`

This prevents cache problems when replacing images.

---

## When to Change ASSET_VERSION

Change `ASSET_VERSION` when you have updated static files and want to force clients/CDNs to fetch the new versions.

Example:

- `v2` --> `v3`

Then update the static asset folder structure on the host accordingly.

---

## Where It Is Used

Common usage:

- `PageHeader` default hero image
- Footer logo image

Guideline:

- Never hardcode `/v2/...` in components.
- Always import `ASSET_VERSION` and build paths using it.

---

## Common Mistake

If you update `ASSET_VERSION` in code but do not deploy the matching folder structure in hosting:

- images will 404
- hero/header and footer branding will break

Always coordinate code `ASSET_VERSION` changes with asset deployment.
