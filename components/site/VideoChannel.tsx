import { ArrowUpRight, Play } from 'lucide-react';
import { bilingual as b } from '@/content/competition';
import { videoChannel } from '@/content/video-channel';
import { recap2024Video } from '@/content/recap-2024';
import { useSiteLanguage } from '@/hooks/use-site-language';
import styles from './VideoChannel.module.css';

export default function VideoChannel({
  url = videoChannel.youtubeUrl,
}: {
  url?: string | null;
}) {
  const { t, href } = useSiteLanguage();
  return (
    <section
      id="videos"
      className={styles.section}
      aria-labelledby="video-channel-title"
      data-particle-reading-region
    >
      <div className={styles.cover}>
        <video
          controls
          playsInline
          preload="none"
          poster={recap2024Video.poster}
          width={1280}
          height={720}
          aria-label={t(recap2024Video.title)}
        >
          <source src={recap2024Video.src} type="video/mp4" />
          <track
            kind="captions"
            src={recap2024Video.captions.zh}
            srcLang="zh"
            label="中文"
          />
          <track
            kind="captions"
            src={recap2024Video.captions.en}
            srcLang="en"
            label="English"
          />
          <a href={recap2024Video.src}>
            {t(b('Download the video', '下载视频'))}
          </a>
        </video>
        <span className={styles.coverCaption}>
          {t(b('2024 · 90-second photo film', '2024 · 90秒照片回顾'))}
        </span>
      </div>
      <div className={styles.content}>
        <p className={styles.eyebrow}>
          <Play size={17} aria-hidden="true" /> 2024 / HIGHLIGHTS
        </p>
        <h2 id="video-channel-title">{t(recap2024Video.title)}</h2>
        <p className={styles.description}>{t(recap2024Video.description)}</p>
        <div className={styles.localActions}>
          <a href={href('/media/?year=2024#photos')}>
            {t(b('Explore the 2024 photographs', '浏览2024照片'))} →
          </a>
          <a href={recap2024Video.src} download="Chengdu80-2024-highlights.mp4">
            {t(b('Download the film', '下载回顾片'))} ↓
          </a>
        </div>
        <div className={styles.youtube}>
          <p>{t(b('Chengdu 80 on YouTube', '成都八零 · YouTube'))}</p>
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
      </div>
    </section>
  );
}
