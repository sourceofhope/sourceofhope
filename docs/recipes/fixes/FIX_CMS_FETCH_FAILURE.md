# Debug CMS Fetch Failures

CMS requests are handled via:

- `fetchContent(endpoint, options)` in `/src/cms`

CMS base URL:

- `https://cms.thesourceofhope.org/wp-json/wp/v2`

`fetchContent` throws an Error containing:

- status code
- raw response text

---

## Confirm endpoint correctness

Example banner call in Header:

- `/banner-configuration?per_page=1&_embed`

Confirm the endpoint exists in the CMS by opening the full URL in a browser.

---

## Confirm response shape

Header expects an array and uses the first element.
If the endpoint returns:

- empty array --> banner disabled
- non-array shape --> update code or CMS endpoint

---

## Common causes

- CMS is down or blocked
- endpoint slug changed
- ACF field names changed (`acf.enabled`, `acf.expires`, `acf.text`, `acf.link.url`)
- authentication required unexpectedly (should not be for public content)

---

## Validate resilient UI behavior

Header’s banner fetch intentionally fails gracefully:

- it catches errors and sets banner to null

If you are building other CMS-driven views, follow the same principle:

- fail gracefully and render a fallback UI
