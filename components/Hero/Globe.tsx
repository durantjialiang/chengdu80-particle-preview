'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { landPositions } from './geometry';
import { INTRO, RADIUS, reveal, sphereVertex, type LayerProps } from './scene-config';

const globeFragment = `
  uniform float uReveal;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec3 vLocal;
  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 L = normalize(vec3(-0.8, 0.95, 0.75));
    float ndv = max(dot(N, V), 0.0);
    float light = smoothstep(-0.4, 0.9, dot(N, L));
    float rim = pow(1.0 - ndv, 3.8);
    float sheen = pow(max(dot(N, normalize(L + V)), 0.0), 34.0);
    vec3 color = mix(vec3(0.004, 0.009, 0.022), vec3(0.024, 0.07, 0.115), light);
    color += vec3(0.17, 0.35, 0.46) * sheen * 0.18;
    color += vec3(0.10, 0.43, 0.65) * rim * (0.14 + light * 0.28);
    vec2 grid = vec2(atan(vLocal.z, vLocal.x) / 6.2831853 * 28.0,
                     asin(clamp(vLocal.y, -1.0, 1.0)) / 3.1415926 * 18.0);
    vec2 edge = abs(fract(grid + 0.5) - 0.5) / max(fwidth(grid), vec2(0.0001));
    float line = 1.0 - smoothstep(0.0, 0.85, min(edge.x, edge.y));
    color += vec3(0.12, 0.34, 0.46) * line * (0.07 + 0.09 * light) * smoothstep(0.0, 0.25, ndv);
    gl_FragColor = vec4(color * uReveal, uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export default function Globe({ lowPower, clock, opening }: LayerProps) {
  const points = useMemo(() => landPositions(lowPower), [lowPower]);
  const uniforms = useMemo(() => ({ uReveal: { value: 0 }, uOpacity: { value: 1 } }), []);
  const surface = useRef<THREE.ShaderMaterial>(null);
  const land = useRef<THREE.ShaderMaterial>(null);
  useFrame(() => {
    const value = opening ? reveal(opening.current.frame.globeRevealProgress, 0.12, 0.7) : 0.28 + 0.72 * reveal(clock.current.elapsed, INTRO.globe);
    if (surface.current) surface.current.uniforms.uReveal.value = value;
    if (surface.current) surface.current.uniforms.uOpacity.value = opening ? value : 1;
    if (land.current) land.current.uniforms.uReveal.value = value;
  });
  return (
    <group>
      <mesh>
        <sphereGeometry args={[RADIUS, lowPower ? 48 : 96, lowPower ? 32 : 64]} />
        <shaderMaterial ref={surface} vertexShader={sphereVertex} fragmentShader={globeFragment} uniforms={uniforms} transparent={Boolean(opening)} />
      </mesh>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[points, 3]} /></bufferGeometry>
        <shaderMaterial ref={land} uniforms={uniforms}
          vertexShader={`
            uniform float uReveal; varying float vAlpha;
            void main() {
              vec4 world = modelMatrix * vec4(position, 1.0);
              vec3 N = normalize(mat3(modelMatrix) * normalize(position));
              vec3 V = normalize(cameraPosition - world.xyz);
              float light = smoothstep(-0.4, 0.9, dot(N, normalize(vec3(-0.8, 0.95, 0.75))));
              vAlpha = smoothstep(0.03, 0.45, dot(N, V)) * (0.12 + light * 0.24) * uReveal;
              vec4 mv = viewMatrix * world;
              gl_PointSize = clamp(14.0 / -mv.z, 1.0, 3.2);
              gl_Position = projectionMatrix * mv;
            }`}
          fragmentShader={`varying float vAlpha;
            void main() { float d = length(gl_PointCoord - 0.5);
              gl_FragColor = vec4(0.48, 0.78, 0.88, (1.0 - smoothstep(0.22, 0.5, d)) * vAlpha); }`}
          transparent depthWrite={false} blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
