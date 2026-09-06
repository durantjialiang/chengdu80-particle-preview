import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SiteLanguageProvider, useSiteLanguage } from '@/hooks/use-site-language';
import { TextPage } from '@/components/site/SiteChrome';
import CompetitionPage from '@/components/site/CompetitionPage';
import { bilingual as b } from '@/content/competition';
import '../app/globals.css';
function SitePage() {
  const { t, href } = useSiteLanguage();
  const path = location.pathname.replace(/\/$/, '');
  return <TextPage>{path === '/competition' ? <CompetitionPage /> : <><h1>404</h1><p>{t(b('This page does not exist.', '此页面不存在。'))}</p><a href={href('/')}>{t(b('Return to Chengdu 80', '返回成都八零'))} →</a></>}</TextPage>;
}
const root = createRoot(document.getElementById('root')!);
root.render(<StrictMode><SiteLanguageProvider><SitePage /></SiteLanguageProvider></StrictMode>);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
