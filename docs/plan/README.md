# Relaunch Plan: Website Refresh, Action Hub and Staff Portal

This folder is the source of truth for the TSOH relaunch: a full UI/UX refresh of thesourceofhope.org, a site-wide **Action Hub** (Get Help · Volunteer · Give), and a private **Staff Portal** backed by an operational database. Everything ships to the public as **one release**.

It replaces the earlier draft "The Source of Hope Website Refresh and Action Hub Plan" (2026-11-21). Decisions here were settled in a planning session with the project lead on 2026-11-21.

## Read in this order

| # | Document | What it answers | Primary reader |
|---|---|---|---|
| 0 | [00_OVERVIEW.md](00_OVERVIEW.md) | What we are building, for whom, what is in scope, every decision in one table, open items | Everyone |
| 1 | [01_UI_UX_DESIGN_SPEC.md](01_UI_UX_DESIGN_SPEC.md) | How the site looks and behaves: principles, never-rules, tokens, components, navigation, Action Hub flows, page specs, accessibility, content rules | Anyone building UI |
| 2 | [02_SYSTEM_DESIGN.md](02_SYSTEM_DESIGN.md) | Architecture, systems of record, the Hub URL contract, data model, state machines, integrations, permissions, security, localization architecture | Anyone building data, APIs or integrations |
| 3 | [03_IMPLEMENTATION_PLAN.md](03_IMPLEMENTATION_PLAN.md) | Phases 0–9 broken into PR-sized slices with acceptance criteria, working agreements, testing strategy, risks | Whoever picks up the next slice |
| 4 | [04_LAUNCH_AND_CUTOVER.md](04_LAUNCH_AND_CUTOVER.md) | Launch gate, staff soft launch, dress rehearsal, cutover runbook, rollback | Release owner |
| — | [adr/](adr/) | One short record per major decision, with context and consequences | Reviewers, future maintainers |
| — | [research/LOCALIZATION_RESEARCH.md](research/LOCALIZATION_RESEARCH.md) | Census language data, next-intl, Sanity localization, vendor locale support (sourced) | Localization work |

A non-technical summary for staff and the board lives as a shared doc (linked from the project lead), not in this repo.

## Decision records

| ADR | Decision |
|---|---|
| [0001](adr/0001-single-release-on-v2-branch.md) | One public release, built on a long-lived `refresh` branch with its own environments |
| [0002](adr/0002-query-param-action-hub.md) | The Action Hub is a query-param overlay that opens on any page, with no page fallback |
| [0003](adr/0003-component-foundation-wrappers.md) | Component foundation: Vercel UI SDK preferred, React Aria Components fallback, decided by spike; pages only import our wrappers |
| [0004](adr/0004-localization-ready-english-first.md) | English at launch, localization-ready, translate-once; next-intl; Sanity field-level shape |
| [0005](adr/0005-postgres-supabase-operational-data.md) | PostgreSQL (Supabase) for operational data and staff auth; Sanity stays editorial |
| [0006](adr/0006-internal-registration-source-of-truth.md) | Our system owns every TSOH event registration; Eventbrite is an intake door; partner events link out |
| [0007](adr/0007-structured-sanity-content.md) | Editorial copy moves into structured Sanity types; no free-form page builder |
| [0008](adr/0008-refined-current-visual-direction.md) | Light-only "refined current" visual direction with written never-rules |

## Rules for anyone (human or agent) working from this plan

- Work in the phase order in [03_IMPLEMENTATION_PLAN.md](03_IMPLEMENTATION_PLAN.md). Each slice is one reviewable commit (or small series) on `refresh`.
- If an implementation choice contradicts a document here, stop and update the document (or write a new ADR) in the same PR. The plan and the code must not drift.
- Never put personal data, signing tokens, access tokens or secrets in source control, logs, analytics, query strings or Sanity.
- Status of each phase is tracked in the Phase table in [03_IMPLEMENTATION_PLAN.md](03_IMPLEMENTATION_PLAN.md#phase-status).
