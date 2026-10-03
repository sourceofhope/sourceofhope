# Use PageHeader for Hero Sections

`PageHeader` is the standard hero/banner component for pages.

Component:

- `/src/components/layout/PageHeader.tsx`

Key behavior:

- full-width hero image (`next/image`, `priority`) with a bottom fade
- fixed height, gutters (`px-5 md:px-15 lg:px-35`), and title typography so
  every page frames its title the same way
- renders the page's single `<h1>` from the `title` prop
- default hero image is versioned using `ASSET_VERSION`

Default `src`:

- `/${ASSET_VERSION}/core/TSOH-Family.webp`

---

## Basic usage

```tsx
import PageHeader from "@/components/layout/PageHeader";

export default function AboutPage() {
  return (
    <>
      <PageHeader title="ABOUT" subtitle="EMPOWERING COMMUNITIES" />
      {/* rest of page */}
    </>
  );
}
```

## Using a custom hero image

```tsx
import PageHeader from "@/components/layout/PageHeader";
import { ASSET_VERSION } from "@/lib/environment";

<PageHeader
  src={`/${ASSET_VERSION}/core/Some-Other-Hero.webp`}
  position="50% 30%" // optional object-position to keep faces in frame
  title="EVENTS"
  subtitle="JOIN US IN MAKING A DIFFERENCE"
/>;
```

Rules:

- Pass `title`/`subtitle` instead of styling your own headings inside the
  banner, and don't override its height with `className`.
- Do not hardcode `/v2/...` paths. Import `ASSET_VERSION`.
- Prefer `.webp` assets unless you have a specific reason not to.

## Sections below the header

- Wrap each section in `PageSection` (same gutters as the header).
- Start sections with `SectionHeading` (eyebrow + title) from
  `/src/components/ui/SectionHeading.tsx`.
- Use theme tokens (`primary-*`, `accent-*`, `neutral-*`), not Tailwind's
  default `blue-*`/`gray-*`/`teal-*` palettes.
- Close a page with `CallToActionSection` when it needs a final call to action.
