import { bounded, smoothProgress } from './particle80';
import { FIELD_DEFAULTS } from './particle80-field';
import type { ParticleStoryFrame } from './particle-story';

/** Backing-store dimensions and brand composition are deliberately independent. */
export function particleProjection(width: number, height: number, magnification: number, story?: ParticleStoryFrame) {
  const compact = width < 650;
  const compositionHeight = story?.compositionHeight || height;
  const base = Math.min(width / (compact ? 4.7 : FIELD_DEFAULTS.viewWidth), compositionHeight / (compact ? 5.6 : FIELD_DEFAULTS.viewHeight));
  const scale = Math.min(magnification, compact ? 1.38 : 1.8) * base;
  const spread = smoothProgress(story?.spreadProgress ?? 0);
  const heroCenter = (story?.compositionTop ?? 0) + compositionHeight / 2;
  return {
    scale,
    pointScale: bounded(base / 170, 0.65, 1.25, 1),
    originY: heroCenter + (height / 2 - heroCenter) * spread,
    sourceX: width * (compact ? 0.245 : 0.315) / scale,
    sourceY: compact ? (80 - compositionHeight / 2) / scale : 0,
  };
}
