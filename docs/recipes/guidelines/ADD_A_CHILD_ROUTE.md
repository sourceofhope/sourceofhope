# Add a Child Route

This recipe covers adding a page underneath an existing section, such as:

- `/about/<child>`
- `/programs/<child>`
- `/media/<child>`
- `/store/<child>`

Routing is file-based (Next.js App Router). A child route is a folder inside the parent's folder in `/src/app` with its own `page.tsx`. There is no central route table to update.

---

## Create the Route Folder

Example: add `/about/partners`.

Create:

`/src/app/about/partners/page.tsx`

The folder name is the URL segment, and it is case-sensitive. Existing program pages use camelCase segments (`/programs/servingHope`), so match the naming of the siblings you are adding next to.

---

## Implement the Page

```tsx
import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import AboutPartnersSection from "@/components/about/AboutPartnersSection";

export const metadata: Metadata = {
  title: "Partners | The Source of Hope",
  description:
    "Meet the organizations that partner with The Source of Hope across Dallas–Fort Worth.",
};

export default function PartnersPage() {
  return (
    <>
      <PageHeader title="PARTNERS" subtitle="STRONGER TOGETHER" />
      <AboutPartnersSection />
    </>
  );
}
```

Notes:

- Every page exports its own `metadata` (see `/docs/recipes/tutorials/ADD_OR_UPDATE_PAGE_SEO.md`).
- Page sections live in `/src/components/<area>/` and are named `<Area><Name>Section.tsx`. For an `/about` child, that is `/src/components/about/`.
- Build each section on `PageSection` (see `/docs/recipes/guidelines/CONSISTENT_PAGE_LAYOUT.md`).
- Pages are Server Components by default. Only add `"use client"` to the pieces that need it (see `/docs/recipes/guidelines/SERVER_AND_CLIENT_COMPONENTS.md`).

---

## Dynamic Child Routes

For one page per CMS record, use a bracketed folder, as `/src/app/about/team/[slug]/page.tsx` does:

```tsx
export default async function PartnerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // fetch the record, call notFound() from "next/navigation" if it is missing
}
```

In Next.js 16, `params` is a Promise and must be awaited.

---

## Add It to the Header Dropdown

If the page should appear under `ABOUT`, add it to that entry's `children` in `getHeaderLinks()` in `/src/components/layout/Header.tsx`:

```tsx
{
  label: "ABOUT",
  href: "/about",
  children: [
    { label: "TEAM", href: "/about/team" },
    { label: "PARTNERS", href: "/about/partners" },
    { label: "CONNECT", href: "/connect" },
  ],
},
```

See `/docs/recipes/guidelines/CHANGE_NAVIGATION_MENU.md` for menu behavior.

---

## Add It to the Sitemap

`/public/sitemap.xml` is a static, hand-maintained file. Add an entry next to its parent:

```xml
<url>
  <loc>https://thesourceofhope.org/about/partners</loc>
  <changefreq>monthly</changefreq>
</url>
```

---

## Validate

Run `npm run dev` and confirm:

- `http://localhost:3000/about/partners` renders with the standard header and footer
- The new dropdown item works on desktop (hover and keyboard) and in the mobile menu
- The `ABOUT` item shows as active (underlined) while on the child page
- A hard refresh on the child URL works
- `npm run lint` and `npm run build` pass
