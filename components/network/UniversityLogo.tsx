'use client';
import { type University } from '@/content/network';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { bilingual as b } from '@/content/competition';
import { universityName } from '@/content/university-i18n';
import styles from './UniversityLogo.module.css';

// Shared static identity: importing a logo must not load animated network cards.
export function UniversityLogo({ university }: { university: University }) {
  const { t, language } = useSiteLanguage();
  const fullName = universityName(university, language);
  // Local, size-bounded static assets: this Vite preview has no Next image server.
  /* oxlint-disable next/no-img-element */
  return (
    <div className={styles.logo} data-surface={university.logoSurface}>
      {university.logo ? (
        <img
          src={university.logo}
          alt={`${fullName} ${t(b('official logo', '官方标识'))}`}
          loading="lazy"
          width={144}
          height={48}
        />
      ) : (
        <span
          className={styles.monogram}
          aria-label={`${fullName}, ${t(b('official logo not supplied', '官方标识待补'))}`}
        >
          {university.shortName}
        </span>
      )}
    </div>
  );
  /* oxlint-enable next/no-img-element */
}
