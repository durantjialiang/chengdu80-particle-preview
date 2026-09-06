# Historical content and photographs: review workflow

This phase extends the existing Vite/React archive, not the Particle80 or Globe renderer. Do not publish pending historical images simply because their source URLs are accessible.

## Routes and data

- `/history/2019/`: annual-detail-first challenge and university records; final/closing date from the separate official review; 8 captioned university team photographs approved by the project owner for publication.
- `/history/2024/`: official seventh-edition SWUFE News report; 30 October final/awards separated from 31 October publication; 5 event photographs approved by the project owner for publication.
- `/winners/dragon-search/` and `/winners/data-queens-report/`: stable project routes, with independent source links. No annual photograph is assigned to either project without explicit association evidence.
- `content/history-evidence.ts`: source dates and official award group records.
- `content/archive.ts`: editions, projects and stable album/photo references.
- `content/universities.ts`: shared university records for the Hero Globe, directory, annual pages and cards. Adds Toronto/Berkeley 2019, UNSW 2020, emlyon 2022 and the 2024 award recipients from their evidence.
- `content/university-i18n.ts`: Chinese names, places, roles and record notes. Detailed audit notes are expandable; missing projects/awards and the unconfirmed 2026 roster remain visibly qualified.

Historical routes, project IDs and existing filter keys remain. Data Queens retains the legacy `first-place` filter key and links the canonical award via `editionAwardId: 2024-kaichuangzhe`. It is a team name; `projectName` stays null.

## Image model and permission gate

`content/archive-media.ts` defines source page, original image URL, edition year, bilingual caption, optional verified university/project IDs, image type, photographer, credit, usage status, authorization evidence, local/full and thumbnail paths, and dimensions.

The project owner approved the **13 photographs integrated into the 2019/2024 samples** for publication on 2026-09-06. Their records are in `content/archive-media-approved.json`; the confirmation scope and limits are documented in [media-authorization.md](media-authorization.md). This records project-owner confirmation, not an independently obtained publisher licence. The remaining 28 candidate records stay unpublished. Do not copy the private manifest or research originals into this repository.

For eventual publication, each image must have:

1. `usageStatus: approved` and no `privateReview` flag;
2. written/equivalent authorization evidence identifying the image and both the new website and public preview scope;
3. `permission.newWebsite` and `permission.publicPreview` set to true, with a real `evidenceRef`;
4. matching optimized files under `/history-media/`, valid dimensions, source links and required credit.

The build rejects unlisted files/symlinks in `public/history-media`. The local-review virtual module is disabled on every build, including `--mode history-review`. This guard covers the new historical-media folder; it is not a retrospective clearance of pre-existing university logos or other site assets.

## Private local review

Keep the permission-pending source files and `review-media.json` in a separate directory **outside this checkout**. Manifest paths must resolve to existing WebP files inside that private directory. The review server serves only manifest-listed files, binds to `127.0.0.1`, and responds with `private, no-store`, `noindex, nofollow`, and same-origin resource headers. Do not put it behind a tunnel, LAN reverse proxy or public host.

```sh
CHENGDU80_HISTORY_REVIEW_DIR='/absolute/path/to/private/research' \
  npm exec vite -- --config qa/particle80.vite.config.ts \
  --mode history-review --host 127.0.0.1 --port 4182 --strictPort
```

Open `/history/2019/?lang=zh` or `/history/2024/?lang=zh` on that server. Publicly approved records take precedence by stable ID, so the same photograph is not rendered twice. Future pending review-only records retain the visible local-review label. A normal `npm run dev` / public build displays only the approved photographs, or a permission-pending status when none are approved.

The gallery provides a real cover, lazy thumbnails, native-dialog viewer, previous/next and arrow keys, Escape/focus restoration, source links and an unavailable-image state. Product interfaces and team/group photographs use `contain`; event recap thumbnails can use `cover`. Full viewer images always use `contain`. This sample has no verified product screenshot, so none is invented to demonstrate that category.

## Validation and production

```sh
npm run typecheck
npm run lint
npm test
npm run build
node scripts/check-history-review.mjs '/absolute/path/to/private/research' http://127.0.0.1:4182
node scripts/check-history-build.mjs '/absolute/path/to/private/research'
```

The review check covers record/ID integrity, actual HTTP delivery and React server-rendered markup; the build check scans the static artifact against the publication allowlist. Neither verifies browser layout, modal operation, WebGL, pointer interaction or FPS. Browser tests and screenshots must be reported separately.

The existing static build remains `out/particle-preview`; do not change frameworks to package this work. Following the project owner's explicit upload confirmation, publish the approved derivatives and source to the existing GitHub/Vercel preview project. The old SWUFE official site is not modified, and the full research package is not published.
