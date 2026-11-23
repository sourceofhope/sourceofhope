# ADR-0008: Light-only "refined current" visual direction with written never-rules

- **Status:** Accepted (mockup approval pending slice 0.10)
- **Date:** 2026-11-21

## Context

The project lead wants to keep TSOH's clean, professional look and stay reputable. The site must not look "vibecoded": no AI-template taglines, gradients or effects. The current site's base (navy and blue, Urbanist and Inter, real photos) reads well, but it is applied inconsistently and carries motion gimmicks.

## Decision

- **One direction, "refined current":** keep the palette, the type families and real photography, applied through a strict token system and templates. No rebrand and no competing directions.
- **Light theme only,** for the public site and the portal. Tokens are structured so dark mode could be added later.
- **Never-rules** for visuals and copy are acceptance criteria ([01 §3](../01_UI_UX_DESIGN_SPEC.md#3-never-rules)).
- **Retired:** parallax, the highlighter sweep, scroll-animated panels, auto-advancing carousels, hover font growth, squashed eyebrows and count-up numbers. The hero video stays, with a pause control.
- **Mockup approval:** one private mockup is approved by the project lead in slice 0.10. It shows the token sheet, homepage, event card and details, the Give amount step, the mobile header and menu, and the Hub mobile takeover. Values marked *(mockup)* in the spec are settled then.

## Consequences

- Faster convergence, with no design-direction debate in the middle of the build.
- Lint and the design QA checklist enforce consistency mechanically.

## Mockup

**Mockup:** [TSOH Relaunch Visual Direction](https://claude.ai/artifact/QE1iCT8nWmfhNEE2giCFiH), published 2026-11-23. It is private to the project lead's account until shared.

It has seven boards:
- tokens and rules
- homepage (desktop and phone)
- the phone menu
- the Hub on a phone (Volunteer, "Who's coming?")
- event details (desktop)
- the Give amount step (desktop)

**Proposed values, to confirm on approval** (these settle the spec's *(mockup)* items):
- **Page:** max width 1240 px with 40 px gutters (desktop).
- **Header:** a solid white header on every page, 72 px desktop and 60 px phone. The dove mark sits beside a typeset name on desktop; the dove alone on phones.
- **Hero:** a split layout (text left, photo right, 12 px corners), with no text over the photo.
- **Type:** h1 54 px (home hero), 36 px (pages); body 18 px desktop, 16 px phone.
- **Corners:** buttons 8 px; fields and badges 4 px; dialogs 12 px.
- **Semantic colors:** success `#1F7A4D`, warning `#92400E`, danger `#B42318`, info `#165E96`; muted text `#4B5563`.
- **Custom gift minimum:** $5 (not shown; unchanged).

**Approval:** *pending: project lead to approve, or comment on the boards.*

Photo findings: [research/PHOTO_AUDIT.md](../research/PHOTO_AUDIT.md).
