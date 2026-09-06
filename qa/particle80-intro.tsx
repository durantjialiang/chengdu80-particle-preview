/// <reference types="vite/client" />
import { lazy, StrictMode, Suspense, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { createRoot } from 'react-dom/client';
import Particle80Intro, {
  type HandoffContext,
} from '../components/Particle80Intro';
import type { OpeningFrame } from '../lib/brand-opening';
import { useParticleIntro } from '../hooks/use-particle-intro';
import { useScenePreferences } from '../hooks/use-scene-preferences';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import '../app/globals.css';
import './particle80-intro.css';
import OpeningReviewCursor from './OpeningReviewCursor';
import GlobalUniversityNetwork from '../components/network/GlobalUniversityNetwork';

const Globe = lazy(() => import('../components/Globe'));
// Local review only; Vite removes URL selection from the published bundle.
const reviewPreset = import.meta.env.DEV
  ? new URLSearchParams(window.location.search).get('brightness')
  : null;
const brightnessPreset =
  reviewPreset === 'A'
    ? 'A'
    : reviewPreset === 'B'
      ? 'B'
      : reviewPreset === 'baseline'
        ? 'baseline'
        : undefined;
const debugQuery = import.meta.env.DEV
  ? new URLSearchParams(window.location.search).get('fieldDebug')
  : null;
const fieldDebug =
  debugQuery === 'roles' ||
  debugQuery === 'vectors' ||
  debugQuery === 'flow' ||
  debugQuery === 'telemetry'
    ? debugQuery
    : 'off';
const reviewQuery = import.meta.env.DEV
  ? new URLSearchParams(window.location.search)
  : null;
function GlobeDestination({
  opening,
  state,
  reducedMotion,
  lowPower,
}: HandoffContext) {
  const host = useRef<HTMLElement>(null);
  const inView = useInView(host);
  const { pageVisible } = useScenePreferences();
  const active =
    state === 'DISSOLVING_80' ||
    state === 'HANDOFF_TO_GLOBE' ||
    state === 'GLOBE_ACTIVE';
  return (
    <section ref={host} className="intro-globe-destination">
      <div className="intro-globe-copy">
        <p>CHENGDU 80 / 2026</p>
        <h2>
          Build the Future
          <br />
          of Finance.
        </h2>
        <p className="intro-network-label">
          A global university innovation network.
          <br />
          Originating in Chengdu.
        </p>
        <a href="https://chengdu-80-2026.shuxuemi.chatgpt.site">
          Explore the website ↗
        </a>
        <a className="intro-explore-network" href="#global-network">
          Explore the university network ↓
        </a>
      </div>
      <div className="intro-globe-scene globe-stage">
        <Suspense fallback={<p>Global FinTech Network</p>}>
          <Globe
            lowPower={lowPower}
            reducedMotion={reducedMotion}
            active={pageVisible && active && inView}
            opening={opening}
          />
        </Suspense>
      </div>
    </section>
  );
}
function Study() {
  const [replay, setReplay] = useState(0);
  const [still, setStill] = useState(reviewQuery?.get('motion') === 'reduced');
  const [low, setLow] = useState(false);
  const [interactive, setInteractive] = useState(true);
  const [automatic, setAutomatic] = useState(
    reviewQuery?.get('autoTransition') !== '0',
  );
  const [openingFrame, setOpeningFrame] = useState<OpeningFrame | null>(null);
  const {
    onStateChange,
    phase,
    formationProgress,
    settled,
    interactionEnabled,
  } = useParticleIntro();
  return (
    <main>
      {import.meta.env.DEV && reviewQuery?.get('record') === '1' ? (
        <OpeningReviewCursor />
      ) : null}
      <Particle80Intro
        brightnessPreset={brightnessPreset}
        debug={fieldDebug}
        key={replay}
        repeatVisit={
          replay || reviewQuery?.get('visit') === 'first' ? 'always' : 'short'
        }
        autoTransitionEnabled={automatic}
        onOpeningProgress={setOpeningFrame}
        onStateChange={onStateChange}
        reducedMotionMode={still ? 'static' : 'system'}
        lowPowerMode={low ? 'on' : 'auto'}
        interactive={interactive}
        handoffContent={(context) => <GlobeDestination {...context} />}
      />
      <GlobalUniversityNetwork />
      <section
        className="intro-study-controls"
        aria-label="Intro preview controls"
      >
        <Button variant="outline" onClick={() => setReplay((n) => n + 1)}>
          Replay intro
        </Button>
        <label htmlFor="intro-pointer">
          <Switch
            id="intro-pointer"
            checked={interactive}
            onCheckedChange={setInteractive}
          />{' '}
          Pointer interaction
        </label>
        <label htmlFor="intro-reduced">
          <Switch
            id="intro-reduced"
            checked={still}
            onCheckedChange={setStill}
          />{' '}
          Reduced motion
        </label>
        <label htmlFor="intro-low">
          <Switch id="intro-low" checked={low} onCheckedChange={setLow} /> Low
          power
        </label>
        <label htmlFor="intro-auto">
          <Switch
            id="intro-auto"
            checked={automatic}
            onCheckedChange={setAutomatic}
          />{' '}
          Auto transition
        </label>
        <output>
          {phase ?? 'space'} · Formation {Math.round(formationProgress * 100)}%
          · {settled ? 'Settled' : 'Forming'} · Interaction{' '}
          {interactionEnabled ? 'on' : 'off'}
          {' · '}
          {openingFrame?.state ?? 'INTRO_IDLE'} · Globe{' '}
          {Math.round((openingFrame?.globeRevealProgress ?? 0) * 100)}%
        </output>
      </section>
    </main>
  );
}
const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <Study />
  </StrictMode>,
);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
