/** Font-free, deterministic paths. Coordinates are in a small shared design space. */
export type Digit = 0 | 8;
export type CurvePoint = { x: number; y: number; nx: number; ny: number };
export type LightPoint = {
  digit: Digit;
  phase: number;
  offset: number;
  depth: number;
  radius: number;
  brightness: number;
  rate: number;
  trail: boolean;
  layer: 'structure' | 'foreground' | 'background';
  /** Seeded rest position and individual drift rates, allocated only at setup. */
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  velocity: { x: number; y: number; z: number };
  scatter: { x: number; y: number; z: number };
  delay: number;
  warm: boolean;
};
export type SpatialPoint = CurvePoint & {
  z: number;
  size: number;
  opacity: number;
};
export type ProjectedPoint = {
  x: number;
  y: number;
  size: number;
  opacity: number;
};
export const PARTICLE_80_DEFAULTS = {
  particleCount: 440,
  maxParticles: 600,
  mobileMaxParticles: 180,
  speed: 1,
  glow: 0.45,
  desktopFps: 30,
  mobileFps: 24,
  formationDuration: 2.6,
  intensity: 1,
  viewWidth: 5.2,
  viewHeight: 3.25,
} as const;

export function smoothProgress(progress: number) {
  const p = bounded(progress, 0, 1, 0);
  return p * p * p * (p * (p * 6 - 15) + 10);
}

/** Static/reduced-motion mode shows the formed identity, never a stalled intro. */
export function resolveFormation(
  time: number,
  controlled: number | undefined,
  still: boolean,
  duration: number = PARTICLE_80_DEFAULTS.formationDuration,
) {
  if (still) return 1;
  return bounded(
    controlled ??
      time / bounded(duration, 0.2, 6, PARTICLE_80_DEFAULTS.formationDuration),
    0,
    1,
    0,
  );
}

export type MotionClock = {
  time: number;
  previous: number | null;
  remainder: number;
};
/** Separate elapsed time from paint throttling; never count the remainder twice. */
export function stepMotionClock(
  clock: MotionClock,
  now: number,
  interval: number,
  speed: number,
) {
  if (clock.previous === null) {
    clock.previous = now;
    return false;
  }
  const delta = Math.min(100, Math.max(0, now - clock.previous));
  clock.previous = now;
  clock.time += (delta / 1000) * speed;
  clock.remainder += delta;
  if (clock.remainder + 1e-6 < interval) return false;
  clock.remainder = Math.max(
    0,
    clock.remainder -
      interval * Math.floor((clock.remainder + 1e-6) / interval),
  );
  return true;
}

export const DIGIT_PATHS = {
  8: 'M -.84 0 C -1.64 -.24 -1.65 -1.12 -.84 -1.12 C -.03 -1.12 -.04 -.24 -.84 0 C -1.77 .26 -1.77 1.16 -.84 1.16 C .09 1.16 .09 .26 -.84 0 Z',
  0: 'M .85 -1.14 C 1.73 -1.14 1.73 1.14 .85 1.14 C -.03 1.14 -.03 -1.14 .85 -1.14 Z',
} as const;

const SEGMENTS = 768;
type Point = { x: number; y: number };
type Cubic = readonly [Point, Point, Point, Point];
const eight: readonly Cubic[] = [
  [
    { x: -0.84, y: 0 },
    { x: -1.64, y: -0.24 },
    { x: -1.65, y: -1.12 },
    { x: -0.84, y: -1.12 },
  ],
  [
    { x: -0.84, y: -1.12 },
    { x: -0.03, y: -1.12 },
    { x: -0.04, y: -0.24 },
    { x: -0.84, y: 0 },
  ],
  [
    { x: -0.84, y: 0 },
    { x: -1.77, y: 0.26 },
    { x: -1.77, y: 1.16 },
    { x: -0.84, y: 1.16 },
  ],
  [
    { x: -0.84, y: 1.16 },
    { x: 0.09, y: 1.16 },
    { x: 0.09, y: 0.26 },
    { x: -0.84, y: 0 },
  ],
];
const zero: readonly Cubic[] = [
  [
    { x: 0.85, y: -1.14 },
    { x: 1.73, y: -1.14 },
    { x: 1.73, y: 1.14 },
    { x: 0.85, y: 1.14 },
  ],
  [
    { x: 0.85, y: 1.14 },
    { x: -0.03, y: 1.14 },
    { x: -0.03, y: -1.14 },
    { x: 0.85, y: -1.14 },
  ],
];

function cubic(points: Cubic, t: number): Point {
  const u = 1 - t;
  return {
    x:
      u ** 3 * points[0].x +
      3 * u * u * t * points[1].x +
      3 * u * t * t * points[2].x +
      t ** 3 * points[3].x,
    y:
      u ** 3 * points[0].y +
      3 * u * u * t * points[1].y +
      3 * u * t * t * points[2].y +
      t ** 3 * points[3].y,
  };
}

/** Arc-length resampling prevents slow bunching at the ends of the bowls. */
function buildCurve(segments: readonly Cubic[]) {
  const dense = Array.from({ length: SEGMENTS + 1 }, (_, i) => {
    const scaled = (i / SEGMENTS) * segments.length;
    const segment = Math.min(segments.length - 1, Math.floor(scaled));
    return cubic(segments[segment], scaled - segment);
  });
  const lengths = [0];
  for (let i = 1; i < dense.length; i++)
    lengths.push(
      lengths[i - 1] +
        Math.hypot(dense[i].x - dense[i - 1].x, dense[i].y - dense[i - 1].y),
    );
  const total = lengths[SEGMENTS];
  let cursor = 1;
  const samples = Array.from({ length: SEGMENTS }, (_, i) => {
    const distance = (i / SEGMENTS) * total;
    while (cursor < SEGMENTS && lengths[cursor] < distance) cursor++;
    const previous = dense[cursor - 1];
    const next = dense[cursor];
    const ratio =
      (distance - lengths[cursor - 1]) /
      (lengths[cursor] - lengths[cursor - 1]);
    return {
      x: previous.x + (next.x - previous.x) * ratio,
      y: previous.y + (next.y - previous.y) * ratio,
    };
  });
  // Continuous vertex normals matter once the path becomes a thick cloud:
  // piecewise-constant segment normals cause visible micro-steps off the curve.
  return samples.map((point, i) => {
    const previous = samples[(i + SEGMENTS - 1) % SEGMENTS];
    const next = samples[(i + 1) % SEGMENTS];
    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    const length = Math.hypot(dx, dy) || 1;
    return { ...point, nx: -dy / length, ny: dx / length };
  });
}

const curves = { 8: buildCurve(eight), 0: buildCurve(zero) };

/** Writes into a caller-owned point: no per-particle allocation in the render loop. */
export function sampleDigit(
  digit: Digit,
  phase: number,
  out: CurvePoint,
): CurvePoint {
  const curve = curves[digit];
  const position = (((phase % 1) + 1) % 1) * SEGMENTS;
  const index = Math.floor(position);
  const fraction = position - index;
  const a = curve[index];
  const b = curve[(index + 1) % SEGMENTS];
  const nx = a.nx + (b.nx - a.nx) * fraction;
  const ny = a.ny + (b.ny - a.ny) * fraction;
  const length = Math.hypot(nx, ny) || 1;
  out.x = a.x + (b.x - a.x) * fraction;
  out.y = a.y + (b.y - a.y) * fraction;
  out.nx = nx / length;
  out.ny = ny / length;
  return out;
}

export function bounded(
  value: number,
  min: number,
  max: number,
  fallback: number,
) {
  return Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;
}

export function particleBudget(requested: number, lowPower: boolean) {
  return Math.round(
    bounded(
      requested,
      96,
      lowPower
        ? PARTICLE_80_DEFAULTS.mobileMaxParticles
        : PARTICLE_80_DEFAULTS.maxParticles,
      lowPower ? 180 : 440,
    ),
  );
}

export function createLightPoints(
  count: number,
  ambientParticleRatio = 0.23,
): LightPoint[] {
  let seed = 802026;
  const random = () => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const eightCount = Math.round(count * 0.55);
  const ambientCount = Math.round(
    count * bounded(ambientParticleRatio, 0.2, 0.28, 0.23),
  );
  const dustCount = Math.round(count * 0.07);
  const structureCount = count - ambientCount - dustCount;
  const structureEightCount = Math.round(structureCount * 0.55);
  const anchor: CurvePoint = { x: 0, y: 0, nx: 0, ny: 0 };
  let fieldIndex = 0;
  return Array.from({ length: count }, (_, i) => {
    const digit: Digit = i < eightCount ? 8 : 0;
    const local = digit === 8 ? i : i - eightCount;
    const length = digit === 8 ? eightCount : count - eightCount;
    const coreCount =
      digit === 8 ? structureEightCount : structureCount - structureEightCount;
    const structure = local < coreCount;
    const layer = structure
      ? 'structure'
      : fieldIndex++ < ambientCount
        ? 'foreground'
        : 'background';
    const phase =
      ((structure ? local : local - coreCount) + random() * 0.85) /
      (structure ? coreCount : length - coreCount);
    const depth = random() * Math.PI * 2;
    const offset = structure
      ? (random() + random() + random() - 1.5) * (count <= 180 ? 0.13 : 0.17)
      : (random() > 0.5 ? 1 : -1) * (0.2 + random() * 0.38);
    sampleDigit(digit, phase, anchor);
    const size =
      layer === 'foreground'
        ? 0.9 + random() * 0.9
        : layer === 'background'
          ? 0.3 + random() * 0.5
          : 0.55 + random() ** 2 * 1.15;
    const opacity = structure ? 0.25 + random() * 0.56 : 0.09 + random() * 0.16;
    const scatterAngle = random() * Math.PI * 2;
    const scatterRadius = 0.25 + Math.sqrt(random()) * 0.75;
    return {
      digit,
      phase,
      offset,
      depth,
      radius: size,
      brightness: opacity,
      rate: 0.7 + random() * 0.6,
      trail: local % 13 === 0,
      layer,
      x: anchor.x + anchor.nx * offset,
      y: anchor.y + anchor.ny * offset,
      z: structure
        ? (random() - 0.5) * 0.65
        : layer === 'foreground'
          ? 0.65 + random() * 0.55
          : -0.85 - random() * 0.7,
      size,
      opacity,
      velocity: {
        x: 0.06 + random() * 0.12,
        y: 0.05 + random() * 0.13,
        z: 0.04 + random() * 0.09,
      },
      scatter: {
        x: Math.cos(scatterAngle) * scatterRadius * 2.05,
        y: Math.sin(scatterAngle) * scatterRadius * 1.27,
        z: -1.7 + random() * 2.9,
      },
      delay: random() * 0.2,
      warm: i % 43 === 9,
    };
  });
}

/** Analytic, seeded flow: no mutable simulation, per-frame random values, or allocations. */
export function spatialPosition(
  particle: LightPoint,
  time: number,
  formation: number,
  dissolve: number,
  out: SpatialPoint,
): SpatialPoint {
  const t = Number.isFinite(time) ? Math.max(0, time) : 0;
  const progress = bounded(formation, 0, 1, 0);
  const formed = smoothProgress(
    (progress - particle.delay) / (1 - particle.delay),
  );
  const dispersed = smoothProgress(dissolve);
  const mix = formed * (1 - dispersed);
  const cloud = particle.layer !== 'structure';
  const phase = particle.depth;
  // Incommensurate, individually seeded frequencies resemble gentle turbulence.
  const waveX = Math.sin(t * particle.velocity.x + phase);
  const waveY = Math.cos(t * particle.velocity.y + phase * 1.71);
  const waveZ = Math.sin(t * particle.velocity.z + phase * 2.13);
  if (cloud) {
    // The surrounding 30% stays a free field, never another offset digit ribbon.
    // An elliptic orbit keeps it gently gravitational without a physics solver.
    const orbit = t * 0.025 * particle.rate;
    const cosine = Math.cos(orbit);
    const sine = Math.sin(orbit);
    const aspect = 2.05 / 1.27;
    const expansion = 1 + dispersed * 0.17;
    out.x =
      (particle.scatter.x * cosine - particle.scatter.y * aspect * sine) *
        expansion +
      waveY * 0.055;
    out.y =
      ((particle.scatter.x / aspect) * sine + particle.scatter.y * cosine) *
        expansion +
      waveX * 0.045;
    out.z = particle.z + waveZ * 0.13;
    out.nx = 0;
    out.ny = 0;
    out.size = particle.size;
    out.opacity = particle.opacity * (1 - dispersed);
    return out;
  }
  lightPosition(particle, t * 0.58, out);
  const drift = 0.023;
  const targetX =
    out.x + waveX * drift + Math.sin(t * 0.37 + phase) * drift * 0.3;
  const targetY =
    out.y + waveY * drift + Math.cos(t * 0.29 + phase * 2) * drift * 0.3;
  const targetZ = particle.z + waveZ * 0.055;
  const scatterX = particle.scatter.x * (1 + dispersed * 0.17) + waveY * 0.055;
  const scatterY = particle.scatter.y * (1 + dispersed * 0.17) + waveX * 0.045;
  const scatterZ = particle.scatter.z + waveZ * 0.09;
  // Curved, staggered convergence rather than straight, synchronized lerps.
  const curl = Math.sin(Math.PI * mix) * 0.16;
  out.x =
    scatterX + (targetX - scatterX) * mix + Math.cos(phase + mix * 2) * curl;
  out.y =
    scatterY + (targetY - scatterY) * mix + Math.sin(phase + mix * 2) * curl;
  out.z = scatterZ + (targetZ - scatterZ) * mix;
  out.size = particle.size;
  out.opacity = particle.opacity * (0.5 + formed * 0.5) * (1 - dispersed);
  return out;
}

/** Gentle spatial projection; positive z moves toward the viewer. */
export function projectSpatial(
  point: SpatialPoint,
  time: number,
  intensity: number,
  twinkle: boolean,
  out: ProjectedPoint,
  twinkleIntensity = 0.13,
): ProjectedPoint {
  const t = Number.isFinite(time) ? Math.max(0, time) : 0;
  const yaw = Math.sin(t * 0.055) * 0.026;
  const pitch = Math.sin(t * 0.043) * 0.016;
  const depth = bounded(point.z, -2.5, 2.5, 0);
  const x = point.x * Math.cos(yaw) + depth * Math.sin(yaw);
  const z = bounded(
    depth * Math.cos(yaw) - point.x * Math.sin(yaw),
    -2.5,
    2.5,
    0,
  );
  const y = point.y * Math.cos(pitch) - z * Math.sin(pitch);
  const perspective = 6.5 / (6.5 - z);
  const depthFade = bounded(0.86 + z * 0.18, 0.42, 1, 0.86);
  const variation = bounded(twinkleIntensity, 0, 0.3, 0.13);
  const breath = twinkle
    ? 1 -
      variation +
      variation * Math.sin(t * 0.48 + point.x * 4.2 + point.z * 3.7)
    : 1;
  out.x = x * perspective;
  out.y = y * perspective;
  out.size =
    point.size * perspective * (1 + smoothProgress((z - 0.35) / 0.65) * 0.22);
  out.opacity = bounded(
    point.opacity * depthFade * breath * bounded(intensity, 0, 1.5, 1),
    0,
    1,
    0,
  );
  return out;
}

export function lightPosition(
  particle: LightPoint,
  time: number,
  out: CurvePoint,
) {
  sampleDigit(
    particle.digit,
    particle.phase + time * 0.0105 * particle.rate,
    out,
  );
  // Minute breathing across the strand adds depth without deforming the digits.
  const offset =
    particle.offset * (1 + Math.sin(time * 0.16 + particle.depth) * 0.12);
  out.x += out.nx * offset;
  out.y += out.ny * offset;
  return out;
}
