# Avoid Layout Shift with Images

Layout shift happens when an image loads without reserved space and pushes text down. It hurts readability and the Cumulative Layout Shift (CLS) score that Vercel Speed Insights reports.

This project renders images in two ways:

- **Local assets** in `/public` use `next/image`, which can reserve space and serve resized formats.
- **Sanity images** use a plain `<img>` pointing at the original uploaded file (see `/docs/recipes/fixes/USING_CMS_IMAGES.md`).

Either way, the space for the image must be fixed before it loads.

---

## Local Images: `next/image`

Give `next/image` its size one of two ways.

Known dimensions, using `width` and `height`. The Footer logo does this:

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

Fill a sized parent, using `fill` and `sizes`. The parent must be `relative` and have a height or aspect ratio. Planned Giving does this:

```tsx
<div className="relative w-full aspect-square md:aspect-auto md:h-96 rounded-2xl overflow-hidden">
  <Image
    src={`/${ASSET_VERSION}/core/plannedgiving_hero.webp`}
    alt="A Source of Hope volunteer in a food-service glove speaking into a microphone"
    fill
    sizes="(max-width: 1024px) 100vw, 50vw"
    className="object-cover"
  />
</div>
```

`sizes` tells the browser which width to download. Without it, a `fill` image may fetch a full-viewport version even when it only fills a card.

---

## Sanity Images: `<img>` in a Fixed Container

CMS images use `<img>` with the projected `sourceUrl`. Because `<img>` has no intrinsic size until it loads, put it inside a container that already has its final size:

```tsx
<div className="relative aspect-video overflow-hidden rounded-2xl">
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    src={post.image?.sourceUrl || `/${ASSET_VERSION}/core/placeholder.webp`}
    alt={post.image?.altText || post.title || ""}
    loading="lazy"
    decoding="async"
    className="absolute inset-0 w-full h-full object-cover"
  />
</div>
```

- Use `aspect-*` (`aspect-video`, `aspect-square`) or a fixed height (`h-64`) on the container.
- Use `object-cover` to crop or `object-contain` to letterbox. Choose on purpose.
- The `eslint-disable-next-line @next/next/no-img-element` comment is the project's accepted pattern for CMS images.
- Always provide a fallback image or empty state for records without an image.

---

## Loading Priority

Only the hero image should load eagerly. `PageHeader` already handles it with `preload` and `fetchPriority="high"`, so pages using `PageHeader` need nothing extra.

Everything else should be lazy:

- `<img>`: add `loading="lazy"` and `decoding="async"`
- `next/image`: lazy by default. Do not add `preload` or `fetchPriority` below the fold.

Several eagerly loaded images compete with the hero and slow down Largest Contentful Paint (LCP).

---

## Validation checklist

- Scrolling while images load does not make text jump.
- Card grids and carousels keep the same height before and after images load.
- Only the hero image is requested at high priority (check the Network tab "Priority" column).
- Records without an image render a placeholder rather than collapsing.
