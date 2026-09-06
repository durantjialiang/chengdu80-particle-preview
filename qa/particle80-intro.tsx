/// <reference types="vite/client" />
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Particle80Intro from '../components/Particle80Intro';
import type { OpeningFrame } from '../lib/brand-opening';
import { useParticleIntro } from '../hooks/use-particle-intro';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import '../app/globals.css';
import './particle80-intro.css';
import OpeningReviewCursor from './OpeningReviewCursor';
import GlobalUniversityNetwork from '../components/network/GlobalUniversityNetwork';

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
function Study() {
  const [replay, setReplay] = useState(0);
  const [still, setStill] = useState(reviewQuery?.get('motion') === 'reduced');
  const [low, setLow] = useState(false);
  const [interactive, setInteractive] = useState(true);
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
        autoTransitionEnabled={false}
        onOpeningProgress={setOpeningFrame}
        onStateChange={onStateChange}
        reducedMotionMode={still ? 'static' : 'system'}
        lowPowerMode={low ? 'on' : 'auto'}
        interactive={interactive}
      />
      <GlobalUniversityNetwork forceReducedMotion={still} staticPreview={reviewQuery?.get('renderer') === 'svg'} />
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
        <output>
          {phase ?? 'space'} · Formation {Math.round(formationProgress * 100)}%
          · {settled ? 'Settled' : 'Forming'} · Interaction{' '}
          {interactionEnabled ? 'on' : 'off'}
          {' · '}
          {openingFrame?.state ?? 'INTRO_IDLE'} · Native scroll story
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
