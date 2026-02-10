# Use PageHeader for Hero Sections

`PageHeader` is the standard hero/banner component for pages.

Component:

- `/src/components/layout/PageHeader.jsx`

Key behavior:

- full-width hero image with overlay mask
- eager image loading for above-the-fold assets
- default hero image is versioned using `ASSET_VERSION`

Default `src`:

- `/${ASSET_VERSION}/core/TSOH-Family.webp`

---

## Basic usage

```jsx
import PageHeader from "@/components/layout/PageHeader";

export default function AboutPage() {
  return (
    <>
      <PageHeader>{/* hero text and elements */}</PageHeader>
      {/* rest of page */}
    </>
  );
}
```

## Using a custom hero image

```jsx
import PageHeader from "@/components/layout/PageHeader";
import { ASSET_VERSION } from "@/routes";

<PageHeader src={`/${ASSET_VERSION}/core/Some-Other-Hero.webp`}>
  {/* hero content */}
</PageHeader>;
```

Rules:

- Do not hardcode `/v2/...` paths. Import `ASSET_VERSION`.

- Prefer `.webp` assets unless you have a specific reason not to.

Performance notes

The hero `<img>` uses:

- `loading="eager"`

- `fetchPriority="high"`

- `decoding="async"`

This is appropriate for above-the-fold hero images.
Do not reuse PageHeader multiple times on a single page; it will force eager loading of multiple large images.

## Validation checklist

- Hero renders correctly across breakpoints (`h-100` `md:h-85`)

- Text overlay remains readable on bright images

- Default hero renders when no src is provided
