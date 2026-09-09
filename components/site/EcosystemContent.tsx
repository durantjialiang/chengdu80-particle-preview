import { type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { useUrlFilters } from '@/hooks/use-url-filters';
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
  historicalPeople,
  industryConnections,
  ficIndustry,
  type EcosystemSourceId,
} from '@/content/ecosystem';
import { projects } from '@/content/archive';
import {
  hostBrandProfiles,
  partnerBrandProfiles,
} from '@/content/partner-brands';
import { publicArchiveImages } from '@/content/archive-media';
import { WinnerCard } from './ArchivePages';
import EditorialMedia from './EditorialMedia';
import CityCollaboration from './CityCollaboration';
import VideoChannel from './VideoChannel';
import { videoChannel } from '@/content/video-channel';
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
  eyebrow?: Localized;
  title: Localized;
  children: ReactNode;
}) {
  const { t } = useSiteLanguage();
  return (
    <section id={id} className={styles.section} data-particle-reading-region>
      {eyebrow && <p className={styles.eyebrow}>{t(eyebrow)}</p>}
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
function HostPair({ historical = false }: { historical?: boolean }) {
  const { t } = useSiteLanguage();
  /* oxlint-disable next/no-img-element -- Static original logos with reserved dimensions. */
  return (
    <div className={styles.partners}>
      {(['swufe', 'jiaozi'] as const).map((id) => (
        <a
          key={id}
          className={styles.partner}
          data-host={id}
          href={hostBrandProfiles[id].website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t(
            b(
              `${organizations[id].name.en} — official website (opens in a new tab)`,
              `${organizations[id].name.zh} · 官方网站（新标签页打开）`,
            ),
          )}
        >
          <small>
            {t(
              historical
                ? b('Joint hosts · 2023 / 2024', '联合主办 · 2023 / 2024')
                : b('JOINT HOST', '联合主办'),
            )}
          </small>
          <div
            className={styles.hostLogo}
            data-surface={hostBrandProfiles[id].logo.surface}
          >
            <img
              src={hostBrandProfiles[id].logo.src}
              alt={t(
                b(
                  `${organizations[id].name.en} logo`,
                  `${organizations[id].name.zh} 标志`,
                ),
              )}
              width={hostBrandProfiles[id].logo.width}
              height={hostBrandProfiles[id].logo.height}
              style={{
                maxWidth: `min(100%, ${hostBrandProfiles[id].logo.width}px)`,
              }}
              loading="lazy"
              decoding="async"
            />
          </div>
          <strong>
            {t(
              historical || id === 'jiaozi'
                ? organizations[id].name
                : organizations[id].short,
            )}
          </strong>
        </a>
      ))}
    </div>
  );
  /* oxlint-enable next/no-img-element */
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
            <a
              className={styles.link}
              href={ecosystemSources[story.source].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(story.cta)} ↗
            </a>
          </article>
        ))}
      </div>
      {full && (
        <EditorialMedia
          ids={['cd80-2024-owner-wul02419']}
          single
          caption={
            <>
              {t(
                b(
                  'Launch of the Chengdu 80 Incubator, 2024.',
                  '成都八零孵化器启动仪式，2024年。',
                ),
              )}{' '}
              <a
                href={ecosystemSources.report2024.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(b('SWUFE News', '西财新闻网'))} ↗
              </a>
            </>
          }
        />
      )}
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
            {t(b('Partnerships & initiatives', '合作与倡议'))} →
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
        <HostPair historical />
        <p className={styles.introCopy}>
          {t(
            b(
              'SWUFE and Chengdu Jiaozi jointly hosted the competition in 2023 and 2024. UC Berkeley CDAR was also a co-host of the 2020 edition.',
              '西财与成都交子联合主办2023、2024年赛事。伯克利CDAR也是2020年赛事的联合主办方。',
            ),
          )}
        </p>
        <EvidenceLinks ids={['report2020', 'report2023', 'report2024']} />
        <p>
          <a className={styles.link} href={href('/partners/')}>
            {t(b('Explore the partnerships', '了解赛事合作'))} →
          </a>
        </p>
      </Section>
      <Section
        id="fic"
        eyebrow={b('FIC', '金融科技创新中心')}
        title={b('Fintech Innovation Center', '金融科技创新中心')}
      >
        <p className={styles.introCopy}>
          {t(
            b(
              'Established in May 2019 by SWUFE and the Chengdu Municipal Government, FIC connects academic research and industry through forums and exchange. FIC and the Chengdu Fintech Association delivered the third Chengdu 80 in 2020.',
              'FIC于2019年5月由西财与成都市政府共同打造，通过论坛与交流连接学术研究和产业。2020年，FIC与成都市金融科技协会共同承办第三届成都八零。',
            ),
          )}
        </p>
        <EvidenceLinks ids={['fic', 'report2020']} />
        <FicExchangeNetwork />
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
                  'Explore the committee from past editions, including Qing Li, Jingmei Zhao and Zhilong Xie.',
                  '了解历届组织委员会成员，包括Qing Li、Jingmei Zhao与Zhilong Xie。',
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
                  'Meet the judges from past editions and learn about their professional backgrounds in the fifth-anniversary publication.',
                  '在五周年专刊中了解历届评委及其当时的专业背景。',
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
          </a>
        ))}
      </div>
    </section>
  );
  /* oxlint-enable next/no-img-element */
}
export function FicExchangeNetwork() {
  const { t } = useSiteLanguage();
  return (
    <div id="fic-network" className={styles.exchangeNetwork}>
      <h3>{t(b('The wider FIC exchange network', 'FIC更广泛的交流网络'))}</h3>
      <div className={styles.exchangeGrid}>
        {ficIndustry.map((company) => (
          <a
            key={company.id}
            className={styles.exchangeCard}
            data-fic-company={company.id}
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t(company.name)} · ${t(b('Official website (opens in a new tab)', '官网（新标签页打开）'))}`}
          >
            <span className={styles.exchangeLogo}>
              {/* Static Vite export: preserve original local marks without an image-proxy route. */}
              {/* oxlint-disable-next-line next/no-img-element */}
              <img
                src={company.logo.src}
                alt=""
                width={company.logo.width}
                height={company.logo.height}
                style={{ maxWidth: company.logo.width }}
                loading="lazy"
                decoding="async"
              />
            </span>
            <h4 className={styles.exchangeName}>
              {t(company.name)}
              <ArrowUpRight aria-hidden="true" />
            </h4>
          </a>
        ))}
      </div>
      <EvidenceLinks ids={['fic']} />
    </div>
  );
}
export function PartnersPage() {
  const { t, href } = useSiteLanguage();
  return (
    <>
      <p className={site.kicker}>{t(b('PARTNERSHIPS', '合作与倡议'))}</p>
      <h1>
        {t(b('The partnerships behind Chengdu 80', '成都八零背后的合作力量'))}
      </h1>
      <p className={site.lead}>
        {t(
          b(
            'Chengdu 80 brings university teams together with researchers and financial-sector professionals to address practical fintech challenges. Southwestern University of Finance and Economics and Chengdu Jiaozi Financial Holding Group have jointly hosted multiple editions of the competition.',
            '成都八零汇聚高校团队、研究者与金融行业专业人士，共同探索真实的金融科技问题。西南财经大学与成都交子金融控股集团已联合主办多届赛事。',
          ),
        )}
      </p>
      <HostPair historical />
      <InternationalPartners />
      <CityCollaboration />
      <Section id="roles" title={b('Partnership milestones', '合作里程碑')}>
        <div className={styles.timeline}>
          {partnerEditions.map((edition) => {
            const initiative = impactStories.find(
              (story) => Number(story.year) === edition.year,
            );
            return (
              <article key={edition.year}>
                <span className={styles.year}>{edition.year}</span>
                <div>
                  <h3>{t(edition.milestone.title)}</h3>
                  {initiative ? (
                    <a className={styles.link} href={'#' + initiative.id}>
                      {t(b('Explore the initiative', '了解这项倡议'))} ↓
                    </a>
                  ) : (
                    <>
                      <p>{t(edition.milestone.summary)}</p>
                      <details className={styles.roleDetails}>
                        <summary>
                          {t(b('Organizers for this edition', '本届组织机构'))}
                        </summary>
                        <p className={styles.milestoneOrganizations}>
                          {t(b('Joint hosts', '联合主办'))}：
                          {edition.hosts
                            .map((id) => t(organizations[id].name))
                            .join(' / ')}
                        </p>
                        {edition.deliveredBy.length > 0 && (
                          <p className={styles.milestoneOrganizations}>
                            {t(b('Delivery organizations', '承办'))}：
                            {edition.deliveredBy
                              .map((id) => t(organizations[id].name))
                              .join(' / ')}
                          </p>
                        )}
                        {edition.coOrganizers && (
                          <p className={styles.milestoneOrganizations}>
                            {t(b('Co-organizers', '协办'))}：
                            {edition.coOrganizers.map(t).join(' / ')}
                          </p>
                        )}
                      </details>
                      <a
                        className={styles.link}
                        href={ecosystemSources[edition.source].url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t(b('Read the event report', '阅读赛事报道'))} ↗
                      </a>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Section>
      <Section id="industry" title={b('Industry participation', '产业参与')}>
        <p className={styles.introCopy}>
          {t(
            b(
              'At the 2024 awards ceremony, representatives from Hundsun and Swiss Re presented awards to competing teams.',
              '在2024年颁奖典礼上，恒生电子与瑞士再保险的代表为参赛团队颁奖。',
            ),
          )}
        </p>
        <h3>
          {t(
            b('Industry leaders at the 2024 awards', '2024颁奖现场的产业嘉宾'),
          )}
        </h3>
        <div className={styles.twoColumns}>
          {industryConnections.flatMap((item) =>
            item.person && item.role
              ? [
                  <article className={styles.feature} key={item.id}>
                    <h3>{t(item.person)}</h3>
                    <p>{t(item.role)}</p>
                  </article>,
                ]
              : [],
          )}
        </div>
        <a
          className={styles.link}
          href={ecosystemSources.report2024.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(b('Read the 2024 event report', '阅读2024赛事报道'))} ↗
        </a>
      </Section>
      <Section id="impact" title={b('Beyond the 80 Hours', '80小时之后')}>
        <p className={styles.introCopy}>
          {t(
            b(
              'FINTECH80x and the Chengdu 80 Incubator mark two steps in extending collaboration beyond the competition.',
              'FINTECH80x计划与成都八零孵化器，见证了合作从赛事向更广泛活动与项目孵化的延伸。',
            ),
          )}
        </p>
        <Impact full />
      </Section>
      <Section id="explore-work" title={b('Explore the work', '探索历届作品')}>
        <p className={styles.introCopy}>
          {t(
            b(
              'Discover the projects and university teams from past editions of Chengdu 80.',
              '了解历届成都八零的参赛作品与高校团队。',
            ),
          )}
        </p>
        <div className={site.pills}>
          <a className={site.primary} href={href('/winners/')}>
            {t(b('Explore past projects', '探索历届作品'))} →
          </a>
          <a className={styles.link} href={href('/history/')}>
            {t(b('Browse past editions', '浏览历届赛事'))} →
          </a>
        </div>
        <p className={styles.editionStatus}>
          {t(
            b(
              'Details of the 2026 edition will be published on the Competition page.',
              '2026届赛事详情将在参赛信息页公布。',
            ),
          )}{' '}
          <a className={styles.link} href={href('/competition/')}>
            {t(b('Competition guide', '参赛信息'))} →
          </a>
        </p>
      </Section>
    </>
  );
}
const mediaFilterKeys = ['year', 'type'] as const;
export function MediaPage() {
  const { t, href } = useSiteLanguage();
  const { filters, change } = useUrlFilters(mediaFilterKeys);
  const { year, type } = filters;
  const photoYears = [...new Set(publicArchiveImages.map((image) => image.eventYear))]
    .sort((a, b) => b - a);
  const images = publicArchiveImages
    .filter(
      (image) =>
        (!year || String(image.eventYear) === year) &&
        (!type ||
          (type === 'teams'
            ? image.imageType === 'team-photo'
            : type === 'speeches'
              ? image.imageType === 'speech'
              : type === 'exchange'
                ? image.imageType === 'work-session'
                : type === 'awards'
                  ? image.imageType === 'award-ceremony'
                  : ['event-group', 'event-recap', 'event-poster'].includes(image.imageType))),
    )
    .sort((a, b) => b.eventYear - a.eventYear);
  const resources: {
    id: EcosystemSourceId;
    kind: Localized;
    title: Localized;
    note: Localized;
    publisher: Localized;
    cta: Localized;
  }[] = [
    {
      id: 'anniversary',
      kind: b('PUBLICATION', '专刊'),
      title: b('Chengdu 80: the first five years', '成都八零五周年专刊'),
      note: b(
        'Challenges, projects and people from the first five editions of Chengdu 80.',
        '回顾前五届成都八零的赛题、作品与人物。',
      ),
      publisher: b('Chengdu 80 · SWUFE', '成都八零 · 西南财经大学'),
      cta: b('View the publication (PDF)', '阅读专刊（PDF）'),
    },
    {
      id: 'rules',
      kind: b('HISTORICAL RULES', '历届规则'),
      title: b('Competition rules', '赛事规则'),
      note: b(
        'Historical rules for reference, not the 2026 rulebook.',
        '历史规则参考，不作为2026规则。',
      ),
      publisher: b('Chengdu 80 · SWUFE', '成都八零 · 西南财经大学'),
      cta: b('View historical rules', '查看历届规则'),
    },
    {
      id: 'report2024',
      kind: b('2024 NEWS', '2024新闻'),
      title: b('The seventh Chengdu 80', '第七届成都八零'),
      note: b(
        'The automotive insurance challenge, university teams and the incubator launch.',
        '汽车保险赛题、高校团队与孵化器启动。',
      ),
      publisher: b(
        'SWUFE News · 31 October 2024',
        '西财新闻网 · 2024年10月31日',
      ),
      cta: b('Read the article', '阅读报道'),
    },
    {
      id: 'report2023',
      kind: b('2023 NEWS', '2023新闻'),
      title: b('The sixth Chengdu 80', '第六届成都八零'),
      note: b(
        'The financial news challenge and academic–industry participation.',
        '金融新闻赛题与学界、产业界的赛事参与。',
      ),
      publisher: b(
        'SWUFE School of Finance · 6 November 2023',
        '西财金融学院 · 2023年11月6日',
      ),
      cta: b('Read the article', '阅读报道'),
    },
    {
      id: 'report2020',
      kind: b('2020 NEWS', '2020新闻'),
      title: b('The third Chengdu 80', '第三届成都八零'),
      note: b(
        'The third edition and its joint organizers.',
        '第三届赛事及联合组织机构。',
      ),
      publisher: b(
        'SWUFE School of Finance · 2 November 2020',
        '西财金融学院 · 2020年11月2日',
      ),
      cta: b('Read the article', '阅读报道'),
    },
  ];
  return (
    <>
      <p className={site.kicker}>{t(b('MEDIA & RESOURCES', '媒体与资源'))}</p>
      <h1>
        {t(b('Chengdu 80 in words and photographs', '文字与影像中的成都八零'))}
      </h1>
      <p className={site.lead}>
        {t(
          b(
            'Explore Chengdu 80 through photographs, event news and publications.',
            '通过赛事照片、新闻与专刊，回顾成都八零。',
          ),
        )}
      </p>
      <nav
        className={site.pills}
        aria-label={t(b('Media sections', '媒体栏目'))}
      >
        <a href="#photos">{t(b('Photo archive', '照片档案'))}</a>
        {videoChannel.youtubeUrl && <a href="#videos">YouTube</a>}
        <a href="#resources">{t(b('News & publications', '新闻与专刊'))}</a>
      </nav>
      <Section id="photos" title={b('Photo archive', '照片档案')}>
        <nav className={site.pills} aria-label={t(b('Edition albums', '年度相册'))}>
          <a href={href('/history/2024/#edition-2024')}>
            {t(b('2024 edition album', '2024赛事相册'))} →
          </a>
          <a href={href('/history/2023/#edition-2023')}>
            {t(b('2023 edition album', '2023赛事相册'))} →
          </a>
          <a href={href('/history/2022/#edition-2022')}>
            {t(b('2022 edition album', '2022赛事相册'))} →
          </a>
        </nav>
        <div className={site.filters}>
          <label>
            {t(b('Year', '年份'))}
            <select
              value={year}
              onChange={(e) => change({ year: e.target.value })}
            >
              <option value="">{t(b('All years', '全部年份'))}</option>
              {photoYears.map((photoYear) => (
                <option key={photoYear} value={photoYear}>{photoYear}</option>
              ))}
            </select>
          </label>
          <label>
            {t(b('Image category', '照片类别'))}
            <select
              value={type}
              onChange={(e) => change({ type: e.target.value })}
            >
              <option value="">{t(b('All categories', '全部类别'))}</option>
              <option value="teams">
                {t(b('Team photographs', '团队合影'))}
              </option>
              <option value="speeches">
                {t(b('Talks & remarks', '主题分享与致辞'))}
              </option>
              <option value="exchange">
                {t(b('Team conversations', '团队交流'))}
              </option>
              <option value="awards">
                {t(b('Awards presentations', '颁奖现场'))}
              </option>
              <option value="event">
                {t(b('Venue & group photographs', '会场与大合影'))}
              </option>
            </select>
          </label>
          <button
            onClick={() => {
              change({ year: '', type: '' });
            }}
          >
            {t(b('Clear filters', '清除筛选'))}
          </button>
        </div>
        <output aria-live="polite">
          {images.length} {t(b('photographs', '张照片'))}
        </output>
        {images.length ? (
          <EditorialMedia ids={images.map((image) => image.id)} />
        ) : (
          <p>
            {t(b('No photographs match these filters.', '此筛选下暂无照片。'))}
          </p>
        )}
      </Section>
      <VideoChannel />
      <Section id="resources" title={b('News & publications', '新闻与出版物')}>
        <div className={styles.resourceList}>
          {resources.map((resource) => (
            <article key={resource.id}>
              <span className={styles.date}>{t(resource.kind)}</span>
              <div>
                <h3>{t(resource.title)}</h3>
                <p>{t(resource.note)}</p>
                <p className={styles.resourcePublisher}>
                  {t(resource.publisher)}
                </p>
              </div>
              <a
                href={ecosystemSources[resource.id].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(resource.cta)} ↗
              </a>
            </article>
          ))}
        </div>
      </Section>
      <Section id="usage" title={b('Media use', '素材使用说明')}>
        <p className={styles.introCopy}>
          {t(
            b(
              'Photographs are displayed here with permission. For republication or other uses, contact the original publisher and relevant rights holders. Publication links open the original files on their publishers’ websites.',
              '本站照片已获准展示。如需转载或用于其他用途，请联系原发布方及相关权利人。专刊链接打开原发布方网站上的文件。',
            ),
          )}
        </p>
      </Section>
    </>
  );
}
