# ADR-0003: Component foundation behind our own wrappers; Vercel UI SDK preferred, React Aria fallback

- **Status:** Accepted. Spike 0.5 complete: **Vercel UI SDK chosen**, with the guardrails below
- **Date:** 2026-11-21 (result recorded 2026-11-23)

## Context

Today the site has five overlapping layer patterns and only one accessible dialog. The relaunch needs accessible dialogs, menus, tabs, selects, comboboxes, date pickers (portal), toasts and form fields, with localization support for later languages. The look must not read as generic or "vibecoded", which rules out adopting a styled kit's default appearance (e.g. shadcn/ui defaults).

[Vercel's UI SDK](https://www.infoq.com/news/2026/11/vercel-ui-sdk/) shipped on 2026-11-12 as `0.1.0-beta.1`:
- unstyled behaviors (focus, selection, popups and more) with a React 19 adapter;
- designed for coding agents;
- starter components include dialog, select, combobox, date picker and menu;
- localization support and API stability are not yet documented.

React Aria Components (Adobe) is mature and unstyled, with built-in localized date and number handling and screen-reader strings.

## Decision

- **Pages and features import UI only from `src/components/ui/`.** Our wrappers are the API; the library behind them is replaceable.
- **Preferred library: Vercel UI SDK.** Fallback: React Aria Components.
- **Spike 0.5** builds the same four pieces in both libraries:
  - the Hub dialog and mobile takeover;
  - the language Select;
  - a Spanish DatePicker;
  - Field + Combobox.

  Each is scored on automated and manual accessibility, localization, styling control, bundle size, API stability and agent ergonomics.
- **Decision rule:** use UI SDK unless it fails a must-have: WCAG 2.2 AA behavior, a component we need, or localization readiness. Mixing is allowed only behind the wrappers (e.g. React Aria for the portal date picker).
- Styling always comes from our tokens; no library default theme ships.

## Consequences

- Beta churn is contained to `ui/`. A later swap does not touch pages.
- Lint forbids importing the libraries outside `ui/` (slice 1.2).
- **Record the spike scorecard and final choice here when 0.5 completes.**

## Spike result (2026-11-23)

**What was built.** The same four pieces were built in both libraries, on branch `refresh-0.5-component-spike` (commit `2a657d2`), at `/spike/ui-sdk` and `/spike/react-aria`:

- the Hub dialog, URL-driven (`?action=`), with door tabs, centered on desktop and full screen on phones;
- a language select;
- a locale-aware date picker (English and Spanish);
- a Field + Combobox form with schema-style validation.

Both use the same shared data, URL hook and Tailwind token classes. One Playwright + axe suite with role-based selectors scored both against a production build. Versions: `@ui-sdk/react` `0.1.0-beta.16`; `react-aria-components` `1.22.1`.

| Criterion | Vercel UI SDK | React Aria Components |
|---|---|---|
| axe WCAG 2.0–2.2 A/AA, page and open Hub | 0 violations | 0 violations |
| Hub: keyboard open, focus inside, Tab trapped, Escape closes, focus returns to the trigger | Pass | Pass |
| Hub: browser Back closes, deep link opens, tabs switch doors, UTMs survive close | Pass | Pass |
| Hub full screen at 360×740 | Pass | Pass |
| Language select by keyboard; Spanish calendar (`diciembre de 2026`) | Pass | Pass |
| Combobox: type to filter, choose by keyboard; error set as `aria-invalid` and announced through `aria-describedby` | Pass | Pass |
| Built-in accessible strings in Spanish | English by default. Each control takes an `aria-label`, so our wrappers pass message-file strings (spike output: "Mes anterior") | Translated automatically through `I18nProvider` (spike output: "Anterior", plus localized hidden descriptions) |
| Library-only JS for the four pieces (raw / compressed) | **259 KB / 87 KB** | 372 KB / 113 KB |
| Styling control | Unstyled; short data-attribute variants (`data-selected:`); render props | Unstyled; `data-[selected]:` variants; render props |
| Extras relevant to us | Built-in mobile sheet presentation; a typed reason on every close (swipe can be refused); `invalid` prop on Field for form-library and server errors; native-validation integration | `isInvalid` on fields; mature date handling via `@internationalized/date` |
| Agent ergonomics | Docs, `llms.txt` and an agent skill ship inside the package, versioned with the code | Very widely known; extensive online docs |
| API stability | **Beta:** 14 releases in 11 days (beta.1 → beta.16); 0.x, so any release may break | Stable: 37 `1.x` releases since December 2023, semantic versioning |
| Manual screen-reader pass (VoiceOver, NVDA) | Not run: needs a person. Both libraries document their screen-reader testing | Not run |

**Decision, by the agreed rule.** UI SDK met every must-have: WCAG 2.2 AA behavior, all four required components, and localization readiness (with our own label strings). **We use the Vercel UI SDK.** It is also the lighter option, and the project lead's preference.

**Guardrails for the beta risk:**

1. **Pin exact versions** of `@ui-sdk/core` and `@ui-sdk/react`, with no caret ranges. Upgrade deliberately, in a commit of its own that runs the full e2e and accessibility suite. Read the bundled docs' changelog first.
2. **Wrappers only:** pages never import `@ui-sdk/*`. Lint enforces this (slice 1.2).
3. **Localized strings:** every wrapper that renders a built-in control (calendar navigation, clear buttons, trigger icons) takes its accessible labels from `messages/<locale>.json`. A wrapper test asserts there is no hard-coded English accessible name.
4. **Checkpoints:** re-score against this table at the end of Phase 1 and again in Phase 8. Switch the affected wrappers to React Aria Components (proven equivalent in this spike) if either of these happens:
   - an upgrade regresses accessibility and isn't fixed within one release;
   - churn costs more than a day of wrapper rework per month.
5. **Manual check:** the VoiceOver and NVDA pass on the spike pages is added to the slice 1.4 acceptance criteria and run on the real wrappers.
