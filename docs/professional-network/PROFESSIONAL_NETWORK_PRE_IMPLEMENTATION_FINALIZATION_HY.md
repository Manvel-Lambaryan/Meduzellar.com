# Professional Network & Recruitment — Pre-Implementation Finalization

**Phase A · Evolution-Ready Architecture · Implementation Pending · NOT READY։** Ընդունված դոմենային ուղղությունը փաստագրված է [ADR-011-ում](ADR-011-PROFESSIONAL-NETWORK-PLANNING-SIGN-OFF_HY.md)։ Ստորև նշված նոր պայմանագրերը Architect Proposed են։ Shared Platform Pending-ը նշում է համահարթակային ընտրություններ, Conditional-ը՝ ապացույցով կիրառվող որոշում, External Validation Required-ը՝ չկատարված արտաքին ստուգում։ [Master v1.0](MEDUZELLAR_PROFESSIONAL_NETWORK_MASTER_ARCHITECTURE_HY.md) · [Alignment](GOVERNANCE_ALIGNMENT_NOTES_HY.md) · [Shared handoff](PROFESSIONAL_NETWORK_SHARED_PLATFORM_DEPENDENCY_HANDOFF_HY.md)

## F01 — Product Finalization

**1. Product & Business։** Armenia-first Developers/Freelancers և Offices pilot։ P0-ի ինքնուրույն հոսքը ներառում է public/discoverable/private professional profile, experience/skills, portfolio/project evidence, private CV, public Office էջ ու լիազորված recruiter, աշխատանքների հրապարակում ու զտված search, discoverable թեկնածուներ, անվճար դիմումներ, pipeline, հարցազրույցի հրավեր, safety ու notification։ GitHub-ը ընտրովի է, manual portfolio-ն միշտ հասանելի է։ Marketplace public product link-ը և Messenger authorized handoff-ը պայմանական ինտեգրումներ են։

| Փուլ | Scope |
| --- | --- |
| P0 | PN-FR-01–18։ Work mode-ը՝ remote/on-site/hybrid, engagement type-ը՝ employment/freelance, ֆիլտրերը՝ ըստ skills/location և ներկայացված compensation-ի։ |
| P1 | PN-FR-19–22։ Professional posts/feed, connections/following, evidence enrichment, saved search, recruiter analytics, AI job matching/CV assistance և opt-in job projection։ |
| P2 | PN-FR-23–24։ Enterprise integrations, native Git hosting միայն առանձին feasibility և Owner approval-ից հետո։ |

**2. Competitive Intelligence։** Փորձարկել project evidence-ի արժեքը generic job board/CV և առանձին portfolio workflow-ի դիմաց։ Նույն առաջադրանքներով չափել հայտի որակ, evidence-ի ճիշտ ընկալում, employer response և willingness-to-pay։ Մրցակիցների ընթացիկ հնարավորություններ կամ external data rights չեն հաստատվել։

**5. UX & Customer Journey։** Candidate՝ profile → visibility preview → portfolio evidence → private CV upload → job filters → ընտրած CV snapshot և consent → application status/withdraw → invite acceptance։ Office՝ context switch → public company էջ → job draft/review/publish → assigned pipeline → scoped notes → interview slot/timezone։ Admin-ը աշխատում է fraud/report queue-ով։ UI-ն ցույց է տալիս self-declared/observed/stale evidence-ն ու pending scan-ը։ Ներկայացնել local timezone և սկզբնական timezone-ը, accessible status և manual fallback։ Native Git hosting, private repository ingestion, arbitrary code execution և pay-to-apply դուրս են P0-ից։

## F02 — Business & Financial Finalization

**7. Monetization։** Free candidate core և basic employer pilot։ B2B recruiter workspace subscription, posting packages և հստակ պիտակավորված promotion-ը վարկածներ են։ Eligibility-ն ստանում է versioned Shared Payments entitlement-ը։ Plan expiry-ն սահմանափակում է նոր paid actions-ը և չի ջնջում դիմումների պատմությունը կամ պարտադիր access-ը։ Network job posting limit-ը առանձին է Channel quota-ից։ Չկա հաստատված գին, բյուջե կամ provider։ Contribution per Office = net receipts − fees − attributable search/storage, AI, support, moderation և refunds։ Cost allocations-ը մի հաշվարկել երկրորդ անգամ shared Marketplace/Messenger ենթակառուցվածքում։

**8. Marketing & Growth։** Concierge pilot՝ իրական Armenian software Offices և մասնագետներ։ Չափել եզակի qualified hiring interactions, իրական հրապարակված jobs, employer response, profile completion, cost per interaction և renewal intent։ Հիմնական շեմերն ու փորձնական խմբի չափը հաստատել pilot-ից առաջ։ Ում տվյալը հավաքվում է և ինչ նպատակով՝ փաստագրել։ Outreach-ը permission-based է և չի օգտագործում scraping կամ չպահանջված զանգվածային հաղորդագրություններ։

## F03 — Trust & Ecosystem Finalization

**6. Trust, Security & Legal։** CV-ն լռելյայն մասնավոր է։ Recruiter-ը տեսնում է միայն կոնկրետ application-ին կցված snapshot-ը՝ ընթացիկ Office և job scope-ով։ Portfolio link-ը ինքն իրեն չի ապացուցում ownership, ամբողջական contribution կամ skill certification։ Տարբերակել account linkage-ը, provider metadata-ն, սեփական հավակնությունը և անկախ assessment-ը։ GitHub adapter-ը ստանում է միայն օգտատիրոջ ընտրած public metadata-ն՝ least privilege, authorized API, freshness/revoke, server-side secrets և manual fallback-ով։ Terms/scopes/retention-ը External Validation Required են։ LinkedIn/GitHub scraping, private source ingestion և CV-ների զանգվածային հավաքագրում scope-ում չկան։

| Actor | Resource authorization |
| --- | --- |
| Visitor | Public profile/job/project projection՝ source visibility-ով։ CV և application access չկա։ |
| Candidate | Սեփական profile/CV և applications։ Explicit consent-ը կապվում է job revision և CV snapshot-ին։ Withdrawal-ից հետո active processing-ը դադարում է ըստ policy-ի։ |
| Recruiter / Office | Current membership + delegated role + assigned job/application scope։ Internal notes-ը մնում են Office-ին։ Candidate-visible reason-ը պետք է դիտավորյալ հրապարակվի։ |
| Moderator / worker | Case-scoped reason, expiry և audit։ Scanner-ին մասնավոր quarantine-ի նվազագույն հասանելիություն, provider worker-ին՝ ընտրած metadata scope։ |
| AI assistant | Explicit purpose/consent, սահմանափակ job-related context, բացատրելի չափանիշներ և manual fallback։ Hiring/reject/stage mutation իրավասություն չի տրվում։ |

Անվտանգության հիմք՝ CORS allowlist, CSRF, արտաքին input validation, server-side tenant/resource authorization, parameterized queries, գաղտնիքների պաշտպանություն, անվտանգ password hashing երբ պահվում է, TLS/encryption at rest և redacted logs։ Չլուծված Critical dependency vulnerability-ն կանգնեցնում է ազդված աշխատանքը։ CV-ն անցնում է private quarantine և digest-bound isolated scanning։ Signed access-ը ստուգում է ընթացիկ membership և snapshot eligibility։ Existing credential-ի emergency cutoff-ը փորձարկվում է առանձին։ Abuse controls՝ verified employer/review, rate limits, report/appeal, spam detection և audit։ Employment/privacy, protected traits, retention/export/delete և cross-border policy-ն վավերացվում են մինչև համապատասխան release-ը։ [AGENTS.md](../../AGENTS.md#security-invariants) · [Security rule](../../.cursor/rules/08-security.mdc)

**9. Ecosystem Integration։** Network-ը տնօրինում է profile, project evidence, job, application, interview invitation և publication eligibility։ Shared Identity/Organizations-ը տնօրինում է actor/principal/membership-ը, Storage-ը՝ bytes/scan-ը, Payments-ը՝ charge/entitlements-ը, Notifications-ը՝ dispatch-ը։ Marketplace-ը պահպանում է վաճառքի և source visibility-ի հեղինակավոր վիճակը։ Messenger-ը պահպանում է conversation/member/call-ը։ Shared AI-ն կիրառում է թույլատրված P1 context ու usage limits։ Source revoke-ը invalidate է անում projection-ը։ Core applications և native pipeline-ը գործում են AI/Messenger/Marketplace outage-ի ժամանակ։ [Dependency handoff](PROFESSIONAL_NETWORK_SHARED_PLATFORM_DEPENDENCY_HANDOFF_HY.md)

## F04 — Technical Finalization

**3. Domain Architecture։** Logical modules՝ Profile/Portfolio, Office Presence, Jobs, Recruitment, Search, Trust, P1 Social/AI adapters։ Profile 1:N Project/Evidence, ExternalConnection և CV refs։ OrganizationRef 1:N JobPosting 1:N immutable JobRevision։ Candidate + job ունեն առավելագույնը մեկ active Application։ Application-ը կապվում է submitted job revision-ին, ընտրված immutable private CV snapshot-ին, sequenced ApplicationEvent-ին և optional InterviewInvite-ին։ Snapshot-ը չի հետևում CV-ի հետագա խմբագրմանը։ Outbox-ը commit-ի նույն transaction-ում է։ Physical schema/indexes սպասում են shared architecture-ին։

| Aggregate | Անցումներ և invariant |
| --- | --- |
| Job | DRAFT → REVIEW → PUBLISHED → PAUSED/CLOSED/EXPIRED։ REJECTED → DRAFT։ Unpublish/block-ը publication version է ստեղծում։ Reopen-ը հստակ նոր revision կամ posting է ըստ policy-ի։ |
| Application | SUBMITTED → IN_REVIEW → INTERVIEW → OFFERED → HIRED։ Թույլատրելի nonterminal states-ից՝ WITHDRAWN/REJECTED։ ExpectedVersion + current recruiter membership։ Job close-ը մերժում է նոր դիմումը և չի վերագրում գործող հայտերի outcome-ը։ |
| Evidence | SELF_DECLARED → LINKED → SOURCE_CHECKED/FAILED → STALE/REVOKED։ Authorization revoke-ը հեռացնում է provider-derived ցուցադրումը ըստ policy-ի։ |
| Interview | PROPOSED → ACCEPTED/DECLINED/CANCELLED/EXPIRED։ COMPLETED միայն ընդունված հրավերից։ Contact consent-ը առանձին է job application-ից։ |

**4. Functional Architecture։** Closed-job race-ը լուծվում է authoritative job state/revision-ի և application uniqueness/idempotency-ի նույն transaction-ով։ Replay key-ը կապել actor/principal/job/payload-ին։ Job closure-ը commit-ից առաջ հաղթելու դեպքում հայտը մերժվում է, իսկ արդեն commit արված հայտը պահպանում է history-ն։ Notifications/key retries-ը state չեն փոխում։ Search projection-ը վերականգնելի է, retrieval-ը recheck է անում source privacy/visibility-ը։ Stale event-ը չի վերականգնում փակ job/profile-ը։

| REST draft՝ /api/v1/network | Contract |
| --- | --- |
| GET/PATCH /me/profile, GET /profiles/:id, POST /projects, PATCH /projects/:id | Scope, field visibility, version guard և owner-only edit։ |
| POST /integrations/github/connect, DELETE /integrations/github, POST /cvs | Explicit linkage/revoke, private quarantine intent և authorized snapshot access-ի առանձին contract։ |
| GET/POST /jobs, POST /jobs/:id/publish, POST /jobs/:id/applications | Versioned search, Office draft/review, active revision + consent + idempotency։ |
| GET /me/applications, GET /jobs/:id/applications, POST /applications/:id/transition | Candidate own-only և recruiter Office/job scope։ Stage transition-ի expectedVersion։ Withdrawal endpoint-ը հաստատել OpenAPI review-ում։ |
| POST /applications/:id/interviews, POST /interviews/:id/respond, POST /reports | Authorized inviter, explicit candidate response, UTC/timezone և scoped abuse report։ |

Event draft՝ `network.job.published.v1`, `network.job.closed.v1`, `network.application.submitted.v1`, `network.application.stage_changed.v1`, `network.interview.invited.v1`, `network.profile.visibility_changed.v1`, `network.evidence.revoked.v1`։ Envelope՝ event ID, aggregate ID/version, time, correlation/principal refs։ Minimal payload՝ առանց CV/contact կամ notes տվյալների։ Idempotent consumers, bounded retries և tombstones։ Վերջնական errors, pagination, 409 conflict և 429 caps-ը shared API contract-ի մաս են։

**10. Technical System Architecture։** Modular monolith + isolated workers թեկնածու։ TypeScript/Next.js/React՝ shared Web UX, NestJS/Express և REST/OpenAPI՝ contract enforcement, PostgreSQL/Prisma և FTS՝ transactional/asynchronous indexed read model, S3-compatible private storage, Docker և OpenTelemetry՝ reproducibility/telemetry։ Redis/BullMQ կամ DB-backed jobs-ը գնահատել համատեղ բեռով։ Dedicated search՝ relevance/volume/lag benchmark-ից հետո։ Parser/scanner-ը չի կատարում uploaded code։ Versions, hosting, CV size/download TTL և data placement պահանջում են shared selection և workload evidence։

## F05 — Implementation Readiness

**11. Quality & Operations։** Unit tests՝ privacy, provenance և transitions։ Real DB integration՝ concurrent apply, close/apply, stage/revoke, outbox replay։ Contract՝ Identity, storage, GitHub sandbox, Notifications, Messenger և Marketplace։ E2E՝ profile/CV → application → interview; negative tenant/auth, CSRF/CORS, malicious file և stale search։ P1 AI՝ human decision, explainability, fairness և provider consent։ Load/restore՝ search lag, job spikes, pending scan և recovery of tombstones։ Monitoring՝ latency, duplicate attempts, moderation/scan backlog, external sync և stale projections։ Assign incident owner և on-call նախքան pilot-ը։

| NFR | Չվավերացված թիրախ կամ պարտադիր invariant |
| --- | --- |
| PN-NFR-01, PN-NFR-02, PN-NFR-03 | Read p95 ≤300 ms, write ≤500 ms, search ≤500 ms՝ համաձայնեցված pilot load-ով։ |
| PN-NFR-04, PN-NFR-05 | 99.9% availability-ի թեկնածու, RPO ≤1 ժամ/RTO ≤4 ժամ՝ shared recovery review և drill։ |
| PN-NFR-06, PN-NFR-07, PN-NFR-08 | Zero unauthorized CV/tenant access և duplicate active applications՝ acceptance tests-ում։ Critical stop՝ պարտադիր։ |
| PN-NFR-09, PN-NFR-10 | Committed revoke-ից հետո authoritative access denial, չափված projection lag, manual core-ը գործում է integration outage-ում։ |

**12. Delivery & Staff-Level Documentation։** B initial delivery և C long-term domain complexity։ PN-WP-01/02՝ Phase A audit/contracts/threat model։ PN-WP-03՝ foundation միայն Phase B թույլտվությունից հետո։ PN-WP-04–09՝ profile/portfolio → GitHub/CV → jobs/search → apply/pipeline → interview/notifications → optional handoffs։ PN-WP-10՝ controlled pilot hardening։ PN-WP-11՝ P1 feed/channels/assistance՝ evidence gate-ից հետո։ ADR թեկնածուներ՝ identity/context, evidence provider, CV privacy, recruitment transitions, projection/revoke, AI fairness և monetization։ Official IDs-ը կհատկացվեն առանձին։

| Gate | Բաց ապացույց |
| --- | --- |
| G01/G02 | Alignment և ընդունված domain planning record՝ ADR-011։ |
| G03/G04/G05 — initialization | Shared scope/size, Identity/Office և ownership, TECH_CARD և 01-ARCHITECTURE, հետո առանձին Phase B authorization։ |
| G06 — feature | GitHub terms/scopes, CV scanner/cutoff, employment/privacy policy, AI fairness, authorized shared contracts։ |
| G07/G08 — pilot/public/paid | Demand, moderation և staffing, load/security/restore, signed legal/billing terms, provider feasibility և առանձին release approval։ |

## PN-DEC գրանցամատյան և deviation

Բոլոր սկզբնական ուղղությունները Owner Approved են ըստ [ADR-011-ի](ADR-011-PROFESSIONAL-NETWORK-PLANNING-SIGN-OFF_HY.md)։ Նոր լուծումների կարգավիճակները նշված են ըստ պայմանների։

| ID | Ուղղություն և հետագա պայման |
| --- | --- |
| PN-DEC-001 | Project-evidence network · External Validation Required՝ demand/usefulness։ |
| PN-DEC-002 | Developers/freelancers/Offices · Conditional՝ Armenia-first pilot։ |
| PN-DEC-003 | Unified identity/Office · Shared Platform Pending՝ membership/revoke։ |
| PN-DEC-004 | Profile/Portfolio/private CV · Implementation Pending՝ tenant/scan tests։ |
| PN-DEC-005 | Optional authorized GitHub · External Validation Required՝ scopes/terms/manual fallback։ |
| PN-DEC-006 | Provenance առանց skill certification · Architect Proposed՝ source labels և revoke semantics։ |
| PN-DEC-007 | Jobs/discovery · Conditional՝ verified employer և review policy։ |
| PN-DEC-008 | Application/interview consent · Architect Proposed՝ close/apply serialization և auditable transitions։ |
| PN-DEC-009 | P1 social/feed · Conditional՝ abuse/capacity և demand։ |
| PN-DEC-010 | P1 AI matching/CV · External Validation Required՝ fairness և human oversight։ |
| PN-DEC-011 | B2B-first · Conditional՝ validated subscription economics և Payments contract։ |
| PN-DEC-012 | Privacy-first/free apply · Implementation Pending՝ authorization matrix և CV cutoff evidence։ |
| PN-DEC-013 | Independent core/shared contracts · Shared Platform Pending՝ handoff/outage։ |
| PN-DEC-014 | Modular monolith/workers · Shared Platform Pending՝ TECH_CARD/load։ |
| PN-DEC-015 | PostgreSQL search first · Conditional՝ ACL correctness, relevance/latency benchmark։ |
| PN-DEC-016 | Initial B/future C և deferred Git hosting · Conditional՝ shared size և ապագա առանձին approval։ |

Նոր նյութական scope փոփոխություն չի առաջարկվում։ Job close-ի transaction semantics-ը, status/withdraw API review-ը, evidence labels-ը և cutoff-ը ճշտումներ են։ P0 optional GitHub/Messenger, P1 AI/Channels, P2 native Git hosting սահմանները պահպանվում են։ Platform Phase A՝ Open։ Phase B՝ NOT AUTHORIZED։

## BR/FR/NFR/AT/WP հետագծելիություն

| Հոսք | Master պահանջներ | Work packages / acceptance |
| --- | --- | --- |
| Profile, portfolio, source evidence և CV | PN-BR-01, PN-BR-04, PN-BR-05, PN-BR-06, PN-BR-13 · PN-FR-01, PN-FR-02, PN-FR-03, PN-FR-04, PN-FR-05, PN-FR-06 · PN-NFR-06, PN-NFR-09 | PN-WP-04, PN-WP-05 · PN-AT-01, PN-AT-02, PN-AT-03, PN-AT-04, PN-AT-05, PN-AT-06, PN-AT-07, PN-AT-11։ |
| Office, job search, recruitment և interviews | PN-BR-02, PN-BR-03, PN-BR-10, PN-BR-14 · PN-FR-07, PN-FR-08, PN-FR-09, PN-FR-10, PN-FR-11, PN-FR-12, PN-FR-13, PN-FR-14, PN-FR-15, PN-FR-16 · PN-NFR-01, PN-NFR-02, PN-NFR-03, PN-NFR-07 | PN-WP-06, PN-WP-07, PN-WP-08 · PN-AT-08, PN-AT-09, PN-AT-10, PN-AT-12, PN-AT-13, PN-AT-14, PN-AT-18։ |
| Handoffs, channels, AI և expansion | PN-BR-07, PN-BR-08, PN-BR-09, PN-BR-11 · PN-FR-17, PN-FR-18, PN-FR-19, PN-FR-20, PN-FR-21, PN-FR-22, PN-FR-23, PN-FR-24 · PN-NFR-10 | PN-WP-09, PN-WP-11 · PN-AT-15, PN-AT-16, PN-AT-17։ |
| Governance, reliability և recovery | PN-BR-12 · PN-NFR-04, PN-NFR-05, PN-NFR-08 | PN-WP-01, PN-WP-02, PN-WP-03, PN-WP-10 · PN-AT-19, PN-AT-20։ |
