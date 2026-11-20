# Repository guidance

This repository is **Meduzellar Platform**, the first product of Meduzellar. It is in Concept & Planning. Product scope lives in [`README.md`](README.md) and the working brief in [`docs/BRIEF.md`](docs/BRIEF.md). The always-on product boundary is [`.cursor/rules/02-product.mdc`](.cursor/rules/02-product.mdc).

Described marketplace, recruitment, communication, realtime translation, and assistant capabilities are the target system. They are not implemented behavior.

## Before substantial work

1. Read the explicit user task and preserve its scope.
2. Read `README.md` when the task touches product scope, domains, or status.
3. Read `docs/TECH_CARD.md` when it exists and the task depends on an approved stack.
4. Read `docs/01-ARCHITECTURE.md` when it exists and the task depends on approved structure.
5. Do not start application code, schema, or vendor setup while size, stack, and architecture are still unapproved.

## Instruction locations

```text
Product concept
→ README.md

Working brief
→ docs/BRIEF.md

Approved stack and architecture, once they exist
→ docs/TECH_CARD.md
→ docs/01-ARCHITECTURE.md

Cursor coding standards
→ .cursor/rules/

Reusable workflows
→ .agents/skills/

Skill catalog and profiles
→ .agents/catalog/

Agent-system documentation
→ .agents/system/
```

Use the applicable Rule or Skill instead of copying its full content into this file. Template recommendations under `docs/reference/` are options, not decisions.

## Decision precedence

```text
explicit approved task
→ README.md product scope and status
→ approved TECH_CARD
→ existing project implementation
→ template recommendation
→ generic fallback
```

A template default never overrides the README. Preserve an existing implementation unless the approved task or TECH_CARD explicitly requires a migration.

## Working boundaries

- Do not change architecture, stack, public APIs, database schema, or business behavior outside the approved task.
- Do not add a later Meduzellar product to this repository.
- Do not perform production deployment.
- Do not perform production database migrations.
- Do not delete data.
- Do not commit or push without an explicit request.
- Do not hide or bypass test, lint, build, or validation failures.
- Do not weaken security controls to make a check pass.
- Do not invent accounts, vendor keys, or sample secrets.
- Preserve unrelated user changes and keep edits scoped.
- After meaningful changes, run project-appropriate validation and use `.agents/skills/verify-before-completion/`.

Report checks that were not run and any remaining uncertainty instead of claiming unsupported success.
