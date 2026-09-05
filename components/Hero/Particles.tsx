'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { seededRandom } from './geometry';
import { INTRO, reveal, type LayerProps, type ScenePointer } from './scene-config';

export default function Particles({ lowPower, clock, pointer, reducedMotion }: LayerProps & { pointer: RefObject<ScenePointer> }) {
  const group = useRef<THREE.Points>(null);
  const uniforms = useMemo(() => ({ uReveal: { value: 0 } }), []);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { positions, sizes } = useMemo(() => {
    const random = seededRandom(802026); const count = lowPower ? 52 : 218;
    const positions = new Float32Array(count * 3); const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const foreground = i < (lowPower ? 4 : 12);
      positions.set([(random() - 0.5) * 9.5, (random() - 0.5) * 7.5, foreground ? 1.5 + random() : -3 - random() * 4], i * 3);
      sizes[i] = foreground ? 2 + random() : 0.6 + random() * 1.5;
    }
    return { positions, sizes };
  }, [lowPower]);
  useFrame(() => {
    if (material.current) material.current.uniforms.uReveal.value = reveal(clock.current.elapsed, INTRO.particles);
    if (group.current && !reducedMotion) {
      group.current.position.x = Math.sin(clock.current.motion * 0.022) * 0.04 + pointer.current.x * 0.014;
      group.current.position.y = Math.sin(clock.current.motion * 0.018) * 0.025 - pointer.current.y * 0.01;
    }
  });
  return (
    <points ref={group}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={material} uniforms={uniforms}
        vertexShader={`attribute float aSize; varying float vNear;
          void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNear = step(0.0, position.z); gl_PointSize = aSize * (vNear > 0.5 ? 1.3 : 1.0);
            gl_Position = projectionMatrix * mv; }`}
        fragmentShader={`uniform float uReveal; varying float vNear;
          void main() { float d = length(gl_PointCoord - 0.5);
            gl_FragColor = vec4(0.55, 0.76, 0.87, (1.0 - smoothstep(0.0, 0.5, d)) * mix(0.24, 0.13, vNear) * uReveal); }`}
        transparent depthWrite={false} blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
