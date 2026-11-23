# ADR-0007: Editorial copy moves into structured Sanity types; no free-form page builder

- **Status:** Accepted
- **Date:** 2026-11-21

## Context

Only events, team, products, publications and newsletter issues live in Sanity today. About 1,200 lines of program and page copy are hard-coded in components, so every wording change is a developer PR. Copy has drifted: program names, founder titles and membership benefits contradict each other across pages. With localization planned, copy in code would also need a separate translation path.

## Decision

- Editorial copy moves into **structured** Sanity types with fixed fields:
  - program, service (Get Help), ourStory, plannedGiving, sponsorTiers, faq;
  - siteSettings: contact details, impact stats with as-of dates, the meals-per-dollar ratio, the glossary.
- Templates decide the layout. Editors fill fields; they do not arrange blocks.
- **UI chrome** (buttons, nav labels, form messages, Hub step titles) stays in code message files.
- All translatable fields use the localized shape ([ADR-0004](0004-localization-ready-english-first.md)).
- Images carry `alt` and `consentCleared` fields.

## Consequences

- Staff can change wording without a developer, inside guardrails that keep the design consistent.
- One translation pipeline covers all editorial content.
- The content migration (slice 2.6) also edits copy to the glossary, so contradictions are fixed once.

## Alternatives considered

- **Keep copy in code:** developer-owned and slower to change, with a second translation path.
- **A free-form page builder:** too easy to reintroduce the inconsistency this refresh removes.
