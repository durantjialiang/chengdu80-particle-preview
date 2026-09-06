# Global University Network

Reusable ecosystem explorer in the existing Chengdu 80 Vite/React/Three preview.
The Particle80 engine, optics and spring parameters are unchanged by this module.
No new dependency or backend is required. This does not replace the parent website.

## Entry points

- Homepage: after the existing SWUFE/FIC brand opening, `#global-network`.
- Development: `http://127.0.0.1:4175/qa/global-network.html` when running the command below.
- Static deployment: `/global-network/`.

```sh
npm ci
npm exec vite -- --config qa/particle80.vite.config.ts --host 127.0.0.1 --port 4175
# Validation and portable static output:
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

`npm run build` emits `out/particle-preview/`. Serve that directory over HTTP;
do not open the HTML via file://. Scripts and original logo files are bundled locally.
The Vercel configuration and existing framework are preserved.

## Architecture and design purpose

- `content/universities.ts`: the single typed 17-school registry, official websites,
  approximate campus coordinates, years, awards, projects, source URLs and record caveats.
- `content/network.ts`: compatibility adapter from university records to Hero nodes.
  Hero, explorer, cards and static SVG share exactly these records and coordinates.
- `components/network/GlobalUniversityNetwork.tsx`: integrated globe/card workspace;
  lazy renderer, offscreen/tab/modal pause, reduced motion and load-error fallback.
- `UniversityCard.tsx`, `UniversityDetailPanel.tsx`, `Network.module.css`: real local
  logos, historical records, focusable cards and a native modal with official-source links.
- `hooks/use-university-network.ts`: single selection owner. Hover/focus turns the globe
  toward a campus without scrolling; node selection scrolls the matching card. The globe
  holds its last inspected orientation when crossing from card to map so labels do not flee
  the pointer. The dialog contains keyboard focus and restores it on Escape/close.
- `components/Hero/{Scene,CameraController,CityNodes,DataStreams,StaticNetwork}.tsx`:
  reuse the existing globe, north-up campus targeting, geographic nodes and inward data
  packets. Highlighted routes brighten; unrelated nodes/routes dim. No free-spin controls.
- `lib/network-labels.ts`: screen-space collision avoidance moves labels only, not pins.
- `OpeningTargets.tsx`: accommodates all 17 shared nodes in the existing opening bridge.
- `qa/global-network.*`, Vite config and finalizer: independent explorer route.
- `qa/university-network.test.mjs`: data, source, asset, geometry, packing and SSR contracts.
- `public/university-logos/`: original institutional assets; provenance is documented
  separately. University trademarks are not claimed as open-licensed artwork.

## All 17 requested institutions

SWUFE; Tsinghua; Peking; Shanghai Jiao Tong; UESTC; SUSTech; Chongqing;
HKU; NUS; UC Berkeley; Georgia Tech; Toronto; Queen's; ETH Zurich;
University of Zurich; Tel Aviv; emlyon.

Mobile retains all 17 explorer records and nodes; it reduces renderer DPR, land detail,
route segments and decorative dust instead. The introductory Hero can show a reduced
subset on low-power devices using the same adapter. This is not a second data registry.

## Evidence boundaries

Checked against official university and organizer sources on 2026-09-06. Every displayed
participation year and achievement is linked to an official source in the detail panel.
The directory is a selected historical record, not a confirmed 2026 roster or full archive.

- 16 institutions have historical competition evidence. emlyon is included as requested,
  but its verified record is a 2021 SWUFE ecosystem exchange, not confirmed Chengdu 80
  participation. Its relationship is `ecosystem`, with a dashed route and no invented years.
- Toronto appears in the official historical roster, but that record does not state years;
  `participationYears` is empty and the UI says “Year not specified”.
- Queen's DataQueens first-place report was published in 2024. Because the body does not
  unambiguously date the edition, the achievement has `year: null, reportedYear: 2024`.
  Verified 2022/2023 participation is kept separate from that publication date.
- `winner` means a documented award recipient, not necessarily first place. The UI uses
  “Award recipient” and displays the actual award. Chinese awards retain source wording
  where official English translations disagree; they are not promoted to champion status.
- Pins identify approximate representative/current campuses, not historical team travel
  locations or survey-precision coordinates. emlyon's pin is its current Lyon campus.
- Empty project/award arrays mean no individual record verified here, not no achievements.
- All 17 logos are real institutional assets. Organizer approval for public brand use remains
  necessary; hosting an image on an official website does not grant a trademark license.

## Accessibility and QA controls

The actual OS `prefers-reduced-motion` preference is read by `useScenePreferences`.
Reduced mode uses a demand-rendered static globe, full cards and keyboard selection.
Page visibility and intersection observers suspend the active renderer. A paused,
below-fold renderer cannot trigger the WebGL boot timeout.

Local development only (no production tuning panel):

- `?motion=reduced`: exercise the same reduced-motion component path.
- `?renderer=svg&motion=reduced`: exercise the interactive SVG fallback without WebGL.

These query overrides are compiled out of the production route. Browser viewport tests
are not physical-device performance measurements. See the exported review report for
actual screenshots, interaction capture, checks and untested environments.
