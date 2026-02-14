# Add a Static Store Promo Section

This recipe covers adding a marketing-only promo section that links into the store.

This is intentionally static and does not:

- fetch products
- render product grids
- run checkout logic

It is safe to use on any page.

---

## Create a Section Component

Example:

`/src/pages/home/sections/StorePromoSection.jsx`

Use `PageSection` for consistent spacing.

```jsx
import PageSection from "@/components/layout/PageSection";
import { LinkButton } from "@/components/ui/Button";
import Heading from "@/components/ui/text/Heading";
import { CANONICAL } from "@/routes";

export default function StorePromoSection() {
  return (
    <PageSection className="gap-5">
      <Heading>Shop to Support the Mission</Heading>
      <p>
        Every purchase supports The Source of Hope programs and community work.
      </p>
      <LinkButton text="VISIT THE STORE" to={CANONICAL.storefront.absolute} />
    </PageSection>
  );
}
```

## Mount It on a Page

Import and render inside the page component:

```jsx
import StorePromoSection from "./sections/StorePromoSection";

export default function HomePage() {
  return (
    <>
      <StorePromoSection />
    </>
  );
}
```

## Optional: Add a Direct Link to Cart

Only if required:

```jsx
<LinkButton text="VIEW CART" to={CANONICAL.storefront.cart.absolute} />
```

Validation Checklist

- Promo renders consistently on mobile/desktop
- Button uses `CANONICAL` routes
- No product data fetching is introduced
