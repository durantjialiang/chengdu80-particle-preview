# Site completion QA — internal

Baseline: clean `6dc516c`, Node v25.9.0 / npm 11.12.1, macOS 27.0.
Dev server: Vite on `http://127.0.0.1:4175/`.

Batch 1 checks executed 2026-09-06:

- Engineering: `npm run lint`, `npm run typecheck`, `npm test` (35/35), `npm run build` passed. Existing large Globe chunk warning remains.
- Browser: Codex in-app browser, CSS viewports 1440×900 and 390×844; Competition renders in English/Chinese. FAQ `#dates` opens. Native menu opens, Escape closes, focus returns to the trigger.
- Screenshots: `exports/site-completion-2026-09-06/batch1-competition-{desktop,mobile}.jpg` outside the repo. Full final route/404 matrix remains Batch 4.
- Regression: no physics/shader edits intended; test and diff verification pending.
- Publication: explicitly authorized by the user's subsequent 2026-09-06 message; release verification in progress.

## Batch 2 release checks (2026-09-06)
- Lint/typecheck/build pass; `npm test` now 39/39 including new content/route/SSR contracts.
- Built preview on port 4176: year 2020 + NUS gives one Pisces result, nonsense search gives zero; keyboard select-all/delete and Clear filters restore results. Chinese switch preserves filters. Reload, back and forward preserve year/school selection. Pisces detail loads and Copy link reports success after the real Clipboard API resolves.
- Browser console errors in that flow: none. Clipboard-denied branch is source-reviewed, not yet browser-tested.
- Particle renderer/physics/scroll math, globe/geometry, global CSS and dependency lockfile are byte-unchanged from 6dc516c (git diff inspection).
- About/Partners disabled labels prevent broken navigation; their actual pages are still queued.
- Final publication/recording evidence is exported outside the repository under `exports/site-release-2026-09-06`.
