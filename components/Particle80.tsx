'use client';

import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
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
  fieldStarScale,
  type FieldPhase,
  projectField as projectSpatial,
} from '@/lib/particle80-field';
import { createFieldDebug, type FieldDebugMode } from '@/lib/particle80-debug';
import type { OpeningBridgeRef } from '@/lib/brand-opening';
import { createParticleHandoff } from '@/lib/particle80-handoff';
import { backgroundCanAnimate, pointerToField, PARTICLE_UI_SELECTOR, PARTICLE_STORY_DEFAULTS, type ParticleStoryRef } from '@/lib/particle-story';
import { particleProjection } from '@/lib/particle80-projection';
import { configureSideField, setSideFieldTargets, type SideFieldLayout } from '@/lib/particle80-story-field';

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
  // Local stellar emphasis only; ordinary particles keep their existing gain.
  const cap = color >= FIELD_ACCENT_START
    ? sizeClass >= 3 ? 1.65 : 1.3
    : sizeClass >= 3 ? 1.8 : gain;
  return Math.min(
    gain,
    cap,
  );
}

export type Particle80Props = {
  /** Page backdrops do not inherit an Intro/section visibility boundary. */
  visibilityScope?: 'element' | 'page';
  story?: ParticleStoryRef;
  pointerHost?: RefObject<HTMLElement | null>;
  /** Optional brand-opening choreography; never changes the field simulation. */
  opening?: OpeningBridgeRef;
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
let engineSequence = 0;
const liveEngines = new Set<number>();
const pendingFrames = new Set<number>();
const pointerBindings = new Set<number>();

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
        r={Number((point.size * 0.0065 * fieldStarScale(fallbackField.role[i], fallbackField.sizeClass[i], point.color)).toFixed(6))}
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
  opening,
  story,
  pointerHost,
  visibilityScope = 'element',
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
  const magnification = bounded(viewScale, 0.8, 1.8, 1);
  const halo = bounded(
    glowIntensity ?? glow,
    0,
    1,
    FIELD_DEFAULTS.glowIntensity,
  );
  const strength = bounded(intensity, 0, 1.5, DEFAULTS.intensity);
  // A page story never uses the legacy terminal dissolve, including its pause
  // and SVG opacity gates. Bare/legacy consumers retain the controlled prop.
  const dissolve = story ? 0 : bounded(dissolveProgress, 0, 1, 0);
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

  // The fallback has the same viewport/hero split even without a Canvas context.
  useEffect(() => {
    const element = host.current;
    if (!element || visibilityScope !== 'page' || !story) return;
    const update = () => {
      element.style.setProperty('--fallback-top', `${story.current.compositionTop}px`);
      element.style.setProperty('--fallback-height', `${story.current.compositionHeight}px`);
      element.style.setProperty('--fallback-spread', String(smoothProgress(story.current.spreadProgress)));
    };
    const listeners = story.current.listeners;
    listeners.add(update); update();
    return () => { listeners.delete(update); };
  }, [story, visibilityScope]);

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
    const context = process.env.NODE_ENV === 'development' && new URLSearchParams(location.search).get('particleRenderer') === 'svg' ? null : get2dContext(surface);
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
    const engineId = ++engineSequence;
    liveEngines.add(engineId);
    element.dataset.engineId = String(engineId);
    const requestFrame = (callback: FrameRequestCallback) => {
      const id = requestAnimationFrame((time) => { pendingFrames.delete(id); callback(time); });
      pendingFrames.add(id);
      if (process.env.NODE_ENV === 'development') element.dataset.pendingRafs = String(pendingFrames.size);
      return id;
    };
    const cancelFrame = (id: number) => {
      pendingFrames.delete(id); cancelAnimationFrame(id);
      if (process.env.NODE_ENV === 'development') element.dataset.pendingRafs = String(pendingFrames.size);
    };
    const diagnostics =
      process.env.NODE_ENV === 'development' && debugMode !== 'off'
        ? createFieldDebug(field, debugMode)
        : null;
    let initialized = false;
    const layout = { sourceX: 2.65, sourceY: 0 };
    const sideLayout: SideFieldLayout = { halfWidth: 4.2, halfHeight: 2.3, safeHalfWidth: 1.8, edge: 0.12, compact: false };
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
        const core = index >= FIELD_ACCENT_START ? '#fff4dc' : '#f7fcff';
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
          // A tiny hot center plus a coloured shoulder. Bake source-over so
          // the internal halo cannot bleach blue/gold before the scene blend.
          body.addColorStop(0.08, optical === 0 ? `${color}dc` : `${core}ff`);
          body.addColorStop(0.24, `${color}${optical === 2 ? 'f0' : 'dc'}`);
          body.addColorStop(0.42, `${color}a8`);
          body.addColorStop(0.66, `${color}50`);
          body.addColorStop(1, `${color}00`);
          emitterContext.globalAlpha = 1;
          emitterContext.globalCompositeOperation = 'source-over';
          emitterContext.fillStyle = body;
          emitterContext.fillRect(index * cell, optical * cell, cell, cell);
          emitterContext.globalCompositeOperation = 'source-over';
        }
      });
    };
    let width = 0;
    let height = 0;
    let scale = 0;
    let originY = 0;
    let readingLeft = NaN, readingRight = NaN;
    let pointScale = 1;
    let dpr = 1;
    let frame = 0;
    let inView = true;
    let disposed = false;
    let lost = false;
    let lastPhysicsTime = elapsed.current;
    const pointer = { x: 0, y: 0, strength: 0 };
    const pointerTarget = { x: 0, y: 0, active: false, clientX: 0, clientY: 0, present: false };
    const handoff = createParticleHandoff(count);
    const finePointer = window.matchMedia('(any-pointer: fine)');
    const clock: MotionClock = {
      time: elapsed.current,
      previous: null,
      remainder: 0,
    };
    const interval = 1000 / (low ? 30 : 60);
    const isAnimating = () =>
      backgroundCanAnimate({ enabled: visibilityScope === 'page' || inView,
        visible: playback.current.pageVisible && document.visibilityState === 'visible',
        paused: !playback.current.active, reduced: playback.current.staticMotion, contextAvailable: !lost }) &&
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
      (!opening || opening.current.frame.pointerWeight > 0) &&
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
      const openingFrame = opening?.current.frame;
      const physicalDissolve = opening || story ? 0 : settings.dissolve;
      const handoffRect = openingFrame && openingFrame.dissolveProgress > 0 ? element.getBoundingClientRect() : null;
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
      const projection = particleProjection(width, height, magnification, story?.current);
      scale = projection.scale; pointScale = projection.pointScale; originY = projection.originY;
      layout.sourceX = projection.sourceX; layout.sourceY = projection.sourceY;
      if (story) {
        const mix = !Number.isFinite(readingLeft) || settings.staticMotion ? 1 : 1 - Math.exp(-6 * delta);
        const move = (current: number, target: number) => mix === 1 ? target : current + Math.max(-900 * delta, Math.min(900 * delta, (target - current) * mix));
        readingLeft = move(readingLeft, story.current.readingLeft);
        readingRight = move(readingRight, story.current.readingRight);
      }
      const interaction = canInteract();
      // Re-read the live rect even for a stationary mouse while sticky content scrolls.
      if (pointerTarget.present) updatePointerCoordinates();
      const pointerMix = 1 - Math.exp(-10 * delta);
      pointer.x += (pointerTarget.x - pointer.x) * pointerMix;
      pointer.y += (pointerTarget.y - pointer.y) * pointerMix;
      pointer.strength +=
        ((pointerTarget.active && interaction ? (openingFrame?.pointerWeight ?? 1) : 0) - pointer.strength) *
        pointerMix;
      const progress = fieldProgress(
        time,
        openingFrame?.formationProgress ?? settings.formation,
        settings.staticMotion || !settings.introEnabled,
        settings.duration,
      );
      setFieldTargets(field, time, progress, layout, physicalDissolve);
      if (story) {
        configureSideField(sideLayout, width, height, scale, story.current.contentWidth, readingLeft, readingRight, originY);
        setSideFieldTargets(field, time, story.current.spreadProgress, sideLayout);
      }
      if (!initialized || settings.staticMotion) {
        // Existing initialization already applies spreadMix, including deep
        // links and reduced motion. Never blend a second time here.
        initializeField(field);
        initialized = true;
      } else {
        integrateField(field, delta, time, pointer, settings);
      }
      // Enlarge the composition, not individual light points or their halos.
      const size = pointScale;
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
            originY + layout.sourceY * scale - scale * 0.65,
            scale * 2,
            scale * 1.3,
          );
        }
        context.globalAlpha =
          0.028 *
          smoothProgress((progress - 0.3) / 0.3) *
          settings.strength *
          (1 - settings.dissolve) * (1 - field.spreadMix);
        context.drawImage(
          sprite,
          18 * 48,
          48,
          48,
          48,
          width / 2 - scale * 1.5,
          originY - scale,
          scale * 3,
          scale * 2,
        );
      }
      let displacementEnergy = 0;
      // Wide workspaces leave narrow gutters. Deterministic render-only thinning
      // avoids compressing the full cloud into two bright walls; IDs/physics stay.
      const minimumDensity = width < 650 ? 0.65 : 0.12;
      const leftDensity = story ? Math.max(minimumDensity, Math.min(1, (readingLeft - 12) / 210)) : 1;
      const rightDensity = story ? Math.max(minimumDensity, Math.min(1, (width - readingRight - 12) / 210)) : 1;
      for (let index = 0; index < count; index++) {
        const k = index * 3;
        fieldPoint(field, index, progress, physicalDissolve, point);
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
        let x = width / 2 + projected.x * scale;
        let y = originY + projected.y * scale;
        const density = x < width / 2 ? leftDensity : rightDensity;
        const threshold = 1 - field.spreadMix * (1 - density);
        const densityAlpha = threshold >= 1 ? 1 : 1 - smoothProgress(((index * 0.61803398875) % 1 - threshold + 0.025) / 0.05);
        if (densityAlpha === 0) continue;
        const flight = !story && opening && handoffRect ? handoff.project(index, field.role[index], x, y, opening.current, handoffRect.left, handoffRect.top, width) : null;
        if (flight) { x = flight.x; y = flight.y; }
        // Identity text sits above the light field. Do not punch dim rectangular
        // holes into the particles behind SWUFE/FIC; retain only the reading
        // corridor that fades in after scrolling down to body content.
        const edgeBrightness = width < 650 ? PARTICLE_STORY_DEFAULTS.mobileSideBrightness : PARTICLE_STORY_DEFAULTS.sideBrightness;
        // Soft vertical reading corridor, never a hard rectangular cutout.
        const textProtection = story ? smoothProgress(field.spreadMix / 0.85) *
          (1 - smoothProgress((Math.max(readingLeft - x, x - readingRight) + 24) / 70)) : 0;
        const storyMask = (1 - field.spreadMix * (1 - edgeBrightness)) * (1 - textProtection * 0.98);
        const alpha = Math.min(
          1,
          projected.opacity *
            (flight?.opacity ?? 1) *
            storyMask *
            densityAlpha *
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
            : projected.size * size * fieldStarScale(field.role[index], field.sizeClass[index], field.color[index]);
        const color = FIELD_PALETTE[field.color[index]];
        if (
          settings.trails &&
          !flight?.departing &&
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
            const tailY = originY + projectedTail.y * scale;
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
        originY,
      );
      if (element.dataset.canvas !== 'ready') element.dataset.canvas = 'ready';
      const energy = (displacementEnergy / Math.ceil(count / 8)).toFixed(4);
      if (element.dataset.displacement !== energy)
        element.dataset.displacement = energy;
      const pointerEnergy = pointer.strength.toFixed(2);
      if (element.dataset.pointerStrength !== pointerEnergy)
        element.dataset.pointerStrength = pointerEnergy;
      element.dataset.phase = fieldPhase(progress);
      element.dataset.spread = field.spreadMix.toFixed(4);
      element.dataset.simulationTime = time.toFixed(3);
      if (process.env.NODE_ENV === 'development') {
        element.dataset.liveEngines = String(liveEngines.size);
        element.dataset.pendingRafs = String(pendingFrames.size);
        element.dataset.pointerListenerSets = String(pointerBindings.size);
        element.dataset.pointerX = pointer.x.toFixed(3);
        element.dataset.pointerY = pointer.y.toFixed(3);
        element.dataset.readingLeft = readingLeft.toFixed(1);
        element.dataset.readingRight = readingRight.toFixed(1);
        element.dataset.originY = originY.toFixed(1);
        element.dataset.scale = scale.toFixed(3);
      }
      report(progress);
    };
    const draw = () => {
      try {
        drawFrame();
      } catch {
        // Some browsers throw before emitting contextlost. Stop and reveal SVG.
        lost = true;
        cancelFrame(frame);
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
      if (isAnimating()) frame = requestFrame(tick);
    };
    const sync = (resetTiming = true) => {
      if (disposed) return;
      if (resetTiming || !isAnimating()) {
        cancelFrame(frame);
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
      if (isAnimating() && !frame) frame = requestFrame(tick);
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
      const pixelWidth = Math.max(1, Math.round(width * dpr)), pixelHeight = Math.max(1, Math.round(height * dpr));
      if (surface.width !== pixelWidth) surface.width = pixelWidth;
      if (surface.height !== pixelHeight) surface.height = pixelHeight;
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
      visibilityScope !== 'page' && typeof IntersectionObserver !== 'undefined'
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
    const updatePointerCoordinates = () => {
      const rect = element.getBoundingClientRect();
      const inside = pointerToField(pointerTarget.clientX, pointerTarget.clientY, rect, scale, originY, pointerTarget);
      const hit = inside ? document.elementFromPoint(pointerTarget.clientX, pointerTarget.clientY) : null;
      const blocked = hit?.closest(PARTICLE_UI_SELECTOR) || document.querySelector('dialog[open], [role="dialog"][aria-modal="true"]') || document.getSelection()?.type === 'Range';
      pointerTarget.active = inside && pointerTarget.present && !blocked;
    };
    const pointerMove = (event: PointerEvent) => {
      if (!canInteract() || event.pointerType === 'touch' || scale <= 0) {
        pointerTarget.present = false;
        pointerTarget.active = false;
        return;
      }
      pointerTarget.clientX = event.clientX; pointerTarget.clientY = event.clientY;
      pointerTarget.present = true;
      updatePointerCoordinates();
    };
    const pointerLeave = () => {
      pointerTarget.active = false;
      pointerTarget.present = false;
    };
    const viewportLeave = (event: PointerEvent) => { if (!event.relatedTarget) pointerLeave(); };
    syncPlayback.current = sync;
    watchResolution();
    surface.addEventListener('contextlost', contextLost);
    surface.addEventListener('contextrestored', contextRestored);
    resizeObserver?.observe(element);
    visibilityObserver?.observe(pointerHost?.current ?? element);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', syncVisibility);
    const pointerSurface = visibilityScope === 'page' ? window : pointerHost?.current ?? window;
    pointerSurface.addEventListener('pointermove', pointerMove as EventListener, { passive: true });
    pointerSurface.addEventListener('pointerleave', pointerLeave, { passive: true });
    const syncStory = () => sync(false);
    const storyListeners = story?.current.listeners;
    storyListeners?.add(syncStory);
    window.addEventListener('blur', pointerLeave);
    window.addEventListener('pointerout', viewportLeave, { passive: true });
    pointerBindings.add(engineId);
    finePointer.addEventListener('change', syncVisibility);
    resize();
    return () => {
      disposed = true;
      liveEngines.delete(engineId);
      diagnostics?.dispose();
      syncPlayback.current = null;
      cancelFrame(frame);
      elapsed.current = clock.time;
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      resolutionQuery?.removeEventListener('change', resolutionChanged);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', syncVisibility);
      pointerSurface.removeEventListener('pointermove', pointerMove as EventListener);
      pointerSurface.removeEventListener('pointerleave', pointerLeave);
      storyListeners?.delete(syncStory);
      window.removeEventListener('blur', pointerLeave);
      window.removeEventListener('pointerout', viewportLeave);
      pointerBindings.delete(engineId);
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
  }, [count, low, debugMode, magnification, opening, story, pointerHost, visibilityScope]);

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
      data-visibility-scope={visibilityScope}
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
      {visibilityScope === 'page' ? (
        <svg className={`${styles.surface} ${styles.fallbackSides}`} viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
          {stillPoints.filter((_, i) => i % 3 === 0).map((point, i) => {
            const seed = fallbackField.sideSeed[i * 3];
            const left = 4 + seed * 32;
            return <circle key={i} cx={i % 2 ? 1000 - left : left} cy={22 + (fallbackField.sideSeed[i * 3 + 1] + 1) * 478}
              r={Math.min(1.6, Math.max(0.45, point.size * 0.5))} fill={FIELD_PALETTE[point.color]} opacity={Math.min(0.6, point.opacity * 0.58)} />;
          })}
        </svg>
      ) : null}
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
