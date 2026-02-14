# Add or Edit the Global Header Banner

The site header supports an optional, CMS-controlled banner that appears fixed above the navigation.

The banner is fetched at runtime from the CMS via:

- `fetchContent("/banner-configuration?per_page=1&_embed")`

The banner is rendered by:

- `/src/components/structure/Header.jsx`

---

## How Banner Activation Works

The banner is considered active if all conditions are true:

1. Local dismiss state is open (`bannerOpen === true`)
2. CMS field `acf.enabled` is truthy
3. CMS field `acf.expires` is a date in the future

If active:

- The banner is fixed at the top of the viewport
- The Header offsets down (`top-15 md:top-10`)
- A spacer may be rendered when `isBlocking && bannerActive`

---

## How to Edit Banner Content (CMS)

This is a CMS task, not a code task.

The banner expects ACF fields:

- `enabled` (boolean)
- `expires` (date/time)
- `text` (string)
- `link.url` (string)

Link behavior:

- If link starts with `https://`, HeaderBanner renders an external `<a href>`
- Otherwise it renders an internal `<Link to={link}>`

---

## How to Adjust Banner UI (Code)

Update:

- `HeaderBanner()` in `/src/components/structure/Header.jsx`

When modifying:

- Verify desktop and mobile heights (`h-15 md:h-10`)
- Verify that closing the banner sets `bannerOpen` false and does not navigate
- Verify header offset logic stays correct with and without a banner
