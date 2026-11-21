---
name: project-onboarding
description: Use when planning Meduzellar from README.md and docs/BRIEF.md, proposing A/B/C size, and preparing TECH_CARD plus architecture for owner approval. Do not use for ordinary development, do not scaffold or release without a separate approval, and do not treat template tables as approved decisions.
---

# Project onboarding

Use this workflow to move Meduzellar from the product brief toward an owner-approved plan. Product scope comes from `README.md` and `docs/BRIEF.md`. Do not run it for ordinary development. Do not treat `docs/reference/knowledge-base/TECH_STACK.md` or a template table as a decision.

The workflow has three phases. Phase B and Phase C never start automatically.

## Phase A — Project Planning and Approval

1. **Intake** — collect the brief, audience, must-have features, design links, integrations, constraints, and deadlines.
2. **Analyze the brief** — read `docs/BRIEF.md`, identify gaps, and list decisions that affect scope or architecture. Do not invent answers.
3. **Determine project size** — use [`references/project-sizing.md`](references/project-sizing.md), propose **A / B / C** with a short rationale, and wait for owner confirmation.
4. **Prepare TECH_CARD** — when the owner asks for the card, copy [`docs/reference/templates/TECH_CARD_TEMPLATE.md`](../../../docs/reference/templates/TECH_CARD_TEMPLATE.md) to `docs/TECH_CARD.md`. Leave values empty unless the owner supplies them. Set Decision state only to `Candidate` or `Proposed` until the owner approves. Never copy a template example into the value column.
5. **Confirm key decisions** — ask the owner to confirm size, every stack or service value, hosting, security-sensitive choices, and adaptive limits. Credentials are requested only when an approved value needs them. Never invent them.
6. **Design architecture** — after the relevant TECH_CARD values are `Approved`, choose the folder layout for the confirmed size, apply [the architecture rule](../../../.cursor/rules/01-architecture.mdc), and document it in `docs/01-ARCHITECTURE.md`. Mark that document as a draft until the owner approves it.
7. **Request approval** — ask the owner to approve Phase A explicitly. Record only what the owner approved.

Phase A may write draft planning documents. It does not scaffold an application, add dependencies, create schemas, or enable CI.

## Phase B — Application Initialization

Do not enter this phase as part of ordinary onboarding.

Start only when all of these are true:

- The owner gives a separate, explicit authorization to initialize the application.
- Phase A is complete, including owner approval of size, `docs/TECH_CARD.md`, and `docs/01-ARCHITECTURE.md`.
- Every value that initialization would use is `Approved`. Empty, `Candidate`, `Proposed`, and `Rejected` values are not usable.
- No material conflict is open under `AGENTS.md`.

Then scaffold only what the approved TECH_CARD and architecture specify, with the approved package manager and framework. Keep `.env.example` free of secrets. Do not add a provider key that the card does not name as `Approved`.

## Phase C — CI, Deployment, and Release

Do not enter this phase from Phase A or Phase B automatically.

Start only when the owner gives a separate, explicit authorization for CI, deployment, or release, and the prerequisite for that action exists:

- CI and quality hooks follow [CI/CD rules](../../../.cursor/rules/17-cicd.mdc) and may use the [quality CI example](../../../docs/reference/workflows/ci-quality.yml.example) only as an example, after the approved card names the tools.
- Deployment environment variables, migrations, and monitoring follow the approved card and [ops and reliability rules](../../../.cursor/rules/14-ops.mdc).
- Production deployment and production migration still require their own explicit authorization.

Delivery sequencing may be written as a plan during Phase A in `docs/PROGRESS.md`. Writing that plan is not Phase C and does not authorize CI or release. Use the [project quality checklist](../../../docs/reference/Check/Quality/project-quality-checklist.md) when a later approved milestone asks for it.

## Stop conditions

Stop and report the missing approval before any file is created when:

- A mandatory BRIEF question is still unresolved, including profile model, interface languages, or any other undecided item that the card would otherwise treat as chosen.
- Size, TECH_CARD, or architecture lacks owner approval.
- A template, reference, example, or conversation preference would be written as `Approved`.
- The next action is scaffolding, dependency installation, schema creation, CI, deployment, or release, and the phase authorization above is missing.
- Sources conflict and `AGENTS.md` does not resolve them.

Conversation history, including any identity preferences, is context only. Do not record it in `docs/TECH_CARD.md` or `docs/01-ARCHITECTURE.md` unless the owner explicitly asks to record that decision.

## Verification

State which phase was entered. Phase A is complete only when size, TECH_CARD, and architecture are recorded at the approval level the owner actually gave. Do not report Phase B or Phase C as done unless that phase's authorization and checks were actually performed.

## Output

```text
Phase entered
Phase stopped before
Confirmed decisions
Unapproved or empty values
Documents created or updated
Validation
Next phase and the approval it still needs
```

## References

- Project-size criteria and proposal format: [`references/project-sizing.md`](references/project-sizing.md).
- Detailed layouts and constraints: [`references/project-sizes/`](references/project-sizes/).
- Long document templates: [`docs/reference/templates/`](../../../docs/reference/templates/).
- Permanent engineering standards remain in [`.cursor/rules/`](../../../.cursor/rules/) and apply throughout the workflow.
