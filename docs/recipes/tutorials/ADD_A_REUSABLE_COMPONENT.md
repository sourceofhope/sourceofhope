# Add a Reusable Component

Reusable UI primitives live in `/src/components/ui/`. Before adding a new one, check whether an existing primitive (or a combination of them) already does the job.

---

## Check What Already Exists

Layout and headings:

- `PageSection` — standard section wrapper (gutters, spacing, optional `id`)
- `SectionHeading` — eyebrow + title + optional sentence (`inverted` for dark backgrounds)
- `Title` (`<h2>`) and `Heading` (`<h3>` eyebrow style)
- `CallToActionSection` — full-width closing call-to-action band
- `PageHeader` (in `/src/components/layout/`) — page banner and `<h1>`

Links and buttons (`/src/components/ui/Button.tsx` and `/src/components/ui/expressive/`):

- `LinkButton` — internal call-to-action button (`text`, `href`, `full?`)
- `AnchorButton` — external call-to-action button (opens a new tab)
- `Button` — plain `<button>`
- `ExpressiveLink` — internal inline link with an arrow (`to`)
- `ExpressiveAnchor` — external inline link with an up-right arrow (`href`)
- `SimpleLink` — plain internal text link (`to`)

Content and interaction:

- `Carousel`, `ExpressiveCard` (expandable card), `ExpressiveNumber` (count-up), `HighlightedText`
- `Overlay`, `Takeover` (portal-based overlays)
- `HookInput` (react-hook-form input), `HoneypotField` (spam trap for email forms)
- `Icon`, `Blockquote`, `Bold`, `Emphasis`
- `parallax/ParallaxSection`, `parallax/ParallaxLayer`

---

## Where to Place It

- Reusable primitives: `/src/components/ui/<Name>.tsx` (group related ones in a subfolder, like `expressive/`)
- Site-wide chrome (header, footer, banners): `/src/components/layout/`
- Blocks used by one page: `/src/components/<area>/` (see `/docs/recipes/tutorials/ADD_A_NEW_SECTION_TO_EXISTING_PAGE.md`)

Do not place reusable primitives inside a single page's folder.

---

## Follow the House Pattern

- Typed props `interface`, default export, `className = ""` default appended to the root element
- Internal navigation uses `next/link` with an `href` string (there is no central route constant)
- External links use `<a target="_blank" rel="noopener noreferrer">`
- Server-compatible by default: only add `"use client"` if the component needs state, effects, event handlers, or browser APIs
- Visible keyboard focus (`focus-visible:ring-*`) and accessible names (`aria-label` when the text alone is not descriptive)
- Theme tokens (`primary-*`, `accent-*`, `neutral-*`, `text-sm`/`md`/`lg`/`xlg`...) instead of Tailwind's default palettes

---

## Example: An Outlined Internal Button

```tsx
// /src/components/ui/OutlineLinkButton.tsx
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

interface OutlineLinkButtonProps {
  text: string;
  href: string;
  className?: string;
}

export default function OutlineLinkButton({
  text,
  href,
  className = "",
}: OutlineLinkButtonProps) {
  return (
    <Link
      href={href}
      className={`no-underline! group inline-flex items-center gap-3 rounded-2xl px-10 py-5 border-2 border-accent-500 text-accent-600 font-semibold transition-colors duration-500 hover:bg-accent-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 ${className}`}>
      <span>{text}</span>
      <ArrowRightIcon
        className="w-[1em] h-[1em] transition-transform duration-500 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}
```

Usage:

```tsx
<OutlineLinkButton text="LEARN MORE" href="/programs" />
```

This component has no state, so it works in both Server and Client Components. See `/docs/recipes/guidelines/SERVER_AND_CLIENT_COMPONENTS.md`.

---

## Validation checklist

- Keyboard focus is visible and the component is reachable with Tab
- Internal links use `next/link`; only external links use a bare `<a>` with `target="_blank"` and `rel="noopener noreferrer"`
- The component renders in a Server Component without errors (or is marked `"use client"` if it must be)
- It does not shift layout when its text changes
- `npm run lint` passes
