'use client';
import { useEffect, useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { relationshipLabels, type University } from '@/content/network';
import { Button } from '@/components/ui/button';
import { UniversityLogo } from './UniversityCard';
import styles from './Network.module.css';

/** Native dialog provides modal focus containment, Escape and focus restoration. */
export default function UniversityDetailPanel({
  university,
  onClose,
}: {
  university: University;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = panel.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  return (
    <dialog
      ref={panel}
      className={styles.detailPanel}
      aria-labelledby="university-detail-title"
      onClose={() => {
        if (!panel.current?.open) onClose();
      }}
    >
      <div className={styles.detailInner}>
        <div className={styles.detailTop}>
          <span>UNIVERSITY RECORD</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => panel.current?.close()}
            aria-label="Close university details"
          >
            <X size={20} />
          </Button>
        </div>
        <UniversityLogo university={university} />
        <p
          className={styles.relationship}
          data-role={university.relationshipType}
        >
          {university.verification === 'pending'
            ? 'Record under review'
            : relationshipLabels[university.relationshipType]}
        </p>
        <h2 id="university-detail-title">{university.name}</h2>
        <p className={styles.location}>
          {university.city}, {university.country}
        </p>
        <p className={styles.recordNote}>{university.recordNote}</p>
        <section>
          <h3>Participation years</h3>
          <div className={styles.yearPills}>
            {university.participationYears.length ? (
              university.participationYears.map((year) => (
                <span key={year}>{year}</span>
              ))
            ) : (
              <p>
                {university.verification === 'pending'
                  ? 'Not yet verified.'
                  : 'Specific years are not given in the cited record.'}
              </p>
            )}
          </div>
        </section>
        <section>
          <h3>Awards</h3>
          {university.awards.length ? (
            <ul>
              {university.awards.map((award, index) => (
                <li key={`${award.year}-${index}`}>
                  <span>{award.year ?? `${award.reportedYear} report`}</span>
                  <a
                    href={award.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {award.name}
                    <ArrowUpRight size={13} />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No individual award is verified in this record.</p>
          )}
        </section>
        <section>
          <h3>Related projects & teams</h3>
          {university.projects.length ? (
            <ul>
              {university.projects.map((project, index) => (
                <li key={`${project.year}-${index}`}>
                  <span>
                    {project.year ?? `${project.reportedYear} report`}
                  </span>
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.name}
                    <ArrowUpRight size={13} />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No named project is verified in this record.</p>
          )}
        </section>
        <section className={styles.sources}>
          <h3>Official records</h3>
          {university.evidence.length ? (
            university.evidence.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.title}
                <ArrowUpRight size={14} />
              </a>
            ))
          ) : (
            <p>Awaiting organizer-verified participation evidence.</p>
          )}
        </section>
        <a
          className={styles.officialButton}
          href={university.website}
          target="_blank"
          rel="noopener noreferrer"
        >
          Official university website <ArrowUpRight size={17} />
        </a>
        <p className={styles.detailFootnote}>
          Opens in a new tab. Historical records do not confirm participation in
          2026.
        </p>
      </div>
    </dialog>
  );
}
