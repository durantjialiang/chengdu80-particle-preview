import { ArrowUpRight } from 'lucide-react';
import { bilingual as b } from '@/content/competition';
import { videoChannel } from '@/content/video-channel';
import { useSiteLanguage } from '@/hooks/use-site-language';
import styles from './VideoChannel.module.css';

/** An external channel entry; no embedded player or background platform request. */
export default function VideoChannel({
  url = videoChannel.youtubeUrl,
}: {
  url?: string | null;
}) {
  const { t } = useSiteLanguage();
  if (!url) return null;
  return (
    <section
      id="youtube-channel"
      className={styles.section}
      aria-labelledby="video-channel-title"
      data-particle-reading-region
    >
      <h2 id="video-channel-title">
        {t(b('Chengdu 80 on YouTube', '成都八零 · YouTube'))}
      </h2>
      <a
        className={styles.action}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t(
          b(
            'Visit our YouTube channel (opens in a new tab)',
            '访问 YouTube 频道（新标签页打开）',
          ),
        )}
      >
        {t(b('Visit our YouTube channel', '访问 YouTube 频道'))}
        <ArrowUpRight size={19} aria-hidden="true" />
      </a>
    </section>
  );
}
