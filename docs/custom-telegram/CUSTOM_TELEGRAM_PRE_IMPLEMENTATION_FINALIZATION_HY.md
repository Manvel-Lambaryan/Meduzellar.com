# Custom Telegram + AI — Pre-Implementation Finalization

**Փուլ՝ Phase A · Architecture strategy՝ Evolution-Ready · Implementation readiness՝ NOT READY · Phase B՝ NOT AUTHORIZED։**

Professional Multilingual Messenger-ը նախատեսված է միջազգային աշխատանքային շփման համար։ Առաջին թողարկման հիմքը՝ հուսալի 1:1 text messaging, առանձին թարգմանություն, անվտանգ ֆայլեր և AI-ից անկախ հաղորդակցություն։ Սկզբնական delivery scope-ը **B** է։ Ամբողջ Communication դոմենի երկարաժամկետ բարդությունը գնահատվում է **C**։ Shared Platform-ի չափն ու կառուցվածքը հաստատվում են համահարթակային review-ում։

Աղբյուրներ՝ [Master Architecture v1.0](MEDUZELLAR_CUSTOM_TELEGRAM_MASTER_ARCHITECTURE_HY.md), [Governance Alignment Notes](GOVERNANCE_ALIGNMENT_NOTES_HY.md), [Platform Specification](../PLATFORM_SPECIFICATION.md), [Marketplace ADR-009](../marketplace/ADR-009-MARKETPLACE-PLANNING-SIGN-OFF_HY.md), [Marketplace Shared Platform handoff](../marketplace/MARKETPLACE_SHARED_PLATFORM_DEPENDENCY_HANDOFF_HY.md) և [AGENTS.md](../../AGENTS.md#decision-precedence)։ Նոր պայմանագրերը ստորև նկարագրված են պլանավորման մակարդակով։

| Կարգավիճակ | Կիրառում |
| --- | --- |
| **Owner Approved** | CT-DEC-001–016 դոմենային ուղղություններն ու v1.0-ի փուլավորված product scope-ը։ |
| **Conditional** | Հաստատված ուղղության կիրառում համապատասխան consent, feasibility, բյուջեի կամ pilot gate-ի փակվելուց հետո։ |
| **Architect Proposed** | Այս փաստաթղթի protocol, policy, contract, մոդել, թեստ և կառուցվածքային առաջարկներ։ |
| **Shared Platform Pending** | Հարթակային ownership, shared contracts, vendors, topology, stack, versions և ընդհանուր չափ։ |
| **External Validation Required** | Որակի, իրավական, provider, interoperability, performance և economics ապացույցներ։ |
| **Implementation Pending** | Application, schema, contract artifacts և deployment իրականացնում են համապատասխան թույլտվությունից հետո։ |

## 01. Product Finalization

**Շուկա և լսարան։** Armenia-first validation՝ Developers, Freelancers և Offices, որոնք ունեն միջազգային աշխատանքային հաղորդակցություն։ Responsive Desktop/Mobile Web։ Թարգմանության մեկնարկային լեզուներն են հայերենը, անգլերենը և ռուսերենը։ UI-ի հայերեն/անգլերեն ընտրությունը նախագծային default է՝ shared locale որոշման ենթակա։ Հաջողությունը գնահատել առաջին օգտակար երկկողմանի զրույցով և կրկնվող աշխատանքային օգտագործմամբ՝ առանց private content analytics-ի։

| Փուլ | Շրջանակ և ավարտի չափանիշ |
| --- | --- |
| **P0 — text first** | Message request և 1:1 personal/authorized Office chat, durable send/ACK, reply/edit/delete, offline/multi-device sync, receipts/privacy, բնօրինակից առանձին text translation, quarantine-ից անցած files, authorized search, minimal notifications, block/report, Marketplace/Network authorized handoff, AI metering և cap։ Բնօրինակը մնում է հասանելի translation failure-ի ժամանակ։ CT-FR-01–12։ |
| **P1 — media և համայնքներ** | Groups՝ դերերով և history visibility-ով, Professional Smart Channels՝ opt-in publication/subscription/moderation, voice messages՝ consent-gated transcription-ով, voice/video calls մինչև **5 մասնակից՝ ներառյալ հրավիրողը**, live translated transcript, հետագա TTS pilot, user-triggered summary/reply suggestions։ CT-FR-13–18։ |
| **P2 — ապացույցով ընդլայնում** | Meeting assistant, task extraction, Office workspace, enterprise controls, channel intelligence, agents և automation։ Ընդլայնումը պահանջում է privacy/authorization, value, cost և operational readiness evidence։ CT-FR-19–20։ |

**P0-ի սահմաններ։** Calls, groups, channels, voice և generative Chat AI-ը տեղափոխված են համապատասխան P1/P2 հոսքեր։ Ապագա Secure Chat/E2EE-ն առանձին նախագծում է։ Recording-ը լռելյայն անջատված է, AI auto-send չի նախատեսվում, Chat AI-ն չի իրականացնում Marketplace գործարք կամ Network action։ Native apps, public channel quota և production tariff այս փաթեթում չեն ընտրվում։

| UI / journey | Առաջարկվող ընթացք |
| --- | --- |
| **Chats և conversation** | Օգտատերն ընտրում է personal կամ թույլատրված Office context, բացում է chat request-ը կամ domain handoff-ը, գրում բնօրինակը, տեսնում pending → sent → delivered/read վիճակները։ Retry-ն պահում է նույն message key-ը։ Reconnect-ը համադրում է նոր և փոփոխված հաղորդագրությունները։ |
| **Translation և Files** | Chat view-ը միշտ տարբերակում է original և machine translation-ը։ Translation pending/unavailable/quota-exhausted վիճակները չեն արգելափակում մուտքագրումը։ File-ը մինչև scan approval ցուցադրվում է որպես quarantined, իսկ մերժումը ունի անվտանգ պատճառ։ |
| **Settings և Office switcher** | Լեզու, notification/mute, consent, receipts, block և usage controls։ Office context-ը տեսանելի է compose/history/usage-ում։ Role կամ membership revoke-ից հետո պաշտպանված տվյալները թաքցվում են, և սարքը մաքրում է իր թույլտվությամբ կառավարվող cache-ը։ |
| **P1 Groups, Channels և Call Room** | Group invite և history access, channel subscription և source-authorized opt-in publishing, device preview, role/seat admission, consent state, live transcript և interruption/reconnect UI։ |
| **Admin / Safety** | Case-scoped report/moderation, review և redacted usage/incident տեսք։ Sensitive access-ը պատճառաբանված ու audit-ով է։ |

Web UX-ը նախագծել keyboard navigation, screen-reader status, network/permission failures և original-ի ընթեռնելիություն հաշվի առնելով։ WCAG 2.2 AA-ն նախագծային թիրախ է և պետք է ստուգվի։

## 02. Business & Financial Finalization

| Շերտ | Սահման և բաց որոշում |
| --- | --- |
| **Free core** | Text send/receive, blocking/reporting և հիմնական անվտանգության գործառույթներ։ Սահմանափակ փորձնական translation allowance։ Storage և P1 call allowance/limits-ը վավերացնել ըստ workload-ի։ |
| **Premium և B2B** | Professional subscription-ի թեկնածու՝ հավելյալ AI allowance կամ tools։ Office subscription-ի թեկնածու՝ Organization usage pool, budget owner, role-based reporting։ Usage-based call translation-ը P1 paid feature-ի թեկնածու է։ Ընդհանուր billing contract-ը Shared Payments-ի որոշում է։ |
| **Channel promotion** | Հետագա թեկնածու՝ հստակ պիտակավորված sponsored cards, նույն source eligibility և moderation կանոններով։ Quota-ի հետ կապը, placement-ը և consent/terms-ը սպասում են Shared Platform և Owner review-ի։ |
| **Գին և pilot բյուջե** | v1.0-ի **$4.99 Professional** և **$19.99 Office** թվերը փորձարարական վարկածներ են։ v1.0-ի **$65–200/ամիս** P0 infrastructure օրինակը գնահատման հենակետ է։ Այն չի ընդգրկում AI/media, աշխատուժը կամ հարկերը և provider quote չէ։ Shared ծառայությունների ծախսը հաշվարկել մեկ անգամ՝ փաստագրված allocation-ով։ |

**Metering և spend controls։** Յուրաքանչյուր translation/AI գործողություն ունի deduped operation key ու payer principal։ Atomic reservation-ը ստուգում է feature allowance-ը, անհատի/Office-ի և platform spend cap-ը։ Ledger-ը պահում է `reserved → consumed / released / uncertain → reconciled` անցումները։ Չափել provider units-ը և առանձնացնել customer charge-ը provider spend-ից։ Timeout-ից հետո նախ համադրել operation-ը provider reference-ով, ապա որոշել retry-ը կամ release-ը։ Concurrent requests-ը չեն անցնում cap-ը։ Office usage-ը չի խառնվում personal usage-ին։ Circuit breaker-ը և feature kill switch-ը կանգնեցնում են AI սպառումը՝ պահպանելով core chat-ը։ Overage-ն ակտիվանում է միայն հաստատված պայմաններով և հստակ համաձայնությամբ։

**Unit economics և չափում։**

- Text cost = թարգմանված billable units × vendor rate ըստ locale/provider-ի + retries + allocated compute, storage և egress։ Payer-ի actual units-ը կապել operation ledger-ին։ Մեկ message-ը մի քանի լեզու թարգմանելիս հաշվել յուրաքանչյուր target-ը։
- Call cost = participant media-minutes + relay/egress + consented STT audio-minutes + translation units ըստ target locale-ի + TTS units։ Յուրաքանչյուր բաղադրիչը բազմապատկել provider-ի փաստագրված rate-ով։ Source audio, retries և failed attempts-ը գնահատել առանձին։
- Pilot contribution = հաստատվող revenue − provider/media fees − allocated infrastructure − review/support/refunds և կիրառելի հարկային բաղադրիչներ։ Չափել երկկողմանի usage, ակտիվ translator-ի ծախս, դարձի հաճախականություն, cap hits և break-even պահանջվող օգտատերերի ծավալ։ Թվային գինը, վճարային տրամաբանությունը և profitability threshold-ը սպասում են pilot evidence-ի ու Owner approval-ի։

## 03. Trust & Ecosystem Finalization

### Authorization և security baseline

| Գործողություն | Personal actor | Office actor | Service/Admin |
| --- | --- | --- | --- |
| Read/send/sync/search/receipt | Ընթացիկ conversation member, request/block և history policy։ | Ընթացիկ Organization membership և conversation membership, server-verified principal ու action scope։ | Worker-ին միայն իր գործողության scoped access։ Admin-ը conversation access չունի լռելյայն։ |
| Edit/delete | Սեփական message, `expectedRevision` և policy։ | Նույնը՝ գործող Office իրավասությամբ։ | Case-scoped moderation, պատճառ, expiry և audit։ |
| Attach/download | Member, attachment reference, clean digest և ընթացիկ access։ | Երկու memberships-ը, clean state և Office scope։ | Scanner-ին նվազագույն quarantine access, operator-ին՝ սահմանափակ case access։ |
| Translate / Chat AI | Current resource access, conversation policy, պահանջվող consent և quota։ | Նույն ստուգումները՝ Organization policy և payer scope-ով։ | Adapter-ին նվազագույն context։ Ստուգել scope-ը կանչից առաջ և արդյունքը վերադարձնելուց առաջ։ |
| Call/publish/report | Call seat և consent ըստ policy-ի։ Publication՝ source owner opt-in։ Report՝ իրավասու resource։ | Գործող Office դեր և source իրավասություն։ | Moderation-ը տնօրինում է projection visibility-ն և audit-ը։ Source mutation-ը մնում է համապատասխան դոմենում։ |

- **Mandatory controls։** Secrets/credentials-ի պաշտպանություն, external input validation, server-side deny-by-default/resource authorization, անվտանգ password hashing՝ գաղտնաբառ պահելիս, parameterized queries և զգայուն տվյալներից զերծ errors/logs։ CORS allowlist և CSRF պաշտպանությունը պարտադիր են, իսկ WebSocket Origin, session expiry/revocation և command authorization-ը ստուգվում են առանձին։ Չլուծված Critical dependency vulnerability-ն կանգնեցնում է ազդված աշխատանքը։ [Security invariants](../../AGENTS.md#security-invariants) · [Security rule](../../.cursor/rules/08-security.mdc)
- **Cloud privacy։** TLS և encryption at rest՝ հաստատված key management-ով։ **Encrypted Cloud Chat-ը E2EE չէ**։ Պահանջվող համաձայնության բացակայությունը կանգնեցնում է provider processing-ը։ Translation, recording և պահպանվող transcript-ը ունեն առանձին consent scopes։ Revoke-ը կանգնեցնում է նոր աշխատանքը, չեղարկում pending delivery-ն և կառավարվում approved provider retention policy-ով։ E2EE/AI համատեղումը պահանջում է առանձին privacy design։
- **Retention և deletion։** Records-ը դասակարգել original/revision, translation, attachment, search/presence cache, case/audit, transcript, backup և provider copy տեսակներով։ Delete-ը անմիջապես թաքցնում է տվյալը ընթացիկ views-ից և տարածում versioned tombstone/purge operation դեպի որոնում, translation, download և projections։ Նշել bounded propagation և backup expiry նպատակներ։ Restore-ից հետո, մինչև ծառայությունը վերաբացելը, նորից կիրառել delete/revoke markers-ը և կատարել integrity check։ Legal hold-ը պահանջում է սահմանափակ իրավասություն ու audit։ Ժամկետները և export/provider deletion ընթացքը պետք է հաստատել։
- **Files և abuse։** Upload intent-ը կապել conversation/principal-ին, սահմանել MIME/size/signature/archive limits։ Scanner approval-ը կապել immutable digest-ին։ Scan error/timeout-ը պահում է private quarantine-ը։ Download request-ում ստուգել clean state, current membership և revoke/block, ապա տալ կարճաժամկետ credential։ Արդեն տրված credential-ի emergency cutoff-ը և in-flight transfer վարքը փորձարկել Shared Storage-ի հետ։ Block-ը գերակայում է նոր request/handoff-ին։ Reports-ը case-scoped է, permissions-ը՝ least privilege և audit։ Abuse/rate limits-ը կիրառել actor/principal/resource մակարդակով։
- **AI և logging։** Chat text-ը անվստահելի input է։ Context-ը սահմանափակել actor/principal/conversation/authorized resource scope-ով։ Provider output-ը ցուցադրվում է user review-ով։ Provider-ին տալ նվազագույն տվյալը։ Message body, transcript, token, key և signed URL չեն հայտնվում logs/traces/events-ում։

### Shared contracts և cross-domain ownership

| Կողմ | Պայմանագրի առաջարկ և failure boundary |
| --- | --- |
| **Identity / Organizations** | Actor, principal, session/membership version և revoke event։ Office onboarding mapping-ը հաստատել աշխատանքային Platform Specification-ի հետ։ Հետկանչը փակել հաջորդ protected REST/WS/sync/search/download/AI գործողություններում և invalidate անել subscription-ը։ |
| **Marketplace / Professional Network** | Authorized handoff՝ opaque source ref, participant scope և current source permission։ Marketplace-ը տնօրինում է listing/order/grant/support case-ը, Network-ը՝ job/application/profile-ը։ Messenger-ը տնօրինում է conversation/message/membership-ը։ Handoff revoke-ը փակում է source link-ի access-ը՝ ըստ հաստատված conversation history policy-ի։ Marketplace checkout և native support-ը շարունակում են աշխատել Messenger outage-ի ժամանակ։ |
| **Channels** | Professional Channels-ը source projections են։ Առանձին սահմանել assignment/subscription/audience և owner opt-in։ Source-owner eligibility, versioned publish/update/unpublish և tombstone։ Retry-ը idempotent է, republish-ը նոր explicit intent է՝ shared quota recheck-ով։ Stale event-ը չի վերականգնում հեռացված գրառումը։ Moderation-ը սահմանափակում է projection visibility-ն audit-ով։ Quota owner, limits, window և release/reclaim հաշվարկը Shared Platform Pending է։ |
| **Custom AI / Realtime Translation** | Shared service-ը սահմանում է provider policy, consent scope, adapter և data lifecycle։ Messenger-ը սահմանում է conversation eligibility և user-triggered context-ը։ Core chat-ը աշխատում է AI outage-ի կամ cap-ի ժամանակ։ |
| **Payments / Storage / Notifications** | Shared Payments-ը տնօրինում է charge/refund և statements, Messenger-ը՝ usage/allowance enforcement։ Shared Storage-ը տալիս է private bytes, scan և signed access primitives, Messenger-ը որոշում է file eligibility-ն։ Notifications-ը ստանում է minimal event, permission-aware routing և retry/dedupe։ Failure-ը չի խափանում message commit-ը։ |
| **Infrastructure** | Shared review-ը հաստատում է DB ownership/regions, runtime, queue/cache, observability, recovery և cost allocation։ P1 media plane-ը և AI workers-ը մեկուսացված են messaging core-ի ծանրաբեռնվածությունից։ |

## 04. Technical Finalization

### Մոդուլներ, տրամաբանական տվյալներ և անցումներ

| Մոդուլ | Տվյալների սեփականություն և կապեր |
| --- | --- |
| **Conversation / Messaging** | Conversation → ConversationMember և Message։ Member-ը կապում է actor/principal, role, joined/left և history policy։ Message-ին կապվում են immutable MessageRevision-ները, actor/principal և unique conversation sequence/client key։ MemberReceipt-ը պահում է monotonic delivered/read cursors։ DeviceSyncCheckpoint-ը պահում է կիրառված change cursor-ը։ |
| **Translation / AI / Usage** | MessageRevision → MessageTranslation ըստ target locale-ի և policy epoch-ի։ AIRequest-ը պահում է scoped context reference և consent version։ UsageReservation/UsageRecord-ը կապվում է որոշակի operationId-ի և payer principal-ի հետ։ |
| **Files / Safety** | Attachment-ը կապված է conversation/context-ի, object ref-ի, immutable digest-ի և scan state-ի հետ։ BlockRelation, Report, ModerationAction և AuditRecord-ը պահում են scope ու provenance։ |
| **Presence / Projection** | Presence-ը ժամանակավոր actor/context presence է՝ TTL, audience և privacyով։ Channel, Subscription, ChannelPost-ը պահում են source ref/version, publication version և visibility։ Search projection-ը rebuildable է և ուղիղ access authority չի տալիս։ |
| **Calls (P1)** | CallSession → CallParticipant, ConsentRecord և TranscriptSegment։ Stable participant ref-ը կապվում է authorized membership-ին։ Transcript segment-ն ունի speaker, ordered segment/revision և retention class։ |
| **Integration / outbox** | ConversationChange-ը պահում է durable change cursor։ OutboxEvent-ը կապվում է նույն business transaction-ին, պարունակում է version/minimal reference և relay status։ Consumer dedupe/inbox-ը կապվում է eventId-ին։ |

Աղյուսակը logical model է։ Entity cardinality, isolation, partitioning և physical indexes-ը ենթակա են վերջնական architecture review-ի։

| Aggregate | Առաջարկվող state machine |
| --- | --- |
| Message | `client pending → committed → visible`։ Edit-ը ավելացնում է revision, delete-ը՝ tombstone, purge-ը հետևում է approved retention-ին։ Delivery/read-ն առանձին member state է։ |
| Translation | `queued → processing → ready / retryable failed / terminal failed / skipped`։ Նոր revision, delete կամ policy/consent revoke → obsolete։ |
| Attachment | `intent → quarantined → scanning → clean / rejected / expired`։ Block-ը կարող է փակել նախկին clean artifact-ը։ |
| Usage / Outbox | Usage `reserved → consumed / released / uncertain → reconciled`։ Relay `pending → dispatched` կամ backoff/review queue, consumer-ը idempotent է։ |
| Call / Channel | Call `initiated → ringing → active → ended`, participant-ը `joined → reconnecting → joined / left`։ Channel post `opt-in → published → hidden / unpublished`՝ publication version-ով և tombstone-ով։ |

### REST և real-time պայմանագրեր

REST base՝ `/api/v1`։ Հայտնի paths-ը վերցված են v1.0-ից։ Server-ը ստուգում է schema, actor/principal context, resource permission և applicable rate limit-ը։ Սխալները ունեն stable code/correlationId և չեն պարունակում sensitive content։ Idempotency կամ revision mismatch-ը 409 է, rate/quota limit-ը՝ 429։ 401/403/404 disclosure policy-ն ենթակա է shared API review-ի։

| Method և path՝ base-ին հարաբերական | Առաջարկվող semantics |
| --- | --- |
| POST, GET `/conversations` | Authorized create/get կամ member-scoped cursor list։ Create-ը idempotent է ըստ participants/context/request policy-ի։ |
| GET, POST `/conversations/:id/messages` | Պատմություն, proposed durable delta կամ snapshot fallback՝ opaque cursor-ով։ Send-ը ստանում է clientMessageId, body/attachment refs և reply ref, վերադարձնում է committed ACK։ |
| PATCH, DELETE `/messages/:id` | Expected revision, author/case policy, նոր revision կամ idempotent tombstone։ |
| POST `/messages/:id/translations` | Revision, targetLocale, policy/consent check, deduped job և status reference։ |
| POST `/attachments`, GET `/attachments/:id/download` | Scoped quarantine intent կամ authorized clean artifact access։ |
| PATCH `/preferences`, POST `/reports`, GET `/usage` | Լեզու/consent/privacy, case-scoped abuse report և principal-scoped meter view։ |
| `/channels` և `/calls` (P1) | Հետագա versioned API contracts։ Publication eligibility/quota, call admission/consent և credential issuance-ը նախատեսված են առանձին review-ով։ |

**Event envelope։** `eventId, type, schemaVersion, aggregateId, aggregateVersion, occurredAt, correlationId, minimalReference`։ Conversation-scoped events-ը ներառում են change cursor և կիրառելի revision/sequence։ v1.0-ի events-ը՝ `message.created/updated/deleted`, `translation.ready/failed`, `receipt.updated`, `presence.changed`, `call.started/ended` (P1)։ Proposed control events-ը՝ scoped revocation և resync-required։ Push payload-ը նվազագույն է, պաշտպանված content-ը հասանելի է permission recheck-ով։ Subscriptions-ը ստուգում են Origin, session և membership-ը, commands-ը կիրառում են նույն domain auth-ը, ինչ REST-ը։ Consumer-ը dedupe է անում eventId-ով, անտեսում հին aggregateVersion-ը և gap-ի դեպքում սկսում sync։

### Messaging durability և ֆոնային աշխատանք

1. **Commit։** Client-ի `clientMessageId`-ն ապրում է retry-ների ընթացքում։ Unique key-ը ներառում է conversation, actor և principal։ Մեկ transaction-ում ստուգել membership/block, հերթագրել conversation-level `messageSequence`, պահել Message/Revision/Change և outbox։ ACK-ը միայն commit-ից հետո։ Նույն key/payload-ը կրկին վերադարձնում է նույն ACK-ը, այլ payload-ը՝ conflict։
2. **Delivery և sync։** Socket.IO/WebSocket-ը online ազդանշանի շերտն է։ `messageSequence`-ը հաղորդագրության դիրքն է, `changeCursor`-ը ներառում է create/edit/delete/receipt փոփոխությունները։ Յուրաքանչյուր device առաջ է տանում cursor-ը կիրառված delta-ից հետո։ Reconnect-ը ստանում է missing changes, cursor expiry-ն՝ authorization-ով սահմանափակված snapshot և նոր cursor։ Հնացած revision-ը չի վերակենդանացնում tombstone-ը։ [Socket.IO delivery guarantees](https://socket.io/docs/v4/delivery-guarantees/)
3. **Receipts/revoke։** Delivered-ը ստացողի առնվազն մեկ լիազորված սարքի apply ACK-ն է, read-ը՝ viewing գործողություն privacy policy-ի ներքո։ Member cursors-ը միատոն են և չեն շրջանցում history visibility-ն։ Revoke-ը կանգնեցնում է հաջորդ protected access-ը և invalidation է ուղարկում WS subscription/cache/queued jobs-ին։
4. **Outbox և workers։** Commit-ից հետո relay-ը at-least-once է։ Consumers-ը dedupe են անում eventId-ով և ստուգում ordering/version-ը։ Երբ gateway/queue-ն անհասանելի է, durable log/snapshot-ը պահպանում է replay հնարավորությունը։ Bounded retry, backpressure, poisoned-event review և operator runbook։ Translation, files, notifications և projection workers-ը ունեն առանձին limits։ [Transactional outbox pattern](https://microservices.io/patterns/data/transactional-outbox.html)

### Translation, cache, files և media

- **Text pipeline։** Explicit language hint կամ detection՝ unknown/mixed fallback-ով։ Canonical dedupe՝ revision + locale + applicable policy epoch նույն conversation-ի սահմանում։ Worker-ը checks է անում current revision/access/consent/quota, adapter-ին փոխանցում նվազագույն source-ը, normalize անում quality/error/usage արդյունքը, commit-ից ու delivery-ից առաջ նորից recheck անում։ Stale result-ը չի ցուցադրվում։ Transient failure-ը bounded backoff ունի, uncertain billing-ը գնում է reconciliation։ Provider failover-ը պահանջում է համարժեք approved data policy։ Բնօրինակը հասանելի է բոլոր fallback-ներում։
- **Cache/presence/files։** Cache-ը վերստեղծելի է և current membership-ի աղբյուր չի հանդիսանում։ Presence-ը ունի short TTL, privacy audience և aggregate multi-device connection state։ Search/realtime projections-ը մաքրվում են versioned revoke/delete-ով։ File-ը private storage-ում է՝ quarantine → scan → clean, digest-bound approval և signed access recheck։
- **P1 media։** WebRTC/ICE/STUN/TURN + SFU plane՝ scoped credentials, ատոմային առավելագույն 5 slot և idempotent reconnect։ LiveKit-ը թեկնածու է։ Consented per-speaker stream → STT → versioned partial/final segment → translation → live transcript։ TTS-ը validation-ից հետո առանձին pilot է։ Network/audio interruption-ը նշում կամ ավարտում է open segment-ը և վերսկսում նոր segment ID-ով։ AI failure-ը թողնում է normal call, media failure-ը անցնում է bounded reconnect կամ clear end։ Consent revoke-ը փակում է processing stream-ը և չեղարկում հնացած արդյունքները։ Recording-ը default off է, persistent transcript-ը պահանջում է հաստատված consent/retention։

### Technology candidates և Platform review

| Թեկնածու | Համապատասխանություն և ստուգում |
| --- | --- |
| **TypeScript, Next.js, React** | Typed contracts և responsive chat UI։ Ստուգել SSR/client boundaries, offline state, accessibility, exact peer versions և team maintenance։ |
| **NestJS, Express, REST/OpenAPI** | Module boundaries, HTTP validation/auth և contract tooling։ Ստուգել middleware order, cookie/CSRF ու WS integration, build/test և shared API conventions։ |
| **PostgreSQL, Prisma** | Durable transactions, unique message keys, conversation ordering և outbox։ Ստուգել transaction/locking contention-ը, migration/recovery semantics-ը և ORM-ի աջակցությունը անհրաժեշտ constraints-ին։ Physical schema-ն սպասում է shared data ownership-ին։ |
| **Socket.IO** | Online fanout և reconnect UX։ Պահանջվում են durable replay, auth rechecks, multi-instance adapter/load և delivery failure tests։ |
| **Redis, BullMQ** | Presence/rate-limit state, cache և background job թեկնածուներ։ Համեմատել DB-backed queues-ի հետ ըստ cross-domain workload, scheduling, backpressure, worker retries, recovery և total cost-ի։ Durable business state-ը մնում է հաստատված հեղինակավոր store-ում։ |
| **S3-compatible Storage** | Private uploads/downloads, integrity, lifecycle։ Ստուգել digest/metadata, signed URL scope, scan isolation, emergency revoke և restore target provider-ում։ |
| **WebRTC, LiveKit** | WebRTC-ն P1 media protocol-ի ուղղությունն է, LiveKit-ը SFU թեկնածու։ Ստուգել mobile/TURN coverage, admission, consented audio routing, operational cost և failure isolation։ Հայերեն speech support-ը պահանջում է առանձին provider benchmark։ |
| **OpenTelemetry, Docker** | Correlated traces/metrics և reproducible deployment artifacts։ Ստուգել PII redaction, telemetry sampling/cost, image hardening և runtime/region fit։ |

Exact versions, provider availability, legal data terms և վերջնական Platform stack-ը **Shared Platform Pending** են։ Հարթակային workload-ը ներառում է Marketplace, Messaging, Network, notifications, AI/media և shared jobs։ Արագագործության կամ provider compatibility-ի արդյունք այս փաթեթով չի հաստատվում։

### Infrastructure, observability և recovery

- Հաստատել environments/regions, tenancy isolation, secrets/key management, least-privilege identities, DB connection limits, worker capacity/backpressure, private storage և առանձնացված P1 media resources։ DB, object store, AI, TURN/egress և telemetry cost-ը չափել pilot load-ով։
- Metrics՝ commit latency/error, outbox lag, reconnect gaps, translation latency/stale drops, provider spend, failed scans, quota mismatch, WS connection count, P1 jitter/packet loss և turn relay ratio։ Correlation ID-ները կապում են ACK → outbox → consumer առանց payload-ի արտահոսքի։ Նշանակել alert owners և operational runbooks։
- Պլանավորել encrypted database backup/PITR և private object recovery ըստ approved provider-ի։ Restore drill-ում ստուգել sequence/unique key, aggregate versions, tombstones, revoked memberships, usage reconciliation, object digest links և projection rebuild։ Չվերաբացել պաշտպանված հին վիճակը մինչև ստուգման ավարտը։

| ID | Թիրախ / պահանջ և ապացույց |
| --- | --- |
| CT-NFR-01 | Commit ACK p95 ≤ 300 ms՝ համաձայնեցված P0 pilot region/load-ում։ Չափել commit-ից հետո ACK-ը։ |
| CT-NFR-02 | Online delivery p95 ≤ 500 ms նույն test profile-ում, Gateway և client apply փուլերն առանձնացնել։ |
| CT-NFR-03 | Կարճ translation p95 ≤ 2 վրկ՝ ընտրված լեզուներով, provider latency-ն չափել առանձին։ |
| CT-NFR-04 | P1 final translated segment p95 ≤ 3 վրկ segment boundary-ից։ |
| CT-NFR-05 | Idempotency թեստում 0 duplicate logical message։ |
| CT-NFR-06 | Core availability-ի թեկնածու թիրախ՝ 99.9% ամսական, AI availability-ն չափել առանձին։ |
| CT-NFR-07 | RPO ≤ 15 րոպե, RTO ≤ 2 ժամ՝ restore drill-ով վավերացվող թիրախներ։ |
| CT-NFR-08 | Ազդված աշխատանքում հայտնի չլուծված Critical vulnerabilities՝ 0։ Չլուծված Critical dependency vulnerability-ն կանգնեցնում է ազդված աշխատանքը։ |
| CT-NFR-09 | 0 հաջող authorization bypass բացասական acceptance cases-ում։ |
| CT-NFR-10 | AI outage կամ spend cap-ը չի կանգնեցնում message commit-ը։ |

Latency, availability և recovery թվերը v1.0-ի չվավերացված թիրախներ են։ Չափումից առաջ հաստատել test window, regions, devices, message/file sizes, concurrency և workload mix։

## 05. Implementation Readiness

### Project size, փուլեր և vertical slices

**B delivery scope**՝ 1:1 chat, translation, files և shared handoff՝ հստակ սահմաններով, մեկ համատեղելի Platform architecture-ի վրա։ **C domain complexity**՝ groups, multi-tenant channels, realtime media, translation pipelines և enterprise controls։ Shared Platform-ի C գնահատումը մնում է առանձին քննարկման ենթակա։ [Project sizing](../../.agents/skills/project-onboarding/references/project-sizing.md)

| Work package | Արդյունք, փուլ և կախվածություն |
| --- | --- |
| CT-WP-01 | Phase A audit և handoff evidence։ |
| CT-WP-02 | Phase A shared contracts, ADR proposals, threat model, API/data specs։ Initialization-ին անհրաժեշտ output-ը մտնում է Phase A sign-off։ |
| CT-WP-03 | Միայն Phase B authorization-ից հետո foundation, shared identity/auth, observability և recovery boundaries։ |
| CT-WP-04 | P0 conversation/request, durable send→ACK→sync, edit/delete և receipt vertical slice՝ CT-FR-01–05։ |
| CT-WP-05 | P0 revision-safe translation և usage caps՝ CT-FR-06, CT-FR-12։ |
| CT-WP-06 | P0 files/search/notification/safety slice՝ CT-FR-07–10։ |
| CT-WP-07 | P0 Marketplace/Network handoff slice՝ CT-FR-11, shared scope և failure contracts-ով։ |
| CT-WP-08 | P0 security/load/restore hardening, privacy/terms review և controlled pilot evidence։ Release-ը առանձին թույլտվությամբ։ |
| CT-WP-09 | P1 groups, professional channels և voice messages՝ CT-FR-13–15։ |
| CT-WP-10 | P1 calls, translated transcript և validation-ից հետո TTS՝ CT-FR-16–17։ |
| CT-WP-11 | P1 user-triggered Chat AI՝ CT-FR-18։ P2 workspace/agents/enterprise՝ CT-FR-19–20 և evidence gate։ |

### Acceptance և test plan

| Շերտ | Ապացույց |
| --- | --- |
| **Unit** | Authorization policy, message revisions/tombstones, idempotency, quota reservation, usage convergence, call slots և projection version ordering։ |
| **Integration** | Իրական DB transactions և concurrent send, outbox replay, worker restart, stale result/consent revoke, durable cursor և snapshot, quarantine/scan ու signed access։ |
| **Contract** | REST/OpenAPI և event schemas, Identity revocation, Marketplace/Network handoff, notification dedupe, storage block և provider sandbox billing/usage։ |
| **E2E** | Personal/Office request→message→translation→reply, ACK loss և offline multi-device edits, files, block/report, outage independence։ P1՝ five-seat call, consent late join/revoke և reconnect։ |
| **Security** | Negative cross-tenant/rest/ws/search/download/worker tests, CORS/CSRF/WS Origin և stale session, rate/financial cap, prompt injection isolation, attachment rejection, secret/PII redaction, dependency scanning։ |
| **Performance և recovery** | P0 concurrent conversations/conversation-hotspot, reconnect storm, AI backlog և storage/queue exhaustion։ P1 TURN-only, packet loss և overlapping speakers։ Benchmark CT-NFR թիրախներով և restore drill՝ RPO/RTO ու data consistency evidence-ով։ |

### Դարպասներ և արտաքին վավերացում

| Gate | Blocker և փակման ապացույց |
| --- | --- |
| CT-G01 · Initialization | Հաստատված shared scope/size, contracts, TECH_CARD, 01-ARCHITECTURE և նյութական հակասությունների լուծում։ |
| CT-G02 · Կախյալ features | Identity/Office isolation և revoke, Storage/quarantine/cutoff և Notifications contract validation։ |
| CT-G03 · Translation launch | Armenian↔English, Armenian↔Russian, English↔Russian bilingual quality benchmark երկու ուղղությամբ, mixed text/code/URLs, latency, provider region/retention terms և verified quota costs։ |
| CT-G04 · Public launch | Privacy/legal review, consent, retention/export/delete, incident և abuse ownership։ |
| CT-G05 · Pilot / production | Hosting quotes և capacity, load/security/restore արդյունքներ, runbooks և on-call ownership։ |
| CT-G06 · P1 calls | SFU/TURN/mobile, Armenian STT/TTS, audio interruption, five-user load, consent և per-minute cost evidence։ |
| CT-G07 · Paid features | Shared billing/payment, terms, provider usage, unit economics և Owner tariff approval։ |
| CT-G08 · Implementation / release | Համահարթակային Phase A sign-off և **առանձին, հստակ Phase B application initialization authorization**։ Production release-ը ունի առանձին sign-off։ |

Phase A-ի ավարտին գրանցել չափն ու scope-ը, shared contract owners-ը, հաստատված TECH_CARD/01-ARCHITECTURE-ը և չփակված gate-երի պատասխանատուները։ Phase B-ի թույլտվություն այս փաստաթղթով չի տրվում։ [Project onboarding workflow](../../.agents/skills/project-onboarding/SKILL.md)

## Միասնական որոշումների գրանցամատյան

Յուրաքանչյուր սկզբնական ուղղություն **Owner Approved** է դոմենային պլանավորման մակարդակում։ Լուծման մանրամասների ընդհանուր կարգավիճակը **Architect Proposed** է։ Ստորև առանձին նշված են լրացուցիչ gate-երը։ Security invariants-ը պարտադիր են բոլոր տողերի համար։

| ID և հաստատված ուղղություն | Առաջարկվող լուծում / acceptance | Բաց պայման, trade-off և gate |
| --- | --- | --- |
| CT-DEC-001 · Professional Multilingual Messenger | 1:1 աշխատանքային զրույց և authorized handoff։ Denied source/member-ը չի բացում conversation։ | Narrow pilot և shared identity։ **Conditional**՝ pilot evidence, public launch։ |
| CT-DEC-002 · Developers, Freelancers, Offices | Armenia-first pilot, personal և authorized Office journeys, privacy-safe activation չափում։ | Փոքր ընտրանք։ **External Validation Required**՝ demand, pilot launch։ |
| CT-DEC-003 · Text Messaging First | Durable commit/ACK, sequence և change cursor։ Commit-ից հետո drop-ը վերականգնվում է առանց duplicate-ի։ | Change retention և contention։ **Implementation Pending**՝ core feature։ |
| CT-DEC-004 · Armenian / English / Russian | Explicit hint և mixed/unknown fallback։ Չափել բոլոր վեց ուղղությունները։ | Անորոշ input-ի դեպքում լրացուցիչ UX։ **External Validation Required**՝ translation launch։ |
| CT-DEC-005 · Original + Separate Translation | Revision/locale/policy dedupe և stale-result reject։ Բնօրինակը մնում է տեսանելի ձախողման դեպքում։ | Storage/processing overhead և retention։ **Conditional**՝ privacy/provider terms, translation feature։ |
| CT-DEC-006 · Professional Smart Channels | Source opt-in և tombstones։ Հին event-ը չի վերականգնում անջատված քարտը։ | Projection lag և quota trade-off։ **Shared Platform Pending**՝ P1 feature։ |
| CT-DEC-007 · Calls up to five | Atomic admission, նույն slot-ով reconnect, transcript-first։ | Media/TURN և STT cost։ **External Validation Required**՝ P1 calls։ |
| CT-DEC-008 · Context-Aware Chat AI | User-triggered context և suggestions։ Cross-tenant input/auto-send-ը մերժվում են։ | Նվազագույն context, Shared AI scope։ **Shared Platform Pending**՝ P1 feature։ |
| CT-DEC-009 · Freemium + Usage-Based + B2B | Free chat-ը գործում է cap-ից հետո։ Provider charges/replay-ն ունեն dedupe և reconciliation։ | Billing և liability։ **Conditional**՝ validated terms/economics, paid launch։ |
| CT-DEC-010 · Encrypted Cloud Chat | TLS, encryption at rest, scoped access, deletion/restore ստուգում։ | Retention և legal holds։ **External Validation Required**՝ privacy/legal, public launch։ |
| CT-DEC-011 · Independent Messaging Core | AI/media path-ն առանձնացնել commit-ից։ Outage/cap թեստում chat-ը գործում է։ | Worker isolation ու backpressure։ **Implementation Pending**՝ core feature։ |
| CT-DEC-012 · Shared Platform Integration | Actor/principal, membership revoke, scope և failure contracts։ Authorization tests-ը ներառում են stale session։ | Cross-domain sign-off։ **Shared Platform Pending**՝ initialization և կախյալ features։ |
| CT-DEC-013 · Modular Monolith + Workers | Domain boundaries և transactional outbox, replay ու restore ապացույց։ | Scope creep և DB contention։ **Shared Platform Pending**՝ topology/stack, initialization։ |
| CT-DEC-014 · AI Provider Adapter Architecture | Normalize errors/usage, approved routing և bounded retry։ | Provider parity և adapter բեռ։ **External Validation Required**՝ compatibility/terms, AI feature։ |
| CT-DEC-015 · Usage Metering and Cost Protection | Atomic reservations, uncertain reconciliation, per-principal cap և kill switch։ | Բաց reservation-ների հսկում։ **Conditional**՝ billing/cost evidence, paid feature։ |
| CT-DEC-016 · Evidence-Driven Expansion | P1/P2 անցում ըստ quality/privacy/reliability/demand/cost gates-ի։ | Աստիճանական rollout, չափելի pilot։ **Conditional**՝ expansion launch։ |

## Շեղումներ և ճշտումներ Master Architecture v1.0-ից

| v1.0 հիմք | Այս փաթեթի ճշտում |
| --- | --- |
| §4.1 conversation sequence sync | Change cursor-ը բացահայտ ավելացվում է՝ նախկին sequence-ի edit/delete/receipt-ը reconnect-ից հետո վերականգնելու համար։ |
| §3.2 member receipts և §6 access | Device apply ACK, member aggregation և revocation propagation-ը առաջարկվում են որպես protocol semantics։ |
| §4.2 ու §6 translation/consent | Dedupe key, uncertain usage, consent rechecks, stale outputs և retention/export տարբերակները ճշտված են։ E2EE-ն մնում է առանձին ապագա mode։ |
| §9 channels և §10.2 calls | Առաջարկվում են publication version/tombstone և media reconnect/segment ընթացքեր։ Final quota policy-ն ու provider-ը մնում են բաց։ |
| §12՝ CT-WP-02 prerequisite և CT-WP-11 | CT-WP-02-ը Phase A-ի աշխատանք է՝ sign-off-ին նախորդող արդյունքներով։ CT-WP-11-ը պահպանում է FR-18-ը P1-ում և FR-19/20-ը P2-ում։ |
| §10/F04/F05 stack և phase wording | Թեկնածուների տարբերակները, shared scope և rollout authorization-ը հաստատվում են իրենց gate-երով։ Domain B/C scope-ը պահպանվում է։ |

Այս ճշտումները չեն փոխում հաստատված product scope-ը, CT-DEC-ները կամ Marketplace ADR-009-ը։ [Governance Alignment Notes](GOVERNANCE_ALIGNMENT_NOTES_HY.md)

## Պահանջների հետագծելիություն

Ստորև հղումները վերաբերում են [Master Architecture v1.0-ի](MEDUZELLAR_CUSTOM_TELEGRAM_MASTER_ARCHITECTURE_HY.md) առկա ID-ներին։ Նոր թեստային դեպքերը refinement են և v1.0 ID չեն վերցնում։

| Թեմա | Blueprint պահանջներ | Work package / acceptance |
| --- | --- | --- |
| P0 messaging, rights և isolation | CT-BR-01, CT-BR-06 · CT-FR-01, CT-FR-02, CT-FR-03, CT-FR-04, CT-FR-05 · CT-NFR-01, CT-NFR-02, CT-NFR-05, CT-NFR-09 | CT-WP-04 · CT-AT-01, CT-AT-02, CT-AT-03, CT-AT-06, CT-AT-07։ Հավելյալ cases՝ multi-device offline/reconnect, tombstones, stale session։ |
| Translation և usage | CT-BR-02, CT-BR-03, CT-BR-04, CT-BR-08 · CT-FR-06, CT-FR-12 · CT-NFR-03, CT-NFR-10 | CT-WP-05 · CT-AT-04, CT-AT-05, CT-AT-10, CT-AT-11, CT-AT-13։ Հավելյալ cases՝ consent revoke և mixed locale։ |
| Files, search, notifications և safety | CT-FR-07, CT-FR-08, CT-FR-09, CT-FR-10 · CT-NFR-08, CT-NFR-09 | CT-WP-06 · CT-AT-06, CT-AT-08, CT-AT-09, CT-AT-12, CT-AT-18։ |
| Handoff, groups, channels, voice | CT-BR-07, CT-BR-09 · CT-FR-11, CT-FR-13, CT-FR-14, CT-FR-15 | CT-WP-07, CT-WP-09 · CT-AT-12, CT-AT-13, CT-AT-15՝ consent-ի տրամաբանության համար։ |
| P1 calls և P1/P2 AI | CT-BR-05, CT-BR-10, CT-BR-11, CT-BR-12 · CT-FR-16, CT-FR-17, CT-FR-18, CT-FR-19, CT-FR-20 · CT-NFR-04 | CT-WP-10, CT-WP-11 · CT-AT-14, CT-AT-15, CT-AT-16։ Հավելյալ cases՝ TURN-only, audio interruption, cross-context suggestions։ |
| Governance, foundation, pilot և recovery | CT-NFR-06, CT-NFR-07, CT-NFR-08, CT-NFR-09 · CT-G01, CT-G02, CT-G03, CT-G04, CT-G05, CT-G06, CT-G07, CT-G08 | CT-WP-01, CT-WP-02, CT-WP-03, CT-WP-08 · CT-AT-17, CT-AT-18 և փորձարկված gate evidence։ |
