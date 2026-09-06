import { smoothProgress } from './particle80';
import { PARTICLE_STORY_DEFAULTS } from './particle-story';
import type { ParticleField } from './particle80-field';

export type SideFieldLayout = {
  halfWidth: number; halfHeight: number; safeHalfWidth: number; edge: number; compact: boolean;
  safeLeft?: number; safeRight?: number; centerY?: number;
};
/** Pixel-to-world conversion shares the exact Canvas projection and scale. */
export function configureSideField(layout: SideFieldLayout, width: number, height: number, scale: number, contentWidth: number, readingLeft = (width - contentWidth) / 2, readingRight = (width + contentWidth) / 2, originY = height / 2) {
  const compact = width < 650;
  layout.halfWidth = width / 2 / scale;
  layout.halfHeight = height / 2 / scale;
  layout.edge = (compact ? 6 : PARTICLE_STORY_DEFAULTS.edgePadding) / scale;
  layout.safeHalfWidth = Math.min(width / 2 - (compact ? 18 : 60), contentWidth / 2 + (compact ? 14 : PARTICLE_STORY_DEFAULTS.contentPadding)) / scale;
  layout.compact = compact;
  const band = compact ? 18 : 60;
  const padding = compact ? 14 : PARTICLE_STORY_DEFAULTS.contentPadding;
  layout.safeLeft = (Math.max(band, Math.min(width - band, readingLeft - padding)) - width / 2) / scale;
  layout.safeRight = (Math.max(band, Math.min(width - band, readingRight + padding)) - width / 2) / scale;
  layout.centerY = (height / 2 - originY) / scale;
}
/** Same IDs, seeded volumetric lanes. No captured departure, opacity or time lock. */
export function setSideFieldTargets(field: ParticleField, time: number, spread: number, layout: SideFieldLayout) {
  field.spreadMix = smoothProgress(spread);
  if (field.spreadMix === 0) return;
  for (let i = 0; i < field.count; i++) {
    const k = i * 3, seed = field.noiseSeed[i];
    const side = field.loop[i] === 2 ? 1 : field.loop[i] < 2 ? -1 : field.side[i];
    const ySeed = field.sideSeed[k + 1];
    // Wavy inner density and broad outer tails, not two vertical light walls.
    const envelope = Math.sqrt(Math.max(0.04, 1 - ySeed * ySeed));
    const density = 0.13 + (1 - envelope) * 0.32 +
      Math.pow(field.sideSeed[k], 1.45) * envelope * 0.64 + Math.sin(ySeed * 4 + side) * 0.09;
    const drift = Math.sin(time * (0.11 + field.role[i] * 0.02) + seed) * 0.028;
    const inner = side < 0 ? (layout.safeLeft ?? -layout.safeHalfWidth) : (layout.safeRight ?? layout.safeHalfWidth);
    const outer = side * (layout.halfWidth - layout.edge);
    const sx = inner + (outer - inner) * (density + drift);
    const sy = (ySeed * 0.92 + Math.sin(time * 0.13 + seed) * 0.035) * layout.halfHeight + (layout.centerY ?? 0);
    const z = field.sideSeed[k + 2] * 0.75 + Math.sin(time * 0.19 + seed) * 0.07;
    // Place in projected lanes, then undo perspective for actual physical targets.
    // A foreground star cannot project inward onto the reading column.
    const perspective = 6.5 / (6.5 - z);
    field.sideTarget[k] = sx / perspective;
    field.sideTarget[k + 1] = sy / perspective;
    field.sideTarget[k + 2] = z;
  }
}
