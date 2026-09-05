import {
  bounded,
  smoothProgress,
  type SpatialPoint,
  type ProjectedPoint,
} from './particle80';

/** Physical field coordinates are independent of the Canvas resolution. */
export const FIELD_DEFAULTS = {
  particleCount: 1400,
  mobileCount: 360,
  maxParticles: 2200,
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
export type ParticleField = {
  count: number;
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
  /** 0: structure (70%), 1: ambient (20%), 2: distant dust (10%). */
  layer: Uint8Array;
  trail: Uint8Array;
};

export function fieldBudget(requested: number, low: boolean) {
  return Math.round(
    bounded(requested, 180, low ? 360 : 2200, low ? 360 : 1400),
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

/** Seeded volumetric samples, not equally spaced points travelling an outline. */
export function createParticleField(count: number): ParticleField {
  let seed = 802026;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const normal = () => random() + random() + random() + random() - 2;
  const field: ParticleField = {
    count,
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
    layer: new Uint8Array(count),
    trail: new Uint8Array(count),
  };
  const structures = Math.round(count * 0.7);
  const ambient = Math.round(count * 0.2);
  for (let i = 0; i < count; i++) {
    const k = i * 3;
    const layer = i < structures ? 0 : i < structures + ambient ? 1 : 2;
    field.layer[i] = layer;
    const angle = random() * Math.PI * 2;
    // Filled 3D annular volumes: uneven density across their thickness and depth.
    const thickness = normal() * 0.19;
    if (layer === 0) {
      if (i % 10 < 5) {
        const upper = i % 2 === 0;
        field.rest[k] =
          -0.87 + Math.cos(angle) * ((upper ? 0.49 : 0.55) + thickness);
        field.rest[k + 1] =
          (upper ? -0.53 : 0.52) +
          Math.sin(angle) * ((upper ? 0.49 : 0.54) + thickness);
      } else {
        field.rest[k] = 0.87 + Math.cos(angle) * (0.58 + thickness);
        field.rest[k + 1] = Math.sin(angle) * (1.08 + thickness);
      }
      field.rest[k + 2] = normal() * 0.38;
    } else {
      field.rest[k] = (random() - 0.5) * (layer === 1 ? 4.8 : 8.6);
      field.rest[k + 1] = (random() - 0.5) * (layer === 1 ? 2.9 : 4.5);
      field.rest[k + 2] = layer === 1 ? normal() * 0.9 : -1.5 - random() * 1.5;
    }
    field.side[i] = i % 2 ? 1 : -1;
    field.source[k] = normal() * 0.62;
    field.source[k + 1] = normal() * 0.72;
    field.source[k + 2] = normal() * 0.85;
    field.noiseSeed[i] = random() * Math.PI * 2;
    field.size[i] =
      layer === 2 ? 0.35 + random() * 0.45 : 0.45 + random() ** 3 * 1.45;
    field.opacity[i] =
      layer === 0
        ? 0.22 + random() * 0.54
        : layer === 1
          ? 0.08 + random() * 0.2
          : 0.055 + random() * 0.1;
    if (i % 71 === 0) {
      field.size[i] *= 1.15;
      field.opacity[i] *= 1.25;
    }
    field.depth[i] = field.rest[k + 2];
    field.trail[i] = layer !== 2 && i % 17 === 0 ? 1 : 0;
  }
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
    const restX =
      field.rest[k] + (layer === 1 ? Math.sin(time * 0.16 + phase) * 0.16 : 0);
    const restY =
      field.rest[k + 1] +
      (layer === 1 ? Math.cos(time * 0.12 + phase) * 0.14 : 0);
    const restZ = field.rest[k + 2];
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
}

/** For setup/static accessibility only. Never called for an animated frame. */
export function initializeField(field: ParticleField) {
  field.position.set(field.targetPosition);
  field.velocity.fill(0);
  for (let i = 0; i < field.count; i++)
    field.depth[i] = field.position[i * 3 + 2];
}

/** Spring + soft pointer field + divergence-free procedural curl force. */
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
      const influence = Math.max(0, 1 - distance / 0.65);
      const force = (influence ** 2 * pointerStrength) / perspective;
      const seed = field.noiseSeed[i];
      const directionX = distance > 1e-4 ? dx / distance : Math.cos(seed);
      const directionY = distance > 1e-4 ? dy / distance : Math.sin(seed);
      const layerScale =
        field.layer[i] === 2 ? 0.25 : field.layer[i] === 1 ? 0.65 : 1;
      const localSpring = spring * layerScale;
      const drag = Math.exp(-damping * Math.sqrt(layerScale) * dt);
      const t = time * (0.31 + (i % 7) * 0.013) + seed;
      // Each component varies across the other axes: smooth rotational drift,
      // no frame-random impulses or synchronized wobble of the whole symbol.
      const nx = Math.sin(y * 1.1 + t) - Math.cos(z * 0.8 - t * 0.7);
      const ny = Math.sin(z * 0.9 + t * 0.8) - Math.cos(x * 1.2 + t);
      const nz = Math.sin(x * 0.7 - t) - Math.cos(y * 0.8 + t * 0.9);
      for (let axis = 0; axis < 3; axis++) {
        const index = k + axis;
        const push =
          force *
          (axis === 0 ? directionX : axis === 1 ? directionY : 0) *
          (field.layer[i] === 2 ? 0.2 : 1);
        const procedural = (axis === 0 ? nx : axis === 1 ? ny : nz) * noise;
        const acceleration =
          localSpring * (field.targetPosition[index] - field.position[index]) +
          push +
          procedural;
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
    ? 1 - shimmer + shimmer * Math.sin(time * 0.57 + point.x * 2.4 + point.z)
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
