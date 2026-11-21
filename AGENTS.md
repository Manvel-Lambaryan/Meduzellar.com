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

## Authority classes

Keep these classes distinct. A lower class never becomes a higher class by being copied, generated, or discussed.

| Order | Class | What it can decide | Where it lives |
| --- | --- | --- | --- |
| 1 | Security invariants | The controls listed below. Nothing else can waive them | This section. Always-applied safety statements in `.cursor/rules/00-core.mdc` repeat it |
| 2 | Repository governance | How work is done, approval gates, and workflow stops | This file's working boundaries, `.cursor/rules/` workflow rules, accepted records in `.agents/system/DECISIONS.md` for the agent system |
| 3 | Owner-approved product scope | What the product is and an explicit task to change that scope | Explicit owner approval and `README.md` |
| 4 | Approved stack and structure | Approved technologies and folder structure | Approved `docs/TECH_CARD.md` and approved `docs/01-ARCHITECTURE.md` |
| 5 | Approved project documentation and implementation | Accepted requirements and behavior built under an approved decision | `docs/BRIEF.md` only after owner approval, accepted ADRs, and approved application code or schema |
| 6 | Templates and defaults | Options and examples | `docs/reference/`, skill `references/`, workflow examples, and general engineering defaults |

### Security invariants

These controls stay in force for every technology choice, task, TECH_CARD, architecture document, template, generated file, and implementation:

- Protect secrets and credentials.
- Validate external input.
- Enforce authorization on the server.
- Use secure password hashing when passwords are stored.
- Use parameterized database queries.
- Prevent sensitive information from leaking through errors and logs.
- Preserve mandatory security controls.
- Never weaken a security control merely to pass a check.

An ordinary task, product decision, or architecture approval does not waive a control. Choosing a vendor, framework, database, or authentication approach is not approval to weaken one.

This repository does not define a security exception process, and it has no exception register. No exception is valid. Do not infer one from conversation, a task, a TECH_CARD row, or an architecture note.

A future process may exist only after the owner explicitly approves both the process and a record file. The proposed record is `docs/SECURITY_EXCEPTIONS.md`. Do not create that file until the owner asks for it. Until an entry there names the exact control, the exception, the risk, and the compensating controls, and the owner has explicitly approved that entry, the work that needs the exception stays stopped.

`docs/BRIEF.md` is a working brief until the owner approves it. It does not expand README scope by itself. Conversation history may explain context. It does not become a repository decision until the owner asks for that decision to be written into an approved document.

Repository governance does not select product scope, stack, or vendors. The owner does. A workflow gate yields only when the owner explicitly authorizes that specific action. Approval of a technology is not approval to scaffold, deploy, migrate production, or waive a security invariant.

## Decision precedence

```text
security invariants
→ repository governance and workflow gates
→ explicit owner-approved task and README.md product scope
→ approved TECH_CARD and approved 01-ARCHITECTURE
→ approved project documentation
→ existing implementation that was itself approved
→ template or reference example
→ general engineering default
```

A template default never overrides the README. An example, template, reference page, generated file, or accidental scaffold is not an approved decision. Preserve an approved implementation unless the approved task or TECH_CARD explicitly requires a migration. Do not preserve an unapproved scaffold as authority. Neither an approved implementation nor an approved TECH_CARD can waive a security invariant.

## Conflict resolution

When two statements disagree:

1. Identify the conflicting instructions and quote the files that contain them.
2. Identify the authority class of each statement from the table above.
3. If one statement weakens a security invariant, stop the affected work. Do not apply the technology or product class over the invariant.
4. Otherwise apply the higher class. Do not silently choose between two statements of the same class.
5. Do not treat an example, template, reference, generated file, or accidental implementation as the winner.
6. Stop and ask the owner when the classes do not resolve a material conflict, when resolving it would approve a technology, change product scope, bypass an approval gate, or depend on a security exception.
7. Report the conflict, both sources, and the affected files before any further change.

If the conflict is inside an unapproved draft, leave the draft unapproved and ask. Do not "fix" it by selecting a vendor.

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
