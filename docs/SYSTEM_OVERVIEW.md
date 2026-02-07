# System Overview

This website is a modern frontend application connected to a headless CMS and API layer.

The system is intentionally separated into three major parts:

1. Frontend Application (UI and Routing)
2. API Layer (forms, email, integrations)
3. Headless CMS (content management)

Understanding this separation is critical to knowing **where** changes should be made.

---

## 1. Frontend Application

The frontend is responsible for:

- Rendering all pages
- Handling routing
- Displaying CMS content
- Providing reusable UI components
- Managing layout, SEO, and presentation

This is where developers work when:

- Adding new pages
- Editing layout or navigation
- Creating new components
- Connecting CMS data to UI
- Adjusting styling or structure

---

## 2. API Layer

The API layer is responsible for:

- Handling form submissions
- Sending emails
- Processing backend logic
- Connecting the frontend to external services

This is where developers work when:

- Modifying where forms send data
- Updating email behavior
- Adding new backend endpoints

Content creators and non-profit organizers should **never** need to interact with this.

---

## 3. Headless CMS

The CMS is responsible for:

- Pages
- Posts
- Images and media
- Text content
- Structured content blocks used by the frontend

This is where content creators work.

The frontend **pulls** content from the CMS and displays it using components.

---

## How These Pieces Work Together

1. Content is created in the CMS.
2. The frontend fetches that content through API calls.
3. Components render the content on specific routes.
4. Forms use the API layer to send emails or data.

---

## Boundaries of Responsibility & Operations

If content is wrong --> check CMS.  
If layout is wrong --> check frontend.  
If forms are wrong --> check API.

| Role            | Works In           | Does Not Touch     |
| --------------- | ------------------ | ------------------ |
| Developer       | Frontend, API, CMS | Content            |
| Content Creator | CMS                | Code, routing, API |
| Organizer       | CMS, Policy        | Code structure     |
