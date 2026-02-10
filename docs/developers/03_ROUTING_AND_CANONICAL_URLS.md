# Routing and Canonical URLs

Routing is centralized. Developers must not hardcode route strings in components.

The source of truth is:

- `/src/routes.jsx`

This file defines:

- `ROUTES`: a declarative route tree
- `CANONICAL`: computed absolute/relative paths used across the app
- `BASE_URL`: used for canonical URLs
- `ASSET_VERSION`: used for static asset path versioning
- `CANONICAL_URL`: convenience mapping to fully-qualified canonical URLs

---

## ROUTES

`ROUTES` is a nested tree. Each node has:

- `path`: the segment for the route
- `children`: optional child segment map

Examples:

- `about.path = "about"`
- `about.children.team = "team"`
- `about.children.member = "team/:memberSlug"`
- `storefront.children.product = "product/:productSlug"`

---

## CANONICAL

`CANONICAL` is built from ROUTES and provides:

- `.absolute`: begins with `/` (use for NavLink and direct navigation)
- `.relative`: no leading `/` (use for nested router configuration)

Example:

- `CANONICAL.about.absolute` --> `/about`
- `CANONICAL.about.team.absolute` --> `/about/team`
- `CANONICAL.about.member.absolute` --> `/about/team/:memberSlug`

---

## Router Configuration

The router is created with `createBrowserRouter` and mounts:

- Root path: `CANONICAL.home.absolute` (`/`)
- Layout: `<AppLayout />`
- Error element: `<ErrorBoundary />`
- Children: all site pages

All route objects use CANONICAL.\* values. This ensures that:

- navigation stays consistent
- routes do not drift
- canonical URLs can be generated consistently

---

## Navigation (Header)

Primary navigation lives in:

- `/src/components/structure/Header.jsx`

The Header builds a `links` array using `CANONICAL` objects. Child menus are defined in that local array (labels and grouping), while the actual paths come from `CANONICAL`.

Rule:

- If you update the route structure, you likely must update both:
  1. `/src/routes.jsx` (route structure)
  2. `/src/components/structure/Header.jsx` (labels/menu groupings)

---

## Asset Versioning

Static assets reference `ASSET_VERSION` from `routes.jsx`.

Example usage:

- `PageHeader` defaults to `/${ASSET_VERSION}/core/TSOH-Family.webp`
- Footer logo uses `/${ASSET_VERSION}/core/TSOH-Logo.webp`

Do not hardcode `/v2/...`. Import and use `ASSET_VERSION`.
