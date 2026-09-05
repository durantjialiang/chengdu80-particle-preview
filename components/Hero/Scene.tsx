'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Component, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import Globe from './Globe';
import Atmosphere from './Atmosphere';
import ParticleNetwork from '@/components/ParticleNetwork';
import Particles from './Particles';
import CameraController from './CameraController';
import { networkCities } from './geometry';
import { INITIAL_TILT, type GlobeProps, type SceneClock } from './scene-config';
import styles from './Scene.module.css';
import StaticNetwork from './StaticNetwork';
import OpeningTargets from './OpeningTargets';

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Runtime({ host, onReady, onFailure, onDegrade, active, reducedMotion }: {
  host: React.RefObject<HTMLDivElement | null>;
  onReady: () => void; onFailure: () => void; onDegrade: () => void;
  active: boolean; reducedMotion: boolean;
}) {
  const { gl, invalidate } = useThree();
  const sample = useRef({ frames: 0, seconds: 0, slowWindows: 0, ready: false, warmup: 0, bootFrames: 0 });
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    canvas.addEventListener('webglcontextlost', lost, false);
    return () => { canvas.removeEventListener('webglcontextlost', lost); };
  }, [gl, onFailure]);
  useEffect(() => { if (active || reducedMotion) invalidate(); }, [active, reducedMotion, invalidate]);
  /* oxlint-disable react/react-compiler -- Diagnostic DOM attributes update at most once per two seconds, outside React rendering. */
  useFrame((_, delta) => {
    const current = sample.current;
    // The first frame keeps the fallback; reveal WebGL after it has rendered once.
    if (!current.ready && current.bootFrames > 0) { current.ready = true; onReady(); }
    if (!current.ready) { current.bootFrames++; invalidate(); }
    if (!active || reducedMotion || delta > 0.15) return;
    current.warmup += delta;
    if (current.warmup < 4) return;
    current.frames++; current.seconds += delta;
    if (current.seconds < 2) return;
    const fps = current.frames / current.seconds;
    if (host.current) {
      host.current.dataset.fps = fps.toFixed(1);
      host.current.dataset.drawCalls = String(gl.info.render.calls);
      host.current.dataset.triangles = String(gl.info.render.triangles);
      host.current.dataset.dpr = String(gl.getPixelRatio());
    }
    current.slowWindows = fps < 46 ? current.slowWindows + 1 : 0;
    if (current.slowWindows === 2) onDegrade();
    current.frames = 0; current.seconds = 0;
  });
  /* oxlint-enable react/react-compiler */
  return null;
}

export default function Scene({ lowPower, reducedMotion, active, opening }: GlobeProps) {
  const host = useRef<HTMLDivElement>(null);
  const globe = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const clock = useRef<SceneClock>({ elapsed: 0, motion: 0 });
  const labels = useRef(new Map<string, HTMLDivElement>());
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [degraded, setDegraded] = useState(false);
  const qualityLow = lowPower || degraded;
  /* oxlint-disable react/react-compiler -- Readiness is an imperative cross-renderer handshake, not React state mutation. */
  const onReady = useCallback(() => { setReady(true); if (opening) opening.current.ready = true; }, [opening]);
  const onFailure = useCallback(() => { setFailed(true); if (opening) { opening.current.ready = true; opening.current.fallback = true; } }, [opening]);
  /* oxlint-enable react/react-compiler */
  const onDegrade = useCallback(() => { setDegraded(true); }, []);
  const props = { lowPower: qualityLow, reducedMotion, active, clock, opening };
  // Canvas' unsupported-WebGL fallback does not throw into a React boundary.
  useEffect(() => {
    if (!opening || ready || failed) return;
    const timeout = window.setTimeout(() => { if (!opening.current.ready) onFailure(); }, 8000);
    return () => window.clearTimeout(timeout);
  }, [opening, ready, failed, onFailure]);

  return (
    <div ref={host} className={`globe-canvas ${styles.scene}`}
      data-spatial-ready={ready && !failed} data-quality={qualityLow ? 'low' : 'full'}
      data-render-state={failed ? 'fallback' : !active ? 'paused' : reducedMotion ? 'static' : 'animated'}
      onPointerMove={event => {
        if (reducedMotion || event.pointerType === 'touch' || (opening && opening.current.frame.interactionOwner !== 'globe')) return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointer.current.x = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
        pointer.current.y = THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
      }}
      onPointerLeave={() => { pointer.current.x = 0; pointer.current.y = 0; }}
      aria-hidden="true">
      <div className={styles.fallback}><StaticNetwork/></div>
      {!failed ? <SceneBoundary onFailure={onFailure}>
        <Canvas camera={{ position: [-0.62, 0.46, 6.15], fov: lowPower ? 42 : 37, near: 0.1, far: 30 }}
          dpr={degraded ? 0.85 : qualityLow ? 1 : [1, 1.5]}
          gl={{ antialias: !lowPower, alpha: true, powerPreference: lowPower ? 'low-power' : 'high-performance', stencil: false }}
          frameloop={!active || (reducedMotion && (!opening || opening.current.frame.state === 'GLOBE_ACTIVE')) ? 'demand' : 'always'}
          fallback={<div />}
          onCreated={({ gl }) => {
            gl.setClearColor('#020711', 0);
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 0.92;
            // Shader errors do not enter React error boundaries; fail safely too.
            gl.debug.onShaderError = () => { queueMicrotask(onFailure); };
          }}>
          <Suspense fallback={null}>
            <CameraController {...props} globe={globe} pointer={pointer} />
            <Particles {...props} pointer={pointer} />
            <group ref={globe} rotation={[...INITIAL_TILT]}>
              <Globe {...props} />
              <Atmosphere {...props} />
              <ParticleNetwork {...props} labels={labels} />
            </group>
            <Runtime host={host} onReady={onReady} onFailure={onFailure} onDegrade={onDegrade} active={active} reducedMotion={reducedMotion} />
            {opening ? <OpeningTargets opening={opening} globe={globe} host={host} lowPower={qualityLow} /> : null}
          </Suspense>
        </Canvas>
      </SceneBoundary> : null}
      <div className={styles.labels}>
        {networkCities(qualityLow).map(city => <div key={city.name}
          ref={element => { if (element) labels.current.set(city.name, element); else labels.current.delete(city.name); }}
          className={city.isOrigin ? styles.origin : styles.city}>
          {city.isOrigin ? <><span>ORIGIN <i>{'//'}</i> CHENGDU</span><small>GLOBAL FINTECH NETWORK</small></> : <span>{city.name}</span>}
        </div>)}
      </div>
    </div>
  );
}
