# Chengdu 80: reversible particle scroll story

This release replaces the timed Particle80-to-globe handoff. It retains the existing Canvas 2D particle engine, optics, particle budgets, 8/0 circulation and pointer physics.

## Published page contract

`Particle80 hero → EventIntroduction → one GlobalUniversityNetwork`

- First visit: 0.3s lead-in + 2.2s formation + 0.7s settling on desktop; mobile: 0.15 + 1.5 + 0.4s.
- Then HOLDING_80 indefinitely. At 5, 30, 60 and 120 seconds it does not dissolve or reveal a globe.
- Return visits shorten formation to 0.1 + 1.0 + 0.3s. The visit record never skips the hero.
- Explore Chengdu 80 is a native `#event-introduction` anchor. The introduction and network exist in the DOM immediately; neither waits for animation or renderer readiness.
- Scrolling early or restoring a scrolled position completes formation and follows the current scroll location. Returning upward does not replay formation or reverse simulation time.
- `autoTransitionEnabled` defaults to false in the configuration, is forced false by Particle80Intro and useBrandOpening, and is explicitly false at the preview entry.
- Legacy hold/dissolve/reveal props and isolated handoff types remain source-compatible, but do not drive this published story. `sampleOpening` and the old render adapter retain isolated legacy tests for other consumers; the story renderer explicitly bypasses the adapter. No requestHandoff, readiness gate, replacement layer or terminal unmount remains in this page.

## Two independent controls

`useBrandOpening` now owns only formation and settling. Its choreography RAF stops once formed. The existing physical clock continues circulation, inertia, pointer response and light breathing.

`useParticleStoryScroll` derives layout from the story section's current bounding rectangle. A passive scroll listener coalesces updates into one RAF; resize, pageshow and viewport changes remeasure the actual hero, composition and content. No per-frame React scroll state, wheel interception, body lock, snap or queued scroll animation is added.

`PersistentParticleBackdrop` portals one fixed, viewport-sized surface directly into `body`, outside Intro transforms/clipping. Intro owns identity, choreography and measurements; the backdrop owns the renderer. Normal document content has z-index 1 above the pointer-transparent background at 0. No negative z-index, oversized canvas, sticky runway or wheel interception. The same background remains behind introduction, network, controls and footer.

A fresh URL containing an explicit introduction/network fragment is honored once after React mounts, only when the browser has not already restored a scroll offset. Reload/back navigation and later preference changes are never forced to that fragment.

## Layout parameters

| Parameter | Current value | Purpose |
| --- | --- | --- |
| spreadViewport | 0.78 | Main redistribution distance, as a fraction of viewport height |
| identityExitProgress | 0.5 | SWUFE/FIC and subtitles have faded at halfway spread |
| reading region | actual visible left/right | Dominant visible marked content; supports wide/asymmetric layouts |
| contentPadding | 42 CSS px desktop / 14 mobile | Additional side-cloud clearance outside the reading column |
| edgePadding | 22 CSS px desktop / 6 mobile | Outer viewport clearance |
| sideBrightness | 0.58 desktop / 0.20 mobile | Side-layout alpha only; no first-screen optical changes |
| canvas footprint | viewport | Original composition still controls top 80 scale/center; side targets span viewport height |
| introduction padding | responsive 100–160 / 110–180 px; mobile 90 / 100 | Real content spacing, not scroll runway |

Adjust layout in `lib/particle-story.ts`, `lib/particle80-story-field.ts` and `lib/particle80-projection.ts`. Progress is absolute, bounded and stays at 1 below the Hero. Hero/Intro visibility is geometry-only telemetry, not a render/pointer gate. Reduced motion draws a complete static 80 at top and a static side field below; it never fades the entire background out.

## Real reversible constraints

Two new typed arrays, `sideSeed` and `sideTarget`, are allocated once per field. A separate deterministic seed generator leaves the original random sequence, particle IDs, roles, sizes and optical membership untouched.

The upper/lower 8 populations go mainly left and the 0 goes right; ambient particles use their immutable source side. The new distribution is a seeded volumetric cloud with curved, tapered density and slow analytical drift, not the translated digits or two replacement images. Each frame evaluates drift from the same seeds; it never generates a new random cloud.

At the integrator, for each axis:

```text
layoutForce = originalDigitForce × (1 − spreadMix)
            + sideRestoringForce × spreadMix

totalForce  = layoutForce + existingPointer + existingNoise
velocity    = existing damped semi-implicit integration
position   += velocity × dt
```

The original orbit-normal restoring force and tangential circulation remain exact at zero spread. At full spread, restoration is to moving side-cloud constraints, not the old digits. Pointer force, procedural noise and drag are each applied once; they are not duplicated by the blend. The original 120Hz substeps and velocity limit remain.

Side targets are placed in CSS-pixel-derived projected lanes, then perspective is undone into physical world coordinates. Foreground depth cannot push their projected targets into the reading column. Canvas bounds are reread for live pointer coordinates, including stationary-pointer scroll/resize. A soft central luminance guard protects actual content width, and the old label mask fades with the identity rather than leaving invisible holes.

Window receives passive pointer events; the canvas is not a click shield. Client coordinates use the current fixed canvas rect, world scale and interpolated projection origin, never scrollY. Every draw rechecks the current element under a stationary pointer once, protecting links, controls, dialogs, reading regions, Globe and selection. Only leaving the viewport/window clears presence; leaving Intro does not.

## Lifecycle and accessibility

- Same mounted particle instance throughout down/up scrolling; never removed because a globe state was reached.
- Simulation pauses for document hidden, explicit pause, reduced motion, disabled background or lost context, never because Hero/Intro is offscreen. On return the capped clock prevents catch-up jumps.
- The network retains its own lazy Globe visibility/modal pause. Offscreen Globe is not kept rendering just because the particle background persists.
- Desktop: unchanged 9,600 particles, DPR cap 1.5; mobile: unchanged 900, DPR cap 1.0. These are budgets, not measured FPS claims.
- Reduced motion: static layout follows native scroll without circulation or animated convergence. All text, anchors, cards and the network remain normal DOM.
- Existing SVG fallbacks remain. No dependency, physics engine, video, audio, school record, award, statistic, domain or globe implementation was changed.

## Files

- `lib/brand-opening.ts`, `hooks/use-brand-opening.ts`: formation-only published lifecycle.
- `lib/particle-story.ts`, `hooks/use-particle-story-scroll.ts`: native reversible scroll bridge and layout measurement.
- `lib/particle80-story-field.ts`, `lib/particle80-field.ts`: seeded side-cloud constraints and weighted real forces.
- `components/Particle80.tsx`, `lib/particle80-debug.ts`: retained rendering, viewport pointer conversion, current reading-region protection and page lifecycle.
- `components/Particle80Intro.tsx`, `.module.css`: original identity, measurements, normal-flow introduction and native anchors.
- `components/PersistentParticleBackdrop.tsx`, `.module.css`: single body portal and lighter ambient-only reuse for static content documents. Cross-document navigation creates a new instance; this is not an SPA.
- `qa/particle80-intro.tsx`, `.css`, `particle80.html`: remove the duplicate GlobeDestination and stale styling, keep one network, update page description.
- `qa/particle-story.test.mjs`, `qa/brand-opening.test.mjs`, `qa/particle80.ssr.test.mjs`, `qa/university-network.test.mjs`, `package.json`: reversible physics, indefinite hold, SSR content and isolated test caches. The lockfile/dependencies are unchanged.
- This document and `components/Particle80Intro.README.md`: replace obsolete timed-handoff instructions.

## Validation and local review

Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

The automated suite includes 43 tests: 60/120-second hold sampling, page runtime independent of offscreen Intro, exact original projection preservation, fixed-rect pointer conversion, asymmetric full-height lanes, reversible absolute scroll, zero-spread force identity, stable side seeds, reading projection at 1440/390/320 widths, pointer/recovery at 0/25/50/100%, fast reversal, retained physical tests, SSR and content contracts.

Current browser evidence and recording metadata are in `docs/persistent-backdrop-review.md` and the separately exported review folder. Previous release recordings are historical evidence, not acceptance for this page-wide release. A sampled browser recording is not a native FPS benchmark. The pointer ring marks real input and is development-only.

Local development: `npm run dev`. Review queries: `?visit=first&fieldDebug=telemetry&record=1`, `?motion=reduced&renderer=svg`. These overrides/diagnostics are eliminated from the public bundle. The existing below-fold preview switches remain.

Tests use separate Vite cache directories so running tests does not invalidate the live preview's optimized imports. If an old dev session predates this change and has a blank root, restart its Vite process with `--force`; this was a dev-cache issue, not a production-build failure.

## Deployment

Same public destination: https://chengdu80-particle-preview.vercel.app/

Same repository: https://github.com/durantjialiang/chengdu80-particle-preview

Static output: `out/particle-preview/`. The existing Vercel configuration deploys GitHub main. The standalone network route remains `/global-network/`.

To view a supplied build without Vite: `python3 -m http.server 4176 --directory out/particle-preview`, then open http://127.0.0.1:4176/. No server runtime, tokens or environment files are needed.
