import type { Project } from '@/content/archive';
import { bilingual as b } from '@/content/competition';
import {
  projectStudies,
  projectDirectionById,
  projectDirections,
} from '@/content/project-studies';
import { getUniversity } from '@/content/universities';
import { universityName } from '@/content/university-i18n';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { UniversityLogo } from '@/components/network/UniversityLogo';
import styles from './EditionProjectShowcase.module.css';

/** One shared project record, presented as a timeline preview or an annual feature. */
export default function EditionProjectShowcase({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  const { t, href, language } = useSiteLanguage();
  const university = getUniversity(project.universityId);
  const study = projectStudies[project.projectId];
  const direction = projectDirections[projectDirectionById[project.projectId]];
  const title = project.projectName ?? project.teamName;
  return (
    <section
      id={compact ? undefined : `project-${project.projectId}`}
      className={styles.showcase}
      data-edition-project={project.projectId}
      data-compact={compact}
      aria-labelledby={`${compact ? 'preview' : 'feature'}-${project.projectId}`}
    >
      <div className={styles.identity}>
        <UniversityLogo university={university} />
        <p className={styles.school}>{universityName(university, language)}</p>
        <span className={styles.award}>{t(project.awardLabel)}</span>
        <h3 id={`${compact ? 'preview' : 'feature'}-${project.projectId}`}>
          {title}
        </h3>
        {!project.projectName && (
          <span className={styles.teamLabel}>
            {t(b('Team project', '团队作品'))}
          </span>
        )}
        {direction && <span className={styles.direction}>{t(direction)}</span>}
      </div>
      <div className={styles.story}>
        <p className={styles.solution}>
          {t(compact ? project.summary : (study?.solution ?? project.summary))}
        </p>
        {study && !compact && (
          <>
            <div className={styles.context}>
              <div>
                <h4>{t(b('The challenge', '要解决的问题'))}</h4>
                <p>{t(study.problem)}</p>
              </div>
              <div>
                <h4>{t(b('Designed for', '面向的用户'))}</h4>
                <p>{t(study.users)}</p>
              </div>
            </div>
            <h4 className={styles.featureHeading}>
              {t(b('Inside the prototype', '作品亮点'))}
            </h4>
            <ul className={styles.features}>
              {study.features.map((feature, i) => (
                <li key={feature.en}>
                  <span aria-hidden="true">0{i + 1}</span>
                  <p>{t(feature)}</p>
                </li>
              ))}
            </ul>
            <details className={styles.technical}>
              <summary>
                {t(b('Explore the technical approach', '展开技术方案'))}
              </summary>
              <p>{t(study.technical)}</p>
            </details>
          </>
        )}
        <a
          className={styles.link}
          href={href(
            compact
              ? `/history/${project.year}/#project-${project.projectId}`
              : `/winners/${project.projectId}/`,
          )}
        >
          {t(
            compact
              ? b('Explore this year’s project', '了解本届作品')
              : b('View full project', '查看完整作品'),
          )}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
