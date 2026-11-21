# ADR-0003: Component foundation behind our own wrappers; Vercel UI SDK preferred, React Aria fallback

- **Status:** Accepted (library choice pending spike 0.5)
- **Date:** 2026-11-21

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

## Spike result

*To be filled in by slice 0.5.*
