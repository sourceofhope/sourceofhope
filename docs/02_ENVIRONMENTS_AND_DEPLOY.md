# Environments and Deployment

This project operates across multiple environments to ensure safe development and testing before changes reach production (what our visitors see and use).

---

## Environments

### Local

Used by developers for building and testing changes; front-end and API changes are visible only on a given device.

- Runs on localhost:<port>
- Connected to local API
- Completely safe for experimentation

---

### Development / Staging

Used for testing changes in a live-like environment before production.

- Hosted on a development domain (dev.thesourceofhope.org)
- Connected to development API endpoints (api.thesourceofhope.org/dev/...)
- Used to verify routes, CMS connections, and forms

---

### Production

The live public site.

- Connected to production APIs
- Only updated through controlled deployments
- Must be stable at all times

---

## API Routing by Environment

The frontend determines which API to use based on the hostname.

- Local --> local API
- Dev domain --> dev API
- Production domain --> production API

This allows the same codebase to behave correctly across environments.

---

## Deployment Flow

1. Developer makes changes locally.
2. Changes are pushed to a feature branch on the repository.
3. Developer creates a pull request
4. Pull request is tested locally, approved, and merged into development
5. CI/CD pipeline builds and deploys:
   - Dev branch --> development site
   - Production branch --> live site
6. Verification is performed after deploy.

---

## Rules for Deployment

- Never edit files directly on the server.
- All changes must go through version control.
- Documentation updates must be included when behavior changes.
- Verify forms, routes, and CMS content after deployment.

---

## Rollback Strategy

If a deployment causes issues:

1. Revert to the previous commit in version control.
2. Redeploy from the stable commit.
3. Verify site functionality.

Never attempt manual hotfixes on the server.
