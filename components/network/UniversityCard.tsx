'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { type University } from '@/content/network';
import {
  universityName,
  universityLocation,
  universityRole,
} from '@/content/university-i18n';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { bilingual as b } from '@/content/competition';
import styles from './Network.module.css';

export function UniversityLogo({ university }: { university: University }) {
  const { t } = useSiteLanguage();
  // Local, size-bounded static assets: this Vite preview has no Next image server.
  /* oxlint-disable next/no-img-element */
  return (
    <div className={styles.logo} data-surface={university.logoSurface}>
      {university.logo ? (
        <img
          src={university.logo}
          alt={`${university.shortName} ${t(b('official logo', '官方标识'))}`}
          loading="lazy"
          width={132}
          height={44}
        />
      ) : (
        <span
          className={styles.monogram}
          aria-label={`${university.shortName}, ${t(b('official logo not supplied', '官方标识待补'))}`}
        >
          {university.shortName}
        </span>
      )}
    </div>
  );
  /* oxlint-enable next/no-img-element */
}

export default function UniversityCard({
  university,
  highlighted,
  selected,
  reducedMotion,
  index,
  register,
  onHover,
  onDetails,
}: {
  university: University;
  highlighted: boolean;
  selected: boolean;
  reducedMotion: boolean;
  index: number;
  register: (element: HTMLElement | null) => void;
  onHover: (hovering: boolean) => void;
  onDetails: () => void;
}) {
  const { t, language } = useSiteLanguage();
  const years = university.participationYears;
  const latest = university.awards.at(-1);
  return (
    <motion.article
      ref={register}
      id={`university-card-${university.id}`}
      className={styles.card}
      data-university={university.id}
      data-selected={selected}
      data-highlighted={highlighted}
      initial={reducedMotion ? false : { opacity: 0, y: 9 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: reducedMotion ? 0 : 0.35,
        delay: Math.min(index, 7) * 0.025,
      }}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') onHover(true);
      }}
      onPointerLeave={() => onHover(false)}
      onFocusCapture={() => onHover(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          onHover(false);
      }}
    >
      <button
        className={styles.cardMain}
        onClick={onDetails}
        aria-label={`${t(b('View details for', '查看高校详情：'))} ${universityName(university, language)}`}
        aria-haspopup="dialog"
      >
        <UniversityLogo university={university} />
        <span
          className={styles.relationship}
          data-role={university.relationshipType}
        >
          {university.verification === 'pending'
            ? t(b('Record under review', '资料待核'))
            : universityRole(university.relationshipType, language)}
        </span>
        <h4>{universityName(university, language)}</h4>
        <p>{universityLocation(university, language)}</p>
        <div className={styles.years}>
          <span>
            {university.relationshipType === 'ecosystem'
              ? t(b('Competition participation', '赛事参与'))
              : t(b('Documented participation', '有据可查的参赛年份'))}
          </span>
          <strong>
            {years.length
              ? years.join(' · ')
              : university.verification === 'pending' ||
                  university.relationshipType === 'ecosystem'
                ? t(b('Not yet verified', '尚未核实'))
                : t(b('Year not specified', '具体年份待核'))}
          </strong>
        </div>
        {latest ? (
          <p className={styles.achievement}>
            {latest.year ??
              `${t(b('Reported', '报道发表于'))} ${latest.reportedYear}`}{' '}
            / {latest.name}
          </p>
        ) : null}
        <span className={styles.detailAction}>
          {t(b('View Details', '查看详情'))}{' '}
          <ArrowRight size={15} aria-hidden="true" />
        </span>
      </button>
      <a
        className={styles.website}
        href={university.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${universityName(university, language)} · ${t(b('official website (opens in a new tab)', '官方网站（新标签页打开）'))}`}
      >
        {t(b('Visit Website', '访问官网'))}{' '}
        <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </motion.article>
  );
}
