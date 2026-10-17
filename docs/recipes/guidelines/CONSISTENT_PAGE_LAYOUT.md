# Use PageSection for Consistent Layout

`PageSection` sets the site's horizontal gutters and vertical rhythm. It uses the same left/right edge as the header and `PageHeader`, so page content lines up with the logo.

Component:

- `/src/components/ui/PageSection.tsx`

Implementation:

```tsx
export default function PageSection({
  children,
  className = "",
  id,
}: PageSectionProps) {
  return (
    <section
      id={id}
      className={`w-full grid gap-10 py-5 px-5 lg:px-35 scroll-mt-25 ${className}`}>
      {children}
    </section>
  );
}
```

---

## What It Applies

- Horizontal gutters: `px-5` (mobile), `lg:px-35` (desktop). These match the header and `PageHeader`.
- Vertical padding: `py-5`
- A grid with `gap-10` between direct children
- `scroll-mt-25`, so `#anchor` links don't land underneath the fixed header

Props:

| Prop        | Purpose                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------- |
| `children`  | Section content                                                                             |
| `className` | Extra classes, such as more padding (`py-10`), a background (`bg-neutral-200`), or a different `gap-*` |
| `id`        | Anchor target, e.g. Planned Giving's `id="form-section"`, which `href="#form-section"` links to |

---

## Recommended Pattern

Page sections live in `/src/components/<area>/<Area><Name>Section.tsx`. Start each one with `SectionHeading`:

```tsx
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AboutMissionSection() {
  return (
    <PageSection className="py-10">
      <SectionHeading eyebrow="Our mission" title="Restoring Dignity and Opportunity">
        A short supporting sentence about the section.
      </SectionHeading>
      {/* section content */}
    </PageSection>
  );
}
```

`SectionHeading` (`/src/components/ui/SectionHeading.tsx`) renders an eyebrow `Heading` (h3), a `Title` (h2), and an optional paragraph. Pass `inverted` on dark backgrounds.

---

## When Not to Use PageSection

- **Full-bleed bands** that span edge to edge with their own background. `CallToActionSection` (`/src/components/ui/CallToActionSection.tsx`) is a full-width closing band on `bg-accent-800`. Use it as is, not inside a `PageSection`.
- **The hero.** Use `PageHeader` (see `/docs/recipes/guidelines/CONSISTENT_PAGE_HEADER.md`).
- **Components that already own their gutters.** Don't nest one `PageSection` inside another, or the padding doubles.

If a custom full-width section still has content that should line up, reuse the same gutters: `px-5 lg:px-35`.

---

## Theme Tokens

Use the tokens defined in `/src/app/globals.css` (mostly in its `@theme` block), not Tailwind's default palettes:

- Colors: `primary-50`…`primary-900`, `accent-50`…`accent-900`, `neutral-50`…`neutral-900`
- Font sizes: `text-xs`, `text-sm`, `text-md`, `text-lg`, `text-xlg`, `text-xxlg`, `text-xxxlg`, `text-xxxxlg`
- Extra spacing: `15` (3.75rem), `35` (8.75rem), e.g. `py-15`, `lg:px-35`
- Fonts: `font-urbanist` (titles), `font-inter` (body)

Avoid `blue-*`, `gray-*`, and `teal-*` in new work. The site-wide consistency pass replaced them.

---

## Validation checklist

- Section content lines up with the header logo on mobile and desktop.
- Spacing between adjacent sections matches the rest of the page.
- Anchor links (`#id`) scroll to the section without hiding it under the header.
- No nested `PageSection` (no doubled gutters).
