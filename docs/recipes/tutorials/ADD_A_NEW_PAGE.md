# Add a New Page

This recipe describes the canonical way to add a new routed page to the frontend.

This project has three required steps for a new page:

1. Create the page component under `/src/pages/<pageName>/`
2. Register the route in `/src/routes.jsx`
3. Register the routed component in the router (currently defined in the app entry file)

If the page should appear in the top navigation, also update:

- `/src/components/structure/Header.jsx`

This guide assumes you are adding a _top-level_ page (e.g., `/donate`, `/partners`, `/impact`).

---

## Create the Page Folder

Create:

- `/src/pages/<pageName>/<PageName>Page.jsx`
- `/src/pages/<pageName>/sections/` (optional, but recommended)

Example:

/src/pages/impact/ImpactPage.jsx
/src/pages/impact/sections/

Follow the project convention:

- Pages should compose UI from `sections`
- Reusable components belong in `/src/components`

---

## Implement the Page Component

Use the standard structure:

- `PageHeader` for hero/banner pages
- `PageSection` for consistent spacing

Example skeleton:

```jsx
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import { Helmet } from "react-helmet-async";

export default function ImpactPage() {
  return (
    <>
      <Helmet>
        <title>Impact | The Source of Hope</title>
        <meta
          name="description"
          content="Learn how The Source of Hope serves the community through our programs."
        />
      </Helmet>

      <PageHeader>{/* Header content */}</PageHeader>

      <PageSection>{/* Sections / content */}</PageSection>
    </>
  );
}
```

Notes:

Most pages define SEO manually via react-helmet-async.

Only product pages and team member pages pull meta from the CMS by convention.

## Register the Route in routes.jsx

Add a new entry to ROUTES in /src/routes.jsx.

Example:

```JS
export const ROUTES = {
  // ...
  impact: { path: "impact" },
};
```

Then add it to CANONICAL:

```JS
export const CANONICAL = {
  // ...
  impact: build(ROUTES.impact),
};
```

Guideline:

Never hardcode route strings elsewhere.

The canonical route object should exist before using it in the router or Header.

## Register the Page in the Router

Import the page component and register it using `CANONICAL.<route>.relative.`

Example:

```js
import ImpactPage from "./pages/impact/ImpactPage.jsx";
import { CANONICAL } from "./routes.jsx";

{
  path: CANONICAL.impact.relative,
  element: <ImpactPage />,
}
```

## Add to Navigation (Optional)

If the page must appear in the top navigation, update:
`/src/components/structure/Header.jsx`

In HeaderNavigator, add an entry to the links array:

```JSX
{
  label: "IMPACT",
  route: CANONICAL.impact,
}
```

This controls:

- menu ordering
- labels
- dropdown children (if any)

## Validate Locally

Run client and server:

```bash
client: npm run dev:client
```

```bash
server: npm run dev:server
```

Visit:

`http://localhost:5173/impact`

Verify:

- Header navigation works
- Direct browser refresh on `/impact` still loads static hosting requires `404.html` fallback in production
