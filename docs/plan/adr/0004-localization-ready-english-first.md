# ADR-0004: English at launch, localization-ready, translate once

- **Status:** Accepted
- **Date:** 2026-11-21

## Context

Census data for the four DFW counties shows Spanish speakers are about 73% of residents with limited English. In Plano, the next-largest groups are Chinese and Vietnamese ([research](../research/LOCALIZATION_RESEARCH.md)). The project lead wants localization in the future but does not want to force a second language into launch. There is no fluent reviewer available, so any translation would be machine-made. Cost must stay low: translate static text once, never per visitor. TSOH receives no federal funds, so no federal language-access review applies.

## Decision

- **Launch language:** English only (`ENABLED_LOCALES=en`). The language dropdown is hidden while only one locale is enabled.
- **Localization-ready from day one:**
  - **next-intl 4.x.** English URLs are unchanged, and other locales live under `/es/…` (`localePrefix: 'as-needed'`). No automatic redirects (`localeDetection: false`); an explicit choice is remembered in a cookie.
  - **Text:** all UI strings in `messages/<locale>.json`, with no literal strings in components (lint).
  - **Sanity:** translatable fields use the **field-level localized array** shape (`en` only for now).
  - **Postgres:** event text lives in `event_texts` per locale.
  - **Formatting:** locale-aware throughout (`es-US` for Spanish, `America/Chicago` always). `preferred_locale` is stored on people.
- **Translate once:**
  - One translation module (an LLM provider by default, DeepL as an alternative) with a versioned glossary.
  - A content-hash cache (`translation_cache`): only new or changed text is ever translated, and nothing at request time. With English only, nothing runs.
- **Spanish is an optional pre-launch pass (slice 8.5).** It goes live only if automated checks pass. If it does:
  - legal text (agreements, privacy, terms, receipt statements) gets a professional translation;
  - Spanish DocuSign templates are added.

  Launch never waits for Spanish.
- **v2 content lives in a new `production-v2` dataset**, which avoids breaking the old site's English-only queries. Apply for Sanity's free non-profit plan (three datasets).
- **Later candidates:** Vietnamese and Chinese, for Get Help content first.

## Consequences

- There is a small ongoing cost: every string goes through message files, and every Sanity field has the localized shape.
- Adding a language is configuration plus one translation run, not a rebuild.
- Machine translation without review carries quality risk. It is contained by the automated checks and by keeping binding legal text professionally translated.

## Spike result (0.7)

*Record whether rich text works inside field-level localized arrays; if not, long-form documents use document-level localization.*
