import {
  bounded,
  smoothProgress,
  type SpatialPoint,
  type ProjectedPoint,
} from './particle80';

/** Physical field coordinates are independent of the Canvas resolution. */
export const FIELD_DEFAULTS = {
  particleCount: 9600,
  mobileCount: 900,
  maxParticles: 9600,
  mouseForce: 5.5,
  springStrength: 13,
  damping: 4.8,
  noiseStrength: 0.16,
  glowIntensity: 0.55,
  formationDuration: 7.2,
  viewWidth: 8.4,
  viewHeight: 4.6,
} as const;

export type FieldPhase = 'space' | 'sources' | 'merging' | 'forming' | 'living';
export type FieldLayout = { sourceX: number; sourceY: number };
export type FieldConfig = {
  springStrength: number;
  damping: number;
  noiseStrength: number;
  pointerForce: number;
};
export type FieldPointer = { x: number; y: number; strength: number };
/** Immutable atlas ramp, generated only once. No per-frame color allocation. */
const colorRamp = (a: number[], b: number[], count: number) =>
  Array.from(
    { length: count },
    (_, i) =>
      '#' +
      a
        .map((v, c) =>
          Math.round(v + ((b[c] - v) * i) / (count - 1))
            .toString(16)
            .padStart(2, '0'),
        )
        .join(''),
  );
export const FIELD_ACCENT_START = 24;
export const FIELD_PALETTE = [
  ...colorRamp([255, 245, 232], [234, 244, 255], 16),
  ...colorRamp([219, 239, 255], [143, 223, 255], 8),
  ...colorRamp([247, 242, 231], [217, 179, 108], 8),
] as const;
export const FIELD_ROLES = {
  structure: 0,
  flow: 1,
  ambient: 2,
  highlight: 3,
} as const;
export const FIELD_ROLE_RATIOS = [0.5, 0.25, 0.18, 0.07] as const;
export const FIELD_OPTICS = { dust: 0, star: 1, spark: 2 } as const;
/** Only one in 200 particles is an intense emitter; this is an optical budget. */
export const FIELD_BEACON_RATIO = 0.005;
export const FIELD_POINTER_RADIUS = 0.65;
export const FIELD_ROLE_RESPONSE = [
  { spring: 1.25, pointer: 0.3, noise: 0.32, drag: 1, depth: 0.045 },
  { spring: 1, pointer: 1, noise: 0.58, drag: 0.96, depth: 0.09 },
  { spring: 0.55, pointer: 1.4, noise: 1, drag: 0.8, depth: 0.14 },
  { spring: 0.72, pointer: 1.15, noise: 0.85, drag: 0.68, depth: 0.16 },
] as const;
/** Canvas y points down: positive angular velocity is visually clockwise. */
export const FIELD_LOOPS = [
  { x: -0.87, y: -0.53, rx: 0.49, ry: 0.49, speed: 0.34 },
  { x: -0.87, y: 0.52, rx: 0.55, ry: 0.54, speed: -0.3 },
  { x: 0.87, y: 0, rx: 0.58, ry: 1.08, speed: 0.255 },
] as const;

// Equal arc-length coordinates keep an ellipse's long sides as populated as
// its ends. Built once; the living frame uses only a lookup and local metric.
const TAU = Math.PI * 2;
const ARC_SAMPLES = 256;
const LOOP_ARCS = FIELD_LOOPS.map((lane) => {
  const steps = 1024;
  const lengths = new Float64Array(steps + 1);
  for (let i = 1; i <= steps; i++) {
    const theta = ((i - 0.5) / steps) * TAU;
    lengths[i] =
      lengths[i - 1] +
      (Math.hypot(lane.rx * Math.sin(theta), lane.ry * Math.cos(theta)) * TAU) /
        steps;
  }
  const circumference = lengths[steps];
  const angles = new Float32Array(ARC_SAMPLES + 1);
  let cursor = 1;
  for (let i = 0; i <= ARC_SAMPLES; i++) {
    const distance = (circumference * i) / ARC_SAMPLES;
    while (cursor < steps && lengths[cursor] < distance) cursor++;
    const fraction =
      (distance - lengths[cursor - 1]) /
      (lengths[cursor] - lengths[cursor - 1]);
    angles[i] = ((cursor - 1 + fraction) * TAU) / steps;
  }
  return { angles, circumference, meanRadius: circumference / TAU };
});

/** Phase is distance around the loop, not a polar angle. */
export function fieldOrbitAngle(loop: number, phase: number) {
  const sample = ((((phase / TAU) % 1) + 1) % 1) * ARC_SAMPLES;
  const index = Math.floor(sample);
  const angles = LOOP_ARCS[loop].angles;
  return angles[index] + (angles[index + 1] - angles[index]) * (sample - index);
}

function champagneZone(x: number, y: number, z: number) {
  return (
    Math.exp(-((x + 1.05) ** 2 * 4 + (y - 0.78) ** 2 * 5 + z * z * 0.7)) *
      0.85 +
    Math.exp(-((x - 1.18) ** 2 * 5 + (y - 0.65) ** 2 * 7 + z * z)) * 0.55
  );
}

/** Neighbours sample the same continuous temperature, not particle-ID noise. */
export function fieldColorIndex(
  loop: number,
  x: number,
  y: number,
  z: number,
  time: number,
  accent: boolean,
) {
  if (accent)
    return (
      FIELD_ACCENT_START + Math.round(Math.min(1, champagneZone(x, y, z)) * 7)
    );
  const lane = FIELD_LOOPS[loop];
  const angle = lane
    ? Math.atan2((y - lane.y) / lane.ry, (x - lane.x) / lane.rx)
    : x * 0.4;
  const temperature =
    (loop === 0 ? 0.76 : loop === 1 ? 0.29 : 0.6) +
    Math.sin(angle + time * 0.035) * 0.14 +
    Math.sin(x * 1.7 - y * 0.8) * 0.07 +
    z * 0.065;
  return Math.round(bounded(temperature, 0, 1, 0.5) * 23);
}

export function updateFieldColors(
  field: ParticleField,
  time: number,
  useRest = false,
) {
  const positions = useRest ? field.rest : field.spreadMix > 0 ? field.targetPosition : field.position;
  for (let i = 0; i < field.count; i++) {
    const k = i * 3;
    field.color[i] = fieldColorIndex(
      field.loop[i],
      positions[k],
      positions[k + 1],
      positions[k + 2],
      time,
      field.accent[i] === 1,
    );
  }
}
export type ParticleField = {
  count: number;
  /** Formation hands over continuously to phase-free orbit constraints. */
  flowMix: number;
  /** Reversible layout blend. Zero is the original digit solver, bit-for-bit. */
  spreadMix: number;
  sideSeed: Float32Array;
  sideTarget: Float32Array;
  position: Float32Array;
  velocity: Float32Array;
  targetPosition: Float32Array;
  rest: Float32Array;
  source: Float32Array;
  size: Float32Array;
  opacity: Float32Array;
  depth: Float32Array;
  noiseSeed: Float32Array;
  side: Int8Array;
  /** 50% structure / 25% flow / 18% ambient / 7% highlights. */
  role: Uint8Array;
  /** 0: anchors + runners, 1: near ambient, 2: distant ambient. */
  layer: Uint8Array;
  /** 0: upper 8, 1: lower 8, 2: 0; 255: no digit (ambient). */
  loop: Uint8Array;
  orbitPhase: Float32Array;
  orbitWidth: Float32Array;
  orbitSpeed: Float32Array;
  color: Uint8Array;
  accent: Uint8Array;
  optical: Uint8Array;
  sizeClass: Uint8Array;
  beacon: Uint8Array;
  trail: Uint8Array;
};

export function fieldBudget(requested: number, low: boolean) {
  return Math.round(
    bounded(
      requested,
      180,
      low ? FIELD_DEFAULTS.mobileCount : FIELD_DEFAULTS.maxParticles,
      low ? FIELD_DEFAULTS.mobileCount : FIELD_DEFAULTS.particleCount,
    ),
  );
}
export function fieldPhase(progress: number): FieldPhase {
  return progress < 0.1
    ? 'space'
    : progress < 0.28
      ? 'sources'
      : progress < 0.56
        ? 'merging'
        : progress < 0.9
          ? 'forming'
          : 'living';
}
export function fieldProgress(
  time: number,
  controlled: number | undefined,
  still: boolean,
  duration: number,
) {
  return still
    ? 1
    : bounded(controlled ?? time / bounded(duration, 0.5, 16, 7.2), 0, 1, 0);
}

/** Jittered arc-length strata fill the volume without empty random sectors. */
export function createParticleField(count: number): ParticleField {
  let seed = 802026;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const normal = () => random() + random() + random() + random() - 2;
  const field: ParticleField = {
    count,
    flowMix: 0,
    spreadMix: 0,
    sideSeed: new Float32Array(count * 3),
    sideTarget: new Float32Array(count * 3),
    position: new Float32Array(count * 3),
    velocity: new Float32Array(count * 3),
    targetPosition: new Float32Array(count * 3),
    rest: new Float32Array(count * 3),
    source: new Float32Array(count * 3),
    size: new Float32Array(count),
    opacity: new Float32Array(count),
    depth: new Float32Array(count),
    noiseSeed: new Float32Array(count),
    side: new Int8Array(count),
    role: new Uint8Array(count),
    layer: new Uint8Array(count),
    loop: new Uint8Array(count),
    orbitPhase: new Float32Array(count),
    orbitWidth: new Float32Array(count),
    orbitSpeed: new Float32Array(count),
    color: new Uint8Array(count),
    accent: new Uint8Array(count),
    optical: new Uint8Array(count),
    sizeClass: new Uint8Array(count),
    beacon: new Uint8Array(count),
    trail: new Uint8Array(count),
  };
  const anchors = Math.round(count * FIELD_ROLE_RATIOS[0]);
  const runners = Math.round(count * FIELD_ROLE_RATIOS[1]);
  const structures = anchors + runners;
  const ambientEnd = structures + Math.round(count * FIELD_ROLE_RATIOS[2]);
  const nearAmbient = Math.round(count * 0.12);
  const sizeOrder = Array.from({ length: count }, (_, i) => i);
  const hotspot = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const k = i * 3;
    const role = i < anchors ? 0 : i < structures ? 1 : i < ambientEnd ? 2 : 3;
    const layer = role !== 2 ? 0 : i < structures + nearAmbient ? 1 : 2;
    field.role[i] = role;
    field.layer[i] = layer;
    const angle = random() * Math.PI * 2;
    // Keep the current volumetric thickness; balance coverage along the loop.
    const thickness = normal() * (role === 1 ? 0.11 : role === 3 ? 0.21 : 0.17);
    field.orbitPhase[i] = angle;
    field.orbitWidth[i] = thickness;
    if (layer === 0) {
      // Independent of side/parity: both SWUFE and FIC seed every loop.
      const local = role === 1 ? i - anchors : role === 3 ? i - ambientEnd : i;
      const roleCount =
        role === 1 ? runners : role === 3 ? count - ambientEnd : anchors;
      const perimeter = LOOP_ARCS.reduce(
        (sum, arc) => sum + arc.circumference,
        0,
      );
      const upperCount = Math.round(
        (roleCount * LOOP_ARCS[0].circumference) / perimeter,
      );
      const lowerCount = Math.round(
        (roleCount * LOOP_ARCS[1].circumference) / perimeter,
      );
      const loop =
        local < upperCount ? 0 : local < upperCount + lowerCount ? 1 : 2;
      field.loop[i] = loop;
      const lane = FIELD_LOOPS[loop];
      const bandSample = random();
      const band = bandSample < 0.5 ? 0.4 : bandSample < 0.92 ? 1 : 1.6;
      const roleSpeed = role === 0 ? 0.2 : role === 3 ? 0.8 : 1;
      // A tiny, slow counter-current in the 8; never reverse the whole system.
      const counterCurrent = loop < 2 && local % 37 === 0 ? -0.55 : 1;
      field.orbitSpeed[i] =
        lane.speed *
        roleSpeed *
        band *
        (0.88 + random() * 0.24) *
        counterCurrent;
      field.rest[k] = lane.x + Math.cos(angle) * (lane.rx + thickness);
      field.rest[k + 1] = lane.y + Math.sin(angle) * (lane.ry + thickness);
      field.rest[k + 2] = normal() * (role === 1 ? 0.22 : 0.34);
    } else {
      field.loop[i] = 255;
      field.rest[k] = (random() - 0.5) * (layer === 1 ? 4.8 : 8.6);
      field.rest[k + 1] = (random() - 0.5) * (layer === 1 ? 2.9 : 4.5);
      field.rest[k + 2] = layer === 1 ? normal() * 0.9 : -1.5 - random() * 1.5;
    }
    field.side[i] = Math.floor(i / 4) % 2 ? 1 : -1;
    field.source[k] = normal() * 0.62;
    field.source[k + 1] = normal() * 0.72;
    field.source[k + 2] = normal() * 0.85;
    field.noiseSeed[i] = random() * Math.PI * 2;
    // Most samples are faint; brightness is not uniform random noise.
    const luminance = random() ** 2.8;
    field.opacity[i] =
      role === 1
        ? 0.45 + luminance * 0.31
        : role === 3
          ? 0.46 + luminance * 0.38
          : layer === 0
            ? 0.42 + luminance * 0.25
            : layer === 1
              ? 0.075 + luminance * 0.15
              : 0.045 + luminance * 0.09;
    hotspot[i] =
      random() +
      (role === 3 ? 0.85 : role === 1 ? 0.2 : role === 2 ? -0.25 : 0);
    field.depth[i] = field.rest[k + 2];
    field.trail[i] =
      (role === 1 && i % 4 === 0) || (role === 3 && i % 3 === 0) ? 1 : 0;
  }
  // Exact size budgets retain the long tail without favouring the loop poles.
  // Radii: diameters 0.7–1.4 / 1.4–2.3 / 2.3–3.5 / 3.5–5 / 5–8 CSS px.
  sizeOrder.sort((a, b) => hotspot[a] - hotspot[b]);
  const small = Math.round(count * 0.55);
  const medium = small + Math.round(count * 0.25);
  const bright = medium + Math.round(count * 0.12);
  const stars = bright + Math.round(count * 0.06);
  for (let rank = 0; rank < count; rank++) {
    const i = sizeOrder[rank];
    const bin =
      rank < small
        ? 0
        : rank < medium
          ? 1
          : rank < bright
            ? 2
            : rank < stars
              ? 3
              : 4;
    field.sizeClass[i] = bin;
    field.size[i] =
      bin === 0
        ? 0.35 + random() * 0.35
        : bin === 1
          ? 0.7 + random() * 0.45
          : bin === 2
            ? 1.15 + random() * 0.6
            : bin === 3
              ? 1.75 + random() * 0.75
              : 2.5 + random() * 1.5;
    field.optical[i] =
      bin === 4 || (bin === 3 && i % 2 === 0)
        ? 2
        : bin >= 2 || (bin === 1 && i % 3 === 0)
          ? 1
          : 0;
    if (bin >= 3)
      field.opacity[i] = Math.max(
        field.opacity[i],
        0.48 + random() ** 2 * 0.35,
      );
  }
  // Reuse the rarest existing stars. No added particles, size changes or forces.
  for (
    let rank = count - Math.round(count * FIELD_BEACON_RATIO);
    rank < count;
    rank++
  )
    field.beacon[sizeOrder[rank]] = 1;
  // Distribute EACH optical tier around each loop. A random sample can leave
  // entire phone-sized sectors with only invisible dust; these jittered strata
  // guarantee initial coverage while independent speeds keep the field organic.
  // This is setup-only: no sorting, allocation or reseeding in the frame loop.
  for (const role of [0, 1, 3]) {
    for (let loop = 0; loop < FIELD_LOOPS.length; loop++) {
      const lane = FIELD_LOOPS[loop];
      for (let sizeClass = 0; sizeClass < 5; sizeClass++) {
        const members = sizeOrder.filter(
          (i) =>
            field.role[i] === role &&
            field.loop[i] === loop &&
            field.sizeClass[i] === sizeClass,
        );
        const offset = random();
        for (let rank = 0; rank < members.length; rank++) {
          const i = members[rank],
            k = i * 3;
          const phase =
            ((rank + 0.2 + random() * 0.6) / members.length + offset) * TAU;
          const angle = fieldOrbitAngle(loop, phase);
          field.orbitPhase[i] = phase;
          field.rest[k] =
            lane.x + Math.cos(angle) * (lane.rx + field.orbitWidth[i]);
          field.rest[k + 1] =
            lane.y + Math.sin(angle) * (lane.ry + field.orbitWidth[i]);
        }
      }
    }
  }
  // A spatial zone, not independent random paint. Sparse membership is capped;
  // its warmth fades as the particle advects outside the champagne region.
  const accentOrder = sizeOrder.filter(
    (i) => field.layer[i] === 0 && field.sizeClass[i] < 4,
  );
  const zone = (i: number) =>
    champagneZone(
      field.rest[i * 3],
      field.rest[i * 3 + 1],
      field.rest[i * 3 + 2],
    );
  accentOrder.sort((a, b) => zone(b) - zone(a));
  for (let i = 0; i < Math.round(count * 0.02); i++)
    field.accent[accentOrder[i]] = 1;
  // Independent deterministic hashes: never advance the existing optical RNG.
  const hash = (n: number) => {
    let value = Math.imul(n ^ 802026, 0x45d9f3b);
    value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
    return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
  };
  for (let i = 0; i < count; i++) {
    field.sideSeed[i * 3] = hash(i * 3 + 1);
    field.sideSeed[i * 3 + 1] = hash(i * 3 + 2) * 2 - 1;
    field.sideSeed[i * 3 + 2] = hash(i * 3 + 3) * 2 - 1;
  }
  updateFieldColors(field, 0, true);
  setFieldTargets(field, 0, 0, { sourceX: 2.65, sourceY: 0 }, 0);
  initializeField(field);
  return field;
}

/** Only attractors are choreographed. Actual positions are always integrated. */
export function setFieldTargets(
  field: ParticleField,
  time: number,
  progress: number,
  layout: FieldLayout,
  dissolve: number,
) {
  time = bounded(time, 0, 1e8, 0);
  const merge = smoothProgress((progress - 0.28) / 0.28);
  const form = smoothProgress((progress - 0.56) / 0.27);
  const disperse = smoothProgress(dissolve);
  field.flowMix = smoothProgress((progress - 0.78) / 0.16) * (1 - disperse);
  for (let i = 0; i < field.count; i++) {
    const k = i * 3;
    const phase = field.noiseSeed[i];
    const side = field.side[i];
    const layer = field.layer[i];
    const angle = phase + time * (0.2 + (i % 11) * 0.009) * side;
    const localX = field.source[k];
    const localY = field.source[k + 1];
    const sourceX =
      side * layout.sourceX +
      localX * Math.cos(time * 0.18) -
      localY * Math.sin(time * 0.18) * 0.3;
    const sourceY =
      layout.sourceY + localY + Math.sin(time * 0.3 + phase) * 0.07;
    const sourceZ = field.source[k + 2];
    // Both sides interleave through a shared, counter-rotating central volume.
    const radius = 0.42 + ((i % 29) / 29) * 1.03;
    const mergeX = Math.cos(angle) * radius;
    const mergeY = Math.sin(angle) * radius * 0.7;
    const mergeZ = Math.sin(angle * 0.7 + side) * 0.6;
    const mixedX = sourceX * (1 - merge) + mergeX * merge;
    const mixedY = sourceY * (1 - merge) + mergeY * merge;
    const mixedZ = sourceZ * (1 - merge) + mergeZ * merge;
    let restX =
      field.rest[k] +
      (layer > 0
        ? Math.sin(time * 0.16 + phase) * (layer === 1 ? 0.2 : 0.12)
        : 0);
    let restY =
      field.rest[k + 1] +
      (layer > 0
        ? Math.cos(time * 0.12 + phase) * (layer === 1 ? 0.17 : 0.1)
        : 0);
    let restZ =
      field.rest[k + 2] +
      Math.sin(time * 0.23 + phase) * FIELD_ROLE_RESPONSE[field.role[i]].depth;
    if (layer === 0) {
      const lane = FIELD_LOOPS[field.loop[i]];
      // Move attractors inside fixed digit volumes, never rotate a digit/group.
      // Analytic phase modulation has no seam/reset and never reverses a lane.
      const arcPhase =
        field.orbitPhase[i] +
        time * field.orbitSpeed[i] +
        (Math.sin(time * 0.41 + phase) - Math.sin(phase)) * 0.09;
      const orbit = fieldOrbitAngle(field.loop[i], arcPhase);
      const width = field.orbitWidth[i] + Math.sin(time * 0.33 + phase) * 0.016;
      restX = lane.x + Math.cos(orbit) * (lane.rx + width);
      restY = lane.y + Math.sin(orbit) * (lane.ry + width);
      restZ +=
        Math.sin(orbit + phase) * FIELD_ROLE_RESPONSE[field.role[i]].depth;
    }
    // Distant dust exists throughout, independently of either institution.
    field.targetPosition[k] =
      (layer === 2 ? restX : mixedX * (1 - form) + restX * form) +
      Math.cos(phase) * disperse * 1.8;
    field.targetPosition[k + 1] =
      (layer === 2 ? restY : mixedY * (1 - form) + restY * form) +
      Math.sin(phase) * disperse;
    field.targetPosition[k + 2] =
      (layer === 2 ? restZ : mixedZ * (1 - form) + restZ * form) -
      disperse * 0.7;
  }
  updateFieldColors(field, time, form < 0.95);
}

/** For setup/static accessibility only. Never called for an animated frame. */
export function initializeField(field: ParticleField) {
  field.position.set(field.targetPosition);
  if (field.spreadMix > 0) for (let i = 0; i < field.position.length; i++) {
    field.position[i] += (field.sideTarget[i] - field.position[i]) * field.spreadMix;
  }
  field.velocity.fill(0);
  for (let i = 0; i < field.count; i++)
    field.depth[i] = field.position[i * 3 + 2];
}

/**
 * During formation: the existing spring choreography.
 * Once living: a normal spring to the orbit TUBE plus tangential propulsion.
 * No tangential phase-restoring term: a pushed particle joins wherever it lands.
 * Semi-implicit 120 Hz substeps, no allocations in either integration loop.
 */
export function integrateField(
  field: ParticleField,
  delta: number,
  time: number,
  pointer: FieldPointer,
  config: FieldConfig,
) {
  time = bounded(time, 0, 1e8, 0);
  const elapsed = bounded(delta, 0, 0.075, 0);
  const steps = Math.ceil(elapsed * 120);
  if (!steps) return;
  const dt = elapsed / steps;
  const spring = bounded(config.springStrength, 3, 40, 13);
  const damping = bounded(config.damping, 1.5, 14, 4.8);
  const noise = bounded(config.noiseStrength, 0, 0.6, 0.16);
  const pointerStrength =
    bounded(config.pointerForce, 0, 12, 5.5) *
    bounded(pointer.strength, 0, 1, 0);
  const pointerX = bounded(pointer.x, -20, 20, 0),
    pointerY = bounded(pointer.y, -20, 20, 0);
  for (let step = 0; step < steps; step++) {
    for (let i = 0; i < field.count; i++) {
      const k = i * 3;
      const x = field.position[k],
        y = field.position[k + 1],
        z = field.position[k + 2];
      const perspective = 6.5 / (6.5 - bounded(z, -2.5, 2.5, 0));
      const dx = x * perspective - pointerX,
        dy = y * perspective - pointerY;
      const distance = Math.hypot(dx, dy);
      const influence = Math.max(0, 1 - distance / FIELD_POINTER_RADIUS);
      const force = (influence ** 2 * pointerStrength) / perspective;
      const seed = field.noiseSeed[i];
      const directionX = distance > 1e-4 ? dx / distance : Math.cos(seed);
      const directionY = distance > 1e-4 ? dy / distance : Math.sin(seed);
      const response = FIELD_ROLE_RESPONSE[field.role[i]];
      const layerScale = response.spring;
      const localSpring = spring * layerScale;
      const localDamping = damping * Math.sqrt(layerScale) * response.drag;
      const drag = Math.exp(-localDamping * dt);
      const t = time * (0.31 + (i % 7) * 0.013) + seed;
      // Each component varies across the other axes: smooth rotational drift,
      // no frame-random impulses or synchronized wobble of the whole symbol.
      const nx = Math.sin(y * 1.1 + t) - Math.cos(z * 0.8 - t * 0.7);
      const ny = Math.sin(z * 0.9 + t * 0.8) - Math.cos(x * 1.2 + t);
      const nz = Math.sin(x * 0.7 - t) - Math.cos(y * 0.8 + t * 0.9);
      const blend = field.layer[i] === 0 ? field.flowMix : 0;
      let flowX = 0,
        flowY = 0;
      if (blend > 0) {
        const lane = FIELD_LOOPS[field.loop[i]];
        const width =
          field.orbitWidth[i] + Math.sin(time * 0.33 + seed) * 0.016;
        const rx = Math.max(0.15, lane.rx + width),
          ry = Math.max(0.15, lane.ry + width);
        const ex = (x - lane.x) / rx,
          ey = (y - lane.y) / ry;
        const radius = Math.hypot(ex, ey);
        // Only the degenerate ellipse centre uses a seed direction.
        const cos =
          radius > 1e-5
            ? ex / radius
            : Math.cos(fieldOrbitAngle(field.loop[i], field.orbitPhase[i]));
        const sin =
          radius > 1e-5
            ? ey / radius
            : Math.sin(fieldOrbitAngle(field.loop[i], field.orbitPhase[i]));
        const gx = cos / rx,
          gy = sin / ry;
        const gradientLength = Math.hypot(gx, gy);
        const normalX = gx / gradientLength,
          normalY = gy / gradientLength;
        const error =
          (lane.x + rx * cos - x) * normalX + (lane.y + ry * sin - y) * normalY;
        // 8 has a little more local texture; 0 stays noticeably smoother.
        const variation = field.loop[i] === 2 ? 0.055 : 0.12;
        const omega =
          (field.orbitSpeed[i] *
            (1 + Math.sin(t * 0.7 + sin * 1.4) * variation) *
            LOOP_ARCS[field.loop[i]].meanRadius) /
          Math.hypot(lane.rx * sin, lane.ry * cos);
        // Drag compensation supplies steady tangential flow, not position lerp.
        // Centripetal feed-forward avoids ballooning the faster circulation lanes.
        flowX =
          localSpring * error * normalX -
          localDamping * rx * sin * omega -
          rx * cos * omega * omega;
        flowY =
          localSpring * error * normalY +
          localDamping * ry * cos * omega -
          ry * sin * omega * omega;
      }
      for (let axis = 0; axis < 3; axis++) {
        const index = k + axis;
        const push =
          force *
          (axis === 0 ? directionX : axis === 1 ? directionY : 0) *
          response.pointer;
        const procedural =
          (axis === 0 ? nx : axis === 1 ? ny : nz) * noise * response.noise;
        const restoring =
          localSpring * (field.targetPosition[index] - field.position[index]);
        const digitAcceleration =
          (axis === 2
            ? restoring
            : restoring * (1 - blend) + (axis === 0 ? flowX : flowY) * blend);
        // Complementary weights: two full-strength springs never fight. Pointer,
        // noise, drag, inertia and the existing velocity cap are applied ONCE.
        const layoutAcceleration = field.spreadMix > 0
          ? digitAcceleration * (1 - field.spreadMix) +
            localSpring * (field.sideTarget[index] - field.position[index]) * field.spreadMix
          : digitAcceleration;
        const acceleration = layoutAcceleration +
          push +
          procedural * (1 + bounded(z * 0.15, -0.2, 0.2, 0));
        field.velocity[index] =
          (field.velocity[index] + acceleration * dt) * drag;
      }
      const speed = Math.hypot(
        field.velocity[k],
        field.velocity[k + 1],
        field.velocity[k + 2],
      );
      const cap = speed > 3.2 ? 3.2 / speed : 1;
      for (let axis = 0; axis < 3; axis++) {
        field.velocity[k + axis] *= cap;
        field.position[k + axis] += field.velocity[k + axis] * dt;
      }
      field.depth[i] = field.position[k + 2];
    }
  }
}

export function fieldPoint(
  field: ParticleField,
  index: number,
  progress: number,
  dissolve: number,
  out: SpatialPoint,
) {
  const k = index * 3;
  out.x = field.position[k];
  out.y = field.position[k + 1];
  out.z = field.position[k + 2];
  out.nx = out.ny = 0;
  out.size = field.size[index];
  const emergence = smoothProgress(
    (progress - 0.065 - (index % 23) * 0.002) / 0.16,
  );
  const visible =
    field.layer[index] === 2
      ? 1
      : index % 9 === 0
        ? 0.3 + emergence * 0.7
        : emergence;
  out.opacity = field.opacity[index] * visible * (1 - smoothProgress(dissolve));
  return out;
}

/** Fixed camera: typography and the pointer field share a stable projection. */
export function projectField(
  point: SpatialPoint,
  time: number,
  intensity: number,
  twinkle: boolean,
  out: ProjectedPoint,
  shimmer = 0.13,
) {
  const depth = bounded(point.z, -2.5, 2.5, 0);
  const perspective = 6.5 / (6.5 - depth);
  const breath = twinkle
    ? 1 -
      shimmer +
      shimmer *
        (Math.sin(time * 0.57 + point.x * 2.4 + point.z) * 0.82 +
          Math.sin(time * 1.73 + point.y * 4.1 - point.z) * 0.18)
    : 1;
  out.x = point.x * perspective;
  out.y = point.y * perspective;
  out.size = point.size * perspective;
  out.opacity = bounded(
    point.opacity *
      bounded(0.86 + depth * 0.18, 0.35, 1, 0.86) *
      breath *
      intensity,
    0,
    1,
    0,
  );
  return out;
}
