# Site completion QA — internal

Baseline: clean `6dc516c`, Node v25.9.0 / npm 11.12.1, macOS 27.0.
Dev server: Vite on `http://127.0.0.1:4175/`.

Batch 1 checks executed 2026-09-06:

- Engineering: `npm run lint`, `npm run typecheck`, `npm test` (35/35), `npm run build` passed. Existing large Globe chunk warning remains.
- Browser: Codex in-app browser, CSS viewports 1440×900 and 390×844; Competition renders in English/Chinese. FAQ `#dates` opens. Native menu opens, Escape closes, focus returns to the trigger.
- Screenshots: `exports/site-completion-2026-09-06/batch1-competition-{desktop,mobile}.jpg` outside the repo. Full final route/404 matrix remains Batch 4.
- Regression: no physics/shader edits intended; test and diff verification pending.
- Publication: not performed; public preview remains baseline.
