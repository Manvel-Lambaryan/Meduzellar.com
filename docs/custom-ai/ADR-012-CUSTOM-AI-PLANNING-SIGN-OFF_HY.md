# ADR-012 — Custom AI-ի պլանավորման հաստատում և բաց Platform launch հարց

**Կարգավիճակ՝ Accepted — Domain Planning Directions · Platform Launch Scope Pending։**

**Ամսաթիվ՝ 2026-11-25։ Որոշող՝ Product Owner։**

## Համատեքստ և ապացույց

Product Owner-ի «MEDUZELLAR — STAFF+ DOCUMENTATION EXECUTION / PROFESSIONAL NETWORK & CUSTOM AI» հանձնարարությունը բացահայտ հաստատում է նախկինում քննարկված դոմենային ուղղությունները և թույլատրում Phase A փաստաթղթավորումը։ Հաստատման աղբյուրներն են [Master Architecture v1.0-ի](MEDUZELLAR_CUSTOM_AI_MASTER_ARCHITECTURE_HY.md) §12.2 գրանցամատյանը և տրամադրված `MEDUZELLAR_CUSTOM_AI_DECISIONS_HY.md` ամփոփագիրը։ Պահպանվել են սկզբնաղբյուրների պատմական կարգավիճակները։

## Հաստատված ուղղություններ

| ID | Owner Approved պլանավորման շրջանակ |
| --- | --- |
| AI-DEC-001 | Professional ecosystem assistant՝ General/Developer օգնության ուղղությամբ։ |
| AI-DEC-002 | External models + սեփական orchestration։ Զրոյից foundation model training-ը դուրս է MVP-ից։ |
| AI-DEC-003 | Դոմենային text-first P0 և սահմանափակ file analysis։ Platform launch placement-ը բաց է։ |
| AI-DEC-004 | Հայերեն, անգլերեն և ռուսերեն՝ quality benchmark-ի ենթակա։ |
| AI-DEC-005 | Shared AI capability layer՝ անկախ AI Chat conversation-ից։ |
| AI-DEC-006 | Explicit actor/principal authorization և tenant scope՝ shared Identity contract-ով։ |
| AI-DEC-007 | Provider adapters և policy-aware routing։ Կոնկրետ մատակարար չընտրված։ |
| AI-DEC-008 | Durable runs և streaming, cancel/retry/history ուղղություն։ |
| AI-DEC-009 | Freemium + usage-based + B2B ուղղություն։ Գինը դեռ բաց է։ |
| AI-DEC-010 | Atomic budget admission և measured usage/reconciliation։ |
| AI-DEC-011 | Privacy-first և scoped retrieval։ |
| AI-DEC-012 | AI օգնություն, բիզնես որոշումները և փոփոխությունները՝ domain authority-ին։ |
| AI-DEC-013 | Modular monolith + isolated workers՝ shared topology review-ով։ |
| AI-DEC-014 | Explicit confirmation՝ P1 վերահսկվող write pilot-ի համար։ |
| AI-DEC-015 | Opt-in memory և training-ի համար առանձին թույլտվություն։ |
| AI-DEC-016 | Evidence-Driven Expansion՝ անվտանգության, որակի և ծախսի դարպասներով։ |

## Նյութական բաց որոշում և պայմաններ

[Platform Specification-ի](../PLATFORM_SPECIFICATION.md) §11/16/18 աշխատանքային scope-ը նախատեսում է սկզբում platform search assistant, իսկ Master §00/01-ի դոմենային P0-ը ներառում է General/Developer Chat և files։ Ընդունվում են դոմենային ուղղությունները։ **Platform launch placement-ը Pending է** մինչև Owner-ի հստակ որոշումը՝ լայն Chat-ը թողարկվում է առանձին, ավելի ուշ, թե մտնում է հաստատված ընդհանուր scope-ի մեջ։ Այս ADR-ը չի փոխում աշխատանքային բնութագիրը կամ մյուս դոմենների roadmap-ը։

P0-ում արտաքին model/tool տվյալների processing approval-ը, կոնկրետ providers, versions, quotas, tariff, retention/legal և գործառնական ծախսերը բաց են։ P1 read-only scoped retrieval, Office knowledge, opt-in memory, Messenger suggestions և low-risk confirmed write pilot-ը պահանջում են feature gates։ Confirmation-ը չի թույլատրում ինքնավար գնում, hiring/rejection, entitlement կամ moderation որոշում։ P2 agents, execution և private deployments-ը պահանջում են առանձին feasibility/approval։ [Alignment notes](GOVERNANCE_ALIGNMENT_NOTES_HY.md) · [Finalization](CUSTOM_AI_PRE_IMPLEMENTATION_FINALIZATION_HY.md)

## Հետևանքներ և ապացույց

Shared Identity/Payments/Storage/Notifications, AI Gateway ownership և Messenger metering boundary-ն Shared Platform Pending են։ Բաց են Armenian/English/Russian quality-ն, provider terms/regions/cost, privacy/legal, sandbox billing, stream/revoke, secure extraction, threat/load/restore և operational ownership evidence-ը։ Marketplace, Network և Messenger core workflow-ները շարունակում են գործել AI outage-ի ընթացքում։ [Shared Platform handoff](CUSTOM_AI_SHARED_PLATFORM_DEPENDENCY_HANDOFF_HY.md)

[Security invariants-ը](../../AGENTS.md#security-invariants) և [Security rule-ը](../../.cursor/rules/08-security.mdc) պարտադիր են՝ CORS/CSRF, server-side auth, secrets protection, parameterized queries և չլուծված Critical dependency vulnerability-ի դեպքում աշխատանքի կանգ։

**Platform Phase A՝ Open։ Phase B՝ NOT AUTHORIZED։** Initialization-ը սպասում է հաստատված platform scope/size, TECH_CARD և 01-ARCHITECTURE, shared ownership ու Owner-ի առանձին թույլտվության։ Production release-ը առանձին gate է։ [Project onboarding](../../.agents/skills/project-onboarding/SKILL.md)
