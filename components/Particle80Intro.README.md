# SWUFE + FIC → CHENGDU 80: innovation field

The Particle80 concept is now a physical field, not a path-following dotted logo.
The independent preview retains its entry and now uses a reversible native-scroll story.
The public Hero, Globe, navigation, package dependencies and Sites deployment are
unchanged.

## Use

```tsx
import Particle80Intro from '@/components/Particle80Intro';

<Particle80Intro
  particleCount={9600}
  mouseForce={5.5}
  springStrength={13}
  damping={4.8}
  noiseStrength={0.16}
  glowIntensity={0.55}
  formationDuration={2.2}
/>

// The network is below the story, never a replacement layer.
<Particle80Intro />
<GlobalUniversityNetwork />
```

## First-visit story

| Active time at speed 1 | Story |
| --- | --- |
| 0–0.3 s | Spatial field and crisp SWUFE / FIC identity |
| 0.3–2.5 s | Existing source convergence and volumetric formation |
| 2.5–3.2 s | Existing settling and pointer activation |
| After 3.2 s | Permanent interactive 80; only native scrolling changes the layout |

No essential button is gated by this sequence. Text only changes opacity; it is
never moved by the simulation. Source locations adapt to the desktop side labels
and the mobile upper labels. The camera stays fixed.

Repeat visits default to 1.4 seconds; use `repeatVisit="always"` to replay the
cinematic duration, or `"skip"` for an already-formed field.
The optional localStorage key is `chengdu80:innovation-field:seen:v2`, deliberately
versioned so visitors to the previous concept see this new narrative once.

## Real dynamics, not interpolated positions

Each particle has typed-buffer position, velocity, targetPosition, size, opacity,
depth and noiseSeed. Source membership is immutable. Roles are 50% structure,
25% flow, 18% ambient and 7% highlights (rounded to whole particles). The ambient role includes
12% near-field dust and 6% distant dust. Both institutions contribute to every loop.

The final structure is a set of filled annular tubes with uneven thickness and
depth. The formation choreography crossfades into a local flow field at progress
0.78–0.94 without changing the story duration. The normal force restores tube
membership; tangential propulsion supplies circulation. There is no tangential
position spring in the living phase. A disturbed particle keeps its new phase
and rejoins the orbit wherever it lands, with damping and real inertia.

Base loop rates: upper 8 +0.34 rad/s, lower 8 −0.30 rad/s, 0 +0.255 rad/s.
Each has 0.4×/1×/1.6× bands plus ±12% independent variation. Structure multiplies
speed by 0.2, highlights by 0.8, flow by 1.0. About 1–2% overall form a slower
reverse current in the 8. Local modulation is milder in the 0. Every role has
depth drift, including distant dust. No digit/group rotation or camera movement.

`FIELD_PALETTE` is a cached 32-colour ramp sampled by location, loop angle, depth
and slow flow phase: cooler upper 8, slightly warmer lower 8, neutral/cool 0.
Champagne membership is capped at ~2%, selected from a spatial zone, and fades
toward neutral outside that zone. Colours are not independently random per ID.
`sizeClass` uses 55/25/12/6/2% tiers with diameters 0.7–1.4 / 1.4–2.3 /
2.3–3.5 / 3.5–5 / 5–8 CSS px before depth/scale. Fine dust has a 0.7px screen
diameter floor for mobile rasterisation, without enlarging stars. Optical types:
sharp dust with a tiny low-energy fringe, compact soft stars, and rare radial-falloff sparks.
Most luminance is low; rare large emitters carry the highlights. B alpha gain is
1.72 for structure / 1.92 for flows / 1.00 for ambient, capped at 1.60 for larger
stars and 1.30 for champagne. A remains 1.18 / 1.24 / 1.00 for review only.
Continuous point-spread sprites replace filled disks; particle radii and physics
are unchanged. No global exposure, background lift or full-screen bloom.

The top 0.5% of existing stars (48 desktop / 5 low-power) are intense emitters,
with a bright core and a local soft aura. Independent slow 10–12 second glints
avoid synchronized flashing. Reduced motion retains steady light without pulses.
The Intro retains its approved viewScale 1.72.
Narrow Canvas views cap effective magnification at 1.38 to avoid cropping the digits.
Point size and world-space motion remain independent of display magnification.

Attractor positions follow the narrative, but actual particles never lerp to them:

```text
formation: spring × (choreographed target − position)
living: normal tube-restoring spring + tangent propulsion + curvature correction
both: soft pointer force + seeded curl noise + depth drift
velocity = (velocity + acceleration × dt) × exp(−damping × dt)
position += velocity × dt
```

Semi-implicit substeps are at most 1/120 second, with a maximum 75 ms simulation
budget per paint and a vector speed limit. The default system is underdamped:
small overshoot is real inertia. Noise is continuous and independently seeded,
not new randomness each frame. The pointer uses a smooth radius falloff in the
same projected coordinates as rendering, with no artificial depth kick.
Pointer multipliers are structure .3, flow 1, ambient 1.4, highlight 1.15;
spring multipliers are 1.25, 1, .55, .72. Highlight drag is lower for longer inertia.
The silhouette resists displacement while outer dust
responds first. Global pointer/noise/spring/damping props still apply to all roles.

Only initialization or static accessibility mode sets position directly to targets.
Changing controlled `formationProgress` changes attractors, not positions.
While paused, the new targets wait for simulation to resume; there is deliberately
no teleporting during a paused scrub. Appearance/dissolve can repaint while paused.

## Configuration

| Prop | Default | Range / purpose |
| --- | --- | --- |
| particleCount | 9600 | 180–9600 desktop; capped at 900 low power |
| mouseForce | 5.5 | 0–12; low power applies 60% strength |
| springStrength | 13 | 3–40; target attraction |
| damping | 4.8 | 1.5–14; velocity dissipation |
| noiseStrength | .16 | 0–.6; continuous procedural force |
| glowIntensity | .55 on Intro | 0–1; soft additive halos, no post-processing |
| formationDuration | Intro 2.2; bare Particle80 7.2 | Active formation seconds; not an exit timer |

Existing `pointerForce`, `glow`, and `introDuration` are retained as aliases.
`pointerForce` wins over `mouseForce`; `glowIntensity` wins over `glow`;
`formationDuration` wins over `introDuration`.
`ambientParticleRatio` is deprecated: roles use the fixed 50/25/18/7 split.

`debug`: `off` (default), `roles`, `vectors`, `flow`, or `telemetry`.
Only development builds use it. In the preview, use `?fieldDebug=roles` etc.
The overlay shows role membership, velocity/flow arrows and pointer radius.
`window.__particle80Debug.snapshot()` copies arrays only on an explicit developer
request. No debug UI, snapshot API, frame-cost buffer or query selection is shipped
in the production bundle; the build is checked for these diagnostic markers.

Existing `enabled`, `active`, `speed`, `formationProgress`, `dissolveProgress`,
`intensity`, `interactive`, `twinkle`, `trails`, `trailLength`, `quality`,
`lowPowerMode`, `motion`, and `reducedMotionMode` remain available.
Bare Particle80 requires `interactive`; Particle80Intro enables it by default.

## State and scroll integration

`useParticleIntro()` exposes `phase` (`space | sources | merging | forming | living`),
`introStarted`, `formationProgress`, `settled`, `interactionEnabled`, and the stable
`onStateChange` callback. Progress is reported at 4% increments plus phase edges,
not through React state on every frame. `settled` means the formation story
completed, not that procedural motion or every physical velocity has stopped.

Particle80Intro keeps the renderer mounted across native down/up scrolling.
Its CTA is a normal introduction anchor; one GlobalUniversityNetwork follows it.
`handoffContent` is supported only as fallback content when `enabled={false}`.
It no longer starts an exit, and `autoTransitionEnabled` is ignored/forced false
by this published intro. See [BRAND_OPENING.md](../BRAND_OPENING.md) for the
scroll bridge, actual mixed forces, side-cloud parameters and acceptance tests.

## Accessibility and performance

- Single Canvas 2D with a cached 2048×192 emitter atlas and 1536×144 local-aura
  atlas, additive blending. Both caches release backing memory on cleanup.
- A quarter of flows plus a third of highlights have short velocity-derived trails.
- Fixed typed buffers and reused output objects; no mesh per particle, per-frame
  particle arrays, external textures, video, audio, or heavy bloom dependencies.
- Desktop draw budget: 60 fps / DPR ≤1.5. Mobile/low-power: 30 fps / 900 particles /
  DPR ≤1. These are target caps, not measured real-device FPS claims.
- Fine-pointer interaction only; normal touch scrolling is retained.
- Hidden/offscreen/paused scenes suspend RAF and do not catch up hidden time.
- Reduced motion shows a complete static field and crisp labels. Turning it off
  does not restart the cinematic formation.
- Unavailable/lost Canvas reveals a complete deterministic inline SVG; phase
  callbacks resolve to completed, so content cannot get stuck behind the intro.

## Files and checks

- `lib/particle80-field.ts`: source choreography, volumetric distribution, physical
  state/integration, role/color/size budgets, circulation lanes, perspective and timeline.
- `components/Particle80.tsx`: lifecycle, field rendering, pointer input and fallback.
- `lib/particle80-debug.ts`: development-only role/vector/flow diagnostics.
- `components/Particle80Intro.tsx` / `.module.css`: stable institution typography,
  first/repeat visit story, responsive field and reversible scroll layout.
- `qa/particle80-intro.tsx`: existing isolated study, now exposes phase status.
- `qa/particle80-field.test.mjs`: distribution, staged targets, true inertia,
  overshoot, recovery, frame-rate stability, extreme inputs, static contracts.
- `qa/particle80.ssr.test.mjs`: deterministic SSR and accessibility/configuration.
- `qa/particle80-intro.browser.mjs`: updated optional browser QA for the new field;
  run only when browser testing is requested. Prior-version screenshots are not
  evidence for this redesign.
- `qa/particle80-living.browser.mjs`: per-particle XY/depth motion, role speeds,
  loop directions, three viewports, static accessibility and actual CPU draw costs.

```sh
node --test qa/particle80-field.test.mjs
node --test qa/particle80.ssr.test.mjs
npm run lint
npx tsc --noEmit
npm run build
npm run build:particle-preview
```

Preview: http://127.0.0.1:4174/qa/particle80.html

The existing Vercel configuration publishes only the isolated review build.
GitHub/Vercel is connected at `durantjialiang/chengdu80-particle-preview`.
Public review: https://chengdu80-particle-preview.vercel.app/ . A local build alone
does not update it; the validated standalone source must be pushed and deployed.
