# Meduzellar Pre-Launch technology card

**Status** Approved for the Pre-Launch module under the owner amendment to PL-A-2026-11-26.

| Area | Approved scope |
| --- | --- |
| Source and layout | `Manvel-Lambaryan/Meduzellar.com`, `apps/pre-launch/`. Independent application within the repository, with the existing Size A internal layout and module-local dependencies. |
| Runtime and tooling | Node.js 24, strict TypeScript, npm and the module's committed lockfile. The module manifest and lockfile record the audited pins. |
| Web and API | Next.js 16 App Router, React, CSS Modules, Zod and the existing REST route handlers. |
| Data and delivery | PostgreSQL 17, Prisma 7 with pg, transactional outbox, existing Resend and Clerk integrations. Approved for local and sandbox validation under the original record. Production providers and activation retain their separate approvals. |
| Validation | ESLint, TypeScript, Vitest, Playwright, axe-core and dependency audit. |
| Hosting | Existing `meduzellar` Vercel project for this module only, with Node 24, Next.js, `apps/pre-launch` as Root Directory and `main` as the production branch. Preview validation precedes production deployment. |

The wider Platform remains in Concept & Planning. This card records approvals for the Pre-Launch module only. See the [owner approval record](pre-launch/PRE_LAUNCH_PHASE_A_APPROVAL_RECORD.md) and [architecture](01-ARCHITECTURE.md).
