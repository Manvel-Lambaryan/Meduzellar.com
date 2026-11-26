# Security and privacy architecture

**Status** Proposed · Controller and jurisdiction review pending

## Threats and controls

| Threat | Required control and evidence |
| --- | --- |
| Enumeration, email bombing and quota abuse | Generic 202 by address, bounded parsing, edge and database-backed keyed-IP/group/address limits, cooldowns and global admission budget, server-side Turnstile, provider caps, uniform status/shape, and response-timing review. |
| CSRF and cross-origin writes | Same-origin exact Origin validation and CSRF token for browser cookie-auth mutations. Use strict allowlists for CORS, no wildcard credentials. Provider callbacks and RFC 8058 use scoped non-cookie proof, reject unsolicited browser credentials and are tested separately. |
| XSS, unsafe URLs and rendering | Escape untrusted output, render from constrained typed templates, enforce allowlisted HTTPS destinations, and avoid raw HTML, redirects based on request headers and user-supplied callback URLs. Use CSP, frame ancestors, HSTS after domain review, nosniff and referrer controls. |
| Token disclosure or replay | Scoped high-entropy keys and credentials, expiry, proof digests, atomic generation checks, single-use verification, repeat-safe unsubscribe, no token logging, and no third-party scripts on token pages. |
| Campaign misuse and compromised sessions | Invitation-only MFA, local current grants, fail-closed factor freshness, revision-bound explicit approval, capacity ceiling, test approval, audit and global stop switch. |
| Webhook replay and delayed events | Signature and timestamp check on raw request body, bounded body, unique provider event ID, out-of-order test, quarantine unrecognizable events and sanitized alerts. |
| DB and supply-chain compromise | Scoped pooled runtime roles, separately scoped worker and migration roles, parameterized statements, encrypted transport, encrypted address/key separation, secret rotation, dependency checks and reviewed deployments. |
| Operational data leaks | Structured allowlist logging, redacted errors, zero tracking on email links, no subscriber export in admin, private backups, controlled access and retention. |

Proposed subscribe budgets for review are 10 valid attempts per 10 minutes per trusted IP bucket, a 30-minute per-address resend cooldown and three verification messages per address per rolling day plus a global budget. Establish separate bounds for anonymous verification/unsubscribe and authenticated admin actions. Unsubscribe remains available independently of Turnstile and enrollment budget, subject to endpoint-specific protections. Derive IP only from trusted hosting metadata and normalize IPv6 by a reviewed prefix. Rate keys are scoped HMACs with short TTLs, and raw IP is discarded after request processing. Tune false positives under NAT and load. Reject Turnstile proof unless Siteverify passes for the expected hostname and action. If availability fails, return a retriable state with an accessible support route for visitors unable to complete the challenge. [Turnstile plan](https://developers.cloudflare.com/turnstile/plans/) · [Server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)

## Operator trust

Clerk serves operators only. Require invitation and provider MFA, with a current database grant checked by exact issuer and subject on each protected operation. `OPERATOR` can draft, test and monitor. `OWNER` can also approve/send, pause, cancel, manage operational opt-outs and oversee deletion. For sensitive writes, require the signed `fva` claim to contain a nonnegative second-factor age within the proposed 10-minute threshold, accounting for token age. Fail closed on missing, malformed, stale or downgraded proof. Validate issuer, expected authorized party, signature, expiration and session status with the SDK. Verify the actual managed session transport and cookie behavior, require TLS and first-party origins, and use Secure, HttpOnly, SameSite cookies for app-owned session material. Verify forced revocation, removed grants, missing MFA, backup-factor policy, any authorized passkey flow, and strict reverification before live processing. Keep managed recovery restricted and audited. [Clerk MFA](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options) · [Session claims](https://clerk.com/docs/guides/sessions/session-tokens) · [Clerk reverification](https://clerk.com/docs/guides/secure/reverification)

Audit grant changes, preview/test, campaign approve/pause/resume/cancel, quota changes, suppression overrides, deletion and emergency operations. Persist privileged state transitions and audit together. Audit IDs and decision evidence exclude email, tokens and provider response bodies. Keep audit storage append-only for runtime and access restricted. Provide a production operator and independent recovery contact.

## Data scope and candidate retention

The controller notice must name the legal controller and contact, collected data, purpose, providers and categories, applicable rights, retention, transfers and how to unsubscribe or request deletion. Obtain qualified review for audience jurisdictions, transfer terms, provider DPAs and sender requirements. Consent is affirmative, timestamped and versioned, with a retained copy/content hash of the shown wording. Measure without open pixels, link rewriting or third-party marketing scripts.

| Data | Proposed retention for owner/privacy approval |
| --- | --- |
| Unverified subscriber and consent | 14 days after latest allowed grant or until deletion, whichever is earlier. |
| Verification token and mail payload reference | 24 h active; delete expired authentication material and unnecessary payload references within seven days. |
| Active subscriber and consent | Through the campaign, then up to 30 days for support and reconciliation, subject to approved closure and documented exceptions. |
| Unsubscribed records and credentials | Remove contact data after 30 days or verified deletion. Preserve a minimal suppression entry where approved. Credential validity covers the subscriber lifecycle and at least the approved post-campaign opt-out window; delete on privacy erasure. |
| Receipt projections and delivery attempts | 30 days for detailed operational data, then aggregate or purge. |
| Abuse, audit and suppression | Abuse counters up to 24 h; sanitized admin audit 180 days; suppressed digest to module retirement or approved purpose-limited expiry. Backups set independently to meet restore policy. |

Pseudonymous contact digests, operator IDs and provider IDs still require restricted handling. Rotate encryption, lookup and token versions with overlap. Lookup rotation requires testing dual reads/writes and uniqueness against both versions until backfill and purge finish. Keep key recovery and restore available for approved backup windows only.

## Deletion and incident recovery

Accept deletion through the published privacy contact. Verify control of the mailbox using a dedicated purpose-scoped proof or a documented support verification path. Set DELETION_PENDING to stop future dispatch, then authorize a background erasure transaction and revoke credentials. Cancel unsent work, purge address ciphertext and unnecessary subscriber-linked fields and provider data where supported, and retain only approved minimal evidence. Record completion and repeat safely. The proposed seven-day operational completion target is subject to privacy review and documented exceptions.

Maintain a separately protected short-lived deletion/suppression ledger or equivalent recovery mechanism that survives restoration of the primary DB. Commit a minimal recovery event with the primary state change and export idempotently to the separate destination. Monitor the export watermark. Before reopening a restored environment, replay approved erasures and opt-outs, reconcile ambiguous handoffs and validate queue state. Keep sending paused if the continuity of privacy events between the recovery point and incident cannot be established. Backups expire on policy and remain access controlled. If keeping any suppression digest after deletion is impermissible, remove it and document the resulting future re-enrollment behavior.

For credential exposure or suspicious sending, pause dispatch, revoke operator access or provider keys, preserve sanitized evidence, assess notify obligations with controller and rotate. Restore only after scope and suppression are re-established. [Deployment and recovery](DEPLOYMENT_AND_COSTS.md)
