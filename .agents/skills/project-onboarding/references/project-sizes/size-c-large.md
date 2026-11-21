# Size C (large)

Layouts below are template options for a confirmed size. They do not approve a framework, ORM, database, or host. Approved stack and architecture paths are only `docs/TECH_CARD.md` and `docs/01-ARCHITECTURE.md`.

- **When:** 6+ months, multiple teams, many features, scaling and clear module boundaries required.
- **Layout:** `apps/web`, `apps/api` when the approved card separates a backend, optional `apps/admin`; `packages/ui`, `packages/domain`, `packages/shared`, `packages/contracts`, shared `config` tooling.
- **Boundaries:** `domain` stays free of framework imports; apps depend on packages, not the reverse; document the allowed dependency graph in `docs/01-ARCHITECTURE.md`.
- **Docs:** ADRs for major decisions; API contracts (OpenAPI/events); guides for setup/deploy/contributing.
- **Tooling:** use the approved workspace/build tooling; run affected pipelines when supported.
- **Testing:** high coverage on `domain`; integration for APIs; e2e for critical user journeys.
