'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { relationshipLabels, type University } from '@/content/network';
import styles from './Network.module.css';

export function UniversityLogo({ university }: { university: University }) {
  // Local, size-bounded static assets: this Vite preview has no Next image server.
  /* oxlint-disable next/no-img-element */
  return (
    <div className={styles.logo} data-surface={university.logoSurface}>
      {university.logo ? (
        <img
          src={university.logo}
          alt={`${university.shortName} official logo`}
          loading="lazy"
          width={132}
          height={44}
        />
      ) : (
        <span
          className={styles.monogram}
          aria-label={`${university.shortName}, official logo not supplied`}
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
        aria-label={`View details for ${university.name}`}
        aria-haspopup="dialog"
      >
        <UniversityLogo university={university} />
        <span
          className={styles.relationship}
          data-role={university.relationshipType}
        >
          {university.verification === 'pending'
            ? 'Record under review'
            : relationshipLabels[university.relationshipType]}
        </span>
        <h4>{university.name}</h4>
        <p>
          {university.city}
          {university.city === university.country
            ? ''
            : `, ${university.country}`}
        </p>
        <div className={styles.years}>
          <span>
            {university.relationshipType === 'ecosystem'
              ? 'Competition participation'
              : 'Documented participation'}
          </span>
          <strong>
            {years.length
              ? years.join(' · ')
              : university.verification === 'pending' ||
                  university.relationshipType === 'ecosystem'
                ? 'Not yet verified'
                : 'Year not specified'}
          </strong>
        </div>
        {latest ? (
          <p className={styles.achievement}>
            {latest.year ?? `Reported ${latest.reportedYear}`} / {latest.name}
          </p>
        ) : null}
        <span className={styles.detailAction}>
          View Details <ArrowRight size={15} aria-hidden="true" />
        </span>
      </button>
      <a
        className={styles.website}
        href={university.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${university.name} official website (opens in a new tab)`}
      >
        Visit Website <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </motion.article>
  );
}
