# Use PageHeader for Hero Sections

`PageHeader` is the standard hero banner at the top of every primary page. It fixes the banner height, gutters, and title typography so every page frames its title the same way.

Component:

- `/src/components/layout/PageHeader.tsx` (a Server Component)

---

## What It Renders

- A full-width background image using `next/image` with `fill`, `preload`, `fetchPriority="high"`, and `sizes="100vw"`, darkened and faded out at the bottom
- A fixed height (`h-100 md:h-110`) with `mb-10` below it
- Gutters `px-5 lg:px-35`, matching the header and `PageSection`
- The page's single `<h1>` from the `title` prop, and the `subtitle` beneath it

Because the hero image is preloaded at high priority, it is usually the page's Largest Contentful Paint (LCP) element. Do not add other eagerly loaded images above the fold.

---

## Props

| Prop        | Default                                    | Purpose                                                                    |
| ----------- | ------------------------------------------ | -------------------------------------------------------------------------- |
| `title`     | none                                       | Page title, rendered as the page's only `<h1>`                             |
| `subtitle`  | none                                       | Short uppercase tagline under the title                                    |
| `src`       | `/${ASSET_VERSION}/core/TSOH-Family.webp`  | Background image: a `/public` path, or a `cdn.sanity.io` URL (allowed in `/next.config.ts`) |
| `position`  | `"center"`                                 | CSS `object-position`, e.g. `"50% 30%"` to keep faces in frame             |
| `children`  | none                                       | Extra content under the title and subtitle, such as a button               |
| `className` | `""`                                       | Extra classes on the outer `<section>`. Don't use it to change the height. |

---

## Basic Usage

```tsx
import PageHeader from "@/components/layout/PageHeader";

export default function AboutPage() {
  return (
    <>
      <PageHeader title="ABOUT" subtitle="EMPOWERING COMMUNITIES" />
      {/* sections */}
    </>
  );
}
```

## Using a Custom Hero Image

```tsx
import PageHeader from "@/components/layout/PageHeader";
import { ASSET_VERSION } from "@/lib/environment";

<PageHeader
  src={`/${ASSET_VERSION}/servingHope/Carousel-3.webp`}
  position="50% 30%"
  title="DONATE"
  subtitle="EVERY GIFT CREATES HOPE"
/>;
```

Rules:

- Pass `title` and `subtitle` instead of placing your own headings inside the banner.
- Do not hardcode `/v2/...`. Import `ASSET_VERSION` from `@/lib/environment`.
- Prefer `.webp` images that are at least 1600px wide.

---

## Older Pages Still Using Children

Some pages predate the `title`/`subtitle` props and pass hand-styled headings as `children`:

- `/about`, `/connect`, `/programs`, `/media`, `/media/press`, `/media/podcast`, `/events`, `/members`

Several of these use an `<h2>`, which leaves the page without an `<h1>`. When you edit one of these pages, migrate it:

```tsx
// Before
<PageHeader>
  <h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">MEDIA</h2>
  <p className="font-semibold text-neutral-200 text-sm">OUR COMMUNITY CONTRIBUTION</p>
</PageHeader>

// After
<PageHeader title="MEDIA" subtitle="OUR COMMUNITY CONTRIBUTION" />
```

---

## Pages Without a Hero

Store pages have no dark banner, so the header's white text would be unreadable. These pages render `<HeaderBlocker />` (`/src/components/layout/HeaderBlocker.tsx`) instead of `PageHeader`. It renders nothing, but it switches the header to dark text through `HeaderContext` while the page is mounted.

The cart, checkout, and success pages set the same flag through `useHeaderContext()` directly.

---

## Sections Below the Header

- Wrap each section in `PageSection` (see `/docs/recipes/guidelines/CONSISTENT_PAGE_LAYOUT.md`).
- Start sections with `SectionHeading` (`/src/components/ui/SectionHeading.tsx`).
- Use theme tokens (`primary-*`, `accent-*`, `neutral-*`), not Tailwind's default palettes.
- End with `CallToActionSection` when the page needs a final call to action.

---

## Validation checklist

- The page has exactly one `<h1>` (check in devtools).
- The title lines up with the header logo on mobile and desktop.
- The hero image is not stretched, and faces stay in frame (adjust `position`).
- No other above-the-fold image is preloaded.
