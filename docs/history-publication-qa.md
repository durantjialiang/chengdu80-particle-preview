# History publication validation — 2026-09-06

Scope: publish the project-owner-approved 2019/2024 sample archive photographs to the existing public GitHub/Vercel preview. See `media-authorization.md` for the permission basis and exclusions.

## Automated checks

- `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`: passed; 47 tests, no failures.
- Build audit: 83 static files, 19 archive/content route files, exactly 13 approved photographs / 26 WebP derivatives, no raw research-photo hashes or private/local URLs in the output.
- Review data/SSR/HTTP check: 26 review image responses successful; 2019 has 8 gallery images plus cover, 2024 has 5 plus cover; public/local duplicate IDs are suppressed.
- Independent source-asset check: all 26 derivatives exist and match their recorded byte sizes/dimensions, without upscaling. Combined size 1,861,740 bytes.
- Existing build warning remains: the Globe JavaScript chunk exceeds 500 kB. No new dependencies or renderer changes were made.

## Actual browser checks

Codex in-app Chromium browser, local development URL on port 4182:

- 2024: real cover image loads; viewer opens, next/previous images change, close returns focus to the cover button, reopen works.
- 2019: real cover image loads; viewer opens and the next image can be selected.
- 1440 × 900 desktop, 390 × 844 mobile and 320-pixel narrow layout checked. No horizontal document overflow observed; mobile dialog controls remain visible.
- No error/warning messages returned from the browser console during these checks.
- Fixed two issues exposed by actual browser testing: ignore the stale dialog-close event from React StrictMode cleanup, and constrain the full-image grid track so intrinsic image height cannot overlap viewer controls.

Screenshots are retained in the project-external `exports/history-publication-2026-09-06` directory, not bundled with raw research files.

Not re-tested in this publication pass: physical phones, OS-level reduced-motion switching, Escape/arrow keyboard operation, whole-site WebGL performance/FPS, screen readers. Existing automated particle/static-mode contracts pass; this is not a claim of fresh manual coverage for those features.

GitHub commit and Vercel deployment completion are reported after the push, separately from these local checks. The old SWUFE website and its production domain are not modified.
