# Particle80 — physical innovation field

The current renderer implements the narrative **SWUFE + FIC → CHENGDU 80**.
The silhouette stays readable while **every particle** moves at its own scale.

Use `Particle80Intro` for the complete institutional composition, or the bare
`Particle80` as a reusable field. The shared implementation uses actual
position/velocity integration: 50% slow structure, 25% circulating flow,
18% ambient dust and 7% freer highlights. Living particles are constrained toward
orbit tubes along their normals and propelled tangentially, with no phase lock
to a seeded point. Pointer disturbances retain inertia and rejoin the current
orbit. The upper/lower 8 circulate in opposite directions; the 0 is smoother.
All roles have XY and depth motion, except intentional pause/reduced-motion modes.

Five size tiers and three cached optical types (dust/star/spark) create a long-tail
luminance distribution. Colour is sampled from a coherent spatial temperature
field, with a maximum ~2% champagne membership; no per-particle random colours.
The stellar-radiance pass uses 9,600 desktop / 900 low-power particles. The Intro
composition retains its current viewScale 1.72, capped on narrow screens
to keep both digits visible. Camera, typography, 7.2-second story and CTA are unchanged.
Only 0.5% of existing stars are intense emitters: 48 desktop / 5 mobile, with
independent slow glints and local halos, never screen-wide exposure or bloom.
The default Intro brightness preset B uses structure 1.72 / flow 1.92 / ambient 1,
with local star caps described below. A stays at 1.18 / 1.24 / 1.
Cached point-spread sprites replace hard filled disks with a bright compact core,
coloured shoulder and continuous radial falloff. Nearer particles have a subtle
focus spread; only rare beacons have local radiance and a low-intensity glint.
The emitter atlas costs one draw per ordinary particle, without per-frame
gradients or arc tessellation. It rebakes only when halo intensity changes.
Background source haze is reduced, not exposed upwards with the stars.

Density correction: each loop receives particles proportional to its perimeter.
Each role/optical-size tier uses jittered equal-arc-length strata, rather than
random polar angles. Large stars are no longer biased to the loop poles.
The living flow converts distance speed to local angular speed, maintaining
ellipse coverage without a seeded phase lock or changes to pointer/damping.
The SWUFE/FIC rectangular particle-dimming masks have been removed. Typography
sits over the continuous field, without dark cutouts. The scroll-driven reading
corridor for body content remains unchanged.

Local stellar polish: the existing icy-blue and champagne ramps retain more
colour, with a tiny white-hot center and coloured shoulder baked without internal
additive bleaching. Only existing coloured size-class 3/4 stars receive 1.16/1.30
render-radius multipliers; dust and ambient particles keep their size. The exact
2% gold budget now reserves one quarter for existing large stars, including a few
beacons selected from the same spatial warmth zone. No particles were added.
Star gain caps are 1.8 for neutral/blue and 1.65 for large gold; ordinary gold
retains 1.3. Physics buffers, random samples, paths, size-class budgets, choreography
and pointer forces are unchanged. Reduced motion uses steady illumination.

Development preview: `?fieldDebug=roles`, `vectors`, `flow`, or `telemetry`.
Diagnostics and their explicit snapshot API are removed from production builds.

```tsx
import Particle80 from '@/components/Particle80';

<Particle80
  interactive
  background="dark"
  particleCount={9600}
  mouseForce={5.5}
  springStrength={13}
  damping={4.8}
  noiseStrength={0.16}
  glowIntensity={0.55}
  formationDuration={7.2}
/>;
```

See [Particle80Intro.README.md](./Particle80Intro.README.md) for the full timeline,
configuration, callback, controlled-progress, performance and accessibility
contracts.

The old analytic helpers in `lib/particle80.ts` and displacement-only integrator in
`lib/particle80-physics.ts` remain for compatibility and their regression tests.
The live field renderer uses `lib/particle80-field.ts`; it does not call the old
path follower or offset-only physics.
