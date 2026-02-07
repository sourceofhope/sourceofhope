# Developer Documentation

This section is intended to onboard developers to the Source of Hope codebase quickly and safely.

This documentation is not a set of task tutorials. The task tutorials live in `/docs/recipes`.
This section explains how the system is designed and where changes belong.

Read order:

1. `SYSTEM_OVERVIEW.md`
2. `REPOSITORY_LAYOUT.md`
3. `ROUTING_AND_CANONICAL_URLS.md`
4. `CMS_INTEGRATION.md`
5. `API_CLIENT_INTEGRATION.md`
6. `SERVER_OVERVIEW.md`
7. `DEPLOYMENT.md`
8. `UI_COMPONENT_CONVENTIONS.md`
9. `TROUBLESHOOTING.md`

Key project rule:

- Do not hardcode routes or API base URLs. This project has centralized canonical routing and environment-based API routing.
