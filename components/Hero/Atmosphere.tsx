'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { INTRO, RADIUS, reveal, sphereVertex, type LayerProps } from './scene-config';

export default function Atmosphere({ lowPower, clock, opening }: LayerProps) {
  const uniforms = useMemo(() => ({ uReveal: { value: 0 } }), []);
  const outer = useRef<THREE.ShaderMaterial>(null);
  const inner = useRef<THREE.ShaderMaterial>(null);
  useFrame(() => {
    const value = opening ? reveal(opening.current.frame.globeRevealProgress, 0, 0.6) : reveal(clock.current.elapsed, INTRO.atmosphere, 0.8);
    if (outer.current) outer.current.uniforms.uReveal.value = value;
    if (inner.current) inner.current.uniforms.uReveal.value = value;
  });
  return (
    <group>
      <mesh>
        <sphereGeometry args={[RADIUS * 1.075, lowPower ? 40 : 72, lowPower ? 24 : 48]} />
        <shaderMaterial ref={outer} uniforms={uniforms} vertexShader={sphereVertex}
          fragmentShader={`
            uniform float uReveal; varying vec3 vNormal; varying vec3 vWorld;
            void main() {
              vec3 N = normalize(vNormal); vec3 V = normalize(cameraPosition - vWorld);
              float edge = abs(dot(N, V));
              float halo = pow(1.0 - edge, 3.5) * smoothstep(0.0, 0.18, edge);
              float light = 0.35 + 0.65 * smoothstep(-0.6, 0.8, dot(N, normalize(vec3(-0.8, 0.9, 0.7))));
              gl_FragColor = vec4(0.19, 0.53, 0.82, halo * light * 0.33 * uReveal);
            }`}
          side={THREE.BackSide} transparent depthWrite={false} blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[RADIUS * 1.008, lowPower ? 40 : 72, lowPower ? 24 : 48]} />
        <shaderMaterial ref={inner} uniforms={uniforms} vertexShader={sphereVertex}
          fragmentShader={`
            uniform float uReveal; varying vec3 vNormal; varying vec3 vWorld;
            void main() {
              vec3 N = normalize(vNormal);
              float rim = pow(1.0 - max(dot(N, normalize(cameraPosition - vWorld)), 0.0), 4.0);
              float light = smoothstep(-0.5, 0.8, dot(N, normalize(vec3(-0.8, 0.9, 0.7))));
              gl_FragColor = vec4(0.37, 0.69, 0.9, rim * (0.035 + 0.16 * light) * uReveal);
            }`}
          transparent depthWrite={false} blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
