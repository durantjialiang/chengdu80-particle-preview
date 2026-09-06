import { useState } from 'react';
import {
  editions,
  projects,
  sources,
  projectTitle,
  statusLabels,
  editionUniversities,
  type SourceId,
  type Project,
} from '@/content/archive';
import { universities, getUniversity } from '@/content/universities';
import { bilingual as b, type Localized } from '@/content/competition';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { useUrlFilters } from '@/hooks/use-url-filters';
import styles from './Site.module.css';

export function Sources({ ids }: { ids: readonly SourceId[] }) {
  const { t } = useSiteLanguage();
  return (
    <div className={styles.sourceList}>
      {ids.map((id) => (
        <a
          key={id}
          className={styles.source}
          href={sources[id].url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(sources[id].title)} ↗
        </a>
      ))}
    </div>
  );
}
export function CopyLink() {
  const { t } = useSiteLanguage();
  const [state, setState] = useState<'idle' | 'success' | 'fallback'>('idle');
  const [link, setLink] = useState('');
  return (
    <div className={styles.copy}>
      <button
        type="button"
        className={styles.primary}
        onClick={async () => {
          const url = location.href;
          setLink(url);
          setState('idle');
          try {
            await navigator.clipboard.writeText(url);
            setState('success');
          } catch {
            setState('fallback');
          }
        }}
      >
        {t(b('Copy page link', '复制页面链接'))}
      </button>
      <output>
        {state === 'success'
          ? t(b('Link copied.', '链接已复制。'))
          : state === 'fallback'
            ? t(b('Select and copy this link:', '请选中并复制此链接：'))
            : ''}
      </output>
      {state === 'fallback' ? (
        <input
          aria-label={t(b('Page link', '页面链接'))}
          value={link}
          readOnly
          onFocus={(e) => e.currentTarget.select()}
        />
      ) : null}
    </div>
  );
}
export function HistoryPage({ year }: { year?: number }) {
  const { t, href } = useSiteLanguage();
  const record = editions.find((e) => e.year === year);
  if (record) {
    const index = editions.indexOf(record);
    const related = projects.filter((p) => p.year === record.year);
    const schedule: [Localized, string | null][] = [
      [
        b('Event dates', '活动日期'),
        record.startDate ? `${record.startDate} — ${record.endDate}` : null,
      ],
      [b('Development start', '开发开始'), record.developmentStart],
      [b('Development end', '开发结束'), record.developmentEnd],
      [b('Final', '决赛'), record.finalDate],
    ];
    return (
      <>
        <nav className={styles.breadcrumb}>
          <a href={href('/history/')}>{t(b('History', '历届赛事'))}</a>
          <span>/ {year}</span>
        </nav>
        <div className={styles.kicker}>
          {t(statusLabels[record.status])}
          {record.edition
            ? ` / ${t(b('Edition', '届次'))} ${record.edition}`
            : ''}
        </div>
        <h1>
          {year}
          <br />
          {record.challenge
            ? t(record.challenge)
            : t(statusLabels[record.status])}
        </h1>
        <p className={styles.lead}>{t(record.dateNote)}</p>
        {record.status === 'upcoming' ? (
          <a className={styles.primary} href={href('/competition/')}>
            {t(b('2026 Competition', '2026赛事信息'))} →
          </a>
        ) : null}
        <section className={styles.section}>
          <h2>{t(b('Schedule record', '时间记录'))}</h2>
          <dl className={styles.facts}>
            {schedule.map(([label, value]) => (
              <div key={label.en}>
                <dt>{t(label)}</dt>
                <dd>
                  {value ??
                    t(
                      record.status === 'not-held'
                        ? b('Not applicable', '不适用')
                        : b('Not established in this record', '本档案未明确'),
                    )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        {related.length ? (
          <section className={styles.section}>
            <h2>{t(b('Documented results', '有据可查的成果'))}</h2>
            <div className={styles.archiveGrid}>
              {related.map((p) => (
                <WinnerCard project={p} key={p.projectId} />
              ))}
            </div>
          </section>
        ) : null}
        {record.status === 'record-only' ? (
          <section className={styles.section}>
            <a
              className={styles.primary}
              href={href('/winners/data-queens-report/')}
            >
              {t(b('Read the Data Queens record', '查看Data Queens报道档案'))} →
            </a>
          </section>
        ) : null}
        {editionUniversities(record.year).length ? (
          <section className={styles.section}>
            <h2>
              {t(
                b('Universities in the available records', '当前资料中的高校'),
              )}
            </h2>
            <p className={styles.note}>
              {t(
                b(
                  'A source-linked selection, not a complete roster.',
                  '依据来源整理的部分记录，不代表完整名单。',
                ),
              )}
            </p>
            <div className={styles.pills}>
              {editionUniversities(record.year).map((u) => (
                <a
                  key={u.id}
                  href={href(
                    `/global-network/?university=${u.id}#university-card-${u.id}`,
                  )}
                >
                  {u.shortName} ↗
                </a>
              ))}
            </div>
          </section>
        ) : null}
        <section className={styles.section}>
          <h2>{t(b('Sources', '资料来源'))}</h2>
          <Sources ids={record.sourceRefs} />
          {!record.sourceRefs.length ? (
            <p>
              {t(
                b(
                  'Project owner supplied. No public announcement is claimed.',
                  '由项目负责人提供，不作为公开公告表述。',
                ),
              )}
            </p>
          ) : null}
          <CopyLink />
        </section>
        <nav
          className={styles.previousNext}
          aria-label={t(b('Browse editions', '浏览历届'))}
        >
          {index > 0 ? (
            <a href={href(`/history/${editions[index - 1].year}/`)}>
              ← {editions[index - 1].year}
            </a>
          ) : (
            <span />
          )}
          <a href={href('/history/')}>{t(b('All years', '全部年份'))}</a>
          {index < editions.length - 1 ? (
            <a href={href(`/history/${editions[index + 1].year}/`)}>
              {editions[index + 1].year} →
            </a>
          ) : (
            <span />
          )}
        </nav>
      </>
    );
  }
  return (
    <>
      <div className={styles.kicker}>
        CHENGDU 80 / {t(b('HISTORY', '历届赛事'))}
      </div>
      <h1>{t(b('Ideas, across the years.', '沿着年份，\n回看创新。'))}</h1>
      <p className={styles.lead}>
        {t(
          b(
            'Source-linked editions and reports since 2018. Event dates, development windows and publication dates are kept distinct.',
            '从2018年开始的赛事与报道档案。活动日期、开发时段与新闻发布日期分别记录。',
          ),
        )}
      </p>
      <nav className={styles.pills} aria-label={t(b('Years', '年份'))}>
        {editions.map((e) => (
          <a key={e.year} href={`#year-${e.year}`}>
            {e.year}
          </a>
        ))}
      </nav>
      <div className={styles.timeline}>
        {editions.map((e) => (
          <article id={`year-${e.year}`} key={e.year}>
            <div className={styles.year}>{e.year}</div>
            <div>
              <p className={styles.note}>{t(statusLabels[e.status])}</p>
              <h2>
                <a href={href(`/history/${e.year}/`)}>
                  {e.challenge ? t(e.challenge) : t(statusLabels[e.status])}{' '}
                  <span aria-hidden="true">↗</span>
                </a>
              </h2>
              <p>{t(e.dateNote)}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
export function WinnerCard({ project: p }: { project: Project }) {
  const { t, href } = useSiteLanguage();
  return (
    <article className={styles.archiveCard}>
      <div className={styles.kicker}>
        {p.year ?? `${t(b('Report', '报道'))} ${p.reportedYear}`} /{' '}
        {getUniversity(p.universityId).shortName}
      </div>
      <h3>
        <a href={href(`/winners/${p.projectId}/`)}>{t(projectTitle(p))} ↗</a>
      </h3>
      <p>{t(p.summary)}</p>
      <span className={styles.award}>{t(p.awardLabel)}</span>
    </article>
  );
}
const winnerKeys = ['year', 'university'] as const;
export function WinnersPage({ projectId }: { projectId?: string }) {
  const { t, href } = useSiteLanguage();
  const [query, setQuery] = useState('');
  const { filters, change } = useUrlFilters(winnerKeys);
  const record = projects.find((p) => p.projectId === projectId);
  if (record)
    return (
      <>
        <nav className={styles.breadcrumb}>
          <a href={href('/winners/')}>{t(b('Winners', '成果档案'))}</a>
          <span>/ {record.projectName ?? record.teamName}</span>
        </nav>
        <div className={styles.kicker}>
          {record.year ??
            `${t(b('Published report', '报道发表于'))} ${record.reportedYear}`}{' '}
          / {getUniversity(record.universityId).shortName}
        </div>
        <h1>{t(projectTitle(record))}</h1>
        <p className={styles.lead}>{t(record.summary)}</p>
        <section className={styles.section}>
          <dl className={styles.facts}>
            <div>
              <dt>{t(b('University', '学校'))}</dt>
              <dd>
                <a
                  href={href(
                    `/global-network/?university=${record.universityId}#university-card-${record.universityId}`,
                  )}
                >
                  {getUniversity(record.universityId).name} ↗
                </a>
              </dd>
            </div>
            <div>
              <dt>{t(b('Team', '团队'))}</dt>
              <dd>
                {record.teamName ??
                  t(b('Not named in the cited record', '引用记录未明确命名'))}
              </dd>
            </div>
            <div>
              <dt>{t(b('Product name', '产品专名'))}</dt>
              <dd>
                {record.projectName ??
                  t(
                    b(
                      'Not established; title describes the team’s record',
                      '尚未明确；标题为团队成果的描述性名称',
                    ),
                  )}
              </dd>
            </div>
            <div>
              <dt>{t(b('Challenge', '赛题'))}</dt>
              <dd>
                {record.challenge
                  ? t(record.challenge)
                  : t(b('Not established in this record', '本档案未明确'))}
              </dd>
            </div>
            <div>
              <dt>{t(b('Award', '奖项'))}</dt>
              <dd>{t(record.awardLabel)}</dd>
            </div>
          </dl>
          <p className={styles.note}>
            {t(
              b(
                'Award wording follows the cited source; it is not normalized into an assumed ranking. No live product, demo or source repository is claimed.',
                '奖项保留来源措辞，不据此推定统一名次。此处不宣称存在可用的在线产品、演示或代码仓库。',
              ),
            )}
          </p>
        </section>
        <section className={styles.section}>
          <h2>{t(b('Original reporting', '原始报道'))}</h2>
          <Sources ids={record.sourceRefs} />
          {record.year ? (
            <p>
              <a
                className={styles.primary}
                href={href(`/history/${record.year}/`)}
              >
                {record.year} / {t(b('Edition archive', '赛事档案'))} →
              </a>
            </p>
          ) : (
            <p>
              {t(
                b(
                  'Publication year and competition year are distinct. The event year remains unconfirmed.',
                  '报道年份与参赛年份不同；赛事年份仍待确认。',
                ),
              )}
            </p>
          )}
          <CopyLink />
        </section>
      </>
    );
  const results = projects.filter(
    (p) =>
      (!filters.year ||
        (filters.year === 'unknown'
          ? p.year === null
          : String(p.year) === filters.year)) &&
      (!filters.university || p.universityId === filters.university) &&
      [
        p.projectName,
        p.teamName,
        getUniversity(p.universityId).name,
        getUniversity(p.universityId).shortName,
        p.summary.en,
        p.summary.zh,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <div className={styles.kicker}>
        CHENGDU 80 / {t(b('WINNERS & PROJECTS', '获奖与项目成果'))}
      </div>
      <h1>{t(b('From ideas to evidence.', '创新，\n留下可查的成果。'))}</h1>
      <p className={styles.lead}>
        {t(
          b(
            'Browse documented prototypes, teams and awards. This is a selected archive, not a complete ranking.',
            '查找有来源的原型、团队与获奖记录。这是精选档案，不是完整排名。',
          ),
        )}
      </p>
      <div className={styles.filters}>
        <label>
          {t(
            b('Search projects, teams or universities', '搜索项目、团队或学校'),
          )}
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(b('Try Pisces or NUS', '试试 Pisces 或 NUS'))}
          />
        </label>
        <label>
          {t(b('Competition year', '参赛年份'))}
          <select
            value={filters.year}
            onChange={(e) => change({ year: e.target.value })}
          >
            <option value="">{t(b('All years', '全部年份'))}</option>
            {editions
              .filter((e) => e.status === 'held')
              .map((e) => (
                <option key={e.year}>{e.year}</option>
              ))}
            <option value="unknown">
              {t(b('Event year unconfirmed', '参赛年份待确认'))}
            </option>
          </select>
        </label>
        <label>
          {t(b('University', '学校'))}
          <select
            value={filters.university}
            onChange={(e) => change({ university: e.target.value })}
          >
            <option value="">{t(b('All universities', '全部学校'))}</option>
            {universities
              .filter((u) => projects.some((p) => p.universityId === u.id))
              .map((u) => (
                <option value={u.id} key={u.id}>
                  {u.shortName}
                </option>
              ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => {
            setQuery('');
            change({ year: '', university: '' });
          }}
        >
          {t(b('Clear filters', '清除筛选'))}
        </button>
      </div>
      <output className={styles.resultCount}>
        {results.length} {t(b('records', '条记录'))}
      </output>
      {results.length ? (
        <div className={styles.archiveGrid}>
          {results.map((p) => (
            <WinnerCard project={p} key={p.projectId} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <h2>{t(b('No matching records.', '没有匹配记录。'))}</h2>
          <p>
            {t(
              b(
                'Try another term or clear the filters.',
                '换个关键词，或清除筛选。',
              ),
            )}
          </p>
        </div>
      )}
    </>
  );
}
