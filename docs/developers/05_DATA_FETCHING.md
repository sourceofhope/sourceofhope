# Data Fetching

There are two ways data reaches the UI:

1. **Server Components read data directly** — CMS content is fetched on the server while the page renders.
2. **Client Components call API routes** — interactive features (checkout, forms, payment status) call `/api/...` on the same origin.

There is no environment-aware API client and no base URL to configure. Relative URLs always reach the API routes of the deployment that served the page.

---

## 1. Server Components (CMS content)

Pages and sections without `"use client"` can import from `/src/lib/sanity-content.ts` and `await` the result:

```tsx
import { fetchFeaturedEvents, type SanityEvent } from "@/lib/sanity-content";

async function getEvents(): Promise<SanityEvent[]> {
  try {
    return await fetchFeaturedEvents(6);
  } catch {
    return [];
  }
}

export default async function EventsSection() {
  const events = await getEvents();
  if (events.length === 0) return <p>No featured events are scheduled right now.</p>;
  return <ul>{events.map((e) => <li key={e.id}>{e.title}</li>)}</ul>;
}
```

Examples in the codebase:

- `/src/app/events/page.tsx` (fetches events once, formats them with `/src/lib/event-view.ts`, and passes view objects to the timeline, grid, and modal)
- `/src/components/home/HomePublicationsSection.tsx`
- `/src/components/store/StorefrontProductSection.tsx`
- `/src/app/media/page.tsx` (fetches, then passes arrays to client sections as props)
- `/src/app/about/team/page.tsx`, `/src/app/about/team/[slug]/page.tsx`

Do **not** call your own `/api/...` routes from Server Components; import the `lib` function instead.

---

## Caching

- Sanity fetches use `{ next: { revalidate: 30 } }`. Rendered pages and query results are reused and refreshed at most every 30 seconds after content changes.
- Pages that read `searchParams` (for example `/donate`) render on every request.
- There is no on-demand revalidation webhook from Sanity. If content must appear instantly, add one (Sanity webhook → a route calling `revalidatePath`) rather than lowering the interval everywhere.

---

## Passing Data to Client Components

When an interactive component needs CMS data, fetch it in a Server Component and pass it as props. Props must be serializable (plain objects, arrays, strings, numbers).

Client components may import **types** from `sanity-content.ts`, but never runtime values:

```tsx
"use client";

import type { SanityPublication } from "@/lib/sanity-content";
```

Importing a function from a `server-only` module into a Client Component fails the build.

---

## 2. Client Components (API routes)

Interactive components call API routes with `fetch` and a relative path:

```tsx
const response = await fetch("/api/email/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, message, businessName }),
});

if (!response.ok) {
  throw new Error("Failed to send email");
}
```

Rules:

- POST bodies must be JSON with `Content-Type: application/json`; routes reject anything else with 400.
- Send only what the server needs. For store checkout that is product ids, quantities, sizes, the shipping method id, and the fee opt-in — the server reprices everything.
- Handle `429` (rate limited, see the `Retry-After` header) and show the route's `error` message when present.

Current client callers:

| Component                                                  | Route(s)                                                           |
| ---------------------------------------------------------- | ------------------------------------------------------------------ |
| `/src/components/connect/ConnectMapSection.tsx`            | `POST /api/email/send`                                             |
| `/src/components/planned-giving/FormSection.tsx`           | `POST /api/email/send`                                             |
| `/src/components/donate/DonateFormSection.tsx`             | publishable key, `create-donation-payment-intent`                  |
| `/src/components/members/MembersCheckoutSection.tsx`       | publishable key, `create-membership-payment-intent`                |
| `/src/components/store/checkout/SelfCheckoutSection.tsx`   | publishable key, `create-stripe-payment-intent`                    |
| `/src/components/store/checkout/ExpressCheckoutSection.tsx`| `/api/checkout-providers`, `create-stripe-checkout`, `create-paypal-order` |
| `/src/app/store/success/page.tsx`                          | `retrieve-stripe-session-status`, `retrieve-paypal-order-status`, `retrieve-stripe-payment-intent-status` |
| `/src/components/events/WaiverSignForm.tsx`                | `POST /api/waiver/start`, then a full-page redirect to DocuSign |

Full request/response details: `/docs/developers/06_API_ROUTES.md`.

---

## Browser State

- The store cart, shipping method, and fee opt-in live in `StoreCartContext` and are saved to `localStorage` (`sourceofhope_cart`, `sourceofhope_shipping`, `sourceofhope_processing`).
- Cart prices shown in the browser are for display only; checkout routes recompute totals from Sanity.
- `tsoh_waivers` (readable cookie, set by `/api/waiver/return`) records which volunteer agreements were signed online on this device; `useSignedWaivers()` reads it with `useSyncExternalStore`.
- The open event on `/events` lives in the URL (`?event=<key>`), updated with `window.history.pushState`/`replaceState`, which Next.js keeps in sync with `useSearchParams()`.
