'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { type Particle80Props, type Particle80State } from './Particle80';
import PersistentParticleBackdrop from './PersistentParticleBackdrop';
import { useScenePreferences } from '@/hooks/use-scene-preferences';
import { useBrandOpening } from '@/hooks/use-brand-opening';
import { useParticleStoryScroll } from '@/hooks/use-particle-story-scroll';
import { siteContent } from '@/content/site';
import { openingConfig, type OpeningConfig, type OpeningFrame } from '@/lib/brand-opening';
import styles from './Particle80Intro.module.css';

const VISIT_KEY = 'chengdu80:innovation-field:seen:v2';
export type Particle80IntroProps = Particle80Props & Partial<OpeningConfig> & {
  repeatVisit?: 'short' | 'skip' | 'always';
  /** Legacy disabled-component content only, never a globe handoff. */
  handoffContent?: ReactNode;
  onContinue?: () => void; onHandoffComplete?: () => void;
  onOpeningProgress?: (frame: OpeningFrame) => void;
  introduction?: ReactNode;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
};

function IntroSurface({
  repeatVisit = 'short', onContinue, introduction, headerContent, footerContent,
  onOpeningProgress, onStateChange, introEnabled = true, introDuration,
  leadInDuration, formationDuration, settleDuration, holdDuration,
  dissolveDuration, globeRevealDuration, transitionDuration,
  autoTransitionEnabled: _legacyAuto = false, handoffContent: _legacyDestination,
  onHandoffComplete: _legacyComplete, active = true, className = '', ...particleProps
}: Omit<Particle80IntroProps, 'enabled'>) {
  const preferences = useScenePreferences();
  const [visit, setVisit] = useState({ ready: false, seen: false });
  const host = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const composition = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const seen = useRef(false);
  const staticMotion = preferences.reducedMotion || particleProps.reducedMotionMode === 'static' || particleProps.motion === 'still';
  const lowPower = preferences.lowPower || particleProps.lowPowerMode === 'on' || particleProps.quality === 'low';
  const story = useParticleStoryScroll({ host, hero, composition, content, reduced: staticMotion });
  useEffect(() => {
    let prior = false, cancelled = false;
    try { prior = localStorage.getItem(VISIT_KEY) === '1'; } catch { /* Storage is optional. */ }
    queueMicrotask(() => { if (!cancelled) setVisit({ ready: true, seen: prior }); });
    return () => { cancelled = true; };
  }, []);
  const config = useMemo(() => {
    const result = openingConfig({ leadInDuration, formationDuration: formationDuration ?? introDuration, settleDuration, holdDuration, dissolveDuration, globeRevealDuration, transitionDuration, autoTransitionEnabled: false }, lowPower, staticMotion);
    if (!introEnabled || (visit.seen && repeatVisit === 'skip')) Object.assign(result, { leadInDuration: 0, formationDuration: 0, settleDuration: 0 });
    else if (visit.seen && repeatVisit === 'short' && !staticMotion) Object.assign(result, { leadInDuration: 0.1, formationDuration: 1, settleDuration: 0.3 });
    return result;
  }, [leadInDuration, formationDuration, introDuration, settleDuration, holdDuration, dissolveDuration, globeRevealDuration, transitionDuration, lowPower, staticMotion, introEnabled, visit.seen, repeatVisit]);
  const reportOpening = useCallback((frame: OpeningFrame) => {
    if (frame.state === 'HOLDING_80' && !seen.current) {
      seen.current = true;
      try { localStorage.setItem(VISIT_KEY, '1'); } catch { /* Never gate content on storage. */ }
    }
    onOpeningProgress?.(frame);
  }, [onOpeningProgress]);
  const { bridge, state } = useBrandOpening(config, {
    active: active && visit.ready && preferences.pageVisible, reduced: staticMotion,
    story, host, onProgress: reportOpening,
  });
  const reportParticle = useCallback((particleState: Particle80State) => { onStateChange?.(particleState); }, [onStateChange]);

  return <div ref={host} className={styles.container + ' ' + className}
    data-intro-state={state} data-intro-finished={false} data-reduced={staticMotion} data-particle-story="true"
    data-auto-transition={config.autoTransitionEnabled} data-formation-duration={config.formationDuration}
    data-hold-duration={config.holdDuration} data-dissolve-duration={config.dissolveDuration}
    data-globe-reveal-duration={config.globeRevealDuration}>
        <PersistentParticleBackdrop {...particleProps} opening={bridge} story={story}
          active={active && visit.ready} interactive={particleProps.interactive ?? true}
          intensity={particleProps.intensity ?? 1.18} brightnessPreset={particleProps.brightnessPreset ?? 'B'}
          viewScale={particleProps.viewScale ?? 1.72} introEnabled={introEnabled}
          introDuration={config.formationDuration || 0.5} onStateChange={reportParticle}
        />
    <section ref={hero} className={styles.intro} aria-label="Chengdu 80 signature introduction">
      <header className={styles.header}>{headerContent ?? <><h1>CHENGDU 80</h1><span>2026</span></>}</header>
      <div ref={composition} className={styles.composition}>
        <div className={styles.identity + ' ' + styles.swufe}>
          <p className={styles.acronym}>SWUFE</p>
          <p className={styles.fullName}>Southwestern University of<br className={styles.desktopBreak} /> Finance and Economics</p>
        </div>
        <div className={styles.identity + ' ' + styles.fic}>
          <p className={styles.acronym}>FIC</p>
          <p className={styles.fullName}>Fintech Innovation Center</p>
        </div>
      </div>
      <footer className={styles.footer}>
        {footerContent ?? <>
        <div className={styles.caption}><p>CHENGDU 80</p><span>Innovation ecosystem</span></div>
        <a className={styles.continue} href="#event-introduction" onClick={() => onContinue?.()}>
          Explore Chengdu 80 <span aria-hidden="true">↓</span>
        </a>
        <p className={styles.pointerHint}>Move gently through the light</p>
        <a className={styles.scrollPrompt} href="#event-introduction">Scroll to explore <span aria-hidden="true">↓</span></a>
        </>}
      </footer>
    </section>
    <section id="event-introduction" className={styles.introduction} aria-labelledby="event-introduction-title" tabIndex={-1}>
      <div ref={content} className={styles.introductionContent} data-particle-reading-region="true">
        {introduction ?? <>
          <p className={styles.eyebrow}>{siteContent.hero.eyebrow}</p>
          <h2 id="event-introduction-title">{siteContent.hero.tagline}</h2>
          <p className={styles.officialName}>{siteContent.hero.competitionName.join(' ')}</p>
          <p className={styles.description}>A global university innovation network.<br />Originating in Chengdu.</p>
          <div className={styles.actions}>
            <a href="#global-network">Explore the university network <span aria-hidden="true">↓</span></a>
            <a href="https://chengdu-80-2026.shuxuemi.chatgpt.site">Explore the website <span aria-hidden="true">↗</span></a>
          </div>
        </>}
      </div>
    </section>
  </div>;
}

export default function Particle80Intro({ enabled = true, ...props }: Particle80IntroProps) {
  if (!enabled) return props.handoffContent ?? null;
  return <IntroSurface {...props} introEnabled={enabled && props.introEnabled !== false} />;
}
