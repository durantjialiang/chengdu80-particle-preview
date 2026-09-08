import { useState, type ReactNode } from 'react';
import { ArrowUpRight, Expand } from 'lucide-react';
import { bilingual as b, type Localized } from '@/content/competition';
import { publicArchiveImages } from '@/content/archive-media';
import { publicCityImages } from '@/content/city-collaboration-media';
import {
  cityInstitutions,
  citySceneImageIds,
  type CityInstitution,
} from '@/content/city-collaboration';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { Photo, Viewer } from './ArchiveGallery';
import styles from './CityCollaboration.module.css';

const sceneIds = [
  ...citySceneImageIds,
  ...cityInstitutions.flatMap((institution) =>
    institution.photo ? [institution.photo.imageId] : [],
  ),
];
const scenes = [...new Set(sceneIds)].flatMap((id) =>
  [...publicArchiveImages, ...publicCityImages].filter(
    (image) => image.id === id,
  ),
);

function Institution({
  institution,
  featured = false,
  photo,
}: {
  institution: CityInstitution;
  featured?: boolean;
  photo?: ReactNode;
}) {
  const { t } = useSiteLanguage();
  return (
    <article
      className={styles.institution}
      data-city-institution={institution.id}
      data-featured={featured}
    >
      {photo && <div className={styles.institutionMedia}>{photo}</div>}
      <p className={styles.role}>{t(institution.role)}</p>
      <h3>
        {institution.website ? (
          <a
            href={institution.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t(institution.name)} · ${t(b('Official website (opens in a new tab)', '官网（新标签页打开）'))}`}
          >
            {t(institution.name)}
            <ArrowUpRight aria-hidden="true" />
          </a>
        ) : (
          t(institution.name)
        )}
      </h3>
      <p className={styles.summary}>{t(institution.summary)}</p>
    </article>
  );
}

export default function CityCollaboration() {
  const { t } = useSiteLanguage();
  const [selected, setSelected] = useState<number | null>(null);
  const scene = (id: string, label?: Localized) => {
    const index = scenes.findIndex((image) => image.id === id);
    const image = scenes[index];
    return (
      image && (
        <button
          className={styles.photo}
          type="button"
          onClick={() => setSelected(index)}
          aria-label={`${t(b('View photo', '查看图片'))} · ${t(label ?? image.caption)}`}
        >
          <Photo image={image} full />
          <span className={styles.photoMeta}>
            <span>{label ? t(label) : `CHENGDU 80 · ${image.eventYear}`}</span>
            <Expand size={18} aria-hidden="true" />
          </span>
        </button>
      )
    );
  };
  return (
    <section
      id="city-collaboration"
      className={styles.section}
      data-particle-reading-region
      aria-labelledby="city-collaboration-title"
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            {t(b('CITY × UNIVERSITY × INDUSTRY', '城市 × 高校 × 产业'))}
          </p>
          <h2 id="city-collaboration-title">
            {t(
              b(
                'Rooted in Chengdu.\nConnected to the world.',
                '植根成都，\n连接世界。',
              ),
            )}
          </h2>
        </div>
        <p className={styles.intro}>
          {t(
            b(
              'A city where research meets practice. From the joint development of FIC to international forums and university–district collaboration, Chengdu brings people and ideas together.',
              '从共建金融科技国际联合实验室，到国际论坛与校地合作，成都让研究、人才与产业在这里相遇。',
            ),
          )}
        </p>
      </header>

      <div className={styles.feature}>
        {scene(citySceneImageIds[0])}
        <Institution institution={cityInstitutions[0]} featured />
      </div>
      <div className={styles.grid}>
        {cityInstitutions.slice(1).map((institution) => (
          <Institution
            key={institution.id}
            institution={institution}
            photo={
              institution.photo &&
              scene(institution.photo.imageId, institution.photo.label)
            }
          />
        ))}
      </div>

      <div className={styles.people}>
        <div className={styles.peopleCopy}>
          <p className={styles.eyebrow}>
            {t(b('PEOPLE MAKE THE CONNECTION', '让合作走进现场'))}
          </p>
          <h3>
            {t(
              b(
                'Global ideas.\nA shared workspace.',
                '全球的想法，\n共同的现场。',
              ),
            )}
          </h3>
          <p>
            {t(
              b(
                'University teams gather in Chengdu to discuss, build and present. The competition creates a shared setting for hands-on fintech innovation.',
                '高校团队相聚成都，在讨论、开发与展示中，把金融科技的想法做成原型。合作，也从一次次面对面的交流开始。',
              ),
            )}
          </p>
        </div>
        {scene(citySceneImageIds[1])}
      </div>
      {selected !== null && (
        <Viewer
          items={scenes}
          initial={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
