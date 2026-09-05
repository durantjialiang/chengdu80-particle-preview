'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import type { CityNode } from '@/content/site';
import { latLon, networkCities } from './geometry';
import { INTRO, RADIUS, reveal, type LayerProps } from './scene-config';

export type LabelElements = RefObject<Map<string, HTMLDivElement>>;
type OriginBounds = RefObject<{ x: number; y: number; width: number; height: number }>;
type CityProps = LayerProps & { city: CityNode; labels: LabelElements; originBounds: OriginBounds };

function City({ city, lowPower, reducedMotion, clock, labels, originBounds, opening }: CityProps) {
  const marker = useRef<THREE.Group>(null);
  const core = useRef<THREE.MeshBasicMaterial>(null);
  const halo = useRef<THREE.MeshBasicMaterial>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const hover = useRef(false);
  const world = useMemo(() => new THREE.Vector3(), []);
  const normal = useMemo(() => new THREE.Vector3(), []);
  const view = useMemo(() => new THREE.Vector3(), []);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const position = useMemo(() => latLon(city.latitude, city.longitude, RADIUS + 0.037), [city]);
  const orientation = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize()), [position]);
  const origin = city.isOrigin;

  useFrame(({ camera, size }) => {
    if (!marker.current) return;
    const elapsed = clock.current.elapsed;
    const activation = opening?.current.frame.activationProgress ?? 1;
    const appearance = opening ? reveal(opening.current.frame.globeRevealProgress, 0.2, 0.5) * (origin ? 0.38 + 0.62 * activation : 1) : reveal(elapsed, origin ? INTRO.origin : INTRO.routes, 0.45);
    marker.current.getWorldPosition(world);
    normal.copy(world).normalize(); view.copy(camera.position).sub(world).normalize();
    const facing = normal.dot(view);
    const visibility = THREE.MathUtils.smoothstep(facing, 0.04, 0.24) * appearance;
    const pulse = reducedMotion ? 0 : Math.sin(clock.current.motion * 1.2) * 0.08;
    if (core.current) core.current.opacity = appearance * (origin ? 1 : 0.66 + (hover.current ? 0.22 : 0));
    const activationPulse = opening && !reducedMotion ? Math.sin(activation * Math.PI) : 0;
    if (halo.current) halo.current.opacity = appearance * (origin ? 0.1 + pulse * 0.2 + activationPulse * 0.16 : 0.035);
    for (let i = 0; i < rings.current.length; i++) {
      const ring = rings.current[i]; if (!ring) continue;
      const progress = reducedMotion ? 0.25 + i * 0.3 : opening && activation < 1 ? Math.min(1, activation * 1.25 + i * 0.18) : ((Math.max(0, elapsed - INTRO.origin) * 0.19 + i * 0.5) % 1);
      ring.scale.setScalar(1 + progress * 2.1);
      (ring.material as THREE.MeshBasicMaterial).opacity = appearance * (1 - progress) ** 2 * (origin ? 0.42 : 0.08);
    }
    const label = labels.current.get(city.name);
    if (label) {
      projected.copy(world).project(camera);
      const x = (projected.x * 0.5 + 0.5) * size.width;
      const y = (-projected.y * 0.5 + 0.5) * size.height;
      // Anchor labels to their actual 3D node; fade far-side labels instead of X-ray text.
      const width = origin ? (lowPower ? 152 : 182) : 82;
      const dx = origin ? 19 : 12;
      const safeX = THREE.MathUtils.clamp(x + dx, size.width * 0.12, size.width - width - 12);
      let safeY = THREE.MathUtils.clamp(y - (origin ? 72 : 9), 12, size.height - 56);
      if (origin) {
        Object.assign(originBounds.current, { x: safeX, y: safeY, width, height: lowPower ? 38 : 46 });
      } else {
        const source = originBounds.current;
        if (safeX < source.x + source.width + 6 && safeX + width > source.x - 6 && safeY < source.y + source.height + 6 && safeY + 16 > source.y - 6) {
          safeY = source.y + source.height + 8;
        }
      }
      label.style.transform = `translate3d(${safeX.toFixed(1)}px, ${safeY.toFixed(1)}px, 0)`;
      label.style.opacity = String(visibility * (origin ? 1 : 0.65));
    }
  });

  return (
    <group ref={marker} position={position} quaternion={orientation}>
      <mesh onPointerOver={() => { hover.current = !opening || opening.current.frame.interactionOwner === 'globe'; }} onPointerOut={() => { hover.current = false; }}>
        <sphereGeometry args={[origin ? 0.031 : 0.016, 12, 10]} />
        <meshBasicMaterial ref={core} color={origin ? '#d5b391' : '#91cbdc'} transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh scale={origin ? 2.7 : 2.2}>
        <sphereGeometry args={[origin ? 0.031 : 0.016, 12, 10]} />
        <meshBasicMaterial ref={halo} color={origin ? '#caa780' : '#77d9ff'} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {origin ? [0, 1].map(index => (
        <mesh key={index} ref={element => { rings.current[index] = element; }} position={[0, 0, 0.007]}>
          <ringGeometry args={[0.063, 0.068, lowPower ? 32 : 56]} />
          <meshBasicMaterial color={index === 0 ? '#cca57e' : '#b99777'} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      )) : null}
    </group>
  );
}

export default function CityNodes(props: LayerProps & { labels: LabelElements }) {
  const cities = networkCities(props.lowPower);
  const originBounds = useRef({ x: 0, y: 0, width: 0, height: 0 });
  return <group>{cities.map(city => <City key={city.name} {...props} city={city} originBounds={originBounds} />)}</group>;
}
