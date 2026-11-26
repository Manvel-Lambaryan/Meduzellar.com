# Professional Network — Shared Platform dependency handoff

**Domain Planning՝ Accepted ըստ [ADR-011-ի](ADR-011-PROFESSIONAL-NETWORK-PLANNING-SIGN-OFF_HY.md)։ Platform Phase A՝ Open։ Phase B՝ NOT AUTHORIZED։** Ստորև բոլոր shared լուծումները Shared Platform Pending են։ Owner դերերը և versioned contracts-ի նկարագրությունները առաջարկներ են։ P0/P1-ը dependency-ի առաքման փուլն է՝ initialization-ի առանձին թույլտվությունից հետո։

| ID / սպառող / առաջարկվող owner | Պահանջվող contract և անվտանգություն | Failure behavior, փուլ և blocker |
| --- | --- | --- |
| PN-SP-01 · Profile/Recruitment · Shared Identity/Auth | Human actor ID, session/MFA/revoke և context switch։ GitHub external link-ը առանձին է platform login-ից։ | Stale session-ը մերժվում է։ Phase A/P0՝ IdP, session և revoke tests։ |
| PN-SP-02 · Office jobs/pipeline · Shared Organizations | Principal, delegated recruiter action/resource permissions և current membership։ | Այլ Office-ն ու revoked actor-ը CV/դիմում չեն տեսնում։ Phase A/P0՝ User/Office mapping և tenant evidence։ |
| PN-SP-03 · Jobs/applications/evidence · Shared Data + Network | Stable refs, Network writes, transaction/outbox, versioned event և scoped retention։ | Stale event-ը չի վերականգնում visibility-ն։ P0՝ DB ownership, replay և legal-hold policy։ |
| PN-SP-04 · CV/portfolio · Shared Storage/Security | Private quarantine, isolated scan, digest, signed access, scoped delete/cutoff։ | Scan failure-ը fail closed է։ P0՝ scanner/URL cutoff և retention proof։ |
| PN-SP-05 · Recruiter subscription · Shared Payments/Finance | Office entitlement, invoices, usage/expiry, free candidate apply։ Network-ը կիրառում է feature eligibility։ | Billing outage-ն չի դադարեցնում արդեն թույլատրված core recruitment-ը։ Paid launch՝ sandbox/terms/price։ |
| PN-SP-06 · Applications/interviews · Shared Notifications | Minimal versioned events, preferences, authorized routing, retry/dedupe և invite expiry։ | Dispatch outage-ը չի փոխում application stage-ը։ P0՝ privacy և duplicate/expired invite test։ |
| PN-SP-07 · Matching/CV feedback · Shared AI/Network | Purpose-scoped profile/job/CV, metering caps, cited job-related suggestions, consent, human stage control։ | Provider failure → manual discovery/apply։ P1՝ fairness/legal, approved context և no auto-hire/reject թեստ։ |
| PN-SP-08 · Portfolio links · Marketplace | Public product reference և source visibility/version։ Network-ը պահում է portfolio link-ը։ | Unlist/block → hidden link, purchase flow-ը մնում է Marketplace-ում։ P0 optional՝ visibility contract։ |
| PN-SP-09 · Candidate/recruiter contact · Communication | Profile/application-bound participants, contact consent և minimal handoff։ Network-ը տնօրինում է invite/stage-ը։ | Messenger outage → native pipeline ու status։ P0՝ cross-profession eligibility և revoke semantics։ |
| PN-SP-10 · Job projection · Shared Channels | Source opt-in, taxonomy/audience, quota, versioned publish/unpublish, moderation։ | Stale publish-ը չի վերականգնում փակ job-ը։ P1՝ quota owner, replay և policy approval։ |
| PN-SP-11 · GitHub evidence · Network Integrations/Security | Least privilege, selected public metadata, freshness/revoke cache, credential redaction։ | Manual fallback, stale label։ P0 optional՝ terms/API scope/retention proof։ |
| PN-SP-12 · Search/workers/recovery · Platform/SRE | PostgreSQL FTS թեկնածու, scoped read models, jobs/cache sizing, OpenTelemetry, DB/object restore և incident ownership։ | Audit/SLO alerts, search outage թույլ չի տալիս շրջանցել ACL-ը։ Phase A/P0՝ combined load, budget, RPO/RTO և security evidence։ |

## Համադրում և բաց որոշումներ

- [Marketplace handoff](../marketplace/MARKETPLACE_SHARED_PLATFORM_DEPENDENCY_HANDOFF_HY.md)-ի PA-02/03 և Storage/Payments պահանջները համընկնում են actor/principal, private storage և idempotent billing սահմաններում։ Marketplace entitlement-ը և application CV authorization-ը տարբեր source decisions են։ Network subscription-ը և Marketplace checkout-ը պետք է վերօգտագործեն shared provider semantics առանց տվյալների սեփականության փոփոխության։
- [Custom Telegram handoff](../custom-telegram/CUSTOM_TELEGRAM_SHARED_PLATFORM_DEPENDENCY_HANDOFF_HY.md)-ի CT-SP-10-ը Network-ում է ստանում candidate/employer contact, profile privacy և job/application lifecycle-ը։ Messenger-ը տնօրինում է conversation/member/call, Network-ը՝ application և interview invitation։ Cross-profession chat rule-ը և հին source link history policy-ն բաց են։
- [Custom AI handoff](../custom-ai/CUSTOM_AI_SHARED_PLATFORM_DEPENDENCY_HANDOFF_HY.md)-ի համար Network-ը տրամադրում է authorized job/profile read և ընտրված CV context։ Independent apply և մարդկային stage transitions-ը պահպանվում են։ Matching fairness և case/internal notes-ի օգտագործման սահմանը հաստատվում են առանձին։
- Platform Specification-ի system-assigned read-only channel-ը և source opt-in/subscription semantics-ը պահանջում են ընդհանուր taxonomy, qualification, quota և revoke contract։ Այս handoff-ով քվոտայի թվեր չեն հաստատվում։ Network-ի RPO ≤ 1 ժամ/RTO ≤ 4 ժամ թեկնածուն համեմատել custom Telegram-ի 15 րոպե/2 ժամ և Marketplace-ի 15 րոպե/4 ժամ նախագծային թիրախների հետ։ Տարբեր tier-երը հաստատվում են shared recovery փորձարկումից հետո։

## Ընդունման ապացույց

Մինչև feature launch հավաքել Office revoke և cross-tenant CV թեստ, source unpublish/replay, GitHub terms/scopes, scanner timeout/cutoff, payment sandbox և notification expiry։ Մինչև public/paid launch հավաքել privacy/employment review, human oversight/fairness, demand/economics, load/restore և operational ownership։ Պարտադիր են [AGENTS.md-ի security invariants-ը](../../AGENTS.md#security-invariants), CORS/CSRF-ը և չլուծված Critical dependency vulnerability-ի դեպքում ազդված աշխատանքի կանգը։ Redis/BullMQ, provider, quota, DB topology և exact versions սպասում են ամբողջ Platform-ի հաստատմանը։
