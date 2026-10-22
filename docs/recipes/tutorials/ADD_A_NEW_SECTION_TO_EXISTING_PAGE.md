# Add a New Section to an Existing Page

Pages in this project are thin: the route file in `/src/app/**/page.tsx` sets metadata, renders `PageHeader`, and then lists section components in order.

Use this recipe when you want to add a new block to an existing page without creating a reusable global component.

---

## Naming and Location

Page-scoped sections live in `/src/components/<area>/` and are named `<Area><Name>Section.tsx`.

Existing areas include `about`, `awards`, `connect`, `donate`, `events`, `home`, `media`, `members`, `planned-giving`, `programs`, and `store` (with `store/cart` and `store/checkout`).

Examples:

- `/src/components/about/AboutMissionSection.tsx`
- `/src/components/programs/ProgramsShowcaseSection.tsx`
- `/src/components/events/EventsIntroSection.tsx`

For a new "Partners" block on the About page, create:

- `/src/components/about/AboutPartnersSection.tsx`

If the block is useful on several pages, it belongs in `/src/components/ui/` instead. See `/docs/recipes/tutorials/ADD_A_REUSABLE_COMPONENT.md`.

---

## Build the Section

Wrap the content in `PageSection` (standard gutters and spacing) and start with `SectionHeading` (eyebrow + title):

```tsx
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AboutPartnersSection() {
  return (
    <PageSection>
      <SectionHeading eyebrow="Together" title="Our Partners">
        The organizations that help us serve families across DFW.
      </SectionHeading>
      <ul className="grid gap-5 md:grid-cols-3">{/* partner cards */}</ul>
    </PageSection>
  );
}
```

Guidelines:

- `PageSection` already applies `grid gap-10 py-5 px-5 lg:px-35`. Use `className` to add to it (e.g. a background), not to change the gutter.
- Use theme tokens (`primary-*`, `accent-*`, `neutral-*`), not Tailwind's default `blue-*`/`gray-*`/`teal-*`.
- Use `SectionHeading inverted` on dark backgrounds.
- Close a page with `CallToActionSection` if it needs a final call to action.

See `/docs/recipes/guidelines/CONSISTENT_PAGE_LAYOUT.md`.

---

## Server or Client?

Keep the section a Server Component (no `"use client"`) unless it needs browser interactivity.

- Static content or CMS data: Server Component. It can be `async` and call fetchers from `/src/lib/sanity-content.ts` directly (wrap them in `try/catch` and render an empty state on failure).
- State, effects, event handlers, `localStorage`, or browser APIs: add `"use client"` at the top of the file.
- If only a small part is interactive, keep the section on the server and put the interactive piece in its own small client component.

Existing interactive primitives like `Carousel` are already client components, so a server section can render them directly.

See `/docs/recipes/guidelines/SERVER_AND_CLIENT_COMPONENTS.md`.

---

## Mount the Section in the Page

Import the section in the route file and render it in the desired order:

```tsx
// /src/app/about/page.tsx
import AboutDescriptionSection from "@/components/about/AboutDescriptionSection";
import AboutMissionSection from "@/components/about/AboutMissionSection";
import AboutPartnersSection from "@/components/about/AboutPartnersSection";
import AboutSummarySection from "@/components/about/AboutSummarySection";

export default function About() {
  return (
    <>
      {/* PageHeader ... */}
      <AboutDescriptionSection />
      <AboutMissionSection />
      <AboutPartnersSection />
      <AboutSummarySection />
    </>
  );
}
```

If the section should be linkable (e.g. `/about#partners`), pass an `id` to `PageSection`. It has `scroll-mt-25` so the fixed header does not cover the heading.

---

## Validate

```bash
npm run dev
npm run lint
```

Validation checklist

- The section aligns with the header logo and neighboring sections on mobile, tablet, and desktop
- Spacing between adjacent sections is consistent
- Headings follow the page structure (`PageHeader` owns the `<h1>`; `Title` renders `<h2>`, `Heading` renders `<h3>`)
- CMS-backed sections render an empty state when there is no content
- No server-only import errors in a client section (`npm run build` confirms)
