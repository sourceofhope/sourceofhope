# Debug CMS (Sanity) Fetch Failures

All CMS reads happen on the server through two modules:

- `/src/lib/sanity-client.ts` creates the `next-sanity` client (`perspective: "published"`, `useCdn: !token`)
- `/src/lib/sanity-content.ts` holds every GROQ query, its TypeScript type, and the cache option `{ next: { revalidate: 30 } }`

Pages and server components call the `fetch*` functions from `sanity-content.ts` directly. The browser never talks to Sanity, so Sanity's CORS origin settings do not matter for the website.

---

## Symptoms

- A section shows its empty state even though content exists in the Studio:
  - `/store`: "No products available"
  - `/events`: "No featured events available" / "No recurring events available"
  - `/media`: "No blog posts to display" / "No newsletters to display"
  - Home page: "No updates to display"
  - `/about/team`: "Unable to load team data. Please try again later."
- One field is blank (title shows, image or summary doesn't).
- The build fails with an error like ``Configuration must contain `projectId` ``.
- An `/api/...` content route (for example `/api/product`) returns `500` with `{ "error": "Failed to fetch ..." }`.

Empty states are intentional: CMS-backed components wrap their fetch in `try/catch` and render an empty list instead of crashing. That means a Sanity failure looks like "no content". Check the server logs for the real error.

---

## 1) Check the environment variables

The client reads these through `getEnvironment()` in `/src/lib/environment.server.ts`:

| Variable | Required | Notes |
| -------- | -------- | ----- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | `sgzdqn9z`. Missing → `createClient` throws and the build fails. |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | `production`. A typo causes errors or empty results. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Yes | A date such as `2026-04-10`. Without it the client falls back to an old API version and logs a warning. |
| `SANITY_API_READ_TOKEN` | No | Only needed for a private dataset. When set, the client skips the CDN. An invalid token causes `401` errors. |

Locally they live in `.env.local` (copied from `/.env.template`); restart `npm run dev` after editing it. On Vercel they are set per environment under Project Settings → Environment Variables. `NEXT_PUBLIC_*` values are baked in at build time, so redeploy after changing them.

See `/docs/developers/11_ENVIRONMENT_VARIABLES.md`.

---

## 2) Read the real error

- Local: the terminal running `npm run dev` prints the `console.error` from the failing fetch or route.
- Vercel: open the deployment and check its runtime logs (function logs) for the same message.
- Probe a content route to see whether the deployment can reach Sanity at all:

```bash
curl -s http://localhost:3000/api/product
curl -s https://thesourceofhope.org/api/event/featured-event?per_page=1
```

A JSON array means Sanity is reachable and the problem is in the page or query. A `500` means the client or credentials are wrong.

---

## 3) Test the query in the Studio's Vision tool

The Studio includes the Vision plugin (`visionTool()` in `/sanity/the-source-of-hope/sanity.config.ts`).

1. Open the Studio and switch to the **Vision** tab.
2. Choose dataset `production`, set the API version to match `NEXT_PUBLIC_SANITY_API_VERSION`, and set the perspective to **published**.
3. Paste the query from `sanity-content.ts`, for example:

```groq
*[_type == "product"] | order(_createdAt desc) { "id": coalesce(string(externalId), _id), title, price }
```

If Vision returns nothing, the content itself is the problem (wrong `_type`, unpublished, or missing fields). If Vision returns data but the site doesn't, the problem is configuration or code.

---

## 4) Common causes

### Content is a draft

The client uses the `published` perspective, so drafts never appear. Confirm the document was **Published** in the Studio, not only edited.

### The cache hasn't refreshed yet

Queries revalidate every 30 seconds. After publishing, wait about 30 seconds and reload; the first request after the window may still serve the old page while it regenerates, and the next reload shows the new content. There is no webhook-based revalidation.

### A schema field was renamed

GROQ projections don't error on unknown fields; they return `null`. If a field in `/sanity/the-source-of-hope/schemaTypes/*.ts` was renamed, update the matching projection (`PRODUCT_FIELDS`, `EVENT_FIELDS`, `PUBLICATION_FIELDS`, `NEWSLETTER_FIELDS`, `IMAGE_PROJECTION`, or the inline team queries) and the TypeScript interface in `sanity-content.ts`.

### The document type name doesn't match

Queries filter on the schema `name` (`featuredEvent`, `recurringEvent`, `product`, `publication`, `newsletter`, `teamMember`, `teamGroup`, `checkoutProvider`, `bannerEvent`), not the Studio title.

### Required references are missing

Team members only appear inside their team group (`teamGroup._ref`), and groups with no members are hidden. A member without a group won't show on `/about/team`.

### A list limit hides items

Fetchers clamp their limits (`clampLimit`, max 50 for most lists). `/events` shows 6 featured and 12 recurring events; the home page shows 5 publications; `/media` shows 10 publications and 5 newsletters.

---

## 5) Fail gracefully in new components

Follow the existing pattern when you add a CMS-backed server component: catch errors and render an empty state, so a Sanity outage never breaks the page or the build.

```tsx
import { fetchPublications, type SanityPublication } from "@/lib/sanity-content";

async function getPublications(): Promise<SanityPublication[]> {
  try {
    return await fetchPublications(5);
  } catch {
    return [];
  }
}

export default async function LatestSection() {
  const posts = await getPublications();

  if (posts.length === 0) {
    return <p className="text-neutral-500">No updates to display</p>;
  }

  return <ul>{posts.map((post) => <li key={post.id}>{post.title}</li>)}</ul>;
}
```

Note: `/src/app/[slug]/page.tsx` (the legacy team-member redirect) and `/src/app/about/team/[slug]/page.tsx` call Sanity without a fallback, so they error rather than show an empty state when Sanity is down.

---

## Validation checklist

- `curl /api/health` and a content route (such as `/api/product`) both return JSON.
- The query returns the expected documents in Vision with the published perspective.
- After publishing in the Studio, the change appears on the site within about 30 seconds.
- With Sanity unreachable (for example, a wrong dataset locally), CMS sections show their empty state instead of crashing.
