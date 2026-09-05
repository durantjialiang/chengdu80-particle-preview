'use client';
import { useFrame } from '@react-three/fiber';
import { useMemo, type RefObject } from 'react';
import * as THREE from 'three';
import { HANDOFF_TARGETS, type OpeningBridgeRef } from '@/lib/brand-opening';
import { latLon, networkCities, networkRoutes } from './geometry';
import { RADIUS } from './scene-config';

/** A small projection bridge, not a second globe or a particle simulation. */
export default function OpeningTargets({ opening, globe, host, lowPower }: {
  opening: OpeningBridgeRef; globe: RefObject<THREE.Group | null>;
  host: RefObject<HTMLDivElement | null>; lowPower: boolean;
}) {
  const { coordinates, nodeCount } = useMemo(() => {
    const cities = networkCities(lowPower);
    const routes = networkRoutes(lowPower);
    const coordinates = new Float32Array(HANDOFF_TARGETS * 3);
    const point = new THREE.Vector3();
    for (let i = 0; i < HANDOFF_TARGETS; i++) {
      if (i < 16) {
        const city = cities[i % cities.length];
        point.copy(latLon(city.latitude, city.longitude, RADIUS + 0.037));
      } else if (i < 208) {
        const lane = i - 16;
        routes[lane % routes.length].getPointAt((Math.floor(lane / routes.length) + 0.5) / Math.ceil(192 / routes.length), point);
      } else {
        const p = (i - 208 + 0.5) / 112;
        const y = 1 - p * 2, angle = (i - 208) * 2.399963;
        const radius = RADIUS * (1.04 + (i % 7) * 0.012);
        point.set(Math.sqrt(1 - y * y) * Math.cos(angle), y, Math.sqrt(1 - y * y) * Math.sin(angle)).multiplyScalar(radius);
      }
      point.toArray(coordinates, i * 3);
    }
    return { coordinates, nodeCount: cities.length };
  }, [lowPower]);
  const point = useMemo(() => new THREE.Vector3(), []);
  /* oxlint-disable react/react-compiler -- Writes a preallocated cross-renderer projection buffer during R3F frames. */
  useFrame(({ camera }) => {
    const target = opening.current;
    if (!host.current || !globe.current || target.frame.state === 'GLOBE_ACTIVE') return;
    const rect = host.current.getBoundingClientRect();
    camera.updateMatrixWorld();
    globe.current.updateWorldMatrix(true, false);
    for (let i = 0; i < HANDOFF_TARGETS; i++) {
      point.fromArray(coordinates, i * 3).applyMatrix4(globe.current.matrixWorld).project(camera);
      target.targets[i * 3] = rect.left + (point.x * 0.5 + 0.5) * rect.width;
      target.targets[i * 3 + 1] = rect.top + (-point.y * 0.5 + 0.5) * rect.height;
      target.targets[i * 3 + 2] = point.z;
    }
    target.nodeCount = nodeCount;
    target.projected = true;
  });
  /* oxlint-enable react/react-compiler */
  return null;
}
