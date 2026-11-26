# Ռեպոյի ֆայլերի քարտեզ

Այս ֆայլը `Meduzellar.com` ռեպոյի ներկայիս թղթապանակների և ֆայլերի նկարագրությունն է։ Ամսաթիվը 2026-11-21 է։

Արտադրանքի տեսլականը մնում է արմատային [`README.md`](../README.md)-ում։ Այստեղ գրված է, թե յուրաքանչյուր առկա ֆայլ ինչ դեր ունի ռեպոյում։

Կարգավիճակը Concept & Planning է։ Հավելվածի կոդ, բազայի սխեմա և հաստատված stack այս ռեպոյում դեռ չկան։

## Ինչպես է կազմված ռեպոն

Ռեպոն չորս շերտ ունի։ Յուրաքանչյուրը իր տեղում է պահում մեկ տեսակի գիտելիք։

| Շերտ | Տեղը | Դերը |
| --- | --- | --- |
| Արտադրանք | `README.md`, `docs/BRIEF.md`, `docs/PLATFORM_SPECIFICATION.md`, `list.md` | Ինչ հարթակ է կառուցվելու, հինգ դոմենի սահմանը, աշխատանքային բնութագիրը, մեկնարկի չեկլիստը |
| Կաղապարային գիտելիք | `docs/reference/` | Ստուգաթերթեր, անվանումներ, stack-ի տարբերակներ, ADR ձևանմուշներ։ Սա հաստատված որոշում չի դառնում, քանի դեռ գրված չէ `docs/TECH_CARD.md`-ում |
| Կոդի կանոններ | `.cursor/rules/` | Մշտական ստանդարտ. «միշտ այսպես գրիր», երբ համապատասխան ֆայլը կամ առաջադրանքը բացվում է |
| Agent համակարգ | `.agents/` | Կրկնվող աշխատանքի քայլեր. «այս առաջադրանքի համար արա այս հերթականությամբ» |

Որոշումների իրավասության և առաջնահերթության աղբյուրը [`AGENTS.md`](../AGENTS.md#decision-precedence)-ն է։ Անվտանգության անփոփոխ պահանջներն ու աշխատանքային դարպասները կիրառվում են այդ հերթականությամբ։

## Ծառ

```text
Meduzellar.com/
├── README.md
├── AGENTS.md
├── list.md
├── LICENSE
├── package.json
├── pnpm-lock.yaml
├── .env.example
├── .gitignore
├── .editorconfig
├── .prettierignore
├── prettier.config.cjs
├── .commitlintrc.json
├── scripts/
│   └── validate-agent-config.mjs
├── .github/
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── dependabot.yml
│   └── ISSUE_TEMPLATE/
│       ├── config.yml
│       ├── bug_report.md
│       └── feature_request.md
├── docs/
│   ├── README.md
│   ├── BRIEF.md
│   ├── PLATFORM_SPECIFICATION.md
│   ├── FILES.md
│   ├── archive/
│   │   └── .gitkeep
│   └── reference/
│       ├── templates/
│       ├── knowledge-base/
│       ├── user-rules/
│       ├── workflows/
│       └── Check/
│           ├── Quality/
│           └── Security/
├── .cursor/
│   └── rules/
│       └── 00 … 20 *.mdc
└── .agents/
    ├── README.md
    ├── skills/
    ├── library/
    ├── catalog/
    └── system/
```

## Արմատ

| Ֆայլ | Ինչի համար է |
| --- | --- |
| `README.md` | Արտադրանքի միակ աղբյուրը։ Meduzellar ընկերությունը, Platform-ի հինգ ուղղությունը, տեսլականը, առաքելությունը, բրենդը և §9 կարգավիճակը՝ Concept & Planning։ Նկարագրված Marketplace, recruitment, հաղորդակցություն, թարգմանություն և օգնականը նպատակ են։ |
| `AGENTS.md` | Ռեպոյում աշխատելու կարգը։ Ինչ կարդալ էական աշխատանքից առաջ, որտեղ են կանոնները, skill-երը և catalog-ը, ինչը արգելված է առանց հստակ հանձնարարության։ |
| `list.md` | Մեկնարկի 10 կետանոց չեկլիստ։ Արված են 1, 2 և 7։ Բաց են BRIEF-ի հարցերը, A/B/C չափը, `TECH_CARD`, ճարտարապետությունը, vendor-ները և որակի ավտոմատացումը։ |
| `LICENSE` | MIT արտոնագիր, հեղինակային իրավունք 2026 Meduzellar։ |
| `package.json` | Փաթեթի անունը `meduzellar` է, տարբերակը `0.0.0`։ `lint` և `build` սկրիպտները գործարկում են agent կոնֆիգի ստուգիչը։ Հավելվածի կախվածություններ այստեղ չկան։ Փաթեթի կառավարիչը pnpm 11.14.0 է։ |
| `pnpm-lock.yaml` | pnpm-ի կողպեք։ Հիմա կախվածությունների ծառ չի ֆիքսում, որովհետև `package.json`-ում dependency չկա։ |
| `.env.example` | Տեղային `.env`-ի նմուշ։ `NODE_ENV` և `APP_URL` միայն։ Մեկնաբանությունը ասում է, որ vendor-ի բանալի ավելանում է միայն `docs/TECH_CARD.md`-ում այդ մատակարարին նշելուց հետո։ |
| `.gitignore` | Git-ից դուրս է թողնում `.env`-ը, `node_modules`-ը, build արդյունքը, լոգերը և TypeScript-ի cache-ը։ `.env.example`-ը մնում է ռեպոյում։ |
| `.editorconfig` | Խմբագրիչի ընդհանուր ձևը. UTF-8, LF, 2 բացատ, վերջին նոր տող։ Markdown-ում տողավերջի բացատները չեն կտրվում։ |
| `prettier.config.cjs` | Prettier. միակի չակերտ, կետ-ստորակետ, trailing comma, տողի լայնություն 100, 2 բացատ։ |
| `.prettierignore` | Prettier-ը բաց է թողնում կախվածությունները, build թղթապանակները, `pnpm-lock.yaml`-ը, `prisma/migrations`-ը և `.git`-ը։ |
| `.commitlintrc.json` | Commit հաղորդագրությունները ստուգվում են Conventional Commits կանոնով։ |

### `scripts/validate-agent-config.mjs`

Կախվածություն չպահանջող ստուգիչ։ Կարդում է skill-երը, library փաթեթները, Cursor կանոնները, catalog-ը, պրոֆիլները, արտաքին աղբյուրի կողպեքը և ներքին Markdown հղումները։ Սխալը կանգնեցնում է ստուգումը։ Զգուշացումը գրանցում է պահպանելիության խնդիր և ստուգումը չի ձախողում։ Սա `pnpm lint` և `pnpm build` հրամանների ամբողջ աշխատանքն է, քանի դեռ հավելված չկա։

## `docs/`

| Ֆայլ | Ինչի համար է |
| --- | --- |
| `docs/README.md` | Փաստաթղթերի քարտեզ։ README-ի §1–11-ը կապում է այս թղթապանակի դերերի հետ և ասում, որ `reference/`-ը կաղապար է։ |
| `docs/BRIEF.md` | Աշխատանքային տեխզադրանք։ Մեկ հարթակ, հինգ դոմեն, լսարան, արդեն որոշված սահմաններ և դեռ բաց հարցեր։ Չափը, framework-ը, հոսթինգը, բազան, auth-ը, վճարումը, պահոցը, փոստը, realtime-ը, թարգմանության և օգնականի մատակարարները և UI լեզուները այստեղ բաց են թողնված։ |
| `docs/PLATFORM_SPECIFICATION.md` | Աշխատանքային բնութագիր 2026-11-22-ից։ Հաշվի տեսակ, հաստիք, Custom Tg, մասնագիտական channel, հրապարակման քվոտա, զանգ, թարգմանություն, սահմանափակ օգնական և մասնագիտական ցանց։ README-ն չի փոխարինում։ Stack և իրականացում չի որոշում։ |
| `docs/FILES.md` | Այս ֆայլը։ |
| `docs/archive/.gitkeep` | Դատարկ արխիվի թղթապանակը Git-ում պահելու նշիչ։ Բովանդակություն չունի։ |

Հաստատված փաստաթղթերից դեռ չկան `docs/TECH_CARD.md` և `docs/01-ARCHITECTURE.md`։ Դրանք գրվում են չափի և stack-ի հաստատումից հետո։ Դատարկ դոմենային թղթապանակներ կոդից առաջ չեն բացվում։

### `docs/reference/templates/`

Ձևանմուշներ են։ Լրացված պատճենը դառնում է նախագծի փաստաթուղթ միայն թիմի հաստատումից հետո։

| Ֆայլ | Ինչի համար է |
| --- | --- |
| `PROJECT_INIT.md` | Նոր նախագիծ սկսելու դատարկ ձև. անուն, նպատակ, MVP շրջանակ, ռիսկեր։ |
| `TECH_CARD_TEMPLATE.md` | Տեխնոլոգիական քարտի ձև։ Լրացված տարբերակը պետք է դառնա `docs/TECH_CARD.md`։ |
| `ARCHITECTURE_TEMPLATE.md` | Ճարտարապետության ձև. շերտեր, մոդուլներ, սահմաններ։ Լրացված տարբերակը պետք է դառնա `docs/01-ARCHITECTURE.md`։ |
| `ADR_TEMPLATE.md` | Ճարտարապետական որոշման գրառում. համատեքստ, տարբերակներ, հետևանք։ |
| `PROGRESS_TEMPLATE.md` | Զարգացման առաջընթացի ձև։ |

### `docs/reference/knowledge-base/`

| Ֆայլ | Ինչի համար է |
| --- | --- |
| `TECH_STACK.md` | Տարբեր չափերի համար առաջարկվող տեխնոլոգիաների աղյուսակ. pnpm, Next.js, TypeScript, Tailwind, բազա և այլ տարբերակներ։ Ֆայլի սկիզբը հստակ ասում է, որ սա Meduzellar-ի հաստատված stack չէ։ |
| `NAMING_CONVENTIONS.md` | Ֆայլերի, կոդի և թղթապանակների անվանման համառոտ աղյուսակ։ Ամբողջական սահմանը `.cursor/rules/03-typescript.mdc`-ում է։ |
| `BEST_PRACTICES.md` | Կարճ հիշեցում, թե որ կանոնի ֆայլը որ թեմային է վերաբերում, և մի քանի արագ սահմանափակում։ |

### `docs/reference/user-rules/global-rules.md`

Cursor-ի օգտատիրոջ կանոնների նախատիպ. պատասխանի լեզու, կոդի որակ, մեծ փոփոխությունից առաջ առաջարկ, կոնտեքստի խնայողություն։ Ֆայլն ինքը ասում է, որ կոնտեքստի խնայողությունը մնում է User Rules-ում և չի կրկնվում `.cursor/rules/`-ում։

### `docs/reference/workflows/`

Գործող GitHub Actions workflow այս ռեպոյում չկա։ Այստեղ օրինակներ են, որոնք պատճենվում են `.github/workflows/` միայն որոշումից հետո։

| Ֆայլ | Ինչի համար է |
| --- | --- |
| `ci.yml.example` | Նվազագույն CI. կառուցվածքի պարտադիր ֆայլերի ստուգում `main` ճյուղի push-ի և pull request-ի վրա։ Վերնագիրը ասում է, որ օրինակը ժամանակավորապես անջատված է։ |
| `ci-quality.yml.example` | Ավելի լայն որակի pipeline-ի օրինակ pull request-ի և `main`-ի համար։ Մեկնաբանությունը հղում է անում `docs/QUALITY_AUTOMATION_PLAN.md`-ին, և այդ ֆայլը ռեպոյում չկա։ `list.md`-ի 10-րդ կետը հենց այս օրինակին է մատնանշում որպես ապագա որակի դարպաս։ |

### `docs/reference/Check/Quality/project-quality-checklist.md`

Մարդու կողմից անցկացվող որակի ստուգաթերթ։ Նախկին checklist կանոնից տեղափոխվել է այստեղ, որպեսզի AI-ի մշտական կոնտեքստում չբեռնվի։ Ծածկում է միջուկը, ճարտարապետությունը, անվտանգությունը, թեստը, git-ը և թողարկումը։ Կոդ գրելիս գործող սահմանները `.cursor/rules/`-ում են։

### `docs/reference/Check/Security/`

Անվտանգության ձեռքով և կոդով ստուգաթերթեր։ Դրանք կաղապար են այն stack-ի համար, որը ֆայլերում հիշատակվում է. Next.js, Nest, Neon, Upstash, Cloudflare։ Meduzellar-ի համար այդ ընտրությունը դեռ արված չէ։

| Ֆայլ | Ինչի համար է |
| --- | --- |
| `0 Security List.md` | P0 նվազագույն ցանկ։ Կետերը բաժանված են կոդում արվողի և վահանակում ձեռքով արվողի։ Մնացած համարակալված ֆայլերի բովանդակային ցուցիչն է։ |
| `1 Edge-Network защита (периметр).md` | Եզր և ցանց. HTTPS, HSTS, WAF, DDoS, անվտանգության վերնագրեր, rate limit։ |
| `2 Auth + Sessions (самая любимая точка атаки).md` | Նույնականացում և սեսիա. թողարկում, պահպանում, ժամկետ, ելք։ |
| `3 API безопасность (Next API - Nest).md` | API. վավերացում, լիազորություն, սխալի պատասխան, webhook։ |
| `4 Data-DB (Neon Postgres).md` | Տվյալների բազա. միացում, իրավունքներ, migration, պահուստ։ |
| `5 Secrets & Config hygiene.md` | Գաղտնիքներ և կոնֆիգ. env, ռեպո, լոգ, ռոտացիա։ |
| `6 Observability (иначе ты слепой).md` | Դիտելիություն. լոգ, մետրիկա, ահազանգ, առողջության ստուգում։ |
| `7 Upstash Redis (если используется).md` | Redis, եթե այդ ծառայությունը ընտրվի. բանալի, TTL, հասանելիություն։ |
| `8 Dependency scanning.md` | Կախվածությունների սկանավորում և թարմացում։ |
| `SQL Injection Security Checklist.md` | SQL injection-ի ստուգաթերթ։ Պահանջը պարամետրացված հարցումն է։ |
| `WAF Cloudflare.md` | Եզրային WAF կանոնի գրառում, նույնացուցիչ `REG-SEC-EDGE-001`։ |
| `Проектный Quality Checklist.md` | Երկար համակցված որակի և անվտանգության ցանկ, գործիքների հավաքածու, հակաօրինակներ և թողարկման ամփոփ ձև։ Առանձին է `Check/Quality/project-quality-checklist.md`-ից։ |

## `.cursor/rules/`

19 կանոնի ֆայլ։ Երկուսը միշտ միացած են. `00-core.mdc` և `02-product.mdc`։ Մնացածը բացվում են, երբ առաջադրանքը կամ ֆայլի ուղին համընկնում է այդ կանոնի `globs`-ին։ Դատարկ `globs` նշանակում է, որ կանոնը բեռնվում է առաջադրանքով, ոչ թե ֆայլի տիպով։

| Ֆայլ | Երբ է գործում | Ինչի համար է |
| --- | --- | --- |
| `00-core.mdc` | միշտ | Ընդհանուր կարգ. տիպեր, գաղտնիքներ, սխալների մշակում, ինչը կարելի է անել ինքնուրույն և ինչը հաստատում է պահանջում։ Կանոնների ցուցիչը։ |
| `01-architecture.mdc` | առաջադրանքով | Շերտեր, մոդուլների սահման, չափին համապատասխան թղթապանակներ։ |
| `02-product.mdc` | միշտ | Հարթակի շրջանակը. հինգ դոմեն, ինչն է դուրս, քանի դեռ հաստատված չէ, և զգայուն տվյալների ցանկը։ |
| `03-typescript.mdc` | `*.ts`, `*.tsx` | Խիստ TypeScript, `any`-ի արգելք, generics, narrowing։ |
| `04-react-nextjs.mdc` | `*.tsx`, `app`, `components`, `features` | React և Next.js App Router. սերվերային կոմպոնենտը լռելյայն է, client սահմանը նեղ է։ |
| `05-backend-nestjs.mdc` | `api`, `server`, `backend`, service, controller, module | NestJS մոդուլ, controller, service, guard, pipe, վավերացում։ |
| `06-database.mdc` | Prisma, `db`, `database`, migrations | Սխեմա, migration, հարցման անվտանգություն, տրանզակցիա, էջավորում, միացումների քանակ։ |
| `07-api-design.mdc` | `api`, controller, `routes` | REST. տարբերակ, սխալ, էջավորում, կրկնակի կանչի անվտանգություն, webhook։ |
| `08-security.mdc` | `auth`, `api`, middleware, env | Գաղտնիքներ, նույնականացում, վավերացում, վերնագրեր, CORS։ Մարդու ստուգաթերթը `0 Security List.md`-ն է։ |
| `09-figma-design.mdc` | `*.tsx`, `components`, `styles`, `ui` | Figma-ից կոդ. թոքեն, կոմպոնենտ, տեսողական համընկնում։ |
| `10-testing.mdc` | թեստ ֆայլեր և `tests` | Թեստը ըստ ռիսկի. unit, integration, regression, ծայրից ծայր։ |
| `11-documentation.mdc` | `docs`, `*.md`, README | Փաստաթղթի տեղը, README-ի դերը, ADR և TECH_CARD։ |
| `12-error-handling.mdc` | `*.ts`, `*.tsx` | Տիպավորված սխալ, HTTP համապատասխանություն, լոգ, ներքին մանրամասի թաքցում։ |
| `13-git-workflow.mdc` | առաջադրանքով | Ճյուղ, Conventional Commits, pull request-ի մաքրություն։ |
| `14-ops.mdc` | `api`, `server`, `backend` | Դիտելիություն և հուսալիություն. կառուցվածքային լոգ, մետրիկա, timeout, կրկնություն, առողջություն։ |
| `15-performance.mdc` | `app`, `components`, `*.tsx` | Web Vitals, փաթեթի չափ, հարցումներ, քեշ։ |
| `16-state-management.mdc` | `*.tsx`, hooks, store, features | State-ի տեղը. սերվեր, URL, ձև, տեղային կամ ընդհանուր client state։ |
| `17-cicd.mdc` | `.github`, Dockerfile | Pipeline, գաղտնիքներ, Docker, կառավարվող թողարկում։ Մանրամասն օրինակները `docs/reference/workflows/`-ում են։ |
| `20-i18n.mdc` | `locales`, `i18n`, `messages`, middleware | Ինտերֆեյսի թարգմանություն. տեքստը կոդից դուրս, ձևաչափ ըստ լեզվի, RTL երբ պետք է։ Զանգի և չատի realtime թարգմանությունը այս կանոնի թեման չէ. դա BRIEF-ի առանձին դոմենն է։ |

`18` և `19` համարներով կանոն չկա։ Դիտելիությունն ու հուսալիությունը միացված են `14-ops.mdc`-ում։ Checklist-ը տեղափոխված է `docs/reference/Check/Quality/`։

## `.agents/`

Agent համակարգի տունը։ Արտադրանքի որոշում այստեղ չի պահվում։ Դա գրված է `.agents/README.md`-ի սկզբում։

| Վիճակ | Տեղը | Ինչ է նշանակում |
| --- | --- | --- |
| Ակտիվ | `.agents/skills/` | Agent-ը այս workflow-ն տեսնում է և կարող է գործարկել |
| Library | `.agents/library/` | Փաթեթը պատրաստ է և գրանցված է, բայց agent-ը այն չի տեսնում |
| Պրոֆիլ | `.agents/catalog/profiles.json` | Ցանկալի կազմ։ Պրոֆիլում լինելը library skill-ը չի միացնում |
| Installer | դեռ չկա | Ապագա գործիք, որը ընտրված library փաթեթը կտեղափոխի ակտիվների մեջ |

### Ակտիվ skill-եր

Յուրաքանչյուր փաթեթի հիմնական ֆայլը `SKILL.md`-ն է։ `references/`-ը բացվում է միայն այդ աշխատանքի ընթացքում։

| Skill | Ֆայլեր | Ինչի համար է |
| --- | --- | --- |
| `project-onboarding` | `SKILL.md` | Phase A-ում առաջարկում է A/B/C չափը, պատրաստում TECH_CARD-ի և ճարտարապետության որոշումները և ստանում սեփականատիրոջ հաստատումը։ Phase B initialization-ը պահանջում է առանձին հստակ թույլտվություն։ |
| | `references/project-sizing.md` | Չափի չափանիշները. ժամկետ, թիմ, ֆիչերի քանակ, թղթապանակի տեսակ։ Առաջարկից հետո սպասում է հաստատման, հետո գրում է TECH_CARD-ում։ |
| | `references/project-sizes/size-a-small.md` | Փոքր. մոտ 1–3 ամիս, 1–2 մշակող։ Դասավորություն `src/app`, `components`, `lib`, `types`։ |
| | `references/project-sizes/size-b-medium.md` | Միջին. մոտ 3–6 ամիս, փոքր թիմ։ Դասավորություն `src/features` և `src/shared`։ |
| | `references/project-sizes/size-c-large.md` | Մեծ. 6 ամսից ավելի, մի քանի թիմ։ Դասավորություն `apps/` և `packages/`։ |
| `debug-first` | `SKILL.md` | Բագ, ռեգրեսիա, սխալ վարք։ Նախ վերարտադրում և պատճառ, հետո կոդի փոփոխություն։ |
| `verify-before-completion` | `SKILL.md` | Էական փոփոխությունից հետո ստուգում, նախքան ավարտ հայտարարելը։ Բացատրություն միայն տվող առաջադրանքի համար չէ։ |
| `safe-database-migration` | `SKILL.md` | Սխեմայի փոփոխության պլան, ստեղծում և ստուգում։ Սովորական կարդալու հարցումը այս skill-ով չի գնում։ |
| | `references/migration-risk-guide.md` | Migration-ի ռիսկի ուղեցույց. ինչ փոփոխություն է վտանգավոր և ինչ ստուգել։ |
| `figma-to-production` | `SKILL.md` | Figma-ից կամ դիզայնի նկարագրից production UI, առկա դիզայն համակարգով։ |
| | `references/visual-verification.md` | Տեսողական ստուգման քայլեր. համընկնում, վիճակներ, չափեր։ |

### Library skill-եր

Այս չորսը catalog-ում `library` վիճակով են։ Պրոֆիլները դրանք նշում են, բայց `.agents/skills/`-ում չեն, ուստի ներկա agent-ը դրանք որպես գործող workflow չի բացում։

| Skill | Ֆայլեր | Ինչի համար է |
| --- | --- | --- |
| `code-review` | `SKILL.md`, `references/review-checklist.md` | Diff-ի, commit-ների միջակայքի կամ pull request-ի անկախ review. ճշտություն, ռեգրեսիա, բաց պահանջ, անվտանգություն, պահպանելիություն։ Ներքին փաթեթ է։ |
| `security-review` | `SKILL.md`, `references/security-review-checklist.md` | Ապացույցով անվտանգության review. auth, իրավունք, վճարում, webhook, ֆայլի վերբեռնում, անձնական տվյալ, բազմավարձակալ հասանելիություն։ Ներքին փաթեթ է։ |
| `react-performance-review` | `SKILL.md`, `references/react-performance-checklist.md` | React և Next.js արդյունավետության review. դանդաղ էջ, մեծ փաթեթ, հարցումների ջրվեժ, ավել client JavaScript։ Ներքին փաթեթ է։ |
| `ui-accessibility-review` | `SKILL.md`, `references/ui-accessibility-checklist.md`, `SOURCE.md`, `LICENSE.source.txt` | Ինտերֆեյսի մատչելիություն, ստեղնաշար, ֆոկուս, ձև, լեզվի զգայուն բովանդակություն։ Միակ արտաքինից հարմարեցված փաթեթն է։ |

`ui-accessibility-review/SOURCE.md`-ն արձանագրում է աղբյուրը. Vercel Web Interface Guidelines, կոնկրետ commit `4e799d45c17aec1498c269287a83b9dba22b966b`, MIT, վերանայված 2026-07-12։ `LICENSE.source.txt`-ը այդ աղբյուրի արտոնագրի տեղական պատճենն է։ Նույն գրառումը կրկնվում է `sources.lock.json`-ում։

### `.agents/catalog/`

Մեքենայով ստուգվող գրանցամատյան։ Skill-ի քայլերը այստեղ չեն պատճենվում։

| Ֆայլ | Ինչի համար է |
| --- | --- |
| `README.md` | Catalog-ի կանոնը. կյանքի ցիկլ, ակտիվացում, պրոֆիլների ժառանգում, արտաքին աղբյուրի պահանջներ։ |
| `catalog.json` | 9 skill-ի մետատվյալ. անուն, կատեգորիա, վիճակ, ծագում, ուղի, համատեղելիություն Cursor-ի և Codex-ի հետ, ռիսկ։ |
| `profiles.json` | 6 պրոֆիլ։ `core` ունի `debug-first`, `verify-before-completion`, `code-review`։ `frontend`-ը ժառանգում է `core`-ը և ավելացնում է Figma, React performance և accessibility։ `backend`-ը ժառանգում է `core`-ը և ավելացնում է migration-ը։ `security-sensitive`-ը ժառանգում է `core`-ը և ավելացնում է `security-review`-ն։ `fullstack`-ը միացնում է frontend-ը և backend-ը։ `greenfield`-ը ժառանգում է fullstack-ը և ավելացնում է `project-onboarding`-ը։ |
| `sources.lock.json` | Արտաքին աղբյուրի անփոփոխ գրառում։ Հիմա մեկ գրառում կա՝ `vercel-web-interface-guidelines`։ |

### `.agents/system/`

Այս թղթապանակը նկարագրում է agent համակարգի կառուցումն ու կառավարումը։ Platform-ի թողարկման կարգավիճակը այստեղ չի գրվում։

| Ֆայլ | Ինչի համար է |
| --- | --- |
| `ARCHITECTURE.md` | Կանոն, skill և reference բաժանումը։ Որտեղ է ապրում յուրաքանչյուրը, ինչպես են կապված catalog-ը և ստուգիչը։ |
| `SKILL_AUTHORING_GUIDE.md` | Նոր skill գրելու ստանդարտ. մեկ աշխատանք, հստակ trigger, կանգի պայման, արդյունքի պայմանագիր։ |
| `SKILL_TRIGGER_TESTS.md` | Օրինակներ, թե որ նախադասությունը որ skill-ը պետք է բացի և որը չպետք է բացի։ |
| `EXTERNAL_SKILL_POLICY.md` | Արտաքին skill ներմուծելու կարգ. ուսումնասիրություն, անվտանգություն, արտոնագիր, կողպեք, հետո միայն library։ |
| `DECISIONS.md` | Agent համակարգի կայացված որոշումները։ |
| `ROADMAP.md` | Փուլերի ճանապարհ։ 1, 2, 2.1, 3A և 3B ավարտված են։ 3C-ի Batch 1A և 1B ավարտված են։ Հաջորդը Batch 1-ի գնահատումն է իրական աշխատանքի վրա, ապա Batch 2։ |
| `PHASE_STATUS.md` | Ընթացիկ փուլի կարճ կարգավիճակ և վերջին ստուգման ամփոփում։ |
| `research/PHASE_3B_SKILL_EVALUATION.md` | Արտաքին skill-երի որակական գնահատում, որից հետո library-ի առաջին խմբաքանակն է ընտրվել։ |

## `.github/`

| Ֆայլ | Ինչի համար է |
| --- | --- |
| `PULL_REQUEST_TEMPLATE.md` | Pull request-ի հայերեն ձև. նկարագրություն, փոփոխության տիպ, կապված issue, README-ի շրջանակի ստուգում, TECH_CARD-ից դուրս stack չընտրելու կետ։ |
| `ISSUE_TEMPLATE/config.yml` | Դատարկ issue-ները թույլատրված են։ Արտաքին կոնտակտի հղում չկա։ |
| `ISSUE_TEMPLATE/bug_report.md` | Բագի ձև. նկարագրություն, վերարտադրման քայլեր, սպասված վարք։ Վերնագիրը սկսվում է `[Bug]`-ով։ |
| `ISSUE_TEMPLATE/feature_request.md` | Առաջարկի ձև կանոնի, կաղապարի կամ բարելավման համար։ Վերնագիրը սկսվում է `[Feature]`-ով։ |
| `dependabot.yml` | Շաբաթական թարմացում GitHub Actions-ի համար, բաց pull request-ների սահմանը 5 է։ npm բլոկը մեկնաբանության մեջ է։ `package.json` արդեն կա, բայց հավելվածի կախվածություն չունի, ուստի npm հետևումը դեռ միացված չէ։ |

`.github/workflows/` թղթապանակ չկա։ CI-ն դեռ չի աշխատում GitHub-ում։

## Ինչ կա և ինչ դեռ սպասում է

Առկա է արտադրանքի սահմանը, աշխատանքային տեխզադրանքը, կոդի 19 կանոնը, 5 ակտիվ skill-ը, 4 պատրաստ library skill-ը, catalog-ը, ստուգիչ սկրիպտը և կաղապարային ստուգաթերթերը։

Դեռ չկան հավելվածի `src/`, բազայի սխեմա, `docs/TECH_CARD.md`, `docs/01-ARCHITECTURE.md`, գործող CI workflow և library skill-երը միացնող installer։ `list.md`-ի 3-ից 6 և 8-ից 10 կետերը հենց այս բացերն են։
