# Size A (small)

Layouts below are template options for a confirmed size. They do not approve a framework, ORM, database, or host. Record an approved choice only in `docs/TECH_CARD.md` and describe structure only in `docs/01-ARCHITECTURE.md`. Do not put the stack in the root README.

- **When:** ~1–3 months, 1–2 devs, low–medium complexity, no need to scale to many teams.
- **Layout:** `src/app`, `src/components`, `src/lib`, `src/types`; a database folder only if the approved card names one.
- **Docs minimum:** `README.md`, `docs/TECH_CARD.md`, `docs/01-ARCHITECTURE.md`, `docs/PROGRESS.md`, `.env.example`.
- **May simplify:** global state library if `useState` enough; tests focused on critical logic; deploy via platform auto-deploy.
- **Do not simplify:** TypeScript strict, validation, ORM/parameterized SQL, secrets via env.
