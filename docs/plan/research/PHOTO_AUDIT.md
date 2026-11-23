# Photo audit (slice 0.10)

**Date:** 2026-11-23. **Scope:** every image and video in `public/v2/` (92 media files). Sanity-hosted images (team, products, publications) are reviewed when content moves in slice 2.6.

"Hero-ready" means at least 1600 px wide. Consent can't be read from files: staff must confirm consent for any photo showing identifiable people, especially minors and people receiving services ([spec §5.6](../01_UI_UX_DESIGN_SPEC.md#56-imagery-and-photography)).

## By program

| Program or area | Hero-ready | Verdict | Notes |
|---|---|---|---|
| Serving and Sharing Hope | 12 (6000×4000) | **Strong** | Authentic kitchen and serving-line photos (`servingHope/Carousel-1…9`, `sharingHope/SH-ResourceTile`, `serve/SH-Banner*`). `serve/SH-Banner.webp` shows guests at a distribution who may be identifiable, so check consent before using it |
| Core / brand | 3 | Good | `core/TSOH-Service.webp` and `core/TSOH-Family.webp` (6000×4000) are the best homepage heroes; `core/TSOH-Poster.webp` (1728) also works |
| Events | 1 | OK | `hope-run-for-hunger-2025.webp` (2048), a group photo |
| Hope Beyond Borders | 7 | OK | Nicaragua set (1600) and Southeast Asia. **`nicaragua/Carousel-2.webp` is an identifiable child receiving services: don't use without documented consent** |
| Education for Hope | 0 (largest 1284) | **Gap for heroes** | Group and classroom photos work for cards, not heroes |
| Hope for the Outdoors | 0 (largest 960) | **Gap** | Real group photos are low resolution. `serve/OH-Banner.webp` (river kayak) looks like **stock**: don't use |
| Wellness of Hope | 2 by size | **Gap: no authentic photos** | `Wellness-1`, `Wellness-2`, `WH-ResourceTile` and `serve/WH-Banner` all look like **stock** (facial treatment, cupping jars). The never-rules forbid stock, so a real clinic photo is needed |
| Planned giving, founder, awards | 0 | Fine for cards and archive | `core/TSOH-Founder.webp` is 806 px, so a new portrait would help for Our Story |

## Cleanup found

- `core/TSOH-Poster.webm` (**46 MB**), `core/TSOH-Impact.webm` (4.6 MB) and `core/source-of-hope-logo.png` are not referenced anywhere. Remove them in slice 3.9.
- `plannedgiving_hero.webp` and `plannedgiving_storymedia.webp` exist twice (`core/` and `plannedgiving/`).
- Several 6000×4000 banners are 2+ MB (`serve/SE-Banner`, `SH-Banner`, `SH-Banner2`, `EH-Banner`). Serve them through `next/image` sizes; don't ship originals.

## Shoot or collect list

1. Wellness of Hope clinic: a real session, with consent (highest priority).
2. Hope for the Outdoors: a recent trip, at least 2000 px wide.
3. Education for Hope: tutoring or a scholarship moment, at least 2000 px wide.
4. A founder or team portrait for Our Story.
5. Event-day photos that show volunteers, not identifiable guests, for Get Help and event cards.

## Content contradiction spotted

The current homepage says "16+ years", but TSOH was founded in 2014 (12 years as of 2026). The mockup uses "since 2014". Confirm the right framing (parked content task).
