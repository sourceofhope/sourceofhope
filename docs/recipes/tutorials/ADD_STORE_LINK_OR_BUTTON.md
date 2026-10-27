# Add a Store Link or Button

This recipe covers adding links and buttons that navigate to storefront pages without touching cart or checkout logic.

Routes are file-based, so store links are plain `href` strings.

---

## Store URLs

| Destination    | URL                        | Route file                              |
| -------------- | -------------------------- | --------------------------------------- |
| Store landing  | `/store`                   | `/src/app/store/page.tsx`               |
| Product detail | `/store/product/<slug>`    | `/src/app/store/product/[id]/page.tsx`  |
| Cart           | `/store/cart`              | `/src/app/store/cart/page.tsx`          |
| Checkout       | `/store/checkout`          | `/src/app/store/checkout/page.tsx`      |

Notes:

- The product page accepts the product's Sanity slug (preferred), its legacy `externalId`, or its Sanity `_id`. Use the slug for any link you write.
- `/store/success` is only for payment returns from Stripe and PayPal. It reads `session_id`, `token`, or `payment_intent` from the URL and clears the cart, so never link to it directly.

---

## Option A: LinkButton (Call to Action)

A styled internal button:

```tsx
import { LinkButton } from "@/components/ui/Button";

<LinkButton text="SHOP" href="/store" />;
```

Pass `full` to make it fill its container.

---

## Option B: ExpressiveLink (Inline / List Navigation)

```tsx
import ExpressiveLink from "@/components/ui/expressive/ExpressiveLink";

<ExpressiveLink to="/store">Visit the Store</ExpressiveLink>;
```

Note that `ExpressiveLink` takes `to`, not `href`.

---

## Option C: next/link (Custom Styling)

```tsx
import Link from "next/link";

<Link href="/store/cart" className="font-semibold text-accent-700 hover:underline">
  View Cart
</Link>;
```

Link to a specific product by slug:

```tsx
<Link href={`/store/product/${product.slug}`}>{product.title}</Link>
```

---

## Validation checklist

- Each link navigates correctly from anywhere on the site (header, footer, mobile)
- Refreshing `/store`, `/store/cart`, and a product page works
- Product links use the slug and land on the right product (not the "We Can't Find That Product" page)
- No link points at `/store/success`
