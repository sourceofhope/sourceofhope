# Add or Update SEO for a Page

This project uses `react-helmet-async` for SEO.

Most pages set SEO manually.
Only:

- product pages
- team member bio pages
  pull meta from CMS by convention.

---

## Add Helmet to a Page

Wrap page content with:

```jsx
import { Helmet } from "react-helmet-async";

<Helmet>
  <title>Page Title | The Source of Hope</title>
  <meta name="description" content="Concise description." />
</Helmet>;
```

## Guidelines

- Titles should include the organization name suffix for consistency.
- Descriptions should be short and human-readable.
- Do not duplicate Helmet tags across nested components unless intentional.
