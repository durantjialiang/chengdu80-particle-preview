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
  spreadProgress: number; identityOpacity: number;
  /** Geometry diagnostics only, never renderer lifecycle gates. */
  heroInView: boolean; introInView: boolean; reduced: boolean;
  contentWidth: number; readingLeft: number; readingRight: number;
  compositionTop: number; compositionHeight: number; mode: 'hero' | 'ambient';
};
export type ParticleStoryBridge = ParticleStoryFrame & { listeners: Set<() => void> };
export type ParticleStoryRef = RefObject<ParticleStoryBridge>;
export function createParticleStory(): ParticleStoryBridge {
  return { spreadProgress: 0, identityOpacity: 1, heroInView: true, introInView: true,
    reduced: false, contentWidth: 0, readingLeft: 0, readingRight: 0,
    compositionTop: 90, compositionHeight: 540, mode: 'hero', listeners: new Set() };
}
/** Absolute native scroll position, not accumulated deltas. Naturally reversible. */
export function sampleParticleStory(top: number, bottom: number, viewport: number, reduced = false, heroHeight = viewport) {
  const height = Math.max(1, bounded(viewport, 1, 10000, 900));
  const spreadProgress = bounded(-top / (height * PARTICLE_STORY_DEFAULTS.spreadViewport), 0, 1, 0);
  const identityOpacity = 1 - smoothProgress(spreadProgress / PARTICLE_STORY_DEFAULTS.identityExitProgress);
  return {
    spreadProgress, identityOpacity,
    heroInView: top < height && top + heroHeight > 0,
    introInView: top < height && bottom > 0,
    reduced,
  };
}

/** Page state is deliberately independent of Hero geometry. */
export function backgroundCanAnimate(s: { enabled: boolean; visible: boolean; paused: boolean; reduced: boolean; contextAvailable: boolean }) {
  return s.enabled && s.visible && !s.paused && !s.reduced && s.contextAvailable;
}
export const PARTICLE_UI_SELECTOR = 'a,button,input,select,textarea,summary,video,[role="button"],[role="dialog"],dialog,[contenteditable="true"],[data-particle-no-force],[data-particle-reading-region]';
/** Client coordinates and the real fixed Canvas rect; never add scrollY. */
export function pointerToField(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number }, scale: number, originY: number, target: { x: number; y: number }) {
  if (scale <= 0 || clientX < rect.left || clientX > rect.left + rect.width || clientY < rect.top || clientY > rect.top + rect.height) return false;
  target.x = (clientX - rect.left - rect.width / 2) / scale;
  target.y = (clientY - rect.top - originY) / scale;
  return true;
}
