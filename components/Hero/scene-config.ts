import type { RefObject } from 'react';
import type { Group } from 'three';
import type { OpeningBridgeRef } from '@/lib/brand-opening';

export const RADIUS = 1.62;
export const INITIAL_TILT = [0.14, 0.08, -0.2] as const;
export const INTRO = { particles: 0.5, globe: 1, atmosphere: 1.5, origin: 2, routes: 2.5 };
export type GlobeProps = { lowPower: boolean; reducedMotion: boolean; active: boolean; opening?: OpeningBridgeRef };
export type ScenePointer = { x: number; y: number };
export type SceneClock = { elapsed: number; motion: number };
export type LayerProps = GlobeProps & { clock: RefObject<SceneClock> };
export type ControllerProps = LayerProps & {
  globe: RefObject<Group | null>;
  pointer: RefObject<ScenePointer>;
};

export function reveal(time: number, start: number, duration = 0.65) {
  const t = Math.max(0, Math.min(1, (time - start) / duration));
  return t * t * (3 - 2 * t);
}

// World-space normals, light and camera vectors must remain in the same space.
export const sphereVertex = `
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec3 vLocal;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vWorld = world.xyz;
    vLocal = normalize(position);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;
