'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import type { CityNode } from '@/content/site';
import { latLon, networkCities } from './geometry';
import { INTRO, RADIUS, reveal, type LayerProps } from './scene-config';
import { placeNetworkLabels, type NodeLabelAnchor } from '@/lib/network-labels';

export type LabelElements = RefObject<Map<string, HTMLDivElement>>;
type OriginBounds = RefObject<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;
type CityProps = LayerProps & {
  city: CityNode;
  labels: LabelElements;
  originBounds: OriginBounds;
  anchor?: NodeLabelAnchor;
};

function City({
  city,
  lowPower,
  reducedMotion,
  clock,
  labels,
  originBounds,
  opening,
  network,
  anchor,
}: CityProps) {
  const marker = useRef<THREE.Group>(null);
  const core = useRef<THREE.MeshBasicMaterial>(null);
  const halo = useRef<THREE.MeshBasicMaterial>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const hover = useRef(false);
  const facingCamera = useRef(false);
  const world = useMemo(() => new THREE.Vector3(), []);
  const normal = useMemo(() => new THREE.Vector3(), []);
  const view = useMemo(() => new THREE.Vector3(), []);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const position = useMemo(
    () => latLon(city.latitude, city.longitude, RADIUS + 0.037),
    [city],
  );
  const orientation = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        position.clone().normalize(),
      ),
    [position],
  );
  const origin = city.isOrigin;

  /* oxlint-disable react/react-compiler -- Shared, preallocated screen-space simulation buffer; never consumed by React render. */
  useFrame(({ camera, size }) => {
    if (!marker.current) return;
    const elapsed = clock.current.elapsed;
    const activation = opening?.current.frame.activationProgress ?? 1;
    const appearance = opening
      ? reveal(opening.current.frame.globeRevealProgress, 0.2, 0.5) *
        (origin ? 0.38 + 0.62 * activation : 1)
      : reveal(elapsed, origin ? INTRO.origin : INTRO.routes, 0.45);
    marker.current.getWorldPosition(world);
    normal.copy(world).normalize();
    view.copy(camera.position).sub(world).normalize();
    const facing = normal.dot(view);
    facingCamera.current = facing > 0.04;
    const visibility =
      THREE.MathUtils.smoothstep(facing, 0.04, 0.24) * appearance;
    const highlighted = network
      ? network.highlightedId === city.id
      : hover.current;
    const emphasis =
      network &&
      network.highlightedId &&
      network.highlightedId !== 'swufe' &&
      !highlighted &&
      !origin
        ? 0.22
        : 1;
    const pulse = reducedMotion
      ? 0
      : Math.sin(clock.current.motion * 1.2 + position.x) * 0.08;
    if (core.current)
      core.current.opacity =
        appearance *
        emphasis *
        (origin ? 1 : 0.72 + (highlighted ? 0.25 : pulse));
    const activationPulse =
      opening && !reducedMotion ? Math.sin(activation * Math.PI) : 0;
    if (halo.current)
      halo.current.opacity =
        appearance *
        emphasis *
        (origin
          ? 0.1 + pulse * 0.2 + activationPulse * 0.16
          : highlighted
            ? 0.19
            : 0.05 + pulse * 0.1);
    for (let i = 0; i < rings.current.length; i++) {
      const ring = rings.current[i];
      if (!ring) continue;
      const progress = reducedMotion
        ? 0.25 + i * 0.3
        : opening && activation < 1
          ? Math.min(1, activation * 1.25 + i * 0.18)
          : (Math.max(0, elapsed - INTRO.origin) * 0.19 + i * 0.5) % 1;
      ring.scale.setScalar(1 + progress * 2.1);
      (ring.material as THREE.MeshBasicMaterial).opacity =
        appearance * (1 - progress) ** 2 * (origin ? 0.42 : 0.08);
    }
    const label = labels.current.get(city.name);
    if (label) {
      projected.copy(world).project(camera);
      const x = (projected.x * 0.5 + 0.5) * size.width;
      const y = (-projected.y * 0.5 + 0.5) * size.height;
      if (network && anchor) {
        anchor.x = x;
        anchor.y = y;
        anchor.visibility = visibility;
        return;
      }
      // Anchor labels to their actual 3D node; fade far-side labels instead of X-ray text.
      const width = origin ? (lowPower ? 152 : 182) : 82;
      const dx = origin ? 19 : 12;
      const safeX = THREE.MathUtils.clamp(
        x + dx,
        size.width * 0.12,
        size.width - width - 12,
      );
      let safeY = THREE.MathUtils.clamp(
        y - (origin ? 72 : 9),
        12,
        size.height - 56,
      );
      if (origin) {
        Object.assign(originBounds.current, {
          x: safeX,
          y: safeY,
          width,
          height: lowPower ? 38 : 46,
        });
      } else {
        const source = originBounds.current;
        if (
          safeX < source.x + source.width + 6 &&
          safeX + width > source.x - 6 &&
          safeY < source.y + source.height + 6 &&
          safeY + 16 > source.y - 6
        ) {
          safeY = source.y + source.height + 8;
        }
      }
      label.style.transform = `translate3d(${safeX.toFixed(1)}px, ${safeY.toFixed(1)}px, 0)`;
      label.style.opacity = String(visibility * (origin ? 1 : 0.65));
    }
  }, -1);
  /* oxlint-enable react/react-compiler */

  return (
    <group ref={marker} position={position} quaternion={orientation}>
      <mesh
        onPointerOver={(event) => {
          if (!facingCamera.current) return;
          event.stopPropagation();
          hover.current =
            !opening || opening.current.frame.interactionOwner === 'globe';
          network?.onNodeHover(city.id);
        }}
        onPointerOut={() => {
          hover.current = false;
          network?.onNodeHover(null);
        }}
        onClick={(event) => {
          if (!network || !facingCamera.current) return;
          event.stopPropagation();
          network.onNodeSelect(city.id);
        }}
      >
        <sphereGeometry args={[origin ? 0.031 : 0.016, 12, 10]} />
        <meshBasicMaterial
          ref={core}
          color={origin ? '#d5b391' : '#91cbdc'}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={origin ? 2.7 : 2.2}>
        <sphereGeometry args={[origin ? 0.031 : 0.016, 12, 10]} />
        <meshBasicMaterial
          ref={halo}
          color={origin ? '#caa780' : '#77d9ff'}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {origin
        ? [0, 1].map((index) => (
            <mesh
              key={index}
              ref={(element) => {
                rings.current[index] = element;
              }}
              position={[0, 0, 0.007]}
            >
              <ringGeometry args={[0.063, 0.068, lowPower ? 32 : 56]} />
              <meshBasicMaterial
                color={index === 0 ? '#cca57e' : '#b99777'}
                transparent
                opacity={0}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))
        : null}
    </group>
  );
}

export default function CityNodes(
  props: LayerProps & { labels: LabelElements },
) {
  const explorer = Boolean(props.network);
  const cities = useMemo(
    () => networkCities(props.lowPower, explorer),
    [props.lowPower, explorer],
  );
  const anchors = useMemo(
    () =>
      new Map(
        cities.map((city) => [
          city.id,
          {
            id: city.id,
            x: 0,
            y: 0,
            visibility: 0,
            width: city.isOrigin
              ? 145
              : Math.min(130, city.name.length * 7 + 20),
            labelX: 0,
            labelY: 0,
          },
        ]),
      ),
    [cities],
  );
  const ordered = useMemo(
    () =>
      [...anchors.values()].sort((a, b) => {
        const priority = (id: string) => (id === 'swufe' ? 0 : 1);
        return priority(a.id) - priority(b.id);
      }),
    [anchors],
  );
  const originBounds = useRef({ x: 0, y: 0, width: 0, height: 0 });
  useFrame(({ size }) => {
    if (!props.network) return;
    placeNetworkLabels(ordered, size.width, size.height);
    for (const city of cities) {
      const label = props.labels.current.get(city.name),
        anchor = anchors.get(city.id);
      if (!label || !anchor) continue;
      const highlighted = props.network.highlightedId === city.id;
      label.style.transform = `translate3d(${anchor.labelX.toFixed(1)}px, ${anchor.labelY.toFixed(1)}px, 0)`;
      label.style.opacity = String(
        anchor.visibility * (highlighted || city.isOrigin ? 1 : 0.64),
      );
      label.style.visibility = anchor.visibility > 0.15 ? 'visible' : 'hidden';
      label.inert = anchor.visibility <= 0.15;
      const leader = label.firstElementChild as HTMLElement | null;
      if (leader) {
        const edge = anchor.x < anchor.labelX ? 0 : anchor.width,
          dx = anchor.x - anchor.labelX - edge,
          dy = anchor.y - anchor.labelY - 16;
        leader.style.width = `${Math.hypot(dx, dy).toFixed(1)}px`;
        leader.style.transform = `translate(${edge}px,16px) rotate(${Math.atan2(dy, dx)}rad)`;
      }
    }
  }, -0.5);
  return (
    <group>
      {cities.map((city) => (
        <City
          key={city.id}
          {...props}
          city={city}
          originBounds={originBounds}
          anchor={anchors.get(city.id)}
        />
      ))}
    </group>
  );
}
