# Add a New Section to an Existing Page

This project uses a page --> sections pattern.

Preferred structure:

- Page component lives at `/src/pages/<pageName>/<PageName>Page.jsx`
- Page sections live at `/src/pages/<pageName>/sections/*`

Use this recipe when you want to add a new block to an existing page without creating a reusable global component.

---

## Create the Section Component

Create a new file:

`/src/pages/<pageName>/sections/<SectionName>.jsx`

Example:

`/src/pages/about/sections/MissionSection.jsx`

---

## Use PageSection for Layout Consistency

Wrap your content with `PageSection` to maintain consistent spacing and padding.

Example:

```jsx
import PageSection from "@/components/layout/PageSection";

export default function MissionSection() {
  return <PageSection className="gap-5">{/* section content */}</PageSection>;
}
```

## Mount Section in the Page Component

Import the section in the page and render it in the correct order.

Example:

```jsx
import MissionSection from "./sections/MissionSection";

export default function AboutPage() {
  return (
    <>
      <MissionSection />
    </>
  );
}
```

## Verify Responsiveness

Because PageSection applies:

- `px-5 lg:px-35`
- grid alignment rules

Test:

- mobile
- tablet
- desktop
