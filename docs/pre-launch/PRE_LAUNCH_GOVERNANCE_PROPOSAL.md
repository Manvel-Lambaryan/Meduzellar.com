# Meduzellar Pre-Launch Module Governance Proposal

- **Status** Option C approved by owner · Module Phase A sign-off pending
- **Date** 2026-11-26
- **Decision owner** Meduzellar Product Owner

## Context and authority

The owner directive authorizes planning and documentation subject to existing repository governance. The proposed module is a temporary public Coming Soon page and verified email waitlist, including unsubscribe, delivery tracking, and administrator-authorized launch announcements. The main Meduzellar Platform remains in Concept & Planning. Marketplace, Professional Network, Custom Telegram, Custom AI, and the Platform's authentication, database schema, and infrastructure are outside the module boundary. [Platform status](../../README.md#9-development-status) · [Working brief](../BRIEF.md)

`AGENTS.md` states, “Do not start application code, schema, or vendor setup while size, stack, and architecture are still unapproved.” The architecture rule adds, “Do not scaffold `src/`, `apps/`, or `packages/` before `docs/TECH_CARD.md` records one.” These are repository governance requirements. The existing onboarding workflow requires approved size, stack, and architecture, followed by separate authorization to initialize. The owner directive expressly preserves these controls. Placing an app or nested instruction file at a different path inside the Platform repository would still leave it subject to the parent rules. The existing TECH_CARD template and domain planning sign-offs provide planning context only. [Repository guidance](../../AGENTS.md#before-substantial-work) · [Architecture rule](../../.cursor/rules/01-architecture.mdc) · [Project onboarding](../../.agents/skills/project-onboarding/SKILL.md#phase-b--application-initialization) · [Domain planning sign-off](../custom-ai/ADR-012-CUSTOM-AI-PLANNING-SIGN-OFF_HY.md)

The Platform repository currently has one root `AGENTS.md` and a configuration-validation package. It has no approved Platform TECH_CARD, Platform architecture document, or application workspace. The unresolved decision is where the new module can acquire its own governing authority and approvals while preserving the Platform's gates. [Documentation map](../README.md) · [Package manifest](../../package.json)

## Repository options

| Option | Practical consequences | Governance action required |
| --- | --- | --- |
| **A. Application in the Platform repository** | One checkout and shared review history. Runtime deployments could be independent, while CI, repository access, ownership, and eventual removal would remain coupled. | Explicit owner approval for a module-scoped governance amendment that recognizes module decision documents, identifies the allowed path and approver, and defines a separate initialization and release process. The root governance and architecture rule would need to agree. Security invariants would continue to apply. |
| **B. Separately governed application workspace** | A workspace with independent source control outside the Platform tree can establish its own instructions. A nested workspace or package inherits the parent restrictions. Without a dedicated repository and remote, review history, access control, and release ownership are harder to enforce across collaborators. | Authorize an explicit external workspace, its source of truth, and its governance owner. A workspace inside the Platform repository needs the same parent governance amendment as A. |
| **C. Dedicated standalone repository** | A separate source of truth, access boundary, release history, and deployment lifecycle support independent operation and eventual retirement. It adds one repository and requires explicit handoff of shared brand assets and domain ownership. | Approve the repository boundary and authorize a separate governance charter. The Platform's repository rules remain in force within its own tree. |

## Proposed decision

Choose **C**. Place the implementation in a dedicated Meduzellar-owned repository outside `D:/Meduzellar.com`, with a separate working tree and repository access. Use `docs/pre-launch/` in the Platform repository for this decision record. After the boundary is approved, keep the canonical module development documents with the module. Record the approved boundary in this proposal through an explicit owner instruction. Creating a repository or remote would be a distinct action with its own explicit authorization.

Propose **Size A (Small)** and an **isolated modular monolith** for the module. The single public experience, one waitlist data owner, and one operator workflow fit a small project. Transactional email jobs and launch campaigns require durable processing and explicit authorization even at low subscriber counts. Independent deployability is a boundary requirement. The exact scheduler, runtime, and deploy topology are Phase A decisions. The timeline depends on source assets, operational ownership, and approval of the email and hosting arrangements. [Sizing criteria](../../.agents/skills/project-onboarding/references/project-sizing.md)

The proposed charter should establish the following module-specific rules.

- Name the approver, technical owner, and production operator. Bind scope to the Coming Soon page, waitlist, and their lifecycle. Record scope, approved size, stack, and architecture in the module's own documents.
- Require explicit Phase A sign-off and separate Phase B authorization. Authorize CI activation, production deployment, production migrations, and public release through their applicable later gates. Require explicit administrator authorization for every live launch campaign.
- Carry forward the existing security invariants and mandatory controls, including secrets protection, server-side validation and authorization, secure password hashing if passwords are stored, parameterized queries, PII-safe errors and logs, and required CORS and CSRF controls. Define consent, deletion, retention, and incident ownership for the module's subscriber data. [Security invariants](../../AGENTS.md#security-invariants) · [Security rule](../../.cursor/rules/08-security.mdc)
- Use independently scoped subscriber storage, identities, credentials, worker access, and deployment configuration. Keep administrator access independent of the main Platform. Assign ownership of any approved public DNS and sender-domain references. Treat an eventual subscriber transfer as a separate owner decision based on the disclosed consent and purpose. Define how jobs, access, DNS, and retained data are retired when the module closes.

## Phase A documentation after the boundary decision

These are proposed module deliverables. The current decision record is the only document delivered at this gate.

| Document | Scope |
| --- | --- |
| `AGENTS.md` and `docs/BRIEF.md` | Module governance, product requirements, ownership, scope, and success criteria. |
| `docs/TECH_CARD.md` | Size, stack decision matrix, dependencies, vendor and runtime compatibility, and candidate versus approved values. |
| `docs/01-ARCHITECTURE.md` | Frontend and backend boundaries, isolated deployment, scheduler and worker execution, and transition and decommissioning strategy. |
| `docs/DESIGN.md` | Design system, responsive compositions, accessibility, motion, performance, and source asset inventory. |
| `docs/WAITLIST.md` | Data model, API contracts, verification, unsubscribe, consent, abuse controls, administrative authorization, privacy and retention. |
| `docs/EMAIL_OPERATIONS.md` | Durable jobs, campaign authorization, idempotency, retries, bounce and complaint suppression, signed webhook handling, and delivery tracking. |
| `docs/DEPLOYMENT_AND_COSTS.md` | Deployment and monitoring, sender and DNS ownership, and verified cost scenarios for 100, 1,000, 10,000, and 50,000 subscribers. |
| `docs/PROGRESS.md` and proposed ADRs | Roadmap, testing and acceptance criteria, Phase A checklist, Phase B checklist, and significant decisions. |

The supplied image establishes the visual direction. The Platform repository's Marketplace image is a separate jellyfish mark. Exact MR geometry requires the original wordmark and monogram or an owner-approved reconstruction. CSS or SVG can cover interface elements and simple orbital treatments. The cinematic mascot and scene need independent high-resolution raster assets for a static or lightly animated implementation. Rigged tentacle motion or interactive 3D requires an appropriate model or a separately approved asset-creation plan. Confirm brand and asset usage before publication. [Marketplace image](../marketplace/photo_2026-11-26_12-36-57.jpg)

## Owner decisions

### Option C approval wording, now granted

> I approve Option C, a dedicated standalone repository for the Meduzellar Pre-Launch Module. I authorize module-specific governance and Phase A planning for the Coming Soon page and email waitlist only. This approval leaves the main Meduzellar Platform in Concept & Planning and grants no application initialization, infrastructure provisioning, or release authorization.

Record repository ownership and the destination before moving canonical documentation. If repository creation is desired as a separate action, authorize the exact organization, repository name, and visibility.

### Initial Phase A sign-off wording

> I approve Phase A for the Meduzellar Pre-Launch Module only. I approve the module scope and ownership, Size A, the Approved entries in the module TECH_CARD, and the module architecture at [document revisions]. The main Meduzellar Platform retains its existing phase and governance.

### Initial Phase B authorization wording

> I separately authorize Phase B application initialization for the Meduzellar Pre-Launch Module only in [repository URL]. Initialize the application within the approved module scope using the Approved entries in [TECH_CARD revision] and [architecture revision]. This authorization excludes the main Meduzellar Platform, production provisioning, production migrations, public release, and live campaign sending.

**Approval recorded** The owner approved Option C, the repository name meduzellar-pre-launch, Size A, the isolated modular monolith direction, independent governance and deployment, and Phase A planning. The module charter and technical plan are presented for review in the [Phase A package](phase-a/README.md). The [current approval statements](phase-a/docs/PROGRESS.md#phase-a-owner-review-checklist) supersede the initial wording above. Module Phase A sign-off and Phase B initialization remain pending.
