# Welcome To thesourceofhope.org Documentation Home

Welcome to the website documentation.

This documentation is organized by **role** and by **task**. The goal is to help different types of users make changes safely and efficiently without needing to understand parts of the system that are not relevant to them.

Before reading anything else, determine which role best fits what you are trying to do.

---

## The Website In One Paragraph

thesourceofhope.org is a single **Next.js** application hosted on **Vercel**. The same codebase renders every page and runs the small backend (checkout, donations, memberships, contact email). Editable content such as events, team members, products, and publications lives in **Sanity**, a hosted CMS. See `/docs/01_SYSTEM_OVERVIEW.md` for the full picture.

---

## Choose Your Path

### Developers

You will be working with the codebase, routing, components, API routes, the CMS schema, or deployment.

Start here:

- `/docs/01_SYSTEM_OVERVIEW.md`
- `/docs/02_ENVIRONMENTS_AND_DEPLOY.md`
- `/docs/03_PROJECT_STRUCTURE_MAP.md`
- `/docs/developers/00_START_HERE.md`

If you are trying to perform a specific task (for example, add a page, edit navigation, add a form), go directly to:

- `/docs/recipes/README.md`

---

### Digital Content Creators

You should **never** need to edit code.

Your work is limited to:

- Creating, editing, and publishing content in Sanity Studio
- Uploading images
- Managing text, dates, prices, and links on CMS content

Start here:

- `/docs/creators/LOGIN_AND_OVERVIEW.md`
- `/docs/creators/CONTENT_TYPES_REFERENCE.md`

---

### Non-Profit Organizers

You may need to:

- Update content
- Understand what changes are safe to make
- Know when to request developer assistance
- Handle emergencies or publishing mistakes

Start here:

- `/docs/organizers/WHAT_YOU_CAN_CHANGE.md`
- `/docs/organizers/WHAT_NEEDS_DEVELOPER.md`
- `/docs/organizers/EMERGENCY_PLAYBOOK.md`

---

## If You Are Trying to "Do Something"

Most users are not trying to understand the architecture. They are trying to complete a task.

For task-based instructions, go to:

- `/docs/recipes/README.md`

The recipes folder contains step-by-step guides for common operations such as:

- Adding a new page or child page
- Updating navigation or adding a redirect
- Pulling new content from the CMS (and adding a new CMS content type)
- Adding an email form or a new API route
- Changing membership plans, shipping, tax, or fees
- Fixing CMS, checkout, build, and deployment problems

---

## Folder Overview

| Folder               | Audience            | Contents                                         |
| -------------------- | ------------------- | ------------------------------------------------ |
| `/docs` (this level) | Everyone            | System overview, environments, structure map     |
| `/docs/developers`   | Developers          | Architecture and reference documentation         |
| `/docs/creators`     | Content creators    | Sanity Studio how-tos and media rules            |
| `/docs/organizers`   | Non-profit staff    | What is safe to change, emergencies, policy      |
| `/docs/recipes`      | Developers (mostly) | Step-by-step fixes, guidelines, and tutorials    |

---

When code changes affect how something works, the corresponding document in `/docs` must be updated in the same commit.
