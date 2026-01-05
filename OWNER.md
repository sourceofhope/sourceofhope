# Owner's Guide

This document explains how to safely, maintain, update, and expand this website for future use.

It is written for **authorized staff, interns, and volunteers only**. Advanced technical background is not required.

---

## Core Principles

1. Never make changes to `production` code without prior approval
2. Backup before changes
3. Small change, test, and then publish
4. When unsure, stop and ask

**This website supports real community services. Mistakes affect real people.**

---

## Workflows

There are two workflows that run on pushes to `development` and `production` respectively.

**Pushes to development**

When you need to test experimental code live, you can:

```bash
npm run dev
```

Or alternatively, visit `sourceofhope.github.io/sourceofhope`, this domain mirrors the latest push on `development`.

Pushes to development may fail, but a push to production should never contain failing

---

## Technical Architecture

### Frontend

React.js, Tailwind, and Headless WordPress.

Public: static website content, small images, videos, and assets that shouldn't need to be frequently modified.

The source for specific pages can be found at:

```
src -> pages -> /<page> -> <page>Page.jsx
```

This contains the `helmet` and code describing which sections belong to this page.

The source for specific sections can be found at:

```
src -> pages -> /<page> -> <page><name>Section.jsx
```

---

## Example: Adding a new Page

**Step 1: Confirm Content**

Collect everything you'll need: assets, media, paragraph content.

**Step 2: Make a new directory**

```cmd
mkdir src/pages/<page>
cd src/pages/<page>
```

This creates a new folder.

**Step 3: Make a new page component**

In an editor of your choice, create a file called `<page>Page.jsx`. This will serve as the component injected in the application's layout when users navigate here. It should contain everything a user sees on the page that is not the Header or the Footer.

**Step 4: Add sections, create content**

Design this new page to current standards, make sure it fits with the theming of the site and is appropriate.

Typically, you should create a new subfolder:

```cmd
mkdir sections
cd sections
```

You can populate this subfolder with additional components like `<page><name>Section.jsx` which contain specific body sections of `<page>Page.jsx`, then add this Section component back to the main page.

**Step 5: Adding a route**

Without routing, users can't access your page. To add a route, reference `routes.jsx`, this contains a map of all of the possible routes within the application, and also allows you to quickly reference the point of failure for a link by tracing back here.

We'll be using square brackets `[]` to replace `<>` from here on for clarity.

Add a canonical relative route like this:

```jsx

export const CANONICAL = {
	...

  [name]: [routeLocation],

	...
};
```

and pair it with a canonical URL which goes into the header of the new page for SEO purposes.

```jsx
export const CANONICAL_URL = {
  [name]: `${BASE_URL}/${CANONICAL.[name]}`,
};
```

Lastly, add the route to `main.jsx` like this:

```jsx
...
{
	path: `serve/${CANONICAL.[name]}`,
	element: <[name] />,
},
...
```

Now, to link this internally use `CANONICAL.[name]` where needed with a `<Link>` tag.

In addition, If you need to add a link to the header specifically, use:

```jsx
function HeaderNavigator() {
  const links = [
		...
    { label: [label], to: CANONICAL.[name] },
    ...
  ];
```

This will add a new label to the header that displays as [label], and points to the page CANONICAL.[name].
