'use client';

import { animate } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import Particle80, {
  type Particle80Props,
  type Particle80State,
} from './Particle80';
import { Button } from '@/components/ui/button';
import { useScenePreferences } from '@/hooks/use-scene-preferences';
import styles from './Particle80Intro.module.css';
import { smoothProgress } from '@/lib/particle80';
import { FIELD_DEFAULTS } from '@/lib/particle80-field';

const VISIT_KEY = 'chengdu80:innovation-field:seen:v2';
export type Particle80IntroProps = Particle80Props & {
  repeatVisit?: 'short' | 'skip' | 'always';
  handoffContent?: ReactNode;
  onContinue?: () => void;
  onHandoffComplete?: () => void;
};

function IntroSurface({
  repeatVisit = 'short',
  handoffContent,
  onContinue,
  onHandoffComplete,
  onStateChange,
  introEnabled = true,
  introDuration = FIELD_DEFAULTS.formationDuration,
  formationDuration,
  active = true,
  className = '',
  ...particleProps
}: Omit<Particle80IntroProps, 'enabled'>) {
  const { reducedMotion } = useScenePreferences();
  const [visit, setVisit] = useState({ ready: false, seen: false });
  const [leaving, setLeaving] = useState(false);
  const [finished, setFinished] = useState(false);
  const [exitProgress, setExitProgress] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const staticMotion =
    reducedMotion ||
    particleProps.reducedMotionMode === 'static' ||
    particleProps.motion === 'still';
  const destination = useRef<HTMLDivElement>(null);
  const completion = useRef(onHandoffComplete);
  const settled = useRef(false);
  useEffect(() => {
    completion.current = onHandoffComplete;
  }, [onHandoffComplete]);
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(VISIT_KEY) === '1';
    } catch {
      /* Storage is optional. */
    }
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setVisit({ ready: true, seen });
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const report = useCallback(
    (state: Particle80State) => {
      setStoryProgress(state.formationProgress);
      if (state.settled && !settled.current) {
        settled.current = true;
        try {
          localStorage.setItem(VISIT_KEY, '1');
        } catch {
          /* Never gate content on storage. */
        }
      }
      onStateChange?.(state);
    },
    [onStateChange],
  );
  useEffect(() => {
    if (!leaving) return;
    const animation = animate(0, 1, {
      duration: staticMotion ? 0 : 0.85,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setExitProgress,
      onComplete: () => setFinished(true),
    });
    return () => animation.stop();
  }, [leaving, staticMotion]);
  useEffect(() => {
    if (!finished) return;
    destination.current?.focus({ preventScroll: true });
    completion.current?.();
  }, [finished]);
  const repeat = visit.seen && repeatVisit !== 'always';
  const formationEnabled = introEnabled && !(repeat && repeatVisit === 'skip');
  const duration =
    repeat && repeatVisit === 'short'
      ? 1.4
      : (formationDuration ?? introDuration);
  const identityOpacity =
    staticMotion || !formationEnabled
      ? 1
      : smoothProgress((storyProgress - 0.06) / 0.14);

  return (
    <div
      className={`${styles.container} ${className}`}
      data-intro-finished={finished}
    >
      {leaving && handoffContent ? (
        <div
          ref={destination}
          tabIndex={-1}
          className={styles.destination}
          style={{ opacity: exitProgress }}
          inert={!finished}
          aria-hidden={!finished}
        >
          {handoffContent}
        </div>
      ) : null}
      {!finished ? (
        <section
          className={styles.intro}
          aria-label="Chengdu 80 signature introduction"
          style={
            {
              opacity: 1 - exitProgress,
              '--identity-opacity': identityOpacity,
            } as CSSProperties
          }
          aria-hidden={leaving || undefined}
          inert={leaving}
        >
          <header className={styles.header}>
            <h1>CHENGDU 80</h1>
            <span>2026</span>
          </header>
          <div className={styles.composition}>
            <div className={`${styles.identity} ${styles.swufe}`}>
              <p className={styles.acronym}>SWUFE</p>
              <p className={styles.fullName}>
                Southwestern University of
                <br className={styles.desktopBreak} /> Finance and Economics
              </p>
            </div>
            <div className={styles.field}>
              <Particle80
                {...particleProps}
                active={active && visit.ready && !leaving}
                interactive={particleProps.interactive ?? true}
                intensity={particleProps.intensity ?? 1.18}
                brightnessPreset={particleProps.brightnessPreset ?? 'B'}
                viewScale={particleProps.viewScale ?? 1.18}
                glow={particleProps.glow ?? FIELD_DEFAULTS.glowIntensity}
                introEnabled={formationEnabled}
                introDuration={duration}
                dissolveProgress={Math.max(
                  particleProps.dissolveProgress ?? 0,
                  exitProgress,
                )}
                onStateChange={report}
                className={styles.particles}
              />
            </div>
            <div className={`${styles.identity} ${styles.fic}`}>
              <p className={styles.acronym}>FIC</p>
              <p className={styles.fullName}>Fintech Innovation Center</p>
            </div>
          </div>
          <footer className={styles.footer}>
            <div className={styles.caption}>
              <p>CHENGDU 80</p>
              <span>Innovation ecosystem</span>
            </div>
            {handoffContent || onContinue ? (
              <Button
                variant="outline"
                className={styles.continue}
                onClick={() => {
                  if (handoffContent) setLeaving(true);
                  onContinue?.();
                }}
              >
                Explore Chengdu 80 <span aria-hidden="true">↗</span>
              </Button>
            ) : null}
            <p className={styles.pointerHint}>Move gently through the light</p>
          </footer>
        </section>
      ) : null}
    </div>
  );
}

export default function Particle80Intro({
  enabled = true,
  ...props
}: Particle80IntroProps) {
  if (!enabled) return props.handoffContent ?? null;
  return <IntroSurface {...props} />;
}
