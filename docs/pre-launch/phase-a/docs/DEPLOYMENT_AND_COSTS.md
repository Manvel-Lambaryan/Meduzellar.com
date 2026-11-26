# Deployment, operating costs and retirement

**Status** Proposed · USD model based on public list information checked 2026-11-26

## Environments

| Environment | Plan |
| --- | --- |
| Local / CI | Isolated PostgreSQL fixture, fake provider, no external PII, synthetic operator identities and webhook fixtures. |
| Preview | Vercel preview builds, no production secrets or cron. Synthetic data, outbound email disabled by default. Access restricted on operator/test previews. |
| Staging | Independent project and DB, isolated Clerk app, safe sender or test mode, allowlisted test mail. Exercise a supervised scheduler trigger even if native cron is only on Vercel production deployments. |
| Production | Vercel Pro project, PostgreSQL/Neon Launch and authorized region, Clerk Pro with MFA, approved Resend team/domain, provider webhooks and monitored worker. Enable cron only under authorized deployment. |

Validate Vercel Node function duration/memory, time budget, egress, scheduled overlap, bundle/build, driver pooling and deployment protection in staging. Use a dedicated production region near the DB and CDN for public delivery. Put staging and production in separate projects, select canonical HTTPS origin, register verified sender subdomain with SPF/DKIM/DMARC, verify reply/support mail and publish privacy and social configuration. DNS/registrar access remains Meduzellar-owned.

| Configuration group | Examples and owners |
| --- | --- |
| Public | Canonical origin, configured social URLs, public Turnstile/Clerk identifiers, consent revision, build asset manifest. Product and technical owners approve. |
| Runtime secrets | DB pooled URL(s), envelope and digest key versions, provider API/webhook keys, operator auth secret, Turnstile Siteverify secret, cron bearer. Operations controls rotation and scopes. |
| Migration and recovery | Direct DB URL with migration role, backup/ledger credentials and recovery contact. Stored separately from runtime. |
| Operational controls | Campaign and enrollment stop switches, environment send mode, recipient allowlist, quota/cost cap, scheduler budget, retry and retention values. Audit mutations. Default live sending closed until gates are met. |

Asset derivatives deploy as static files. Keep source art under approved access outside the deployed image. Avoid additional object storage unless measured asset handling requires it. Set up independent uptime and worker-heartbeat alerts, failure counts and provider quota alerts. Initial proposed operational thresholds are missing worker heartbeat for 5 minutes, verification oldest pending >5 minutes, any UNKNOWN live delivery and material bounce/complaint spikes. Define named recipients and confirm the alert path outside the system being monitored.

## Monthly cost model

Published components are Vercel Pro $20/mo for the starting configuration, Clerk Pro $20/mo equivalent with annual billing (USD 240 annual commitment before tax), Neon Launch $0.106/CU-hour and $0.35/GB-month, Resend Pro $20/mo for 50,000 sends plus $0.90 per additional started 1,000 when enabled, and Turnstile Free. Public pricing, terms, feature availability and tax must be reconfirmed at purchase. [Vercel](https://vercel.com/pricing) · [Clerk](https://clerk.com/pricing) · [Neon](https://neon.com/pricing) · [Resend](https://resend.com/pricing?product=transactional) · [Resend overage](https://resend.com/changelog/pay-as-you-go-pricing) · [Turnstile](https://developers.cloudflare.com/turnstile/plans/)

Assume one production hosting seat, one controller, Vercel usage within included resources, one DB at 0.25 CU for 730 h with 1 GB at about $19.70, and existing DNS. Minute polling can keep Postgres awake, so plan for that floor even on a quiet site. The $19.70 estimate excludes restore history, extra branches, transfer and extra compute. A 0.5-CU average raises model DB cost to about $39.04. Staging allowance is an unverified $0–10/mo if on-demand with traceable usage. Alerting allowance is $0–10/mo, separate from hosting logs. Asset storage is $0 incremental within included static delivery; transfer and image charges are usage-sensitive. Existing domain use is modeled at $0 incremental; new registration, monitoring upgrades, extra seats, external backup storage, asset production, taxes and support labor need separate quotes.

| Verified subscribers | Verification + confirmation volume / isolated month | One launch volume / isolated month | Combined Resend bill if same month | Combined baseline including $20 hosting, $20 auth and $19.70 DB |
| ---: | ---: | ---: | ---: | ---: |
| 100 | 210 · $0 quota scenario / $20 Pro | 105 · $0 quota scenario across days / $20 Pro | $20 planned | $79.70 |
| 1,000 | 2,100 · $0 quota scenario / $20 Pro | 1,050 · $20 Pro for prompt dispatch | $20 | $79.70 |
| 10,000 | 21,000 · $20 | 10,500 · $20 | $20 | $79.70 |
| 50,000 | 105,000 · $69.50 | 52,500 · $22.70 | $117.20 | $176.90 |

Volumes model two service emails per verified subscriber and one launch delivery, with a 5% headroom scenario on each. Assumes overages enabled with approval on Pro; same-month bill shares one 50k allowance and separate-month bills are alternatives. Unverified joins, resends and provider-specific metering can consume more. Add $0–20 modeled for monitoring and staging, excluding quoted items above. Review tier and confirmed recipient count before a campaign. A 50k cohort at 45/min allocated to launch needs approximately 18.5 hours before retries and pauses. The owner sets a delivery window consistent with throughput, warms the sender, and verifies account limits. Avoid capacity projections based only on nominal request rates. [Resend API quotas](https://resend.com/docs/api-reference/rate-limit)

Vercel Hobby is for non-commercial personal use and permits daily cron only. Neon Free has 100 CU-hours and 1 GB per project, so minute polling could overrun the compute allowance. Resend Free has 100/day and 3,000/month, which can delay verification or launch mail. Clerk lists MFA on Pro. AWS SES's advertised base outbound unit rate can reduce volume costs, with production access, reputation setup and new idempotency/reconciliation validation required. Render prices a small paid web instance from $7/mo and a cron service from $1/mo with usage billing, but validate memory, CDN, service count and operator support costs before adopting it. [Vercel Hobby](https://vercel.com/docs/plans/hobby) · [Cron quotas](https://vercel.com/docs/schedules/cron-jobs/usage-and-pricing) · [AWS SES pricing](https://aws.amazon.com/ses/pricing/) · [Render pricing](https://render.com/pricing) · [Render cron](https://render.com/docs/cronjobs)

## Release and recovery

Confirm accounts, domain, regions, billing caps, retention, security and operations ownership. Review migrations with a restore point. Provision production only with explicit authorization. Deploy with enrollment and live email controls closed. Verify CSP, origin, DKIM/DMARC, webhooks, notices, backup evidence, alerting and restricted smoke flow. Open enrollment only under release authorization. Launch email stays behind its own MFA approval.

Proposed recovery objectives are RPO ≤1 hour and RTO ≤4 hours, contingent on restore window, ledger design, backups and drills. Roll back application release while preserving compatible schema. On provider outage pause campaign, preserve jobs, and reconcile before re-enabling. On spam/complaint spike pause dispatch, review consent and deliverability, then approve staged recovery. On restore, stop all sends and replay erasures and opt-outs before reconciliation. [Worker recovery](EMAIL_OPERATIONS.md) · [Privacy handling](SECURITY_PRIVACY.md)

## Transition and decommission

Before launch, confirm the approved platform destination, CTA, DNS transition owner, subscriber purpose and cutover schedule. Freeze new intake at the approved boundary, reconcile the campaign and preserve the opt-out path for the approved period. Redirect the public landing once authorized while keeping old token routes available. Disable worker and webhooks after final reconciliation, revoke keys, delete or anonymize data according to the approved retention policy and expire backups. Preserve the minimum required audit and proof of completion. Subscriber import into the Platform requires a separate owner/privacy decision, purpose compatibility and transfer evidence. The default plan retires the waitlist in place.
