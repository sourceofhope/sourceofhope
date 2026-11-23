# ADR-0008: Light-only "refined current" visual direction with written never-rules

- **Status:** Accepted. Mockup approved by the project lead on 2026-11-23
- **Date:** 2026-11-21

## Context

The project lead wants to keep TSOH's clean, professional look and stay reputable. The site must not look "vibecoded": no AI-template taglines, gradients or effects. The current site's base (navy and blue, Urbanist and Inter, real photos) reads well, but it is applied inconsistently and carries motion gimmicks.

## Decision

- **One direction, "refined current":** keep the palette, the type families and real photography, applied through a strict token system and templates. No rebrand and no competing directions.
- **Light theme only,** for the public site and the portal. Tokens are structured so dark mode could be added later.
- **Never-rules** for visuals and copy are acceptance criteria ([01 §3](../01_UI_UX_DESIGN_SPEC.md#3-never-rules)).
- **Retired:** parallax, the highlighter sweep, scroll-animated panels, auto-advancing photo carousels, hover font growth, squashed eyebrows and count-up numbers. The full-bleed hero video stays, with a pause control.
- **Kept or added by the project lead:**
  - the hero video's shrink on scroll;
  - the homepage sponsor strip (constant speed).

  Both have pause controls and reduced-motion fallbacks (spec §5.8).
- **Mockup approval:** one private mockup is approved by the project lead in slice 0.10. It shows the token sheet, homepage, event card and details, the Give amount step, the mobile header and menu, and the Hub mobile takeover. Values marked *(mockup)* in the spec are settled then.

## Consequences

- Faster convergence, with no design-direction debate in the middle of the build.
- Lint and the design QA checklist enforce consistency mechanically.

## Mockup

**Mockup:** [TSOH Relaunch Visual Direction](https://claude.ai/artifact/QE1iCT8nWmfhNEE2giCFiH), published 2026-11-23. It is private to the project lead's account until shared.

It has eight boards (the eighth, "after scrolling", was added with the review changes):
- tokens and rules
- homepage (desktop and phone)
- the phone menu
- the Hub on a phone (Volunteer, "Who's coming?")
- event details (desktop)
- the Give amount step (desktop)

**Proposed values, to confirm on approval** (these settle the spec's *(mockup)* items):
- **Page:** max width 1240 px with 40 px gutters (desktop).
- **Header:** 72 px desktop and 60 px phone, with the dove mark beside a typeset name on desktop and the dove alone on phones. It is solid white on every page except the homepage, where it starts transparent over the hero video and turns solid as the video eases into its card (added in review, 2026-11-23).
- **Hero (revised 2026-11-23 after the project lead's review):**
  - The full-bleed background video stays, with text on a flat tint and the current tagline kept.
  - It shrinks into a card on scroll.
  - A constant-speed sponsor strip sits directly under it, with a pause control and a static list.
  - Taglines appear only in the hero.
- **Type:** h1 54 px (home hero), 36 px (pages); body 18 px desktop, 16 px phone.
- **Corners:** buttons 8 px; fields and badges 4 px; dialogs 12 px.
- **Semantic colors:** success `#1F7A4D`, warning `#92400E`, danger `#B42318`, info `#165E96`; muted text `#4B5563`.
- **Custom gift minimum:** $5 (not shown; unchanged).

**Approval:** approved 2026-11-23, with the review changes recorded above (full-bleed hero video kept, hero-only tagline, sponsor strip under the hero, homepage header transparent until scroll). Locked values are in the spec ([§5](../01_UI_UX_DESIGN_SPEC.md#5-visual-foundation), [§8.2](../01_UI_UX_DESIGN_SPEC.md#82-desktop-header)). While locking them, input borders were moved to a darker token (`#6B7280`, 4.8:1), because the mockup's `#A0A5AD` failed WCAG 1.4.11.

Photo findings: [research/PHOTO_AUDIT.md](../research/PHOTO_AUDIT.md).
