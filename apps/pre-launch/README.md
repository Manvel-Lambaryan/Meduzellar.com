# Meduzellar Pre-Launch

The Coming Soon and verified email waitlist module lives in `apps/pre-launch/` and deploys to [meduzellar-com.vercel.app](https://meduzellar-com.vercel.app/).

Run commands from this directory with the Node version in `.node-version`.

```sh
npm ci
npm run lint
npm run build
npm run typecheck
```

Database-backed tests use the isolated environment in [local implementation](docs/LOCAL_IMPLEMENTATION.md). Production waitlist storage remains unconfigured.

## Migration provenance

Imported from standalone commit `7526a1bccc5a6f9c7a0fc6b1ecd4a491bb6578d8` plus the reviewed working-tree changes, including the latest favicon and visual refinements. The standalone repository retains its Git history and historical screenshot captures. The application's `docs/` includes historical specifications.

See the [owner approval](../../docs/pre-launch/PRE_LAUNCH_PHASE_A_APPROVAL_RECORD.md), [technology card](../../docs/TECH_CARD.md) and [architecture](../../docs/01-ARCHITECTURE.md) for the current boundary.
