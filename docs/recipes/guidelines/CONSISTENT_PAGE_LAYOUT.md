# Use PageSection for Consistent Layout

This project standardizes vertical rhythm and horizontal padding with `PageSection`.

Component:

- `/src/components/layout/PageSection.jsx`

Implementation:

```jsx
export default function PageSection({ className, children }) {
  return (
    <section
      className={`w-full md:justify-items-left items-center grid my-5 px-5 lg:px-35 ${className}`}>
      {children}
    </section>
  );
}
```

`PageSection` applies:

- consistent horizontal padding: `px-5` `lg:px-35`
- consistent vertical spacing: `my-5`
- a grid container for predictable alignment

When to use `PageSection`

Use `PageSection` for:

- most content sections on a page

- any section where you want consistent left/right padding

- stacking multiple sections without ad-hoc spacing

Avoid `PageSection` for:

- full-bleed backgrounds that must span the viewport edge-to-edge

- components that already own their spacing and padding (use sparingly)

Recommended pattern

Create a section component and wrap with PageSection:

```jsx
import PageSection from "@/components/layout/PageSection";

export default function MissionSection() {
  return <PageSection className="gap-5">{/* content */}</PageSection>;
}
```

Prefer:

- `gap-*` on PageSection when it contains a simple vertical stack

- local layout primitives inside the section for complex grids

Validation checklist

- Section aligns with other content blocks on mobile and desktop

- Padding matches site-wide standards (no “almost aligned” sections)

- Spacing between adjacent sections is consistent
