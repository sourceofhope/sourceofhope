# Media Optimization Expectations (Photos and Short Videos)

This guideline sets the performance bar for media added to the site, whether a developer adds it to `/public` or a content creator uploads it to Sanity.

Goals:

- keep pages fast on mobile connections
- avoid shipping oversized files
- keep Largest Contentful Paint (LCP) and layout stability healthy (Vercel Speed Insights tracks both)

---

## Where Media Comes From

| Source                          | How it is served                                                                                              | Who must optimize it              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Static files in `/public/v2/...` | Through `next/image` where the code uses it, which resizes and converts on demand. Plain `<img>` and `<video>` get the file as is. | The developer adding the file     |
| Sanity uploads                  | As the **original uploaded file**. The site uses `asset->url` with plain `<img>`, with no resizing or format conversion. | The creator, before uploading     |

Sanity images reach visitors exactly as uploaded, so a 6 MB phone photo is downloaded as 6 MB. Creator-facing rules are in `/docs/creators/MEDIA_FORMAT_RULES.md`.

---

## Photos

1. Prefer `.webp`.
2. Resize to the largest size the image is actually displayed at.

Practical targets:

- Card and list thumbnails (events, publications, products): about 600–800px wide
- Typical content images: about 1200px wide
- Hero banners (`PageHeader`): about 1600px wide, rarely more
- Team headshots: square, about 800×800

Aim for under 300 KB for content images and under 500 KB for heroes.

---

## Tooling

Use [Squoosh](https://squoosh.app).

1. Resize to the target width. Do not ship a 4000px photo that renders at 800px.
2. Convert to WebP.
3. Lower quality until artifacts become visible, then raise it slightly.
4. Check the file size before committing or uploading.

---

## Short Video

The home page hero video is the reference for on-site video. It lives in `/public/v2/core/`:

| File                  | Format                      | Size    |
| --------------------- | --------------------------- | ------- |
| `TSOH-Hero-720.webm`  | 720p, VP9                   | ~2.1 MB |
| `TSOH-Hero-1080.webm` | 1080p, VP9                  | ~3.7 MB |
| `TSOH-Hero-720.mp4`   | 720p, H.264 (fallback)      | ~2.8 MB |
| `TSOH-Poster.webp`    | Poster image shown first    | ~120 KB |

It replaced a 47 MB 4K source. `HomeIntroductionSection` also:

- loads the video only after the page finishes loading
- skips the video for `prefers-reduced-motion`, Save-Data, or slow (2g/3g) connections
- pauses it while it is off-screen

Guidelines for new clips:

- Keep them under about 20 seconds, with no audio track if it is muted anyway.
- Export 720p, plus 1080p only if it is shown full-width on large screens.
- Provide VP9 WebM with an H.264 MP4 fallback. Declare codecs in `<source type>` as the hero does.
- Always provide a poster image.
- Target a few MB per file.
- Longer or narrated videos belong on YouTube, linked or embedded, not in `/public`.

A clip exported for social media is not web-optimized. Export a dedicated web version.

---

## Validation checklist

- No new image is far larger than its rendered size (compare file dimensions to the element in devtools).
- New `/public` files are `.webp` (images) or WebM/MP4 (video) and reasonably small.
- Pages with new media remain responsive on a throttled "Fast 4G" connection in devtools.
- Speed Insights does not show an LCP regression after deploy.
