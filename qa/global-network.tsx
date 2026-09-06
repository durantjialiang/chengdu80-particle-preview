import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import GlobalUniversityNetwork from '../components/network/GlobalUniversityNetwork';
import '../app/globals.css';
import './global-network.css';

function NetworkPage() {
  const review = import.meta.env.DEV
    ? new URLSearchParams(location.search)
    : null;
  return (
    <>
      <nav className="network-page-navigation" aria-label="Network page">
        <a href={import.meta.env.DEV ? '/qa/particle80.html' : '/'}>
          CHENGDU 80
        </a>
        <span>GLOBAL UNIVERSITY NETWORK</span>
        <span>2026</span>
      </nav>
      <main>
        <GlobalUniversityNetwork
          standalone
          forceReducedMotion={review?.get('motion') === 'reduced'}
          staticPreview={review?.get('renderer') === 'svg'}
        />
      </main>
    </>
  );
}
const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <NetworkPage />
  </StrictMode>,
);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
