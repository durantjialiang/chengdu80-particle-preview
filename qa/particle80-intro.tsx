/// <reference types="vite/client" />
import { lazy, StrictMode, Suspense, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Particle80Intro from '../components/Particle80Intro';
import { useParticleIntro } from '../hooks/use-particle-intro';
import { useScenePreferences } from '../hooks/use-scene-preferences';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import '../app/globals.css';
import './particle80-intro.css';

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
function GlobeDestination() {
  const { reducedMotion, lowPower, pageVisible } = useScenePreferences();
  return (
    <section className="intro-globe-destination">
      <div className="intro-globe-copy">
        <p>CHENGDU 80 / 2026</p>
        <h2>
          Build the Future
          <br />
          of Finance.
        </h2>
        <a href="https://chengdu-80-2026.shuxuemi.chatgpt.site">
          Explore the website ↗
        </a>
      </div>
      <div className="intro-globe-scene globe-stage">
        <Suspense fallback={<p>Global FinTech Network</p>}>
          <Globe
            lowPower={lowPower}
            reducedMotion={reducedMotion}
            active={pageVisible}
          />
        </Suspense>
      </div>
    </section>
  );
}
function Study() {
  const [replay, setReplay] = useState(0);
  const [still, setStill] = useState(false);
  const [low, setLow] = useState(false);
  const [interactive, setInteractive] = useState(true);
  const {
    onStateChange,
    phase,
    formationProgress,
    settled,
    interactionEnabled,
  } = useParticleIntro();
  return (
    <main>
      <Particle80Intro
        brightnessPreset={brightnessPreset}
        debug={fieldDebug}
        key={replay}
        repeatVisit={replay ? 'always' : 'short'}
        onStateChange={onStateChange}
        reducedMotionMode={still ? 'static' : 'system'}
        lowPowerMode={low ? 'on' : 'auto'}
        interactive={interactive}
        handoffContent={<GlobeDestination />}
      />
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
