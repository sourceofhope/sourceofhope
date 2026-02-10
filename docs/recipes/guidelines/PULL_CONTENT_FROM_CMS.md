# Pull Content from the CMS

CMS access is centralized through:

- `fetchContent(endpoint, options)` in `/src/cms`

CMS base:

- `https://cms.thesourceofhope.org/wp-json/wp/v2`

Do not construct CMS URLs manually.

---

## Fetch Posts or Custom Post Types

Example:

```jsx
import { fetchContent } from "@/cms";

const posts = await fetchContent("/posts?per_page=10&_embed");
```

Guidelines:

Always include \_embed if you need featured images.

Prefer server-side pagination parameters when listing content (per_page, page).

## Featured Images

When `_embed` is present, use:

```jsx
import { getFeaturedImage } from "@/cms";

const image = getFeaturedImage(post);
```

## Responsive Image Selection

Use:

```jsx
import { getResponsiveImage } from "@/cms";

const url = getResponsiveImage(image, { width: 800 });
```

This returns the smallest available WordPress size with width >= requested width.

Rule:

Do not always render `image.source_url` if sizes exist.

## Common CMS Endpoints Used by This Project

The header banner uses: `/banner-configuration?per_page=1&_embed`

This endpoint is expected to return an array; Header uses the first entry.

## Error Handling

fetchContent throws a detailed error when res.ok is false:

- includes status code
- includes raw response text

If a CMS call fails:

- verify the endpoint path
- verify the CMS is reachable
- verify authentication requirements (most public endpoints should not require auth)
