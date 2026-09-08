import { sources, type Edition } from '@/content/archive';
import { bilingual as b } from '@/content/competition';
import { awardBoard2018And2019 } from '@/content/history-evidence';
import { getUniversity } from '@/content/universities';
import { universityName } from '@/content/university-i18n';
import { UniversityLogo } from '@/components/network/UniversityLogo';
import { useSiteLanguage } from '@/hooks/use-site-language';
import styles from './Site.module.css';
import historyStyles from './History.module.css';

export function AwardBoardLink() {
  const { t } = useSiteLanguage();
  return (
    <a
      className={styles.source}
      href={awardBoard2018And2019.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {t(awardBoard2018And2019.title)} ↗
    </a>
  );
}

export default function EditionAwardRoster({
  edition,
  compact = false,
  headingLevel = 3,
}: {
  edition: Edition;
  compact?: boolean;
  headingLevel?: 3 | 4;
}) {
  const { t, href, language } = useSiteLanguage();
  const Heading = headingLevel === 4 ? 'h4' : 'h3';
  return (
    <div
      className={`${historyStyles.awardGroups} ${compact ? historyStyles.compactAwards : ''}`}
      data-award-year={edition.year}
    >
      {edition.awardResults?.map((result) => (
        <section
          className={historyStyles.awardGroup}
          key={result.id}
          data-award-group={result.id}
        >
          <div className={historyStyles.awardHeading}>
            <Heading>{t(result.label)}</Heading>
            <a
              className={styles.awardSource}
              href={`${sources[result.sourceRef].url}${result.sourcePage ? `#page=${result.sourcePage}` : ''}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(b('Source', '依据'))} ↗
            </a>
          </div>
          <ul className={historyStyles.schools}>
            {result.universityIds.map((id) => (
              <li key={id} data-award-university={id}>
                <a
                  href={href(
                    `/global-network/?year=${edition.year}&university=${id}#university-card-${id}`,
                  )}
                >
                  {!compact && (
                    <UniversityLogo university={getUniversity(id)} />
                  )}
                  <span>
                    {universityName(getUniversity(id), language)}
                    <span aria-hidden="true"> ↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
