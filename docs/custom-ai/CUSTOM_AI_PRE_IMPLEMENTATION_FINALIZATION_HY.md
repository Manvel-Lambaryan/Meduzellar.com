# Custom AI — Pre-Implementation Finalization

**Phase A · Evolution-Ready Architecture · Implementation Pending · NOT READY։** [ADR-012-ը](ADR-012-CUSTOM-AI-PLANNING-SIGN-OFF_HY.md) ընդունում է Custom AI դոմենային ուղղությունները։ **Platform launch scope՝ Pending։** [Աշխատանքային Platform Specification-ի](../PLATFORM_SPECIFICATION.md) սկզբնական search assistant-ի սահմանը և Custom AI-ի standalone General/Developer Chat P0-ը պահանջում են առանձին Platform rollout որոշում։ Ստորև մանրամասները Architect Proposed են։ Shared Platform Pending-ը նշանակում է բաց shared որոշում, Conditional-ը՝ ապացույցներով պայմանավորված լուծում։ External Validation Required-ը չի նշանակում կատարված ստուգում։ [Master v1.0](MEDUZELLAR_CUSTOM_AI_MASTER_ARCHITECTURE_HY.md) · [Alignment notes](GOVERNANCE_ALIGNMENT_NOTES_HY.md) · [Shared handoff](CUSTOM_AI_SHARED_PLATFORM_DEPENDENCY_HANDOFF_HY.md)

## F01 — Product Finalization

**1. Product & Business։** Մեկ professional ecosystem assistant՝ General Chat, Developer AI և Office journeys-ով։ Սեփական են UX-ը, context policy-ն, runtime orchestration-ը, adapters-ը և cost controls-ը։ External models-ի ընտրությունը բաց է։ Առաջնային լսարան՝ Developers/Freelancers և փոքր Offices, Armenia-first validation։ UI և հայերեն/անգլերեն/ռուսերեն որակը չափվում են առանձին։

| Փուլ | Scope և սահման |
| --- | --- |
| P0 — դոմենային | AI-FR-01–18։ Text-first Q&A, basic code assistance, durable streamed runs, history/rename/delete/cancel/regenerate, TXT/MD/PDF bounded analysis, quotas/usage, shared translation capability contract։ Office context միայն shared Identity և billing contract ունենալու դեպքում։ |
| P1 | AI-FR-19–23։ Authorized Marketplace և Network read, CV/portfolio assistance, Messenger summary/reply suggestions, Office ACL-aware retrieval, opt-in memory ու վերահսկվող low-risk confirmed write pilot։ |
| P2 | AI-FR-24։ Multi-step agents, private deployments, advanced automation ու անհրաժեշտության դեպքում fine-tuning/monitored sandbox՝ առանձին feasibility և approval-ից հետո։ |

P0-ից դուրս են foundation model training-ը, code/shell execution-ը, arbitrary fetch/live search-ը, private context auto-ingestion-ը, ինքնավար գնումը, job application-ը և hiring/rejection-ը։ Messenger P1 calls-ը մնում են P1։ Աուդիտով և ownership-ով հաստատված P1 action allowlist-ը առանձին policy է։

**2. Competitive Intelligence։** Ընդհանուր assistants, coding tools և enterprise retrieval-ը դիտարկել նույն աշխատանքային սցենարներով։ Համեմատել usefulness, factual grounding, language quality, permission boundaries և cost per useful task։ P0 differentiation-ը professional context UX-ն է, իսկ P1-ում՝ կանոնակարգված cross-domain read։ Մրցակիցների ընթացիկ պայմանները և provider capabilities-ը փաստական պնդում չեն այս փաթեթում։

**5. UX & Customer Journey։** Chat Home/history → personal/authorized Office context → prompt կամ quarantined attachment → streaming/usage status → cancel/retry կամ final result → source/limitation review → delete։ Partial output-ը նշվում է որպես incomplete։ Office billing admin-ը տեսնում է scoped totals։ Draft action preview-ն ցույց է տալիս actor, target ու հետևանքը մինչև explicit confirmation։ Ցուցադրել stale/blocked file, quota, read denied և provider-outage վիճակները։ Keyboard/screen-reader streaming UX-ը վավերացնել Web pilot-ում։

## F02 — Business & Financial Finalization

**7. Monetization & Unit Economics։** Free bounded Chat/translation allowance, Professional higher limits/tools և Office shared quota/usage dashboard՝ subscription թեկնածուներ։ P0 usage display-ը անկախ է paid entitlement-ից։ Ուսումնասիրել opt-in հավելյալ usage/credits, առանց surprise charge-ի։ Shared Payments-ը պահում է ֆինանսական charge/refund/statement-ը։ AI Usage-ը պահում է provider unit evidence, cost estimate/reservation և reconciliation-ը։ Messenger-ի և Chat-ի միջև նույն inference operation-ի համար կիրառել մեկ authoritative reservation՝ stable operation ID-ով և domain attribution-ով։

Հաշվարկի հիմքը՝ uncached input/output/cached token units, translation characters ըստ target locale-ի, speech duration, tools/embedding, retries և allocated processing/storage/egress։ Կիրառել versioned rate catalog և integer minor units կամ fixed precision։ Master-ի $0.004/run օրինակը հաշվարկային վարկած է։ Vendor գները, plans, caps, հարկերը, availability և margins չեն հաստատվել։ Paid gate-ը պահանջում է measured pilot և provider/payment sandbox reconciliation։

**8. Marketing & Growth։** Armenia-first փոքր pilot մասնագետների և Offices-ի համար։ Հիմնական չափումներ՝ օգտակար մասնագիտական tasks, first useful response, reuse/retention, cost per useful task, safety և cross-domain adoption։ Օգտագործել permission-based onboarding։ Pilot-ի ծավալը, որակի և cost/SLO շեմերը հաստատել տվյալներից հետո։ P1/P2 ընդլայնումը պահանջում է value, economics, security, legal և operational evidence։

## F03 — Trust & Ecosystem Finalization

**6. Trust, Security & Legal։** Պարտադիր են CORS allowlist, CSRF, external input validation, server-side resource authorization, parameterized queries, գաղտնիքների պաշտպանություն, անվտանգ password hashing երբ գաղտնաբառ է պահվում և sanitized errors/logs։ Չլուծված Critical dependency vulnerability-ն կանգնեցնում է ազդված աշխատանքը։ TLS/encryption at rest և scoped MFA-admin policies։ Server/provider plaintext processing-ը E2EE չէ։ Prompts, attachments և tool outputs ընդունել որպես անվստահելի տվյալ։ Tool registry-ն սահմանափակված է typed allowlist-ով, independent target-domain authorization, context minimization և audit։ Model output-ը sanitize է արվում և չի գործարկվում որպես command։ P0 arbitrary egress/URL fetch-ը փակ է։ [AGENTS.md](../../AGENTS.md#security-invariants) · [Security rule](../../.cursor/rules/08-security.mdc)

| Actor | Թույլատրելի scope |
| --- | --- |
| Personal User | Own conversations/files/runs և թույլատրված source refs։ Deletion-ը անմիջապես փակում է active access-ը։ |
| Office member | Current membership + AI permission + explicit principal + resource ACL։ Revoke-ը կանգնեցնում է SSE-ն, հաջորդ read/retrieval/tool-ը և queued private processing-ը։ |
| Office billing manager | Scoped usage/allowance/invoice references, առանց conversation content-ի լռելյայն հասանելիության։ |
| Worker / provider adapter | Short-lived scoped job capability և նվազագույն անհրաժեշտ տվյալ։ Context կամ credential reuse այլ tenant-ում չի թույլատրվում։ |
| Support / responder | Redacted operational metadata։ Sensitive exception access-ը case-scoped, ժամկետով և audit-ով՝ ըստ հաստատված privacy policy-ի։ |

Private attachments՝ upload intent → quarantine → digest-bound scan → isolated extraction → bounded context։ Fail-closed scan, no execution և no arbitrary parser network access։ Delete-ը փակում է access-ը, ստեղծում deletion job ու purge markers cached context/chunks/provider requests-ի համար։ Backup expiry, legal hold և provider retention/data transfer պետք է իրավաբանորեն հաստատել։ Memory-ն առանձին opt-in է, private content training-ի համար պահանջվում է առանձին թույլտվություն։ SSE-ում authorization-ը ստուգվում է subscribe, reconnect և revoke-ի պահին։ Հեղինակավոր read-ը կրկին ստուգում է ACL-ը նույնիսկ cached projection-ի առկայությամբ։

**9. Ecosystem Integration։** Marketplace-ը պահում է listing/order/entitlement և support case-ը։ Network-ը՝ profile/job/application և human hiring decision-ը։ Communication-ը՝ conversation/revision/consent/call-ը։ Shared AI Gateway-ը մոդելավորում է provider calls/usage, ոչ domain mutations։ Shared translation-ն աշխատում է անկախ AI Chat conversation/subscription-ից։ P1 tool outputs-ը վերադարձնում են scoped opaque refs/citations, tombstone-ը հեռացնում է հնացած projection-ը։ AI outage-ը թողնում է checkout, application, original chat և սովորական call գործունակ։ [Shared Handoff](CUSTOM_AI_SHARED_PLATFORM_DEPENDENCY_HANDOFF_HY.md)

## F04 — Technical Finalization

**3. Domain Architecture։** Logical modules՝ Conversations, Orchestrator, Shared AI Gateway, Knowledge/Retrieval, Tool Governance, Files/Extraction, Usage/Budget և Evaluation/Safety։ Principal → AIConversation → AIMessage/Run (sequence, parent run/message references)։ Run → ProviderAttempt, UsageReservation, ToolInvocation։ Reservation → UsageRecords evidence-ով։ KnowledgeDocument/Chunk-ը ունի versioned ACL/source reference։ File analysis-ը հղվում է owner principal, digest և retained extraction ref-ին։ ActionApproval-ը կապվում է մեկ invocation/payload digest-ին։ ConsentRecord, DeletionJob, OutboxEvent և AuditEvent-ը պահում են minimal refs։ Domain service-ին ուղղակի այլ DB tables հասանելիություն չի տրվում։

| State machine | Կարևոր անցումներ |
| --- | --- |
| Run | CREATED → RESERVED → QUEUED/RUNNING → STREAMING → COMPLETED/FAILED/CANCELLED։ Անորոշ provider usage-ը գրանցվում է UNKNOWN_USAGE և reconciles առանձին։ |
| Reservation | RESERVED → SETTLED/RELEASED/RECONCILIATION_PENDING։ Cancel-ը չի զրոյացնում անվերապահ provider cost-ը։ |
| Attachment / delete | UPLOADED → QUARANTINED → SCANNED → EXTRACTED → READY/REJECTED։ Delete՝ REQUESTED → ACCESS_REVOKED → PURGE_PENDING → PURGED/LEGAL_HOLD։ |
| P1 invocation | PROPOSED → AUTHORIZED կամ CONFIRMATION_REQUIRED → APPROVED → EXECUTING → SUCCEEDED/FAILED/UNKNOWN։ Payload change/expiry/revoke-ը չեղարկում է approval-ը։ |

**4. Functional Architecture։** Actor/principal + client request ID + payload identity-ն dedupe է անում logical run-ը։ Atomic preflight-ը նույն transaction-ում պահում է user message, run, scoped reservation և outbox։ Provider attempt-ը ունի stable ref, deadline, caps ու uncertain outcome։ Durable status և bounded partial output-ը թույլ են տալիս reconnect կամ final fetch։ Auto retry-ը միայն transient և վերահսկելի դեպքերում է, policy-compatible fallback-ը՝ մինչև visible output։ Նոր user regenerate-ը նոր run/branch է։ Outbox consumers-ը idempotent են։ Interruption-ը կանգնեցնում է local delivery-ն և հնարավորության դեպքում upstream-ը, ֆինանսական reconciliation-ը մնում է առանձին։

| REST draft՝ /api/v1/ai | Contract |
| --- | --- |
| POST/GET /conversations, PATCH/DELETE /conversations/:id, GET /conversations/:id/messages | Actor+principal scope, cursor և version, delete job և անմիջական revoke։ |
| POST /conversations/:id/runs, GET /runs/:id, GET /runs/:id/events, POST /runs/:id/cancel | Idempotent admission/202, durable status ու authorized SSE cursor, replay window և idempotent cancel։ |
| POST /attachments, GET /usage | Private upload intent և principal-scoped measured usage/pending exposure։ |
| POST /tool-invocations/:id/confirm | P1 digest/actor/principal/expiry-bound confirmation։ Execution-ը target domain-ում recheck է անում permission/version և stable mutation key։ |

Internal capabilities՝ `translate(authorized input, locales, purpose, operationId, budget scope)`, `transcribe(consented audio ref, locale, deadline)`, `synthesize(authorized text, locale, permitted voice, budget)`։ REST errors՝ 401/403/404 privacy policy, 409 conflict, 429 quota, 503 provider unavailable։ Event draft՝ `run.started`, `output.delta`, `run.completed`, `run.failed`, `usage.settled`, `attachment.ready`, `deletion.completed`։ SSE deltas-ը sequence/replay են, durable outcomes-ը՝ versioned outbox։ Envelope՝ event ID, scope, aggregate/version, correlation/time, minimal refs։ Source revoke-ին հաջորդող response/tool call-ը նորից ստուգում է current authorization-ը։

**10. Technical System Architecture։** Modular monolith + isolated worker, TypeScript, Next.js/React, NestJS/Express, PostgreSQL/Prisma, REST/OpenAPI, SSE, transactional outbox, S3-compatible private storage, Docker և OpenTelemetry՝ թեկնածուներ։ Redis/BullMQ-ը համեմատել DB-backed work coordination-ի հետ ամբողջ Platform-ի quota, translation, scan և notification բեռով։ Vector search-ը P1 candidate է measured retrieval quality, ACL և deletion evidence-ից հետո։ Adapter interface-ը normalize է անում capability/model alias, deadlines, cancellation, usage/error classification և provider request ID։ P0-ում մեկ վավերացված առաջնային provider-ի տարբերակը նվազեցնում է routing complexity-ն։ Fallback-ը ենթակա է policy/region/budget parity-ին։ Exact versions, operational costs, regions, physical storage և provider choices մնում են Shared Platform Pending։

## F05 — Implementation Readiness

**11. Quality & Operational Architecture։** Unit՝ route policy, budget/dedupe, tool confirmation/invalidation և context auth։ Real DB integration՝ parallel admission, unknown usage, outbox/replay, delete/revoke։ Contract՝ scoped source ACL, quota/payments sandbox, provider streaming/cancel/evidence, Storage scanner և Messenger capability։ E2E՝ upload→run→cancel/reconnect/delete, Office revoke mid-stream և outage isolation։ Security cases՝ malicious file, prompt injection, unsafe output rendering, wrong tenant, stale context և CORS/CSRF։ P1՝ changed confirmation digest, replay և no autonomous hiring։ Load/restore՝ first-token, queue/spend spikes, restore marker replay և billing reconciliation։ Metrics՝ time-to-first-token, denial/revoke, stale chunks, unknown usage, provider cost velocity, deletion backlog։ Runbooks և quality/security/billing owners նշանակել pilot-ից առաջ։

| NFR | Blueprint թիրախ և չափում |
| --- | --- |
| AI-NFR-01, AI-NFR-02, AI-NFR-03 | ACK p95 ≤300 ms առանց inference, first token ≤3 վրկ սահմանված profile-ով, core API 99.9% թեկնածու՝ provider SLO-ն առանձին։ |
| AI-NFR-04, AI-NFR-05, AI-NFR-06 | 0 unauthorized cross-tenant access, 0 duplicate logical run/reservation, concurrency-ով hard local admission caps և external usage reconciliation։ |
| AI-NFR-07, AI-NFR-08 | RPO ≤1 ժամ/RTO ≤4 ժամ թեկնածու՝ restore drill։ Unresolved Critical stop-ը պարտադիր է։ |
| AI-NFR-09, AI-NFR-10 | Access revoke անմիջապես accepted delete-ից հետո, purge SLA-ն ըստ policy/provider-ի։ Versioned multilingual/retrieval evals և նախապես հաստատվող thresholds։ |

**12. Delivery & Staff-Level Documentation։** Առաջարկվող B initial delivery/C long-term domain horizons։ AI-WP-01/02՝ Phase A audit/shared contracts/feasibility։ AI-WP-03 architecture/TECH_CARD approval-ն ու Phase B թույլտվությունն առանձին դարպասներ են։ AI-WP-04–10՝ authorized conversations → durable stream/cancel → budgets → adapters/languages → secure files/delete → safety/restore → shared translation pilot։ AI-WP-11՝ P1 retrieval/Office/memory/confirmed action։ AI-WP-12՝ P2 expansion։ ADR թեկնածուներ՝ gateway/adapter, run/stream, reservation, ACL/tool policy, extraction, deletion և shared capability ownership։ Official IDs-ը հատկացնել միայն առանձին approval-ով։

| Gate | Մնացած ապացույց |
| --- | --- |
| G01/G02/G03/G04 — initialization | Domain directions՝ ADR-012։ Platform launch placement, Identity/usage ownership, shared scope/size, TECH_CARD և 01-ARCHITECTURE, ապա explicit Phase B authorization։ |
| G05 — provider/file | Legal/data terms, հայերեն/անգլերեն/ռուսերեն benchmark, extraction red team, scope/caps/revoke, exact versions/regions և measured cost։ |
| G06/G07 — paid/pilot | Billing sandbox, terms/price և reconciliation, human quality, threat model, load/security/restore, staffing և բյուջե։ Public/paid release-ը սպասում է առանձին sign-off-ի։ |
| G08 — expansion | P1/P2 user value, privacy/fairness, provider compatibility, financial feasibility և rollout/rollback։ |

## AI-DEC գրանցամատյան և շեղումներ

| ID | Owner Approved ուղղություն և բաց պայման |
| --- | --- |
| AI-DEC-001 | Professional ecosystem assistant · Conditional՝ Platform launch placement և demand։ |
| AI-DEC-002 | External models, own orchestration · External Validation Required՝ legal/quality/cost։ |
| AI-DEC-003 | Text-first/bounded files · Conditional՝ secure extraction և release placement։ |
| AI-DEC-004 | Հայերեն/անգլերեն/ռուսերեն · External Validation Required՝ bilingual quality։ |
| AI-DEC-005 | Shared AI capability layer · Shared Platform Pending՝ service ownership։ |
| AI-DEC-006 | Explicit actor/principal · Shared Platform Pending՝ tenant/revoke։ |
| AI-DEC-007 | Policy-aware adapters · External Validation Required՝ compatibility և data terms։ |
| AI-DEC-008 | Durable runs/streaming · Implementation Pending՝ race/replay/revoke checks։ |
| AI-DEC-009 | Freemium, usage և B2B · Conditional՝ paid sandbox/terms/economics։ |
| AI-DEC-010 | Atomic budgets/usage · Implementation Pending՝ concurrent reserve/settle։ |
| AI-DEC-011 | Privacy-first scoped retrieval · Conditional՝ privacy/retention approval։ |
| AI-DEC-012 | AI assists, domains own decisions · Shared Platform Pending՝ source auth։ |
| AI-DEC-013 | Modular monolith/isolated workers · Shared Platform Pending՝ TECH_CARD։ |
| AI-DEC-014 | Explicit confirmation · Architect Proposed՝ immutable digest-bound execution contract, P1 review։ |
| AI-DEC-015 | Opt-in memory/no auto-training · Conditional՝ consent/provider terms։ |
| AI-DEC-016 | Evidence-Driven Expansion · Conditional՝ pilot/release evidence։ |

Նոր սահմանների ճշտումներն են մեկ billable operation-ի ownership-ը, SSE revoke/recovery-ն, policy-compatible fallback-ը, digest-bound confirmation-ը և usage-ի ու ֆինանսական charge-ի բաժանումը։ Platform launch-ի search-only և domain Chat P0 scope mismatch-ը չի լուծվում այս փաթեթով։ Հայտարարված tariffs, provider selection, stack pins կամ approval gates չեն փոխվել։ Platform Phase A՝ Open։ Phase B՝ NOT AUTHORIZED։

## BR/FR/NFR/AT/WP հետագծելիություն

| Հոսք | Master պահանջներ | Work packages / acceptance |
| --- | --- | --- |
| Chat, durable streaming, actor/principal | AI-BR-01, AI-BR-02, AI-BR-03, AI-BR-11 · AI-FR-01, AI-FR-02, AI-FR-03, AI-FR-04, AI-FR-05, AI-FR-06, AI-FR-18 · AI-NFR-01, AI-NFR-02, AI-NFR-03, AI-NFR-04, AI-NFR-05 | AI-WP-04, AI-WP-05 · AI-AT-01, AI-AT-02, AI-AT-03, AI-AT-05, AI-AT-07, AI-AT-08։ |
| Files, safety, retention | AI-BR-04, AI-BR-05, AI-BR-10, AI-BR-12 · AI-FR-07, AI-FR-08, AI-FR-09, AI-FR-15, AI-FR-16 · AI-NFR-08, AI-NFR-09 | AI-WP-08, AI-WP-09 · AI-AT-09, AI-AT-10, AI-AT-11, AI-AT-12, AI-AT-20։ |
| Budget, adapters, translation և quality | AI-BR-06, AI-BR-07 · AI-FR-10, AI-FR-11, AI-FR-12, AI-FR-13, AI-FR-14, AI-FR-17 · AI-NFR-06, AI-NFR-10 | AI-WP-06, AI-WP-07, AI-WP-10 · AI-AT-04, AI-AT-06, AI-AT-13, AI-AT-18։ |
| P1/P2 scoped retrieval, approvals, expansion | AI-BR-08, AI-BR-09, AI-BR-13, AI-BR-14 · AI-FR-19, AI-FR-20, AI-FR-21, AI-FR-22, AI-FR-23, AI-FR-24 | AI-WP-11, AI-WP-12 · AI-AT-14, AI-AT-15, AI-AT-16, AI-AT-17։ |
| Governance, foundation, recovery | AI-NFR-07 · G01, G02, G03, G04, G05, G06, G07, G08 | AI-WP-01, AI-WP-02, AI-WP-03 · AI-AT-19 և առանձին պատվիրակված owner/restore evidence։ |
