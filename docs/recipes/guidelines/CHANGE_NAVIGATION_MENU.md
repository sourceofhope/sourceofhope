# Change the Navigation Menu

The top navigation is a local array returned by `getHeaderLinks()` in:

- `/src/components/layout/Header.tsx`

Both the desktop and mobile menus render from this one array. There is no separate route registry. Links are plain `href` strings, so every `href` must match a real folder in `/src/app` (or a redirect in `/next.config.ts`).

---

## The Link Shape

```tsx
interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}
```

Current menu:

| Item     | `href`            | Children                                                                                          |
| -------- | ----------------- | ------------------------------------------------------------------------------------------------- |
| ABOUT    | `/about`          | TEAM, CONNECT                                                                                     |
| PROGRAMS | `/programs`       | SERVING & SHARING HOPE, EDUCATION FOR HOPE, WELLNESS OF HOPE, HOPE FOR THE OUTDOORS, HOPE BEYOND BORDERS |
| GIVING   | `/planned-giving` | PLANNED GIVING, MEMBERSHIPS (`/members`), QUICK DONATE (`/donate`)                                |
| EVENTS   | `/events`         | none                                                                                              |
| MEDIA    | `/media`          | PRESS, PODCAST, AWARDS                                                                            |
| STORE    | `/store`          | none                                                                                              |

---

## Common Tasks

### A) Reorder top-level items

Reorder the objects in the array. The order applies to desktop and mobile.

Six items fit at tablet widths. Adding more can make the desktop bar overflow, which is why Awards and Memberships were folded into dropdowns.

### B) Rename a label

Change the `label` string. Labels are uppercase by convention. Renaming does not change any URL.

### C) Add or remove a dropdown item

Edit the parent's `children` array:

```tsx
{
  label: "MEDIA",
  href: "/media",
  children: [
    { label: "PRESS", href: "/media/press" },
    { label: "PODCAST", href: "/media/podcast" },
    { label: "AWARDS", href: "/media/awards" },
  ],
},
```

A child does not have to live under the parent's URL. `CONNECT` (`/connect`) sits under ABOUT.

### D) Add a new top-level item

1. Create the page (see `/docs/recipes/tutorials/ADD_A_NEW_PAGE.md`).
2. Add `{ label: "IMPACT", href: "/impact" }` to the array.

### E) Remove an item or page

Removing a link does not remove the page. If you delete the page too, add a redirect for its URL (see `/docs/recipes/guidelines/ADD_A_REDIRECT.md`).

---

## Behavior to Keep in Mind

Active state:

- `isActiveLink()` underlines a top-level item (and sets `aria-current="page"`) when the current path is its `href`, starts with `href/`, or matches any of its children.
- For example, GIVING is active on `/members` and `/donate`, and ABOUT is active on `/connect`.

Desktop:

- Dropdowns open on hover and on keyboard focus. Escape closes them, and focus leaving the item closes them.
- Clicking the label goes to the parent `href`. Clicking the chevron only toggles the dropdown.

Mobile:

- The menu is a drill-down stack. Tapping a parent navigates to its `href` and opens its children, with a BACK row on top.
- A "`<LABEL>` OVERVIEW" link is added at the top of a submenu unless one of the children already uses the parent's `href`. GIVING has no overview row because PLANNED GIVING shares `/planned-giving`.
- Tapping a leaf link closes the menu.

---

## Keep Related Places in Sync

- **Footer**: footer links are separate and hardcoded in `/src/components/layout/Footer.tsx` (QUICK LINKS, CONNECT, CONTACT). Update them if a linked page moves.
- **Sitemap**: add or remove the URL in `/public/sitemap.xml`.
- **Redirects**: if a URL changed, add a redirect in `/next.config.ts`.

---

## Validation checklist

Desktop:

- Hover, keyboard Tab, and Escape on every dropdown
- Labels navigate and chevrons only toggle
- The correct item is underlined on parent and child pages

Mobile (narrow the browser or use device mode):

- Drill into each submenu and use BACK
- Overview rows appear where expected
- Leaf links close the menu

Also confirm:

- No `href` leads to a 404
- The bar does not wrap or overflow at tablet widths (768–1024px)
