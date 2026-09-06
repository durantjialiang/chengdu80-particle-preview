import type { RefObject } from 'react';
import { bounded, smoothProgress } from './particle80';

/** Layout distances only; these parameters never change first-screen optics. */
export const PARTICLE_STORY_DEFAULTS = {
  spreadViewport: 0.78,
  identityExitProgress: 0.5,
  contentPadding: 42,
  edgePadding: 22,
  sideBrightness: 0.58,
  mobileSideBrightness: 0.2,
} as const;
export type ParticleStoryFrame = {
  spreadProgress: number; identityOpacity: number; particleStageVisibility: number;
  inView: boolean; reduced: boolean; contentWidth: number;
};
export type ParticleStoryBridge = ParticleStoryFrame & { listeners: Set<() => void> };
export type ParticleStoryRef = RefObject<ParticleStoryBridge>;
export function createParticleStory(): ParticleStoryBridge {
  return { spreadProgress: 0, identityOpacity: 1, particleStageVisibility: 1,
    inView: true, reduced: false, contentWidth: 0, listeners: new Set() };
}
/** Absolute native scroll position, not accumulated deltas. Naturally reversible. */
export function sampleParticleStory(top: number, bottom: number, viewport: number, reduced = false): ParticleStoryFrame {
  const height = Math.max(1, bounded(viewport, 1, 10000, 900));
  const spreadProgress = bounded(-top / (height * PARTICLE_STORY_DEFAULTS.spreadViewport), 0, 1, 0);
  const identityOpacity = 1 - smoothProgress(spreadProgress / PARTICLE_STORY_DEFAULTS.identityExitProgress);
  return {
    spreadProgress, identityOpacity,
    particleStageVisibility: reduced ? 1 - smoothProgress(spreadProgress) : smoothProgress(bottom / (height * 0.55)),
    inView: top < height && bottom > 0,
    reduced, contentWidth: 0,
  };
}
