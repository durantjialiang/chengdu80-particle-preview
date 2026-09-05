# SWUFE + FIC → CHENGDU 80: innovation field

The Particle80 concept is now a physical field, not a path-following dotted logo.
The independent preview retains its existing entry and optional globe handoff.
The public Hero, Globe, navigation, package dependencies and Sites deployment are
unchanged.

## Use

```tsx
import Particle80Intro from '@/components/Particle80Intro';

<Particle80Intro
  particleCount={1400}
  mouseForce={5.5}
  springStrength={13}
  damping={4.8}
  noiseStrength={0.16}
  glowIntensity={0.55}
  formationDuration={7.2}
/>

// Existing Hero is mounted only after the immediately usable CTA is pressed.
<Particle80Intro handoffContent={<Hero />} />
```

## First-visit story

| Active time at speed 1 | Story |
| --- | --- |
| 0–0.72 s | Sparse distant dust; a dark spatial environment |
| 0.72–2.02 s | Crisp SWUFE / FIC labels fade in; two independent source fields gather around them |
| 2.02–4.03 s | The sources move inward and interleave through a counter-rotating central volume |
| 4.03–6.48 s | A volumetric 80 emerges as particles physically pursue the final attractors |
| 6.48–7.2 s | The field settles; slight overshoot dissipates |
| After 7.2 s | Individual curl drift, quiet breathing and localized pointer response |

No essential button is gated by this sequence. Text only changes opacity; it is
never moved by the simulation. Source locations adapt to the desktop side labels
and the mobile upper labels. The camera stays fixed.

Repeat visits default to 1.4 seconds; use `repeatVisit="always"` to replay the
cinematic duration, or `"skip"` for an already-formed field.
The optional localStorage key is `chengdu80:innovation-field:seen:v2`, deliberately
versioned so visitors to the previous concept see this new narrative once.

## Real dynamics, not interpolated positions

Each particle has typed-buffer position, velocity, targetPosition, size, opacity,
depth and noiseSeed. Source membership is immutable. There are 70% structural
particles, 20% surrounding ambient particles and 10% distant dust (rounded to
whole particles). Both institutions contribute to both numerals.

The final structural attractors are sampled throughout filled 3D annular volumes,
with uneven thickness/depth/density. There is no equal spacing along an outline,
and the renderer does not use the old `spatialPosition` path-following system.

Attractor positions follow the narrative, but actual particles never lerp to them:

```text
acceleration = spring × (target − position) + soft pointer force + seeded curl noise
velocity = (velocity + acceleration × dt) × exp(−damping × dt)
position += velocity × dt
```

Semi-implicit substeps are at most 1/120 second, with a maximum 75 ms simulation
budget per paint and a vector speed limit. The default system is underdamped:
small overshoot is real inertia. Noise is continuous and independently seeded,
not new randomness each frame. The pointer uses a smooth radius falloff in the
same projected coordinates as rendering, with no artificial depth kick.

Only initialization or static accessibility mode sets position directly to targets.
Changing controlled `formationProgress` changes attractors, not positions.
While paused, the new targets wait for simulation to resume; there is deliberately
no teleporting during a paused scrub. Appearance/dissolve can repaint while paused.

## Configuration

| Prop | Default | Range / purpose |
| --- | --- | --- |
| particleCount | 1400 | 180–2200 desktop; capped at 360 low power |
| mouseForce | 5.5 | 0–12; low power applies 60% strength |
| springStrength | 13 | 3–40; target attraction |
| damping | 4.8 | 1.5–14; velocity dissipation |
| noiseStrength | .16 | 0–.6; continuous procedural force |
| glowIntensity | .55 on Intro | 0–1; soft additive halos, no post-processing |
| formationDuration | 7.2 | .5–16 active seconds at speed 1 |

Existing `pointerForce`, `glow`, and `introDuration` are retained as aliases.
`pointerForce` wins over `mouseForce`; `glowIntensity` wins over `glow`;
`formationDuration` wins over `introDuration`.
`ambientParticleRatio` is deprecated: this narrative fixes the split at 70/20/10.

Existing `enabled`, `active`, `speed`, `formationProgress`, `dissolveProgress`,
`intensity`, `interactive`, `twinkle`, `trails`, `trailLength`, `quality`,
`lowPowerMode`, `motion`, and `reducedMotionMode` remain available.
Bare Particle80 requires `interactive`; Particle80Intro enables it by default.

## State and handoff

`useParticleIntro()` exposes `phase` (`space | sources | merging | forming | living`),
`introStarted`, `formationProgress`, `settled`, `interactionEnabled`, and the stable
`onStateChange` callback. Progress is reported at 4% increments plus phase edges,
not through React state on every frame. `settled` means the formation story
completed, not that procedural motion or every physical velocity has stopped.

`handoffContent` still uses a user-triggered 850 ms dissolve, then unmounts the
particle renderer and focuses the destination. Static/reduced motion skips this
transition. The original globe remains lazy-loaded and unmodified.

## Accessibility and performance

- Single Canvas 2D, white/blue-white cores, cached halo sprite, additive blending.
- Approximately 6% of particles have very short velocity-derived fading trails.
- Fixed typed buffers and reused output objects; no mesh per particle, per-frame
  particle arrays, external textures, video, audio, or heavy bloom dependencies.
- Desktop draw budget: 60 fps / DPR ≤1.5. Mobile/low-power: 30 fps / 360 particles /
  DPR ≤1. These are target caps, not measured real-device FPS claims.
- Fine-pointer interaction only; normal touch scrolling is retained.
- Hidden/offscreen/paused scenes suspend RAF and do not catch up hidden time.
- Reduced motion shows a complete static field and crisp labels. Turning it off
  does not restart the cinematic formation.
- Unavailable/lost Canvas reveals a complete deterministic inline SVG; phase
  callbacks resolve to completed, so content cannot get stuck behind the intro.

## Files and checks

- `lib/particle80-field.ts`: source choreography, volumetric distribution, physical
  state/integration, perspective and timeline.
- `components/Particle80.tsx`: lifecycle, field rendering, pointer input and fallback.
- `components/Particle80Intro.tsx` / `.module.css`: stable institution typography,
  first/repeat visit story, responsive field and handoff.
- `qa/particle80-intro.tsx`: existing isolated study, now exposes phase status.
- `qa/particle80-field.test.mjs`: distribution, staged targets, true inertia,
  overshoot, recovery, frame-rate stability, extreme inputs, static contracts.
- `qa/particle80.ssr.test.mjs`: deterministic SSR and accessibility/configuration.
- `qa/particle80-intro.browser.mjs`: updated optional browser QA for the new field;
  run only when browser testing is requested. Prior-version screenshots are not
  evidence for this redesign.

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
Remote GitHub/Vercel publication still needs the repository/account connection
described in PREVIEW-PUBLISH.md; a successful local build does not publish it.
