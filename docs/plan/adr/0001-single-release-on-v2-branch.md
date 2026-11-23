# ADR-0001: One public release, built on a long-lived `refresh` branch

- **Status:** Accepted
- **Date:** 2026-11-21

## Context

The relaunch touches every page, adds the Action Hub, a Staff Portal, a database and several integrations. The project lead wants everything to reach the public as a single update, not page by page, and has set no deadline. Meanwhile the current site must keep running, and several people contribute to it through `development` → `production`.

## Decision

- All relaunch work happens on a long-lived **`refresh`** branch, cut from `development`, deployed by a **new Vercel project** with a protected preview domain.
- v2 runs against its own **staging** Sanity dataset, **staging** Supabase project and sandbox credentials. It launches on a new **`production-v2`** dataset, so the old `production` dataset is never written by v2.
- The current site continues unchanged. `development` is merged into `refresh` weekly.
- Staff use the Staff Portal on production data **before** the public switch (staff soft launch). Visitors see the new site only at cutover.
- In-flight branches `feature/membership-launch` and `sid-development` are not inputs to v2.
- There is no year-end change freeze on the current site; it is independent of v2.

## Consequences

- Rollback is simple: point the domain back at the old project, which still reads its untouched dataset.
- Merge cost grows over time, which weekly merges and v2's page rewrites keep manageable.
- A long build without public feedback raises scope and morale risk. That is mitigated by phase reviews on the preview, the staff soft launch and the dress rehearsal.
- CI must be built fresh on `refresh` (slice 0.2), because the CI work on `sid-development` is not merged.

## Alternatives considered

- **Incremental page-by-page releases:** less risk per change, but rejected by the project lead in favor of one coherent launch.
- **Reusing `development` as the integration branch:** this would block other contributors' current-site work.
