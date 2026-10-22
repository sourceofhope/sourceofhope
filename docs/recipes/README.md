# Recipes

Step-by-step guides for common tasks. Each recipe is self-contained: find the task closest to what you are doing and follow it.

- **fixes/** diagnose and repair something that is broken or behaving unexpectedly.
- **guidelines/** conventions to follow when working in a given area.
- **tutorials/** build something new from start to finish.

If you need background first, read `/docs/developers/00_START_HERE.md`.

---

## Fixes

| Recipe | Use it when |
| ------ | ----------- |
| `/docs/recipes/fixes/FIX_CMS_FETCH_FAILURE.md` | Sanity content is missing, a page shows an empty state, or the build fails with a Sanity configuration error. |
| `/docs/recipes/fixes/FIX_API_REQUEST_ERRORS.md` | A request to `/api/...` returns 400, 404, 405, 409, 429, 500, or 502 and you need to know why. |
| `/docs/recipes/fixes/FIX_PAGE_ROUTE_MISMATCH.md` | A page 404s, a nav link goes to the wrong place, or an old URL no longer works. |
| `/docs/recipes/fixes/FIX_BUILD_AND_DEPLOY_FAILURES.md` | `npm run build` or a Vercel deployment fails, changes don't show up, or you need to roll back. |
| `/docs/recipes/fixes/FIX_PAYMENT_AND_WEBHOOK_ISSUES.md` | Store checkout, donations, memberships, PayPal, or the Stripe webhook misbehave. |
| `/docs/recipes/fixes/UPDATE_STATIC_ASSETS.md` | You are replacing images, video, or documents in `/public` or bumping `ASSET_VERSION`. |
| `/docs/recipes/fixes/USING_CMS_IMAGES.md` | You are rendering images that come from Sanity, or CMS images are slow or broken. |

---

## Guidelines

| Recipe | Use it when |
| ------ | ----------- |
| `/docs/recipes/guidelines/ADD_A_CHILD_ROUTE.md` | Adding a page under an existing section, such as `/about/<child>` or `/media/<child>`. |
| `/docs/recipes/guidelines/ADD_A_REDIRECT.md` | A page moved or was renamed and old links must keep working. |
| `/docs/recipes/guidelines/AVOIDING_LAYOUT_SHIFT_WITH_IMAGES.md` | Adding images that should not make the page jump while loading. |
| `/docs/recipes/guidelines/CHANGE_NAVIGATION_MENU.md` | Reordering, renaming, adding, or removing header (or footer) links. |
| `/docs/recipes/guidelines/CONSISTENT_PAGE_LAYOUT.md` | Building sections that line up with the rest of the site using `PageSection`. |
| `/docs/recipes/guidelines/CONSISTENT_PAGE_HEADER.md` | Adding the standard hero banner (`PageHeader`) to a page. |
| `/docs/recipes/guidelines/CREATING_AN_IMAGE.md` | Preparing photos or short videos for the CMS or the codebase. |
| `/docs/recipes/guidelines/OPTIMIZE_STATIC_IMAGES.md` | Adding or optimizing images that ship with the code in `/public`. |
| `/docs/recipes/guidelines/PULL_CONTENT_FROM_CMS.md` | Showing Sanity content on a page through `sanity-content.ts`. |
| `/docs/recipes/guidelines/RUN_LOCALLY.md` | Setting up the site (and optionally Sanity Studio and Stripe webhooks) on your machine. |
| `/docs/recipes/guidelines/SERVER_AND_CLIENT_COMPONENTS.md` | Deciding whether a component needs `"use client"` and what it may import. |
| `/docs/recipes/guidelines/SET_UP_DOCUSIGN_WAIVERS.md` | Turning on online volunteer waiver signing: DocuSign account, templates, keys, webhook, and go-live. |
| `/docs/recipes/guidelines/VERIFYING_ENVIRONMENT_CONFIGURATION.md` | Checking that an environment (local, development, production) has the right keys and services. |

---

## Tutorials

| Recipe | Use it when |
| ------ | ----------- |
| `/docs/recipes/tutorials/ADD_A_NEW_PAGE.md` | Creating a brand-new top-level page. |
| `/docs/recipes/tutorials/ADD_A_NEW_SECTION_TO_EXISTING_PAGE.md` | Adding a new block to an existing page. |
| `/docs/recipes/tutorials/ADD_A_REUSABLE_COMPONENT.md` | Creating a shared UI primitive in `/src/components/ui`. |
| `/docs/recipes/tutorials/ADD_A_STORE_PROMO_SECTION.md` | Adding a static "shop to support the mission" section that links to the store. |
| `/docs/recipes/tutorials/ADD_A_GLOBAL_PROVIDER.md` | Adding a context provider or site-wide wrapper to the root layout. |
| `/docs/recipes/tutorials/ADD_OR_EDIT_GLOBAL_HEADER.md` | Changing or turning on the banner strip above the header. |
| `/docs/recipes/tutorials/ADD_OR_UPDATE_PAGE_SEO.md` | Setting a page's title, description, social preview, or canonical URL. |
| `/docs/recipes/tutorials/ADD_STORE_LINK_OR_BUTTON.md` | Linking to the store, cart, checkout, or a product. |
| `/docs/recipes/tutorials/BUILD_AN_EMAIL_FORM.md` | Building a form that sends email through `/api/email/send`. |
| `/docs/recipes/tutorials/DISPLAY_CART_COUNT.md` | Showing the cart item count somewhere new. |
| `/docs/recipes/tutorials/ADD_A_CMS_CONTENT_TYPE.md` | Adding a new kind of content to Sanity and showing it on the site. |
| `/docs/recipes/tutorials/ADD_AN_API_ROUTE.md` | Adding a new backend endpoint under `/src/app/api`. |
| `/docs/recipes/tutorials/ADD_A_DOWNLOADABLE_DOCUMENT.md` | Offering a PDF for download, or updating or adding a volunteer agreement. |
| `/docs/recipes/tutorials/UPDATE_MEMBERSHIP_PLANS.md` | Changing membership plan names, prices, or tiers. |
| `/docs/recipes/tutorials/CHANGE_SHIPPING_TAX_OR_FEES.md` | Changing shipping options, the sales tax rate, or the processing fee. |
