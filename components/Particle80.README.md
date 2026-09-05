# Particle80 — physical innovation field

The current renderer implements the narrative **SWUFE + FIC → CHENGDU 80**.
It no longer animates evenly spaced particles along the digit paths.

Use `Particle80Intro` for the complete institutional composition, or the bare
`Particle80` as a reusable field. The shared implementation uses actual
position/velocity integration, a 70/20/10 volumetric distribution, soft pointer
repulsion and procedural curl forces.

```tsx
import Particle80 from '@/components/Particle80';

<Particle80
  interactive
  background="dark"
  particleCount={1400}
  mouseForce={5.5}
  springStrength={13}
  damping={4.8}
  noiseStrength={0.16}
  glowIntensity={0.55}
  formationDuration={7.2}
/>
```

See [Particle80Intro.README.md](./Particle80Intro.README.md) for the full timeline,
configuration, callback, controlled-progress, performance and accessibility
contracts.

The old analytic helpers in `lib/particle80.ts` and displacement-only integrator in
`lib/particle80-physics.ts` remain for compatibility and their regression tests.
The live field renderer uses `lib/particle80-field.ts`; it does not call the old
path follower or offset-only physics.
