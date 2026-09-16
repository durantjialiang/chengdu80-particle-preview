import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { bilingual as b } from '@/content/competition';
import { newsArticles, newsCategories, type NewsArticle } from '@/content/news';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { PressCoverage } from './PressCoverage';
import styles from './News.module.css';
import site from './Site.module.css';

function Cover({
  article,
  eager = false,
}: {
  article: NewsArticle;
  eager?: boolean;
}) {
  const { t } = useSiteLanguage();
  // Approved local photographs are served directly by the static Vite site.
  /* oxlint-disable next/no-img-element */
  return (
    <img
      src={article.cover.src}
      alt={t(article.cover.alt)}
      width={article.cover.width}
      height={article.cover.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
  /* oxlint-enable next/no-img-element */
}

function ArticleMeta({ article }: { article: NewsArticle }) {
  const { t } = useSiteLanguage();
  const category = newsCategories.find((item) => item.id === article.category)!;
  return (
    <div className={styles.meta}>
      <span>{t(category.label)}</span>
      <span>{t(article.dateLabel)}</span>
      {article.historical && (
        <span className={styles.historyLabel}>
          {t(b('From the archive', '历史回顾'))}
        </span>
      )}
    </div>
  );
}

function NewsCard({ article }: { article: NewsArticle }) {
  const { t, href } = useSiteLanguage();
  return (
    <article className={styles.card} data-news-card={article.id}>
      <a href={href(`/news/${article.id}/`)}>
        <div className={styles.cover}>
          <Cover article={article} />
        </div>
        <div className={styles.cardBody}>
          <ArticleMeta article={article} />
          <h2>{t(article.title)}</h2>
          <p className={styles.summary}>{t(article.summary)}</p>
          <span className={styles.readMore}>
            {t(b('Explore the visit', '查看交流回顾'))}
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>
      </a>
    </article>
  );
}

export function NewsPage() {
  const { t } = useSiteLanguage();
  return (
    <div className={styles.newsPage}>
      <p className={site.kicker}>CHENGDU 80 / NEWS</p>
      <h1>{t(b('News', '新闻动态'))}</h1>
      <p className={site.lead}>
        {t(
          b(
            'Chengdu 80 in university newsrooms and the media. Explore their coverage and read the original stories.',
            '高校与媒体眼中的成都八零。浏览各机构发布的报道，直接阅读原文。',
          ),
        )}
      </p>
      <PressCoverage />
      <section
        className={styles.guestSection}
        aria-labelledby="guest-retrospectives"
      >
        <p className={styles.eyebrow}>{t(b('FROM THE ARCHIVE', '往届交流'))}</p>
        <h2 id="guest-retrospectives">
          {t(b('Guest retrospectives', '嘉宾回顾'))}
        </h2>
        <p className={styles.guestIntro}>
          {t(
            b(
              'Lars Peter Hansen and Robert Anderson at the 2019 International FinTech Forum: photographs, profiles and talks.',
              '回顾汉森、Robert Anderson参加2019国际金融科技论坛的现场，查看人物介绍、照片与演讲视频。',
            ),
          )}
        </p>
        <div className={styles.guestGrid}>
          {newsArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function NewsArticlePage({ article }: { article: NewsArticle }) {
  const { t, href } = useSiteLanguage();
  const related = newsArticles
    .filter((item) => item.id !== article.id)
    .sort(
      (a, c) =>
        Number(c.category === article.category) -
        Number(a.category === article.category),
    )
    .slice(0, 3);
  return (
    <article className={styles.article} data-news-article={article.id}>
      <a className={styles.back} href={href('/news/')}>
        <ArrowLeft size={17} aria-hidden="true" />
        {t(b('All news', '全部新闻'))}
      </a>
      <header className={styles.articleHeader}>
        <ArticleMeta article={article} />
        <h1>{t(article.title)}</h1>
        <p className={styles.dek}>{t(article.summary)}</p>
      </header>
      <figure className={styles.articleCover}>
        <Cover article={article} eager />
        <figcaption>{t(article.cover.alt)}</figcaption>
      </figure>
      <div className={styles.articleLayout}>
        <div>
          <div className={styles.prose}>
            {article.paragraphs.map((paragraph, index) => (
              <p key={index}>{t(paragraph)}</p>
            ))}
          </div>
          <section className={styles.sources} aria-labelledby="news-sources">
            <h2 id="news-sources">
              {t(b('Explore further & sources', '延伸阅读与来源'))}
            </h2>
            {article.links.map((link) => {
              const external = link.url.startsWith('https://');
              return (
                <a
                  key={link.url}
                  href={external ? link.url : href(link.url)}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                >
                  {t(link.label)}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              );
            })}
          </section>
          <p className={styles.published}>
            {t(b('Published on this website', '本站整理发布'))}:{' '}
            <time dateTime={article.publishedAt}>{article.publishedAt}</time>
          </p>
        </div>
        <aside className={styles.related} aria-labelledby="related-news">
          <h2 id="related-news">{t(b('More stories', '更多报道'))}</h2>
          {related.map((item) => (
            <a href={href(`/news/${item.id}/`)} key={item.id}>
              <span>{t(item.dateLabel)}</span>
              <strong>{t(item.title)}</strong>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          ))}
        </aside>
      </div>
    </article>
  );
}
