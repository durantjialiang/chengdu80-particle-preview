'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
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
import { getUniversity } from '@/content/network';
import { universityLocation, universityName } from '@/content/university-i18n';
import { useSiteLanguage } from '@/hooks/use-site-language';

class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.error('University globe render failure:', error.message);
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Runtime({
  host,
  onReady,
  onFailure,
  onDegrade,
  active,
  reducedMotion,
}: {
  host: React.RefObject<HTMLDivElement | null>;
  onReady: () => void;
  onFailure: () => void;
  onDegrade: () => void;
  active: boolean;
  reducedMotion: boolean;
}) {
  const { gl, invalidate } = useThree();
  const sample = useRef({
    frames: 0,
    seconds: 0,
    slowWindows: 0,
    ready: false,
    warmup: 0,
    bootFrames: 0,
  });
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener('webglcontextlost', lost, false);
    return () => {
      canvas.removeEventListener('webglcontextlost', lost);
    };
  }, [gl, onFailure]);
  useEffect(() => {
    if (active || reducedMotion) invalidate();
  }, [active, reducedMotion, invalidate]);
  /* oxlint-disable react/react-compiler -- Diagnostic DOM attributes update at most once per two seconds, outside React rendering. */
  useFrame((_, delta) => {
    const current = sample.current;
    // The first frame keeps the fallback; reveal WebGL after it has rendered once.
    if (!current.ready && current.bootFrames > 0) {
      current.ready = true;
      onReady();
    }
    if (!current.ready) {
      current.bootFrames++;
      invalidate();
    }
    if (!active || reducedMotion || delta > 0.15) return;
    current.warmup += delta;
    if (current.warmup < 4) return;
    current.frames++;
    current.seconds += delta;
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
    current.frames = 0;
    current.seconds = 0;
  });
  /* oxlint-enable react/react-compiler */
  return null;
}

export default function Scene({
  lowPower,
  reducedMotion,
  active,
  opening,
  network,
}: GlobeProps) {
  const { language } = useSiteLanguage();
  const host = useRef<HTMLDivElement>(null);
  const globe = useRef<THREE.Group>(null);
  const pointer = useRef({
    x: 0,
    y: 0,
    dragging: false,
    dragX: 0,
    dragY: 0,
  });
  const dragPointerId = useRef<number | null>(null);
  const dragLast = useRef({ x: 0, y: 0 });
  const clock = useRef<SceneClock>({ elapsed: 0, motion: 0 });
  const labels = useRef(new Map<string, HTMLDivElement>());
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [failureReason, setFailureReason] = useState('');
  const [degraded, setDegraded] = useState(false);
  const qualityLow = lowPower || degraded;
  /* oxlint-disable react/react-compiler -- Readiness is an imperative cross-renderer handshake, not React state mutation. */
  const onReady = useCallback(() => {
    setReady(true);
    if (opening) opening.current.ready = true;
  }, [opening]);
  const onFailure = useCallback(() => {
    setFailed(true);
    setFailureReason((reason) => reason || 'webgl-unavailable');
    if (opening) {
      opening.current.ready = true;
      opening.current.fallback = true;
    }
  }, [opening]);
  /* oxlint-enable react/react-compiler */
  const onDegrade = useCallback(() => {
    setDegraded(true);
  }, []);
  const props = {
    lowPower: qualityLow,
    reducedMotion,
    active,
    clock,
    opening,
    network,
  };
  // Canvas' unsupported-WebGL fallback does not throw into a React boundary.
  useEffect(() => {
    if (ready || failed || (!active && !reducedMotion)) return;
    const timeout = window.setTimeout(() => {
      setFailureReason('render-boot-timeout');
      onFailure();
    }, 8000);
    return () => window.clearTimeout(timeout);
  }, [opening, ready, failed, onFailure, active, reducedMotion]);

  return (
    <div
      ref={host}
      className={`globe-canvas ${styles.scene}`}
      data-spatial-ready={ready && !failed}
      data-quality={qualityLow ? 'low' : 'full'}
      data-render-state={
        failed
          ? 'fallback'
          : !active
            ? 'paused'
            : reducedMotion
              ? 'static'
              : 'animated'
      }
      data-network-explorer={Boolean(network)}
      data-focused-university={network?.focusId}
      data-highlighted-university={network?.highlightedId}
      data-fallback-reason={failureReason || undefined}
      onPointerDown={(event) => {
        if (!network) return;
        network.onInteraction?.('pointer');
        // Labels are regular HTML buttons. Let their click/focus behaviour
        // pass through without turning a click into a globe drag.
        if (
          (event.target instanceof Element && event.target.closest('button')) ||
          event.button !== 0 ||
          reducedMotion
        )
          return;
        dragPointerId.current = event.pointerId;
        pointer.current.dragging = true;
        pointer.current.dragX = 0;
        pointer.current.dragY = 0;
        dragLast.current.x = event.clientX;
        dragLast.current.y = event.clientY;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (
          network &&
          pointer.current.dragging &&
          dragPointerId.current === event.pointerId
        ) {
          pointer.current.dragX += event.clientX - dragLast.current.x;
          pointer.current.dragY += event.clientY - dragLast.current.y;
          dragLast.current.x = event.clientX;
          dragLast.current.y = event.clientY;
          network.onInteraction?.('drag');
          return;
        }
        if (
          network ||
          reducedMotion ||
          event.pointerType === 'touch' ||
          (opening && opening.current.frame.interactionOwner !== 'globe')
        )
          return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointer.current.x = THREE.MathUtils.clamp(
          ((event.clientX - rect.left) / rect.width - 0.5) * 2,
          -1,
          1,
        );
        pointer.current.y = THREE.MathUtils.clamp(
          ((event.clientY - rect.top) / rect.height - 0.5) * 2,
          -1,
          1,
        );
      }}
      onPointerUp={(event) => {
        if (dragPointerId.current !== event.pointerId) return;
        pointer.current.dragging = false;
        dragPointerId.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId))
          event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={(event) => {
        if (dragPointerId.current !== event.pointerId) return;
        pointer.current.dragging = false;
        dragPointerId.current = null;
      }}
      onPointerLeave={() => {
        pointer.current.x = 0;
        pointer.current.y = 0;
      }}
      aria-hidden={network ? undefined : true}
      aria-label={
        network
          ? 'Interactive university globe. Select a university node or use the adjacent cards.'
          : undefined
      }
    >
      <div className={styles.fallback}>
        <StaticNetwork network={network} />
      </div>
      {!failed ? (
        <SceneBoundary onFailure={onFailure}>
          <Canvas
            camera={{
              position: [-0.62, 0.46, 6.15],
              fov: lowPower ? 42 : 37,
              near: 0.1,
              far: 30,
            }}
            dpr={degraded ? 0.85 : qualityLow ? 1 : [1, 1.5]}
            gl={{
              antialias: !lowPower,
              alpha: true,
              powerPreference: lowPower ? 'low-power' : 'high-performance',
              stencil: false,
            }}
            frameloop={
              !active ||
              (reducedMotion &&
                (!opening || opening.current.frame.state === 'GLOBE_ACTIVE'))
                ? 'demand'
                : 'always'
            }
            fallback={
              <div>University network is available in the cards below.</div>
            }
            onCreated={({ gl }) => {
              gl.setClearColor('#020711', 0);
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 0.92;
              // Shader errors do not enter React error boundaries; fail safely too.
              gl.debug.onShaderError = (
                context,
                _program,
                vertex,
                fragment,
              ) => {
                console.error(
                  'Globe shader:',
                  context.getShaderInfoLog(vertex),
                  context.getShaderInfoLog(fragment),
                );
                queueMicrotask(() => {
                  setFailureReason('shader');
                  onFailure();
                });
              };
            }}
          >
            <Suspense fallback={null}>
              <CameraController {...props} globe={globe} pointer={pointer} />
              <Particles {...props} pointer={pointer} />
              <group ref={globe} rotation={[...INITIAL_TILT]}>
                <Globe {...props} />
                <Atmosphere {...props} />
                <ParticleNetwork {...props} labels={labels} />
              </group>
              <Runtime
                host={host}
                onReady={onReady}
                onFailure={onFailure}
                onDegrade={onDegrade}
                active={active}
                reducedMotion={reducedMotion}
              />
              {opening ? (
                <OpeningTargets
                  opening={opening}
                  globe={globe}
                  host={host}
                  lowPower={qualityLow}
                />
              ) : null}
            </Suspense>
          </Canvas>
        </SceneBoundary>
      ) : null}
      <div className={styles.labels}>
        {networkCities(qualityLow, Boolean(network), network?.nodes).map(
          (city) => {
            const activeId = network?.highlightedId ?? network?.selectedId;
            const selectedMember = city.universityIds.find(
              (id) => id === network?.selectedId,
            );
            const activeMember = city.universityIds.find(
              (id) => id === activeId,
            );
            const firstMember = city.universityIds[0];
            const displayMember = selectedMember ?? activeMember ?? firstMember;
            const record = displayMember ? getUniversity(displayMember) : null;
            const cityLabel = record
              ? universityLocation(record, language).split(' · ')[0]
              : city.city;
            const concise =
              city.universityIds.length > 1
                ? `${cityLabel} · ${city.universityIds.length} ${
                    language === 'zh' ? '所高校' : 'universities'
                  }`
                : record
                  ? language === 'zh'
                    ? universityName(record, language)
                    : record.shortName
                  : city.name;
            const expandedName = record
              ? universityName(record, language)
              : concise;
            const expandedLocation = record
              ? universityLocation(record, language)
              : cityLabel;
            const isSelected = Boolean(selectedMember && network);
            const isExpanded = Boolean(
              (selectedMember || activeMember) && network,
            );
            const selectLabel = language === 'zh' ? '在地球上选择' : 'Select';
            const accessibleName =
              city.universityIds.length > 1
                ? `${concise}: ${city.universityIds
                    .map((id) => {
                      const university = getUniversity(id);
                      return `${universityName(university, language)}, ${universityLocation(university, language)}`;
                    })
                    .join('; ')}`
                : `${expandedName}, ${expandedLocation}`;
            return (
              <div
                key={city.id}
                ref={(element) => {
                  if (element) labels.current.set(city.name, element);
                  else labels.current.delete(city.name);
                }}
                className={
                  network
                    ? styles.nodeLabel
                    : city.isOrigin
                      ? styles.origin
                      : styles.city
                }
              >
                {network ? (
                  <>
                    <i aria-hidden="true" />
                    <button
                      type="button"
                      data-node={city.id}
                      data-universities={city.universityIds.join(',')}
                      disabled={city.universityIds.length === 0}
                      tabIndex={-1}
                      aria-label={`${selectLabel} ${accessibleName}${language === 'zh' ? '' : ' on globe'}`}
                      aria-pressed={city.universityIds.includes(
                        network.selectedId,
                      )}
                      data-highlighted={city.universityIds.includes(
                        network.highlightedId!,
                      )}
                      data-selected={isSelected}
                      data-expanded={isExpanded}
                      data-hub={city.isOrigin}
                      onPointerEnter={() => {
                        network.onNodeHover(city.id);
                      }}
                      onPointerLeave={() => network.onNodeHover(null)}
                      onFocus={() => {
                        network.onInteraction?.('keyboard');
                        network.onNodeHover(city.id);
                      }}
                      onBlur={() => network.onNodeHover(null)}
                      onKeyDown={(event) => {
                        if (event.key !== 'Enter' && event.key !== ' ') return;
                        event.preventDefault();
                        network.onInteraction?.('keyboard');
                        network.onNodeSelect(city.id);
                      }}
                      onClick={() => {
                        network.onInteraction?.('pointer');
                        network.onNodeSelect(city.id);
                      }}
                    >
                      <span className={styles.conciseLabel}>{concise}</span>
                      <span className={styles.expandedLabel}>
                        {isSelected && record ? (
                          record.logo ? (
                            /* oxlint-disable next/no-img-element -- The Vite preview serves bounded local logo assets directly. */
                            <img
                              className={styles.nodeLogo}
                              data-surface={record.logoSurface}
                              src={record.logo}
                              alt=""
                              width="36"
                              height="30"
                              loading="lazy"
                            />
                          ) : (
                            /* oxlint-enable next/no-img-element */
                            <span className={styles.nodeLogoFallback}>
                              {record.shortName}
                            </span>
                          )
                        ) : null}
                        <span className={styles.expandedCopy}>
                          <strong>{expandedName}</strong>
                          <small>{expandedLocation}</small>
                        </span>
                      </span>
                    </button>
                  </>
                ) : city.isOrigin ? (
                  <>
                    <span>
                      ORIGIN <i>{'//'}</i> CHENGDU
                    </span>
                    <small>GLOBAL FINTECH NETWORK</small>
                  </>
                ) : (
                  <span>{city.name}</span>
                )}
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}
