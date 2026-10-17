# Update Static Assets

Static files that ship with the code (images, the home page video, downloadable PDFs) live under `/public/v2/`. Next.js serves everything in `/public` from the site root, so `/public/v2/core/TSOH-Logo.webp` is available at `/v2/core/TSOH-Logo.webp`.

The `v2` folder name is the asset version. It is defined once as `ASSET_VERSION` in `/src/lib/environment.ts`, so that every asset URL can be changed (and every cache invalidated) at once.

---

## Folder layout

| Folder | Contents |
| ------ | -------- |
| `/public/v2/core/` | Logo, favicon image, default hero (`TSOH-Family.webp`), placeholders, home page poster and hero video (`TSOH-Hero-720.webm`, `TSOH-Hero-1080.webm`, `TSOH-Hero-720.mp4`), awards images, planned giving images |
| `/public/v2/documents/` | Downloadable PDFs (volunteer agreements). See `/docs/recipes/tutorials/ADD_A_DOWNLOADABLE_DOCUMENT.md`. |
| `/public/v2/serve/` | Program banner images (the folder kept its old name after "Serve" became "Programs") |
| `/public/v2/<program>/` | Carousel and tile images per program: `educationHope/`, `internationalHope/`, `outdoorHope/`, `servingHope/`, `sharingHope/`, `wellnessHope/` |
| `/public/v2/plannedgiving/` | Planned giving images |

Files outside `v2` (favicons, `robots.txt`, `sitemap.xml`, `site.webmanifest`) are not versioned.

---

## Reference assets through ASSET_VERSION

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

`/src/lib/environment.ts` is safe to import from both server and client components.

Rule: don't hardcode `/v2/...` in new code.

---

## Replacing a file

### Option A: new file name (preferred)

Add the file under a new name (for example `TSOH-Family-2027.webp`) and update the references. New URLs are never cached, so the change appears immediately after deploy.

### Option B: same file name

Overwriting a file in place is fine for files that rarely change, but browsers, Vercel's CDN, and the `next/image` optimizer may keep serving the old copy for a while, because the URL didn't change. If the old version keeps appearing, use a new name or bump `ASSET_VERSION`.

---

## When to bump ASSET_VERSION

Bump it (for example `v2` → `v3`) when many files were replaced under the same names and you need every visitor to fetch fresh copies.

Steps:

1. Copy or move the folder: `/public/v2/` → `/public/v3/`.
2. Change `ASSET_VERSION` in `/src/lib/environment.ts` to `"v3"`.
3. Find and fix every reference that doesn't use the constant (see below).
4. Run `npm run build`, then click through the site checking for broken images.
5. Deploy code and the new folder together; they ship in the same commit.

### References that bypass the constant

Some files still hardcode the version or define their own local copy. Search before bumping:

```bash
grep -rn '"/v2/' src
grep -rn 'const ASSET_VERSION' src
```

At the time of writing this finds, among others:

- `/src/app/events/page.tsx` (hero `src="/v2/hope-run-for-hunger-2025.webp"`)
- `/src/components/events/EventsUpcomingSection.tsx` and `/src/app/programs/wellnessHope/page.tsx` (local `const ASSET_VERSION = "v2"`)
- Placeholder fallbacks in `/src/components/media/MediaBlogSection.tsx`, `/src/components/media/MediaNewsletterSection.tsx`, `/src/components/store/StorefrontProductCard.tsx`, and `/src/app/about/team/CarouselCard.tsx`

Switch these to `import { ASSET_VERSION } from "@/lib/environment"` as you touch them. (Ignore PayPal API paths such as `/v2/checkout/orders` in the checkout routes; those are PayPal's API version, not an asset path.)

---

## Common mistakes

- Changing `ASSET_VERSION` without moving the folder: every hero, logo, and placeholder 404s.
- Moving the folder without updating hardcoded paths: the pages above break.
- Uploading unoptimized files: keep images in `.webp` and sized for their display. See `/docs/recipes/guidelines/OPTIMIZE_STATIC_IMAGES.md`.

---

## Validation checklist

- `npm run build` passes and the browser console shows no 404s for `/v2/...` (or the new version) files.
- Header favicon, footer logo, page hero banners, and card placeholders render.
- The home page poster and hero video load.
- Replaced files show their new version after deploy (hard refresh, or check in a private window).
