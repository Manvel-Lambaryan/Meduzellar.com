# Meduzellar Pre-Launch Phase A approval record

**Record** PL-A-2026-11-26 · **State** Approved for local implementation and amended for official repository integration

The owner's “Official Owner Approval & Staff+ Full-Stack Implementation Directive” approves the standalone project and named technical direction. It authorizes local and sandbox Phase B once applicable Phase A gates are satisfied. The direction of the architecture is approved. The specific charter, brief, architecture and remaining local TECH_CARD choices still require sign-off against the revisions below. [Module charter](phase-a/AGENTS.md#decision-authority) · [Phase A and Phase B checklists](phase-a/docs/PROGRESS.md#phase-a-owner-review-checklist)

Target is `D:/meduzellar-pre-launch`. The working plan is the 15-file snapshot under `docs/pre-launch/phase-a/`. Its files were untracked at verification, so raw SHA-256 hashes identify the exact revisions. The image is the design reference. The pasted directive is the authorization source.

| Input | SHA-256 |
| --- | --- |
| Owner directive | `A882DFCF79144D6ACF4D4AB23FD14EA579082155DCDA4C7A97C703970B9E385E` |
| Meduzellar Technology Ecosystem Coming Soon.png | `49F77C363B77F1B4C52405BEC87CAE67E286C4B75FB75715E4C7D6BC3CD5B693` |

## TECH_CARD authority mapping

A mixed row has only the approvals named in the middle column. The source TECH_CARD remains the frozen planning revision. This record supplies the subsequent decision status. [TECH_CARD source](phase-a/docs/TECH_CARD.md)

| Decision | Owner-approved local direction | Open or release-only values |
| --- | --- | --- |
| PL-D01 | Option C, standalone path, Size A, isolated modular monolith direction, independent governance and deployment lifecycle. | Detailed implementation architecture and approved snapshot. |
| PL-D02 | Node.js 24 and strict TypeScript. | npm, lint/format tooling and version-pinning procedure. |
| PL-D03 | Next.js 16 App Router and REST Route Handlers. | Exact supported React pairing and dependency pins. |
| PL-D04 | CSS Modules, CSS properties, centralized tokens and Zod. | Use compatible pinned dependency versions. |
| PL-D05 | Reference-led layered assets, reference extraction where feasible, CSS or optimized independent assets, reduced motion. | Source art quality and rights review before public use. WebGL requires a separate justified dependency decision. |
| PL-D06 | PostgreSQL and Prisma 7. Neon is the proposed production provider named in the directive. | Local PostgreSQL major, driver/adapter and exact pins. Neon provisioning, environment and region are pending. |
| PL-D07 | Resend integration and safe local or sandbox mail transport. | Sender setup, provider account, actual sandbox keys, quotas and production spend pending. |
| PL-D08 | PostgreSQL transactional outbox and local worker testing. | Local dispatch settings below. Production cron/provider settings pending. |
| PL-D09 | Clerk-based operator authentication, mandatory MFA and server-side authorization. | Local freshness limit and exercise method below. Actual Clerk sandbox credentials and production subscription pending. |
| PL-D10 | Server-side validation, rate and request limits, bot protection, CORS/CSRF, CSP, signing and PII-safe logs. | Turnstile and numerical local limits below. Production abuse tuning pending. |
| PL-D11 | Vitest, Playwright and real DB/browser testing. | Exact pins and accessibility test integration. |
| PL-D12 | Vercel-compatible deployment architecture. | Paid tier, environment, region, CI activation, deployment and release pending. |
| PL-D13 | PII-safe logging and development verification. | Production monitoring, alert routing and retention pending. |

## Local decisions for sign-off

Accept the exact snapshot below as the charter, scope, layout and technical contracts **for local and sandbox implementation**. The following choices are proposed for that same scope.

- **Tooling** npm with a lockfile, ESLint with the Next.js preset, Prettier, compatible React and React DOM peers, TypeScript and Node types, Prisma Client and adapter-pg with pg and its types, the Clerk Next.js SDK, Resend SDK, Vitest, Playwright and axe-core for browser accessibility. Authorize selection of exact maintained releases within the approved majors and peer constraints, with security review and exact pins recorded before dependencies are installed. Published release candidates for local validation are Node.js 24.22.3, Next.js 16.4.6, Prisma 7.8.0 and PostgreSQL 17.12. The full registry and peer-resolution check remains pending. [Node.js release](https://nodejs.org/en/download/archive/v24.22.3) · [Next.js release](https://github.com/vercel/next.js/releases/tag/v16.4.6) · [Prisma release](https://github.com/prisma/orm/releases/tag/7.8.0) · [PostgreSQL release](https://www.postgresql.org/docs/17/release-17-12.html)
- **Local services** dedicated PostgreSQL 17 database, direct local migrations, process-invoked dispatcher and restricted local mail capture or provider test transport. Use only synthetic subscribers and explicitly allowed test destinations. Test Clerk permission checks with signed fixtures and separately verify actual MFA in an existing authorized Clerk sandbox when credentials are supplied. No test identity can grant access outside test execution.
- **Frontend and consent** English, affirmative consent for a single official-launch announcement, canonical email normalization and development-only privacy/retention policy from the snapshot. Use a nonpublic local origin. Production identity, legal text, domains and profiles remain pending. [Brief](phase-a/docs/BRIEF.md) · [Data and API](phase-a/docs/WAITLIST.md) · [Privacy](phase-a/docs/SECURITY_PRIVACY.md)
- **Local settings** use Turnstile Siteverify with official test credentials in local browser tests, database abuse limits and the Phase A numerical candidates for tokens, retry, MFA freshness, request sizes, scheduling, throughput and retention. Keep unspecified limits configurable, bounded and exercised with synthetic test data. The production settings and final privacy policy remain pending. [TECH_CARD limits](phase-a/docs/TECH_CARD.md#values-for-explicit-owner-review) · [Abuse and auth](phase-a/docs/SECURITY_PRIVACY.md#threats-and-controls) · [Delivery](phase-a/docs/EMAIL_OPERATIONS.md#durable-worker)

> I approve Phase A record PL-A-2026-11-26 and the exact 15-file snapshot for local and sandbox implementation of Meduzellar Pre-Launch. I approve the local decisions in this record, including the named dependencies, exact-version selection rule and the documented local operating values. Apply my existing conditional Phase B authorization at D:/meduzellar-pre-launch. All outstanding ownership assignments, public privacy and legal decisions, regions, paid plans, production operations, release and live campaign sends remain pending.

Production-only ownership, controller details, DMARC/sender verification, domains and regions, budgets/overages, paid services, public release and live campaigns remain outside the local sign-off. No secrets are required to approve the record.

## Workspace preflight

`D:/meduzellar-pre-launch` did not exist at inspection and is outside the writable Platform workspace. After sign-off, open the standalone path as the active writable workspace or obtain approval for narrowly scoped writes there. The shell currently reports Node.js 22.22.2, and no PostgreSQL client or container engine was available through PATH. PowerShell blocks the npm script shim, while `npm.cmd` reports 10.9.7. The default shell request to the npm registry was denied. Installing or selecting compatible runtimes, registry access and any local database provisioning must be validated before a working build can be claimed.

## Exact Phase A snapshot

Paths are relative to `docs/pre-launch/phase-a/`. Hashes cover file bytes.

| Path | SHA-256 |
| --- | --- |
| `AGENTS.md` | `54979034ACD9FE54B48557A435B65DAC36334A2CA3AB2F0741D6C8D5C330900F` |
| `README.md` | `DF62216BA77160AC549297D68C2151FA82969ACCCC59BD325B7656E46AA34682` |
| `docs/01-ARCHITECTURE.md` | `048D12452EF9A2FCE69AFDD620EC21640A9C6C13B044F3F776B7FDCA768AB8EE` |
| `docs/BRIEF.md` | `FB65BA364C2BDEFA1AC467525F581067E31288416A2AAFF2F05777E978E1EA18` |
| `docs/DEPLOYMENT_AND_COSTS.md` | `7E9F7E1F9373E5642FB234615884B06C7774FD3D27CE0403DB6A2542E8D2427F` |
| `docs/DESIGN.md` | `404FE88641C46CA36F6118CF03DD3D082B65A9A5C80D9F7FAC225BF8293DC341` |
| `docs/EMAIL_OPERATIONS.md` | `E1C4912CE8B09B95999E41D0028535DDBA3895A2E2A09DC481B8115274ACB58C` |
| `docs/PROGRESS.md` | `26A3C6C1E495F6816595532F6ACD456F5ED90716F8B4B444FA42953A88253F22` |
| `docs/SECURITY_PRIVACY.md` | `E248ABE790ADE5B7587EAFF3695F189299E6F36A5319B8E4C5425EB16FE5590C` |
| `docs/TECH_CARD.md` | `AF7A42F303FF96F068B76EAB9A4352B5B71857DD37546F4E1AE1D237ECFA9C99` |
| `docs/WAITLIST.md` | `47B12881C6B0B30D3CA72CABD968D172AE796E3515219CC7014881F1CC419987` |
| `docs/decisions/ADR-001-standalone-boundary.md` | `BD005292102D736D617DD2FDF5091D3EF2ACABDF36F720E746E96D8D586DAB23` |
| `docs/decisions/ADR-002-durable-delivery.md` | `5CED856F9DD1BBFB9650B2131714A40FEB9CD02ABB3545D6830A1C71A23244C4` |
| `docs/decisions/ADR-003-rendering-and-operator-trust.md` | `426E951B5EADE03D42F799E1FD0EEFC3756797D5AF069B398127DF129E59BD6C` |
| `docs/decisions/README.md` | `BD5F097442DD54212C068403ED52B180A12B8D1FFC6DA1E2B8C2552AF395D108` |

## Official repository integration amendment

The Product Owner approved the official GitHub repository `Manvel-Lambaryan/Meduzellar.com` as the source of truth for Pre-Launch, with `D:/Meduzellar.com/apps/pre-launch/` as its application directory. This supersedes the standalone source-control location in PL-D01 and ADR-001. The 15-file historical snapshot and its SHA-256 values remain intact. The approval adopts the existing audited stack and internal layout under a module-specific repository structure.

- **Phase A** Approves the destination, module-specific [TECH_CARD](../TECH_CARD.md) and [architecture](../01-ARCHITECTURE.md), and the existing audited application stack.
- **Phase B** Authorizes import of reviewed source including local visual and configuration changes, validation, an isolated integration branch from upstream `main`, commit, push and a pull request. The standalone source remains available for migration verification.
- **Phase C** Authorizes reconnection of the existing `meduzellar` Vercel project (`prj_1C4Ste2sLPOSUSUftglCb0iHbWa6`), root `apps/pre-launch`, production branch `main`, protected Preview validation and automatic production deployments after validation and applicable GitHub approvals. Preserve the current public alias and production deployment through Preview validation.

The amendment covers Pre-Launch only. Production waitlist provisioning, JSON storage and live campaigns remain outside this integration. Existing security controls and mandatory repository reviews apply.
