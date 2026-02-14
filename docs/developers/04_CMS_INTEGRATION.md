# CMS Integration

The CMS is a WordPress instance exposed via WP REST API.

Frontend CMS access is centralized in:

- `/src/cms` (helper module)

The base WP REST API URL is:

- `https://cms.thesourceofhope.org/wp-json/wp/v2`

---

## fetchContent

`fetchContent(endpoint, options)` constructs requests as:

- `${CMS_HOME_URL}${endpoint}`

It always:

- sends JSON headers
- throws with detailed error text when the CMS returns a non-OK response

Guidelines:

- Endpoint must begin with `/`
- Use `_embed` when you need featured media or embedded objects

---

## Featured Media Helpers

Featured images are extracted via `_embedded`:

- `getFeaturedImage(post)` returns `post._embedded["wp:featuredmedia"][0]` if present.

Responsive images should be selected through:

- `getResponsiveImage(image, { width })`

This chooses the smallest WP image size with width >= requested width, and falls back to the original `source_url`.

---

## CMS-Driven Header Banner

The Header fetches banner configuration from the CMS using:

- `fetchContent("/banner-configuration?per_page=1&_embed")`

Activation depends on:

- local dismiss state (`bannerOpen`)
- CMS field `acf.enabled`
- CMS field `acf.expires` compared to `Date.now()`

Banner is rendered as a fixed top strip, and Header positioning adjusts while active.

Implication:

- CMS banner configuration changes affect global page layout and vertical offsets.
