'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { INITIAL_TILT, type ControllerProps } from './scene-config';
import { getUniversity } from '@/content/network';
import { universityOrientation } from './geometry';

const WORLD_Y = new THREE.Vector3(0, 1, 0);
const WORLD_X = new THREE.Vector3(1, 0, 0);

export default function CameraController({
  active,
  reducedMotion,
  lowPower,
  clock,
  globe,
  pointer,
  opening,
  network,
}: ControllerProps) {
  const { camera, invalidate } = useThree();
  const focusId = network?.focusId;
  const focusRevision = network?.focusRevision ?? 0;
  const manualRotation = useRef(false);
  const previousFocus = useRef({ id: focusId, revision: focusRevision });
  const focusedOrientation = useMemo(() => {
    if (!focusId) return null;
    // Focus the displayed city marker for a cluster; retain original campus pins.
    const university =
      network?.nodes?.find((n) => n.universityIds.includes(focusId)) ??
      getUniversity(focusId);
    return universityOrientation(
      university.latitude,
      university.longitude,
      new THREE.Vector3(-0.62, 0.46, lowPower ? 5.95 : 6.45),
    );
  }, [focusId, lowPower, network?.nodes]);
  useEffect(() => {
    invalidate();
  }, [
    focusId,
    focusRevision,
    network?.highlightedId,
    network?.nodes,
    invalidate,
  ]);
  useEffect(() => {
    camera.position.set(-0.62, 0.46, lowPower ? 5.95 : 6.45);
    camera.lookAt(0, 0, 0);
    invalidate();
  }, [camera, invalidate, lowPower]);
  /* oxlint-disable react/react-compiler -- Imperative R3F camera/transform updates are outside React rendering. */
  useFrame((_, delta) => {
    if (network) {
      // A new card/region focus hands orientation back to the explorer. Once a
      // person drags the globe, hold that orientation until the next explicit
      // focus action so the camera does not fight the gesture.
      if (
        previousFocus.current.id !== focusId ||
        previousFocus.current.revision !== focusRevision
      ) {
        previousFocus.current = { id: focusId, revision: focusRevision };
        manualRotation.current = false;
      }
      if (globe.current && (pointer.current.dragX || pointer.current.dragY)) {
        manualRotation.current = true;
        const horizontal = pointer.current.dragX * 0.006;
        const vertical = pointer.current.dragY * 0.0045;
        pointer.current.dragX = 0;
        pointer.current.dragY = 0;
        globe.current.rotateOnWorldAxis(WORLD_Y, horizontal);
        globe.current.rotateOnWorldAxis(WORLD_X, vertical);
      }
      clock.current.elapsed = 10;
      if (active && !reducedMotion)
        clock.current.motion += Math.min(delta, 0.05);
      if (globe.current && focusedOrientation && !manualRotation.current) {
        if (reducedMotion) globe.current.quaternion.copy(focusedOrientation);
        else if (active)
          globe.current.quaternion.slerp(
            focusedOrientation,
            1 - Math.exp(-Math.min(delta, 0.05) * 3.2),
          );
      }
      camera.position.set(-0.62, 0.46, lowPower ? 5.95 : 6.45);
      camera.lookAt(0, 0, 0);
      camera.updateMatrixWorld();
      return;
    }
    if (opening && opening.current.frame.state !== 'GLOBE_ACTIVE') {
      clock.current.elapsed = opening.current.frame.globeRevealProgress * 4.2;
      clock.current.motion = 0;
      pointer.current.x = 0;
      pointer.current.y = 0;
      globe.current?.rotation.set(...INITIAL_TILT);
      camera.position.set(-0.62, 0.46, lowPower ? 5.95 : 6.45);
      camera.lookAt(0, 0, 0);
      return;
    }
    if (reducedMotion) {
      clock.current.elapsed = 10;
      clock.current.motion = 0;
      globe.current?.rotation.set(...INITIAL_TILT);
      camera.position.set(-0.62, 0.46, lowPower ? 5.95 : 6.45);
      camera.lookAt(0, 0, 0);
      return;
    }
    if (!active) return;
    const dt = Math.min(delta, 0.05);
    clock.current.elapsed += dt;
    clock.current.motion += dt;
    const t = clock.current.motion;
    // Bounded axial drift keeps the source on the visible hemisphere.
    if (globe.current) {
      globe.current.rotation.x = THREE.MathUtils.damp(
        globe.current.rotation.x,
        INITIAL_TILT[0] + pointer.current.y * 0.026,
        2.6,
        dt,
      );
      globe.current.rotation.y = THREE.MathUtils.damp(
        globe.current.rotation.y,
        INITIAL_TILT[1] + Math.sin(t * 0.04) * 0.09 + pointer.current.x * 0.038,
        2.6,
        dt,
      );
      globe.current.rotation.z = INITIAL_TILT[2] + Math.sin(t * 0.025) * 0.008;
    }
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      -0.62 + pointer.current.x * 0.015,
      2.2,
      dt,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      0.46 - pointer.current.y * 0.01,
      2.2,
      dt,
    );
    camera.lookAt(0, 0, 0);
  }, -2);
  /* oxlint-enable react/react-compiler */
  return null;
}
