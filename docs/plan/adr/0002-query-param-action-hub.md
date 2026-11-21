# ADR-0002: The Action Hub is a query-param overlay on any page, with no page fallback

- **Status:** Accepted
- **Date:** 2026-11-21

## Context

Get Help, Volunteer and Give should be one tap away from anywhere, in a focused flow. The original plan used query state (`/?action=volunteer&event=…`) plus canonical pages for direct visits. We also considered real routes rendered as an overlay via Next.js intercepting routes, with a full-page fallback on direct load.

## Decision

- The Hub is **one overlay** driven by query parameters (`action`, `event`, `type`, `need`, `step`, and so on) that opens on **any path**. The contract is in [02 §3](../02_SYSTEM_DESIGN.md#3-action-hub-url-contract).
- There is **no full-page version** of the Hub. Retired action pages redirect to the homepage with the matching Hub state: `/donate`, `/members`, `/sponsor`, `/planned-giving`.
- Each step is a history entry; completion replaces history. Payment redirects return to the same path with `step=done`. Closing removes only Hub parameters, so UTMs survive.
- One module (`src/lib/hub-url.ts`) owns parsing and serializing. Personal data and tokens never appear in Hub parameters.

## Consequences

- Any page, email, flyer or QR code can open any action with a plain link. Campaign links are easy to generate.
- **Accepted trade-off:** search results for "donate" and "planned giving" land on the homepage with the Hub open, not on a dedicated indexable page. Planned-giving explanation content lives inside the Hub.
- Without JavaScript the Hub does not open. Accepted, because the payment and signing integrations require JavaScript anyway.
- The overlay manager needs careful history, focus and draft handling, specified in [01 §9.3](../01_UI_UX_DESIGN_SPEC.md#93-layout-and-behavior) and tested in slice 4.1.

## Alternatives considered

- **Intercepting routes with a page fallback:** better for SEO and no-JS, but rejected by the project lead in favor of a single overlay openable anywhere.
- **Separate pages per action:** the status quo; inconsistent, and loses the visitor's context.
