# Custom Telegram + AI — Shared Platform Architecture dependency handoff

**Կարգավիճակ՝ Open for Shared Platform review · Phase A։** Custom Telegram + AI Domain Planning-ը **Accepted** է ըստ ADR-010-ի։ Platform Phase A-ն **Open** է։ Phase B initialization-ը՝ **NOT AUTHORIZED**։ Աղյուսակների և պայմանագրերի պատասխանատուները առաջարկվող դերեր են։ Բոլոր shared ընտրությունները, service boundaries-ը, providers-ը, versions-ը և production thresholds-ը սպասում են համահարթակային հաստատման։

Հիմք՝ [Custom Telegram ADR-010](ADR-010-CUSTOM-TELEGRAM-PLANNING-SIGN-OFF_HY.md), [Master Architecture v1.0](MEDUZELLAR_CUSTOM_TELEGRAM_MASTER_ARCHITECTURE_HY.md), [Pre-Implementation Finalization](CUSTOM_TELEGRAM_PRE_IMPLEMENTATION_FINALIZATION_HY.md), [Governance Alignment Notes](GOVERNANCE_ALIGNMENT_NOTES_HY.md), [Marketplace ADR-009](../marketplace/ADR-009-MARKETPLACE-PLANNING-SIGN-OFF_HY.md), [Marketplace shared handoff](../marketplace/MARKETPLACE_SHARED_PLATFORM_DEPENDENCY_HANDOFF_HY.md), [Platform Specification](../PLATFORM_SPECIFICATION.md) և [BRIEF](../BRIEF.md)։ CT-SP IDs-ը այս handoff-ի հղումներն են։ Դոմենային CT-DEC, CT-FR և CT-G ID-ները պահպանում են իրենց նշանակությունը։

## Կախվածությունների գրանցամատյան

**Փուլի ընթերցում։** «Phase A» նշանակում է պայմանագրի կամ ճարտարապետական որոշման պատրաստում և հաստատում։ «P0/P1» նշանակում է capability-ի պահանջվող delivery փուլ՝ միայն հետագա թույլտվությունից հետո։ «Launch» նշանակում է ապացույցի կամ policy-ի առանձին դարպաս։

### CT-SP-01 — Identity & Authentication

**Սպառող՝** Custom Telegram Messaging/API/Gateway։ **Առաջարկվող owner՝** Shared Identity & Authentication։ **Փուլ՝** Phase A foundation contract, P0։ **Կարգավիճակ՝ Shared Platform Pending**։

- **Պայմանագիր։** Մեկ հեղինակավոր User identity, կայուն actor ID, authentication և session issuance/expiry/rotation/revocation, MFA enrollment/recovery և արտոնյալ գործողությունների step-up։ WebSocket handshake-ը պետք է կապի հաստատված short-lived session-ը կամ scoped connection credential-ը actor-ի հետ։ Session revoke-ը պետք է հասնի բոլոր gateway-ներին։
- **Անվտանգություն և ձախողում։** Ստուգել Origin-ը, session վիճակը և resource permission-ը handshake-ից հետո յուրաքանչյուր պաշտպանված subscribe/command-ի համար։ Revoked կամ չվավերացվող session-ը մերժվում է, կապը կամ subscription-ը փակվում է։ Authentication provider outage-ի degraded վարքը պահանջում է հաստատված կանոն։ Audit-ում պահել actor/action և correlation ID՝ առանց token-ի կամ credential-ի։
- **Կախվածություն / blocker։** CT-SP-02, IdP/session lifecycle և MFA policy, stale session և cross-gateway revoke tests։ Արգելակում է foundation և պաշտպանված messaging։

### CT-SP-02 — Organizations & Authorization

**Սպառող՝** Custom Telegram Conversation, Office context, search, files և usage։ **Առաջարկվող owner՝** Shared Organizations & Authorization, Conversation policy-ի համար՝ Communication։ **Փուլ՝** Phase A foundation contract, P0։ **Կարգավիճակ՝ Shared Platform Pending**։

- **Պայմանագիր։** Տարբերակել human actor-ը, Organization principal-ը, Organization Membership-ը և Conversation Membership-ը։ Սահմանել personal/Office context switch, role/action/resource permissions, membership version, invite/remove և revoke propagation։ Office հոսքին անհրաժեշտ են երկու ընթացիկ memberships-ը և համապատասխան իրավունքները։ History-window semantics-ը մնում է Communication-ի պայմանագրում։
- **Անվտանգություն և ձախողում։** Առանց հաստատված actor/principal-ի մերժել protected operation-ը։ Revoke-ը փակում է հաջորդ protected read/write/replay/search/download/AI գործառնությունը և invalidate է անում gateway/subscription/cache-ը։ Office-ին պատկանող տվյալների ownership-ը չի տեղափոխվում հեռացված անդամին։ Unavailable կամ stale authorization-ի դեպքում deny-by-default։
- **Կախվածություն / blocker։** CT-SP-01/03/04, Platform Specification-ի User/Office onboarding mapping, դերերի մատրից և revocation-ի contract evidence։ Արգելակում է Office և cross-domain handoff հոսքերը։

### CT-SP-03 — Shared Data Architecture

**Սպառող՝** Custom Telegram Messaging, Translation, Usage և cross-domain projections։ **Առաջարկվող owner՝** Shared Data Architecture, համապատասխան domain owners-ի հետ։ **Փուլ՝** Phase A boundaries, P0 data foundation, launch retention։ **Կարգավիճակ՝ Shared Platform Pending**։

- **Պայմանագիր։** Communication-ը տնօրինում է conversation/message/revision/receipts-ը, Realtime Translation-ը՝ translation outputs/processing state-ը՝ վերջնական shared սահմանով։ Marketplace/Network-ը տնօրինում են իրենց source records-ը։ Որոշել DB ownership/boundaries, opaque actor/principal/domain refs, migration coordination և transaction isolation։ Message, revision, change cursor և outbox-ը նույն հեղինակավոր transaction-ում են։ Cross-domain փոխանակման համար առաջարկվում են versioned events՝ event ID, aggregate ID/version, correlation ID և նվազագույն reference, dedupe/replay/tombstone semantics-ով։
- **Անվտանգություն և ձախողում։** Parameterized queries, tenant scope և domain-owned writes։ Արգելել shared projections-ից պաշտպանված տվյալների ինքնուրույն հասանելիությունը։ At-least-once event delivery-ն ծածկել idempotent consumers-ով, stale versions-ը չկիրառել։ DB commit-ի ձախողման դեպքում durable ACK չի տրվում։ Restore-ից հետո, մինչև սպասարկումը վերսկսելը, նորից կիրառել delete/revoke markers-ը։ Retention/export/delete, backup expiry և legal-hold scopes-ը պահանջում են approval։
- **Կախվածություն / blocker։** CT-SP-02/04/05/06/12, data classification և privacy/retention review։ Արգելակում է durable messaging, հուսալի projections և public launch։

### CT-SP-04 — Shared Infrastructure

**Սպառող՝** Custom Telegram realtime gateway, sync, presence, workers և P1 media։ **Առաջարկվող owner՝** Shared Infrastructure / SRE և Communication։ **Փուլ՝** Phase A platform design, P0 gateway/workers, P1 media։ **Կարգավիճակ՝ Shared Platform Pending**։

- **Պայմանագիր։** Gateway scaling, connection/subscription limits, reconnect and backpressure, worker retry/replay, cache/presence TTL և visibility, environments/regions ու isolation։ Redis-ը presence/cache/rate-limit state-ի, BullMQ-ը scheduling/retry jobs-ի թեկնածու են։ Համեմատել DB-backed jobs-ի հետ ըստ համակցված Marketplace/communication/notifications/scanning բեռի, connection count-ի, workload isolation-ի, durability-ի և ծախսի։ Սահմանել backup/PITR և object recovery, correlation/metrics/traces, alerts և on-call ownership։
- **Անվտանգություն և ձախողում։** Scoped service identities, isolated workers, գաղտնիքների անվտանգ պահում, telemetry redaction։ Gateway/cache/queue outage-ը չի փոխարինում authoritative message store-ին։ Durable commit-ից հետո gap recovery-ն կատարվում է sync/replay-ով։ Presence-ը անցնում է unknown/expired վիճակի։ Workers-ը սահմանափակում են retries-ը և վերականգնում են աշխատանքը outbox-ից։ SFU/TURN-ը և AI workers-ը կիրառելի են առանձին ծանրաբեռնվածության սահմաններով։
- **Կախվածություն / blocker։** CT-SP-01/03/05/06/12, combined capacity model, stack compatibility, hosting quotes և restore drills։ Արգելակում է platform initialization որոշումները և pilot readiness-ը։

### CT-SP-05 — Shared Storage

**Սպառող՝** Custom Telegram attachments, moderation և consented transcript artifacts։ **Առաջարկվող owner՝** Shared Storage / Security Engineering, Communication-ի հետ։ **Փուլ՝** Phase A contract, P0 attachments, P1 transcript ըստ policy-ի։ **Կարգավիճակ՝ Shared Platform Pending**։

- **Պայմանագիր։** Actor/principal և conversation scope-ով private upload intent, quarantine → scan → clean/reject, immutable digest/version, malware scanning, signed download issuance, emergency cutoff և retention/delete lifecycle։ Shared Storage-ը տնօրինում է bytes/scanner primitives-ը, Communication-ը՝ attachment eligibility-ն և current access-ը։
- **Անվտանգություն և ձախողում։** MIME/size/signature և archive սահմաններ, scanner isolation, TLS/encryption at rest, clean-ի կապը digest-ին։ Scan outage/timeout-ը fail-closed է։ Նոր signed access-ը մերժվում է revoke/block-ից հետո։ Արդեն տրված credential-ի և in-flight փոխանցման cutoff-ը առանձին փորձարկել։ URL/token-ը չի գրանցվում logs-ում։ Delete-ը կանգնեցնում է active access-ը և սկսում policy-governed purge-ը։
- **Կախվածություն / blocker։** CT-SP-02/03/12 և storage/scanner capability proof։ Արգելակում է attachments-ի և պահպանվող transcript-ի մատուցումը։

### CT-SP-06 — Shared AI Infrastructure

**Սպառող՝** Custom Telegram P0 text translation, P1 live media translation և Chat AI։ **Առաջարկվող owner՝** Shared AI / Realtime Translation, Communication-ի և privacy պատասխանատուների հետ։ **Փուլ՝** Phase A contract, P0 text, P1 STT/TTS/LLM։ **Կարգավիճակ՝ Shared Platform Pending · External Validation Required**։

- **Պայմանագիր։** Versioned text translation/STT/TTS/LLM adapters, locale/revision inputs, normalized results/errors/usage, provider routing/regions, idempotent operation reference և billing metering semantics։ Սահմանել consent scope, retention/export/delete, actor/principal/conversation-bound context, quota reservation/reconciliation, per-principal ու platform spend caps և kill switch։ Հայերեն/անգլերեն/ռուսերենը մեկնարկային text scope-ն է։ TTS-ը պահանջում է transcript-first pilot և հաջորդ approval։
- **Անվտանգություն և ձախողում։** Recheck անել access/consent/revision-ը provider call-ից ու արդյունքը մատուցելուց առաջ։ Տալ նվազագույն տվյալ, isolation և redaction, առանց auto-send-ի։ Prompt-ը անվստահելի input է։ Մերժել stale կամ revoked output-ը։ Uncertain provider charge-ը համադրել մինչև կրկնակի billable retry։ AI outage/cap-ի դեպքում պահպանել բնօրինակ chat-ը և սովորական զանգը։ Cloud Chat-ը E2EE չէ։ Ապագա E2EE և server-side AI համատեղումը պահանջում է առանձին privacy approval։
- **Կախվածություն / blocker։** CT-SP-02/03/04/07/12, provider data/legal terms և locale/speech benchmarks։ Արգելակում է translation վճարովի կամ հանրային գործարկումը և P1 AI/media ենթահոսքերը։

### CT-SP-07 — Shared Payments

**Սպառող՝** Custom Telegram subscriptions, translation/call usage, AI allowances/credits և Office billing։ **Առաջարկվող owner՝** Shared Billing/Payments և Finance, domain usage owner-ի հետ։ **Փուլ՝** Phase A contract, P0 usage enforcement, վճարովի pilot/P1 billing։ **Կարգավիճակ՝ Shared Platform Pending · External Validation Required**։

- **Պայմանագիր։** Պարզել payer principal և eligibility, personal/Office subscriptions, admin spending permission, prepaid credits կամ usage allowance, currency/unit և entitlement lifecycle։ Communication-ը տալիս է idempotent usage facts ու quota enforcement-ը։ Shared Billing-ը տնօրինում է charge/refund/dispute/statement lifecycle-ը։ Օգտագործման անորոշ արդյունքը պետք է համադրվի provider reference-ով։ Հաստատել expired allowance, contract version, duplicate charge և settlement boundaries-ը։
- **Անվտանգություն և ձախողում։** Server-calculated units, Office billing isolation, audited adjustments, signed/deduped callbacks, charge idempotency և reconciliation։ Billing/provider outage-ի դեպքում դադարեցնել նոր չստուգված paid processing-ը և պահպանել free core-ը։ Paid overage-ը պահանջում է համաձայնություն։ Ոչ մի արտադրական tariff կամ provider ընտրություն չի ամրագրվում։
- **Կախվածություն / blocker։** CT-SP-01/02/03/06, provider eligibility, sandbox, legal/accounting terms և unit economics։ Արգելակում է paid launch-ը, իսկ core messaging-ը շարունակում է գործել։

### CT-SP-08 — Shared Notifications

**Սպառող՝** Custom Telegram messaging P0 և call invites P1։ **Առաջարկվող owner՝** Shared Notifications, Communication-ի հետ։ **Փուլ՝** Phase A contract, P0 messages, P1 call invitations։ **Կարգավիճակ՝ Shared Platform Pending**։

- **Պայմանագիր։** Versioned message/call event, recipient scope, preferences/mute/quiet settings, routing, scoped dedupe key, expiration և bounded retry։ Call invite-ը ժամանակային սահմանով հղում է իրական call state-ին։ Handler-ը recheck է անում membership-ը, block-ը և privacy preferences-ը dispatch-ից առաջ։
- **Անվտանգություն և ձախողում։** Privacy-safe default preview՝ նվազագույն metadata և opaque reference։ Push delivery acknowledgment-ը առանձին է message commit/read և call admission-ից։ Expired/revoked invitation-ը չի միացնում օգտատիրոջը։ Provider failure-ը առաջացնում է retry/alert, իսկ message commit և authorized call state-ը պահպանվում են։
- **Կախվածություն / blocker։** CT-SP-01/02/03/04 և channel/provider dispatch փորձարկում։ Արգելակում է notifications և call-invite ծանուցումը, core chat-ը գործում է անկախ։

### CT-SP-09 — Marketplace Integration

**Սպառող՝** Custom Telegram buyer/seller handoff և Channels, Marketplace native support-ի հետ ինտեգրում։ **Առաջարկվող owner՝** Marketplace՝ listing/order/grant/support case, Communication՝ conversation/member, shared Channels՝ projection policy։ **Փուլ՝** Phase A contract, P0 authorized handoff, P1 opt-in projection։ **Կարգավիճակ՝ Shared Platform Pending, ADR-009-ի և ADR-010-ի հաստատված սահմաններով**։

- **Պայմանագիր։** Opaque listing/order/case reference, authorized buyer/seller participants և idempotent conversation link։ Marketplace-ը պահպանում է source/visibility ownership-ը։ Product publication-ը պահանջում է source opt-in և versioned removal/block։ Shared contract-ը սահմանում է listing revocation-ից հետո source link և chat history վարքը։
- **Անվտանգություն և ձախողում։** Auth recheck երկու դոմենում, message-level context isolation, block/request policy և minimal payload։ Հնացած event-ը չի վերադարձնում unlisted listing-ը։ Marketplace checkout, fulfillment, Library և native support-ը շարունակում են աշխատել Messenger outage-ի դեպքում։ Messenger-ը շարունակում է գոյություն ունեցող թույլատրված chat-ը Marketplace handoff outage-ի դեպքում՝ approved history policy-ի սահմանում։
- **Կախվածություն / blocker։** CT-SP-02/03/08/11 և Marketplace-ի owner-approved handoff/access contract։ Արգելակում է optional handoff-ը և product projection-ը։

### CT-SP-10 — Professional Network Integration

**Սպառող՝** Custom Telegram candidate/employer և profile-related messaging, Channels job feed։ **Առաջարկվող owner՝** Professional Network & Recruitment՝ profile/job/application/visibility, Communication՝ conversation/member/consent։ **Փուլ՝** Phase A contract, P0 authorized handoff, P1 job projection։ **Կարգավիճակ՝ Shared Platform Pending**։

- **Պայմանագիր։** Սահմանել ով կարող է սկսել թեկնածու/գործատու զրույցը կամ օգտագործել profile contact action-ը։ Handoff-ը սահմանափակել authorized participants-ով և opaque profile/job/application refs-ով։ Job projection-ը ստանում է source eligibility/version և unpublish/revoke event։ Interview context-ը կարող է հղվել հաղորդակցության գործողությանը՝ Network-ում պահպանվող recruitment state-ով։
- **Անվտանգություն և ձախողում։** Contact permissions, profile privacy, Organization և conversation membership, block/request/report։ Public job card-ը չի բացում private application/profile տվյալները։ Visibility revoke-ը փակում է source access-ը։ Network outage-ի դեպքում handoff-ը չի ստեղծվում առանց authorization-ի, իսկ գոյություն ունեցող chat-ը գործում է իր հաստատված history policy-ով։
- **Կախվածություն / blocker։** CT-SP-02/03/08/11, Network-ի contact/privacy և source event contract։ Արգելակում է Network handoff և job projection-ը։ Առկա աշխատանքային բնութագիրը դեռ պահանջում է դոմենային հաստատում։

### CT-SP-11 — Channels & Publication

**Սպառող՝** Custom Telegram Professional Channels, Marketplace product և Network job publications։ **Առաջարկվող owner՝** Shared Channels/Publications՝ policy և projection lifecycle, Marketplace/Network՝ source eligibility։ **Փուլ՝** Phase A ownership/contract, P1 delivery։ **Կարգավիճակ՝ Shared Platform Pending**։

- **Պայմանագիր։** Professional taxonomy, system assignment, subscription/audience, source owner opt-in, publication eligibility և versioned projection ownership։ Սահմանել quota principal/window, idempotent request, republish/reclaim rules, moderation scope և unpublish propagation։ Taxonomy-ն պետք է կապի մասնագիտությունն ու job/product projections-ը՝ պահպանելով source categories-ը։
- **Անվտանգություն և ձախողում։** Publication-ի պահին ստուգել source authorization և visibility։ Moderator-ը տնօրինում է audit-ով projection visibility-ն։ Delayed event-ը չի վերականգնում հանված կամ blocked card-ը։ Quota/source state-ի անհասանելիության դեպքում կանգնեցնել նոր publication-ը, հեռացման critical path-ը վավերացնել առանձին։ User/Office քվոտայի թվերը բաց են։
- **Կախվածություն / blocker։** CT-SP-02/03/09/10/12, shared policy approval և replay/unpublish tests։ Արգելակում է P1 Channels-ի գործարկումը։

### CT-SP-12 — Security & Operational Governance

**Սպառող՝** Custom Telegram, Shared Platform և կախյալ դոմեններ։ **Առաջարկվող owner՝** Shared Security / Privacy / SRE, domain incident owners-ի հետ։ **Փուլ՝** Phase A review, P0/P1 ըստ capability-ի, pilot/launch evidence։ **Կարգավիճակ՝ Shared Platform Pending · External Validation Required**։

- **Պայմանագիր։** Հաստատել threat models, actor/principal/resource audit-ը, incident ownership/escalation, rate limits, capacity/spend limits, abuse policy և service-level recovery objectives ըստ failure domain-ի։ External evidence-ը կապել versioned contract-ին և նշանակված պատասխանատուին։
- **Անվտանգություն և ձախողում։** [AGENTS.md-ի invariants-ը](../../AGENTS.md#security-invariants) պարտադիր են։ Պաշտպանել credentials-ը, վավերացնել external input-ը, կիրառել server-side authorization, անվտանգ password hashing երբ գաղտնաբառ է պահվում, parameterized queries և sanitized errors/logs։ CORS allowlist-ը և CSRF պաշտպանությունը պարտադիր են, իսկ WS Origin/session/resource checks-ը առանձին են։ Չլուծված Critical dependency vulnerability-ն կանգնեցնում է ազդված աշխատանքը։ System-ը պետք է fail-closed լինի անորոշ auth/scan/consent վիճակներում։ Capacity incident-ը սահմանափակում է ազդված աշխատանքի նոր ընդունումը և պահպանում է անվտանգ durable recovery ուղին։ [Security rule](../../.cursor/rules/08-security.mdc)
- **Կախվածություն / blocker։** CT-SP-01–11, threat/privacy review, load/security/restore drills, առանձին release approvals։ CT-ի RPO ≤ 15 րոպե և RTO ≤ 2 ժամ թիրախները մնում են չվավերացված։ Արգելակում է production launch-ը համապատասխան ապացույցների բացակայության դեպքում։

## Marketplace-ի համատեղելիության մատրից

Համեմատության հիմքը [Marketplace handoff-ի որոշումների աղյուսակն է](../marketplace/MARKETPLACE_SHARED_PLATFORM_DEPENDENCY_HANDOFF_HY.md)։ Համընկնող պահանջները կարող են ունենալ նույն shared contract-ը՝ առանձին domain policies-ով։

| Dependency | Marketplace համադրում | Բաց capability / ownership / հաստատում |
| --- | --- | --- |
| CT-SP-01 | **Համընկնում** — Identity/Authentication · PA-02, actor/principal և stale session denial։ | WS revoke fanout և MFA/recovery semantics-ը լրացուցիչ shared պահանջ են։ Որոշել IdP/session owner-ը։ |
| CT-SP-02 | **Համատեղելի** — Organizations/Membership · PA-02, Office ownership-ից առանձին actor access։ | Conversation Membership-ի ownership-ը Communication-ինն է։ User/Office onboarding conflict-ը լուծել միասնական principal mapping-ով՝ Owner-ի հաստատմամբ։ |
| CT-SP-03 | **Համընկնում** — Infrastructure, data և stack · PA-04, cross-domain · PA-03։ Երկու դոմենն ունեն հեղինակավոր վիճակ և versioned projections։ | Shared ID/event envelope, DB/transaction ownership, outbox/replay և retention lifecycle-ի միասնական contract դեռ բաց է։ Finance retention և message purge տարբեր պահանջներ են։ |
| CT-SP-04 | **Համընկնում և լրացում** — PA-04/11/12-ի combined workload, DB-backed jobs և Redis/BullMQ review։ | Connection scaling, presence, media plane, worker isolation և cost allocation ավելացնում են capacity հարցեր։ Recovery thresholds-ի տարբերությունը նշել առանձին։ |
| CT-SP-05 | **Համընկնում** — Storage · PA-08/09, immutable digest, quarantine, short-lived delivery և emergency cutoff։ | Marketplace entitlement/licensing-ը և conversation membership-authorization-ը մնում են դոմենային։ Shared scanner/SLO և object cutoff owner-ը բաց են։ |
| CT-SP-06 | **Համատեղելի, պակաս capability** — Cross-domain · PA-03, authorized AI retrieval և order-ից AI-ի անկախություն։ | Shared adapter/data processing policy, consent epochs, STT/TTS/LLM metering և caps-ը պահանջում են shared AI owner ու privacy review։ |
| CT-SP-07 | **Համընկնում և տարբեր billing հոսքեր** — PA-05–07/10/12-ի idempotency, provider status և reconciliation։ | Marketplace order/entitlement/settlement և Messenger usage/allowance փաստերը ունեն առանձին աղբյուրներ։ Shared billing ownership, Office eligibility և statement semantics-ը բաց են։ |
| CT-SP-08 | **Համընկնում** — Notifications · PA-03, minimal events, retry/dedupe և core commerce-ի անկախություն։ | Call invitation expiry և message preview/privacy policy-ն լրացուցիչ contract են։ Dispatch ownership-ը բաց է։ |
| CT-SP-09 | **Համատեղելի** — Marketplace ADR-009-ի listing/order/grant/support case ownership-ը, native support-ը և opt-in publication-ը պահպանվում են։ | Buyer/seller handoff-ի audience, source link revoke և chat-history policy-ն պետք է համաձայնեցնել։ |
| CT-SP-10 | **Համատեղելի, պակաս capability** — Marketplace handoff-ը նախատեսում է Network projection՝ source ownership-ով։ | Candidate/employer contact rules, profile privacy և job/application lifecycle events-ը հաստատված Network contract չունեն։ Network-ի դոմենային review է պետք։ |
| CT-SP-11 | **Համընկնում և բաց իմաստային տարբերություն** — PA-03 opt-in, versioned removal և stale replay denial։ | Platform Specification-ի system-assigned read-only channel-ը պետք է համադրել CT-ի subscription և moderation-ի հետ։ Quota, taxonomy և projection owner-ը platform-wide approval են պահանջում։ |
| CT-SP-12 | **Համընկնում և տարբեր recovery թիրախներ** — երկու handoff-ում պարտադիր security baseline, restore drills և operational ownership։ | CT-ի RTO թեկնածուն ≤ 2 ժամ է, Marketplace-ինը՝ ≤ 4 ժամ, երկուսի RPO թեկնածուն՝ ≤ 15 րոպե։ Սահմանել recovery tier-երը և shared restore evidence-ը։ |

## Խաչաձև հակասություններ և պահանջվող որոշումներ

1. **User/Office onboarding ու contact eligibility։** [Աշխատանքային Platform Specification-ի](../PLATFORM_SPECIFICATION.md) §5/§17-ը ունի User/Office ընտրություն և միջմասնագիտական չատի բաց սահման, մինչդեռ երկու handoff-երը պահանջում են shared human actor և authorized Office principal։ Որոշել mapping-ը, cross-profession buyer/seller և candidate/employer բացառիկ հոսքերի eligibility-ն և revoke semantics-ը։
2. **Channel assignment / opt-in / quota։** Համաձայնեցնել platform-level taxonomy-ն, system assignment-ի և subscription-ի իմաստները, jobs/products-ի source opt-in-ը, quota window/reclaim-ը և moderation ownership-ը։ Հաստատված Marketplace listing ownership-ը և դրանից անկախ core commerce-ը մնում են գործող սահմաններ։ Աշխատանքային User/Office թվերը սպասում են Owner review-ի։
3. **Պահպանում, revoke և recovery։** Message deletion, attachment credential cutoff և ֆինանսական տվյալների պահպանման պահանջները ներկայացնել առանձին data classes-ով։ Shared RTO/RPO-ն կամ service tiers-ը հաստատել ըստ workload ու release needs-ի։ [CT-NFR-07](MEDUZELLAR_CUSTOM_TELEGRAM_MASTER_ARCHITECTURE_HY.md) և [Marketplace NFR-05](../marketplace/MEDUZELLAR_MARKETPLACE_MASTER_ARCHITECTURE_HY.md) նախագծային թիրախներ են։
4. **Shared ownership և workload։** Որոշել Identity/Authorization, Data/Platform Infrastructure, AI, Storage, Notifications, Payments և Channels-ի պատասխանատուներին։ Handoff-երը չեն հաստատում provider, Redis/BullMQ, DB topology, exact versions կամ shared quotas։ Յուրաքանչյուր contract-ի համար գրանցել consumer, authoritative source, failure semantics և acceptance evidence։

ADR-009-ի և ADR-010-ի հաստատված domain scope-երի միջև այս համադրմամբ ուղղակի հակասություն չի բացահայտվել։ Վերոնշյալ անհամապատասխանությունները աշխատանքային բնութագրերի, shared contracts-ի կամ չվավերացված թիրախների մակարդակում են։ Հաստատված scope-ի հնարավոր փոփոխությունը պահանջում է առանձին Product Owner որոշում։

## Արտաքին վավերացում և հաջորդ review

| Ապացույց | Կապված կախվածություններ և դարպաս |
| --- | --- |
| IdP/session/MFA և cross-gateway revocation, tenant isolation, REST/WS/search/download/AI negative contract cases։ | CT-SP-01–03, CT-G01/02, foundation և P0 features։ |
| Combined workload, connection/reconnect storm, worker backlog, Redis/BullMQ versus DB-backed գործառնություններ, hosting/regions և cost, DB/object restore ու projection replay։ | CT-SP-03/04/12, CT-G05, pilot/production։ |
| Attachment scan isolation/timeout, digest check, signed URL TTL և emergency cutoff, underway transfer ու delete/restore տվյալներ։ | CT-SP-05/12, CT-G02/04, attachment և privacy readiness։ |
| Հայերեն/անգլերեն/ռուսերեն text translation որակ/latency, հայերեն STT/TTS, SFU/TURN և 5-seat reconnect/load, provider terms/regions և consent/retention։ | CT-SP-04/06/12, CT-G03/04/06, translation/AI և P1 calls։ |
| Provider eligibility/billing sandbox, dedupe/uncertain charge և refund/reconciliation, usage allowance, Office payer, cap և verified unit economics։ | CT-SP-06/07, CT-G07, paid features։ |
| Handoff contact authorization, notification privacy/expiry/dedupe, source revoke, cross-domain tombstone/replay և abuse escalation։ | CT-SP-08–12, CT-G02/04/05, P0 handoff և P1 ecosystem releases։ |

**Հաջորդ առաջարկվող դոմենը՝ Professional Network & Recruitment։** Առաջինը հստակեցնել profile/contact և candidate/employer authorization-ը, job/application ownership-ը և publication lifecycle-ը։ Այդ արդյունքներով համահարթակային review-ում փակել Actor/Office mapping-ը, channel quota/visibility-ն և Marketplace–Network–Communication handoff contracts-ը։ Phase B initialization-ը պահանջում է ավարտված Platform Phase A և առանձին Owner authorization։ [Project onboarding workflow](../../.agents/skills/project-onboarding/SKILL.md)
