# Meduzellar Pre-Launch repository guidance

**Draft charter for the standalone repository · Owner review pending**

This repository serves the public Coming Soon page, verified waitlist and authorized launch communications. Its approved boundary is independent of the main Meduzellar Platform. [Product brief](docs/BRIEF.md)

## Decision authority

1. Uphold security invariants and applicable legal or contractual obligations.
2. Follow this charter and explicit approval gates.
3. Apply the owner-approved module scope, TECH_CARD and architecture.
4. Treat proposed values, templates and defaults as input to decisions.

The Product Owner approves scope, vendors, spending, data policy and phases. The technical maintainer owns implementation and checks. The production operator owns alerts, incident response and access revocation. Assign named accounts and backups before release. A launch approver acts through the application using campaign controls. Repository write access grants no campaign privilege.

## Gates

- **Phase A** Produce the planning package and resolve decisions. The Product Owner explicitly signs off the document revisions and TECH_CARD values. Record the approval and its scope.
- **Phase B** Begin only after Phase A sign-off and separate explicit authorization naming the repository and approved revisions. Follow confirmed layout and dependencies. Keep test email, staging data and migrations isolated.
- **Release and operations** Obtain applicable explicit authorization for external CI activation, production provisioning, migrations, deployment and release. Live campaigns require separately authenticated and audited authorization.

## Invariants

- Protect credentials and subscriber information. Keep secrets out of Git, logs, telemetry and frontend bundles.
- Validate external inputs and enforce authorization on the server. Use parameterized database access and approved password hashing if password storage is ever authorized.
- Preserve default-deny CORS and applicable CSRF defenses, secure cookies, TLS and least privilege. Verify provider webhooks before processing them.
- Preserve suppression and unsubscribe during retries, restoration and migrations. Consent scope applies across imports, replays and provider changes.
- Keep credentials, database, identity, runtime and release independent of the Platform. Any future transfer requires separate approval and a lawful, disclosed purpose.
- Preserve user changes. Obtain explicit authorization for commits, pushes and irreversible operations outside approved workflows. Report failed checks and stop affected release work for unresolved critical dependency vulnerabilities.

Use the [approval checklist](docs/PROGRESS.md) and [decision records](docs/decisions/README.md). Update public and operational contracts when behavior changes.
