# Display a Cart Count in the Header

This recipe shows how to display a cart item count in the global Header using the existing cart context.

The app provides cart state globally via:

- `StoreCartProvider` in `/src/components/layout/AppLayout.jsx`
- `StoreCartProvider` in `/src/components/layout/ErrorLayout.jsx`

So the Header can safely read cart state without adding new providers.

---

## Context API (Current Implementation)

Cart context is defined in:

- `/src/context/StoreCartContext.jsx`

Public APIs:

- `useStoreContext()` returns `{ cart, setCart, shippingMethod, setShippingMethod }`
- `useCartActions()` returns:
  - `cart`, `shippingMethod`
  - `addToCart(item)`
  - `updateCartItem(id, updates)`
  - `removeFromCart(id)`
  - `clearCart()`
  - `getCartItemCount()`
  - `getCartTotal()`
  - `getShippingCost()`
  - `updateShippingMethod(method)`

For a header badge, prefer `useCartActions()` and call `getCartItemCount()`.

---

## Where to Implement

Header lives at:

- `/src/components/structure/Header.jsx`

The most common placements for a cart badge are:

- Desktop: inside the main `<nav className="hidden md:flex ...">` near other top-level items
- Mobile: inside the top bar row near the menu button, or inside the expanded mobile nav

---

## Implementation (Recommended)

### A) Import `useCartActions` and `CANONICAL`:

```jsx
import { useCartActions } from "@/context/StoreCartContext";
import { CANONICAL } from "@/routes";
import { NavLink } from "react-router-dom";
```

Inside Header() (or inside a small helper component rendered by Header), read the count:

```jsx
const { getCartItemCount } = useCartActions();
const cartCount = getCartItemCount();
```

Render a cart link pointing to the cart route and conditionally show the badge:

```jsx
<NavLink
  to={CANONICAL.storefront.cart.absolute}
  aria-label="Cart"
  className="relative inline-flex items-center !no-underline">
  <span>Cart</span>

  {cartCount > 0 && (
    <span
      aria-label={`${cartCount} items in cart`}
      className="ml-2 inline-flex min-w-6 h-6 items-center justify-center rounded-full text-xs font-bold">
      {cartCount}
    </span>
  )}
</NavLink>
```

### B) Understanding our Component

The badge is only rendered when `count > 0` to reduce visual noise.

Use `CANONICAL.storefront.cart.absolute`. Do not hardcode `/store/cart`.

### C) Important Caveat: Item Identity vs Size

The cart implementation treats uniqueness as (`id` + `size`) for adding items:

```jsx
(i) => i.id === item.id && i.size === item.size;
```

But `updateCartItem(id, updates)` and `removeFromCart(id)` operate on id only.
This can affect header count indirectly if multiple sizes share the same id.

For the header badge specifically:

`getCartItemCount()` is authoritative because it sums quantities across all cart entries.

## Validation Checklist

- Add an item to cart, verify badge appears and updates.

- Add the same product with a different size, verify badge sums both quantities.

- Refresh the page:
  - cart persists (`localStorage` key: `sourceofhope_cart`)

  - badge count persists after reload

- Verify header layout does not shift when the count changes.

- Verify the cart link works on desktop and mobile.
