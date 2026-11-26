# Implementation roadmap and approval gates

**Status** Phase A package ready for review · Phase A sign-off and Phase B authorization pending

## Implementation roadmap

| Step | Work and dependencies | Exit evidence |
| --- | --- | --- |
| 0 · Planning | Confirm local/repository destination, ownership, approved revisions, sources, contracts and limits. | Explicit Phase A sign-off and separately issued Phase B permission. |
| 1 · Foundation | Initialize standalone app with approved versions and layout. Establish environment validation, local fixtures, tests and secrets policy. | Reproducible build, lint/typecheck, dependency audit, no production data or credentials. External CI enablement subject to separate authorization. |
| 2 · Asset and frontend | Acquire or commission layers, build static semantic hero and responsive UI, integrate validation states. Asset production may proceed separately once rights and work are authorized. | Approval of art rights and MR geometry, responsive screenshot suite, accessibility and performance review. |
| 3 · Waitlist | Implement reviewed schema, transactions, token and consent lifecycle, abuse admission and request contracts. | Local migration and restore validation, integration for state transitions and races, privacy tests. |
| 4 · Worker and verification | Implement outbox processor, stable mail requests, event ingestion, reconciliation, verification/confirmation and unsubscribe. | Sandbox end-to-end, interruption and retry tests, signed events and provider contract evidence. |
| 5 · Operator and campaign | Add grants and fresh MFA, immutable revisions, preview/test, approval, queued materialization, dashboard and pause/cancel. | Authorization matrix, load and recovery checks, no unauthorized or duplicate live send in test. |
| 6 · Release readiness | Validate cost and throughput, deployment plan, DNS/sender authenticity, incident drill, documented recovery and privacy notice. | Staging evidence and owner go/no-go for each production action. |
| 7 · Operate and retire | Run only the independently approved launch announcement. Reconcile, cut over, maintain opt-out and retire data under policy. | Campaign audit, approved transition and closure evidence. |

Planning assumption is one implementer plus owner and specialist review. Steps 1–6 are tentatively a 4–6 engineering-week effort after approvals and asset availability. Art commissioning, security review, vendor onboarding and DNS can move the date.

## Verification strategy

| Layer | Coverage |
| --- | --- |
| Unit | Email/domain normalization, digest generations, expiry, role and MFA rules, consent policy, rate windows, status precedence, retry cutoff, ceiling validation and quota math. |
| PostgreSQL integration | Concurrent duplicate subscribe and token use, unsubscribe during approval and send authorization, epoch boundary, uniqueness and constraint failures, heartbeat and expired lease with stale writer, atomic outbox and cancellation, deletion and restore reconciliation. Run against the approved PostgreSQL major. |
| Contract and delivery | Content type/limits, CSRF, origin, challenge, enumeration-safe generic results, signed duplicate/late webhook, timeout after provider acceptance, 429 handling, stable request identity, 24-hour boundary, suppression and unsupported event quarantine. Use fake transport in CI, provider test mail in sandbox. |
| Browser and visual | Chromium, Firefox, WebKit and representative physical mobile. Registration states, successful verification, scanner GET, expired token, browser and one-click unsubscribe, admin test/approve/pause, 320–1920 CSS px screenshots, keyboard/assistive tech, reduced motion, fallback art and no-JS recovery. |
| Load and operations | Measure 100/1k/10k/50k synthetic cohorts, concurrent burst signup and campaign, DB connections/locks, cron budget, p95 queue age, lease recovery, throttling, unknown outcomes and restore. Regression thresholds from measurements and approved limits. No real bulk mail in automated tests. |
| Security and privacy | Verify least privilege, role revocation, mandatory MFA, grants, CSP and origin controls, redacted logs/secrets, dependency audit, consent notice, verified deletion and removal persistence on restore. |
| Performance | Collect lab LCP/CLS, interaction latency proxy and mobile asset sizes under throttling. Set up approved field metrics and compare against p75 targets when sample size permits. Capture screenshots and diagnostics from real rendered pages. |

## Phase A owner review checklist

- [x] Owner approved standalone boundary and name, Size A, isolated modular monolith direction and independent governance/deployment.
- [x] Draft charter, brief, design, technology matrix, architecture, data/API, email operations, security/privacy, costs, roadmap and ADRs are available.
- [ ] Confirm owner/maintainer/operator roles, ownership of standalone repository and authorized destination for the documentation.
- [ ] Approve scope, consent/locale, canonical and sender domains, approved regions, privacy controller/contact, retention and deletion policy, and privacy review ownership.
- [ ] Approve TECH_CARD values, version pins, provider and capacity choices, spend, retry/limits, purpose, data and recovery responsibilities. Confirm any planned validation of vendor entitlements.
- [ ] Approve the design direction and intended asset acquisition path. Receive source rights and production asset approval before publishing them.
- [ ] Record explicit Phase A sign-off naming the accepted revisions and decisions.

> I approve Phase A for Meduzellar Pre-Launch only. I approve the standalone module charter, brief, architecture, scope and operating decisions at [document revisions]. I approve the TECH_CARD decision IDs and exact values in [signed decision list or revision], including the corresponding limits, spend, privacy and ownership decisions listed there. The main Meduzellar Platform remains in Concept & Planning. This approval grants no Phase B, production, release, or live campaign authority.

## Phase B authorization checklist

- [ ] Approved Phase A record and technology versions are available in the standalone repo.
- [ ] Repository URL or local working tree, intended permissions and initial implementation environment are confirmed.
- [ ] Material technical/governance conflicts are resolved and all values needed for initialization are approved.
- [ ] Owner issues separate written Phase B authorization, with any permitted application scope and local/sandbox environments.
- [ ] CI activation, live infrastructure, production migration, public release and real campaign send approvals are tracked under their own gates.

> I separately authorize Phase B application initialization and implementation for Meduzellar Pre-Launch only in [standalone repository URL or approved local path]. Implement the approved Coming Soon and waitlist scope using [charter, TECH_CARD and architecture revisions]. Application setup, approved dependencies and local/sandbox migrations and tests are authorized within [listed environments]. This authorization excludes main Platform changes, production provisioning and migrations, public deployment or release, and live campaign sending.

See [TECH_CARD decisions](TECH_CARD.md) and [operating prerequisites](DEPLOYMENT_AND_COSTS.md). Planning validation covers document paths, governance boundaries and cost arithmetic. Implementation and staging evidence will be collected in their authorized phases.
