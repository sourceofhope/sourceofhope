# Use CMS (Sanity) Images Responsibly

Images uploaded in Sanity Studio reach the site through the GROQ queries in `/src/lib/sanity-content.ts`. Every content type with an image uses the same projection:

```ts
const IMAGE_PROJECTION = `
  "image": image{
    "sourceUrl": asset->url,
    "altText": alt
  }
`;
```

So every fetched document has an optional `image` of type `SanityImage`:

```ts
interface SanityImage {
  sourceUrl?: string; // https://cdn.sanity.io/images/... (the original upload)
  altText?: string;   // the "Alt Text" field in the Studio
}
```

---

## Important: originals are served as-is

`asset->url` is the URL of the **original uploaded file**. The site renders it with a plain `<img>` and no resizing or format conversion. A 6 MB phone photo uploaded to the Studio is downloaded as 6 MB by every visitor.

Today the only safeguard is preparation before upload. Creators must resize and compress images first; see `/docs/creators/MEDIA_FORMAT_RULES.md` and `/docs/recipes/guidelines/CREATING_AN_IMAGE.md`.

---

## Rendering a CMS image

Always handle a missing image, provide alt text, and lazy-load anything below the fold:

```tsx
import { ASSET_VERSION } from "@/lib/environment";
import type { SanityPublication } from "@/lib/sanity-content";

function PublicationImage({ post }: { post: SanityPublication }) {
  return (
    <div className="relative h-64 overflow-hidden rounded-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.image?.sourceUrl || `/${ASSET_VERSION}/core/placeholder.webp`}
        alt={post.image?.altText || post.title}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
```

Guidelines:

- **Fallback:** use `/${ASSET_VERSION}/core/placeholder.webp` (team members use `/${ASSET_VERSION}/core/Member-Placeholder.webp`). `image` is `null` when nothing was uploaded, so always use optional chaining (`post.image?.sourceUrl`).
- **Alt text:** use `altText`, falling back to the document's title or name.
- **Reserve space:** put the image in a container with a fixed height or aspect ratio and use `object-cover` / `object-contain`, so the layout doesn't jump. See `/docs/recipes/guidelines/AVOIDING_LAYOUT_SHIFT_WITH_IMAGES.md`.
- **Type-only import:** client components may import the `SanityImage` / document types with `import type`, but never the fetch functions (the module is server-only).

---

## Lazy vs eager loading

- Use `loading="lazy"` and `decoding="async"` for CMS images. They appear in cards, carousels, and lists below the page banner.
- Only the page's hero should load eagerly. `PageHeader` already does this for its (local) background image.
- Don't eager-load several large images on one page; it slows the first render (LCP).

---

## Optional improvements (not current behavior)

If CMS images become a performance problem, either of these would add resizing. Both are possible with what's already installed and configured, but neither is used yet.

### A) Ask Sanity's image CDN for a smaller version

Sanity image URLs accept transformation parameters, for example width and automatic format:

```ts
const src = post.image?.sourceUrl
  ? `${post.image.sourceUrl}?w=800&auto=format`
  : `/${ASSET_VERSION}/core/placeholder.webp`;
```

`@sanity/image-url` is already a dependency and can build these URLs (and respect the Studio's hotspot/crop) if you project the image asset reference instead of only `asset->url`; check the package's README for its current API.

Width guidance:

- small card thumbnails: 320–480px
- half-width content blocks: 640–900px
- full-width banners: 1200–1600px

### B) Use `next/image`

`cdn.sanity.io` is already allowed in `images.remotePatterns` in `/next.config.ts`, so CMS URLs can be passed to `next/image`, which resizes, converts formats, and serves `srcset` automatically:

```tsx
import Image from "next/image";

<div className="relative h-64">
  <Image
    src={post.image.sourceUrl}
    alt={post.image.altText || post.title}
    fill
    sizes="(min-width: 1024px) 33vw, 100vw"
    className="object-cover"
  />
</div>;
```

Image optimization on Vercel has usage limits; check the plan before switching every CMS image over.

---

## Validation checklist

- Documents without an image render the placeholder, with no console errors.
- Every CMS image has meaningful alt text (from the Studio or a sensible fallback).
- Listing pages (`/store`, `/events`, `/media`, `/about/team`) don't jump as images load.
- In DevTools → Network, CMS images on listing pages are a reasonable size (ideally under ~300 KB each). If not, the uploads need optimizing, or one of the optional improvements above is worth doing.
