import { useState } from 'react';
import {
  publicEditions as editions,
  projects,
  sources,
  projectTitle,
  statusLabels,
  editionUniversities,
  type SourceId,
  type Project,
  type ArchiveSource,
} from '@/content/archive';
import { universities, getUniversity } from '@/content/universities';
import { bilingual as b } from '@/content/competition';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { useUrlFilters } from '@/hooks/use-url-filters';
import styles from './Site.module.css';
import ArchiveGallery from './ArchiveGallery';
import { universityName } from '@/content/university-i18n';
import { UniversityLogo } from '@/components/network/UniversityLogo';
import {
  projectStudies,
  projectDirections,
  projectDirectionById,
} from '@/content/project-studies';
import EditorialMedia from './EditorialMedia';
import editorial from './Editorial.module.css';
import EditionProjectShowcase from './EditionProjectShowcase';
import historyStyles from './History.module.css';
import ProjectTechnicalApproach from './ProjectTechnicalApproach';
import EditionAwardRoster, { AwardBoardLink } from './EditionAwardRoster';

export function Sources({ ids }: { ids: readonly SourceId[] }) {
  const { t } = useSiteLanguage();
  return (
    <div className={styles.sourceList}>
      {ids.map((id) => {
        const source: ArchiveSource = sources[id];
        return (
          <div key={id}>
            <a
              key={id}
              className={styles.source}
              href={sources[id].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(sources[id].title)} ↗
            </a>
            {source.publishedDate !== undefined && (
              <p className={styles.sourceDate}>
                {t(
                  source.dateBasis === 'url-path'
                    ? b('Date in source URL', '来源网址所示日期')
                    : b('Page publication date', '网页发布日期'),
                )}
                : {source.publishedDate ?? t(b('Not stated', '未标明'))}
                {source.dateNote ? ` · ${t(source.dateNote)}` : ''}
              </p>
            )}
          </div>
        );
      })}
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
  const { t, href, language } = useSiteLanguage();
  const record = editions.find((e) => e.year === year);
  if (record) {
    const index = editions.indexOf(record);
    const related = projects.filter((p) => p.year === record.year);
    const earlyEdition = record.year === 2018 || record.year === 2019;
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
        <p className={styles.lead}>
          {t(record.recap ?? related[0]?.summary ?? record.dateNote)}
        </p>
        <ArchiveGallery
          year={record.year}
          albumId={`edition-${record.year}`}
          coverId={record.coverImageId}
          coverOnly
        />
        {earlyEdition && (
          <section className={styles.section} id="awards">
            <h2>{t(b('Award record', '获奖结果'))}</h2>
            <EditionAwardRoster edition={record} />
            <AwardBoardLink />
          </section>
        )}
        {related.length > 0 && (
          <section className={styles.section}>
            <h2>{t(b('Award-winning projects', '获奖作品'))}</h2>
            {related.map((project) => (
              <EditionProjectShowcase
                project={project}
                key={project.projectId}
              />
            ))}
          </section>
        )}
        {record.status === 'upcoming' ? (
          <a className={styles.primary} href={href('/competition/')}>
            {t(b('2026 Competition', '2026赛事信息'))} →
          </a>
        ) : null}
        {record.awardResults?.length && !earlyEdition ? (
          <section className={styles.section} id="awards">
            <h2>{t(b('Award record', '获奖结果'))}</h2>
            <EditionAwardRoster edition={record} />
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
                  {language === 'zh'
                    ? universityName(u, language)
                    : u.shortName}{' '}
                  ↗
                </a>
              ))}
            </div>
          </section>
        ) : null}
        {(record.year === 2019 ||
          record.year === 2024 ||
          record.media.length > 0) && (
          <ArchiveGallery
            year={record.year}
            albumId={`edition-${record.year}`}
          />
        )}
        <section className={styles.section}>
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
            'From personal fundraising to autonomous-vehicle insurance. Explore the challenges, award-winning prototypes and ideas developed by teams since 2018.',
            '从个人融资到智能驾驶保险，回看2018年以来的历届赛题、获奖作品，以及团队将创意转化为原型的思路。',
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
              {(e.year === 2018 || e.year === 2019) && (
                <section className={historyStyles.timelineAwards}>
                  <h3>{t(b('Award-winning universities', '获奖高校'))}</h3>
                  <EditionAwardRoster edition={e} compact headingLevel={4} />
                  <a
                    className={styles.source}
                    href={href(`/history/${e.year}/#awards`)}
                  >
                    {t(b('View edition awards', '查看本届获奖结果'))} →
                  </a>
                </section>
              )}
              {projects.some((project) => project.year === e.year) ? (
                projects
                  .filter((project) => project.year === e.year)
                  .map((project) => (
                    <EditionProjectShowcase
                      project={project}
                      compact
                      key={project.projectId}
                    />
                  ))
              ) : (
                <p>{t(e.dateNote)}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
export function WinnerCard({ project: p }: { project: Project }) {
  const { t, href } = useSiteLanguage();
  const university = getUniversity(p.universityId);
  return (
    <article className={styles.archiveCard}>
      <a
        className={styles.projectIdentity}
        href={href(`/winners/${p.projectId}/`)}
        data-project-university={university.id}
      >
        <UniversityLogo university={university} />
        <div className={styles.kicker}>
          {p.year ?? `${t(b('Report', '报道'))} ${p.reportedYear}`} /{' '}
          {university.shortName}
        </div>
        <h3>{t(projectTitle(p))} ↗</h3>
      </a>
      <p>{t(p.summary)}</p>
      <span className={styles.award}>{t(p.awardLabel)}</span>
    </article>
  );
}
const winnerKeys = ['year', 'university', 'direction'] as const;
export function WinnersPage({ projectId }: { projectId?: string }) {
  const { t, href, language } = useSiteLanguage();
  const [query, setQuery] = useState('');
  const { filters, change } = useUrlFilters(winnerKeys);
  const record = projects.find((p) => p.projectId === projectId);
  const study = record ? projectStudies[record.projectId] : undefined;
  if (record)
    return (
      <>
        <nav className={styles.breadcrumb}>
          <a href={href('/winners/')}>{t(b('Winners', '成果档案'))}</a>
          <span>/ {record.projectName ?? record.teamName}</span>
        </nav>
        <div
          className={styles.projectUniversity}
          data-project-university={record.universityId}
        >
          <UniversityLogo university={getUniversity(record.universityId)} />
        </div>
        <div className={styles.kicker}>
          {record.year ??
            `${t(b('Published report', '报道发表于'))} ${record.reportedYear}`}{' '}
          / {getUniversity(record.universityId).shortName}
        </div>
        <h1>{t(projectTitle(record))}</h1>
        <p className={styles.lead}>{t(record.summary)}</p>
        {study && (
          <section
            className={styles.section}
            data-project-study={record.projectId}
          >
            <div className={editorial.twoColumns}>
              <article>
                <h2>{t(b('The problem', '问题与场景'))}</h2>
                <p>{t(study.problem)}</p>
              </article>
              <article>
                <h2>{t(b('Who it was for', '面向谁'))}</h2>
                <p>{t(study.users)}</p>
              </article>
            </div>
            <div className={editorial.section}>
              <h2>{t(b('The approach', '方案与原型'))}</h2>
              <p className={styles.lead}>{t(study.solution)}</p>
              <ul className={editorial.featureList}>
                {study.features.map((feature) => (
                  <li className={editorial.feature} key={feature.en}>
                    {t(feature)}
                  </li>
                ))}
              </ul>
              <details className={editorial.details}>
                <summary>
                  {t(
                    study.technicalInterpretation
                      ? b('Design interpretation', '方案解读')
                      : b('Technical approach', '技术方案'),
                  )}
                </summary>
                <ProjectTechnicalApproach study={study} />
              </details>
              <a
                className={styles.source}
                href={study.evidenceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(study.evidenceLabel)} ↗
              </a>
              <p className={styles.note}>
                {t(
                  study.illustrationStatus === 'not-established'
                    ? b(
                        'Historical prototype. An original product illustration and its reuse permission have not yet been established.',
                        '历史原型记录。原始产品配图及其复用授权尚未确认。',
                      )
                    : b(
                        'Historical prototype. The original illustration can be consulted at the publisher; project-image reuse permission is not established in this website’s media collection.',
                        '历史原型记录。原始作品配图可到发布方查阅；本站媒体库尚未确认该作品图片的复用授权。',
                      ),
                )}
              </p>
            </div>
            {study.contextImageId && (
              <>
                <EditorialMedia ids={[study.contextImageId]} single />
                <p className="sr-only">
                  {study.contextNote && t(study.contextNote)}
                </p>
              </>
            )}
          </section>
        )}
        {record.verificationNote && (
          <p className={styles.note}>{t(record.verificationNote)}</p>
        )}
        {record.year && (
          <ArchiveGallery
            year={record.year}
            projectId={record.projectId}
            coverOnly
          />
        )}
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
                  {universityName(getUniversity(record.universityId), language)}{' '}
                  ↗
                </a>
              </dd>
            </div>
            {record.teamName && (
              <div>
                <dt>{t(b('Team', '团队'))}</dt>
                <dd>
                  {record.teamName ??
                    t(b('Not named in the cited record', '引用记录未明确命名'))}
                </dd>
              </div>
            )}
            {record.projectName && (
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
            )}
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
                'Award wording follows the cited source. Project and product names appear only where the record establishes them; use the original reports for source context.',
                '奖项沿用引用来源的措辞。仅在档案明确时显示项目与产品专名，来源背景可查看原始报道。',
              ),
            )}
          </p>
        </section>
        {record.year && (
          <ArchiveGallery year={record.year} projectId={record.projectId} />
        )}
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
      (!filters.direction ||
        projectDirectionById[p.projectId] === filters.direction) &&
      [
        p.projectName,
        p.teamName,
        getUniversity(p.universityId).name,
        getUniversity(p.universityId).shortName,
        universityName(getUniversity(p.universityId), 'zh'),
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
      <section className={styles.section} id="award-rolls">
        <h2>
          {t(b('2018–2019 award-winning universities', '2018–2019获奖高校'))}
        </h2>
        <AwardBoardLink />
        <div className={historyStyles.earlyAwardRolls}>
          {editions
            .filter((edition) => edition.year === 2018 || edition.year === 2019)
            .map((edition) => (
              <article key={edition.year}>
                <div className={historyStyles.rosterTitle}>
                  <h3>
                    <a href={href(`/history/${edition.year}/#awards`)}>
                      {edition.year} ↗
                    </a>
                  </h3>
                  <p>
                    {
                      new Set(
                        edition.awardResults?.flatMap(
                          (award) => award.universityIds,
                        ),
                      ).size
                    }{' '}
                    {t(b('university teams', '所高校代表队'))}
                  </p>
                </div>
                <EditionAwardRoster
                  edition={edition}
                  compact
                  headingLevel={4}
                />
              </article>
            ))}
        </div>
      </section>
      <section className={styles.section} id="project-archive">
        <h2>{t(b('Project archive', '作品档案'))}</h2>
        <div className={styles.filters}>
          <label>
            {t(
              b(
                'Search projects, teams or universities',
                '搜索项目、团队或学校',
              ),
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
                    {language === 'zh'
                      ? universityName(u, language)
                      : u.shortName}
                  </option>
                ))}
            </select>
          </label>
          <label>
            {t(b('Direction', '方向'))}
            <select
              value={filters.direction}
              onChange={(e) => change({ direction: e.target.value })}
            >
              <option value="">{t(b('All directions', '全部方向'))}</option>
              {Object.entries(projectDirections).map(([id, label]) => (
                <option key={id} value={id}>
                  {t(label)}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              change({ year: '', university: '', direction: '' });
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
      </section>
    </>
  );
}
