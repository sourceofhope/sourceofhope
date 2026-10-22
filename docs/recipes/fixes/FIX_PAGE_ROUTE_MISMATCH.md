# Debug Route Mismatches and Page 404s

The site uses the Next.js App Router. Routing is file-based: the folder path under `/src/app` is the URL, and a folder only becomes a page when it contains a `page.tsx`. There is no central route table.

Navigation links are plain `href` strings, so a typo in a link or a moved folder is the usual cause of a mismatch.

---

## Symptoms

- A page you created shows the default Next.js 404 page.
- A header or footer link goes to the wrong URL or to a 404.
- An old bookmarked URL (for example `/serve/...` or `/awards`) stopped working.
- A dynamic page (`/store/product/<id>`, `/about/team/<slug>`) 404s or crashes.

---

## 1) Check the file location and name

The URL maps to the folder path, and the file must be named exactly `page.tsx`:

| URL | File |
| --- | ---- |
| `/events` | `/src/app/events/page.tsx` |
| `/media/awards` | `/src/app/media/awards/page.tsx` |
| `/programs/servingHope` | `/src/app/programs/servingHope/page.tsx` |
| `/store/product/<id>` | `/src/app/store/product/[id]/page.tsx` |

Common mistakes:

- Naming the file after the page (`EventsPage.tsx`) instead of `page.tsx`.
- Putting the page under `/src/pages` (this project doesn't use the Pages Router).
- Creating the folder at the wrong level.

Other files in a route folder (such as `/src/app/about/team/CarouselCard.tsx`) are not routes; only `page.tsx` (and `route.ts` under `/src/app/api`) are.

---

## 2) Check the case of the URL

URLs are case-sensitive. The program pages use camelCase segments:

- `/programs/servingHope`, `/programs/educationHope`, `/programs/wellnessHope`, `/programs/outdoorHope`, `/programs/internationalHope`

`/programs/servinghope` is a different URL and returns 404. Match the folder name exactly in every link.

---

## 3) Check dynamic routes

Folders in square brackets are dynamic segments. In Next.js 16, `params` is a Promise and must be awaited:

```tsx
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // ...
}
```

Existing dynamic routes:

- `/src/app/store/product/[id]/page.tsx`: `id` can be the product's slug, `externalId`, or Sanity `_id`. An unknown id renders a "We Can't Find That Product" message.
- `/src/app/about/team/[slug]/page.tsx`: `slug` is the team member's slug. An unknown slug calls `notFound()` (404).

If the record exists in Sanity but the page 404s, check that the slug in the URL matches the published document's slug (see `/docs/recipes/fixes/FIX_CMS_FETCH_FAILURE.md`).

---

## 4) Check the navigation links

Header links live in the `getHeaderLinks()` array in `/src/components/layout/Header.tsx`. Footer links are separate, in `/src/components/layout/Footer.tsx`. Each link is a label plus an `href` string.

- Compare the `href` with the folder path character by character.
- When you move or rename a page, search the codebase for the old path:

```bash
grep -rn '"/old-path' src
```

See `/docs/recipes/guidelines/CHANGE_NAVIGATION_MENU.md`.

---

## 5) Old URLs need redirects

When a page moves, add a redirect in `/next.config.ts` so old links and search results keep working. Current redirects (all permanent, 308):

| From | To |
| ---- | -- |
| `/awards` | `/media/awards` |
| `/giving` | `/planned-giving` |
| `/serve/:path*` | `/programs/:path*` |

See `/docs/recipes/guidelines/ADD_A_REDIRECT.md`.

---

## 6) The root `[slug]` catch

`/src/app/[slug]/page.tsx` matches any single-segment URL that isn't an existing page (for example `/jane-doe` or `/volunteer`). It exists because older links pointed team members at the site root:

- It looks up a team member with that slug in Sanity.
- If one exists, it permanently redirects to `/about/team/<slug>`.
- Otherwise it calls `notFound()` and the visitor sees the 404 page.

Implications:

- Static routes always win, so this never hides a real page such as `/events`.
- A mistyped single-segment URL still costs one Sanity lookup before the 404.
- The lookup has no error fallback, so if Sanity is unreachable these URLs error instead of returning 404.
- Multi-segment URLs (such as `/programs/servinghope`) are not caught by it and 404 directly.

---

## 7) Error pages

There is no custom `not-found.tsx`, `error.tsx`, or `loading.tsx`; Next.js defaults are used. A 404 renders inside the root layout (header and footer included). To customize it, add `/src/app/not-found.tsx`.

---

## 8) Keep the sitemap in sync

`/public/sitemap.xml` is a static, hand-maintained file. When you add, move, or remove a public page, update its `<loc>` entries. Search engines will otherwise keep crawling old URLs.

---

## Validation checklist

- Visiting the URL directly (and refreshing) loads the page, locally and on the deployed site.
- Header and footer links reach the page on desktop and mobile.
- Old URLs redirect to the new location instead of 404ing.
- Dynamic pages load for a real slug or id and show the not-found behavior for a fake one.
- `/public/sitemap.xml` lists the page's current URL.
