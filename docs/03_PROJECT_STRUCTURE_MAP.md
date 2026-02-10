# Project Structure Map

Understanding where things live in the codebase is essential before attempting any changes.

This map provides a high-level guide to the most important directories.

---

## Root Structure

```
/src
/pages
/components
/sections
/lib
/api
```

---

## `/src/pages`

Contains all routed pages.

Each file here typically corresponds to a URL route, but this project **does not** rely on app routing.

If you are adding a new page or route, this is usually where it starts.

---

## `/src/components`

Reusable UI building blocks.

Examples:

- Buttons
- Cards
- Layout wrappers
- Shared UI elements

If multiple pages share the same UI, it should live here.

---

## `/src/pages/<page>/sections`

Page sections composed of components.

These are larger blocks used to build pages:

- Hero sections
- Content blocks
- Map/contact sections
- CMS-driven layouts

Pages are often assembled from these.

---

## `/src/lib`

Utility functions and API helpers.

Examples:

- API base URL logic
- Request helpers
- Sanitization utilities
- CMS data fetchers

If you need to change how the frontend talks to APIs or CMS, look here.

## How to Navigate This Structure

If you need to:

- Add a page --> `/pages`
- Reuse or change UI --> `/components`
- Adjust a page block --> `/page/<page>/sections`
- Modify API or CMS communication --> `/lib`
- Fix form behavior --> `/api`

---

## Important Principle

Before creating new files, check if a reusable component or section already exists.

This project favors reuse over duplication.
