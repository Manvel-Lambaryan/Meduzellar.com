# Marketplace v1.1 — governance-ի առաջարկվող ուղղումներ

Սկզբնաղբյուրն է [Marketplace Master Architecture v1.1-ը](MEDUZELLAR_MARKETPLACE_MASTER_ARCHITECTURE_HY.md)։ Ստորև գրանցված են հաջորդ խմբագրման առաջարկները։ Գործող կիրառման սահմանները սահմանում են [AGENTS.md-ը](../../AGENTS.md) և դրա կիրառելի կանոնները։

| v1.1 հատված | Առաջարկվող ուղղում | Գործող հիմք |
| --- | --- | --- |
| §6.1, տող 288, և AT-16, տող 460 | Պահպանել վստահելի origin-ների allowlist-ը և cookie-authenticated mutation-ների CSRF պաշտպանությունը։ Հստակ նշել, որ երկու վերահսկողություններն էլ պարտադիր են, իսկ գործող կարգով անջատման բացառություն չկա։ | [Security rule](../../.cursor/rules/08-security.mdc) |
| NFR-08, տող 433 | Չլուծված Critical dependency vulnerability-ի դեպքում կանգնեցնել ազդված աշխատանքը և հայտնել dependency-ն, vulnerability ID-ն, եթե հայտնի է, ազդված բաղադրիչը և ապացույցը։ Ticket-ը կամ ուղղման պլանը գրանցում է առաջընթացը։ Աշխատանքը վերսկսվում է խոցելիությունը լուծելուց հետո։ | [Security rule](../../.cursor/rules/08-security.mdc) |
| §0, տող 13 | Որոշումների իրավասության համար հղվել AGENTS.md-ի առաջնահերթությանը։ Blueprint-ի տեխնիկական ընտրությունները պահել որպես առաջարկներ մինչև համապատասխան repository approval-ը։ | [AGENTS.md](../../AGENTS.md#decision-precedence) |
| §12.1, տողեր 484–486 | A1-ի ավարտը կապել Phase A-ի հստակ հաստատման և հաստատված չափի, TECH_CARD-ի ու architecture-ի գրառման հետ։ B1-ի մեկնարկը կապել առանձին, հստակ Phase B initialization թույլտվության և workflow-ի նախապայմանների հետ։ | [Project onboarding](../../.agents/skills/project-onboarding/SKILL.md) |
