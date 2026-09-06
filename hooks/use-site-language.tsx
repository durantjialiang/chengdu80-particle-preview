import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Language, Localized } from '@/content/competition';
type LanguageContext = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (value: Localized) => string;
  href: (path: string) => string;
};
const defaults: LanguageContext = {
  language: 'en',
  setLanguage: () => {},
  t: (v) => v.en,
  href: (p) => p,
};
const Context = createContext(defaults);
export function SiteLanguageProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const query = new URLSearchParams(location.search).get('lang');
    if (query === 'en' || query === 'zh') return query;
    try {
      return localStorage.getItem('chengdu80:language') === 'zh' ? 'zh' : 'en';
    } catch {
      return 'en';
    }
  });
  const setLanguage = useCallback((value: Language) => {
    updateLanguage(value);
    const url = new URL(location.href);
    url.searchParams.set('lang', value);
    history.replaceState(history.state, '', url);
    try {
      localStorage.setItem('chengdu80:language', value);
    } catch {
      /* Optional preference only. */
    }
  }, []);
  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  }, [language]);
  useEffect(() => {
    const restore = () => {
      const l = new URLSearchParams(location.search).get('lang');
      if (l === 'zh' || l === 'en') updateLanguage(l);
    };
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  const t = useCallback((value: Localized) => value[language], [language]);
  const href = useCallback(
    (path: string) => {
      const url = new URL(path, 'https://local.invalid');
      url.searchParams.set('lang', language);
      return url.pathname + url.search + url.hash;
    },
    [language],
  );
  return (
    <Context value={{ language, setLanguage, t, href }}>{children}</Context>
  );
}
export const useSiteLanguage = () => useContext(Context);
