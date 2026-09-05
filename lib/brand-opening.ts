import type { RefObject } from 'react';

export type OpeningState = 'INTRO_IDLE' | 'FORMING_80' | 'HOLDING_80' | 'DISSOLVING_80' | 'HANDOFF_TO_GLOBE' | 'GLOBE_ACTIVE';
export type OpeningConfig = {
  leadInDuration: number; formationDuration: number; settleDuration: number;
  holdDuration: number; dissolveDuration: number; globeRevealDuration: number;
  transitionDuration: number; autoTransitionEnabled: boolean;
};
export type OpeningFrame = {
  state: OpeningState; formationProgress: number; holdProgress: number;
  dissolveProgress: number; globeRevealProgress: number; transitionProgress: number;
  activationProgress: number; pointerWeight: number;
  interactionOwner: 'particles' | 'transition' | 'globe' | 'none';
};
export const OPENING_DEFAULTS: OpeningConfig = {
  leadInDuration: 0.3, formationDuration: 2.2, settleDuration: 0.7,
  holdDuration: 2.2, dissolveDuration: 2.8, globeRevealDuration: 2.6,
  transitionDuration: 3.4, autoTransitionEnabled: true,
};
const unit = (n: number) => Math.max(0, Math.min(1, n));
export const easeOpening = (n: number) => { const t = unit(n); return t * t * (3 - 2 * t); };
const progress = (time: number, duration: number) => duration <= 0 ? (time >= 0 ? 1 : 0) : unit(time / duration);
export function openingConfig(input: Partial<OpeningConfig> = {}, mobile = false, reduced = false): OpeningConfig {
  const config = { ...OPENING_DEFAULTS, ...(mobile ? { leadInDuration: 0.15, formationDuration: 1.5, settleDuration: 0.4, holdDuration: 1.6, dissolveDuration: 1.6, globeRevealDuration: 1.5, transitionDuration: 2 } : {}) };
  for (const key of Object.keys(config) as (keyof OpeningConfig)[]) {
    if (key === 'autoTransitionEnabled') continue;
    const value = input[key];
    if (typeof value === 'number' && Number.isFinite(value)) config[key] = Math.max(0, Math.min(60, value));
  }
  config.autoTransitionEnabled = input.autoTransitionEnabled ?? true;
  if (reduced) Object.assign(config, { leadInDuration: 0, formationDuration: 0, settleDuration: 0, holdDuration: 1.2, dissolveDuration: 0.22, globeRevealDuration: 0.22, transitionDuration: 0.22 });
  return config;
}
export function sampleOpening(elapsed: number, config: OpeningConfig, exitAt: number | null = null, reduced = false): OpeningFrame {
  const time = Math.max(0, Number.isFinite(elapsed) ? elapsed : 0);
  const formed = config.leadInDuration + config.formationDuration;
  const held = formed + config.settleDuration;
  const automatic = held + config.holdDuration;
  const start = exitAt ?? (config.autoTransitionEnabled ? automatic : Infinity);
  const exitTime = time - start;
  const duration = Math.max(config.transitionDuration, config.dissolveDuration, config.globeRevealDuration);
  const revealDelay = reduced ? 0 : Math.min(0.35, duration * 0.1);
  const transition = exitTime >= 0 ? progress(exitTime, duration + revealDelay) : 0;
  const dissolve = exitTime >= 0 ? progress(exitTime, config.dissolveDuration) : 0;
  const globe = exitTime >= 0 ? progress(exitTime - revealDelay, config.globeRevealDuration) : 0;
  const state: OpeningState = transition >= 1 ? 'GLOBE_ACTIVE' : exitTime >= 0 ? (dissolve < 0.62 ? 'DISSOLVING_80' : 'HANDOFF_TO_GLOBE') : time < config.leadInDuration ? 'INTRO_IDLE' : time < held ? 'FORMING_80' : 'HOLDING_80';
  const weight = reduced ? 0 : state === 'HOLDING_80' ? 1 : exitTime >= 0 && transition < 1 ? 1 - easeOpening(exitTime / 0.65) : 0;
  return {
    state, formationProgress: reduced ? 1 : progress(time - config.leadInDuration, config.formationDuration),
    holdProgress: progress(time - held, config.holdDuration), dissolveProgress: dissolve,
    globeRevealProgress: globe, transitionProgress: transition,
    activationProgress: easeOpening((transition - 0.75) / 0.25), pointerWeight: weight,
    interactionOwner: reduced ? 'none' : state === 'GLOBE_ACTIVE' ? 'globe' : exitTime >= 0 ? 'transition' : state === 'HOLDING_80' ? 'particles' : 'none',
  };
}

// Projected endpoints are viewport pixels from the real R3F camera + globe matrix.
// Three supplies these once per frame; the existing Canvas engine only reads them.
export const HANDOFF_TARGETS = 320;
export type OpeningBridge = {
  frame: OpeningFrame; ready: boolean; fallback: boolean; projected: boolean;
  targets: Float32Array; nodeCount: number; routeStart: number; atmosphereStart: number;
};
export type OpeningBridgeRef = RefObject<OpeningBridge>;
export function createOpeningBridge(): OpeningBridge {
  return { frame: sampleOpening(0, OPENING_DEFAULTS), ready: false, fallback: false, projected: false, targets: new Float32Array(HANDOFF_TARGETS * 3), nodeCount: 0, routeStart: 16, atmosphereStart: 208 };
}
/** Render-only departure lanes. The underlying spring/circulation engine is untouched. */
export function departureProgress(role: number, index: number, dissolve: number): number {
  const stagger = ((index * 37) % 101) / 101;
  const start = role === 1 ? stagger * 0.17 : role === 2 ? 0.06 + stagger * 0.2 : role === 3 ? 0.2 + stagger * 0.16 : 0.43 + stagger * 0.24;
  const duration = role === 0 ? 0.31 : role === 1 ? 0.59 : 0.52;
  return easeOpening((dissolve - start) / duration);
}
