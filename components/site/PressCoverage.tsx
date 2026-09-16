import { ArrowUpRight } from 'lucide-react';
import { bilingual as b, type Language } from '@/content/competition';
import {
  pressCategories,
  pressReports,
  type PressCategory,
  type PressReport,
} from '@/content/press-coverage';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { useUrlFilters } from '@/hooks/use-url-filters';
import styles from './PressCoverage.module.css';

const filterKeys = ['category'] as const;

const languageLabels: Record<PressReport['language'], ReturnType<typeof b>> = {
  en: b('English', '英文'),
  'zh-Hans': b('Simplified Chinese', '简体中文'),
  'zh-Hant': b('Traditional Chinese', '繁体中文'),
};

function isPressCategory(value: string): value is PressCategory {
  return pressCategories.some((category) => category.id === value);
}

function formatDate(value: string, language: Language) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}

function ReportDate({ report }: { report: PressReport }) {
  const { language, t } = useSiteLanguage();
  return (
    <div className={styles.dateRow}>
      <span className={styles.eventDate}>
        <span className={styles.detailLabel}>{t(b('Event', '赛事'))}</span>{' '}
        {report.eventYear}
      </span>
      {report.publishedAt ? (
        <span>
          <span className={styles.detailLabel}>
            {t(
              report.originalPublishedAt
                ? b('Republished', '重发')
                : b('Published', '发布'),
            )}
          </span>{' '}
          <time dateTime={report.publishedAt}>
            {formatDate(report.publishedAt, language)}
          </time>
        </span>
      ) : (
        <span className={styles.datePending}>
          {t(b('Publication date not stated', '未标明发布日期'))}
        </span>
      )}
      {report.originalPublishedAt ? (
        <span>
          <span className={styles.detailLabel}>{t(b('Original', '原文'))}</span>{' '}
          <time dateTime={report.originalPublishedAt}>
            {formatDate(report.originalPublishedAt, language)}
          </time>
        </span>
      ) : null}
    </div>
  );
}

function PressCard({
  report,
  priority,
}: {
  report: PressReport;
  priority: boolean;
}) {
  const { t } = useSiteLanguage();
  const category = pressCategories.find((item) => item.id === report.category);
  return (
    <article
      className={`${styles.card} ${priority ? styles.priority : ''}`}
      data-press-card={report.id}
      data-press-category={report.category}
      data-press-priority={priority}
    >
      <a
        className={styles.cardLink}
        href={report.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t(report.title)} · ${t(b('Read original article', '阅读原文'))} · ${t(b('opens in a new tab', '在新标签页打开'))}`}
      >
        <div className={styles.cardTopline}>
          <span className={styles.index} aria-hidden="true">
            {String(pressReports.indexOf(report) + 1).padStart(2, '0')}
          </span>
          {priority && (
            <span className={styles.priorityLabel}>
              {t(b('UNIVERSITY SOURCE', '高校原文'))}
            </span>
          )}
          {category && (
            <span className={styles.category}>{t(category.label)}</span>
          )}
        </div>
        <p className={styles.publisher}>{t(report.publisher)}</p>
        <h3 className={styles.title}>{t(report.title)}</h3>
        <p className={styles.summary}>{t(report.summary)}</p>
        <div className={styles.cardFooter}>
          <ReportDate report={report} />
          <span className={styles.language}>
            {t(b('Original language', '原文语言'))}:{' '}
            {t(languageLabels[report.language])}
          </span>
          <span className={styles.cta}>
            {t(b('Read original article', '阅读原文'))}
            <ArrowUpRight size={17} aria-hidden="true" />
          </span>
        </div>
      </a>
    </article>
  );
}

export function PressCoverage() {
  const { t } = useSiteLanguage();
  const { filters, change } = useUrlFilters(filterKeys);
  const activeCategory = isPressCategory(filters.category)
    ? filters.category
    : '';
  const filteredReports = pressReports.filter(
    (report) => !activeCategory || report.category === activeCategory,
  );
  const priorityIds = new Set(
    pressReports
      .filter((report) => report.category === 'university')
      .map((report) => report.id),
  );
  const orderedReports = [
    ...filteredReports.filter((report) => priorityIds.has(report.id)),
    ...filteredReports.filter((report) => !priorityIds.has(report.id)),
  ];

  return (
    <section
      className={styles.coverage}
      id="press-coverage"
      aria-labelledby="press-coverage-title"
      data-press-coverage
    >
      <div className={styles.heading}>
        <h2 className={styles.sectionTitle} id="press-coverage-title">
          {t(b('University and media coverage', '高校与媒体报道'))}
        </h2>
      </div>
      <fieldset
        className={styles.filterBar}
        aria-label={t(b('Coverage categories', '报道分类'))}
      >
        <legend className={styles.visuallyHidden}>
          {t(b('Coverage categories', '报道分类'))}
        </legend>
        {[
          { id: '', label: b('All coverage', '全部报道') },
          ...pressCategories,
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            data-press-filter={item.id}
            aria-pressed={activeCategory === item.id}
            onClick={() => change({ category: item.id })}
          >
            {t(item.label)}
          </button>
        ))}
      </fieldset>
      <output className={styles.resultCount} aria-live="polite">
        {orderedReports.length} {t(b('reports', '篇报道'))}
      </output>
      {orderedReports.length > 0 ? (
        <div className={styles.grid}>
          {orderedReports.map((report) => (
            <PressCard
              key={report.id}
              report={report}
              priority={priorityIds.has(report.id)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>
            {t(
              b(
                'No coverage has been added in this category yet.',
                '该分类暂未添加报道。',
              ),
            )}
          </p>
        </div>
      )}
    </section>
  );
}
