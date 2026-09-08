import { ArrowUpRight, Play } from 'lucide-react';
import { bilingual as b } from '@/content/competition';
import { videoChannel } from '@/content/video-channel';
import { publicArchiveImages } from '@/content/archive-media';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { Photo } from './ArchiveGallery';
import styles from './VideoChannel.module.css';

export default function VideoChannel({
  url = videoChannel.youtubeUrl,
}: {
  url?: string | null;
}) {
  const { t } = useSiteLanguage();
  const cover = publicArchiveImages.find(
    (image) => image.id === 'cd80-2024-01',
  );
  return (
    <section
      id="videos"
      className={styles.section}
      aria-labelledby="video-channel-title"
      data-particle-reading-region
    >
      <div className={styles.cover}>
        {cover && <Photo image={cover} full />}
        <span className={styles.coverCaption}>
          {t(b('Chengdu 80 · 2024 awards ceremony', '成都八零 · 2024颁奖现场'))}
        </span>
      </div>
      <div className={styles.content}>
        <p className={styles.eyebrow}>
          <Play size={17} aria-hidden="true" /> YOUTUBE
        </p>
        <h2 id="video-channel-title">
          {t(b('Chengdu 80 on YouTube', '成都八零 · YouTube'))}
        </h2>
        <p className={styles.description}>
          {t(
            url
              ? b(
                  'Watch past competitions, event recordings and promotional films on YouTube.',
                  '前往 YouTube，观看历届比赛、现场记录与宣传视频。',
                )
              : b(
                  'Past competitions, event recordings and promotional films are coming to YouTube.',
                  '历届比赛、现场记录与宣传视频，将陆续发布在 YouTube。',
                ),
          )}
        </p>
        {url ? (
          <a
            className={styles.action}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(
              b(
                'Watch on YouTube (opens in a new tab)',
                '前往 YouTube 观看（新标签页打开）',
              ),
            )}
          >
            {t(b('Watch on YouTube', '前往 YouTube 观看'))}
            <ArrowUpRight size={19} aria-hidden="true" />
          </a>
        ) : (
          <output className={styles.pending}>
            {t(b('Coming soon', '即将上线'))}
          </output>
        )}
      </div>
    </section>
  );
}
