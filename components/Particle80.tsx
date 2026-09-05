'use client';

import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { useScenePreferences } from '@/hooks/use-scene-preferences';
import {
  bounded,
  smoothProgress,
  PARTICLE_80_DEFAULTS as DEFAULTS,
  stepMotionClock,
  type MotionClock,
  type SpatialPoint,
} from '@/lib/particle80';
import styles from './Particle80.module.css';
import {
  createParticleField,
  setFieldTargets,
  initializeField,
  integrateField,
  updateFieldColors,
  fieldPoint,
  fieldProgress,
  fieldPhase,
  fieldBudget,
  FIELD_DEFAULTS,
  FIELD_PALETTE,
  FIELD_ACCENT_START,
  FIELD_ROLE_RATIOS,
  FIELD_OPTICS,
  FIELD_BEACON_RATIO,
  type FieldPhase,
  projectField as projectSpatial,
} from '@/lib/particle80-field';
import { createFieldDebug, type FieldDebugMode } from '@/lib/particle80-debug';

export type Particle80State = {
  phase?: FieldPhase;
  introStarted: boolean;
  formationProgress: number;
  settled: boolean;
  interactionEnabled: boolean;
};

/** Render-only review presets: no palette, geometry, timing or physics changes. */
export const PARTICLE_80_BRIGHTNESS = {
  baseline: { anchor: 1, runner: 1, ambient: 1 },
  A: { anchor: 1.18, runner: 1.24, ambient: 1 },
  B: { anchor: 1.72, runner: 1.92, ambient: 1 },
} as const;
export type Particle80Brightness = keyof typeof PARTICLE_80_BRIGHTNESS;

function brightnessGain(
  preset: Particle80Brightness,
  role: number,
  sizeClass: number,
  color: number,
) {
  const settings = PARTICLE_80_BRIGHTNESS[preset];
  if (role === 2) return settings.ambient;
  const gain = role === 1 ? settings.runner : settings.anchor;
  // Keep rare stars and champagne highlights from turning into white hotspots.
  return Math.min(
    gain,
    color >= FIELD_ACCENT_START ? 1.3 : sizeClass >= 3 ? 1.6 : gain,
  );
}

export type Particle80Props = {
  /** Render-only A/B review; the reusable motif retains its baseline by default. */
  brightnessPreset?: Particle80Brightness;
  /** Display-only composition magnification; preserves world-space physics. */
  viewScale?: number;
  /** Development only. Production builds remove diagnostics and telemetry. */
  debug?: FieldDebugMode;
  /** False unmounts the entire renderer, observers and animation loop. */
  enabled?: boolean;
  /** False freezes the motif, preserving its last phase. */
  active?: boolean;
  /** System reduced-motion is always respected, including live changes. */
  motion?: 'auto' | 'still';
  quality?: 'auto' | 'low';
  particleCount?: number;
  /** @deprecated Fixed 50/25/18/7 structure / flow / ambient / highlight budgets. */
  ambientParticleRatio?: number;
  pointerForce?: number;
  mouseForce?: number;
  noiseStrength?: number;
  glowIntensity?: number;
  formationDuration?: number;
  springStrength?: number;
  damping?: number;
  twinkleIntensity?: number;
  trailLength?: number;
  introEnabled?: boolean;
  introDuration?: number;
  interactive?: boolean;
  reducedMotionMode?: 'system' | 'static';
  lowPowerMode?: 'auto' | 'on';
  onStateChange?: (state: Particle80State) => void;
  /** 0 freezes the current phase; 1 is natural speed. Clamped 0–2. */
  speed?: number;
  /** 0 = scattered cloud, 1 = formed 80. Omit for the automatic formation. */
  formationProgress?: number;
  /** 0 = visible identity, 1 = dispersed and fully transparent. */
  dissolveProgress?: number;
  /** Multiplies cores, halos and trails together. Clamped 0–1.5. */
  intensity?: number;
  /** Soft sprite halos, not bloom. Clamped 0–1. */
  glow?: number;
  twinkle?: boolean;
  trails?: boolean;
  background?: 'transparent' | 'dark';
  className?: string;
  style?: CSSProperties;
  /** Omit for decoration; supply when the visual itself needs an accessible name. */
  label?: string;
};

const fallbackField = createParticleField(FIELD_DEFAULTS.mobileCount);
const spatialPoint = (): SpatialPoint => ({
  x: 0,
  y: 0,
  z: 0,
  nx: 0,
  ny: 0,
  size: 0,
  opacity: 0,
});
function fallbackPoints(formation: number) {
  setFieldTargets(
    fallbackField,
    0,
    formation,
    { sourceX: 2.65, sourceY: 0 },
    0,
  );
  initializeField(fallbackField);
  updateFieldColors(fallbackField, 0);
  const point = spatialPoint();
  return Array.from({ length: fallbackField.count }, (_, i) => ({
    ...projectSpatial(
      fieldPoint(fallbackField, i, formation, 0, point),
      0,
      1,
      false,
      { x: 0, y: 0, size: 0, opacity: 0 },
    ),
    color: fallbackField.color[i],
  }));
}
const stillPoints = fallbackPoints(1);

function get2dContext(surface: HTMLCanvasElement) {
  try {
    return surface.getContext('2d');
  } catch {
    // A restricted or unavailable graphics context still has the inline SVG.
    return null;
  }
}

const Static80 = memo(function Static80({
  initialFormation,
  brightnessPreset,
  viewScale,
}: {
  initialFormation: number;
  brightnessPreset: Particle80Brightness;
  viewScale: number;
}) {
  const initialPoints = useMemo(
    () => fallbackPoints(initialFormation),
    [initialFormation],
  );
  const circles = (points: typeof stillPoints) =>
    points.map((point, i) => (
      <circle
        key={i}
        cx={Number((point.x * viewScale).toFixed(6))}
        cy={Number((point.y * viewScale).toFixed(6))}
        r={Number((point.size * 0.0065).toFixed(6))}
        fill={FIELD_PALETTE[point.color]}
        opacity={Number(
          Math.min(
            1,
            point.opacity *
              brightnessGain(
                brightnessPreset,
                fallbackField.role[i],
                fallbackField.sizeClass[i],
                point.color,
              ),
          ).toFixed(5),
        )}
      />
    ));
  return (
    <svg
      className={`${styles.surface} ${styles.fallback}`}
      viewBox="-4.2 -2.3 8.4 4.6"
      aria-hidden="true"
      fill="none"
    >
      <g className={styles.initialCloud}>{circles(initialPoints)}</g>
      <g className={styles.formedFallback}>{circles(stillPoints)}</g>
    </svg>
  );
});

function Particle80Surface({
  brightnessPreset = 'baseline',
  viewScale = 1,
  debug = 'off',
  active = true,
  motion = 'auto',
  quality = 'auto',
  particleCount = FIELD_DEFAULTS.particleCount,
  pointerForce,
  mouseForce = FIELD_DEFAULTS.mouseForce,
  noiseStrength = FIELD_DEFAULTS.noiseStrength,
  glowIntensity,
  formationDuration,
  springStrength = FIELD_DEFAULTS.springStrength,
  damping = FIELD_DEFAULTS.damping,
  twinkleIntensity = 0.13,
  trailLength = 7,
  introEnabled = true,
  introDuration = FIELD_DEFAULTS.formationDuration,
  interactive = false,
  reducedMotionMode = 'system',
  lowPowerMode = 'auto',
  onStateChange,
  speed = DEFAULTS.speed,
  formationProgress,
  dissolveProgress = 0,
  intensity = DEFAULTS.intensity,
  glow = DEFAULTS.glow,
  twinkle = true,
  trails = true,
  background = 'transparent',
  className = '',
  style,
  label,
}: Omit<Particle80Props, 'enabled'>) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);
  const { lowPower, reducedMotion, pageVisible } = useScenePreferences();
  const low = lowPower || quality === 'low' || lowPowerMode === 'on';
  const count = fieldBudget(particleCount, low);
  const rate = bounded(speed, 0, 2, DEFAULTS.speed);
  const magnification = bounded(viewScale, 0.8, 1.6, 1);
  const halo = bounded(
    glowIntensity ?? glow,
    0,
    1,
    FIELD_DEFAULTS.glowIntensity,
  );
  const strength = bounded(intensity, 0, 1.5, DEFAULTS.intensity);
  const dissolve = bounded(dissolveProgress, 0, 1, 0);
  const formation =
    formationProgress === undefined
      ? undefined
      : bounded(formationProgress, 0, 1, 0);
  const staticMotion =
    reducedMotion || motion === 'still' || reducedMotionMode === 'static';
  const duration = bounded(
    formationDuration ?? introDuration,
    0.5,
    16,
    FIELD_DEFAULTS.formationDuration,
  );
  const force =
    bounded(pointerForce ?? mouseForce, 0, 12, FIELD_DEFAULTS.mouseForce) *
    (low ? 0.6 : 1);
  const spring = bounded(springStrength, 3, 40, FIELD_DEFAULTS.springStrength);
  const friction = bounded(damping, 1.5, 14, FIELD_DEFAULTS.damping);
  const noise = bounded(noiseStrength, 0, 0.6, FIELD_DEFAULTS.noiseStrength);
  const shimmer = bounded(twinkleIntensity, 0, 0.3, 0.13);
  const tailLength = bounded(trailLength, 0, 12, 7);
  const [initialFormation] = useState(() =>
    fieldProgress(
      0,
      formation,
      motion === 'still' || reducedMotionMode === 'static' || !introEnabled,
      duration,
    ),
  );
  const callback = useRef(onStateChange);
  const debugMode = process.env.NODE_ENV === 'development' ? debug : 'off';
  const lastReported = useRef<Particle80State | null>(null);
  useEffect(() => {
    callback.current = onStateChange;
  }, [onStateChange]);
  const playback = useRef({
    brightnessPreset,
    active,
    pageVisible,
    staticMotion,
    rate,
    halo,
    formation,
    dissolve,
    strength,
    twinkle,
    trails,
    duration,
    introEnabled,
    interactive,
    pointerForce: force,
    springStrength: spring,
    damping: friction,
    noiseStrength: noise,
    shimmer,
    tailLength,
  });
  const syncPlayback = useRef<((resetTiming?: boolean) => void) | null>(null);

  useEffect(() => {
    const previous = playback.current;
    const resetTiming =
      previous.active !== active ||
      previous.pageVisible !== pageVisible ||
      previous.staticMotion !== staticMotion ||
      (previous.rate === 0) !== (rate === 0);
    playback.current = {
      brightnessPreset,
      active,
      pageVisible,
      staticMotion,
      rate,
      halo,
      formation,
      dissolve,
      strength,
      twinkle,
      trails,
      duration,
      introEnabled,
      interactive,
      pointerForce: force,
      springStrength: spring,
      damping: friction,
      noiseStrength: noise,
      shimmer,
      tailLength,
    };
    syncPlayback.current?.(resetTiming);
  }, [
    brightnessPreset,
    active,
    pageVisible,
    staticMotion,
    rate,
    halo,
    formation,
    dissolve,
    strength,
    twinkle,
    trails,
    duration,
    introEnabled,
    interactive,
    force,
    spring,
    friction,
    noise,
    shimmer,
    tailLength,
  ]);

  useEffect(() => {
    const element = host.current;
    const surface = canvas.current;
    if (!element || !surface) return;
    const context = get2dContext(surface);
    if (!context) {
      element.dataset.state = 'fallback';
      callback.current?.({
        phase: 'living',
        introStarted: true,
        formationProgress: 1,
        settled: true,
        interactionEnabled: false,
      });
      return;
    }
    const field = createParticleField(count);
    const diagnostics =
      process.env.NODE_ENV === 'development' && debugMode !== 'off'
        ? createFieldDebug(field, debugMode)
        : null;
    let initialized = false;
    const layout = { sourceX: 2.65, sourceY: 0 };
    const point = spatialPoint();
    const tail = spatialPoint();
    const projected = { x: 0, y: 0, size: 0, opacity: 0 };
    const projectedTail = { x: 0, y: 0, size: 0, opacity: 0 };
    const sprite = document.createElement('canvas');
    // Three optical rows: quiet dust, compact stars, rare soft sparks.
    // Cached once, no per-frame gradients, textures or color-string allocation.
    sprite.width = 48 * FIELD_PALETTE.length;
    sprite.height = 48 * 3;
    const spriteContext = get2dContext(sprite);
    if (spriteContext) {
      FIELD_PALETTE.forEach((color, index) => {
        const left = index * 48;
        for (let optical = 0; optical < 3; optical++) {
          const top = optical * 48;
          const gradient = spriteContext.createRadialGradient(
            left + 24,
            top + 24,
            0,
            left + 24,
            top + 24,
            24,
          );
          gradient.addColorStop(
            0,
            index >= FIELD_ACCENT_START ? '#fff0d6d9' : '#f5fbffd9',
          );
          // Raise local star radiance, not the background or a full-screen bloom.
          gradient.addColorStop(
            0.1,
            `${color}${optical === 2 ? 'b8' : optical === 1 ? '95' : '75'}`,
          );
          gradient.addColorStop(
            0.28,
            `${color}${optical === 2 ? '48' : optical === 1 ? '32' : '22'}`,
          );
          gradient.addColorStop(
            0.55,
            `${color}${optical === 2 ? '12' : optical === 1 ? '0a' : '05'}`,
          );
          gradient.addColorStop(1, `${color}00`);
          spriteContext.fillStyle = gradient;
          spriteContext.fillRect(left, top, 48, 48);
        }
      });
    }
    // Pre-baked point-spread functions: a continuous luminous core rather than
    // a filled LED disk. Three rows preserve dust / star / spark optical scales.
    // Halo is baked only when its setting changes. One atlas draw per particle
    // replaces thousands of arc/fill/halo calls at the larger particle budget.
    const emitters = document.createElement('canvas');
    const cell = 64;
    emitters.width = cell * FIELD_PALETTE.length;
    emitters.height = cell * 3;
    const emitterContext = get2dContext(emitters);
    let emitterHalo = -1;
    const bakeEmitters = (haloStrength: number) => {
      if (!emitterContext || emitterHalo === haloStrength) return;
      emitterHalo = haloStrength;
      emitterContext.clearRect(0, 0, emitters.width, emitters.height);
      FIELD_PALETTE.forEach((color, index) => {
        const core = index >= FIELD_ACCENT_START ? '#fff3df' : '#f7fcff';
        for (let optical = 0; optical < 3; optical++) {
          const cx = index * cell + cell / 2;
          const cy = optical * cell + cell / 2;
          const extent = optical === 0 ? 1.45 : optical === 1 ? 4 : 5.5;
          const coreRadius = cell / 2 / extent;
          if (optical > 0 && haloStrength > 0) {
            const glow = emitterContext.createRadialGradient(
              cx,
              cy,
              0,
              cx,
              cy,
              cell / 2,
            );
            glow.addColorStop(0, `${color}c0`);
            glow.addColorStop(0.12, `${color}8c`);
            glow.addColorStop(0.3, `${color}26`);
            glow.addColorStop(0.6, `${color}08`);
            glow.addColorStop(1, `${color}00`);
            emitterContext.globalAlpha = haloStrength;
            emitterContext.fillStyle = glow;
            emitterContext.fillRect(index * cell, optical * cell, cell, cell);
          }
          const body = emitterContext.createRadialGradient(
            cx,
            cy,
            0,
            cx,
            cy,
            coreRadius * 1.45,
          );
          body.addColorStop(0, optical === 0 ? color : core);
          body.addColorStop(0.14, optical === 0 ? `${color}dc` : `${core}ff`);
          body.addColorStop(0.34, `${color}be`);
          body.addColorStop(0.66, `${color}50`);
          body.addColorStop(1, `${color}00`);
          emitterContext.globalAlpha = 1;
          emitterContext.globalCompositeOperation = 'lighter';
          emitterContext.fillStyle = body;
          emitterContext.fillRect(index * cell, optical * cell, cell, cell);
          emitterContext.globalCompositeOperation = 'source-over';
        }
      });
    };
    let width = 0;
    let height = 0;
    let scale = 0;
    let pointScale = 1;
    let dpr = 1;
    let frame = 0;
    let inView = true;
    let disposed = false;
    let lost = false;
    let lastPhysicsTime = elapsed.current;
    const pointer = { x: 0, y: 0, strength: 0 };
    const pointerTarget = { x: 0, y: 0, active: false };
    const finePointer = window.matchMedia('(any-pointer: fine)');
    const clock: MotionClock = {
      time: elapsed.current,
      previous: null,
      remainder: 0,
    };
    const interval = 1000 / (low ? 30 : 60);
    const isAnimating = () =>
      playback.current.active &&
      playback.current.pageVisible &&
      document.visibilityState === 'visible' &&
      inView &&
      !playback.current.staticMotion &&
      playback.current.rate > 0 &&
      playback.current.strength > 0 &&
      playback.current.dissolve < 1 &&
      !lost &&
      width > 0 &&
      height > 0;
    const canInteract = () =>
      playback.current.interactive &&
      playback.current.pointerForce > 0 &&
      finePointer.matches &&
      isAnimating();
    const report = (progress: number) => {
      if (!callback.current || disposed) return;
      const interactionEnabled = canInteract();
      const quantized = progress >= 1 ? 1 : Math.floor(progress * 25) / 25;
      const previous = lastReported.current;
      if (
        previous?.phase === fieldPhase(progress) &&
        previous?.formationProgress === quantized &&
        previous.interactionEnabled === interactionEnabled
      )
        return;
      const state = {
        phase: fieldPhase(progress),
        introStarted: true,
        formationProgress: quantized,
        settled: progress >= 1,
        interactionEnabled,
      };
      lastReported.current = state;
      callback.current(state);
    };

    const drawFrame = () => {
      if (disposed || lost || width <= 0 || height <= 0) return;
      const drawStarted = diagnostics ? performance.now() : 0;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';
      const settings = playback.current;
      bakeEmitters(settings.halo);
      if (
        (settings.staticMotion || !settings.introEnabled) &&
        settings.formation === undefined
      ) {
        clock.time = Math.max(clock.time, settings.duration);
      }
      const time = clock.time;
      const delta = Math.min(0.075, Math.max(0, time - lastPhysicsTime));
      lastPhysicsTime = time;
      const interaction = canInteract();
      const pointerMix = 1 - Math.exp(-10 * delta);
      pointer.x += (pointerTarget.x - pointer.x) * pointerMix;
      pointer.y += (pointerTarget.y - pointer.y) * pointerMix;
      pointer.strength +=
        ((pointerTarget.active && interaction ? 1 : 0) - pointer.strength) *
        pointerMix;
      const progress = fieldProgress(
        time,
        settings.formation,
        settings.staticMotion || !settings.introEnabled,
        settings.duration,
      );
      setFieldTargets(field, time, progress, layout, settings.dissolve);
      if (!initialized || settings.staticMotion) {
        initializeField(field);
        initialized = true;
      } else {
        integrateField(field, delta, time, pointer, settings);
      }
      // Enlarge the composition, not individual light points or their halos.
      const size = pointScale;
      // Text itself is not scaled with the 80. Keep its protection region in
      // the original screen footprint instead of dimming enlarged digit edges.
      const maskMagnification = Math.min(
        magnification,
        width < 650 ? 1.3 : 1.6,
      );
      const labelHalfWidth = 0.85 / maskMagnification;
      const labelHalfHeight = 0.32 / maskMagnification;
      if (spriteContext) {
        const sourceEnergy =
          smoothProgress((progress - 0.06) / 0.16) *
          (1 - smoothProgress((progress - 0.3) / 0.3));
        for (let side = -1; side <= 1; side += 2) {
          context.globalAlpha =
            0.075 * sourceEnergy * settings.strength * (1 - settings.dissolve);
          context.drawImage(
            sprite,
            18 * 48,
            48,
            48,
            48,
            width / 2 + side * layout.sourceX * scale - scale,
            height / 2 + layout.sourceY * scale - scale * 0.65,
            scale * 2,
            scale * 1.3,
          );
        }
        context.globalAlpha =
          0.028 *
          smoothProgress((progress - 0.3) / 0.3) *
          settings.strength *
          (1 - settings.dissolve);
        context.drawImage(
          sprite,
          18 * 48,
          48,
          48,
          48,
          width / 2 - scale * 1.5,
          height / 2 - scale,
          scale * 3,
          scale * 2,
        );
      }
      let displacementEnergy = 0;
      for (let index = 0; index < count; index++) {
        const k = index * 3;
        fieldPoint(field, index, progress, settings.dissolve, point);
        // UI status only needs a representative sample, not 9,600 square roots.
        if (index % 8 === 0)
          displacementEnergy += Math.hypot(
            point.x - field.targetPosition[k],
            point.y - field.targetPosition[k + 1],
            point.z - field.targetPosition[k + 2],
          );
        projectSpatial(
          point,
          time + field.noiseSeed[index],
          settings.strength,
          settings.twinkle && !settings.staticMotion,
          projected,
          settings.shimmer,
        );
        const x = width / 2 + projected.x * scale;
        const y = height / 2 + projected.y * scale;
        // The field surrounds each origin label, but doesn't wash out its crisp type.
        const labelDx = Math.min(
          Math.abs(projected.x - layout.sourceX),
          Math.abs(projected.x + layout.sourceX),
        );
        const labelDy = Math.abs(projected.y - layout.sourceY);
        const labelMask =
          labelDx < labelHalfWidth && labelDy < labelHalfHeight ? 0.12 : 1;
        const alpha = Math.min(
          1,
          projected.opacity *
            labelMask *
            brightnessGain(
              settings.brightnessPreset,
              field.role[index],
              field.sizeClass[index],
              field.color[index],
            ),
        );
        if (alpha < 0.002) continue;
        // Keep subpixel dust readable on DPR1 phones without enlarging stars.
        // 0.35 px radius is the specified 0.7 px lower dust diameter.
        const radius =
          field.optical[index] === FIELD_OPTICS.dust
            ? Math.max(0.35, projected.size * size)
            : projected.size * size;
        const color = FIELD_PALETTE[field.color[index]];
        if (
          settings.trails &&
          settings.tailLength > 0 &&
          field.trail[index] &&
          !settings.staticMotion
        ) {
          context.lineWidth = 0.55 * size;
          context.strokeStyle = color;
          let endX = x,
            endY = y;
          for (let j = 1; j <= 3; j++) {
            tail.x = point.x - field.velocity[k] * j * 0.06;
            tail.y = point.y - field.velocity[k + 1] * j * 0.06;
            tail.z = point.z - field.velocity[k + 2] * j * 0.06;
            tail.size = point.size;
            tail.opacity = point.opacity;
            projectSpatial(tail, time, 1, false, projectedTail);
            const tailX = width / 2 + projectedTail.x * scale;
            const tailY = height / 2 + projectedTail.y * scale;
            if (Math.hypot(tailX - x, tailY - y) > settings.tailLength * size)
              break;
            context.globalAlpha = alpha * (4 - j) * 0.08;
            context.beginPath();
            context.moveTo(endX, endY);
            context.lineTo(tailX, tailY);
            context.stroke();
            endX = tailX;
            endY = tailY;
          }
        }
        const optical = field.optical[index];
        const beacon = field.beacon[index] === 1;
        // Slow independent glints, never strobes. Reduced motion has no pulse.
        const glint = beacon
          ? settings.twinkle && !settings.staticMotion
            ? Math.pow(
                0.5 +
                  0.5 *
                    Math.sin(
                      time * (0.52 + field.noiseSeed[index] * 0.018) +
                        field.noiseSeed[index] * 2.7,
                    ),
                8,
              )
            : 0.25
          : 0;
        const starAlpha = beacon
          ? Math.min(1, alpha * (1.7 + glint * 1.5))
          : alpha;
        if (beacon && settings.halo > 0 && spriteContext) {
          // Local, soft radiance on 0.5% of emitters, not screen-wide bloom.
          const aura = (12 + radius * (7 + glint * 5)) * size;
          context.globalAlpha = alpha * settings.halo * (0.48 + glint * 0.65);
          context.drawImage(
            sprite,
            field.color[index] * 48,
            96,
            48,
            48,
            x - aura,
            y - aura,
            aura * 2,
            aura * 2,
          );
        }
        if (emitterContext) {
          // Depth alters the PSF's focus, not the whole scene or camera.
          const defocus = 1 + Math.max(0, point.z - 0.25) * 0.18;
          const extent =
            radius * defocus * (optical === 0 ? 1.45 : optical === 1 ? 4 : 5.5);
          context.globalAlpha =
            (starAlpha * (beacon ? 1 : optical === 0 ? 0.9 : 0.84)) / defocus;
          context.drawImage(
            emitters,
            field.color[index] * cell,
            optical * cell,
            cell,
            cell,
            x - extent,
            y - extent,
            extent * 2,
            extent * 2,
          );
          // Only the rare beacons receive a tiny optical diffraction glint.
          // Slow rise/fall, no strobing; not attached to every star like an icon.
          if (beacon && settings.halo > 0 && glint > 0.08) {
            context.globalAlpha = starAlpha * glint * settings.halo * 0.22;
            context.fillStyle = color;
            const ray = radius * (2.5 + glint * 2);
            context.fillRect(x - ray, y - 0.3, ray * 2, 0.6);
            context.fillRect(x - 0.3, y - ray * 0.6, 0.6, ray * 1.2);
          }
        } else {
          // Preserve context failure behavior if only the cache cannot allocate.
          context.globalAlpha = alpha;
          context.fillStyle = color;
          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fill();
        }
      }
      context.globalAlpha = 1;
      context.globalCompositeOperation = 'source-over';
      diagnostics?.draw(
        context,
        pointer,
        width,
        height,
        scale,
        time,
        performance.now() - drawStarted,
      );
      if (element.dataset.canvas !== 'ready') element.dataset.canvas = 'ready';
      const energy = (displacementEnergy / Math.ceil(count / 8)).toFixed(4);
      if (element.dataset.displacement !== energy)
        element.dataset.displacement = energy;
      const pointerEnergy = pointer.strength.toFixed(2);
      if (element.dataset.pointerStrength !== pointerEnergy)
        element.dataset.pointerStrength = pointerEnergy;
      element.dataset.phase = fieldPhase(progress);
      report(progress);
    };
    const draw = () => {
      try {
        drawFrame();
      } catch {
        // Some browsers throw before emitting contextlost. Stop and reveal SVG.
        lost = true;
        cancelAnimationFrame(frame);
        frame = 0;
        delete element.dataset.canvas;
        element.dataset.state = 'fallback';
        if (playback.current.formation === undefined)
          clock.time = Math.max(clock.time, playback.current.duration);
        report(1);
      }
    };
    const tick = (now: number) => {
      frame = 0;
      if (!isAnimating() || disposed) return;
      if (stepMotionClock(clock, now, interval, playback.current.rate)) draw();
      if (isAnimating()) frame = requestAnimationFrame(tick);
    };
    const sync = (resetTiming = true) => {
      if (disposed) return;
      if (resetTiming || !isAnimating()) {
        cancelAnimationFrame(frame);
        frame = 0;
        clock.previous = null;
        clock.remainder = 0;
      }
      // Controlled progress may update every frame. Let the existing RAF paint
      // it without tearing down resources, resetting time, or doubling paints.
      if (!resetTiming && frame && isAnimating()) return;
      draw();
      element.dataset.state = lost
        ? 'fallback'
        : playback.current.staticMotion
          ? 'static'
          : isAnimating()
            ? 'animated'
            : 'paused';
      if (isAnimating() && !frame) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      if (disposed) return;
      const rect = element.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width <= 0 || height <= 0) {
        sync();
        return;
      }
      // Bound DPR AND backing dimensions even inside an unusually large parent.
      dpr = Math.min(
        window.devicePixelRatio || 1,
        low ? 1 : 1.5,
        1800 / width,
        1200 / height,
      );
      surface.width = Math.max(1, Math.round(width * dpr));
      surface.height = Math.max(1, Math.round(height * dpr));
      const compact = width < 650;
      const baseScale = Math.min(
        width / (compact ? 4.7 : FIELD_DEFAULTS.viewWidth),
        height / (compact ? 5.6 : FIELD_DEFAULTS.viewHeight),
      );
      // Desktop is 1.3x the previous 1.18 composition. Phones preserve both digits.
      scale = Math.min(magnification, compact ? 1.3 : 1.6) * baseScale;
      pointScale = bounded(baseScale / 170, 0.65, 1.25, 1);
      layout.sourceX = (width * (compact ? 0.245 : 0.315)) / scale;
      layout.sourceY = compact ? (80 - height / 2) / scale : 0;
      element.dataset.dpr = dpr.toFixed(2);
      element.dataset.particles = String(count);
      element.dataset.structures = String(
        Math.round(count * FIELD_ROLE_RATIOS[0]),
      );
      element.dataset.flows = String(Math.round(count * FIELD_ROLE_RATIOS[1]));
      element.dataset.ambient = String(
        Math.round(count * FIELD_ROLE_RATIOS[2]),
      );
      element.dataset.highlights = String(
        count -
          Math.round(count * FIELD_ROLE_RATIOS[0]) -
          Math.round(count * FIELD_ROLE_RATIOS[1]) -
          Math.round(count * FIELD_ROLE_RATIOS[2]),
      );
      element.dataset.accents = String(Math.round(count * 0.02));
      element.dataset.beacons = String(Math.round(count * FIELD_BEACON_RATIO));
      sync();
    };
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    const visibilityObserver =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              inView = entry.isIntersecting;
              sync();
            },
            { rootMargin: '40px' },
          )
        : null;
    const contextLost = (event: Event) => {
      if (disposed) return;
      event.preventDefault();
      lost = true;
      delete element.dataset.canvas;
      sync();
      if (playback.current.formation === undefined)
        clock.time = Math.max(clock.time, playback.current.duration);
      report(1);
    };
    const contextRestored = () => {
      lost = false;
      resize();
    };
    let resolutionQuery: MediaQueryList | null = null;
    const watchResolution = () => {
      resolutionQuery?.removeEventListener('change', resolutionChanged);
      resolutionQuery = window.matchMedia(
        `(resolution: ${window.devicePixelRatio || 1}dppx)`,
      );
      resolutionQuery.addEventListener('change', resolutionChanged);
    };
    const resolutionChanged = () => {
      if (disposed) return;
      watchResolution();
      resize();
    };
    const syncVisibility = () => sync();
    const pointerMove = (event: PointerEvent) => {
      if (!canInteract() || event.pointerType === 'touch' || scale <= 0) {
        pointerTarget.active = false;
        return;
      }
      const rect = element.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      pointerTarget.active = inside;
      if (inside) {
        pointerTarget.x = (event.clientX - rect.left - width / 2) / scale;
        pointerTarget.y = (event.clientY - rect.top - height / 2) / scale;
      }
    };
    const pointerLeave = () => {
      pointerTarget.active = false;
    };
    syncPlayback.current = sync;
    watchResolution();
    surface.addEventListener('contextlost', contextLost);
    surface.addEventListener('contextrestored', contextRestored);
    resizeObserver?.observe(element);
    visibilityObserver?.observe(element);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', syncVisibility);
    window.addEventListener('pointermove', pointerMove, { passive: true });
    window.addEventListener('pointerout', pointerLeave, { passive: true });
    window.addEventListener('blur', pointerLeave);
    finePointer.addEventListener('change', syncVisibility);
    resize();
    return () => {
      disposed = true;
      diagnostics?.dispose();
      syncPlayback.current = null;
      cancelAnimationFrame(frame);
      elapsed.current = clock.time;
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      resolutionQuery?.removeEventListener('change', resolutionChanged);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', syncVisibility);
      window.removeEventListener('pointermove', pointerMove);
      window.removeEventListener('pointerout', pointerLeave);
      window.removeEventListener('blur', pointerLeave);
      finePointer.removeEventListener('change', syncVisibility);
      surface.removeEventListener('contextlost', contextLost);
      surface.removeEventListener('contextrestored', contextRestored);
      delete element.dataset.canvas;
      // Release the backing store when disabled, removed or reconfigured.
      surface.width = 1;
      surface.height = 1;
      sprite.width = 1;
      sprite.height = 1;
      emitters.width = 1;
      emitters.height = 1;
    };
  }, [count, low, debugMode, magnification]);

  return (
    <div
      ref={host}
      className={`${styles.motif} ${className}`}
      style={
        {
          ...style,
          '--particle80-fallback-opacity':
            Math.min(1, strength) * (1 - smoothProgress(dissolve)),
        } as CSSProperties
      }
      data-background={background}
      data-brightness={brightnessPreset}
      data-view-scale={magnification}
      data-field-debug={debugMode === 'off' ? undefined : debugMode}
      data-quality={low ? 'low' : 'full'}
      data-static={staticMotion ? 'true' : 'false'}
      data-intro-duration={duration}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <Static80
        initialFormation={initialFormation}
        brightnessPreset={brightnessPreset}
        viewScale={magnification}
      />
      <canvas
        ref={canvas}
        className={`${styles.surface} ${styles.canvas}`}
        aria-hidden="true"
      />
    </div>
  );
}

export default function Particle80({
  enabled = true,
  ...props
}: Particle80Props) {
  return enabled ? <Particle80Surface {...props} /> : null;
}
