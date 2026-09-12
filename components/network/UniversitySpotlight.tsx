import { bilingual as b } from '@/content/competition';
import type { UniversityId } from '@/content/network';
import { academicInstitutionForUniversity } from '@/content/academic-institutions';
import { universityName, universityLocation } from '@/content/university-i18n';
import {
  universitySpotlight,
  type NetworkYear,
} from '@/lib/university-explorer';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { UniversityLogo } from './UniversityLogo';
import UniversityRelationships from './UniversityRelationships';
import styles from './UniversitySpotlight.module.css';

/** One representative story; the complete dated record lives in the dialog. */
export default function UniversitySpotlight({
  universityId,
  year,
  compact,
  onLocate,
  onDetails,
}: {
  universityId: UniversityId;
  year: NetworkYear;
  compact: boolean;
  onLocate: () => void;
  onDetails: () => void;
}) {
  const { t, language, href } = useSiteLanguage();
  const record = universitySpotlight(universityId, year);
  const { university } = record;
  const institution = academicInstitutionForUniversity(universityId);
  const exchange =
    institution &&
    (year === 'all' || institution.years.some((value) => value === year))
      ? institution
      : null;
  const project = record.projects[0];
  const award = record.awards[0];
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
          href={university.website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${universityName(university, language)} · ${t(b('Official website', '官方网站'))}`}
        >
          <UniversityLogo university={university} />
        </a>
        <p className={styles.location}>
          {universityLocation(university, language)}
        </p>
      </div>
      <h3 id={headingId} className={styles.title}>
        {universityName(university, language)}
      </h3>
      {language === 'zh' && (
        <p className={styles.englishName} lang="en">
          {university.name}
        </p>
      )}
      <UniversityRelationships university={university} />
      <div className={styles.quickActions}>
        <button type="button" onClick={onLocate}>
          {t(b('Locate on globe', '在地球上查看'))}
        </button>
      </div>
      <section
        className={styles.feature}
        data-university-exchange={exchange ? universityId : undefined}
        data-spotlight-feature={
          exchange ? 'exchange' : project ? 'project' : 'participation'
        }
      >
        {exchange ? (
          <>
            <h4>{t(b('Academic exchange', '学术交流'))}</h4>
            <p className={styles.featureMeta}>
              {year === 'all' ? exchange.period : year} ·{' '}
              {t(exchange.relationship)}
            </p>
            <p className={styles.summary}>{t(exchange.conciseSummary)}</p>
          </>
        ) : project ? (
          <>
            <h4>{t(b('Selected project', '代表项目'))}</h4>
            <p className={styles.featureMeta}>
              {project.year ?? project.reportedYear} · {t(project.awardLabel)}
            </p>
            <h5>
              <a href={href(`/winners/${project.projectId}/`)}>
                {project.projectName ?? project.teamName} ↗
              </a>
            </h5>
            <p className={styles.summary}>{t(project.summary)}</p>
          </>
        ) : (
          <>
            <h4>{t(b('Representative participation', '代表参赛记录'))}</h4>
            {award ? (
              <>
                <p className={styles.featureMeta}>
                  {award.year} · {t(b('Award record', '获奖记录'))}
                </p>
                <h5>{t(award.label)}</h5>
              </>
            ) : (
              <p className={styles.summary}>
                {year === 'all' ? university.participationYears.at(-1) : year} ·{' '}
                {t(b('Chengdu 80 university team', '成都八零高校参赛团队'))}
              </p>
            )}
            {record.mode !== 'unknown' && (
              <p className={styles.summary}>
                {t(
                  record.mode === 'online'
                    ? b('Online participation', '线上参赛')
                    : b('On-site participation', '现场参赛'),
                )}
              </p>
            )}
          </>
        )}
      </section>
      <div className={styles.footerActions}>
        <button type="button" onClick={onDetails}>
          {t(b('Explore university profile', '查看高校完整档案'))} ↗
        </button>
        <a href={university.website} target="_blank" rel="noopener noreferrer">
          {t(b('Official website', '高校官方网站'))} ↗
        </a>
      </div>
    </article>
  );
}
