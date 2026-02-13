# Add a Child Route

This recipe covers adding a child route under an existing parent, such as:

- `/about/<child>`
- `/serve/<child>`
- `/media/<child>`
- `/store/<child>`

This project models children inside `ROUTES.<parent>.children`.

---

## Add the Child Segment in routes.jsx

Example: Add `/about/partners`

In `/src/routes.jsx`:

```js
about: {
  path: "about",
  children: {
    team: "team",
    member: "team/:memberSlug",
    partners: "partners",
  },
},
```

After this, `CANONICAL.about.partners` will exist as:

absolute: `/about/partners`

relative: `about/partners`

---

## Create the Page Component

Create:

`/src/pages/about/PartnersPage.jsx`

Or, if you prefer to keep child pages grouped:

`/src/pages/about/partners/PartnersPage.jsx`

Either is acceptable, but be consistent within the /about folder.

---

## Register the Route in the Router

Import the page, then add:

```js
{
  path: CANONICAL.about.partners.relative,
  element: <PartnersPage />,
}
```

---

## Update Header Dropdown

If this child route should show under `ABOUT`, update the `ABOUT` item’s children array in HeaderNavigator.

Example:

```js
{
  label: "ABOUT",
  route: CANONICAL.about,
  children: [
    { label: "TEAM", route: CANONICAL.about.team },
    { label: "PARTNERS", route: CANONICAL.about.partners },
  ],
},
```

## Validate

Confirm all of these work:

- Clicking the new link

- Refreshing the browser on the child route

- Navigating between the parent and child without layout shift
