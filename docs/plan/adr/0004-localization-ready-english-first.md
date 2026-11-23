# ADR-0004: English at launch, localization-ready, translate once

- **Status:** Accepted
- **Date:** 2026-11-21

## Context

Census data for the four DFW counties shows Spanish speakers are about 73% of residents with limited English. In Plano, the next-largest groups are Chinese and Vietnamese ([research](../research/LOCALIZATION_RESEARCH.md)). The project lead wants localization in the future but does not want to force a second language into launch. There is no fluent reviewer available, so any translation would be machine-made. Cost must stay low: translate static text once, never per visitor. TSOH receives no federal funds, so no federal language-access review applies.

## Decision

- **Launch language:** English only (`NEXT_PUBLIC_ENABLED_LOCALES=en-US`). The language dropdown is hidden while only one locale is enabled.
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

## Spike result (0.7, 2026-11-23)

Built on branch `refresh-0.7-i18n-spike` (commit `ac1ddee`), with next-intl 4.16.0 on Next 16.4.6. Everything was verified against a production build with `en-US`, `es-US` and `en-XA` enabled.

**Rich text works in field-level localized arrays.**
- `sanity-plugin-internationalized-array` 5.3.10 registers `internationalizedArrayPortableText`, from `defineField({name: 'portableText', type: 'array', of: [{type: 'block'}]})`, alongside `…String` and `…Text`.
- `sanity schema validate` passes with 0 errors. A control with an unregistered type fails, so the pass is genuine. The Studio builds.
- The GROQ fallback `coalesce(field[language == $lang][0].value, field[language == "en"][0].value)` was checked in memory with `groq-js` on the plugin's stored shape:
  - Spanish title, with the body falling back to English when Spanish is missing;
  - an unknown locale falls back fully;
  - `!defined(field[language == $lang][0])` flags the fallback, for the "not yet translated" notice and `noindex`.
- **Decision: field-level localization for every type, long-form included.** Document-level localization is not needed.

**Website routing decisions confirmed:**

| Decision | Verified behavior |
|---|---|
| Locales are full tags (`en-US`, `es-US`, pseudo `en-XA`). URLs use custom prefixes: none for English, `/es`, `/pseudo` (`localePrefix: {mode: 'as-needed', prefixes}`) | `/events` and `/es/events` → 200; `/en-US/events` → 307 to `/events`; `/es-US/…` and `/fr/…` → 404 (one canonical URL per page) |
| Formatting uses the full tag | Spanish shows "viernes, 25 de diciembre de 2026", "9:00 a.m.", **"$1,234.50"**; English shows "Friday, December 25, 2026", "9:00 AM" |
| `localeDetection: false` | `Accept-Language: es` on `/` → 200, no redirect |
| `next/root-params` in `src/i18n/request.ts`; `generateStaticParams` in `[locale]/layout.tsx` | Every page is still prerendered per locale (SSG); `<html lang>` is set per locale |
| The English-only Staff Portal is a second root layout, `(staff)/staff/layout.tsx`, outside `[locale]`. `request.ts` falls back to the default locale when there is no locale param | `/staff` → 200, `lang="en-US"`, messages load |
| Route handlers take `locale` explicitly (`getTranslations({locale, namespace})`) | `/api/i18n-demo?locale=es-US` returns the Spanish message |
| Proxy matcher excludes `api`, `staff`, `link` and `styleguide` as whole segments, plus `_next`, `_vercel` and files | `/link` → 404 (no locale rewrite); `/api/health` → 200 |
| Legacy `[slug]` moved under `[locale]` | `/annelise-quynh-stone` → 308 to `/about/team/annelise-quynh-stone`; unknown → 404. *The rebuild should use next-intl's locale-aware `redirect`, so `/es/<slug>` keeps Spanish* |
| `next.config` redirects still run before the proxy | `/awards`, `/serve/*` → 308 |
| next-intl `Link` | On `/es` pages it renders `href="/es/events"` |
| Plurals (ICU) | Correct for 0, 1 and many in English, Spanish and pseudo |
| Pseudo-locale | `scripts/pseudo-locale.mjs` transforms the parsed ICU syntax tree (FormatJS parser), so placeholders, `#` and plural keywords survive; output is bracketed (`⟦…⟧`), accented and padded about 40% |

**Notes for slice 1.7:**
- Name the env var `NEXT_PUBLIC_ENABLED_LOCALES`, since the client needs it to hide the dropdown. Default `en-US`.
- Add `@formatjs/icu-messageformat-parser` as an explicit dev dependency (it's transitive today).
- Message files are named by full tag (`messages/en-US.json`).
- The Studio's local `sanity` (5.14.1) lags the hosted runtime (5.31.1). Bring the Studio's dependencies current in slice 2.5.
