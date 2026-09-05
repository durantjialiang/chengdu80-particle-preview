'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Particle80, { type Particle80Props, type Particle80State } from './Particle80';
import { Button } from '@/components/ui/button';
import { useScenePreferences } from '@/hooks/use-scene-preferences';
import { useBrandOpening } from '@/hooks/use-brand-opening';
import { createOpeningBridge, sampleOpening, openingConfig, type OpeningConfig, type OpeningBridgeRef, type OpeningFrame } from '@/lib/brand-opening';
import styles from './Particle80Intro.module.css';

const VISIT_KEY = 'chengdu80:innovation-field:seen:v2';
export type HandoffContext = { opening: OpeningBridgeRef; state: OpeningFrame['state']; reducedMotion: boolean; lowPower: boolean };
export type Particle80IntroProps = Particle80Props & Partial<OpeningConfig> & {
  repeatVisit?: 'short' | 'skip' | 'always';
  handoffContent?: ReactNode | ((context: HandoffContext) => ReactNode);
  onContinue?: () => void; onHandoffComplete?: () => void;
  onOpeningProgress?: (frame: OpeningFrame) => void;
};

function IntroSurface({
  repeatVisit = 'short', handoffContent, onContinue, onHandoffComplete,
  onOpeningProgress, onStateChange, introEnabled = true, introDuration,
  leadInDuration, formationDuration, settleDuration, holdDuration,
  dissolveDuration, globeRevealDuration, transitionDuration,
  autoTransitionEnabled = true, active = true, className = '', ...particleProps
}: Omit<Particle80IntroProps, 'enabled'>) {
  const preferences = useScenePreferences();
  const [visit, setVisit] = useState({ ready: false, seen: false });
  const host = useRef<HTMLDivElement>(null);
  const destination = useRef<HTMLDivElement>(null);
  const seen = useRef(false);
  const manuallyContinued = useRef(false);
  const staticMotion = preferences.reducedMotion || particleProps.reducedMotionMode === 'static' || particleProps.motion === 'still';
  const lowPower = preferences.lowPower || particleProps.lowPowerMode === 'on' || particleProps.quality === 'low';
  useEffect(() => {
    let prior = false, cancelled = false;
    try { prior = localStorage.getItem(VISIT_KEY) === '1'; } catch { /* Storage is optional. */ }
    queueMicrotask(() => { if (!cancelled) setVisit({ ready: true, seen: prior }); });
    return () => { cancelled = true; };
  }, []);
  const config = useMemo(() => {
    const result = openingConfig({ leadInDuration, formationDuration: formationDuration ?? introDuration, settleDuration, holdDuration, dissolveDuration, globeRevealDuration, transitionDuration, autoTransitionEnabled }, lowPower, staticMotion);
    if (!introEnabled || (visit.seen && repeatVisit === 'skip')) Object.assign(result, { leadInDuration: 0, formationDuration: 0, settleDuration: 0 });
    else if (visit.seen && repeatVisit === 'short' && !staticMotion) Object.assign(result, { leadInDuration: 0.1, formationDuration: 1, settleDuration: 0.3 });
    return result;
  }, [leadInDuration, formationDuration, introDuration, settleDuration, holdDuration, dissolveDuration, globeRevealDuration, transitionDuration, autoTransitionEnabled, lowPower, staticMotion, introEnabled, visit.seen, repeatVisit]);
  const reportOpening = useCallback((frame: OpeningFrame) => {
    if (frame.state === 'HOLDING_80' && !seen.current) {
      seen.current = true;
      try { localStorage.setItem(VISIT_KEY, '1'); } catch { /* Never gate content on storage. */ }
    }
    onOpeningProgress?.(frame);
  }, [onOpeningProgress]);
  const complete = useCallback(() => {
    if (manuallyContinued.current) destination.current?.focus({ preventScroll: true });
    onHandoffComplete?.();
  }, [onHandoffComplete]);
  const { bridge, state, requestHandoff } = useBrandOpening(config, {
    active: active && visit.ready && preferences.pageVisible, reduced: staticMotion,
    hasDestination: Boolean(handoffContent), host, onProgress: reportOpening, onComplete: complete,
  });
  const finished = state === 'GLOBE_ACTIVE';
  const transitioning = state === 'DISSOLVING_80' || state === 'HANDOFF_TO_GLOBE';
  /* oxlint-disable react/react-compiler -- Explicit mutable renderer bridge, written only in an effect. */
  useEffect(() => {
    if (handoffContent && typeof handoffContent !== 'function') { bridge.current.ready = true; bridge.current.fallback = true; }
  }, [handoffContent, bridge]);
  /* oxlint-enable react/react-compiler */
  const reportParticle = useCallback((particleState: Particle80State) => { onStateChange?.(particleState); }, [onStateChange]);

  return <div ref={host} className={styles.container + ' ' + className}
    data-intro-state={state} data-intro-finished={finished} data-reduced={staticMotion}
    data-auto-transition={config.autoTransitionEnabled} data-formation-duration={config.formationDuration}
    data-hold-duration={config.holdDuration} data-dissolve-duration={config.dissolveDuration}
    data-globe-reveal-duration={config.globeRevealDuration}>
    {handoffContent ? <div ref={destination} tabIndex={-1} className={styles.destination} inert={!finished} aria-hidden={!finished}>
      {typeof handoffContent === 'function' ? handoffContent({ opening: bridge, state, reducedMotion: staticMotion, lowPower }) : handoffContent}
    </div> : null}
    <section className={styles.intro} aria-label="Chengdu 80 signature introduction">
      <header className={styles.header}><h1>CHENGDU 80</h1><span>2026</span></header>
      <div className={styles.composition} aria-hidden={finished || undefined}>
        <div className={styles.identity + ' ' + styles.swufe}>
          <p className={styles.acronym}>SWUFE</p>
          <p className={styles.fullName}>Southwestern University of<br className={styles.desktopBreak} /> Finance and Economics</p>
        </div>
        <div className={styles.field}>
          {!finished ? <Particle80 {...particleProps} opening={bridge}
            active={active && visit.ready} interactive={particleProps.interactive ?? true}
            intensity={particleProps.intensity ?? 1.18} brightnessPreset={particleProps.brightnessPreset ?? 'B'}
            viewScale={particleProps.viewScale ?? 1.72} introEnabled={introEnabled}
            introDuration={config.formationDuration || 0.5} onStateChange={reportParticle}
            className={styles.particles} /> : null}
        </div>
        <div className={styles.identity + ' ' + styles.fic}>
          <p className={styles.acronym}>FIC</p>
          <p className={styles.fullName}>Fintech Innovation Center</p>
        </div>
      </div>
      <footer className={styles.footer} aria-hidden={finished || undefined} inert={finished}>
        <div className={styles.caption}><p>CHENGDU 80</p><span>Innovation ecosystem</span></div>
        {handoffContent || onContinue ? <Button variant="outline" className={styles.continue}
          onClick={() => { manuallyContinued.current = true; if (handoffContent) requestHandoff(); onContinue?.(); }}>
          {transitioning ? 'Connecting the network' : 'Explore Chengdu 80'} <span aria-hidden="true">↗</span>
        </Button> : null}
        <p className={styles.pointerHint}>Move gently through the light</p>
      </footer>
    </section>
  </div>;
}

function activeBridge() {
  const value = createOpeningBridge();
  value.frame = sampleOpening(100, openingConfig());
  value.ready = true;
  return value;
}
function GlobeOnly({ render }: { render: (context: HandoffContext) => ReactNode }) {
  const opening = useRef(activeBridge());
  const { reducedMotion, lowPower } = useScenePreferences();
  // oxlint-disable-next-line react/react-compiler -- Passes an opaque ref handle to the R3F renderer; no current value is read here.
  return render({ opening, state: 'GLOBE_ACTIVE', reducedMotion, lowPower });
}
export default function Particle80Intro({ enabled = true, ...props }: Particle80IntroProps) {
  if (!enabled && typeof props.handoffContent === 'function') return <GlobeOnly render={props.handoffContent} />;
  if (!enabled && typeof props.handoffContent !== 'function') return props.handoffContent ?? null;
  return <IntroSurface {...props} introEnabled={enabled && props.introEnabled !== false} />;
}
