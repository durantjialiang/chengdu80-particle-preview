import type { ProjectStudy } from '@/content/project-studies';
import { bilingual as b } from '@/content/competition';
import { useSiteLanguage } from '@/hooks/use-site-language';
import styles from './ProjectTechnicalApproach.module.css';

/** Shared inside the existing native disclosure on annual and project pages. */
export default function ProjectTechnicalApproach({
  study,
}: {
  study: ProjectStudy;
}) {
  const { t } = useSiteLanguage();
  return (
    <div
      className={styles.approach}
      data-technical-basis={
        study.technicalInterpretation ? 'interpretation' : 'documented-design'
      }
    >
      {study.technicalInterpretation && (
        <p className={styles.scope}>
          {t(
            b(
              'Design interpretation based on the published highlights, not a disclosed team implementation.',
              '方案解读：依据公开作品亮点展开，非原团队已披露的实现细节。',
            ),
          )}
        </p>
      )}
      <p className={styles.intro}>{t(study.technical)}</p>
      <ol className={styles.steps}>
        {study.technicalSteps.map((step, index) => (
          <li key={step.title.en}>
            <span className={styles.number} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <strong className={styles.stepTitle}>{t(step.title)}</strong>
              <p className={styles.description}>{t(step.description)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
