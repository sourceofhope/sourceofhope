## Rule: Keep AppLayout and ErrorLayout in sync

If you add a new global provider (theme, analytics context, feature flags, etc.), you must update:

- `AppLayout.jsx`
- `ErrorLayout.jsx`

Otherwise:

- error routes may render with missing providers
- Header/Footer may crash if they assume provider presence

---

## Recommended approach

1. Identify the wrapper(s) you need to add.
2. Add to both layouts at the same nesting level unless there is a strong reason not to.
3. Validate error routes explicitly:
   - open a non-existent URL to trigger 404 boundary
   - confirm header/footer and new wrapper behave correctly

---

## Known layout behaviors to preserve

- `Suspense` fallback uses `<Loader />`
- `ScrollRestoration` is keyed by pathname:
  - `getKey={(location) => location.pathname}`

Do not remove `ScrollRestoration` unless you intend to change navigation scroll behavior site-wide.

---

## Validation checklist

- Normal routes render without regression
- Error routes still render Header/Footer and do not crash
- Mobile header menu still works
- Banner state (HeaderFlagContext) still works
