# Pull Content from the CMS

All Sanity reads go through one server-only module:

- `/src/lib/sanity-content.ts`: every GROQ query, its projection, and its TypeScript type
- `/src/lib/sanity-client.ts`: the configured `next-sanity` client (used only by the module above)

Pages and sections never build Sanity URLs or call the client directly. They call a fetcher from `sanity-content.ts`.

If the content type doesn't exist in Sanity yet, add its schema first (see `/docs/recipes/tutorials/ADD_A_CMS_CONTENT_TYPE.md`).

---

## Use an Existing Fetcher

Available fetchers:

- `fetchFeaturedEvents(limit = 12)`, `fetchRecurringEvents(limit = 3)`
- `fetchProducts(limit?)`, `fetchProductById(id)` (accepts a slug, `externalId`, or `_id`)
- `fetchPublications(limit = 12)`, `fetchNewsletters(limit = 12)`
- `fetchTeamGroupsWithMembers()`, `fetchTeamMemberBySlug(slug)`
- `fetchCheckoutProviders()`, `fetchBannerEvents()`

Each one returns typed data (`SanityEvent`, `SanityProduct`, `SanityPublication`, and so on) exported from the same file.

---

## Add a New Fetcher

Example: only events that haven't happened yet. Add this to `/src/lib/sanity-content.ts`, next to the other event fetchers:

```ts
export async function fetchUpcomingFeaturedEvents(limit = 3) {
  return client.fetch<SanityEvent[]>(
    `*[_type == "featuredEvent" && dateTime(date) >= dateTime(now())]
      | order(date asc)[0...${clampLimit(limit, 3)}] { ${EVENT_FIELDS} }`,
    {},
    options,
  );
}
```

Conventions in this file:

- **Projection**: reuse the shared field fragments (`EVENT_FIELDS`, `PRODUCT_FIELDS`, `PUBLICATION_FIELDS`, `NEWSLETTER_FIELDS`, `IMAGE_PROJECTION`). Images are always projected as `image{ "sourceUrl": asset->url, "altText": alt }`.
- **Ids**: list types project `"id": coalesce(string(externalId), _id)`, so legacy WordPress ids keep working.
- **Limits**: always pass numeric limits through `clampLimit(limit, fallback, max = 50)`. Never interpolate anything else into a query.
- **Parameters**: pass strings (slugs, ids) as GROQ parameters (`$slug`), as `fetchTeamMemberBySlug` does.
- **Caching**: pass the shared `options` (`{ next: { revalidate: 30 } }`), so content refreshes within about 30 seconds.
- **Types**: export an interface for any new shape and pass it as the `client.fetch<T>()` generic.

The client reads the `published` perspective, so drafts never appear on the site.

---

## Use It From a Server Component

Fetch in a Server Component (no `"use client"`), wrapped in `try/catch`. If Sanity is unreachable, the page and the build still succeed and show an empty state:

```tsx
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  fetchUpcomingFeaturedEvents,
  type SanityEvent,
} from "@/lib/sanity-content";

async function getEvents(): Promise<SanityEvent[]> {
  try {
    return await fetchUpcomingFeaturedEvents(3);
  } catch {
    return [];
  }
}

export default async function HomeUpcomingSection() {
  const events = await getEvents();

  return (
    <PageSection>
      <SectionHeading eyebrow="Join us" title="Upcoming Events" />
      {events.length === 0 ? (
        <p className="text-neutral-500 text-center">No upcoming events</p>
      ) : (
        <ul className="grid gap-5 md:grid-cols-3">
          {events.map((event) => (
            <li key={event.id}>{event.title}</li>
          ))}
        </ul>
      )}
    </PageSection>
  );
}
```

This is the same pattern as `EventsUpcomingSection`, `HomePublicationsSection`, `StorefrontProductSection`, and `/src/app/media/page.tsx`.

---

## Passing Data to Client Components

If the content needs interactivity (a carousel, an add-to-cart button), fetch in the server component and pass plain data down as props:

```tsx
// Server component
const posts = await getPublications();
return <MediaBlogSection posts={posts} />;
```

In the client component, import only the type:

```tsx
"use client";

import type { SanityPublication } from "@/lib/sanity-content";
```

A value import (`import { fetchPublications } ...`) in a `"use client"` file fails the build, because `sanity-content.ts` is `server-only`. See `/docs/recipes/guidelines/SERVER_AND_CLIENT_COMPONENTS.md`.

---

## Only Add an API Route If the Browser Must Fetch It

Pages don't need `/api` routes to read CMS content. Add a route handler under `/src/app/api/` only when client-side code has to request data after the page loads. Express checkout loading `/api/checkout-providers` is the one case today.

See `/docs/recipes/tutorials/ADD_AN_API_ROUTE.md`.

---

## Validation checklist

- The new query returns what you expect in the Studio's Vision tool (the `@sanity/vision` plugin).
- The page renders the content, and edits published in the Studio show up within about 30 seconds.
- Set `NEXT_PUBLIC_SANITY_DATASET` in `.env.local` to a dataset that doesn't exist and restart `npm run dev`. The section should show its empty state instead of crashing. (Revert afterwards.)
- No client component imports runtime values from `sanity-content.ts`.
