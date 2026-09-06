import { useRef, type ReactNode } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { navigation } from '@/content/navigation';
import { currentCompetition, bilingual as b } from '@/content/competition';
import { useSiteLanguage } from '@/hooks/use-site-language';
import styles from './Site.module.css';

const navChinese: Record<string, string> = { About: '关于赛事', Competition: '参赛信息', History: '历届赛事', Winners: '成果档案', 'Global Network': '高校网络', Partners: '组织与支持' };
export function LanguageSwitch() {
  const { language, setLanguage } = useSiteLanguage();
  return <fieldset className={styles.languages} aria-label={language === 'zh' ? '语言' : 'Language'}>
    <button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
    <span aria-hidden="true">/</span>
    <button type="button" lang="zh-CN" aria-pressed={language === 'zh'} onClick={() => setLanguage('zh')}>中文</button>
  </fieldset>;
}
export function SiteNavigation({ embedded = false }: { embedded?: boolean }) {
  const { language, t, href } = useSiteLanguage();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const path = typeof location === 'undefined' ? '/' : location.pathname;
  const links = navigation.map(item => <a key={item.href} href={href(item.href + '/')} aria-current={path.startsWith(item.href) ? 'page' : undefined}>{language === 'zh' ? navChinese[item.label] : item.label}</a>);
  return <div className={styles.navigation} data-embedded={embedded}>
    <a href={href('/')} className={styles.wordmark}>CHENGDU 80</a>
    <nav className={styles.desktopNav} aria-label={t(b('Main navigation', '主导航'))}>{links}</nav>
    <LanguageSwitch />
    <button type="button" ref={trigger} className={styles.menuButton} onClick={() => dialog.current?.showModal()} aria-label={t(b('Open menu', '打开菜单'))} aria-haspopup="dialog"><Menu size={22} /></button>
    <dialog ref={dialog} className={styles.menu} aria-label={t(b('Site menu', '网站菜单'))} onClose={() => trigger.current?.focus()}>
      <div className={styles.menuTop}><strong>CHENGDU 80</strong><button type="button" onClick={() => dialog.current?.close()} aria-label={t(b('Close menu', '关闭菜单'))}><X size={24} /></button></div>
      <nav aria-label={t(b('Mobile navigation', '手机导航'))}>{links}</nav>
      <LanguageSwitch />
      <a className={styles.primary} href={href('/competition/')}>{t(b('2026 Competition', '2026赛事信息'))}<ArrowUpRight size={17} /></a>
    </dialog>
  </div>;
}
export function SiteFooter() {
  const { t, href, language } = useSiteLanguage();
  return <footer className={styles.footer}>
    <div><a className={styles.wordmark} href={href('/')}>CHENGDU 80</a><p>{t(currentCompetition.dateLabel)}</p></div>
    <nav aria-label={t(b('Footer navigation', '页脚导航'))}>{navigation.map(n => <a key={n.href} href={href(n.href + '/')}>{language === 'zh' ? navChinese[n.label] : n.label}</a>)}</nav>
    <div className={styles.footerBottom}><a href={href('/competition/#resources')}>{t(b('Sources, resources & contact', '来源、资料与联系'))}</a><span>{t(b('Preview · 2026 roster and rules unannounced', '预览版 · 2026名单与规则待公布'))}</span><LanguageSwitch /></div>
  </footer>;
}
export function TextPage({ children }: { children: ReactNode }) {
  const { t } = useSiteLanguage();
  return <div className={styles.site}><a className={styles.skip} href="#main-content">{t(b('Skip to content', '跳转正文'))}</a><header className={styles.chrome}><SiteNavigation /></header><main id="main-content" tabIndex={-1} className={styles.content}>{children}</main><SiteFooter /></div>;
}
