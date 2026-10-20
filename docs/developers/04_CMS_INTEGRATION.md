# CMS Integration (Sanity)

Editable content lives in **Sanity** (project `sgzdqn9z`, dataset `production`). Editors use **Sanity Studio**; the website reads published content with GROQ queries.

All website-side CMS access is centralized in two server-only modules:

- `/src/lib/sanity-client.ts` — creates the client
- `/src/lib/sanity-content.ts` — every query, projection, and TypeScript type

Do not create Sanity clients or write GROQ elsewhere.

---

## The Client

`/src/lib/sanity-client.ts` uses `createClient` from `next-sanity` with values from `getEnvironment()`:

- `projectId` — `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `dataset` — `NEXT_PUBLIC_SANITY_DATASET`
- `apiVersion` — `NEXT_PUBLIC_SANITY_API_VERSION`
- `token` — `SANITY_API_READ_TOKEN` (optional)
- `useCdn: !token` — the CDN is used unless a token is set
- `perspective: "published"` — drafts are never returned

If the project id is missing, `createClient` throws when the module loads and any page that imports it fails to build.

---

## Queries (`sanity-content.ts`)

Every fetcher calls `client.fetch(query, params, { next: { revalidate: 30 } })`, so results are cached and refreshed at most every 30 seconds.

| Function                         | Document type      | Used by                                         |
| -------------------------------- | ------------------ | ----------------------------------------------- |
| `fetchTimelineEvents(limit=12)`  | `featuredEvent`    | `/events` timeline: upcoming plus those ended within the last year, oldest first |
| `fetchFeaturedEvents(limit=12)`  | `featuredEvent`    | `GET /api/event/featured-event`                 |
| `fetchRecurringEvents(limit=3)`  | `recurringEvent`   | `/events` (12), `GET /api/event/recurring-event`|
| `fetchProducts(limit?)`          | `product`          | `/store`, `GET /api/product`                    |
| `fetchProductById(id)`           | `product`          | `/store/product/[id]`, checkout pricing         |
| `fetchPublications(limit=12)`    | `publication`      | Home (5), `/media` (10)                         |
| `fetchNewsletters(limit=12)`     | `newsletter`       | `/media` (5)                                    |
| `fetchTeamGroupsWithMembers()`   | `teamGroup` + `teamMember` | `/about/team`, `GET /api/team-member`   |
| `fetchTeamMemberBySlug(slug)`    | `teamMember`       | `/about/team/[slug]`, `/[slug]` redirect        |
| `fetchCheckoutProviders()`       | `checkoutProvider` | `GET /api/checkout-providers`                   |
| `fetchBannerEvents()`            | `bannerEvent`      | `GET /api/banner` (not displayed on the site)   |

Conventions in this file:

- List sizes pass through `clampLimit()` (1–50 by default, up to 200 for products) so query-string values cannot request huge or invalid pages.
- User-supplied values are passed as GROQ parameters (`$id`, `$slug`), never interpolated.
- Records expose `id: coalesce(string(externalId), _id)`. `externalId` holds the legacy WordPress id for migrated content; new documents fall back to the Sanity `_id`.
- Events also expose `key` (the Sanity `_id`, unique across types, used for `/events?event=<key>` deep links), the extra detail fields below, and `waiver` defaulted with `coalesce(waiver, "general")`.
- `isOutdated` is `dateTime(coalesce(endDate, date)) < dateTime(now())`, so an event in progress isn't "over". Featured events past their end show as completed; recurring events never do (their date is the next occurrence).
- `/src/lib/event-view.ts` turns events into display-ready view objects on the server (dates formatted in Central time by `/src/lib/format-date.ts`) before they reach client components.
- `fetchProductById` matches `slug.current`, `externalId`, or `_id`, so product URLs keep working with any of them.

---

## Images

Images are projected with the shared `IMAGE_PROJECTION`:

```groq
"image": image{
  "sourceUrl": asset->url,
  "altText": alt,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}
```

`sourceUrl` is the **original uploaded file** on `cdn.sanity.io`. Components render it with a plain `<img>` and fall back to `/${ASSET_VERSION}/core/placeholder.webp`. There is no automatic resizing today, so editors must upload optimized images (see `/docs/creators/MEDIA_FORMAT_RULES.md`). `cdn.sanity.io` is already allowed in `images.remotePatterns` if you want to move to `next/image` or `@sanity/image-url` (installed, currently unused). See `/docs/recipes/fixes/USING_CMS_IMAGES.md`.

---

## Content Types (Studio Schemas)

Schemas live in `/sanity/the-source-of-hope/schemaTypes/` and are registered in `index.ts`. Required fields are marked `*`.

| Type               | Fields                                                                      |
| ------------------ | --------------------------------------------------------------------------- |
| `teamMember`       | teamGroup* (reference), name*, slug*, title, shortBio, bio, image (+alt)    |
| `teamGroup`        | name*, slug*, description                                                   |
| `featuredEvent`    | externalId, title*, date*, endDate, location, address, summary, description, program, waiver, eventPage.url, image (+alt); dates in America/Chicago |
| `recurringEvent`   | same as featured, plus schedule                                             |
| `product`          | externalId, title*, slug*, price, shortDescription, longDescription, impact, size, image (+alt) |
| `publication`      | externalId, title*, date*, summary, url, image (+alt)                       |
| `newsletter`       | externalId, title*, url*, image (+alt)                                      |
| `checkoutProvider` | providerId* (lowercase), name*, description, enabled*, icon                 |
| `bannerEvent`      | enabled, text, link.url, expires                                            |

Images use `hotspot: true` and an `alt` sub-field.

Behavior that depends on content:

- **Team ordering** — `/about/team` sorts groups by the `TEAM_ORDER` array in `/src/app/about/team/page.tsx`. Groups not in the list sort after listed ones; groups without members are hidden; members with images sort first.
- **Products** — a product without a positive `price` cannot be checked out. The CMS price is what customers are charged.
- **Checkout providers** — express checkout dispatches on the `name` field exactly: `Stripe` or `PayPal`. `Google Pay` and `Apple Pay` buttons render but are not implemented. `icon` selects the button icon (`stripe`, `paypal`, `googlepay`, `applepay`). Setting `enabled` to false hides a button.
- **Event waivers** — `waiver` is `general`, `serving-hope`, or `none`, and decides which volunteer agreement the event modal asks for (see `/src/lib/waivers.ts`). The shared event fields live in `/sanity/the-source-of-hope/schemaTypes/event-fields.ts`.
- **Banner events** — stored and exposed at `GET /api/banner`, but the header banner does not read them yet (see `/docs/recipes/tutorials/ADD_OR_EDIT_GLOBAL_HEADER.md`).

Editor-facing descriptions of each type: `/docs/creators/CONTENT_TYPES_REFERENCE.md`.

---

## Running and Deploying the Studio

```bash
cd sanity/the-source-of-hope
npm install
npm run dev      # http://localhost:3333
npm run deploy   # publish the hosted Studio after schema changes
```

Schema changes do not alter existing documents. If you rename a field, update the projection in `sanity-content.ts` and migrate or re-enter existing content.

Use the Studio's **Vision** tool to test GROQ queries against real data.

Adding a new type end to end: `/docs/recipes/tutorials/ADD_A_CMS_CONTENT_TYPE.md`.

---

## Resilience

Sanity can be slow or unreachable. Server Components that read CMS data wrap the call and return an empty value on failure:

```tsx
async function getPublications() {
  try {
    return await fetchPublications(5);
  } catch {
    return [];
  }
}
```

The component then renders an empty state ("No updates to display"). Follow this pattern for every new CMS-driven section so outages never break a page or a build.
