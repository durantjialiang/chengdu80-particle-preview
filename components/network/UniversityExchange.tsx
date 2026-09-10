import { academicInstitutionForUniversity } from '@/content/academic-institutions';
import { bilingual as b } from '@/content/competition';
import { useSiteLanguage } from '@/hooks/use-site-language';
import type { UniversityId } from '@/content/universities';
import type { NetworkYear } from '@/lib/university-explorer';
import styles from './UniversityExchange.module.css';

export default function UniversityExchange({
  universityId,
  year = 'all',
  detail = false,
}: {
  universityId: UniversityId;
  year?: NetworkYear;
  detail?: boolean;
}) {
  const { t, href } = useSiteLanguage();
  const exchange = academicInstitutionForUniversity(universityId);
  if (
    !exchange ||
    (year !== 'all' && !exchange.years.some((value) => value === year))
  )
    return null;
  const Heading = detail ? 'h3' : 'h4';
  return (
    <section
      className={styles.exchange}
      data-university-exchange={universityId}
    >
      <Heading>{t(b('Academic exchange', '学术交流合作'))}</Heading>
      <p className={styles.meta}>
        {exchange.period} · {t(exchange.relationship)}
      </p>
      <p>{t(exchange.summary)}</p>
      <div className={styles.links}>
        <a href={href(`/partners/#${exchange.collaboratorId}`)}>
          {t(b('Collaborator & event photographs', '合作学者与现场照片'))} ↗
        </a>
        <a href={href(`/partners/#${exchange.id}`)}>
          {t(b('Institutional connection', '查看单位合作介绍'))} ↗
        </a>
      </div>
    </section>
  );
}
