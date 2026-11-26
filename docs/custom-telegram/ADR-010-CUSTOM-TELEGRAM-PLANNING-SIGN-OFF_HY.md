# ADR-010 — Custom Telegram + AI-ի դոմենային պլանավորման հաստատում

**Կարգավիճակ՝ Accepted — Domain Planning։**

**Ամսաթիվ՝ 2026-11-25։ Որոշող՝ Product Owner։**

## Համատեքստ և հաստատման ապացույց

Product Owner-ի «MEDUZELLAR — CUSTOM TELEGRAM + AI / OWNER APPROVAL & DOMAIN PLANNING SIGN-OFF» հանձնարարությունն ուղղակիորեն հաստատում է նախկինում քննարկված դոմենային պլանավորման ուղղությունները և թվարկում հաստատման շրջանակը։ Ապացույցը կիրառվում է [Master Architecture v1.0-ի](MEDUZELLAR_CUSTOM_TELEGRAM_MASTER_ARCHITECTURE_HY.md) CT-DEC-001–016 ուղղությունների և հաստատված փուլավորման նկատմամբ։ [Pre-Implementation Finalization-ը](CUSTOM_TELEGRAM_PRE_IMPLEMENTATION_FINALIZATION_HY.md) և [Governance Alignment Notes-ը](GOVERNANCE_ALIGNMENT_NOTES_HY.md) նկարագրում են իրականացման առաջարկներն ու բաց հարցերը։ Երեք աղբյուրների պատմական կարգավիճակները պահպանվում են։

[Marketplace ADR-009-ը](../marketplace/ADR-009-MARKETPLACE-PLANNING-SIGN-OFF_HY.md) անկախ դոմենային որոշում է։ Այս գրառումն ընդունում է Custom Telegram + AI-ի պլանավորման scope-ը՝ [AGENTS.md-ի առաջնահերթությամբ](../../AGENTS.md#decision-precedence)։ Համահարթակային Phase A-ն դեռ բաց է։

## Հաստատված որոշումներ

| ID | Owner Approved պլանավորման շրջանակ |
| --- | --- |
| CT-DEC-001 | **Professional Multilingual Messenger**՝ աշխատանքային հաղորդակցության համար։ |
| CT-DEC-002 | **Developers, Freelancers և Offices**՝ Armenia-first պահանջարկի վավերացման ուղղությամբ։ |
| CT-DEC-003 | **Text Messaging First**։ P0-ում personal 1:1 messaging և text translation՝ v1.0-ի փուլավորված scope-ով։ Groups, Channels և calls-ը P1-ում են։ |
| CT-DEC-004 | **Հայերեն, անգլերեն և ռուսերեն**՝ որպես մեկնարկային թարգմանության լեզուներ։ Իրական որակը և provider feasibility-ն ենթակա են վավերացման։ |
| CT-DEC-005 | **Original Message + Separate Translation**։ Բնօրինակը պահպանվում է, իսկ թարգմանությունը կապվում է համապատասխան revision-ին։ |
| CT-DEC-006 | **Professional Smart Channels**՝ P1, source-authorized opt-in publication։ Shared audience/quota contract-ը բաց է։ |
| CT-DEC-007 | **Voice/video calls մինչև հինգ մասնակից՝ ներառյալ հրավիրողը**։ P1-ում նախ real-time translated transcript, ապա TTS-ի փորձնական դիտարկում՝ validation gate-ից հետո։ |
| CT-DEC-008 | **Context-Aware Chat AI**՝ P1 user-triggered օգնություն, թույլատրված context և առանց auto-send-ի։ |
| CT-DEC-009 | **Freemium + usage-based + B2B** մոդել։ Free core և վճարովի հնարավորությունների առանձին review։ |
| CT-DEC-010 | **Encrypted Cloud Chat**՝ TLS և encryption at rest։ Encrypted Cloud Chat-ը E2EE չէ։ |
| CT-DEC-011 | **Independent Messaging Core**։ AI-ի խափանումը կամ քվոտայի սպառումը չի կանգնեցնում core messaging-ը։ |
| CT-DEC-012 | **Shared Platform Integration**՝ դոմենային ownership-ով և փոխանցվող shared contracts-ով։ |
| CT-DEC-013 | **Modular Monolith + Workers**՝ որպես դոմենային ճարտարապետական ուղղություն։ |
| CT-DEC-014 | **Provider Adapter Architecture**՝ փոխարինելի AI adapters-ով։ |
| CT-DEC-015 | **Usage metering և spending limits**՝ reservation/reconciliation և cost protection սկզբունքներով։ |
| CT-DEC-016 | **Evidence-Driven Expansion**՝ ըստ պահանջարկի, որակի, անվտանգության, ծախսի և գործառնական պատրաստվածության։ |

## Պայմանական որոշումներ և հետաձգված հնարավորություններ

- **P0։** Text-first personal messaging, original-plus-translation և v1.0-ի աջակցող files/sync/search/notification/safety scope։ Լիազորված Office հոսքը և Marketplace/Network handoff-ը կախված են shared actor/principal, membership և source-authorization պայմանագրերից։
- **P1։** Professional Groups/Channels, consent-gated voice transcription, մինչև հինգ մասնակցով calls, live translated transcripts և user-triggered Chat AI։ Channel quota, consent rules, media performance և provider data terms-ը պահանջում են feature-level հաստատում։
- **P2։** Meeting assistant, task extraction, Office workspace, enterprise controls, channel intelligence, agents և workflow automation։ Ապագա E2EE-ն պահանջում է առանձին privacy/architecture որոշում։
- **Commercial և տեխնիկական պայմաններ։** v1.0-ի Professional/Office գները փորձարարական վարկածներ են։ Production translation tariff-ը, իրական call cost-ը և provider ընտրությունը բաց են։ Exact stack versions-ը, հարթակային topology-ն ու infrastructure-ը ենթակա են ընդհանուր review-ի։ B սկզբնական delivery scope-ը և C երկարաժամկետ դոմենային բարդությունը պահպանվում են որպես պլանավորման ելակետեր։ Platform-wide size/stack հաստատումը մնում է առանձին։

## Նոր լուծումներ և նյութական շեղումների սահման

Պլանավորման փաստաթղթերի համադրմամբ հաստատված P0/P1/P2 շրջանակը փոխող պարտադիր շեղում չի հայտնաբերվել։ Հետևյալ առաջարկները մնում են այս sign-off-ի հաստատման շրջանակից դուրս։

| Առաջարկ կամ անհամապատասխանություն | Անհրաժեշտ որոշում |
| --- | --- |
| Առանձին change cursor, device apply ACK և member receipt aggregation, snapshot/replay և dedupe semantics։ | **Architect Proposed**։ Հաստատել messaging protocol-ը և չափելի acceptance cases-ը։ |
| Translation dedupe/policy epochs, consent revoke, quota reservation state, delete/restore և provider retention։ | **Conditional**։ Հաստատել տեխնիկական, privacy/legal և shared billing պայմանագրերը։ Վերջնական legal և retention policies-ը բաց են։ |
| P1 channel subscription/assignment, publication version/tombstones և call reconnect/segment semantics։ | **Architect Proposed / Shared Platform Pending**։ Համաձայնեցնել audience, quota, history, moderation և media contracts-ը։ |
| User կամ Office onboarding-ի ձև և միջմասնագիտական handoff։ | **Shared Platform Pending**։ Working Platform Specification-ը և v1.0-ի Office context-ը պահանջում են համահարթակային քարտեզագրում։ Գործող product scope-ը փոխող տարբերակը պահանջում է Owner-ի առանձին հաստատում։ |
| CT-WP-02-ի կախվածության ճշտում և CT-WP-11-ի փուլավորման բացահայտում։ | CT-WP-02-ի պլանավորումը մնում է Phase A-ում, իսկ CT-WP-03-ը պահանջում է Phase B authorization։ CT-FR-18-ը մնում է P1-ում, CT-FR-19/20-ը՝ P2-ում։ |

Եթե Shared Platform review-ը պահանջի փոխել P0/P1/P2 scope-ը, առավելագույն մասնակիցների թիվը, data-processing model-ը կամ Marketplace-ի հաստատված սահմանը, առաջացած փոփոխությունը ներկայացնել առանձին Owner որոշման՝ համապատասխան CT-DEC/FR/AT հղումներով։

## Shared Platform կախվածություններ և արտաքին վավերացում

- **Identity/Auth և Organizations։** Actor/principal, Organization և conversation membership, Office mapping, session/WS revocation, resource-level authorization։ Platform-wide Identity architecture-ը սպասում է Shared Platform review-ի։
- **Payments, Storage և Notifications։** Usage accounting/billing, private storage, digest/quarantine/signed access և cutoff, minimal event routing և dedupe։
- **Channels, Network, Marketplace և Shared AI։** Handoff authorization, source ownership, projection lifecycle, audience/quota և processing/consent contracts։ Marketplace listing/order/grant/support case ownership-ը և Messenger outage-ից անկախ core commerce-ը մնում են ADR-009-ի սահմաններում։ [Marketplace shared handoff](../marketplace/MARKETPLACE_SHARED_PLATFORM_DEPENDENCY_HANDOFF_HY.md)
- **Infrastructure և stack։** DB ownership, hosting/regions, realtime, queue/cache, versions, observability, backup/restore և մեկուսացված media plane։ Հաստատման համար անհրաժեշտ են workload, compatibility և փաստագրված ծախսային տվյալներ։
- **Արտաքին վավերացում։** Հայերեն/անգլերեն/ռուսերեն translation benchmark, provider region/data/retention պայմաններ, privacy և consent review, P1 SFU/TURN ու հայերեն STT/TTS և իրական call cost։ Launch-ից առաջ՝ pricing/unit economics, load/security/restore արդյունքներ, support/abuse և on-call ownership։

## Security invariants

Պարտադիր են secrets/credentials պաշտպանությունը, արտաքին input-ի validation-ը, server-side resource authorization-ը, անվտանգ password hashing-ը՝ գաղտնաբառ պահելիս, parameterized queries-ը և sensitive-data redaction-ը։ CORS allowlist-ը և CSRF պաշտպանությունը պարտադիր են։ WebSocket-ը առանձին ստուգում է Origin-ը, ընթացիկ session-ը և resource permission-ը։ Files-ը մնում են մասնավոր quarantine-ում մինչև digest-bound scan approval-ը։ Recording-ը default off է, իսկ AI processing-ը և transcript retention-ը պահանջում են կիրառելի հաստատված համաձայնություն։ Չլուծված Critical dependency vulnerability-ն կանգնեցնում է ազդված աշխատանքը։ [Security invariants](../../AGENTS.md#security-invariants) · [Security rule](../../.cursor/rules/08-security.mdc)

## Մնացած blocker-ներ և թույլտվության կարգավիճակ

- **Initialization։** Shared scope/size, identity/organization պայմանագրերը, ընդհանուր TECH_CARD և 01-ARCHITECTURE, նյութական հակասությունների լուծումը և Platform Phase A-ի հստակ sign-off-ը դեռ բաց են։
- **Feature և production launch։** CT-G02–CT-G07-ի shared contracts-ը, provider/quality evidence-ը, privacy/legal, billing, pilot/production operational readiness-ը սպասում են հաստատման։ Production readiness-ը հաստատված չէ։
- **Domain Planning՝ Accepted։ Platform Phase A՝ Open։ Phase B initialization՝ NOT AUTHORIZED։** Phase B-ն պահանջում է Product Owner-ի առանձին, հստակ թույլտվություն։ Production release-ը նաև ունի առանձին դարպաս։ [Project onboarding workflow](../../.agents/skills/project-onboarding/SKILL.md)
