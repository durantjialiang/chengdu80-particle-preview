'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';
import { INITIAL_TILT, type ControllerProps } from './scene-config';

export default function CameraController({ active, reducedMotion, lowPower, clock, globe, pointer }: ControllerProps) {
  const { camera, invalidate } = useThree();
  useEffect(() => {
    camera.position.set(-0.62, 0.46, lowPower ? 5.95 : 6.45);
    camera.lookAt(0, 0, 0);
    invalidate();
  }, [camera, invalidate, lowPower]);
  /* oxlint-disable react/react-compiler -- Imperative R3F camera/transform updates are outside React rendering. */
  useFrame((_, delta) => {
    if (reducedMotion) {
      clock.current.elapsed = 10; clock.current.motion = 0;
      globe.current?.rotation.set(...INITIAL_TILT);
      camera.position.set(-0.62, 0.46, lowPower ? 5.95 : 6.45);
      camera.lookAt(0, 0, 0);
      return;
    }
    if (!active) return;
    const dt = Math.min(delta, 0.05);
    clock.current.elapsed += dt; clock.current.motion += dt;
    const t = clock.current.motion;
    // Bounded axial drift keeps the source on the visible hemisphere.
    if (globe.current) {
      globe.current.rotation.x = THREE.MathUtils.damp(globe.current.rotation.x, INITIAL_TILT[0] + pointer.current.y * 0.026, 2.6, dt);
      globe.current.rotation.y = THREE.MathUtils.damp(globe.current.rotation.y, INITIAL_TILT[1] + Math.sin(t * 0.04) * 0.09 + pointer.current.x * 0.038, 2.6, dt);
      globe.current.rotation.z = INITIAL_TILT[2] + Math.sin(t * 0.025) * 0.008;
    }
    camera.position.x = THREE.MathUtils.damp(camera.position.x, -0.62 + pointer.current.x * 0.015, 2.2, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.46 - pointer.current.y * 0.01, 2.2, dt);
    camera.lookAt(0, 0, 0);
  }, -2);
  /* oxlint-enable react/react-compiler */
  return null;
}
