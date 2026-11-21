# Size B (medium)

Layouts below are template options for a confirmed size. They do not approve a framework, ORM, database, or host. Approved stack and architecture paths are only `docs/TECH_CARD.md` and `docs/01-ARCHITECTURE.md`.

- **When:** ~3–6 months, small team, many features, possible separate API later.
- **Layout:** `src/features/*` (components, hooks, services, `types`, `index` barrel), `src/shared/*`, `src/config`; `tests/` as needed.
- **Docs:** optional later notes may describe structure, an API, a database, decisions, or a changelog. Those names are not canonical paths. Do not create them during planning, and do not treat them as substitutes for the two canonical documents.
- **Rules:** import features via **public barrels** (`@/features/x`); **no** `shared` importing from `features`.
- **Testing:** unit for domain/services; integration for API routes; e2e for critical flows.
