# Add or Update SEO for a Page

SEO uses the Next.js Metadata API. Each route file exports a `metadata` object (or a `generateMetadata` function), and Next.js renders the `<title>`, description, Open Graph, and Twitter tags on the server.

---

## Site-Wide Defaults

The root layout `/src/app/layout.tsx` exports defaults used by every page that does not override them:

- `metadataBase: new URL("https://thesourceofhope.org")` (resolves relative URLs in metadata)
- `title` and `description`
- `openGraph` (type, url, title, description, siteName) and `twitter` (card, title, description)
- `robots: "index, follow"`, `authors`
- `icons` (favicons, Apple touch icon) and `manifest` (`/site.webmanifest`)

The layout also renders an Organization JSON-LD `<script>` (name, url, social profiles). Edit it there if the organization's details change.

---

## Static Pages: `export const metadata`

Add to the route file (`/src/app/<route>/page.tsx`):

```tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | The Source of Hope",
  description:
    "Explore The Source of Hope events highlighting our mission and community impact across Dallas–Fort Worth.",
  openGraph: {
    type: "website",
    title: "Events | The Source of Hope",
    description: "Upcoming and recurring events across DFW.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Events | The Source of Hope",
    description: "Upcoming and recurring events across DFW.",
  },
};
```

Notes:

- `metadata` only works in Server Components. Pages marked `"use client"` (for example `/store/cart` and `/store/checkout`) cannot export it; move the interactive part into a child client component if the page needs its own metadata.
- Next.js merges metadata one level deep: a page's `openGraph` object **replaces** the layout's `openGraph` entirely. Include every Open Graph field you want (type, title, description) when you override it.

---

## Dynamic Pages: `generateMetadata`

For pages whose title depends on data, export `generateMetadata`. Example from `/src/app/about/team/[slug]/page.tsx`:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = await fetchTeamMemberBySlug(slug);

  if (!member) {
    return { title: "Team Member Not Found | The Source of Hope" };
  }

  return {
    title: `${member.name} | The Source of Hope`,
    description: member.title || "Meet our team member",
  };
}
```

`params` is a Promise in Next.js 16 and must be awaited. Repeated fetches with the same arguments are cached, so calling the fetcher in both `generateMetadata` and the page is fine.

---

## Canonical URLs

Set `alternates.canonical` when a page can be reached with extra query parameters (payment returns, tracking links). `/donate` and `/members` do this:

```tsx
const CANONICAL_URL = "https://thesourceofhope.org/donate";

export const metadata: Metadata = {
  title: "Donate | The Source of Hope",
  alternates: { canonical: CANONICAL_URL },
  openGraph: { type: "website", url: CANONICAL_URL /* ... */ },
};
```

---

## Sitemap and robots.txt

Both are static, hand-edited files:

- `/public/sitemap.xml` — add a `<url>` entry for every new public page, and remove or update entries when pages move
- `/public/robots.txt` — allows everything and points to the sitemap

Redirected paths (e.g. `/serve/...`, `/awards`) should not be listed.

---

## Guidelines

- Title format: `Page Name | The Source of Hope` (the root layout has no title template, so write the full title)
- Descriptions: one or two human-readable sentences, roughly 150 characters, mentioning the DFW community where relevant
- Keep the page's visible `<h1>` (from `PageHeader title`) consistent with the title
- Do not add `<title>` or `<meta>` tags manually inside components

---

## Validation checklist

- View the page source (or devtools Elements) and confirm `<title>`, `meta[name=description]`, and `og:*` tags
- Dynamic pages show the record's name in the tab title and a "Not Found" title for bad slugs
- New pages are in `/public/sitemap.xml`
- `npm run build` passes (it rejects `metadata` exports from client components)
