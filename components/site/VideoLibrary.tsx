import { ArrowUpRight, PlayCircle } from 'lucide-react';
import { bilingual as b } from '@/content/competition';
import { videoLibrary, type VideoLibraryItem } from '@/content/video-library';
import { useSiteLanguage } from '@/hooks/use-site-language';
import styles from './VideoLibrary.module.css';

const platformLabels = {
  bilibili: b('Bilibili', 'B站'),
  youtube: b('YouTube', 'YouTube'),
  x: b('X / Twitter', 'X / Twitter'),
  instagram: b('Instagram', 'Instagram'),
} as const;

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${remainder}`;
}

function PlatformLinks({ video }: { video: VideoLibraryItem }) {
  const { t } = useSiteLanguage();
  const platforms = (
    Object.keys(platformLabels) as Array<keyof typeof platformLabels>
  ).map((id) => ({
    id,
    label: t(platformLabels[id]),
    url: video.links[id],
  }));

  return (
    <div
      className={styles.platforms}
      aria-label={t(b('Watch on a platform', '选择观看平台'))}
    >
      {platforms.map(({ id, label, url }) =>
        url ? (
          <a
            key={id}
            className={styles.platformLink}
            data-video-platform={id}
            data-video-link={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t(video.title)} · ${t(id === 'x' ? b('View post on', '查看帖子：') : b('Watch on', '在'))} ${label} · ${t(b('opens in a new tab', '在新标签页打开'))}`}
          >
            {label}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        ) : (
          <span
            key={id}
            className={styles.platformPending}
            data-video-pending={id}
            aria-label={`${label} · ${t(b('Link pending', '链接待补充'))}`}
          >
            {label} · {t(b('Link pending', '链接待补充'))}
          </span>
        ),
      )}
    </div>
  );
}

function VideoCard({ video }: { video: VideoLibraryItem }) {
  const { t } = useSiteLanguage();
  // Local static covers are served directly by this Vite preview, like archive photos.
  /* oxlint-disable next/no-img-element */
  const posterContent = (
    <>
      <img
        className={styles.posterImage}
        src={video.poster}
        width={video.posterWidth}
        height={video.posterHeight}
        alt={t(video.title)}
        loading="lazy"
        decoding="async"
      />
      <span className={styles.playIcon} aria-hidden="true">
        <PlayCircle size={38} strokeWidth={1.5} />
      </span>
      <time
        className={styles.duration}
        dateTime={`PT${video.durationSeconds}S`}
      >
        {formatDuration(video.durationSeconds)}
      </time>
    </>
  );
  /* oxlint-enable next/no-img-element */

  return (
    <article className={styles.card} data-video-id={video.id}>
      {video.links.bilibili ? (
        <a
          className={styles.posterLink}
          href={video.links.bilibili}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t(video.title)} · ${t(b('Watch on Bilibili', '在B站观看'))} · ${t(b('opens in a new tab', '在新标签页打开'))}`}
        >
          {posterContent}
        </a>
      ) : (
        <div className={styles.posterFrame}>{posterContent}</div>
      )}
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span>{t(video.year)}</span>
          <span>{t(b('Video', '视频'))}</span>
        </div>
        <h3>{t(video.title)}</h3>
        <p>{t(video.description)}</p>
        <PlatformLinks video={video} />
      </div>
    </article>
  );
}

export default function VideoLibrary() {
  const { t } = useSiteLanguage();
  return (
    <section
      id="videos"
      className={styles.section}
      aria-labelledby="video-library-title"
      data-particle-reading-region
    >
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>{t(b('VIDEO ARCHIVE', '视频档案'))}</p>
          <h2 id="video-library-title">{t(b('Videos', '视频'))}</h2>
        </div>
        <p className={styles.intro}>
          {t(
            b(
              'Watch selected Chengdu 80 talks, event films and retrospective footage on the platforms where they are published.',
              '在已发布的平台观看成都八零嘉宾分享、赛事专题与历届回顾视频。',
            ),
          )}
        </p>
      </div>
      <div className={styles.grid}>
        {videoLibrary.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}
