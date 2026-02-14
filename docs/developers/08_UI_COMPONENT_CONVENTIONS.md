# UI and Component Conventions

This project uses three UI layers:

1. Global structure components
2. Reusable UI primitives
3. Page-scoped sections

---

## Global Structure

App layout:

- `/src/components/layout/AppLayout.jsx`

Provides:

- HeaderFlagContext
- StoreCartProvider
- Header + Footer
- Suspense fallback loader
- ScrollRestoration keyed on pathname

Errors:

- `/src/pages/ErrorBoundary.jsx` + `/src/components/layout/ErrorLayout.jsx`

ErrorLayout is intentionally wrapped in the same providers and structure as AppLayout so error pages render in the same chrome.

---

## Standard Wrappers

`PageSection`:

- Standard section wrapper for spacing and consistent padding
- Use for most content sections

`PageHeader`:

- Standard hero image wrapper
- Default image comes from `ASSET_VERSION` versioned assets
- Uses eager loading and high fetchPriority (intended for top-of-page hero)

---

## Links and Buttons

`ExpressiveLink`:

- NavLink wrapper with arrow affordance and hover translation

`LinkButton`:

- Use for internal navigation
- Always use CANONICAL routes

`AnchorButton`:

- Use for external links (target=\_blank + noopener/noreferrer)

---

## Forms and Inputs

There are two input components:

`LocalInput` (state-based):

- Maintains its own validity state
- Can write into a shared form state via `setFormData`
- Validates via `onChange` callback

`HookInput` (react-hook-form):

- forwardRef-based input for react-hook-form registration
- Uses `error` prop to render validation message

Rule:

- Avoid mixing these patterns inside a single form without a clear reason.
