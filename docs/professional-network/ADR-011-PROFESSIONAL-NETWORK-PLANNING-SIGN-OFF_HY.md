# ADR-011 — Professional Network-ի դոմենային պլանավորման հաստատում

**Կարգավիճակ՝ Accepted — Domain Planning։**

**Ամսաթիվ՝ 2026-11-25։ Որոշող՝ Product Owner։**

## Համատեքստ և ապացույց

Product Owner-ի «MEDUZELLAR — STAFF+ DOCUMENTATION EXECUTION / PROFESSIONAL NETWORK & CUSTOM AI» հանձնարարությունը բացահայտ հաստատում է նախկինում քննարկված դոմենային պլանավորման ուղղությունները և թույլատրում է դրանց Phase A փաստաթղթավորումը։ Հաստատված ուղղությունների հիմքն են [Master Architecture v1.0-ի](MEDUZELLAR_PROFESSIONAL_NETWORK_MASTER_ARCHITECTURE_HY.md) Մաս III-ի PN-DEC գրանցամատյանը և առանձին տրամադրված `MEDUZELLAR_PROFESSIONAL_NETWORK_DECISIONS_HY.md` ամփոփագիրը։ Սկզբնաղբյուրների պատմական կարգավիճակը պահպանված է։

## Հաստատված ուղղություններ

| ID | Owner Approved պլանավորման շրջանակ |
| --- | --- |
| PN-DEC-001 | Professional Network՝ project evidence-ով և recruitment pipeline-ով։ |
| PN-DEC-002 | Developers, freelancers և Offices, Armenia-first validation։ |
| PN-DEC-003 | Unified identity և լիազորված Office context-ի ուղղություն։ Shared mapping-ը սպասում է հաստատման։ |
| PN-DEC-004 | Profile, Portfolio և private-by-default CV։ |
| PN-DEC-005 | Ընտրովի, թույլատրված GitHub կապ և manual fallback։ |
| PN-DEC-006 | Provenance՝ self-declared և observed claims-ի տարանջատմամբ։ Automated skill certification-ը դուրս է։ |
| PN-DEC-007 | Job publication/discovery՝ verified employer և review քաղաքականությամբ։ |
| PN-DEC-008 | Application pipeline, versioned stage/history և առանձին interview/contact consent։ |
| PN-DEC-009 | P1 professional feed, following և connections՝ evidence gates-ով։ |
| PN-DEC-010 | P1 AI-assisted matching/CV օգնություն, human hiring որոշում։ |
| PN-DEC-011 | B2B-first monetization hypothesis՝ employer tools-ի համար։ |
| PN-DEC-012 | Privacy-first, no pay-to-apply և free core safety։ |
| PN-DEC-013 | Manual core workflow և optional shared integrations։ |
| PN-DEC-014 | Modular monolith + workers ուղղություն՝ shared topology review-ով։ |
| PN-DEC-015 | PostgreSQL search-first planning ուղղություն՝ տվյալների շերտի հաստատման և benchmark-ի ենթակա։ |
| PN-DEC-016 | P0 B և երկարաժամկետ դոմենային C planning horizons։ Native Git hosting-ը հետաձգված թեկնածու է՝ առանձին թույլտվությամբ։ |

## Պայմաններ և մնացած դարպասներ

Approval-ը հաստատում է P0/P1/P2 ուղղությունը։ [Finalization-ի](PROFESSIONAL_NETWORK_PRE_IMPLEMENTATION_FINALIZATION_HY.md) CV access, stage transition, idempotency, revoke և event մանրամասները Architect Proposed են։ GitHub ընտրության scopes/terms-ը, employer verification policy-ն, retention/legal կանոնները, AI fairness և recruitment billing-ը պայմանական են։ User/Office mapping-ը, cross-profession contacts-ը և job Channel scope-ը Shared Platform Pending են։ Դրանք գրանցված են [Governance Alignment Notes-ում](GOVERNANCE_ALIGNMENT_NOTES_HY.md), և այս ADR-ը դրանցով չի ընդլայնում հաստատված scope-ը։

Մնացած ապացույցներն են GitHub public-only API փորձարկումը, CV isolation/cutoff-ը, demand և pricing validation-ը, load/security/restore, AI fairness և human oversight փորձարկումները։ Marketplace ADR-009-ի և Custom Telegram ADR-010-ի հաստատված scope-երին պարտադիր հակասություն չի հայտնաբերվել։ Ownership-ի բաց հարցերը փոխանցված են [Shared Platform handoff-ին](PROFESSIONAL_NETWORK_SHARED_PLATFORM_DEPENDENCY_HANDOFF_HY.md)։

[AGENTS.md-ի security invariants-ը](../../AGENTS.md#security-invariants) պարտադիր են՝ CORS/CSRF, server-side auth, parameterized queries և secrets/redaction պահանջներով։ Չլուծված Critical dependency vulnerability-ն կանգնեցնում է ազդված աշխատանքը։ [Security rule](../../.cursor/rules/08-security.mdc)

**Domain Planning՝ Accepted։ Platform Phase A՝ Open։ Phase B՝ NOT AUTHORIZED։** Initialization-ը դեռ պահանջում է Shared Platform scope/size, հաստատված TECH_CARD/01-ARCHITECTURE և առանձին Owner authorization։ Paid կամ public release-ը ունի իր gate-երը։ [Project onboarding](../../.agents/skills/project-onboarding/SKILL.md)
