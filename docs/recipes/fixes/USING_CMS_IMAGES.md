# Use CMS Images Responsibly (Featured + Responsive Sizes)

CMS access is centralized in:

- `/src/cms` (fetchContent + helpers)

When you fetch posts with `_embed`, WordPress can include featured media under `_embedded["wp:featuredmedia"]`.

This project provides two helpers:

- `getFeaturedImage(post)` returns the featured image object (or null)
- `getResponsiveImage(image, { width })` selects the smallest appropriate WP size

---

## Always fetch with \_embed when you need images

Example:

```js
import { fetchContent } from "@/cms";

const posts = await fetchContent("/posts?per_page=10&_embed");
```

If you do not include `\_embed`, `getFeaturedImage` will return `null`.

## Extract featured image safely

```jsx
import { getFeaturedImage } from "@/cms";

const image = getFeaturedImage(post);
```

## Select an appropriate size for the layout

```jsx
import { getResponsiveImage } from "@/cms";

const src = getResponsiveImage(image, { width: 800 });
```

Guidelines for width selection:

- small card thumbnails: `320–480`px

- half-width content blocks: `640–900`px

- full-width banners: `1200–1600`px

Avoid anything larger unless absolutely necessary

Rule:

- Do not always render image.source_url when sizes exist.
- Prefer responsive sizes to reduce payload and improve LCP.

## Rendering example

```html
<img src={src} alt={image?.alt_text || ""} loading="lazy" decoding="async" />
```

Notes:

- Use `loading="lazy"` for below-the-fold content.

- Use eager loading only for the primary hero/above-the-fold image.

Failure modes and mitigation

- If image.media_details.sizes is missing, getResponsiveImage returns image.source_url.

- If image is null, you must provide a fallback in UI (placeholder image, omit <img>, etc.).

Validation checklist

- Images on listing pages (press, podcast, etc.) load quickly and do not fetch full-resolution originals unnecessarily.

- Featured images still render when a post has no intermediate sizes (fallback path works).

- No console errors are thrown when a post has no featured image.
