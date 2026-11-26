# Marketplace — Phase A-ի որոշումների ամփոփում

## 1. Գործադիր ամփոփում

**Կարգավիճակ՝ Phase A · Proposed · Owner Review։** Առաջարկվում է սահմանափակ Marketplace MVP՝ թվային ապրանքի ընդունումից մինչև վաճառք, անվտանգ տրամադրում, աջակցություն և ֆինանսական համադրում։ Pilot-ը սկզբում ընդունում է հրավիրված վաճառողների։ Երկարաժամկետ ուղղությունը Controlled Open Admission-ն է՝ բաց դիմումներով և ռիսկահեն ընդունմամբ։

Evolution-Ready Architecture-ի շրջանակում ամբողջ Platform-ի չափի առաջարկը **C** է, իսկ Marketplace MVP-ի delivery scope-ը՝ **B**։ Առաջին թողարկումը նույն Platform-ի ուղղահայաց հատվածն է և օգտագործում է դրա հաստատվող shared contracts-ը։ Implementation readiness-ը **NOT READY** է։ Phase B-ի առանձին թույլտվությունը բաց է։

Աղբյուրներ՝ [Marketplace Master Architecture v1.1](MEDUZELLAR_MARKETPLACE_MASTER_ARCHITECTURE_HY.md), [Governance Alignment Notes](GOVERNANCE_ALIGNMENT_NOTES_HY.md), [AGENTS.md-ի առաջնահերթություն](../../AGENTS.md#decision-precedence), [README-ի product scope](../../README.md) և [աշխատանքային BRIEF](../BRIEF.md)։

## 2. Վերջնական MVP-ի առաջարկ

Գործարկել մեկ սահմանափակ առևտրային շուկայում, մեկ հաստատված գործարքային արժույթով և մեկ վաճառող ու մեկ offer line ունեցող պատվերով։ Պահպանել մեկնարկային **Frontend/UI**, **Backend Modules** և **Developer Tools** կատեգորիաները՝ Hybrid Typed Catalog-ի շրջանակում։ Յուրաքանչյուր կատեգորիա ունի versioned metadata schema։ Pilot-ում ընդունել source-only archives և փաստաթղթեր՝ type, size, file count և unpacking սահմաններով։ Support-ը և operator workflows-ը ներառել P0-ում, որպեսզի վերադարձը, վեճը կամ վտանգավոր release-ը գործնական լուծում ունենան։

Առաջարկվող monetization-ը վաճառքից commission-ն է։ Տոկոսը, վճարող կողմը, հարկային հաշվարկը, provider fee-ի բաշխումը և վերադարձի ազդեցությունը ենթակա են հաստատման։ Գնորդի ձեռք բերած իրավունքները և հիմնական անվտանգությունը հասանելի են անկախ վճարովի հավելյալ ծառայություններից։ Pilot-ից առաջ հաշվարկել եկամուտը, provider fees-ը, review/support աշխատանքի արժեքը, storage/egress-ը և fraud/refund կորուստները։

## 3. P0 / P1 / P2 շրջանակ

| Փուլ | Ներառված հնարավորություններ |
| --- | --- |
| **P0 — controlled pilot** | Public catalog, basic search/filter, Product Details և release evidence, invite-only seller onboarding, անձնական և լիազորված Office commerce, draft/listing/offer/release workflow, quarantine և ռիսկահեն review, hosted checkout, վճարի հաստատում, idempotent fulfillment, անկախ grants, Library, secure download, native case support, ձեռքով վարվող refunds/disputes, admin controls, reconciliation և seller earnings-ի հիմնական տեսք։ Ներառել նվազագույն operational metrics և accessibility/i18n հիմք։ |
| **P1 — վավերացված պահանջարկից հետո** | Side-by-side advanced comparison, verified reviews և դրանց moderation, compatibility matrix, advanced analytics, seller tooling և update փորձառության ընդլայնում, Complete Projects և Plugins-ի վերահսկվող ընդունում, channel publication-ի ու Network/Messenger ինտեգրումների ընտրովի փուլեր։ Controlled Open Admission-ին անցնել, երբ review/support capacity-ն և abuse վերահսկողությունն ապացուցված են։ |
| **P2 — Evidence-Driven Expansion** | AI integration, workspace, enterprise purchasing/licensing, multi-seller checkout և նոր product/artifact դասեր։ Ձևակերպել տվյալների օգտագործման, authorization-ի և operational cost-ի պայմանները յուրաքանչյուր ընդլայնման համար։ |

P0-ից դուրս են executable binaries-ը և չվստահված կոդի կատարումը հարթակի վրա, բազմավաճառող կամ բազմաարժույթ checkout-ը, ուղղակի քարտային տվյալների ընդունումը, սեփական դրամական պահառությունը և համահեղինակների payout split-ը։ Secure delivery-ն չի կարող հետ կանչել արդեն ստացված տեղական պատճենը։

## 4. PA-01–PA-12 որոշումների գրանցամատյան

Ստորև յուրաքանչյուր տողի կարգավիճակը **Architect Proposed — Owner approval pending** է։ «Արտաքին» սյունակում նշված է դեռ պահանջվող ապացույցը։ «Դարպաս» սյունակը ցույց է տալիս, թե բաց որոշումն ինչ է արգելակում։

| ID | Խնդիր և առաջարկվող լուծում | Հիմնավորում / trade-off | Կախվածություն | Արտաքին | Դարպաս |
| --- | --- | --- | --- | --- | --- |
| PA-01 | Սահմանափակել MVP-ն §3-ի ամբողջական commerce lifecycle-ով և հաստատել P1/P2 տեղափոխումները։ | Վաղ արձագանք և վերահսկելի բեռ։ Advanced comparison և reviews հասանելի կլինեն հաջորդ փուլում։ | Owner scope, PA-11, PA-12։ | Այո — pilot demand։ | Initialization scope։ |
| PA-02 | Մեկ human identity, անկախ Organization principals, Membership, server-authorized personal/Office context և resource-level authorization։ | Բաժանում է actor-ը իրավատիրոջից։ Պահանջում է membership-ի արդիական ստուգում և ճշգրիտ audit։ | Shared Identity/Auth, Organization owners։ | Այո — ընտրված IdP-ի և session հոսքի վավերացում։ | Shared foundation և Office commerce։ |
| PA-03 | Versioned shared contracts, opt-in channel publication, idempotent quota operation և visibility revocation։ | Core commerce-ը չի սպասում Network/Messenger/AI-ին։ Պետք է վերահսկել projection-ի ուշացումը։ | Shared service owners, PA-02, channel policy։ | Ոչ — cross-domain համաձայնեցում և contract tests։ | Channel և ecosystem features, core shared contracts-ը՝ համապատասխան հոսքից առաջ։ |
| PA-04 | Platform Size C՝ երկարաժամկետ, Marketplace MVP Size B՝ նույն ճարտարապետության առաջին delivery scope։ | Միասնական contracts և սահմանափակ սկզբնական գործառնական բեռ։ Հետագա բաժանումը հիմնավորել չափումներով։ | Approved size, TECH_CARD և Shared Platform Architecture։ | Այո — toolchain, workload, hosting, budget։ | Initialization։ |
| PA-05 | Order-ի համար մեկ ակտիվ PaymentAttempt, provider operation key և ավել capture-ի վերահսկվող համադրում։ | Կրճատում է կրկնակի գանձման ռիսկը։ Անորոշ provider status-ը կարող է երկարացնել retry-ը։ | Shared Payments, provider idempotency/status/refund։ | Այո — concurrent/timeout sandbox։ | Checkout։ |
| PA-06 | Ստորագրված webhook-ի durable inbox, idempotent transitions, պատվերի և provider-ի հեղինակավոր վիճակների համադրում։ | Կրկնակի և անհերթ event-երը դրամական վիճակը չեն կրկնօրինակում։ Անոմալիաները պահանջում են operator queue։ | PA-05, provider event և status contracts, outbox։ | Այո — delayed/reordered event փորձարկում։ | Fulfillment և reconciliation։ |
| PA-07 | Անկախ grants և versioned refund/dispute policy՝ order-line scope-ով։ | Նպատակային կասեցում կամ հետկանչ՝ գնման պայմաններով։ Վեճերը կարող են պահանջել ձեռքով որոշում։ | License terms, Shared Payments, PA-06։ | Այո — իրավական և provider review։ | Refund/dispute և paid launch։ |
| PA-08 | Immutable artifacts, quarantine, digest-bound verification և վերահսկվող delivery/replacement releases։ | Վտանգավոր digest-ի տրամադրումը կանգնում է։ Emergency revoke-ի խստությունը կարող է ավելացնել latency-ն ու egress ծախսը։ | Shared Storage, scanner, grant policy։ | Այո — storage ու scan փորձարկում։ | Publishing և delivery։ |
| PA-09 | Seller suspension-ը կիրառել նոր գործունեության և տվյալ ռիսկի նկատմամբ։ Նախկին անկախ իրավունքների վրա կիրառել միայն հաստատված պայմանները։ | Պահպանում է գնորդի ձեռք բերած հասանելիությունը։ Պահանջում է incident support և seller exit ընթացակարգ։ | PA-07, PA-08, seller contract։ | Այո — պայմանագրային և օպերացիոն review։ | Seller operations և paid launch։ |
| PA-10 | Հավասարակշռված append-only journal, reconciliation և հետագծելի reversals/adjustments։ | Վերարտադրելի balances և audit։ Պահանջում է finance owner, cutoff և exception handling։ | PA-05, PA-06, provider reports, accounting policy։ | Այո — statements և հաշվապահական review։ | Payout և paid launch։ |
| PA-11 | Հրավիրված pilot sellers, սահմանափակ review queue և նշանակված review/security/finance/support owners։ Ապացուցված հզորությունից հետո անցնել Controlled Open Admission-ի։ | Ծանրաբեռնվածությունը կանխատեսելի է։ Սկզբնական supply-ն սահմանափակ է։ | Staffing, scan tooling, reviewer policy, escalation։ | Այո — review capacity, բյուջե և pilot evidence։ | Seller onboarding և paid pilot։ |
| PA-12 | Հաստատել launch feasibility-ն, ապա առանձին արձանագրել Phase A sign-off-ը, Phase B authorization-ը և release թույլտվությունը։ | Շուկան և provider-ը որոշվում են փաստերով։ Իրագործելիությունը կարող է փոխել launch scope-ը։ | PA-01, PA-04, PA-05–11 ըստ դարպասի, Owner։ | Այո — երկիր, իրավաբանական անձ, provider, իրավական/հարկային review։ | Initialization authorization և paid launch-ի առանձին դարպասներ։ |

## 5. Հաստատման կարգավիճակ և լիազորություն

- **Ռազմավարական հաստատում։** Blueprint-ի §0-ում արձանագրված MP-DEC-001 A/B/C/D սկզբունքները՝ Trust + Developer Productivity, Selected Categories + Hybrid Typed Catalog, Full Evolutionary Product Lifecycle և Evidence-Driven Expansion, պահպանվում են իրենց նախնական շրջանակով։ Պահպանվում են նաև Evolution-Ready ուղղությունը և Blueprint-ի պլանավորման հաստատումը։ Մեկնարկային երեք կատեգորիաներն այս փաթեթում պահպանվում են ըստ Owner-ի հանձնարարության։ Դրանց ներսում կոնկրետ artifact allowlist-ը և P0 սահմանները առաջարկ են։
- **Տեխնիկական և product առաջարկներ։** MP-DEC-002–006, MP-TECH-001, MP-ADR-01–08 և PA-01–PA-12 մնում են առաջարկներ։ Stack-ի անունները թեկնածուներ են։ Provider-ի, ֆիզիկական schema-ի, տեղակայման, վճարային կամ իրավական քաղաքականության հաստատում չի արձանագրվում այս փաստաթղթով։
- **Repository authority։** Գործում են AGENTS.md-ի security invariants-ը և workflow gates-ը, README-ի product scope-ը և հաստատված project records-ը։ Owner որոշումը գրանցվում է իր իրական սահմանով, հաստատման աղբյուրով և ամսաթվով։ [Որոշումների առաջնահերթություն](../../AGENTS.md#decision-precedence)

## 6. Բիզնես կանոններ

- **Ownership և eligibility։** Seller Account-ն ունի մեկ իրավատեր։ Actor-ը կարող է գործել միայն իր անձնական կամ թույլատրված Office context-ով։ Admission, identity, distribution rights, release approval, checkout և payout eligibility-ն ունեն անկախ վիճակներ։
- **Catalog և publishing։** Product, Release, Artifact, Listing, Offer և License Version-ը առանձին են։ Հրապարակումը պահանջում է իրավասու seller, վավեր offer, հաստատված digest և պարտադիր review evidence։ Search-ը տեսնում է միայն իրավասու listings-ը։
- **Commerce և grants։** Order line-ը պահպանում է գինը փոքրագույն արժութային միավորով, ISO արժույթը, offer/release-ը և ընդունված պայմանները։ Provider confirmation-ից հետո fulfillment-ը ստեղծում է մեկ business grant յուրաքանչյուր order line, grant type և scope համակցության համար։
- **Հետգնման իրավունքներ։** Support/update-ի ժամկետի ավարտը և seller suspension-ը չեն վերացնում անկախ usage right-ը։ Artifact security block-ը սահմանափակում է տրամադրումը։ Refund/dispute-ի հետևանքը որոշում է ընդունված քաղաքականությունը։
- **Վստահություն և հաշվառում։** Verification evidence-ը վաճառքի ենթակա չէ։ Ֆինանսական պատմությունը պահպանվում է append-only և ուղղվում audit-ով reversal/adjustment-ի միջոցով։ Seller ownership-ի և payout beneficiary-ի փոփոխությունները պահանջում են ուժեղացված ստուգում և դերերի տարանջատում։

## 7. Security invariants

- Պաշտպանել secrets և credentials-ը, վավերացնել արտաքին input-ը, կիրառել server-side resource authorization և deny-by-default։ Պահվող գաղտնաբառերի դեպքում կիրառել հաստատված անվտանգ hashing։ Database հարցումներն օգտագործում են parameterized queries։ Errors, logs, traces և events չեն արտահոսեցնում զգայուն տվյալներ։
- CORS allowlist-ը և CSRF պաշտպանությունը պարտադիր են։ Cookie-authenticated mutation-ները պահանջում են CSRF պաշտպանություն, authenticated API-ն՝ սահմանափակված origins։ Provider webhook-ի սահմանը ստուգում է signature-ը և replay-ը։ Չլուծված Critical dependency vulnerability-ն կանգնեցնում է ազդված աշխատանքը։ Remediation ticket-ը հետևում է ուղղմանը։
- Artifact-ները մասնավոր են։ Upload-ը նախ quarantine-ում է, scan timeout-ը կամ digest mismatch-ը կանգնեցնում է approval-ը։ Scanner-ը մեկուսացված է, իսկ չվստահված կոդի կատարումը P0-ից դուրս է։ Պարտադիր վերահսկողությունները պահպանվում են նաև ձախողման ժամանակ։
- Checkout և artifact access-ը կախված են հեղինակավոր վիճակից։ Նախկին կամ cross-tenant membership claim-ը հասանելիություն չի տալիս։ Admin գործողությունները պահանջում են least privilege, audit և step-up ըստ հաստատված քաղաքականության։

[AGENTS.md — security invariants](../../AGENTS.md#security-invariants) · [08-security.mdc](../../.cursor/rules/08-security.mdc) · [Governance Alignment Notes](GOVERNANCE_ALIGNMENT_NOTES_HY.md)

## 8. Seller և Buyer ճարտարապետություն

**Seller։** Pilot-ի invite-ը սահմանափակում է դիմումների հոսքը։ Դիմողը ներկայացնում է իրավատիրոջ տվյալները, իրավասության ապացույցը և առաջին release-ը։ Reviewer-ը չի գնահատում սեփական կամ շահերի բախումով ներկայացումը։ Երկարաժամկետ Controlled Open Admission-ը նախատեսում է հանրային դիմում, risk tiers, capacity limits և վերահաստատում։ Seller suspension-ը scope-ով կանգնեցնում է նոր publish/checkout-ը և առանձին նշում payout-ի սահմանափակումը ըստ հաստատված ֆինանսական քաղաքականության։

**Buyer։** Այցելուն կարդում է հրապարակված տվյալները։ Buyer-ը գնում է իր կամ լիազորված Office-ի համար։ Order-ը պահում է actor և beneficiary principal հղումները։ Context switch-ը տեսանելի է checkout-ում, Library-ում և support-ում։ Membership termination-ը փակում է անձի հետագա Office access-ը, իսկ Organization-ին պատկանող պատվերն ու grant-ը մնում են Organization-ին։

## 9. Commerce և ֆինանսական ճարտարապետություն

1. Server-ը վավերացնում է offer-ը և buyer context-ը, ամրագրում է quote/order snapshot-ը, ապա ստեղծում է provider operation key-ով մեկ ակտիվ PaymentAttempt։ Timeout-ի կամ անորոշ status-ի դեպքում ստուգել provider-ը մինչև նոր attempt-ը։
2. Webhook receiver-ը ստուգում է signature-ը և event identity-ն, պահպանում event-ը durable inbox-ում և միայն durable ընդունումից հետո հաստատում ստացումը։ Վերամշակումը ստուգում է order reference-ը, գումարը, արժույթը և provider/account scope-ը։ Հաստատված transition-ը և outbox գրառումը կատարվում են նույն transaction-ում։
3. Fulfillment-ը idempotent է order-line grant key-ով։ Ուշ capture-ը, անհերթ event-ը և երկրորդ հաջող capture-ը համադրվում են հեղինակավոր վիճակի հետ։ Ավել capture-ը պահվում է որպես ֆինանսական փաստ, ուղարկվում operator review և վերադարձվում հաստատված ընթացակարգով։
4. Ledger-ը հավասարակշռված է ըստ արժույթի։ Ծախսը, commission-ը, refund-ը, chargeback-ը և payout-ը կապվում են provider ու internal references-ով։ Reconciliation-ը process-level retry-ներով է, mismatch-ը պահում է պատճառը և պատասխանատուին։ Paid launch-ից առաջ հաստատել settlement cadence-ը, cutoffs-ը և payout holds-ը։

## 10. Licensing և Entitlements

Առաջարկվում են versioned Personal և Organization license templates։ Terms snapshot-ը ֆիքսում է usage scope-ը, download eligibility-ն, updates/support ժամկետները և refund/dispute պայմանները։ Տրված grant-ի scope-ը չի ընդլայնվում offer-ի կամ license-ի հետագա խմբագրմամբ։

Pending refund-ը grant չի փոխում։ Հաստատված վերադարձի, partial refund-ի կամ chargeback-ի ազդեցությունը որոշվում է ընդունված և իրավական վավերացում անցած order-line քաղաքականությամբ։ Բաց dispute-ի ընթացքում ժամանակավոր download hold-ը կիրառելի է միայն հաստատված պայմաններով։ Դադարեցված support-ը և security block-ը usage license-ի ավտոմատ հետկանչ չեն առաջացնում։

Replacement-ը նոր հաստատված Release է՝ առանձին immutable artifact digest-ով։ Library-ն այն ցուցադրում է միայն երբ grant-ի terms-ը կամ հաստատված incident remediation-ն տրամադրում են այդ իրավունքը։ Յուրաքանչյուր download request ստուգում է beneficiary-ն, ընթացիկ grant-ը, release eligibility-ն և block-ը։ Անմիջական cutoff-ի համար հաստատել broker կամ storage-level deny։ Signed URL-ի TTL-ը սահմանափակում է նոր հարցումները, իսկ արդեն ընթացող փոխանցման և տեղային պատճենի սահմանները պետք է արտացոլվեն support policy-ում։

## 11. Shared Platform կախվածություններ և սահմաններ

| Marketplace-ի որոշում | Shared Platform-ի պահանջվող որոշում |
| --- | --- |
| Seller/Buyer eligibility, actor/principal audit և order/grant ownership։ | Human Identity, Authentication, session/revocation, Organization principal և Membership պայմանագիր։ |
| Order, fulfillment, offer/license snapshots, grants, Marketplace settlement inputs։ | Shared Payments-ի ownership, global provider և payment/refund event/statement պայմանագրեր, shared DB ownership, isolation ու migration policy։ |
| Product/release review, digest, quarantine policy և download authorization։ | Shared Storage-ի private origin, object versioning, scanner isolation, emergency deny/CDN և environment boundaries։ |
| Product-ի opt-in publication և listing visibility։ | Channel ownership, audience, quota և usage accounting։ Թվերը, quota window-ը և overflow policy-ն սպասում են Owner/Platform review-ի։ |
| Catalog/read projection, support case handoff և թույլատրելի metadata access։ | Network projection contract, Messenger case link և consent, AI-ի retrieval authorization, notifications delivery semantics։ |
| Marketplace workload և ծառայության չափելի պահանջներ։ | Shared infrastructure, platform-wide stack, monitoring, queue/cache policy, hosting, recovery և ծախսերի ownership։ |

Marketplace-ը հրապարակում է versioned projection events և removal/block tombstones։ Consumer-ը համեմատում է version-ը։ Checkout-ը և delivery-ն հաստատում են ընթացիկ հեղինակավոր վիճակը։ AI, Messenger, Network կամ notifications-ի անհասանելիության դեպքում order, fulfillment, Library և native support հոսքերը շարունակում են աշխատել։

## 12. Տեխնոլոգիական թեկնածուներ

- **Չափ և կառուցվածք։** Platform C և Marketplace MVP B ըստ [A/B/C ուղեցույցի](../../.agents/skills/project-onboarding/references/project-sizing.md)։ Marketplace-ի modular monolith և scoped worker առաջարկը տեղավորվում է մեկ համատեղելի Platform Architecture-ի մեջ։ Repo layout և service splits որոշել հաստատված workload-ի ու ownership-ի հիմքով։
- **Application։** Node.js LTS, strict TypeScript, Next.js/React, NestJS/Express և versioned REST/OpenAPI։ PostgreSQL/Prisma՝ relational transactions, uniqueness և migrations-ի թեկնածու։ Pin-երը, ESM և driver semantics-ը, build/test peer dependencies-ը պահանջում են միասնական ստուգում։
- **Asynchronous workloads։** Transactional outbox, durable inbox և scoped worker-ը Marketplace-ի առաջարկվող տվյալային հիմքն են։ Redis և BullMQ մնում են թեկնածուներ։ Platform-wide review-ը գնահատում է async processing-ը, notifications-ը, Messenger/communication բեռը, caching-ը, fulfillment-ը, scanning-ը և background jobs-ը՝ ըստ throughput, retries, scheduling, ordering, failure recovery, hosting limits ու ընդհանուր ծախսի։ Համեմատել DB-backed տարբերակի և առանձին queue/cache-ի գործառնական բեռը։ Կրիտիկական վիճակը պահել հաստատված հեղինակավոր store-ում։
- **Delivery և operations։** Private S3-compatible object storage, Docker, structured redacted logs/metrics/traces, contract և integration tests, risk-based browser E2E ու restore drills։ Hosting, scanner, observability vendor, queue ու DB տարբերակներ չեն հաստատվում այս փաթեթով։

## 13. Տարբերություններ Master Architecture v1.1-ից

| Blueprint-ի հիմք | Այս փաթեթի առաջարկ և պատճառ |
| --- | --- |
| MP-DEC-002՝ controlled admission և §1.1-ի ընտրովի սկզբնական supply։ | Invite-only սկզբնական pilot՝ review/support իրական հզորությունը չափելու համար։ Controlled Open Admission-ը երկարաժամկետ ընտրությունն է։ |
| §1.1՝ launch կատեգորիաներ և լայն artifact ուղղություն։ | Նույն երեք մեկնարկային կատեգորիաները, pilot-ում սահմանափակված source-only artifact-ներով և փաստաթղթերով։ Executable բովանդակությունը պահանջում է առանձին review։ |
| FR-18 և AT-11-ի review մասը՝ P0։ | Verified reviews-ը տեղափոխել P1։ AT-11-ի support authorization-ը մնում է P0, review մասը՝ FR-18-ի հետ P1։ |
| §5 և FR-01՝ catalog discovery, §1.1/§4՝ աճի և AI շերտեր։ | Basic search/filter-ը և product detail-ը P0 են։ Advanced comparison, analytics և integration ընդլայնումը փուլավորվում են §3-ի համաձայն։ AI, workspace և enterprise-ը պահվում են P2-ում։ |
| §9՝ ընտրովի Messenger/Network/AI, առանց channel quota contract-ի։ | Առաջարկվում է opt-in channel-ը P1-ում։ P0 ներառելու դեպքում անհրաժեշտ են Owner-ի scope որոշում և shared publication policy։ |
| §10.1/§10.2՝ Redis/BullMQ և app/package օրինակ։ | Queue/cache և repo layout-ի վերջնական ընտրությունը հիմնվում է ամբողջ Platform-ի workload-ի ու shared architecture-ի վրա։ Platform C և Marketplace B տարբեր հորիզոններ են նույն համակարգի համար։ |
| §10.3 և §12.1՝ NFR-08 և A1/B1 wording։ | Գործում է mandatory security baseline-ը և Phase B-ի առանձին թույլտվությունը։ Առաջարկվող տեքստային ուղղումները պահպանվում են Governance Alignment Notes-ում։ |

## 14. Արտաքին վավերացման պահանջներ

| Ապացույց | Անցման պայման |
| --- | --- |
| Launch country, իրավաբանական անձ, Merchant of Record/marketplace role, tax/invoicing, KYC/KYB, consumer refunds, privacy/IP և license terms։ | Իրավական և հաշվապահական գրավոր review՝ համապատասխան իրավասության սահմանով։ |
| Hosted checkout, lifecycle/status API, signature, idempotency, refund, disputes, payouts և statements։ | Provider-ի գրավոր eligibility և sandbox դեպքեր՝ parallel attempt, delayed/duplicate event, failure և reconciliation։ |
| Storage/scan behavior, signed URL TTL/range/retry, emergency cutoff և վերականգնում։ | Target storage և scanner proof՝ immutable digest, fail-closed approval և չափված block latency։ |
| Runtime/package compatibility, IdP revocation, hosting և operations։ | Ընտրված exact toolchain matrix, provider capability, compute/DB/storage/egress/scanning գնանշումներ, capacity և restore exercise։ |
| Pilot demand, review/support և economics։ | Հարցազրույցների/փորձերի արդյունքներ, մեկ order-ի contribution, review backlog, incident ownership և launch go/no-go շեմեր։ |

Այս փաթեթում provider availability, աջակցության ժամկետներ, version compatibility, իրավական եզրակացություններ և գնանշումներ չեն հաստատվում։

## 15. Իրականացումն արգելակող պայմաններ

- **Initialization։** Owner-ի կողմից գրանցված Marketplace scope, project size, Shared Platform planning direction, հաստատված TECH_CARD և 01-ARCHITECTURE, նյութական հակասությունների լուծում և առանձին Phase B թույլտվություն։
- **Feature-level։** Office commerce-ը պահանջում է Identity/Membership contract։ Checkout և financial operations-ը պահանջում են Shared Payments contract և verified provider behavior։ Publishing/delivery-ն պահանջում են quarantine, scanner և private storage պայմանագրեր։ Channel և ecosystem ինտեգրումները պահանջում են owner/contract/visibility համաձայնեցում։
- **Վճարովի pilot/launch։** Իրավական և provider feasibility, հաստատված terms/fees/refunds, finance/review/support owners, acceptance evidence, restore և reconciliation drills, infrastructure budget և առանձին release authorization։

## 16. Ընդունման չափանիշներ

| Դեպք | Չափելի ընդունման արդյունք |
| --- | --- |
| Admission, catalog և publishing | Այցելուն տեսնում է միայն հրապարակված իրավասու առաջարկները։ Չհրավիրված seller-ը չի մտնում pilot հոսք։ Scan failure-ը, digest mismatch-ը և չհաստատված release-ը կանխում են publish-ը։ |
| Tenant isolation | Cross-Office actor-ը չի կարդում պատվեր, grant կամ case։ Revoked անդամի հաջորդ protected request-ը մերժվում է, Organization-ի grant-ը պահպանվում է։ |
| Checkout և event processing | Parallel requests-ը ստեղծում են մեկ ակտիվ attempt։ Հնացած quote-ը պահանջում է վերահաշվարկ։ Նույն capture-ի կրկնված կամ անհերթ event-ը չի կրկնօրինակում grant-ը կամ ledger գրառումը։ Ուշ capture-ը համադրվում է պատվերի վիճակի հետ։ Առանձին երկրորդ capture-ը գրանցվում է ledger-ում և հասնում reconciliation queue-ին՝ առանց նոր grant-ի։ |
| Refund/dispute, suspension, delivery | Pending refund-ը grant չի փոխում։ Հաստատված outcome-ը կիրառում է order-line քաղաքականությունը։ Seller suspension-ից հետո նոր checkout-ը մերժվում է։ Block-ը կանգնեցնում է նոր delivery-ն և ըստ հաստատված շեմի՝ արդեն տրված credential-ը։ Replacement-ը հասանելի է միայն համապատասխան grant-ին։ |
| Shared failures և visibility | Removal/block-ից հետո հնացած publish event-ը չի վերականգնում projection-ը։ AI/Messenger/Network outage-ի ընթացքում order-ը, Library-ն ու native support-ը գործում են։ |
| Finance և operations | Կրկնվող statement import-ը պահպանում է նույն balance-ը։ Mismatch-ը audit-ով հետագծելի է։ Restore drill-ը վերականգնում է order/grant/ledger կապերը և ապացուցում հաստատված RPO/RTO-ն։ |
| Browser և dependency security | Security suite-ը ծածկում է CORS, CSRF, authz, input validation, rate limits և secret-safe logging։ Չլուծված Critical dependency-ն կանգնեցնում է ազդված աշխատանքը։ |

## 17. Phase A-ի ավարտի պահանջներ

1. Owner-ը հաստատում է MVP scope-ը, launch categories-ի ենթասահմանները, seller admission-ի փուլերը և C/B դասավորության առաջարկը։
2. Shared Platform review-ը հաստատում է initialization-ի համար անհրաժեշտ owner-ներն ու contracts-ը։ Տեխնոլոգիական թեկնածուների համար գրանցվում են version/compatibility ապացույցներ, ենթադրություններ և ծախսային սահմաններ։
3. Owner-ի հանձնարարությամբ պատրաստվում և հաստատվում են TECH_CARD-ը և 01-ARCHITECTURE-ը։ Նյութական որոշումները գրանցվում են համապատասխան ADR-ներում, threat model-ում, acceptance traceability-ում և backlog-ում։
4. Արձանագրվում է Phase A-ի հստակ sign-off-ը՝ բաց feature/launch կախվածությունների և դրանց պատասխանատուների հետ։

## 18. Phase B-ի թույլտվության պահանջներ

Phase B-ն սկսվում է միայն ավարտված Phase A-ից և Product Owner-ի **առանձին, հստակ application initialization թույլտվությունից** հետո։ Initialization-ը սահմանափակվում է հաստատված չափով, TECH_CARD-ի Approved արժեքներով, հաստատված architecture-ով և լուծված նյութական հակասություններով։ CI/CD, release և production գործողությունների համար գործում են իրենց առանձին թույլտվությունները։ [Project onboarding workflow](../../.agents/skills/project-onboarding/SKILL.md)

## 19. Հետագծելիություն դեպի Master Architecture v1.1

Այս մատրիցը հղվում է Blueprint-ի սկզբնական ID-ներին։ Advanced comparison, channel opt-in/quota և concurrent provider capture-ի ընդլայնված սցենարները refinement-ներ են և Blueprint-ից նոր ID չեն վերցնում։

| Որոշումներ / թեմա | Blueprint-ի հղում | Ընդունում և փուլավորում |
| --- | --- | --- |
| PA-01, PA-11 — catalog, seller review, UX | §1, §4.1 և §5 · BR-002, BR-003, BR-009 · FR-01, FR-02, FR-03, FR-04, FR-05, FR-06, FR-07, FR-18, FR-19, FR-20 | AT-01, AT-03, AT-04, AT-11։ FR-18-ը և AT-11-ի verified review մասը առաջարկվում են P1-ում։ FR-19/20-ը՝ P1։ |
| PA-02, PA-03 — shared identity, privacy և integration | §3.1, §6.1 և §9 · BR-001, BR-010 · FR-13, FR-16, FR-21 | AT-02, AT-11-ի support մասը, AT-13 և AT-16։ FR-21-ը՝ P2։ |
| PA-04, PA-11, PA-12 — topology, quality և readiness | §10–12 · MP-TECH-001 · MP-ADR-01, MP-ADR-02, MP-ADR-06, MP-ADR-08 · NFR-01, NFR-02, NFR-03, NFR-04, NFR-05, NFR-06, NFR-07, NFR-08, NFR-09, NFR-10 | AT-14, AT-15, AT-16 և §11.2 runbooks։ Շեմերը վավերացվում են workload, budget և restore evidence-ով։ |
| PA-05, PA-06 — order, payment, fulfillment | §3.4–3.5 և §4.2–4.3 · BR-004, BR-005, BR-006 · FR-08, FR-09, FR-10 · MP-ADR-04, MP-ADR-07 | AT-05, AT-06, AT-07։ Parallel attempts և երկրորդ capture-ը լրացուցիչ դեպքեր են։ |
| PA-07, PA-08, PA-09 — licensing, grants և delivery | §4.3 և §6 · BR-007, BR-008 · FR-11, FR-12, FR-14 · MP-ADR-03, MP-ADR-05 | AT-08, AT-09, AT-12։ Ավելացնել signed URL cutoff և replacement release դեպքերը։ |
| PA-10, PA-11, PA-12 — ledger, payout և operations | §7 և §11.2–12 · BR-011, BR-012 · FR-15, FR-17 · MP-ADR-07 | AT-09, AT-10, AT-15 և paid pilot release evidence։ |

## 20. Product Owner-ի մնացած որոշումներ

1. **Marketplace scope։** Հաստատել PA-01 և PA-11՝ P0/P1/P2 սահմանները, FR-18-ի տեղափոխումը, source-only allowlist-ը, buyer/seller eligibility-ն, pilot-ի ծավալը և Controlled Open Admission-ին անցնելու չափանիշները։
2. **Shared Platform review։** Ուղղորդել PA-02–04-ը՝ Identity/Auth, Organization/Membership, shared DB և infrastructure, Payments/Storage/Notifications, channel/quota, Messenger/Network/AI boundaries և ընդհանուր stack։ Նշանակել որոշման պատասխանատուներին։
3. **Կոմերցիոն քաղաքականություն։** PA-05–10 և PA-12-ի համար հաստատել launch market-ը, provider/legal feasibility փաթեթը, commission և payout policy-ն, licenses, refund/dispute grants և emergency delivery cutoff-ը՝ պահանջվող ապացույցներից հետո։
4. **Փուլի դարպասներ։** Հաստատել Phase A փաստաթղթավորման հաջորդ հանձնարարությունը։ Phase A sign-off-ը և Phase B initialization authorization-ը գրանցել առանձին։
