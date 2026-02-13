# Add a New Reusable Button or Link Component

This project already provides:

- `ExpressiveLink` for internal links with an arrow affordance
- `LinkButton` for internal call-to-action buttons
- `AnchorButton` for external call-to-action buttons

Before adding a new button type, verify you cannot compose the existing ones.

---

## Where to place new components

Reusable UI primitives belong in:

- `/src/components/ui/...`

Structure-level elements belong in:

- `/src/components/structure/...`

Do not place reusable primitives inside a single page folder.

---

## Link routing rule

All internal navigation must use canonical routes:

- import `CANONICAL` from `/src/routes.jsx`

Do not hardcode route strings.

---

## Example: Creating a specialized internal CTA button

1. Create a component in `/src/components/ui/YourButton.jsx`

2. Use `NavLink` under the hood, similar to `LinkButton`, and accept a `to` prop.

3. In pages, pass:

- `to={CANONICAL.someRoute.absolute}`

---

## Validation checklist

- Keyboard focus styles exist and are visible
- Internal links use `NavLink`/router navigation (not `<a href>` unless external)
- Component does not introduce layout shifts when text changes
