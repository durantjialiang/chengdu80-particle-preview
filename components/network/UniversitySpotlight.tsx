import { useMemo, useState } from 'react';
import type { UniversityId } from '@/content/network';
import { bilingual as b } from '@/content/competition';
import {
  universityName,
  universityLocation,
  universityRole,
} from '@/content/university-i18n';
import {
  universitySpotlight,
  type NetworkYear,
} from '@/lib/university-explorer';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { UniversityLogo } from './UniversityLogo';
import UniversityExchange from './UniversityExchange';
import { Photo, Viewer } from '@/components/site/ArchiveGallery';
import styles from './UniversitySpotlight.module.css';

/**
 * The reading surface beside the globe is intentionally a single, short
 * profile. Detailed awards and source records remain in the dialog opened by
 * “Explore university profile”.
 */
export default function UniversitySpotlight({
  universityId,
  year,
  compact,
  onYear,
  onLocate,
  onDetails,
}: {
  universityId: UniversityId;
  year: NetworkYear;
  compact: boolean;
  onYear: (year: NetworkYear) => void;
  onLocate: () => void;
  onDetails: () => void;
}) {
  const { t, language, href } = useSiteLanguage();
  const record = universitySpotlight(universityId, year);
  const allYearsRecord = useMemo(
    () => universitySpotlight(universityId, 'all'),
    [universityId],
  );
  const { university } = record;
  const [viewer, setViewer] = useState(false);

  // A representative photo can come from another documented edition. The
  // caption always carries its own year so it cannot be read as a photo from
  // the selected edition. A no-record year stays empty and truthful.
  const teamPhoto = record.hasParticipation ? allYearsRecord.teamPhoto : null;
  const selectedProject = record.projects[0] ?? null;
  const representativeAward = record.awards[0] ?? null;
  const representativeYear =
    year === 'all' ? (university.participationYears.at(-1) ?? null) : year;
  const headingId = `spotlight-title-${universityId}`;

  return (
    <article
      className={styles.spotlight}
      data-spotlight={universityId}
      data-year={year}
      data-compact={compact}
      data-particle-reading-region
      aria-labelledby={headingId}
    >
      <div className={styles.identity}>
        <a
          className={styles.logoLink}
          href={university.website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t(
            b(
              `${university.name} official website`,
              `${universityName(university, 'zh')}官方网站`,
            ),
          )}
        >
          <UniversityLogo university={university} />
        </a>
        <div className={styles.identityMeta}>
          <span className={styles.eyebrow}>
            {t(b('University spotlight', '高校焦点'))}
          </span>
          <p className={styles.location}>
            {universityLocation(university, language)}
          </p>
        </div>
      </div>

      <h3 id={headingId} className={styles.title}>
        {universityName(university, language)}
      </h3>

      <div className={styles.quickActions}>
        <button type="button" onClick={onLocate}>
          {t(b('Locate on globe', '在地球上查看'))}
        </button>
      </div>

      <UniversityExchange universityId={universityId} year={year} />

      {university.relationshipType !== 'academic' && (
        <section
          className={styles.participation}
          aria-labelledby={`${headingId}-years`}
        >
          <h4 id={`${headingId}-years`}>
            {t(b('Recorded participation', '已收录参赛记录'))}
          </h4>
          {university.participationYears.length > 0 ? (
            <div className={styles.yearPills}>
              {university.participationYears.map((participationYear) => (
                <button
                  key={participationYear}
                  type="button"
                  aria-pressed={year === participationYear}
                  onClick={() => onYear(participationYear as NetworkYear)}
                >
                  {participationYear}
                </button>
              ))}
            </div>
          ) : (
            <p className={styles.muted}>
              {t(
                b(
                  'No participation year is recorded.',
                  '尚未收录具体参赛年份。',
                ),
              )}
            </p>
          )}
        </section>
      )}

      {!record.hasRecord ? (
        <div className={styles.emptyRecord} aria-live="polite">
          <p>
            {t(
              b(
                year === 2025
                  ? 'The competition was not held in 2025.'
                  : year === 2026
                    ? 'The 2026 university roster has not been announced.'
                    : 'No recorded activity for this year.',
                year === 2025
                  ? '2025年未举办赛事。'
                  : year === 2026
                    ? '2026年高校名单待公布。'
                    : '此年份暂无已收录活动记录。',
              ),
            )}
          </p>
          <button type="button" onClick={() => onYear('all')}>
            {t(b('View all years', '查看全部年份'))}
          </button>
        </div>
      ) : (
        <>
          {record.mode !== 'unknown' && (
            <p className={styles.mode}>
              {t(
                record.mode === 'online'
                  ? b('Online participation', '线上参赛')
                  : b('On-site participation', '现场参赛'),
              )}
            </p>
          )}

          {record.hasParticipation && (
            <div className={styles.profileGrid}>
              {teamPhoto && (
                <figure className={styles.teamPhoto}>
                  <button
                    type="button"
                    onClick={() => setViewer(true)}
                    aria-label={t(b('Enlarge team photograph', '放大团队照片'))}
                  >
                    <Photo image={teamPhoto} />
                  </button>
                  <figcaption>
                    <span>{teamPhoto.eventYear}</span>{' '}
                    {t(b('University team photograph', '高校团队合影'))}
                  </figcaption>
                </figure>
              )}

              {selectedProject ? (
                <section
                  className={styles.feature}
                  data-spotlight-project={selectedProject.projectId}
                >
                  <h4>{t(b('Selected project', '代表项目'))}</h4>
                  <p className={styles.featureMeta}>
                    {selectedProject.year ??
                      selectedProject.reportedYear ??
                      '—'}{' '}
                    / {t(selectedProject.awardLabel)}
                  </p>
                  <h5>
                    <a href={href(`/winners/${selectedProject.projectId}/`)}>
                      {selectedProject.projectName ?? selectedProject.teamName}{' '}
                      ↗
                    </a>
                  </h5>
                  <p className={styles.summary}>{t(selectedProject.summary)}</p>
                </section>
              ) : (
                <section className={styles.feature}>
                  <h4>
                    {t(b('Representative participation', '代表参赛记录'))}
                  </h4>
                  {representativeAward ? (
                    <>
                      <p className={styles.featureMeta}>
                        {representativeAward.year} /{' '}
                        {t(b('Award record', '获奖记录'))}
                      </p>
                      <a
                        className={styles.featureLink}
                        href={representativeAward.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t(representativeAward.label)} ↗
                      </a>
                    </>
                  ) : (
                    <p className={styles.summary}>
                      {representativeYear ?? '—'} /{' '}
                      {universityRole(university.relationshipType, language)}
                    </p>
                  )}
                </section>
              )}
            </div>
          )}
        </>
      )}

      <div className={styles.footerActions}>
        <button type="button" onClick={onDetails}>
          {t(b('Explore university profile', '查看高校完整档案'))} ↗
        </button>
        <a href={university.website} target="_blank" rel="noopener noreferrer">
          {t(b('Official university website', '高校官方网站'))} ↗
        </a>
        {year !== 'all' && university.participationYears.includes(year) && (
          <a href={href(`/history/${year}/`)}>
            {t(b('Explore this edition', '浏览本届赛事'))} ↗
          </a>
        )}
      </div>

      {viewer && teamPhoto && (
        <Viewer
          items={[teamPhoto]}
          initial={0}
          onClose={() => setViewer(false)}
        />
      )}
    </article>
  );
}
