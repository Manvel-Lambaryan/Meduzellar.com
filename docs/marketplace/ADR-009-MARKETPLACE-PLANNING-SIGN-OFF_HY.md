# ADR-009 — Marketplace-ի Phase A պլանավորման հաստատում

**Կարգավիճակ՝ Accepted — Marketplace domain planning**  
**Ամսաթիվ՝ 2026-11-25**  
**Որոշող՝ Product Owner**  
**Հաստատման աղբյուր՝** Product Owner-ի «MEDUZELLAR — MARKETPLACE OWNER APPROVAL & DOMAIN PLANNING SIGN-OFF» հանձնարարությունը։

## Համատեքստ և լիազորություն

Հաստատումը վերաբերում է Marketplace-ի ռազմավարական ճարտարապետությանը և Pre-Implementation Finalization-ի ուղղությանը։ Աղբյուր փաստաթղթերի կարգավիճակները պահպանվում են որպես իրենց կազմման պահի գրառումներ։ Այս ADR-ը գրանցում է Product Owner-ի հետագա որոշումը։ Գործում են repository-ի [որոշումների առաջնահերթությունը](../../AGENTS.md#decision-precedence) և [Phase A/Phase B workflow-ը](../../.agents/skills/project-onboarding/SKILL.md)։

## Հաստատված Marketplace որոշումներ

| Թեմա | Հաստատված պլանավորման սահման |
| --- | --- |
| Ռազմավարություն | Evolution-Ready Marketplace, Trust + Developer Productivity, Selected Categories + Hybrid Typed Catalog, Full Evolutionary Product Lifecycle և Evidence-Driven Expansion՝ Master Architecture v1.1-ի ռազմավարական շրջանակով։ |
| MVP և փուլավորում | Pre-Implementation Finalization-ի §2–3-ի P0/P1/P2 սահմանը։ Մեկնարկային կատեգորիաներն են **Frontend/UI**, **Backend Modules** և **Developer Tools**։ Verified reviews-ը տեղափոխվում է **P1**։ AT-11-ի support authorization-ի մասը մնում է P0-ում։ |
| Seller admission և արտադրանքի ստուգում | Սկզբնական invite-only pilot, այնուհետև Controlled Open Admission՝ վավերացված review/support capacity-ով և abuse controls-ով։ Product verification-ը ռիսկահեն է և կապված է ներկայացված անփոփոխ release-ի հետ։ |
| Seller, Buyer և commerce | Միասնական Seller/Buyer domain architecture՝ անձնական և լիազորված Office context-ների համար։ Մեկ seller, մեկ offer line և մեկ հաստատվող գործարքային արժույթ՝ checkout-ից մինչև fulfillment, Library, support և reconciliation։ Office access-ը ենթակա է shared Identity/Organization պայմանագրին։ |
| Customer entitlements | Order-line terms-ին կապված անկախ իրավունքներ usage, download, update և support փուլերում։ Seller suspension-ը կամ support-ի ավարտը ինքնաբերաբար չեն վերացնում անկախ usage entitlement-ը։ Refund/dispute-ի ազդեցության և վտանգավոր artifact-ի հանձնման կանոնները կիրառվում են համապատասխան քաղաքականությամբ։ |
| Չափ | **Marketplace MVP delivery scope B — Approved**։ **Platform Size C — Recommendation**՝ համահարթակային վերանայման համար։ Երկուսն էլ վերաբերում են նույն Platform Architecture-ի տարբեր հորիզոններին։ |

## Պայմանական ուղղություններ և բաց որոշումներ

**PA-01–PA-12-ի կարգավիճակ՝ Marketplace planning direction approved, subject to shared decisions and documented validation։** Ստորև բերված պայմանների փակումը պահանջվում է համապատասխան initialization, feature կամ release դարպասից առաջ։

| Ուղղություն | Պահպանվող ուղղություն և բաց պայման |
| --- | --- |
| PA-01, PA-11 | Հաստատված MVP և փուլային seller admission։ Արձանագրել կոնկրետ artifact allowlist-ը և սահմանաչափերը, review/support հզորությունը, պատասխանատուներին, pilot-ի շեմերը և Controlled Open Admission-ին անցնելու չափանիշները։ |
| PA-02, PA-03, PA-04 | Marketplace actor/principal և resource-level authorization, versioned contracts, opt-in channel և B delivery scope։ Shared Platform review-ը դեռ որոշում է Identity/Organization, channel quota, DB, infrastructure, topology և stack-ը։ Platform C-ն այդ review-ի առաջարկ է։ |
| PA-05, PA-06 | Մեկ ակտիվ PaymentAttempt, idempotency, durable webhook inbox և reconciliation։ Provider sandbox-ով հաստատել timeout, կրկնվող/անհերթ event և երկրորդ capture դեպքերը։ Մեկ capture-ի կրկնությունը չի կրկնապատկում ֆինանսական ազդեցությունը։ Իրական երկրորդ capture-ը հաշվառվում և համադրվում է առանց երկրորդ grant-ի։ |
| PA-07, PA-08, PA-09 | Անկախ grants, immutable artifact, quarantine և digest-bound review։ Լիցենզիայի, partial refund/dispute, seller exit և replacement release-ի պայմանները սպասում են իրավական կամ պայմանագրային review-ի։ Storage/scanner փորձով հաստատել fail-closed approval-ը և արդեն տրված URL-ի emergency cutoff-ը։ |
| PA-10, PA-12 | Հավասարակշռված append-only ֆինանսական գրառումներ, reconciliation և առանձին launch gates։ Բաց են launch market-ը, իրավաբանական և հարկային հիմքը, provider eligibility-ն, statement mapping-ը և payout/refund պայմանները։ **12% commission-ը փորձարարական վարկած է։ Production tariff-ի հաստատումը բաց է։** |

## Հետևանքներ և մնացած Marketplace blocker-ներ

- **Publishing և delivery։** Հաստատել pilot artifact policy-ն, scanner/reviewer ընդունման չափանիշները, replacement release eligibility-ն, emergency cutoff-ի շեմը և incident ownership-ը։
- **Commerce և paid pilot։** Հաստատել launch market-ը, պայմանագրային կողմի դերը, վճարային և payout իրագործելիությունը, license/refund/dispute պայմանները, շահութաբերության չափումները և commission policy-ն։ Գրանցել sandbox, reconciliation և review/support capacity ապացույցները։
- **Initialization։** Marketplace domain sign-off-ը գրանցված է։ Shared Platform որոշումները, հաստատված TECH_CARD-ը, 01-ARCHITECTURE-ը, նյութական հակասությունների լուծումը և ընդհանուր Phase A sign-off-ը բաց են։ **Phase B initialization authorization՝ NOT GRANTED**։ Release-ը պահանջում է առանձին թույլտվություն։
- **Անվտանգություն։** Գործում են գաղտնիքների պաշտպանությունը, input validation-ը, server-side authorization-ը, անվտանգ password hashing-ը՝ երբ գաղտնաբառ է պահվում, parameterized queries-ը և անվտանգ errors/logs-ը։ CORS allowlist-ը և CSRF պաշտպանությունը պարտադիր են։ Չլուծված Critical dependency vulnerability-ն կանգնեցնում է ազդված աշխատանքը։ [Security invariants](../../AGENTS.md#security-invariants) · [Security rule](../../.cursor/rules/08-security.mdc)

## Կապված փաստաթղթեր

- [Marketplace Master Architecture v1.1](MEDUZELLAR_MARKETPLACE_MASTER_ARCHITECTURE_HY.md) — ռազմավարական որոշումներ և սկզբնական FR/BR/NFR/AT հիմք։
- [Marketplace Pre-Implementation Finalization](MARKETPLACE_PRE_IMPLEMENTATION_FINALIZATION_HY.md) — §2–5 շրջանակ և PA գրանցամատյան, §13 շեղումներ, §14–19 վավերացում, gate-եր և հետագծելիություն։
- [Governance Alignment Notes](GOVERNANCE_ALIGNMENT_NOTES_HY.md) — v1.1-ի governance մեկնաբանություններ, ներառյալ security baseline-ը և առանձին Phase B թույլտվությունը։
- [Shared Platform Architecture handoff](MARKETPLACE_SHARED_PLATFORM_DEPENDENCY_HANDOFF_HY.md) — բաց համահարթակային որոշումներ և ակնկալվող ապացույցներ։
