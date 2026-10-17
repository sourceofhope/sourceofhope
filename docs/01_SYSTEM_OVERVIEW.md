# System Overview

The website is a single Next.js application connected to a headless CMS (Sanity) and a few third-party services (Stripe, PayPal, Resend).

Unlike the original site, there is no separate frontend and API server. The pages and the backend live in **one codebase** and deploy together to Vercel.

The system has three major parts:

1. Pages (UI and routing)
2. API routes (payments, forms, email)
3. Headless CMS (Sanity, editable content)

Understanding this separation is critical to knowing **where** changes should be made.

---

## 1. Pages

Pages are React components rendered by Next.js. They are responsible for:

- Rendering every URL on the site
- Routing (the folder structure under `/src/app` _is_ the URL structure)
- Displaying CMS content
- Layout, navigation, SEO metadata, and presentation
- Interactive UI such as the store cart, checkout forms, and carousels

Most page wording (home, about, programs, planned giving, memberships, awards, press, podcast) is written directly in the code. Changing it requires a developer.

This is where developers work when:

- Adding new pages
- Editing layout, wording, or navigation
- Creating new components
- Connecting CMS data to UI
- Adjusting styling or structure

---

## 2. API Routes

API routes are small server-side functions that live in the same codebase under `/src/app/api`. The browser calls them at `/api/...` on the same domain as the page.

They are responsible for:

- Calculating store prices, tax, shipping, and fees on the server
- Creating Stripe and PayPal payments, subscriptions, and invoices
- Receiving Stripe webhooks
- Sending contact and planned-giving form emails (Resend)
- Rate limiting and validating everything the browser sends

This is where developers work when:

- Changing checkout, donation, or membership behavior
- Updating email behavior
- Adding new backend endpoints

Content creators and non-profit organizers should **never** need to interact with this.

---

## 3. Headless CMS (Sanity)

Sanity stores structured content and serves it to the website. Content is edited in **Sanity Studio**.

The CMS currently controls:

- Team members and team groups
- Featured and recurring events
- Publications (news/blog links) and newsletters
- Store products, including prices
- Which express checkout buttons are enabled

This is where content creators work.

The website **pulls** content from Sanity when a page is generated and refreshes it at most every 30 seconds. Unpublished drafts are never shown.

---

## How These Pieces Work Together

1. Content is created and published in Sanity Studio.
2. When a page is generated, the server reads that content from Sanity.
3. Components render the content on specific routes.
4. Forms and checkout call the site's own `/api/...` routes, which talk to Stripe, PayPal, or Resend.

```
Visitor ──> Vercel ──> Next.js page ──reads──> Sanity
                   └─> /api/... route ──> Stripe / PayPal / Resend
Editor  ──> Sanity Studio ──publishes──> Sanity
```

---

## Boundaries of Responsibility & Operations

If content is wrong (an event, a team bio, a product price) --> check Sanity.  
If layout or page wording is wrong --> check the page code.  
If forms, checkout, or donations fail --> check the API routes and their environment variables.

| Role            | Works In                    | Does Not Touch      |
| --------------- | --------------------------- | ------------------- |
| Developer       | Pages, API routes, CMS schema | Content           |
| Content Creator | Sanity Studio               | Code, routing, API  |
| Organizer       | Sanity Studio, policy       | Code structure      |
