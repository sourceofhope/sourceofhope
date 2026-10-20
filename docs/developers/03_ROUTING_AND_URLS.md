# Routing and URLs

Routing uses the Next.js **App Router**. The folder structure under `/src/app` is the URL structure; there is no central route table.

- A folder becomes a URL segment.
- A `page.tsx` file inside the folder makes that URL render.
- A folder named `[param]` is a dynamic segment.
- `route.ts` files under `/src/app/api` are API endpoints, not pages.

Because paths are plain strings, use `next/link` with `href="/about/team"` and search the codebase for the old string whenever you rename a route.

---

## Current Routes

| URL                            | File                                          | Notes                                   |
| ------------------------------ | --------------------------------------------- | --------------------------------------- |
| `/`                            | `/src/app/page.tsx`                           | Home                                    |
| `/about`                       | `/src/app/about/page.tsx`                     |                                         |
| `/about/team`                  | `/src/app/about/team/page.tsx`                | Sanity team groups                      |
| `/about/team/[slug]`           | `/src/app/about/team/[slug]/page.tsx`         | Sanity team member, `generateMetadata`  |
| `/connect`                     | `/src/app/connect/page.tsx`                   | Contact form                            |
| `/programs`                    | `/src/app/programs/page.tsx`                  | Formerly `/serve`                       |
| `/programs/servingHope`        | `/src/app/programs/servingHope/page.tsx`      | camelCase segment                       |
| `/programs/educationHope`      | `/src/app/programs/educationHope/page.tsx`    |                                         |
| `/programs/wellnessHope`       | `/src/app/programs/wellnessHope/page.tsx`     |                                         |
| `/programs/outdoorHope`        | `/src/app/programs/outdoorHope/page.tsx`      |                                         |
| `/programs/internationalHope`  | `/src/app/programs/internationalHope/page.tsx`|                                         |
| `/events`                      | `/src/app/events/page.tsx`                    | Timeline, monthly programs, waivers; `?event=<key>` opens an event |
| `/media`                       | `/src/app/media/page.tsx`                     | Sanity publications + newsletters       |
| `/media/press`                 | `/src/app/media/press/page.tsx`               |                                         |
| `/media/podcast`               | `/src/app/media/podcast/page.tsx`             |                                         |
| `/media/awards`                | `/src/app/media/awards/page.tsx`              | Formerly `/awards`                      |
| `/planned-giving`              | `/src/app/planned-giving/page.tsx`            | Planned giving form (email)             |
| `/members`                     | `/src/app/members/page.tsx`                   | Monthly memberships (Stripe)            |
| `/donate`                      | `/src/app/donate/page.tsx`                    | One-time donation (Stripe)              |
| `/store`                       | `/src/app/store/page.tsx`                     | Sanity products                         |
| `/store/product/[id]`          | `/src/app/store/product/[id]/page.tsx`        | `id` = slug, external id, or Sanity id  |
| `/store/cart`                  | `/src/app/store/cart/page.tsx`                | Client component                        |
| `/store/checkout`              | `/src/app/store/checkout/page.tsx`            | Client component                        |
| `/store/success`               | `/src/app/store/success/page.tsx`             | Payment return page                     |
| `/[slug]`                      | `/src/app/[slug]/page.tsx`                    | Legacy team member redirect             |

Segments are case-sensitive: `/programs/servinghope` does not match `/programs/servingHope`.

---

## Dynamic Routes

In Next.js 16, `params` (and `searchParams`) are Promises and must be awaited:

```tsx
export default async function TeamMember({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // ...
}
```

Call `notFound()` from `next/navigation` when the record does not exist (see `/src/app/about/team/[slug]/page.tsx`).

---

## Redirects

Permanent redirects are declared in `/next.config.ts`:

| From              | To                 | Why                              |
| ----------------- | ------------------ | -------------------------------- |
| `/awards`         | `/media/awards`    | Awards moved under Media         |
| `/giving`         | `/planned-giving`  | Old Giving URL                   |
| `/serve/:path*`   | `/programs/:path*` | "Serve" was renamed "Programs"   |

`/src/app/[slug]/page.tsx` handles old single-segment team member links (for example `/jane-doe`): it looks the slug up in Sanity and permanently redirects to `/about/team/<slug>`, or returns a 404.

When you rename or move a route, add a redirect so old links and search results keep working. See `/docs/recipes/guidelines/ADD_A_REDIRECT.md`.

---

## Error Pages

There is no custom `not-found.tsx`, `error.tsx`, or `loading.tsx`. Unknown URLs render the default Next.js 404 page inside the root layout (header and footer still render). Add `/src/app/not-found.tsx` if a branded 404 is needed.

---

## Navigation (Header)

Primary navigation lives in `getHeaderLinks()` inside:

- `/src/components/layout/Header.tsx`

Each entry is `{ label, href, children? }`. The same array drives the desktop dropdowns and the mobile drill-down menu. A section is highlighted (`aria-current="page"`) when the current path matches its `href` or any child.

Footer links are maintained separately in `/src/components/layout/Footer.tsx`.

Rule:

- If you add, rename, or move a route, update:
  1. the route folder under `/src/app`
  2. `getHeaderLinks()` (and Footer, if linked there)
  3. `/public/sitemap.xml`
  4. a redirect in `/next.config.ts` for the old URL

See `/docs/recipes/guidelines/CHANGE_NAVIGATION_MENU.md`.

---

## Sitemap and robots.txt

`/public/sitemap.xml` and `/public/robots.txt` are static files. The sitemap is **not** generated; add and remove URLs by hand when routes change.

---

## Asset Versioning

Static assets live under `/public/v2/...` and are referenced through `ASSET_VERSION`:

```tsx
import { ASSET_VERSION } from "@/lib/environment";

const src = `/${ASSET_VERSION}/core/TSOH-Logo.webp`;
```

Do not hardcode `/v2/...` in new code. See `/docs/recipes/fixes/UPDATE_STATIC_ASSETS.md`.
