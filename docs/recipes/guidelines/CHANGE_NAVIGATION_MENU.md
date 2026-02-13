# Change the Navigation Menu

Navigation is defined in:

- `/src/components/structure/Header.jsx`

Route paths are defined in:

- `/src/routes.jsx`

You must not hardcode paths in Header. Always use `CANONICAL`.

---

## Common Tasks

### A) Change the order of top-level menu items

In `HeaderNavigator`, reorder the objects in the `links` array.

This controls:

- the order on desktop nav
- the order on mobile nav

---

### B) Rename a label

Change the `label` string in the `links` array.

Example:

```js
{ label: "STORE", route: CANONICAL.storefront }
```

Renaming does not affect routing.

---

### C) Add or remove dropdown items

Dropdown items are controlled by the children array for a given link entry.

Example:

```js
children: [
  { label: "PRESS", route: CANONICAL.media.press },
  { label: "PODCAST", route: CANONICAL.media.podcast },
],
```

Only add children that exist in `CANONICAL`.

---

### D) Add a brand-new menu item

- Create route in routes.jsx (see `ADD_A_NEW_PAGE.md`)

- Register route in router

- Add a new entry in Header links

Behavioral Notes

- Desktop dropdowns show based on hover state.

- Mobile nav renders children inline when expanded.

- The Chevron click handler prevents navigation when the item has children.

If you modify dropdown behavior, verify both:

- Desktop hover and click
- Mobile expand/collapse behavior
