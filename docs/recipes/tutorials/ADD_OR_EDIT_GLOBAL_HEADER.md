# Add or Edit the Global Header Banner

The site header supports an optional strip that sits fixed above the navigation (for example, "Donate Today!"). This recipe explains how it works today, how to turn it on, and how it could be connected to the CMS.

Files involved:

- `/src/components/layout/Header.tsx` (`Header` and `HeaderBanner`)
- `/src/context/HeaderContext.tsx` (`bannerActive`, `setBannerActive`, `isBlocking`)
- `/src/components/store/Cart.tsx` (moves the floating cart button down when a banner is active)

---

## How It Works Today

- `HeaderBanner` is hardcoded: the text is `"Donate Today!"` and it links to `/donate` (constants `bannerText` and `bannerLink` inside the function).
- It only renders when HeaderContext's `bannerActive` is `true` **and** the visitor has not closed it.
- `bannerActive` defaults to `false` in `HeaderProvider`, and nothing in the codebase currently calls `setBannerActive(true)`. **So no banner is shown on the site today.**
- Closing the banner sets `bannerOpen` (local React state in `Header`) to `false`. The header lives in the root layout, so it stays closed while the visitor navigates, and comes back on a full page reload. It is not saved to `localStorage`.

While the banner is showing:

- The banner is `fixed top-0` with height `h-15 md:h-10`.
- The header moves down with `top-15 md:top-10` (instead of `top-0`).
- On pages that set `isBlocking` (the store pages, via `HeaderBlocker` or HeaderContext directly), a `h-15 md:h-10` spacer is rendered so content is not hidden behind the banner.
- The floating cart button moves from `md:top-4.5` to `md:top-14.5`.

---

## Turn On the Static Banner

Edit the text and link in `HeaderBanner`:

```tsx
function HeaderBanner({ onClose }: { onClose: () => void }) {
  const bannerText = "Join us at the Hope Run for Hunger!";
  const bannerLink = "/events";
  // ...
}
```

Then activate it. Either:

1. Make it the default in `/src/context/HeaderContext.tsx`:

   ```tsx
   const [bannerActive, setBannerActive] = useState(true);
   ```

2. Or turn it on from a client component (for example, only on certain pages):

   ```tsx
   "use client";

   import { useEffect } from "react";
   import { useHeaderContext } from "@/context/HeaderContext";

   export default function BannerActivator() {
     const setBannerActive = useHeaderContext()?.setBannerActive;

     useEffect(() => {
       setBannerActive?.(true);
       return () => setBannerActive?.(false);
     }, [setBannerActive]);

     return null;
   }
   ```

`HeaderBanner` renders its link with `next/link`, which is right for internal paths like `/donate`. For an external URL, switch to `<a href={...} target="_blank" rel="noopener noreferrer">`.

---

## Connect It to the CMS (Not Implemented Yet)

Sanity already has a **Banner Event** document type (`bannerEvent`: `enabled`, `text`, `link.url`, `expires`), a fetcher `fetchBannerEvents()` in `/src/lib/sanity-content.ts`, and a `GET /api/banner` route. None of these are used by the header yet, so editing a Banner Event in Sanity has no effect on the site.

One way a developer could wire it up:

1. In `/src/app/layout.tsx` (a Server Component), call `fetchBannerEvents()` inside `try/catch` and pick the newest document where `enabled` is true and `expires` is in the future.
2. Pass `{ text, link }` into `HeaderProvider` as a prop and use it to initialize the existing (currently unused) `banner` state, and set `bannerActive` from whether a banner was found.
3. In `HeaderBanner`, read `banner` from `useHeaderContext()` instead of the hardcoded constants.
4. Re-check `expires` on the client too, since CMS data is cached for up to 30 seconds.
5. Render internal links with `next/link` and external links with an `<a>` that opens a new tab. Note that Sanity's `url` field type expects an absolute URL by default; either treat links that start with `https://thesourceofhope.org` as internal, or allow relative URLs in `/sanity/the-source-of-hope/schemaTypes/banner-event.ts`.

Fetching client-side from `/api/banner` also works, but causes the header to shift after the page loads; the server-side approach avoids that.

When this is implemented, update this recipe and `/docs/creators/CONTENT_TYPES_REFERENCE.md`.

---

## Validation checklist

- Banner shows at the top with the header directly below it, on desktop and mobile (`h-15 md:h-10`)
- Closing the banner hides it and moves the header back to `top-0` without navigating
- On `/store` and `/store/cart` (which set `isBlocking`), the page content is not covered by the banner
- The floating cart button does not overlap the banner on desktop
- The banner link goes to the right place
- With the banner off, the header behaves exactly as before
