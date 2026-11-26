# Meduzellar Pre-Launch local implementation

Phase B is authorized under PL-A-2026-11-26 for the standalone repository. The 15 files in the Phase A snapshot are retained byte for byte. The owner's November 26, 2026 approval supersedes the pending local sign-off labels in those frozen revisions.

## Run locally

Use the checksum-verified Node.js 24.22.3 runtime and PostgreSQL 17.12 Windows binaries. The local setup script expects them in `.local/node-v24.22.3-win-x64` and `.local/pgsql`. It creates an isolated PostgreSQL cluster listening on 127.0.0.1:55432 with generated credentials for separate migration and application roles. The development app uses port 3001.

```powershell
$env:Path="$(Resolve-Path .local/node-v24.22.3-win-x64);$env:Path"
npm.cmd ci
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ./scripts/setup-local.ps1
npm.cmd run db:generate
node --env-file=.env.local scripts/local-migrate.mjs
npm.cmd run dev -- --port 3001
```

Sign up with an `@example.test` address. In another shell with the same Node runtime on PATH, run `npm.cmd run worker` to process due work. Run `npm.cmd run mail` to list captured messages and `npm.cmd run mail -- <capture-id>` to show a synthetic message. Open the confirmation link, submit the confirmation, and dispatch again to capture the confirmation with its unsubscribe link. The local dispatcher only writes to the encrypted mailbox table.

Run `npm.cmd run waitlist:report` to refresh `.local/waitlist-report.json`. It lists pending and verified synthetic waitlist addresses and their counts as of the timestamp in the report. Keep this snapshot in the ignored `.local` directory.

The operator sign-in lives at `/operator`. Configure an existing authorized Clerk sandbox for invite-only accounts and mandatory MFA, set the environment values in `.env.example`, and assign an exact issuer/subject database grant through a trusted local migration administrator. Synthetic campaign workflow is available through the operator portal or the local integration suite. The provider session, recovery and MFA behavior require a live Clerk sandbox session.

## Verify

Run `npm.cmd audit`, `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd test`, and `npm.cmd run build`. Set `PLAYWRIGHT_BROWSERS_PATH` to the local browser install path, then use `npm.cmd run browser` and `node scripts/screens.mjs` with the dev server running. The integration suite uses the dedicated test database. Keep that database free of hand-entered data.

Versions are pinned in `package.json` and `package-lock.json`. The lockfile applies Effect 3.22.1 to the Prisma CLI configuration package for GHSA-7589-6fvf-x4pw. No production service is needed to render the local preview or deliver to the local capture mailbox. Turnstile's official loopback test keys still call Siteverify.

The desktop stage artwork was generated from the supplied image on November 26, 2026. `public/art/stage.webp` is the full scene and `public/art/meduza.webp` is its portrait crop. The MR geometry is a reference-based local reconstruction. Both visual assets and the mark await owner review for production use.


## Local verification on November 26, 2026

- All 15 transferred Phase A document hashes match the approval record.
- Prisma schema validation and generation, initial migration, TypeScript, ESLint, production-mode build and npm audit passed. The audit reported zero vulnerabilities.
- Ten Vitest tests passed using PostgreSQL 17.12 and a synthetic signed Clerk token. They cover concurrent enrollment and verification, an expired job lease, a frozen campaign audience, pause/resume, suppression, local deletion with recovery-ledger export, and idempotent replay over synthetic recovered rows.
- Twelve Chromium checks and eleven WebKit checks passed. The Chromium end-to-end flow used official Cloudflare Turnstile test credentials, the running application, the real loopback database and the encrypted mail capture. It verified explicit confirmation, scanner-safe GET and both unsubscribe routes. Windows Application Control blocked the unsigned Playwright Firefox binary before any Firefox page checks could run.
- The ten browser screenshots are under `artifacts/screenshots`. The 1672 × 941 desktop render was compared with the owner reference. The headline bounds, two-line description, orbit, form iconography and mobile art blending were refined after inspecting actual browser screenshots. Intentional local differences include the five approved capability cards, visible consent, and social links shown only when destinations are configured.
- The app and dispatcher are running locally. A single dispatcher tick is available through `npm.cmd run worker`. Use `npm.cmd run worker -- --watch` for one tick per minute.

A physical-device walkthrough, full backup-and-restore drill, provider throughput and failure handling, actual Clerk sandbox MFA and provider-backed Resend delivery remain unverified. Local synthetic mail is captured in PostgreSQL. Public release, production provider configuration and live campaign sending remain subject to their separate approval gates.


## Isolated restore replay

For a dedicated `prelaunch_restore` database on loopback port 55432, pass `RESTORE_DATABASE_URL`, `DISPATCH_DISABLED=1`, the backup timestamp and an independently verified ledger cutoff to `node --env-file=.env.local scripts/reconcile-local-restore.mjs <backup-utc> <ledger-cutoff-utc>`. The script authenticates ledger files, applies erasure and opt-out events idempotently, pauses active campaigns and holds ambiguous deliveries. Dispatch rejects the restore database. The integration test simulates the recovered rows and replays the ledger twice. An actual dump, restore and handover exercise remains a separate check.

Eligibility count timings for synthetic cohorts of 100, 1,000, 10,000 and 50,000 were about 2, 2, 16 and 86 ms on this workstation. The benchmark used a rolled-back transaction on the test database. These are single-run local query timings.


## Visual refinement and social profiles

The approved desktop target is the supplied 1672 × 941 design with three cards and MR marks on the mascot. The other supplied image and the `artifacts/visual-refinement/before` screenshots show the earlier implementation. The after directory shows the default site and the social-preview directory shows the optional development view.

| Area | Refined implementation |
| --- | --- |
| Header | Existing SVG MR geometry, a lighter blue-white wordmark, a thin divider and subtitle rules. |
| Mascot and stage | Existing WebP artwork with separate perspective-matched vector marks on the headphone and chest, shared between the desktop and mobile crops. The desktop crop protects the mascot at narrower landscape aspect ratios. |
| Headline | A transparent reference-derived render in two WebP sizes (49,898 and 123,066 bytes), layered with an SVG orbit. A semantic H1 remains available to assistive technology and displays as text in forced colors. |
| Cards and signup | Three equal glass cards with larger SVG icons, an integrated capsule CTA and a visible consent checkbox and privacy link. |
| Social section | Circular icons for destinations configured in `.env.local` via `SOCIAL_INSTAGRAM`, `SOCIAL_LINKEDIN`, `SOCIAL_GITHUB`, `SOCIAL_YOUTUBE` and `SOCIAL_TELEGRAM`. Set an actual HTTPS profile on the respective platform. An unset or invalid destination is omitted. On the development server, `/?social-preview=1` displays unconfigured symbols without links. |
| Scroll indicator | The page has no distinct section below the hero for the arrow to target. The privacy and help link below the form is directly reachable. |

The reference supplies finished artwork without an editable brand master, layered mascot scene, 3D lettering model or mobile composition. The local header preserves the existing MR vector and the title is a generated raster reconstruction. Consent and privacy take space below the form, so the social row sits below its reference position.


The final capture set includes 1920 × 1080, 1672 × 941, 1440 × 900, 1366 × 768, 390 × 844 and 360 × 800. At 1672 × 941 the measured headline artwork occupies X 45.6–76.4% and Y 13.6–38.7%. The cards occupy X 42–80% and Y 49.5–60.9%. Chromium had no first-party console errors in the comparison run. The 10 Vitest tests, 27 Chromium and WebKit checks, TypeScript, ESLint and production-mode build passed. One initial WebKit launch exited before page load. The rerun passed. Firefox coverage is unavailable on this host due to the Windows Application Control block recorded above.

Files changed for this refinement

- `src/app/page.tsx` and `src/app/hero.module.css`
- `src/components/meduzellar-art.tsx`, `src/components/hero-social.tsx` and `src/components/waitlist.module.css`
- `public/art/coming-soon.webp` and `public/art/coming-soon-compact.webp`
- `.env.example`, `scripts/screens.mjs`, `tests/browser/public.spec.ts` and this note
