# Display a Cart Count

The store already shows a cart count: the floating cart button in `/src/components/store/Cart.tsx` renders a badge with the number of items (capped at `99+`) and links to `/store/cart`. It is rendered on `/store`, product pages, and `/store/checkout`.

This recipe shows how to display the count somewhere else, such as the global header, using the existing cart context.

---

## Cart Context API

Cart state is provided globally by `StoreCartProvider` in the root layout (`/src/app/layout.tsx`), so any client component (including `Header`) can read it without adding providers.

Defined in `/src/context/StoreCartContext.tsx`:

- `useStoreContext()` returns `{ cart, setCart, shippingMethod, setShippingMethod, processingFee, setProcessingFee }`
- `useCartActions()` returns:
  - `cart`, `shippingMethod`, `processingFee`
  - `addToCart(item)`
  - `updateCartItem(id, updates)`
  - `removeFromCart(id, size?)`
  - `clearCart()`
  - `getCartItemCount()`
  - `getCartCost()`, `getTaxCost()`, `getShippingCost()`, `getProcessingFeeCost()`, `getCartTotal()`
  - `updateShippingMethod(method)`, `updateProcessingFee(toggle)`

For a badge, use `useCartActions().getCartItemCount()`. It sums `quantity` across all cart entries.

---

## Avoid Hydration Mismatches

The cart is loaded from `localStorage` when `StoreCartProvider` first renders in the browser. The server has no `localStorage`, so it always renders an empty cart. If a component prints the count during its first render, the server HTML (`0`) and the browser's first render (e.g. `3`) disagree and React logs a hydration error.

`Cart.tsx` avoids this with an `isHydrated` flag that becomes `true` in an effect, and shows `0` (badge hidden) until then:

```tsx
const [isHydrated, setIsHydrated] = useState(false);

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setIsHydrated(true);
}, []);

const cartItemCount = isHydrated ? getCartItemCount() : 0;
```

Use the same pattern anywhere you display cart data.

---

## Implementation: A Header Cart Link

Create a small client component:

```tsx
// /src/components/layout/HeaderCartLink.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBagIcon } from "@heroicons/react/20/solid";
import { useCartActions } from "@/context/StoreCartContext";

export default function HeaderCartLink() {
  const { getCartItemCount } = useCartActions();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  const count = isHydrated ? getCartItemCount() : 0;
  const label = count > 99 ? "99+" : String(count);

  return (
    <Link
      href="/store/cart"
      aria-label={`Shopping cart with ${label} items`}
      className="no-underline! relative inline-flex items-center gap-2 font-bold">
      <ShoppingBagIcon className="w-6 h-6" aria-hidden="true" />
      {count > 0 && (
        <span className="inline-flex min-w-6 h-6 items-center justify-center rounded-full bg-primary-400 text-neutral-50 text-xs px-1">
          {label}
        </span>
      )}
    </Link>
  );
}
```

Render it in `/src/components/layout/Header.tsx`, for example next to the desktop `<nav>` and next to the mobile menu button. Since the store pages already show the floating button, consider hiding the header link there (check `usePathname().startsWith("/store")`) so the count does not appear twice.

Keep the badge's width stable (e.g. `min-w-6`) so the header does not shift when the number changes.

---

## Cart Item Identity

Cart entries are unique by `id` **and** `size`:

- `addToCart` merges quantities when both match (an empty or missing size is treated the same as `""`)
- `removeFromCart(id, size)` removes only the matching size
- `updateCartItem(id, updates)` matches on `id` only, so it updates every size of that product

`getCartItemCount()` is unaffected: it simply sums all quantities.

---

## Persistence

The provider saves to `localStorage` on every change:

- `sourceofhope_cart` — cart items
- `sourceofhope_shipping` — selected shipping method id
- `sourceofhope_processing` — whether the customer opted to cover processing fees

`clearCart()` (called on `/store/success`) empties the cart and resets shipping to `standard`.

---

## Validation checklist

- Add an item: the badge appears and updates
- Add the same product in a different size: the badge sums both quantities
- Add more than 99 items: the badge shows `99+`
- Reload the page: the cart and badge persist, with no hydration warning in the console
- The header layout does not shift when the count changes
- The cart link works on desktop and in the mobile menu
