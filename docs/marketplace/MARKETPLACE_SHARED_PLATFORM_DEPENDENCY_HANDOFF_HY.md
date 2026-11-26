# Marketplace — Shared Platform Architecture dependency handoff

**Կարգավիճակ՝ Open for Shared Platform review · Phase A։** [Marketplace domain sign-off](ADR-009-MARKETPLACE-PLANNING-SIGN-OFF_HY.md)-ը սահմանում է Marketplace-ի հաստատված պլանավորման պահանջները։ Ստորև նշված համահարթակային որոշումները պետք է գրանցվեն իրենց պատասխանատուների և Product Owner-ի հաստատմամբ։

## Որոշումների փոխանցում

| Բաղադրիչ / PA | Marketplace-ի սահման | Shared Platform-ից պահանջվող որոշում և ապացույց |
| --- | --- | --- |
| **Identity / Authentication · PA-02** | Checkout-ը, Library-ն և support-ը պահում են actor/principal տարբերակումը և ստուգում կոնկրետ գործողության ու ռեսուրսի իրավասությունը։ | Որոշել human identity source-ը, authentication/session պայմանագիրը, context switching-ը և revocation-ի երաշխիքը։ Պահանջվում է stale session-ով և cross-tenant գործողություններով մերժման contract evidence։ |
| **Organizations / Membership · PA-02** | Marketplace-ը տնօրինում է Seller Account-ը, order/grant ownership-ը և audit references-ը։ Անձի membership-ի հետկանչը սահմանափակում է նրա մուտքը դեպի Office-ին պատկանող տվյալները և չի տեղափոխում Office-ի իրավունքը։ | Որոշել Organization principal-ի ID-ն, membership/role lifecycle-ը, authorization freshness-ը և Office-ի քարտեզագրումը աշխատանքային Platform Specification-ի User/Office onboarding-ի հետ։ |
| **Payments · PA-05–07, PA-10, PA-12** | Marketplace-ը տնօրինում է quote/order snapshot-ը, fulfillment-ը, grants-ը և domain settlement/reconciliation գրառումները։ | Որոշել shared payment ownership-ը, provider-ի ընտրության շրջանակը, idempotency/status/capture/refund/dispute semantics-ը և statement contract-ը։ Գրանցել sandbox, eligibility և finance review ապացույցները։ |
| **Storage · PA-08–09** | Marketplace-ը որոշում է release verification-ը, ընթացիկ entitlement-ը և artifact block-ը։ | Որոշել private storage/quarantine, digest և versioning semantics-ը, scanner isolation-ը, signed access և emergency deny մեխանիզմը։ Չափել cutoff-ը արդեն տրված URL-ի և ընթացող փոխանցումների համար։ |
| **Notifications · PA-03** | Marketplace-ը տրամադրում է versioned order/support/incident event-ները և անհրաժեշտ նվազագույն տվյալները։ | Որոշել routing/consent, dedupe և retry semantics-ը։ Notification failure-ը պետք է երևա օպերացիոն տեսքում, իսկ checkout-ը, fulfillment-ը և Library access-ը շարունակեն գործել։ |
| **Infrastructure, data և stack · PA-04, PA-11–12** | Marketplace B scope-ը փոխանցում է workload, isolation, recovery և review capacity պահանջները։ | Վերանայել Platform C առաջարկը, shared DB boundaries-ը, migrations-ը, hosting/regions-ը, access controls-ը, observability-ն, RPO/RTO-ն, աշխատանքային ծավալն ու ծախսերը։ Համեմատել DB-backed jobs և Redis/BullMQ թեկնածուները ամբողջ Platform-ի async, notifications, communication, caching և background jobs բեռով։ Փաստագրել runtime/package compatibility-ն և հաստատման ենթակա stack-ը։ |
| **Cross-domain contracts · PA-03** | Marketplace listing-ը visibility-ի հեղինակավոր աղբյուրն է։ Channel publication-ը opt-in է։ Core commerce-ը չի կախված Messenger-ից, Network-ից կամ AI-ից։ | Համաձայնեցնել channel owner-ը, audience/quota-ն, Network projection-ը, Messenger case link/consent-ը և AI retrieval authorization-ը։ Versioned contracts-ում սահմանել event ownership, removal/block propagation, retry/dedupe և outage behavior։ Թեստով ապացուցել, որ հնացած event-ը չի վերականգնում հանված listing-ը։ |

## Վերանայման ակնկալվող արդյունքը

1. Նշանակել shared որոշումների պատասխանատուներին և գրանցել source of truth-ը, contract-ը, failure/revocation semantics-ը և պահանջվող ապացույցը։
2. Փակել Identity/Organization, Payments/Storage և infrastructure/stack որոշումների այն մասը, որն անհրաժեշտ է հաջորդ Phase A approval-ին։ Channel, Messenger, Network և AI ինտեգրումները բաց պահել իրենց feature gates-ի շրջանակում։
3. Առանձին փաստագրել Marketplace-ին անհրաժեշտ արտաքին արդյունքները՝ իրավական և provider feasibility, sandbox/payment replay, artifact cutoff, runtime compatibility, ծախսեր և pilot capacity։ Պահպանել պարտադիր CORS/CSRF, server-side authorization ու Critical dependency stop-ը բոլոր տարբերակներում։ [Security invariants](../../AGENTS.md#security-invariants) · [Security rule](../../.cursor/rules/08-security.mdc)

Մուտքային նյութեր՝ [Marketplace Pre-Implementation Finalization, §11–15](MARKETPLACE_PRE_IMPLEMENTATION_FINALIZATION_HY.md), [Platform Specification, §5–6 և §13](../PLATFORM_SPECIFICATION.md) և [Governance Alignment Notes](GOVERNANCE_ALIGNMENT_NOTES_HY.md)։
