import type { University } from '@/content/universities';
import { universityRelationships } from '@/content/university-relationships';
import { useSiteLanguage } from '@/hooks/use-site-language';
import styles from './UniversityRelationships.module.css';

export default function UniversityRelationships({
  university,
}: {
  university: University;
}) {
  const { t } = useSiteLanguage();
  return (
    <span
      className={styles.badges}
      data-university-relationships={university.id}
    >
      {universityRelationships(university).map(({ id, label }) => (
        <span key={id} className={styles.badge} data-relationship={id}>
          {t(label)}
        </span>
      ))}
    </span>
  );
}
