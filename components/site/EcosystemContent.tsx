import { useState, type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useSiteLanguage } from '@/hooks/use-site-language';
import {
  bilingual as b,
  currentCompetition,
  historicalFormat,
  type Localized,
} from '@/content/competition';
import {
  ecosystemSources,
  organizations,
  partnerEditions,
  impactStories,
  sceneImageIds,
  featuredProjectIds,
  schoolRequests,
  historicalPeople,
  industryConnections,
  ficIndustry,
  type EcosystemSourceId,
} from '@/content/ecosystem';
import { projects } from '@/content/archive';
import { partnerBrandProfiles } from '@/content/partner-brands';
import { publicArchiveImages } from '@/content/archive-media';
import { WinnerCard } from './ArchivePages';
import EditorialMedia from './EditorialMedia';
import styles from './Editorial.module.css';
import site from './Site.module.css';

export function EvidenceLinks({ ids }: { ids: readonly EcosystemSourceId[] }) {
  const { t } = useSiteLanguage();
  return (
    <div className={styles.sourceLinks}>
      {ids.map((id) => (
        <a
          key={id}
          href={ecosystemSources[id].url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(ecosystemSources[id].title)} ↗
        </a>
      ))}
    </div>
  );
}
function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: Localized;
  title: Localized;
  children: ReactNode;
}) {
  const { t } = useSiteLanguage();
  return (
    <section id={id} className={styles.section} data-particle-reading-region>
      <p className={styles.eyebrow}>{t(eyebrow)}</p>
      <h2>{t(title)}</h2>
      {children}
    </section>
  );
}
export function HeroEssentials() {
  const { t, href } = useSiteLanguage();
  return (
    <div className={styles.essentials} data-home-essentials>
      <strong>
        {t(b('80 hours. Real fintech challenges.', '80小时，共创金融科技。'))}
      </strong>
      <p>
        {t(
          b(
            'Chengdu 80 Global FinTech Product Design & Development Competition',
            '“成都八零”全球金融科技产品设计与研发大赛',
          ),
        )}
      </p>
      <small>
        {t(b('Chengdu · ', '成都 · '))}
        {t(currentCompetition.dateLabel)}
      </small>
      <div className={styles.essentialLinks}>
        <a href={href('/competition/')}>
          {t(b('Competition guide', '赛事指南'))} ↗
        </a>
        <a href={href('/winners/')}>{t(b('Explore projects', '探索作品'))} ↗</a>
      </div>
    </div>
  );
}
function HostPair() {
  const { t } = useSiteLanguage();
  return (
    <div className={styles.partners}>
      {(['swufe', 'jiaozi'] as const).map((id) => (
        <div key={id} className={styles.partner}>
          <small>{t(b('JOINT HOST', '联合主办'))}</small>
          <strong>
            {t(
              id === 'jiaozi'
                ? organizations[id].name
                : organizations[id].short,
            )}
          </strong>
        </div>
      ))}
    </div>
  );
}
function HistoricalPeople() {
  const { t } = useSiteLanguage();
  return (
    <div className={styles.featureList}>
      {historicalPeople.map((person) => (
        <article className={styles.feature} key={person.id} id={person.id}>
          <span className={styles.date}>{person.year}</span>
          <h3>{t(person.name)}</h3>
          <p className={styles.role}>{t(person.role)}</p>
          <p>{t(person.story)}</p>
          <EvidenceLinks ids={[person.source]} />
        </article>
      ))}
    </div>
  );
}
function Format() {
  const { t, href } = useSiteLanguage();
  return (
    <>
      <ol className={site.process}>
        {historicalFormat.map((step, i) => (
          <li key={step.en}>
            <span>0{i + 1}</span>
            <strong>{t(step)}</strong>
          </li>
        ))}
      </ol>
      <p>
        {t(
          b(
            'The 80 hours are the concentrated development window, not the whole visit. This is the historical format; the 2026 rules will be published separately.',
            '80小时指集中开发窗口，不是整个活动或出行的总时长。这是历史赛制；2026规则将另行公布。',
          ),
        )}
      </p>
      <EvidenceLinks ids={['rules']} />
      <p>
        <a className={styles.link} href={href('/competition/')}>
          {t(b('Read the competition guide', '阅读赛事指南'))} →
        </a>
      </p>
    </>
  );
}
function Impact({ full = false }: { full?: boolean }) {
  const { t } = useSiteLanguage();
  return (
    <>
      <div className={styles.twoColumns}>
        {impactStories.map((story) => (
          <article key={story.id} id={story.id}>
            <span className={styles.date}>{story.year}</span>
            <h3>{t(story.title)}</h3>
            <p>{t(story.description)}</p>
            <EvidenceLinks ids={[story.source]} />
            {full && <p className={styles.date}>{t(story.locator)}</p>}
          </article>
        ))}
      </div>
      {full && <EditorialMedia ids={['cd80-2024-05']} single />}
    </>
  );
}
export function HomeBeforeNetwork() {
  const { t, href } = useSiteLanguage();
  return (
    <div className={styles.home}>
      <Section
        id="organizers"
        eyebrow={b('ACADEMIA × INDUSTRY', '学术 × 产业')}
        title={b('Rooted in Chengdu. Built together.', '立足成都，携手共创。')}
      >
        <HostPair />
        <p className={styles.introCopy}>
          {t(
            b(
              'SWUFE and Chengdu Jiaozi jointly hosted the sixth and seventh editions. Their collaboration brings an academic competition into dialogue with the financial industry. FIC has its own role in research and exchange.',
              '西南财经大学与成都交子金融控股集团联合主办第六届、第七届赛事，让学术竞赛与金融产业展开对话。FIC则以独立的研究与交流平台身份参与其中。',
            ),
          )}
        </p>
        <EvidenceLinks ids={['report2023', 'report2024', 'fic']} />
        <p>
          <a className={styles.link} href={href('/partners/')}>
            {t(b('Explore the collaboration', '了解历届合作'))} →
          </a>
        </p>
        <div className={styles.values}>
          {[
            [
              b('Real questions', '真实问题'),
              b(
                'From financial research discovery to intelligent-driving insurance: each edition starts with a concrete problem.',
                '从金融学术发现，到智能驾驶时代的汽车保险，每一届从具体问题出发。',
              ),
            ],
            [
              b('Working prototypes', '产品原型'),
              b(
                'Teams connect finance, technology and product design through a focused development challenge.',
                '团队在集中的开发挑战中，把金融、技术与产品设计转化为原型。',
              ),
            ],
            [
              b('Shared perspectives', '跨界交流'),
              b(
                'University teams meet researchers and industry representatives around what they have built.',
                '高校团队围绕亲手开发的作品，与研究者、产业代表交流。',
              ),
            ],
          ].map(([title, text]) => (
            <article key={title.en}>
              <h3>{t(title)}</h3>
              <p>{t(text)}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section
        id="inside-the-challenge"
        eyebrow={b('INSIDE THE CHALLENGE', '走进比赛现场')}
        title={b('People behind the prototypes.', '创意背后，是投入其中的人。')}
      >
        <p className={styles.introCopy}>
          {t(
            b(
              'A working session, a shared stage, university teams and the start of a new initiative. Photographs from the 2019 and 2024 editions.',
              '一起开发、同台交流、高校团队相聚，以及新合作的启动。回看2019与2024年的真实现场。',
            ),
          )}
        </p>
        <EditorialMedia ids={sceneImageIds} />
        <a className={styles.link} href={href('/media/')}>
          {t(b('Explore the photo archive', '浏览媒体与影像档案'))} →
        </a>
      </Section>
      <Section
        id="featured-projects"
        eyebrow={b('FEATURED PROJECTS', '精选作品')}
        title={b('What can an idea become?', '一个问题，可以变成怎样的产品？')}
      >
        <p className={styles.introCopy}>
          {t(
            b(
              'Research discovery, explainable investing and insurance in the age of intelligent driving. A selection of historical prototypes and team records—not a ranking.',
              '学术发现、可解释投资、智能驾驶时代的保险：精选历史原型与团队成果，不作为全赛事排名。',
            ),
          )}
        </p>
        <div className={site.archiveGrid}>
          {featuredProjectIds.map((id) => (
            <WinnerCard
              key={id}
              project={projects.find((p) => p.projectId === id)!}
            />
          ))}
        </div>
        <a className={styles.link} href={href('/winners/')}>
          {t(b('All projects & awards', '全部作品与奖项'))} →
        </a>
      </Section>
      <Section
        id="eighty-hour-challenge"
        eyebrow={b('THE 80-HOUR CHALLENGE', '80小时挑战')}
        title={b(
          'From a question to a demonstration.',
          '从赛题出发，以作品回答。',
        )}
      >
        <Format />
      </Section>
      <Section
        id="people"
        eyebrow={b('PEOPLE & TEAMS', '人物与团队')}
        title={b(
          'Different disciplines. One shared challenge.',
          '不同学科，共同面对一个挑战。',
        )}
      >
        <p className={styles.introCopy}>
          {t(
            b(
              'The 2019 archive records teams from Berkeley, Toronto, Hong Kong, Singapore and China. These photographs document participation, not assumed award identities.',
              '2019档案留下了伯克利、多伦多、香港、新加坡与中国内地高校团队的参赛记录。合影展示参赛者，不据此推断获奖身份。',
            ),
          )}
        </p>
        <div className={styles.twoColumns}>
          <EditorialMedia ids={['cd80-2019-05']} single />
          <div>
            <h3>
              {t(b('A meeting of academic communities', '跨越地域的学术社群'))}
            </h3>
            <p>
              {t(
                b(
                  'Competition records preserve not only product names, but the people who worked together. Explore the dated team photographs and their university records.',
                  '赛事档案不仅记录产品，也记录共同投入开发的团队。沿着有年份、有学校依据的合影，走进高校记录。',
                ),
              )}
            </p>
            <p>
              <a className={styles.link} href={href('/history/2019/')}>
                {t(b('Meet the 2019 teams', '回看2019参赛团队'))} →
              </a>
            </p>
            <p>
              <a className={styles.link} href={href('/about/#people')}>
                {t(b('People & organization', '人物与组织'))} →
              </a>
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
export function HomeAfterNetwork() {
  const { t, href } = useSiteLanguage();
  return (
    <div className={styles.home}>
      <Section
        id="beyond-80"
        eyebrow={b('BEYOND THE 80 HOURS', '80小时之后')}
        title={b('The conversation continues.', '比赛结束，交流仍在继续。')}
      >
        <Impact />
        <p>
          <a className={styles.link} href={href('/partners/')}>
            {t(b('Partners & impact', '合作与成果'))} →
          </a>
        </p>
      </Section>
      <Section
        id="news-next"
        eyebrow={b('NEWS & NEXT STEPS', '动态与参与')}
        title={b('Stay connected to Chengdu 80.', '与成都八零保持连接。')}
      >
        <div className={styles.featureList}>
          {(['report2024', 'report2023', 'report2020'] as const).map((id) => (
            <article className={styles.feature} key={id}>
              <time
                className={styles.date}
                dateTime={ecosystemSources[id].published}
              >
                {ecosystemSources[id].published}
              </time>
              <h3>{t(ecosystemSources[id].title)}</h3>
              <a
                href={ecosystemSources[id].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(b('Read original report', '阅读原始报道'))} ↗
              </a>
            </article>
          ))}
        </div>
        <div className={styles.notice}>
          <h3>{t(b('Looking ahead to 2026', '期待2026'))}</h3>
          <p>
            {t(currentCompetition.dateLabel)}{' '}
            {t(
              b(
                'Entry arrangements and the confirmed programme will be announced in the competition guide.',
                '参赛安排及正式日程将在赛事指南中公布。',
              ),
            )}
          </p>
        </div>
        <a className={styles.link} href={href('/competition/')}>
          {t(b('2026 competition guide', '2026赛事指南'))} →
        </a>
      </Section>
    </div>
  );
}
export function AboutPage() {
  const { t, href } = useSiteLanguage();
  return (
    <>
      <p className={site.kicker}>ABOUT / CHENGDU 80</p>
      <h1>
        {t(
          b('Finance meets the people who build.', '让金融问题，遇见创造者。'),
        )}
      </h1>
      <p className={site.lead}>
        {t(
          b(
            'Since 2018, Chengdu 80 has brought university teams into an 80-hour fintech product design and development challenge in Chengdu.',
            '自2018年起，成都八零让高校团队相聚成都，在80小时的集中开发中探索金融科技产品设计与研发。',
          ),
        )}
      </p>
      <EvidenceLinks ids={['about', 'rules']} />
      <Section
        id="mission"
        eyebrow={b('OUR PURPOSE', '赛事使命')}
        title={b(
          'Think across disciplines. Build something concrete.',
          '跨学科思考，做出具体的答案。',
        )}
      >
        <div className={styles.twoColumns}>
          <p>
            {t(
              b(
                'Financial questions become the starting point for research, coding and product decisions. The challenge is to turn an idea into a prototype that can be demonstrated and discussed.',
                '金融场景是起点，研究、代码与产品决策共同构成探索过程。团队需要把想法变成能够展示、能够讨论的原型。',
              ),
            )}
          </p>
          <p>
            {t(
              b(
                'The historical programme combines a development window with submission, demonstration and judging. The published archive traces changing themes from personal fundraising to risk modelling and automotive insurance.',
                '历史赛制将集中开发与原型提交、展示答辩、评审连接起来。历届主题从个人筹资延伸到风控建模与汽车保险。',
              ),
            )}
          </p>
        </div>
        <Format />
      </Section>
      <Section
        id="organization"
        eyebrow={b('ORGANIZATION', '组织与合作')}
        title={b(
          'An academic foundation. An industry connection.',
          '以学术为根，与产业相连。',
        )}
      >
        <HostPair />
        <p className={styles.introCopy}>
          {t(
            b(
              'Historical organization has evolved by edition. SWUFE and Chengdu Jiaozi were joint hosts in 2023 and 2024; the 2020 report also lists UC Berkeley CDAR as a joint host. These dated roles are not a 2026 organizer list.',
              '组织关系随届次发展。2023、2024年由西财与成都交子联合主办；2020报道还列明伯克利CDAR为联合主办方。这些带年份的角色不代表2026组织名单。',
            ),
          )}
        </p>
        <EvidenceLinks ids={['report2020', 'report2023', 'report2024']} />
        <p>
          <a className={styles.link} href={href('/partners/')}>
            {t(b('Explore roles by edition', '按年份了解组织角色'))} →
          </a>
        </p>
      </Section>
      <Section
        id="fic"
        eyebrow={b('FIC', '金融科技创新中心')}
        title={b(
          'Research and exchange, with a distinct identity.',
          '研究与交流，各有其位。',
        )}
      >
        <p className={styles.introCopy}>
          {t(
            b(
              'The historical FIC introduction describes a platform for academic and industry exchange. The 2020 event report names FIC and the Chengdu Fintech Association as delivery organizations. FIC, the Jiaozi Fintech Innovation Research Institute and Jiaozi Financial Dreamworks are distinct organizations.',
              '旧官网介绍了FIC的学术与产业交流背景。2020赛事报道列明FIC与成都市金融科技协会承办。FIC、交子金融科技创新研究院、交子金融梦工场是不同主体，不应合并为同一家机构。',
            ),
          )}
        </p>
        <EvidenceLinks ids={['fic', 'report2020']} />
        <p className={styles.introCopy}>
          {t(
            b(
              'The archived introduction dates the platform’s establishment to May 2019 and describes it as jointly built by SWUFE and the Chengdu Municipal Government. The forum and research network is broader than the competition roster.',
              '旧介绍明确平台于2019年5月成立，由西财与成都市政府共同打造。论坛与研究交流网络，比赛事参赛和合作名单的范围更广。',
            ),
          )}
        </p>
      </Section>
      <Section
        id="people"
        eyebrow={b('PEOPLE', '赛事人物')}
        title={b(
          'Organizers, judges and participating teams.',
          '组织者、评委与参赛团队。',
        )}
      >
        <HistoricalPeople />
        <div className={styles.twoColumns}>
          <article>
            <h3>{t(b('Historical committee', '历史组织委员会'))}</h3>
            <p>
              {t(
                b(
                  'The old committee page contains entries for Qing Li, Jingmei Zhao and Zhilong Xie. It is retained as a historical source, not a confirmed current committee or judges list.',
                  '旧官网委员会页面公开了Qing Li、Jingmei Zhao、Zhilong Xie的条目。这里保留历史来源入口，不将其作为已确认的当届委员会或评委名单。',
                ),
              )}
            </p>
            <EvidenceLinks ids={['committee']} />
          </article>
          <article>
            <h3>{t(b('Judging across the years', '历届评委'))}</h3>
            <p>
              {t(
                b(
                  'The fifth-anniversary publication records previous judges and their affiliations at the time. See PDF page 67 (printed page 60); current appointments and portrait reuse require separate confirmation.',
                  '五周年专刊记录历届评委及当时机构职务，见PDF第67页（书内第60页）。当届任命和肖像复用需另行确认。',
                ),
              )}
            </p>
            <EvidenceLinks ids={['anniversary']} />
          </article>
        </div>
        <EditorialMedia ids={['cd80-2019-01', 'cd80-2019-08']} />
        <a className={styles.link} href={href('/history/')}>
          {t(b('Explore the full timeline', '浏览完整赛事时间线'))} →
        </a>
      </Section>
    </>
  );
}
function InternationalPartners() {
  const { t } = useSiteLanguage();
  // Original, size-bounded local marks; this Vite preview has no Next image server.
  /* oxlint-disable next/no-img-element */
  return (
    <section
      className={styles.collaboration}
      id="international-partners"
      aria-labelledby="international-partners-title"
    >
      <div className={styles.collaborationHeading}>
        <p className={styles.eyebrow}>
          {t(b('Historical international co-hosts', '历届国际联合主办'))}
        </p>
        <h2 id="international-partners-title">
          {t(b('Connecting research and finance.', '联结全球研究与金融实践。'))}
        </h2>
        <p>
          {t(
            b(
              'In 2019, SWUFE, Chengdu Jiaozi, UC Berkeley CDAR and State Street Bank jointly hosted the second Chengdu 80 competition.',
              '2019年，西财、成都交子、伯克利CDAR与美国道富银行联合主办第二届成都八零，连接学术研究与金融实践。',
            ),
          )}
        </p>
      </div>
      <div className={styles.institutionGrid}>
        {partnerBrandProfiles.map((profile) => (
          <a
            key={profile.id}
            data-organization={profile.id}
            className={styles.institutionCard}
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(
              b(
                `${profile.title.en} — official website (opens in a new tab)`,
                `${profile.title.zh} · 官方网站（新标签页打开）`,
              ),
            )}
          >
            <span className={styles.institutionRole}>
              {t(organizations[profile.id].kind)}
            </span>
            <div className={styles.institutionLogo}>
              <img
                src={profile.logo.src}
                alt={t(
                  b(`${profile.title.en} logo`, `${profile.title.zh} 标志`),
                )}
                width={profile.logo.width}
                height={profile.logo.height}
                loading="lazy"
                decoding="async"
              />
            </div>
            <h3>{t(profile.title)}</h3>
            <p>{t(profile.descriptor)}</p>
            <span className={styles.institutionVisit}>
              {t(b('Visit official website', '访问官方网站'))}
              <ArrowUpRight aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
  /* oxlint-enable next/no-img-element */
}
export function PartnersPage() {
  const { t, href } = useSiteLanguage();
  return (
    <>
      <p className={site.kicker}>{t(b('PARTNERS & IMPACT', '合作与成果'))}</p>
      <h1>
        {t(
          b(
            'A Chengdu collaboration.\nA wider horizon.',
            '从成都携手，\n向更广阔处生长。',
          ),
        )}
      </h1>
      <p className={site.lead}>
        {t(
          b(
            'The collaboration between SWUFE and Chengdu Jiaozi is part of the competition’s history—not a footnote. Explore the organizations, their dated roles and the initiatives that followed.',
            '西财与成都交子的合作是赛事发展的一条主线。沿着年份，了解组织者各自的角色，以及由赛事延伸的合作倡议。',
          ),
        )}
      </p>
      <HostPair />
      <InternationalPartners />
      <Section
        id="roles"
        eyebrow={b('ORGANIZATION BY EDITION', '历届组织关系')}
        title={b(
          'The right role, in the right year.',
          '每一次合作，都有清楚的年份与身份。',
        )}
      >
        <div className={styles.timeline}>
          {partnerEditions.map((edition) => (
            <article key={edition.year}>
              <span className={styles.year}>{edition.year}</span>
              <div>
                <p className={styles.role}>{t(b('Joint hosts', '联合主办'))}</p>
                <h3>
                  {edition.hosts
                    .map((id) => t(organizations[id].name))
                    .join(' / ')}
                </h3>
                {edition.deliveredBy.length > 0 && (
                  <p>
                    {t(b('Delivery organizations', '承办'))}：
                    {edition.deliveredBy
                      .map((id) => t(organizations[id].name))
                      .join(' / ')}
                  </p>
                )}
                <p>{t(edition.note)}</p>
                {edition.coOrganizers && (
                  <p>
                    {t(b('Co-organizers', '协办'))}：
                    {edition.coOrganizers.map(t).join(' / ')}
                  </p>
                )}
                <EvidenceLinks ids={[edition.source]} />
              </div>
            </article>
          ))}
        </div>
        <div className={styles.notice}>
          <p>
            {t(
              b(
                'These are documented historical roles. A guest’s company affiliation is not treated as sponsorship, and the 2026 host, co-organizer and supporting-partner list is not yet confirmed.',
                '这里呈现有来源的历史角色。嘉宾的企业任职不自动等于企业赞助，2026主办、承办、协办与支持名单仍待确认。',
              ),
            )}
          </p>
        </div>
      </Section>
      <Section
        id="industry"
        eyebrow={b('ACADEMIA & INDUSTRY', '学术与产业联系')}
        title={b('More than a competition stage.', '不止于一场比赛。')}
      >
        <p className={styles.introCopy}>
          {t(
            b(
              'Chengdu Jiaozi Financial Holding Group connects the story to the city’s financial sector. UC Berkeley CDAR’s 2020 role belongs to a research center; it is distinct from Berkeley student teams in participation records. FIC and the Chengdu Fintech Association have their own delivery and exchange roles.',
              '成都交子金融控股集团让赛事与城市金融产业产生连接。伯克利CDAR在2020年的组织角色属于研究中心，与伯克利学生团队的参赛记录不同；FIC和成都市金融科技协会也分别具有承办与交流角色。',
            ),
          )}
        </p>
        <EvidenceLinks ids={['report2020', 'fic']} />
        <div className={styles.featureList}>
          {industryConnections.map((item) => (
            <article className={styles.feature} key={item.id}>
              <span className={styles.date}>{t(item.context)}</span>
              <h3>{t(item.name)}</h3>
              <p>{t(item.detail)}</p>
              <EvidenceLinks ids={[item.source]} />
            </article>
          ))}
        </div>
        <h3>{t(b('The wider FIC exchange network', 'FIC更广泛的交流网络'))}</h3>
        <p>
          {t(
            b(
              'The archived FIC introduction names the following institutions in its forum and academic–industry resource network. This is not a Chengdu 80 sponsor list or a confirmed 2026 partner list.',
              '旧FIC介绍在论坛与产学资源网络中提及以下机构。它们不被自动列为成都八零赞助商，也不是2026确认合作名单。',
            ),
          )}
        </p>
        <div className={site.pills}>
          {ficIndustry.map((name) => (
            <span key={name.en} className={site.primary}>
              {t(name)}
            </span>
          ))}
        </div>
        <EvidenceLinks ids={['fic']} />
      </Section>
      <Section
        id="impact"
        eyebrow={b('BEYOND THE 80 HOURS', '80小时之后')}
        title={b(
          'Milestones, with room for the next chapter.',
          '记录合作的起点，也期待下一章。',
        )}
      >
        <Impact full />
        <div className={styles.notice}>
          <p>
            {t(
              b(
                'Incubator operations, investment outcomes, placements and project follow-up have not been established in the current sources. We do not promise funding, jobs or incubation places.',
                '现有来源尚未明确孵化器后续运行、投资成果、就业与项目进展。本页不承诺投资、就业或孵化名额。',
              ),
            )}
          </p>
        </div>
        <a className={styles.link} href={href('/media/#requests')}>
          {t(
            b(
              'Information needed for the next edition',
              '当届与后续资料待补清单',
            ),
          )}{' '}
          →
        </a>
      </Section>
    </>
  );
}
export function MediaPage() {
  const { t } = useSiteLanguage();
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const images = publicArchiveImages.filter(
    (image) =>
      (!year || String(image.eventYear) === year) &&
      (!type ||
        (type === 'teams'
          ? image.imageType === 'team-photo'
          : image.imageType !== 'team-photo')),
  );
  const resources: {
    id: EcosystemSourceId;
    kind: Localized;
    note: Localized;
  }[] = [
    {
      id: 'anniversary',
      kind: b('PUBLICATION', '专刊'),
      note: b(
        'Five years of challenges, projects and people. View or download the original PDF on the official site; not a licensed redistribution package.',
        '五年赛题、作品与人物。前往旧官网浏览或下载原始PDF；本站不重新打包分发完整专刊。',
      ),
    },
    {
      id: 'rules',
      kind: b('RULES', '规则'),
      note: b(
        'Historical rules for reference, not the 2026 rulebook.',
        '历史规则参考，不作为2026规则。',
      ),
    },
    {
      id: 'report2024',
      kind: b('2024 NEWS', '2024新闻'),
      note: b(
        'The seventh edition, automotive insurance challenge and incubator launch. Published 2024-10-31.',
        '第七届、汽车保险赛题与孵化器启动。发布于2024-10-31。',
      ),
    },
    {
      id: 'report2023',
      kind: b('2023 NEWS', '2023新闻'),
      note: b(
        'The sixth edition and its academic–industry collaboration. Published 2023-11-06.',
        '第六届赛事及产学合作。发布于2023-11-06。',
      ),
    },
    {
      id: 'report2020',
      kind: b('2020 NEWS', '2020新闻'),
      note: b(
        'The third edition and its joint organizers. Published 2020-11-02.',
        '第三届及联合组织机构。发布于2020-11-02。',
      ),
    },
  ];
  return (
    <>
      <p className={site.kicker}>{t(b('MEDIA & RESOURCES', '媒体与资源'))}</p>
      <h1>
        {t(
          b(
            'The record, in words and images.',
            '用文字与影像，\n留住每一次相聚。',
          ),
        )}
      </h1>
      <p className={site.lead}>
        {t(
          b(
            'Explore past editions through photographs, news, challenge briefs and publications.',
            '通过照片、新闻、赛题与专刊，回看历届成都八零。',
          ),
        )}
      </p>
      <Section
        id="resources"
        eyebrow={b('READ & EXPLORE', '阅读与探索')}
        title={b('From the original sources.', '从原始记录出发。')}
      >
        <div className={styles.resourceList}>
          {resources.map((resource) => (
            <article key={resource.id}>
              <span className={styles.date}>{t(resource.kind)}</span>
              <div>
                <h3>{t(ecosystemSources[resource.id].title)}</h3>
                <p>{t(resource.note)}</p>
              </div>
              <a
                href={ecosystemSources[resource.id].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(b('Open source', '打开原始资源'))} ↗
              </a>
            </article>
          ))}
        </div>
      </Section>
      <Section
        id="photos"
        eyebrow={b('PHOTO LIBRARY', '影像库')}
        title={b('Real teams. Real moments.', '真实的团队，真实的瞬间。')}
      >
        <div className={site.filters}>
          <label>
            {t(b('Year', '年份'))}
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">{t(b('All years', '全部年份'))}</option>
              <option>2019</option>
              <option>2024</option>
            </select>
          </label>
          <label>
            {t(b('Image category', '照片类别'))}
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">{t(b('All categories', '全部类别'))}</option>
              <option value="teams">
                {t(b('University teams', '高校团队'))}
              </option>
              <option value="event">
                {t(b('Event & collaboration', '赛事与合作现场'))}
              </option>
            </select>
          </label>
          <button
            onClick={() => {
              setYear('');
              setType('');
            }}
          >
            {t(b('Clear filters', '清除筛选'))}
          </button>
        </div>
        <output>
          {images.length}{' '}
          {t(b('approved archive photographs', '张已获准公开的档案照片'))}
        </output>
        {images.length ? (
          <EditorialMedia ids={images.map((image) => image.id)} />
        ) : (
          <p>
            {t(b('No photographs match these filters.', '此筛选下暂无照片。'))}
          </p>
        )}
        <p>
          {t(
            b(
              'Permission for this website does not grant unrestricted third-party reuse. For other uses, consult the original publisher and relevant rights holders. No cleared video is available in this collection yet.',
              '本站获准展示不等于第三方可以任意转载。其他使用请联系原发布方及相关权利人。目前尚无已核验并获准使用的视频。',
            ),
          )}
        </p>
      </Section>
      <Section
        id="requests"
        eyebrow={b('FOR THE NEXT CHAPTER', '下一阶段资料')}
        title={b('What is still to be confirmed.', '需要学校补充的资料。')}
      >
        <p className={styles.introCopy}>
          {t(
            b(
              'The historical archive remains available while current information is being confirmed. The month of October 2026 was supplied by the project owner; the exact schedule and current contacts await official confirmation.',
              '历史档案继续开放，以下当届资料集中待补。2026年10月由项目负责人提供，准确日程与有效联系方式待正式确认。',
            ),
          )}
        </p>
        <div className={styles.featureList}>
          {schoolRequests.map((request) => (
            <article className={styles.feature} key={request.id}>
              <h3>{t(request.title)}</h3>
              <p>{t(request.text)}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
