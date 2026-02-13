# Add a Store Link or Button

This recipe covers adding links/buttons that navigate to storefront pages without touching checkout logic.

Storefront routes are defined in `/src/routes.jsx` under:

- `CANONICAL.storefront`

Common destinations:

- Store landing: `CANONICAL.storefront.absolute` → `/store`
- Cart: `CANONICAL.storefront.cart.absolute` → `/store/cart`
- Checkout: `CANONICAL.storefront.checkout.absolute` → `/store/checkout`
- Product detail: `CANONICAL.storefront.product.absolute` → `/store/product/:productSlug`

Rule:

- Do not hardcode `/store/...` strings. Always use CANONICAL routes.

---

## Option A: Use LinkButton (Internal Navigation)

Use when you want a styled button that routes internally.

```jsx
import { LinkButton } from "@/components/ui/Button";
import { CANONICAL } from "@/routes";

<LinkButton text="SHOP" to={CANONICAL.storefront.absolute} />;
```

Option B: Use ExpressiveLink (Inline / List Navigation)

```jsx
import ExpressiveLink from "@/components/ui/expressive/ExpressiveLink";
import { CANONICAL } from "@/routes";

<ExpressiveLink to={CANONICAL.storefront.absolute}>
  Visit the Store
</ExpressiveLink>;
```

Option C: Use NavLink (Custom Styling)

```jsx
import { NavLink } from "react-router-dom";
import { CANONICAL } from "@/routes";

<NavLink to={CANONICAL.storefront.cart.absolute}>Cart</NavLink>;
```

Validation Checklist

- Link navigates correctly from anywhere on the site
- Refreshing /store and /store/cart works in production (static host relies on 404.html fallback)
