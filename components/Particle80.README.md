# Particle80 — physical innovation field

The current renderer implements the narrative **SWUFE + FIC → CHENGDU 80**.
The silhouette stays anchored while a smaller population circulates inside it.

Use `Particle80Intro` for the complete institutional composition, or the bare
`Particle80` as a reusable field. The shared implementation uses actual
position/velocity integration, 60% anchors / 22% runners / 18% ambient particles,
role-sensitive pointer repulsion and procedural curl forces. Cool-white anchors,
icy-blue runners, gray-blue ambient dust and 2% champagne points add restrained
color depth. The upper/lower 8 loops circulate in opposite directions; the 0 has
its own slower clockwise flow. There is no whole-digit rotation.

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
