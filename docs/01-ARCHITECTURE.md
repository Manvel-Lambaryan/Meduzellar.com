# Meduzellar Pre-Launch integration architecture

**Status** Approved for the Pre-Launch module under PL-A-2026-11-26, as amended.

```text
Meduzellar.com/
  apps/pre-launch/
    src/                 App Router pages, components and server modules
    public/              Approved application artwork
    prisma/              Existing schema and migrations
    scripts/             Local tooling
    tests/               Existing application tests
    package-lock.json    Module-local npm dependency lock
    vercel.json          Module-specific build configuration
  docs/
    TECH_CARD.md         Module-specific approved stack
    pre-launch/          Owner decision and frozen Phase A snapshot
```

The application owns Coming Soon rendering, subscriber consent, verification and unsubscribe, and the internal delivery and operator boundaries. Public waitlist mutation routes delegate state changes to the JSON waitlist service. A private `waitlist.json` object holds encrypted records, consent history, token digests, and the mail outbox. A separate private JSON object holds expiring keyed rate counters. Writes use current ETags and bounded conflict retries, including create-if-absent for initial files. Malformed documents fail closed. The same format can be exercised with atomic file replacement in an isolated loopback directory.

Preview and Production use separate private stores and credentials. Existing database-backed campaign and operator tooling remains isolated. Releasing JSON enrollment requires a verified mail path, an approved privacy notice and a JSON erasure/recovery process. The root repository's pnpm validation remains its own task.

Vercel builds from `apps/pre-launch` in the existing `meduzellar` project. GitHub feature branches receive protected Previews. After a verified Preview and completion of any GitHub merge gates, `main` builds update the existing HTTPS alias. The current production deployment serves traffic until the replacement succeeds. Preview credentials and subscriber data remain isolated from production. The module ignores a build only when Git confirms its tree is unchanged since the branch's last successful deployment. An initial deployment or unavailable comparison proceeds with a build.

See the [historical module design](pre-launch/phase-a/docs/01-ARCHITECTURE.md) for existing runtime boundaries and the [owner amendment](pre-launch/PRE_LAUNCH_PHASE_A_APPROVAL_RECORD.md#official-repository-integration-amendment) for scope.
