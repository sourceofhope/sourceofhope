# ADR-0009: Component architecture and conventions

- **Status:** Accepted
- **Date:** 2026-11-23

## Context

The current site grew page by page: five overlapping overlay patterns, four button styles, seven local `CarouselCard`s, and the same spinner pasted into five files. The relaunch must end with one clear, consistent component system used across the whole repository, so later phases compose existing pieces instead of inventing new ones. [ADR-0003](0003-component-foundation-wrappers.md) chose the Vercel UI SDK behind our own wrappers. This record fixes how those wrappers, and everything built on them, are organized, named, styled and tested.

## Decision

### 1. Layers, one direction

```
src/app/globals.css          tokens (@theme): the only place colors, sizes, radii, shadows, motion are defined
src/components/ui/           primitives: generic, domain-free (Button, Dialog, Field, Badge, …)
src/components/layout/       shell and page structure (Header, Footer, MenuSheet, PageHeader, Section, templates)
src/features/<area>/         domain components (EventCard, GiveAmountStep, ServiceDetail, …)
src/app/**                   routes: compose templates + features, fetch data, nothing visual of their own
```

- **Imports flow down only.**
  - `ui` imports nothing from `layout`, `features` or `app`.
  - `layout` imports `ui`.
  - `features` import `ui` and `layout`, and never another feature's internals; shared pieces move down into `ui` or `layout`.
  - Lint enforces this (slice 1.2).
- **Only `src/components/ui/` may import `@ui-sdk/*`, `tailwind-variants` or `tailwind-merge`.** Everything else uses our components.
- **Legacy code** moves to `src/components/legacy/` (slice 1.0) and is deleted in slice 3.9. New code must never import from `legacy`.

### 2. Anatomy of a primitive

Each primitive lives in its own kebab-case folder:

```
src/components/ui/button/
  button.tsx          the component(s): Button, LinkButton (PascalCase exports, no default export)
  button.styles.ts    its tailwind-variants recipe: the only place its classes live
  button.test.tsx     contract tests (Vitest + Testing Library)
  index.ts            public exports
src/app/styleguide/sections/button.tsx   every variant, size and state, rendered
```

Import paths are always `@/components/ui/<name>`. There is no package-wide barrel, so client code never pulls in every component.

### 3. Styling

- **Variants come from one tool:** `tailwind-variants` (`tv`) recipes, using `slots` for multi-part components (Dialog, Field, Tabs). `tailwind-merge` is configured once in `src/components/ui/lib/tv.ts` with our custom token names. No `clsx` string-building in components.
- **Token classes only:** the semantic tokens from spec §5.1 (`bg-surface`, `text-muted`, `border-input`, `bg-action`, …). No default Tailwind palette, raw hex, `rounded-xl`+, or off-scale arbitrary values (lint, slice 1.2).
- **State styling uses the UI SDK's data attributes** (`data-open:`, `data-selected:`, `data-invalid:`, `data-disabled:`) and `focus-visible:`. Never mirror library state in React state just to style it.
- **`className` on a primitive is for placement only:** margin, grid or flex placement, width. Never color, type or radius. Reviews reject anything else; if a new look is needed, it becomes a variant.
- **One focus style** for everything: a 2px `--color-focus` ring with a 2px offset, defined once in the recipe helpers. On inverse surfaces (hero, footer), a white ring.

### 4. One props vocabulary

| Prop | Values | Meaning |
|---|---|---|
| `variant` | `primary` · `secondary` · `tertiary` (· `danger`, portal only) | Visual emphasis. Same words on Button, LinkButton, IconButton, HubButton |
| `size` | `sm` (portal only) · `md` (default) · `lg` | Control height 36 / 44 / 52 px |
| `tone` | `neutral` · `info` · `success` · `warning` · `danger` · `public` · `volunteer` | Status meaning, on Alert, Badge and Toast |
| `surface` | `default` · `inverse` | The component sits on a dark surface (hero video, footer) and inverts itself |
| `label` | string (required where there is no visible text) | Accessible name, enforced by TypeScript on IconButton, icon-only triggers and Dialog close |

No synonyms (`kind`, `type`, `color`, `appearance`, `intent`) are allowed.

### 5. Elements, links and server or client

- **Element substitution** uses the UI SDK `render` prop pattern. Links are separate components sharing a recipe: `Button` renders `<button>` with a required `type`; `LinkButton` renders a next-intl `Link` (internal); `ExternalLink` renders `<a>`. Never a button wrapped in a link, or the reverse.
- **Server first.** A primitive that only renders markup stays a Server Component (using `renderElement` when it needs `render`). Interactive primitives put `"use client"` in their own file. Pages and layouts never add `"use client"` for convenience.

### 6. Text and accessibility

- **No user-facing literal strings** in `ui`, `layout` or `features`. Built-in labels ("Close", "Pause video", "Previous month") come from `messages/<locale>.json` under the `UI` namespace by default, and can be overridden through props. This is why localization plumbing (slice 1.7) runs before the interactive primitives (slice 1.4).
- **Keyboard and screen reader:** every interactive primitive keeps the UI SDK's keyboard and ARIA behavior. Wrappers never strip managed attributes (`role`, `aria-controls`, `data-slot`).
- **Reduced motion:** honored inside each primitive's recipe (`motion-reduce:`), not left to callers.

### 7. Definition of done for a primitive

- [ ] Recipe, component and types follow sections 2–4. No library import outside `ui/`.
- [ ] Contract tests: it renders; required props are enforced; accessible name and role are correct; variants map to the right classes.
- [ ] Interactive primitives: a Playwright keyboard and focus test on its styleguide section, plus axe clean.
- [ ] Styleguide section shows every variant, size, state (hover, focus, disabled, invalid, loading) and both surfaces.
- [ ] Works at 360px and at 400% zoom, and under reduced motion.
- [ ] A short header comment: what it is, when to use it, and what to use instead.

## Consequences

- Every later slice composes from a small, documented set of pieces. Reviews can reject one-offs by pointing to this record.
- Lint makes most rules mechanical, so they don't depend on memory.
- Slightly more ceremony per primitive (four files plus a styleguide section). That's the price of consistency.
- If ADR-0003's checkpoint forces a library swap, only `src/components/ui/` changes.
