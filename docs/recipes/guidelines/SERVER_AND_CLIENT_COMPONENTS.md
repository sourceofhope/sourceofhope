# Server and Client Components

In the Next.js App Router, every component in `/src/app` and `/src/components` is a **Server Component** unless its file starts with `"use client"`.

- Server Components render on the server, can be `async`, and can read secrets and Sanity directly. They send no JavaScript to the browser.
- Client Components also render in the browser, so they can use state, effects, and event handlers.

Getting this boundary right keeps pages fast and keeps secrets off the browser.

---

## Default to Server Components

Use a Server Component when the code:

- fetches CMS content (`/src/lib/sanity-content.ts`)
- exports `metadata` or `generateMetadata` (only Server Components can, so every `page.tsx` that sets SEO stays on the server)
- only renders markup from props or constants

Most pages and sections are Server Components: `PageHeader`, `PageSection`, `SectionHeading`, `EventsTimeline`, `EventsRecurringGrid`, `StorefrontProductSection`, and the program pages.

---

## When to Add "use client"

Add `"use client"` as the first line of a file when the component needs:

- state or effects: `useState`, `useEffect`, `useRef`
- event handlers: `onClick`, `onSubmit`, `onChange`
- browser APIs: `window`, `localStorage`, `IntersectionObserver`, `matchMedia`
- React context: `useHeaderContext()`, `useCartActions()`
- client-only libraries: `react-hook-form`, Stripe Elements (`@stripe/react-stripe-js`)
- navigation hooks: `usePathname`, `useRouter`

Existing client components include `Header`, `Footer` (both use `usePathname`), `Carousel`, the email forms, `DonateFormSection`, everything under `/src/components/store/` except `StorefrontProductSection` (a Server Component that fetches products), and the cart, checkout, and success pages.

Everything a client file imports also becomes client code, so put `"use client"` as deep in the tree as you can.

---

## Keep Client Islands Small

Split a page into a server wrapper and a small client piece. `/donate` is the model:

```tsx
// /src/app/donate/page.tsx (Server Component)
export const metadata: Metadata = { title: "Donate | The Source of Hope" /* ... */ };

export default async function DonatePage({ searchParams }: { searchParams: Promise<{ redirect_status?: string | string[] }> }) {
  const { redirect_status } = await searchParams;
  return (
    <>
      <PageHeader title="DONATE" subtitle="EVERY GIFT CREATES HOPE" />
      <DonateFormSection redirectSucceeded={redirect_status === "succeeded"} />
    </>
  );
}
```

`DonateFormSection` is the only `"use client"` part. The page keeps its metadata and server rendering.

Similarly, `/src/app/media/page.tsx` fetches publications on the server and passes them to the client `MediaBlogSection`.

`/events` goes further: the timeline and program cards are Server Components, and each card wraps its server-rendered content in a tiny client `EventTrigger` button. The only larger client piece is `EventModalController`, rendered inside `<Suspense>` because it reads `useSearchParams()`. Without that boundary `next build` fails ("Missing Suspense boundary with useSearchParams"); with it, only the modal is client-rendered and the rest of the page stays static.

---

## Server-Only Modules

These files start with `import "server-only"` and must never be imported by a client component:

- `/src/lib/environment.server.ts` (secrets via `getEnvironment()`)
- `/src/lib/sanity-client.ts`
- `/src/lib/sanity-content.ts`
- `/src/lib/store-pricing.ts`

Importing one from a `"use client"` file (directly or through another import) fails the build with an error saying `server-only` cannot be imported from a Client Component. That guard is intentional. It is what keeps the Stripe secret key, PayPal secret, Resend key, and Sanity token out of the browser bundle.

Client-safe shared modules:

- `/src/lib/environment.ts` (`ASSET_VERSION`)
- `/src/lib/store-constants.ts` (shipping, tax, processing rates, shared by cart UI and API)

---

## Type-Only Imports Are Fine

Client components can use the CMS types, because types are erased at build time:

```tsx
"use client";

import type { SanityProduct } from "@/lib/sanity-content";
```

Prefer `import type` to make the intent explicit. Some files use the inline form `import { type SanityProduct }`, which also works as long as every imported name is a type.

---

## Passing Props Across the Boundary

Props from a server component to a client component must be serializable: strings, numbers, booleans, arrays, plain objects, `null`.

- OK: `posts={posts}` (plain CMS data), `redirectSucceeded={true}`
- Not OK: functions, class instances, the Sanity client

A client component can still render server-rendered content passed in as `children`.

---

## Contexts Are Client-Only

`HeaderProvider` (`/src/context/HeaderContext.tsx`) and `StoreCartProvider` (`/src/context/StoreCartContext.tsx`) are client components. The root layout wraps the whole site in them.

- Only client components can call `useHeaderContext()` or `useCartActions()`.
- A server page that needs to affect the header renders a small client helper. That is exactly what `HeaderBlocker` does for the store pages.

---

## Validation checklist

- New `"use client"` files really need state, effects, handlers, browser APIs, or context.
- No client file imports runtime values from a server-only module.
- Pages that export `metadata` are not marked `"use client"`.
- `npm run build` passes. It surfaces boundary errors for every page, not just the ones you visited.
