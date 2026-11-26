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

The application owns Coming Soon rendering, subscriber consent, verification and unsubscribe, and the internal delivery and operator boundaries. Public routes delegate validation and state changes to server-side modules. The module retains its existing data model and provider adapters. No shared packages or root npm workspace are needed for this integration. The root repository's pnpm validation remains its own task.

Vercel builds from `apps/pre-launch` in the existing `meduzellar` project. GitHub feature branches receive protected Previews. After a verified Preview and completion of any GitHub merge gates, `main` builds update the existing HTTPS alias. The current production deployment serves traffic until the replacement succeeds. Preview credentials and subscriber data remain isolated from production. The module ignores a build only when Git confirms its tree is unchanged since the branch's last successful deployment. An initial deployment or unavailable comparison proceeds with a build.

See the [historical module design](pre-launch/phase-a/docs/01-ARCHITECTURE.md) for existing runtime boundaries and the [owner amendment](pre-launch/PRE_LAUNCH_PHASE_A_APPROVAL_RECORD.md#official-repository-integration-amendment) for scope.
