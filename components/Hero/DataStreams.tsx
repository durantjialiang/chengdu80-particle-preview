'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { networkRoutes } from './geometry';
import { INTRO, reveal, type LayerProps } from './scene-config';

function BrandOrbits({ lowPower, reducedMotion, clock, opening }: LayerProps) {
  const dots = useRef<THREE.Points>(null);
  const uniforms = useMemo(() => ({ uReveal: { value: 0 } }), []);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { paths, positions, packetPositions } = useMemo(() => {
    const paths = [0, 1].map(kind => new THREE.CatmullRomCurve3(Array.from({length: 100}, (_, i) => {
      const t = i / 100 * Math.PI * 2;
      return kind === 0
        ? new THREE.Vector3(Math.sin(t) * 2.18, Math.sin(t * 2) * 0.62, Math.cos(t) * 1.73)
        : new THREE.Vector3(Math.cos(t) * 2.14, Math.sin(t) * 1.16, Math.sin(t) * 1.25);
    }), true));
    const positions: number[] = [];
    for (const path of paths) {
      const points = path.getPoints(lowPower ? 90 : 180);
      for (let i = 1; i < points.length; i++) positions.push(...points[i - 1].toArray(), ...points[i].toArray());
    }
    return { paths, positions: new Float32Array(positions), packetPositions: new Float32Array(lowPower ? 3 : 6) };
  }, [lowPower]);
  const point = useMemo(() => new THREE.Vector3(), []);
  /* oxlint-disable react/react-compiler -- Frame updates write preallocated GPU buffers/uniforms, not React state. */
  useFrame(() => {
    if (material.current) material.current.uniforms.uReveal.value = opening ? reveal(opening.current.frame.globeRevealProgress, 0.18, 0.5) : reveal(clock.current.elapsed, INTRO.atmosphere + 0.2);
    if (dots.current && !reducedMotion) {
      for (let i = 0; i < packetPositions.length / 3; i++) {
        paths[i].getPointAt((clock.current.motion * 0.012 + 0.12 + i * 0.38) % 1, point);
        point.toArray(packetPositions, i * 3);
      }
      dots.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  /* oxlint-enable react/react-compiler */
  return (
    <group rotation={[-0.18, 0.18, -0.12]}>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
        <shaderMaterial ref={material} uniforms={uniforms}
          vertexShader="void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }"
          fragmentShader="uniform float uReveal; void main() { gl_FragColor = vec4(0.38, 0.64, 0.76, 0.13 * uReveal); }"
          transparent depthWrite={false} />
      </lineSegments>
      {!reducedMotion ? <points ref={dots}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[packetPositions, 3]} /></bufferGeometry>
        <pointsMaterial color="#adcddb" size={0.018} transparent opacity={0.6} depthWrite={false} />
      </points> : null}
    </group>
  );
}

function Routes({ lowPower, reducedMotion, clock, opening }: LayerProps) {
  const routes = useMemo(() => networkRoutes(lowPower), [lowPower]);
  const packets = useRef<THREE.Points>(null);
  const point = useMemo(() => new THREE.Vector3(), []);
  const uniforms = useMemo(() => ({ uElapsed: { value: 0 }, uMotion: { value: 0 }, uActivation: { value: 1 }, uOpening: { value: -1 } }), []);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { positions, progress, indices, packetPositions } = useMemo(() => {
    const positions: number[] = []; const progress: number[] = []; const indices: number[] = [];
    const steps = lowPower ? 40 : 88;
    routes.forEach((curve, index) => {
      const points = curve.getPoints(steps);
      for (let i = 1; i < points.length; i++) {
        positions.push(...points[i - 1].toArray(), ...points[i].toArray());
        progress.push((i - 1) / steps, i / steps); indices.push(index, index);
      }
    });
    return { positions: new Float32Array(positions), progress: new Float32Array(progress), indices: new Float32Array(indices), packetPositions: new Float32Array(routes.length * 3) };
  }, [routes, lowPower]);
  /* oxlint-disable react/react-compiler -- Frame updates write preallocated GPU buffers/uniforms, not React state. */
  useFrame(() => {
    if (material.current) {
      material.current.uniforms.uElapsed.value = clock.current.elapsed;
      material.current.uniforms.uMotion.value = clock.current.motion;
      material.current.uniforms.uActivation.value = opening ? 0.28 + 0.72 * opening.current.frame.activationProgress : 1;
      material.current.uniforms.uOpening.value = opening?.current.frame.globeRevealProgress ?? -1;
    }
    if (packets.current && !reducedMotion) {
      routes.forEach((curve, i) => {
        const elapsed = opening ? clock.current.motion : Math.max(0, clock.current.elapsed - INTRO.routes - i * 0.15 - 0.6);
        curve.getPointAt((elapsed * 0.065) % 1, point);
        if (elapsed === 0) point.set(0, 0, 0); // Hidden within the globe until connected.
        point.toArray(packetPositions, i * 3);
      });
      packets.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  /* oxlint-enable react/react-compiler */
  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aProgress" args={[progress, 1]} />
          <bufferAttribute attach="attributes-aRoute" args={[indices, 1]} />
        </bufferGeometry>
        <shaderMaterial ref={material} uniforms={uniforms}
          vertexShader={`attribute float aProgress; attribute float aRoute; varying float vProgress; varying float vRoute;
            void main() { vProgress = aProgress; vRoute = aRoute; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
          fragmentShader={`uniform float uElapsed; uniform float uMotion; uniform float uActivation; uniform float uOpening; varying float vProgress; varying float vRoute;
            void main() {
              float reveal = uOpening < 0.0 ? clamp((uElapsed - 2.5 - vRoute * 0.15) / 0.6, 0.0, 1.0) : clamp((uOpening - 0.36 - vRoute * 0.055) / 0.42, 0.0, 1.0);
              float alpha = (1.0 - smoothstep(reveal - 0.04, reveal, vProgress)) * step(0.01, reveal);
              float packet = fract(max(0.0, uMotion - (uOpening < 0.0 ? 3.1 + vRoute * 0.15 : 0.0)) * 0.065);
              float trail = exp(-pow((vProgress - packet) * 30.0, 2.0));
              gl_FragColor = vec4(0.42, 0.78, 0.91, alpha * (0.19 + trail * 0.3) * uActivation);
            }`}
          transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
      {!reducedMotion ? <points ref={packets}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[packetPositions, 3]} /></bufferGeometry>
        <shaderMaterial
          vertexShader={`void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = 5.0; gl_Position = projectionMatrix * mv; }`}
          fragmentShader={`void main() { float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(0.69, 0.9, 1.0, (1.0 - smoothstep(0.02, 0.5, d)) * 0.85); }`}
          transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points> : null}
    </group>
  );
}

export default function DataStreams(props: LayerProps) {
  return <group><Routes {...props} /><BrandOrbits {...props} /></group>;
}
