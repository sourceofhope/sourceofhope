# Add a Static Store Promo Section

This recipe covers adding a marketing-only promo section that links into the store.

It is intentionally static and does not:

- fetch products
- render product grids
- touch the cart or checkout logic

It is safe to use on any page.

---

## Create the Section Component

Create the section in the folder of the page that will show it, following the `<Area><Name>Section.tsx` convention. For the home page:

- `/src/components/home/HomeStorePromoSection.tsx`

```tsx
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";

export default function HomeStorePromoSection() {
  return (
    <PageSection>
      <SectionHeading eyebrow="Shop with purpose" title="Support the Mission">
        Every purchase supports The Source of Hope programs and community work.
      </SectionHeading>
      <div className="w-fit">
        <LinkButton text="VISIT THE STORE" href="/store" />
      </div>
    </PageSection>
  );
}
```

If the same promo is needed on several pages, move it to `/src/components/ui/` and give it a neutral name (e.g. `StorePromoSection.tsx`).

---

## Mount It on a Page

Import it in the page and place it in order:

```tsx
// /src/app/page.tsx
import HomeStorePromoSection from "@/components/home/HomeStorePromoSection";

export default async function Home() {
  return (
    <>
      {/* ...existing sections */}
      <HomeStorePromoSection />
    </>
  );
}
```

---

## Optional: Link Directly to the Cart

Only if required:

```tsx
<LinkButton text="VIEW CART" href="/store/cart" />
```

The full list of store URLs is in `/docs/recipes/tutorials/ADD_STORE_LINK_OR_BUTTON.md`.

---

## Validation checklist

- Promo renders consistently on mobile and desktop and lines up with neighboring sections
- Button navigates to `/store` (and `/store/cart` if added)
- No product fetching, cart context, or `"use client"` was introduced
- `npm run lint` passes
