# Add a New Page

This recipe describes the standard way to add a new routed page to the site.

The site uses the Next.js App Router, so routing is file-based: a folder under `/src/app` with a `page.tsx` file becomes a URL. There is no central route table to update.

A new page usually involves:

1. Creating `/src/app/<route>/page.tsx`
2. Creating its sections under `/src/components/<area>/`
3. (Optional) Adding it to the header navigation
4. Adding it to `/public/sitemap.xml`

This guide adds a _top-level_ page at `/impact`. For pages nested under an existing section (e.g. `/about/partners`), see `/docs/recipes/guidelines/ADD_A_CHILD_ROUTE.md`.

---

## Create the Route File

Create:

- `/src/app/impact/page.tsx`

The folder name is the URL segment, and it is case-sensitive (the program pages use camelCase segments such as `/programs/servingHope`). Prefer lowercase, hyphenated names for new pages (`/planned-giving` style).

---

## Implement the Page

Pages are Server Components by default. Export a `metadata` object for SEO, open with `PageHeader`, then render sections.

```tsx
import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ImpactSummarySection from "@/components/impact/ImpactSummarySection";
import ImpactStoriesSection from "@/components/impact/ImpactStoriesSection";

export const metadata: Metadata = {
  title: "Impact | The Source of Hope",
  description:
    "See how The Source of Hope serves families across Dallas–Fort Worth through food, education, and wellness programs.",
  openGraph: {
    title: "Impact | The Source of Hope",
    description:
      "See how The Source of Hope serves families across Dallas–Fort Worth.",
  },
};

export default function ImpactPage() {
  return (
    <>
      <PageHeader title="IMPACT" subtitle="WHAT YOUR SUPPORT MAKES POSSIBLE" />
      <ImpactSummarySection />
      <ImpactStoriesSection />
    </>
  );
}
```

Notes:

- `PageHeader` renders the page's single `<h1>` from `title`. Do not add another `<h1>`.
- Pass `src` (and optionally `position`) to `PageHeader` for a custom hero image. See `/docs/recipes/guidelines/CONSISTENT_PAGE_HEADER.md`.
- The root layout already provides the header, footer, fonts, analytics, and providers. Do not add them in the page.
- SEO details: `/docs/recipes/tutorials/ADD_OR_UPDATE_PAGE_SEO.md`.

---

## Create the Sections

Page-scoped sections live in `/src/components/<area>/` and are named `<Area><Name>Section.tsx`.

Create:

- `/src/components/impact/ImpactSummarySection.tsx`
- `/src/components/impact/ImpactStoriesSection.tsx`

Wrap each section in `PageSection` and start it with `SectionHeading`:

```tsx
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ImpactSummarySection() {
  return (
    <PageSection>
      <SectionHeading eyebrow="Our impact" title="Hope, Measured">
        A short supporting sentence about this section.
      </SectionHeading>
      {/* section content */}
    </PageSection>
  );
}
```

See `/docs/recipes/tutorials/ADD_A_NEW_SECTION_TO_EXISTING_PAGE.md` for more detail.

---

## Optional: Show CMS Content

If a section needs Sanity content, make it an `async` Server Component, call a fetcher from `/src/lib/sanity-content.ts`, and fall back to an empty state if the CMS is unreachable:

```tsx
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { fetchPublications } from "@/lib/sanity-content";

async function getPublications() {
  try {
    return await fetchPublications(6);
  } catch {
    return [];
  }
}

export default async function ImpactStoriesSection() {
  const posts = await getPublications();

  return (
    <PageSection>
      <SectionHeading eyebrow="Stories" title="Recent Updates" />
      {posts.length === 0 ? (
        <p className="text-neutral-500 text-center">No updates to display</p>
      ) : (
        <ul className="grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </PageSection>
  );
}
```

CMS content is refreshed at most every 30 seconds. If you need a new kind of content, see `/docs/recipes/tutorials/ADD_A_CMS_CONTENT_TYPE.md` and `/docs/recipes/guidelines/PULL_CONTENT_FROM_CMS.md`.

If the section needs interactivity (state, effects, event handlers), it must be a Client Component. See `/docs/recipes/guidelines/SERVER_AND_CLIENT_COMPONENTS.md`.

---

## Add to Navigation (Optional)

Header links are a local array returned by `getHeaderLinks()` in:

- `/src/components/layout/Header.tsx`

Add a top-level entry:

```tsx
{ label: "IMPACT", href: "/impact" },
```

Or add it as a child of an existing section:

```tsx
{
  label: "ABOUT",
  href: "/about",
  children: [
    { label: "TEAM", href: "/about/team" },
    { label: "CONNECT", href: "/connect" },
    { label: "IMPACT", href: "/impact" },
  ],
},
```

Keep the top level short; it overflows at tablet widths when it grows. Footer links are separate, in `/src/components/layout/Footer.tsx`. See `/docs/recipes/guidelines/CHANGE_NAVIGATION_MENU.md`.

---

## Add to the Sitemap

`/public/sitemap.xml` is a static, hand-maintained file. Add an entry:

```xml
<url>
  <loc>https://thesourceofhope.org/impact</loc>
  <changefreq>monthly</changefreq>
</url>
```

---

## Validate Locally

```bash
npm run dev
```

Visit `http://localhost:3000/impact`, then run:

```bash
npm run lint
npm run build
```

`npm run build` catches type errors and server/client import mistakes that the dev server can miss.

Validation checklist

- The page renders at `/impact` with the standard banner and one `<h1>`
- The browser tab shows `Impact | The Source of Hope`
- Header link (if added) works on desktop and in the mobile menu, and shows the active underline
- Refreshing the browser on `/impact` works
- Sections line up with the header gutter on mobile and desktop
- CMS-backed sections show their empty state (not an error) when Sanity is unavailable
- The sitemap includes the new URL
- `npm run lint` and `npm run build` pass
