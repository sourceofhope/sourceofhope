# Optimize and Version Static Images

Static frontend assets are versioned through:

- `ASSET_VERSION` in `/src/routes.jsx`

Images are referenced like:

- `/${ASSET_VERSION}/core/TSOH-Family.webp`

This pattern prevents stale caches after replacing assets.

---

## Use ASSET_VERSION for all static image paths

Example:

```jsx
import { ASSET_VERSION } from "@/routes";

<img src={`/${ASSET_VERSION}/core/TSOH-Logo.webp`} alt="" />;
```

Rule:

Do not hardcode `/v2/...` paths in components.

## When to bump ASSET_VERSION

Bump ASSET_VERSION when:

- you replaced image files but kept filenames the same

- you need to force cache invalidation globally

Example:

`v2` --> `v3`

This requires that the hosting environment contains the corresponding folder structure.

## Image format guidance

Preferred format:

`.webp` for most photographic or mixed content

Avoid:

- shipping large `.png` photos when `.webp` is available

- uncompressed JPEGs for hero images

Validation checklist

- Updated assets appear immediately after deployment (no stale caching).

- All asset references resolve (no 404s under the new ASSET_VERSION path).

- Hero/header/footer images load correctly on first paint.
