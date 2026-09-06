import { useEffect, useState } from 'react';
import {
  currentCompetition,
  faqs,
  faqCategories,
  historicalFormat,
  approvedDownloads,
  bilingual as b,
} from '@/content/competition';
import { useSiteLanguage } from '@/hooks/use-site-language';
import styles from './Site.module.css';

export default function CompetitionPage() {
  const { t, href } = useSiteLanguage();
  const [open, setOpen] = useState<string[]>([]);
  useEffect(() => {
    const reveal = () => {
      const id = location.hash.slice(1);
      if (faqs.some((f) => f.id === id)) {
        setOpen((current) =>
          current.includes(id) ? current : [...current, id],
        );
        requestAnimationFrame(() =>
          document.getElementById(id)?.scrollIntoView(),
        );
      }
    };
    reveal();
    window.addEventListener('hashchange', reveal);
    return () => window.removeEventListener('hashchange', reveal);
  }, []);
  return (
    <>
      <div className={styles.kicker}>
        CHENGDU 80 / {t(b('COMPETITION', '参赛信息'))}
      </div>
      <section className={styles.leadGrid}>
        <div>
          <h1>
            {t(b('Build what\ncomes next.', '从问题出发，\n创造下一步。'))}
          </h1>
          <p className={styles.lead}>
            {t(
              b(
                'Chengdu 80 Global FinTech Product Design & Development Competition',
                '“成都八零”全球金融科技产品设计与研发大赛',
              ),
            )}
          </p>
          <a className={styles.primary} href="#join">
            {t(b('Read the participation guide', '查看参赛指南'))}
            <span aria-hidden="true">↓</span>
          </a>
        </div>
        <aside className={styles.dateCard}>
          <span>{t(b('UPCOMING / 2026', '即将到来 / 2026'))}</span>
          <strong>{t(b('October', '10月'))}</strong>
          <p>{t(currentCompetition.dateLabel)}</p>
          <small>
            {t(
              b(
                'Month supplied by the project owner. Official schedule to follow.',
                '月份由项目负责人提供，正式日程待公布。',
              ),
            )}
          </small>
        </aside>
      </section>
      <section className={styles.section} id="join">
        <div className={styles.sectionHeading}>
          <span>01 / {t(b('2026 GUIDE', '本届指南'))}</span>
          <h2>{t(b('Know what is confirmed.', '已确定与待公布的信息。'))}</h2>
        </div>
        <div className={styles.twoColumns}>
          <p>
            {t(currentCompetition.registrationLabel)}{' '}
            {t(
              b(
                'This page will carry confirmed updates. There is no active application form or deadline at present.',
                '本页将更新已确认的安排。目前没有正式报名表或截止时间。',
              ),
            )}
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>{t(b('Month', '月份'))}</dt>
              <dd>{t(currentCompetition.dateLabel)}</dd>
            </div>
            {[
              b('Edition & exact dates', '届次与具体日期'),
              b('Eligibility & application', '资格与报名方式'),
              b('Challenge & prizes', '赛题与奖项'),
              b('Venue & fees', '场地与费用'),
            ].map((label) => (
              <div key={label.en}>
                <dt>{t(label)}</dt>
                <dd>{t(b('To be announced', '待公布'))}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className={styles.section} id="format">
        <div className={styles.sectionHeading}>
          <span>02 / {t(b('HISTORICAL FORMAT', '历史赛制'))}</span>
          <h2>{t(b('From challenge to prototype.', '从赛题到原型。'))}</h2>
        </div>
        <p className={styles.measure}>
          {t(
            b(
              'A typical historical sequence, not the final 2026 rules. The 80 hours refer to focused development, not the entire event or travel.',
              '以下为历史赛制的典型流程，不是2026正式规则。80小时指集中开发时段，不是整个活动或出行的总时长。',
            ),
          )}
        </p>
        <ol className={styles.process}>
          {historicalFormat.map((s, i) => (
            <li key={s.en}>
              <span>0{i + 1}</span>
              <strong>{t(s)}</strong>
            </li>
          ))}
        </ol>
        <a
          className={styles.source}
          href="https://www.comp.nus.edu.sg/news/2020-chengdu80-win/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(
            b(
              'Historical source: NUS Computing (2020)',
              '历史来源：新加坡国立大学计算机学院（2020）',
            ),
          )}{' '}
          ↗
        </a>
      </section>
      <section className={styles.section} id="faq">
        <div className={styles.sectionHeading}>
          <span>03 / FAQ</span>
          <h2>{t(b('Your next questions.', '你可能还想了解。'))}</h2>
        </div>
        <div className={styles.faqLayout}>
          <nav aria-label={t(b('FAQ categories', '问题分类'))}>
            {faqCategories.map((c) => (
              <a href={`#faq-${c.id}`} key={c.id}>
                {t(c.title)} ↗
              </a>
            ))}
          </nav>
          <div>
            {faqCategories.map((c) => (
              <section
                className={styles.faqGroup}
                key={c.id}
                id={`faq-${c.id}`}
              >
                <h3>{t(c.title)}</h3>
                {faqs
                  .filter((f) => f.category === c.id)
                  .map((f) => (
                    <details
                      key={f.id}
                      id={f.id}
                      open={open.includes(f.id)}
                      onToggle={(e) => {
                        const isOpen = e.currentTarget.open;
                        setOpen((state) =>
                          isOpen
                            ? state.includes(f.id)
                              ? state
                              : [...state, f.id]
                            : state.filter((id) => id !== f.id),
                        );
                      }}
                    >
                      <summary>
                        {t(f.question)}
                        <span aria-hidden="true">+</span>
                      </summary>
                      <p>
                        {t(f.answer)}
                        {'note' in f && f.note ? ' ' + t(f.note) : ''}
                      </p>
                      <a
                        className={styles.source}
                        href={href(`/competition/#${f.id}`)}
                      >
                        {t(b('Link to this question', '此问题的链接'))} ↗
                      </a>
                    </details>
                  ))}
              </section>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.section} id="resources">
        <div className={styles.sectionHeading}>
          <span>04 / {t(b('RESOURCES & CONTACT', '资料与联系'))}</span>
          <h2>
            {t(b('Official information, when ready.', '以正式发布为准。'))}
          </h2>
        </div>
        <div className={styles.twoColumns}>
          <div>
            <h3>{t(b('2026 rules & downloads', '2026规则与下载'))}</h3>
            {approvedDownloads.length ? (
              approvedDownloads.map((d) => (
                <p key={d.url}>
                  <a href={d.url} download>
                    {t(d.title)}
                  </a>{' '}
                  · {d.language} / {d.version} / {d.date} / {d.year}
                </p>
              ))
            ) : (
              <p>
                {t(
                  b(
                    'No approved 2026 document is available yet. Historical rules must not be treated as current requirements.',
                    '暂无获准公开的2026文件。往届规则不应被视为本届要求。',
                  ),
                )}
              </p>
            )}
          </div>
          <div>
            <h3>{t(b('Contact', '联系方式'))}</h3>
            <p>
              {t(
                b(
                  'The current consultation channel is awaiting confirmation. We do not collect email addresses or application details on this preview.',
                  '本届咨询渠道待确认。本预览不收集邮箱或报名信息。',
                ),
              )}
            </p>
          </div>
        </div>
        <p className={styles.note}>
          {t(
            b(
              'Information provenance: the 2026 month and the absence of an edition in 2025 were supplied by the project owner; they are not presented as a public organizer announcement. Historical facts link to their original sources.',
              '信息来源：2026月份与2025未举办由项目负责人提供，不作为组委会公开公告表述。历史内容附原始来源链接。',
            ),
          )}
        </p>
      </section>
    </>
  );
}
