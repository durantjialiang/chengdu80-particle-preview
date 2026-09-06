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
import { SiteLanguageProvider, useSiteLanguage } from '@/hooks/use-site-language';
import { SiteNavigation, SiteFooter } from '@/components/site/SiteChrome';
import { currentCompetition, bilingual as b } from '@/content/competition';
import introStyles from '@/components/Particle80Intro.module.css';

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
  const { t, href } = useSiteLanguage();
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
    <><main id="main-content"><h1 className="sr-only">CHENGDU 80</h1>
      {import.meta.env.DEV && reviewQuery?.get('record') === '1' ? (
        <OpeningReviewCursor />
      ) : null}
      <Particle80Intro
        headerContent={<SiteNavigation embedded />}
        introduction={<>
          <p className={introStyles.eyebrow}>{t(b('AN 80-HOUR GLOBAL FINTECH HACKATHON', '80小时全球金融科技创新挑战'))}</p>
          <h2 id="event-introduction-title">{t(b('Build the Future of Finance.', '共创金融未来。'))}</h2>
          <p className={introStyles.officialName}>{t(b('Chengdu 80 Global FinTech Product Design & Development Competition', '“成都八零”全球金融科技产品设计与研发大赛'))}</p>
          <p className={introStyles.description}>{t(currentCompetition.dateLabel)}</p>
          <div className={introStyles.actions}><a href={href('/competition/')}>{t(b('2026 Competition', '2026赛事信息'))} ↗</a><a href="#global-network">{t(b('Explore the university network', '探索高校网络'))} ↓</a></div>
        </>}
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
        <div className="intro-study-controls-inner" data-particle-reading-region>
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
        </div>
      </section>
    </main><SiteFooter /></>
  );
}
const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <SiteLanguageProvider><Study /></SiteLanguageProvider>
  </StrictMode>,
);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
