# Chengdu 80 brand opening

This release refines the existing intro; it does not replace the particle engine.

## Sequence and integration

`INTRO_IDLE → FORMING_80 → HOLDING_80 → DISSOLVING_80 → HANDOFF_TO_GLOBE → GLOBE_ACTIVE`

One visibility-aware timeline owns formation, hold, dissolve, globe reveal and activation. Runners depart first, ambient particles take atmospheric endpoints, selected highlights converge on university nodes, and anchors preserve the 80 until the late handoff. Endpoints come from the existing globe's university registry, geographic routes, world transform and actual camera projection. The Canvas renderer reads 320 preallocated projected endpoints; the original springs, inertia, orbit velocities, palette and light-point optics are unchanged.

Interaction ownership: the held 80 owns pointer input; during transition its input decays over 0.65 seconds and the globe stays locked; only the active globe owns camera parallax. No OrbitControls, scroll hijacking, video background or new runtime dependency was added.

## Configuration (seconds)

| Setting | Desktop first visit | Mobile | Reduced motion |
| --- | --- | --- | --- |
| leadInDuration | 0.3 | 0.15 | 0 |
| formationDuration | 2.2 | 1.5 | 0 |
| settleDuration | 0.7 | 0.4 | 0 |
| holdDuration | 2.2 | 1.6 | 1.2 |
| dissolveDuration | 2.8 | 1.6 | 0.22 |
| globeRevealDuration | 2.6 | 1.5 | 0.22 |
| transitionDuration | 3.4 | 2.0 | 0.22 |

`autoTransitionEnabled` defaults to true. False keeps the 80 interactive until Explore Chengdu 80 is clicked. Return visits use a 0.1 + 1.0 + 0.3-second shortened opening. Replay always shows the first-visit sequence. Changing settings does not rebuild the engine. Values are bounded; non-finite values use defaults.

Globe reveal overlaps dissolve, with a 0.34-second desktop / 0.2-second mobile lead-in. The whole desktop transition is approximately 3.74 seconds. Geometry readiness gates the exit; unsupported WebGL uses the existing static SVG network instead of a blank destination. A single 8-second renderer-boot watchdog handles a context that never becomes ready; animation phases do not use timeouts.

The bridge exposes formationProgress, holdProgress, dissolveProgress, globeRevealProgress, transitionProgress, activationProgress and interactionOwner. `onOpeningProgress` reports quantized progress; renderers read the stable ref each frame. `onHandoffComplete` fires once. Automatic progression does not steal focus; a manual CTA transfers focus without scrolling.

## Composition

- Desktop 80 display scale: 1.534 → 1.72 (+12.1%), without scaling point sizes.
- Mobile cap: 1.38, preserving both digits and a first-screen CTA.
- SWUFE/FIC: restrained 500 weight, matching sizes and baselines, no glow.
- Visible institutional subtitles restored only in this intro.
- Header, CTA destination and existing preview controls preserved.

## Performance and accessibility

Desktop remains 9,600 particles (60fps particle scheduling); mobile remains 900 (30fps scheduling). DPR caps remain 1.5 / 1.0. These are scheduling targets, not guaranteed device FPS. The existing globe is dynamically imported and prewarms with demand frames, then renders only during handoff / active viewing. When hidden, neither animation advances its story clock. Manual hold does not run the choreography clock indefinitely. Reduced motion shows a complete static 80, uses a short 0.22-second reveal, then switches the globe to demand rendering. During that short reveal only, R3F paints progress frames. Static SVG fallbacks remain available.

The existing R3F/Three lazy chunk remains large (~909KB uncompressed); Vite's chunk-size warning is informational, not a failed build. No new post-processing or duplicate rendering library was introduced.

## Modified modules

- `lib/brand-opening.ts`, `hooks/use-brand-opening.ts`: explicit timeline, finite progress and visibility-safe orchestration.
- `lib/particle80-handoff.ts`, `components/Particle80.tsx`: render-only role departure and projected curved trajectories; no simulation rewrite.
- `components/Particle80Intro.tsx`, `.module.css`: composition, institutional type, lifecycle and CTA continuity.
- `components/Hero/OpeningTargets.tsx`, `scene-config.ts`, `Scene.tsx`, `CameraController.tsx`: real globe endpoint bridge, prewarm/fallback and exclusive input ownership.
- `components/Hero/Globe.tsx`, `Atmosphere.tsx`, `CityNodes.tsx`, `DataStreams.tsx`: progressive material reveal and a restrained Chengdu activation.
- `qa/particle80-intro.tsx`, `.css`, `OpeningReviewCursor.tsx`: existing preview integration and a development-only real-pointer recording marker.
- `qa/brand-opening.test.mjs`, `qa/particle80.ssr.test.mjs`, `package.json`: timeline/bridge tests, updated SSR contracts; no dependency additions.

## Verification and review

Run `npm ci`, then `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
The review was performed in the macOS Codex in-app Chromium browser at 1440×900, 390×844 and 320×740. Screenshots and an actual timestamp-preserving browser capture are delivered separately. The capture is sampled at approximately 8–10fps and encoded at 30fps; it is not a native 60fps OS recording and must not be used as a performance benchmark. Pointer rings in that capture mark real drag/move events and are excluded from production.

Development URLs support `?visit=first`, `?autoTransition=0`, `?motion=reduced`, and `?record=1`. These URL overrides and the cursor marker are removed from the production bundle. Existing below-fold preview switches remain available in the preview site. The older standalone browser scripts are not the new acceptance harness; this release was verified through the real app browser, alongside Node/SSR tests.

Untested: physical iOS/Android hardware, Safari/Firefox, deliberate GPU context loss, and slow-network device matrices. Responsive viewport checks are not claimed as physical-phone testing. Existing university data is reused without adding names, awards or statistics. The final “global university innovation network” sentence is descriptive brand copy, not a newly verified partnership claim.

## Static deployment / local preview

Build output: `out/particle-preview/`. Vercel uses the existing `vercel.json` and GitHub main branch. To preview a supplied build locally, run `python3 -m http.server 4176 --directory out/particle-preview`, then open `http://127.0.0.1:4176/`. No server-side runtime or environment secrets are required. The build includes JS, CSS and the globe fallback SVG.
