'use client';
import { useEffect, useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { type University } from '@/content/network';
import {
  universityName,
  universityLocation,
  universityRole,
  recordNote,
} from '@/content/university-i18n';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { bilingual as b } from '@/content/competition';
import { projects, projectTitle } from '@/content/archive';
import { Button } from '@/components/ui/button';
import { UniversityLogo } from './UniversityCard';
import styles from './Network.module.css';

/** Native dialog provides modal focus containment, Escape and focus restoration. */
export default function UniversityDetailPanel({
  university,
  onClose,
}: {
  university: University;
  onClose: () => void;
}) {
  const { t, href, language } = useSiteLanguage();
  const panel = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = panel.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  return (
    <dialog
      ref={panel}
      className={styles.detailPanel}
      aria-labelledby="university-detail-title"
      onClose={() => {
        if (!panel.current?.open) onClose();
      }}
    >
      <div className={styles.detailInner}>
        <div className={styles.detailTop}>
          <span>{t(b('UNIVERSITY RECORD', '高校档案'))}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => panel.current?.close()}
            aria-label={t(b('Close university details', '关闭高校详情'))}
          >
            <X size={20} />
          </Button>
        </div>
        <UniversityLogo university={university} />
        <p
          className={styles.relationship}
          data-role={university.relationshipType}
        >
          {university.verification === 'pending'
            ? t(b('Record under review', '资料待核'))
            : universityRole(university.relationshipType, language)}
        </p>
        <h2 id="university-detail-title">
          {universityName(university, language)}
        </h2>
        <p className={styles.location}>
          {universityLocation(university, language)}
        </p>
        <p className={styles.recordNote}>
          {t(
            b(
              'Historical records, not a confirmed 2026 roster. Missing entries do not imply no participation or awards.',
              '历史记录，不是2026确认名单。资料空缺不代表未参赛或未获奖。',
            ),
          )}
        </p>
        {university.relationshipType === 'ecosystem' && (
          <p className={styles.recordNote}>
            {t(
              b(
                'Competition participation is not confirmed.',
                '赛事参与尚未确认。',
              ),
            )}
          </p>
        )}
        <section>
          <h3>{t(b('Participation years', '参赛年份'))}</h3>
          <div className={styles.yearPills}>
            {university.participationYears.length ? (
              university.participationYears.map((year) => (
                <a key={year} href={href(`/history/${year}/`)}>
                  {year} ↗
                </a>
              ))
            ) : (
              <p>
                {university.verification === 'pending'
                  ? t(b('Not yet verified.', '尚未核实。'))
                  : t(
                      b(
                        'Specific years are not given in the cited record.',
                        '引用记录未给出具体年份。',
                      ),
                    )}
              </p>
            )}
          </div>
        </section>
        <section>
          <h3>{t(b('Awards', '获奖记录'))}</h3>
          {university.awards.length ? (
            <ul>
              {university.awards.map((award, index) => (
                <li key={`${award.year}-${index}`}>
                  <span>
                    {award.year ??
                      `${award.reportedYear} ${t(b('report', '报道'))}`}
                  </span>
                  <a
                    href={award.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {award.name}
                    <ArrowUpRight size={13} />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              {t(
                b(
                  'No individual award is verified in this record.',
                  '当前档案未核实具体奖项。',
                ),
              )}
            </p>
          )}
        </section>
        <section>
          <h3>{t(b('Related projects & teams', '项目与团队'))}</h3>
          {university.projects.length ? (
            <ul>
              {university.projects.map((project, index) => {
                const archived = projects.find(
                  (p) =>
                    p.projectId === project.projectId &&
                    p.universityId === university.id,
                );
                return (
                  <li key={`${project.year}-${index}`}>
                    <span>
                      {project.year ??
                        `${project.reportedYear} ${t(b('report', '报道'))}`}
                    </span>
                    <div className={styles.projectLinks}>
                      {archived ? (
                        <a href={href(`/winners/${archived.projectId}/`)}>
                          {t(projectTitle(archived))} →
                        </a>
                      ) : (
                        <span>{project.name}</span>
                      )}
                      {archived && !archived.projectName && (
                        <small>
                          {t(
                            b(
                              'Product name not established',
                              '产品专名尚未明确',
                            ),
                          )}
                        </small>
                      )}
                      <a
                        className={styles.originalSource}
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t(b('Original report', '原始报道'))}{' '}
                        <ArrowUpRight size={13} />
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>
              {t(
                b(
                  'No named project is verified in this record.',
                  '当前档案未核实具名项目。',
                ),
              )}
            </p>
          )}
        </section>
        <details className={styles.sources}>
          <summary>{t(b('Sources & record notes', '资料来源与说明'))}</summary>
          <p>{recordNote(university, language)}</p>
          <p>
            {t(
              b(
                'Award wording is retained from each source. Conflicting English labels are not converted into assumed rankings. Campus pins are approximate.',
                '奖项保留各来源措辞，不把冲突的英文译名换算成推定名次。地图为近似校区位置。',
              ),
            )}
          </p>
          {university.evidence.length ? (
            university.evidence.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title={item.title}
              >
                {language === 'zh' ? `来源记录 · ${item.title}` : item.title}
                <ArrowUpRight size={14} />
              </a>
            ))
          ) : (
            <p>
              {t(
                b(
                  'Awaiting organizer-verified participation evidence.',
                  '等待主办方确认参赛依据。',
                ),
              )}
            </p>
          )}
        </details>
        <a
          className={styles.officialButton}
          href={university.website}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(b('Official university website', '访问高校官网'))}{' '}
          <ArrowUpRight size={17} />
        </a>
        <p className={styles.detailFootnote}>
          {t(
            b(
              'Opens in a new tab. Historical records do not confirm participation in 2026.',
              '在新标签页打开。历史记录不代表确认参加2026赛事。',
            ),
          )}
        </p>
      </div>
    </dialog>
  );
}
