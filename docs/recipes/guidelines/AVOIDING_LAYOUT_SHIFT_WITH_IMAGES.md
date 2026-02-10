# Avoid Layout Shift with Images

Layout shift commonly occurs when images load without reserved space.

This project uses images in two primary ways:

- Full-bleed hero images via `PageHeader` (already sized by container height)
- Inline images in sections/cards (developer-controlled)

---

## Best practice for inline images

When you render an image in content sections:

- constrain its container dimensions
- use `object-cover` or `object-contain` intentionally
- avoid rendering full-size images in unconstrained containers

Example pattern:

```jsx
<div className="w-full h-60 overflow-hidden rounded-2xl">
  <img
    src={src}
    alt=""
    className="w-full h-full object-cover"
    loading="lazy"
    decoding="async"
  />
</div>
```

## When to use eager loading

Use eager loading only for:

- the primary hero image (handled by `PageHeader`)

- a single above-the-fold marketing image if it is critical to initial view

All other images should use:

`loading="lazy"`

## Validation checklist

- Scrolling does not cause text to jump as images load.

- LCP is not dominated by multiple large eager-loaded images.

- Visual containers maintain consistent height before and after image load.
