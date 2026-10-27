# Optimize and Version Static Images

Static frontend assets live in `/public` under a versioned folder:

- `/public/v2/...`, served at `/v2/...`

The version segment comes from `ASSET_VERSION`, which is exported by `/src/lib/environment.ts` (safe to import in server and client components):

```ts
export const ASSET_VERSION = "v2";
```

---

## Use ASSET_VERSION for All Static Paths

```tsx
import Image from "next/image";
import { ASSET_VERSION } from "@/lib/environment";

<Image
  src={`/${ASSET_VERSION}/core/TSOH-Logo.webp`}
  alt="The Source of Hope Logo"
  width={80}
  height={80}
/>;
```

Rule:

- Do not hardcode `/v2/...` in components. A few older files still do (for example the Events hero, and a local `ASSET_VERSION` constant in `EventsUpcomingSection`). Switch them to the import when you touch them.

---

## Prefer next/image for Local Files

For files in `/public`, `next/image`:

- serves resized versions for each screen size, based on `sizes` or `width`
- converts to modern formats when the browser supports them
- lazy-loads by default
- reserves space so the layout doesn't shift (see `/docs/recipes/guidelines/AVOIDING_LAYOUT_SHIFT_WITH_IMAGES.md`)

`PageHeader`, the Footer logo, and Planned Giving use it.

Plain `<img>` (the Header favicon, CMS images) gets the file exactly as stored, so those files must already be small.

---

## Image Format Guidance

Preferred:

- `.webp` for photos and mixed content
- source files sized close to their largest rendered size (heroes about 1600px wide)

Avoid:

- large `.png` photos
- uncompressed JPEGs
- images thousands of pixels wider than they are displayed

See `/docs/recipes/guidelines/CREATING_AN_IMAGE.md` for size targets and the Squoosh workflow.

---

## Replacing an Image

The simplest safe replacement is a **new file name** (for example `TSOH-Family-2026.webp`) and an updated reference. A new URL can't be served stale from any cache.

If you must keep the same file name, Vercel serves the new file after the next deploy. Browsers or proxies that cached the old URL may show the old image until their cache expires.

---

## When to Bump ASSET_VERSION

Bump it only when many assets were replaced in place and you need every static URL to change at once.

1. Copy `/public/v2` to `/public/v3`, then replace the files you're updating.
2. Change `ASSET_VERSION` to `"v3"` in `/src/lib/environment.ts`.
3. Search `/src` for hardcoded `/v2/` paths and fix them.
4. Remove `/public/v2` in a later release, once nothing references it.

Code and assets deploy together on Vercel, so they can't drift apart. But if the code says `v3` and `/public/v3` is missing a file, that image returns 404.

---

## Validation checklist

- Every referenced asset resolves (no 404s in the Network tab).
- Hero, header favicon, and footer logo load on first paint.
- New files are `.webp` and reasonably sized.
- A search for `"/v2/` in `/src` doesn't turn up new hardcoded paths.
