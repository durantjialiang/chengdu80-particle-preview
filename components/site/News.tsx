import { ArrowLeft, ArrowUpRight, ArrowRight } from 'lucide-react';
import { bilingual as b } from '@/content/competition';
import { newsArticles, newsCategories, type NewsArticle } from '@/content/news';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { useUrlFilters } from '@/hooks/use-url-filters';
import styles from './News.module.css';
import site from './Site.module.css';

const filterKeys = ['category'] as const;

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

function NewsCard({
  article,
  featured = false,
}: {
  article: NewsArticle;
  featured?: boolean;
}) {
  const { t, href } = useSiteLanguage();
  return (
    <article
      className={featured ? styles.featured : styles.card}
      data-news-card={article.id}
      data-featured={featured}
    >
      <a href={href(`/news/${article.id}/`)}>
        <div className={styles.cover}>
          <Cover article={article} eager={featured} />
        </div>
        <div className={styles.cardBody}>
          {featured && (
            <p className={styles.eyebrow}>
              {t(b('FEATURED STORY', '精选报道'))}
            </p>
          )}
          <ArticleMeta article={article} />
          <h2>{t(article.title)}</h2>
          <p className={styles.summary}>{t(article.summary)}</p>
          <span className={styles.readMore}>
            {t(b('Read story', '阅读全文'))}
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>
      </a>
    </article>
  );
}

export function NewsPage() {
  const { t, href } = useSiteLanguage();
  const { filters, change } = useUrlFilters(filterKeys);
  const category = newsCategories.some((item) => item.id === filters.category)
    ? filters.category
    : '';
  const articles = newsArticles.filter(
    (item) => !category || item.category === category,
  );
  const featured = !category ? articles[0] : undefined;
  const cards = featured ? articles.slice(1) : articles;
  return (
    <div className={styles.newsPage}>
      <p className={site.kicker}>CHENGDU 80 / NEWS</p>
      <h1>{t(b('News', '新闻动态'))}</h1>
      <p className={site.lead}>
        {t(
          b(
            'Stories from the competition, international academic exchange and the people turning ideas into projects.',
            '关注赛事进展、国际学术交流，以及将创意变成项目的人与故事。',
          ),
        )}
      </p>
      <fieldset
        className={styles.filterBar}
        aria-label={t(b('News categories', '新闻分类'))}
      >
        {[{ id: '', label: b('All stories', '全部') }, ...newsCategories].map(
          (item) => (
            <button
              key={item.id}
              type="button"
              data-news-category={item.id}
              aria-pressed={category === item.id}
              onClick={() => change({ category: item.id })}
            >
              {t(item.label)}
            </button>
          ),
        )}
      </fieldset>
      <output className={styles.resultCount} aria-live="polite">
        {articles.length} {t(b('stories', '篇报道'))}
      </output>
      {featured && <NewsCard article={featured} featured />}
      <div className={styles.grid}>
        {cards.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
      <aside className={styles.nextEdition}>
        <div>
          <h2>{t(b('Looking ahead to 2026', '关注2026'))}</h2>
          <p>
            {t(
              b(
                'New competition arrangements will be published on the Competition page.',
                '新一届赛事安排将在参赛信息页更新。',
              ),
            )}
          </p>
        </div>
        <a href={href('/competition/')}>
          {t(b('Competition information', '查看参赛信息'))}
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </aside>
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
