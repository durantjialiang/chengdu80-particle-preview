import { useState } from 'react';
import type { UniversityId } from '@/content/network';
import { bilingual as b } from '@/content/competition';
import { universityName, universityLocation } from '@/content/university-i18n';
import {
  universitySpotlight,
  type NetworkYear,
} from '@/lib/university-explorer';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { UniversityLogo } from './UniversityLogo';
import { Photo, Viewer } from '@/components/site/ArchiveGallery';
import styles from './Network.module.css';

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
  const { university, teamPhoto } = record;
  const [viewer, setViewer] = useState(false);
  return (
    <article
      className={styles.spotlight}
      data-spotlight={universityId}
      data-year={year}
      data-particle-reading-region
      aria-labelledby="spotlight-title"
    >
      <div className={styles.spotlightIdentity}>
        <a
          href={university.website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={universityName(university, language)}
        >
          <UniversityLogo university={university} />
        </a>
        <span className={styles.eyebrow}>
          {year === 'all' ? t(b('Across the years', '历届记录')) : year}
        </span>
      </div>
      <h3 id="spotlight-title">
        <a href={university.website} target="_blank" rel="noopener noreferrer">
          {universityName(university, language)} ↗
        </a>
      </h3>
      <p className={styles.location}>
        {universityLocation(university, language)}
      </p>
      <div className={styles.spotlightActions}>
        <button type="button" onClick={onLocate}>
          {t(b('Locate on globe', '在地球上查看'))}
        </button>
        <button type="button" onClick={onDetails}>
          {t(b('University details', '高校详情'))} ↗
        </button>
      </div>
      {!record.hasRecord ? (
        <div className={styles.emptyRecord} aria-live="polite">
          <p>
            {t(
              b(
                'No recorded participation for this year.',
                '此年份暂无已收录记录。',
              ),
            )}
          </p>
          <button type="button" onClick={() => onYear('all')}>
            {t(b('View all years', '查看全部年份'))}
          </button>
        </div>
      ) : (
        <>
          <div
            className={styles.yearPills}
            aria-label={t(b('Recorded participation years', '已收录参赛年份'))}
          >
            {university.participationYears.map((y) => (
              <button
                key={y}
                type="button"
                aria-pressed={year === y}
                onClick={() => onYear(y as NetworkYear)}
              >
                {y}
              </button>
            ))}
          </div>
          {record.mode !== 'unknown' && (
            <p className={styles.mode}>
              {t(
                record.mode === 'online'
                  ? b('Online participation', '线上参赛')
                  : b('On-site participation', '现场参赛'),
              )}
            </p>
          )}
          {teamPhoto ? (
            <figure className={styles.teamPhoto}>
              <button
                type="button"
                onClick={() => setViewer(true)}
                aria-label={t(b('Enlarge team photograph', '放大团队照片'))}
              >
                <Photo image={teamPhoto} />
              </button>
              <figcaption>
                {teamPhoto.eventYear} / {t(b('University team', '高校团队'))}
              </figcaption>
            </figure>
          ) : (
            <p className={styles.photoPlaceholder}>
              {t(b('Team photograph to follow', '团队照片待补'))}
            </p>
          )}
          <div className={styles.spotlightProjects}>
            <h4>{t(b('Ideas into prototypes', '从创想到作品'))}</h4>
            {record.projects.slice(0, compact ? 1 : 2).map((project) => (
              <div
                className={styles.projectPreview}
                key={project.projectId}
                data-spotlight-project={project.projectId}
              >
                <span>
                  {project.year} / {t(project.awardLabel)}
                </span>
                <h5>
                  <a href={href(`/winners/${project.projectId}/`)}>
                    {project.projectName ?? project.teamName} ↗
                  </a>
                </h5>
                {project.projectName && project.teamName && (
                  <p>{project.teamName}</p>
                )}
                <p>{t(project.summary)}</p>
              </div>
            ))}
            {record.projects.length === 0 && (
              <p>
                {t(
                  b(
                    'No project profile recorded for this selection.',
                    '当前选择暂无已建档作品。',
                  ),
                )}
              </p>
            )}
          </div>
          {record.awards.length > 0 && (
            <div className={styles.awardList}>
              <h4>{t(b('Recognition', '获奖记录'))}</h4>
              {record.awards.slice(0, compact ? 1 : 3).map((award) => (
                <p key={award.id}>
                  <span>{award.year}</span>{' '}
                  <a
                    href={award.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t(award.label)} ↗
                  </a>
                </p>
              ))}
            </div>
          )}
          {year !== 'all' && (
            <a className={styles.pageLink} href={href(`/history/${year}/`)}>
              {t(b('Explore this edition', '浏览本届赛事'))} ↗
            </a>
          )}
        </>
      )}
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
