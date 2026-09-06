import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, X, Expand } from 'lucide-react';
import reviewImages from 'virtual:history-review-media';
import {
  publicArchiveImages,
  imageFit,
  type ArchiveImage,
} from '@/content/archive-media';
import { bilingual as b } from '@/content/competition';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { getUniversity } from '@/content/universities';
import { universityName } from '@/content/university-i18n';
import styles from './ArchiveGallery.module.css';

const publishedIds = new Set(publicArchiveImages.map((image) => image.id));
const images = [
  ...publicArchiveImages,
  ...reviewImages.filter((image) => !publishedIds.has(image.id)),
];

function Photo({
  image,
  full = false,
  eager = false,
}: {
  image: ArchiveImage;
  full?: boolean;
  eager?: boolean;
}) {
  const { t } = useSiteLanguage();
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <span className={styles.failed}>
        {t(
          b(
            'Image unavailable. See the source record.',
            '图片暂不可用，请查看来源记录。',
          ),
        )}
      </span>
    );
  /* oxlint-disable next/no-img-element */
  return (
    <img
      src={(full ? image.localAssetPath : image.thumbnailPath) ?? undefined}
      width={image.width}
      height={image.height}
      alt={t(image.caption)}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={{ objectFit: full ? 'contain' : imageFit(image.imageType) }}
      onError={() => setFailed(true)}
    />
  );
  /* oxlint-enable next/no-img-element */
}

function Viewer({
  items,
  initial,
  onClose,
}: {
  items: readonly ArchiveImage[];
  initial: number;
  onClose: () => void;
}) {
  const { t } = useSiteLanguage();
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(initial);
  const current = items[index];
  const next = (step: number) =>
    setIndex((i) => (i + step + items.length) % items.length);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={styles.viewer}
      aria-labelledby="archive-viewer-caption"
      data-particle-no-force
      onClose={(event) => {
        // StrictMode reopens the dialog after effect cleanup. Ignore the
        // queued close event from that cleanup when the dialog is open again.
        if (!event.currentTarget.open) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          next(event.key === 'ArrowLeft' ? -1 : 1);
        }
      }}
    >
      <div className={styles.viewerBar}>
        <span>
          {current.eventYear} / {index + 1} · {items.length}
        </span>
        <button
          autoFocus
          aria-label={t(b('Close image viewer', '关闭图片查看器'))}
          onClick={() => dialog.current?.close()}
        >
          <X size={23} />
        </button>
      </div>
      <div className={styles.fullImage}>
        <Photo key={current.id} image={current} full eager />
      </div>
      <div className={styles.viewerBottom}>
        <div className={styles.caption}>
          <h3 id="archive-viewer-caption">{t(current.caption)}</h3>
          <p>
            {current.credit}
            {current.photographer
              ? ` · ${current.photographer}`
              : ` · ${t(b('Photographer not credited in source', '原页面未标摄影者'))}`}
          </p>
          {current.privateReview && (
            <p className={styles.rights}>
              {t(
                b(
                  'Local review only · reuse permission pending',
                  '仅限本地审阅 · 复用授权待确认',
                ),
              )}
            </p>
          )}
          <div className={styles.links}>
            <a
              href={current.sourcePage}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(b('Source article', '原始报道'))} <ExternalLink size={13} />
            </a>
            <a
              href={current.originalImageUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(b('Original image source', '原图出处'))}{' '}
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
        {items.length > 1 && (
          <div className={styles.controls}>
            <button
              onClick={() => next(-1)}
              aria-label={t(b('Previous image', '上一张'))}
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => next(1)}
              aria-label={t(b('Next image', '下一张'))}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
      <span className={styles.srOnly} aria-live="polite">
        {index + 1} / {items.length}: {t(current.caption)}
      </span>
    </dialog>
  );
}

export default function ArchiveGallery({
  year,
  albumId,
  coverId,
  projectId,
  coverOnly = false,
}: {
  year: number;
  albumId?: string;
  coverId?: string;
  projectId?: string;
  coverOnly?: boolean;
}) {
  const { t, href, language } = useSiteLanguage();
  const [selected, setSelected] = useState<number | null>(null);
  const items = images.filter(
    (image) =>
      image.eventYear === year &&
      image.localAssetPath &&
      image.thumbnailPath &&
      (!albumId || image.albumId === albumId) &&
      (!projectId || image.projectId === projectId),
  );
  if (!items.length) {
    if (coverOnly || projectId) return null;
    return (
      <section
        className={styles.pending}
        aria-label={t(b('Photo archive status', '影像档案状态'))}
      >
        <h2>{t(b('Event photo archive', '赛事影像档案'))}</h2>
        <p>
          {t(
            b(
              'Source photos are catalogued; publication awaits reuse permission. Event recap photographs are not treated as winner portraits.',
              '来源照片正在建档，取得复用授权后再公开展示。赛事回顾照片不作为冠军团队照片使用。',
            ),
          )}
        </p>
      </section>
    );
  }
  const cover = items.find((image) => image.id === coverId) ?? items[0];
  if (coverOnly)
    return (
      <figure className={styles.cover}>
        <button
          aria-label={t(b('Open cover photograph', '打开封面照片'))}
          onClick={() => setSelected(items.indexOf(cover))}
        >
          <Photo image={cover} full eager />
          <span className={styles.expand}>
            <Expand size={18} /> {t(b('View image', '查看图片'))}
          </span>
        </button>
        <figcaption>
          {t(cover.caption)} <span>{cover.credit}</span>
        </figcaption>
        {cover.privateReview && (
          <p className={styles.rights}>
            {t(
              b(
                'Local photo review · not cleared for public release',
                '本地照片审阅 · 尚未取得公开复用授权',
              ),
            )}
          </p>
        )}
        {selected !== null && (
          <Viewer
            items={items}
            initial={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </figure>
    );
  return (
    <section
      className={styles.album}
      id={albumId ?? `album-${year}`}
      data-album-id={albumId ?? `edition-${year}`}
    >
      <div className={styles.albumTitle}>
        <h2>{t(b('In the archive', '相册'))}</h2>
        <span>
          {items.length} {t(b('photographs', '张照片'))}
        </span>
      </div>
      <p>
        {t(
          b(
            'Captions follow the source context. Recap, ceremony, team and product images are kept distinct.',
            '图注依据原页面上下文整理；赛事回顾、颁奖现场、团队照片与产品界面分别建档。',
          ),
        )}
      </p>
      <div className={styles.grid}>
        {items.map((image, index) => (
          <figure key={image.id} data-image-type={image.imageType}>
            <button
              aria-label={`${t(b('View image', '查看图片'))} ${index + 1}: ${t(image.caption)}`}
              onClick={() => setSelected(index)}
            >
              <Photo image={image} />
              <span className={styles.expand}>
                <Expand size={18} />
              </span>
            </button>
            <figcaption>
              {t(image.caption)}
              <span>{image.credit}</span>
              {image.universityId && (
                <a
                  className={styles.schoolLink}
                  href={href(
                    `/global-network/?university=${image.universityId}#university-card-${image.universityId}`,
                  )}
                >
                  {universityName(getUniversity(image.universityId), language)}{' '}
                  →
                </a>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
      {items.some((image) => image.privateReview) && (
        <p className={styles.rights}>
          {t(
            b(
              'These photographs are visible only in this loopback review. Reuse permission remains pending.',
              '这些照片仅显示在本地受控审阅中，复用授权仍待确认。',
            ),
          )}
        </p>
      )}
      {selected !== null && (
        <Viewer
          items={items}
          initial={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
