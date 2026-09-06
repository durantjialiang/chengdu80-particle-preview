import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import GlobalUniversityNetwork from '../components/network/GlobalUniversityNetwork';
import '../app/globals.css';
import './global-network.css';
import { SiteLanguageProvider } from '@/hooks/use-site-language';
import { SiteNavigation, SiteFooter } from '@/components/site/SiteChrome';
import { AmbientParticleBackdrop } from '@/components/PersistentParticleBackdrop';

function NetworkPage() {
  const review = import.meta.env.DEV
    ? new URLSearchParams(location.search)
    : null;
  return (
    <>
      <AmbientParticleBackdrop />
      <header className="network-page-navigation"><SiteNavigation /></header>
      <main>
        <h1 className="sr-only">Global University Network — Chengdu 80</h1>
        <GlobalUniversityNetwork
          standalone
          forceReducedMotion={review?.get('motion') === 'reduced'}
          staticPreview={review?.get('renderer') === 'svg'}
        />
      </main>
      <SiteFooter />
    </>
  );
}
const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <SiteLanguageProvider><NetworkPage /></SiteLanguageProvider>
  </StrictMode>,
);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
