# Creator Media Optimization Expectations (Photos and Short Videos)

This recipe documents performance expectations for media that is uploaded to the CMS or used as static assets.

Goal:

- keep pages fast and stable on mobile connections
- avoid shipping oversized assets

---

## Photos (CMS and Static)

1. Prefer `.webp`
2. Size images to the maximum display context before upload

Practical targets:

- card/list thumbnails: 600px wide or less
- typical content images: 1200px wide
- large banners: 1600px wide (rarely more)

---

## Tooling

Use Squoosh (web-based) for compression and resizing.

Visit [Squoosh](squoosh.app).

Recommended workflow:

1. Resize to target width (do not upload 4000px photos if rendering at 800px)
2. Convert to WebP
3. Set quality until the artifacting becomes noticeable, then back off slightly
4. Verify file size is reasonable (often < 300KB for content images)

---

## Short video (if used on the site)

This project prefers short, lightweight media.

Guidelines:

- keep clips under 20 seconds
- export at 720p unless there is a strong reason for 1080p
- avoid very high bitrates for web delivery

If a clip is intended primarily for social media, do not assume it is web-optimized. Export specifically for web usage when embedding or serving on-site.

---

## Validation checklist

- Images do not exceed reasonable sizes for their layout usage.
- Pages with CMS content remain responsive on mobile.
- New media does not cause LCP regressions.
