# Debug Route Mismatches When Adding Pages

Routes are defined centrally in:

- `/src/routes.jsx` (CANONICAL)
- router configuration (createBrowserRouter)

Header navigation uses:

- `CANONICAL` objects, not strings

---

## Symptoms

- Clicking a nav link goes to the wrong URL
- A page renders at the wrong route
- A route exists in CANONICAL but is not reachable
- 404 boundary renders for a route you believe exists

---

## Verify routes.jsx first

Confirm:

- `ROUTES.<key>` exists
- `CANONICAL.<key>` includes `absolute` and `relative`

If you added children, confirm:

- `CANONICAL.parent.child.relative` exists

---

## Verify router registration

Routes do not exist until they are registered in the router config.

Confirm:

- You imported the new page component
- You added a route entry using `CANONICAL.<...>.relative`

Example pattern:

```js
{
  path: CANONICAL.about.team.relative,
  element: <TeamPage />,
}
```

## Verify Header config

Header links must reference the same `CANONICAL` objects that router uses.

Common mistake:

Adding a nav link for a route that is not registered in the router

## Verify deep-link behavior on production host

If:

- client-side navigation works
- but refresh fails

This is not a route mismatch. It is a static hosting fallback issue.
See:

`/docs/recipes/FIX_REACT_ROUTER_404_ON_STATIC_HOST.md`

## Debugging technique

Print the values of `CANONICAL` to verify expected URLs:

- `CANONICAL.about.absolute`
- `CANONICAL.about.team.relative`

Compare those strings to the router paths and Header to props.
Rule

The only source of truth for paths is `CANONICAL`.
If a path string exists anywhere else, it is a maintenance risk.
