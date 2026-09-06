import { useState } from 'react';
import { publicArchiveImages } from '@/content/archive-media';
import { bilingual as b } from '@/content/competition';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { Photo, Viewer } from './ArchiveGallery';
import styles from './Editorial.module.css';

/** Reuses only the approved archive manifest; never promotes research candidates. */
export default function EditorialMedia({
  ids,
  single = false,
}: {
  ids: readonly string[];
  single?: boolean;
}) {
  const { t } = useSiteLanguage();
  const [selected, setSelected] = useState<number | null>(null);
  const items = ids.flatMap((id) =>
    publicArchiveImages.filter((image) => image.id === id),
  );
  if (!items.length) return null;
  return (
    <>
      <div className={styles.mediaGrid} data-single={single}>
        {items.map((image, index) => (
          <figure key={image.id} data-image-type={image.imageType}>
            <button
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`${t(b('View image', '查看图片'))}: ${t(image.caption)}`}
            >
              <Photo image={image} full />
              <span className={styles.photoYear}>{image.eventYear} ↗</span>
            </button>
            <figcaption>
              {t(image.caption)}
              <small>{image.credit}</small>
            </figcaption>
          </figure>
        ))}
      </div>
      {selected !== null && (
        <Viewer
          items={items}
          initial={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
