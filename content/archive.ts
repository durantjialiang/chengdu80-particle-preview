import {
  bilingual as b,
  currentCompetition,
  year2025,
  type Localized,
} from './competition';
import {
  universities,
  universitySources,
  type UniversityId,
} from './universities';
import {
  confirmed2019Awards,
  edition2019Source,
  recap2019Source,
  confirmed2024Awards,
  confirmed2022Awards,
  confirmed2023Awards,
  edition2024Source,
  anniversarySource,
  bookletAwardsByYear,
} from './history-evidence';
export const sources = {
  booklet: anniversarySource,
  event2019: edition2019Source,
  recap2019: recap2019Source,
  event2024: edition2024Source,
  history: {
    title: b(
      'SWUFE · historical review in the 2023 preview',
      '西南财经大学 · 2023预告中的历史回顾',
    ),
    url: universitySources.history,
  },
  nus2020: {
    title: b(
      'NUS Computing · 2020 competition report',
      '新加坡国立大学计算机学院 · 2020赛事报道',
    ),
    url: universitySources.nus2020,
  },
  event2022: {
    title: b('Chengdu 80 · fifth-edition recap', '成都八零官网 · 第五届回顾'),
    url: universitySources.edition2022,
  },
  event2023: {
    title: b('Chengdu 80 · sixth-edition recap', '成都八零官网 · 第六届回顾'),
    url: universitySources.edition2023,
  },
  hku2023: {
    title: b(
      'HKU · Apollo team report (2023)',
      '香港大学 · Apollo团队报道（2023）',
    ),
    url: universitySources.hku2023,
  },
  queensReport: {
    title: b(
      'Queen’s · Data Queens report (published 2024)',
      '女王大学 · Data Queens报道（发表于2024）',
    ),
    url: universitySources.queens2024,
    publishedDate: '2024-11-26',
    dateBasis: 'url-path' as const,
    dateNote: b(
      'Date in the article URL; page timestamp not independently recovered.',
      '文章路径日期；页面时间字段尚未独立恢复。',
    ),
  },
  about: {
    title: b(
      'Chengdu 80 · historical official introduction',
      '成都八零官网 · 历史赛事介绍',
    ),
    url: universitySources.about,
  },
};
export type SourceId = keyof typeof sources;
export type ArchiveSource = {
  title: Localized;
  url: string;
  publishedDate?: string | null;
  dateNote?: Localized;
  dateBasis?: 'page-field' | 'url-path';
};
export type Project = {
  projectId: string;
  year: number | null;
  reportedYear?: number;
  universityId: UniversityId;
  teamName: string | null;
  projectName: string | null;
  challenge: Localized | null;
  awardId: string;
  editionAwardId?: string;
  awardLabel: Localized;
  summary: Localized;
  image: string | null;
  demoUrl: string | null;
  repositoryUrl: string | null;
  sourceRefs: SourceId[];
  verificationStatus: 'documented' | 'event-year-unconfirmed';
  verificationNote?: Localized;
};
const media = { image: null, demoUrl: null, repositoryUrl: null };
// The bilingual awards table in the anniversary publication establishes this wording.
const topAward = b('Trailblazer Award', '开创者奖');
export const projects: readonly Project[] = [
  {
    projectId: 'nushadow',
    year: 2018,
    universityId: 'nus',
    teamName: null,
    projectName: 'NuShadow',
    challenge: b('Personal IPO pricing and issuance', '个人IPO定价与发行'),
    awardId: 'kaichuangzhe',
    awardLabel: topAward,
    summary: b(
      'A personal IPO marketplace connecting fundraisers and investors. NuShadow combined issuance recommendations, investment matching and interactive portfolio analysis in one prototype.',
      '连接个人筹资者与投资者的个人IPO平台。NuShadow将发行定价建议、投资匹配与组合分析整合进同一个原型，让个人融资成为可探索、可比较的过程。',
    ),
    sourceRefs: ['booklet', 'history'],
    verificationStatus: 'documented',
    ...media,
  },
  {
    projectId: 'dragon-search',
    year: 2019,
    universityId: 'hku',
    teamName: null,
    projectName: 'Dragon Search',
    challenge: b(
      'Discovering financial academic research',
      '金融学者科研探索发现平台',
    ),
    awardId: 'kaichuangzhe',
    awardLabel: topAward,
    summary: b(
      'From finding a paper to finding a collaborator: Dragon Search connected financial research discovery, researcher networks and a digital agreement workflow.',
      '从找到一篇论文，到找到一位合作伙伴。Dragon Search将金融研究检索、学者关系网络与数字协议流程相连接，帮助企业接近学术资源。',
    ),
    sourceRefs: ['event2019', 'booklet', 'history'],
    verificationNote: b(
      'The annual detail establishes the challenge and participants; the later SWUFE historical review names Dragon Search. Team photographs in the annual page do not establish a project-photo association.',
      '年度详情用于核实赛题与参赛高校，后续西财历史回顾用于核实Dragon Search专名。年度页面中的合影未明确关联该产品，不作为项目或冠军照片。',
    ),
    verificationStatus: 'documented',
    ...media,
  },
  {
    projectId: 'pisces',
    year: 2020,
    universityId: 'nus',
    teamName: null,
    projectName: 'Pisces',
    challenge: b('Explainable investment strategies', '可解释的投资策略'),
    awardId: 'kaichuangzhe',
    awardLabel: b(
      'Trailblazer Award / 开创者奖',
      '开创者奖 / Trailblazer Award',
    ),
    summary: b(
      'An explanation layer for investment models. Pisces used interactive charts and explainable AI to reveal the factors behind predictions, alongside a model publishing and subscription marketplace.',
      '为投资模型打开解释窗口。Pisces通过交互图表与可解释AI展示预测背后的影响因素，并设计模型发布与订阅市场，连接开发者与投资者。',
    ),
    sourceRefs: ['nus2020', 'booklet', 'history'],
    verificationStatus: 'documented',
    ...media,
  },
  {
    projectId: 'panda',
    year: 2021,
    universityId: 'tsinghua',
    teamName: null,
    projectName: 'Panda',
    challenge: b('Enterprise risk assessment', '企业风险评估'),
    awardId: 'kaichuangzhe',
    awardLabel: topAward,
    summary: b(
      'From scattered indicators to a view of enterprise risk. Panda combined data-quality management, multiple learning models, early warnings and risk visualization.',
      '把分散的指标转化为可理解的企业风险。Panda结合数据质量管理、多种学习模型、风险预警与可视化，支持对企业风险的分析与跟踪。',
    ),
    sourceRefs: ['booklet', 'history'],
    verificationStatus: 'documented',
    ...media,
  },
  {
    projectId: 'giraffe',
    year: 2022,
    universityId: 'tsinghua',
    teamName: null,
    projectName: 'Giraffe',
    challenge: b('Automated credit-risk modelling', '自动化信贷风控建模系统'),
    awardId: 'kaichuangzhe',
    awardLabel: topAward,
    summary: b(
      'A visual workflow for automated credit-risk modelling. Giraffe brought data, models and results together, with privacy and front-to-back-office communication as design priorities.',
      '让自动化信贷风控成为可理解的工作流程。Giraffe贯通数据、模型与结果的可视化，在重视隐私的同时，帮助业务与建模团队更好地协作。',
    ),
    sourceRefs: ['event2022', 'history'],
    verificationStatus: 'documented',
    ...media,
  },
  {
    projectId: 'apollo-2023',
    year: 2023,
    universityId: 'hku',
    teamName: 'Apollo',
    projectName: null,
    challenge: b('Financial news analysis', '金融新闻分析'),
    awardId: 'hku-pioneer-wording',
    awardLabel: b(
      'Pioneer Award (HKU wording: 領先者獎)',
      '领先者奖（港大英文原文：Pioneer Award）',
    ),
    summary: b(
      'The team developed methods for detecting false news and scoring financial news during the prototype challenge.',
      '团队在原型挑战中开发了虚假新闻识别与金融新闻评分方法。',
    ),
    sourceRefs: ['hku2023', 'event2023'],
    verificationStatus: 'documented',
    ...media,
  },
  {
    projectId: 'data-queens-report',
    year: 2024,
    reportedYear: 2024,
    universityId: 'queens',
    teamName: 'Data Queens',
    projectName: null,
    challenge: b(
      'Autonomous-vehicle insurance problems',
      '自动驾驶车辆保险问题',
    ),
    awardId: 'first-place',
    // Preserve the existing filter key; link the evidence-backed edition award by stable ID.
    editionAwardId: '2024-kaichuangzhe',
    awardLabel: b(
      '开创者奖 (SWUFE); first place / Trailblazer’s Award (Queen’s)',
      '开创者奖（西财正式报道）；女王大学专文称第一名',
    ),
    summary: b(
      'Data Queens built an autonomous-vehicle insurance prototype in 80 hours. SWUFE’s seventh-edition report confirms Queen’s highest award; the university report identifies the team. A product name is not established.',
      'Data Queens在80小时内开发自动驾驶车辆保险原型。西财第七届正式报道确认女王大学获最高奖项，校方专文补充团队信息。产品专名尚未明确。',
    ),
    sourceRefs: ['event2024', 'queensReport'],
    verificationStatus: 'documented',
    verificationNote: b(
      'Cross-source association uses institution, award, insurance topic and publication context. The Queen’s article alone does not explicitly date the edition; Data Queens is a team name, not a confirmed product name.',
      '按学校、奖项、保险赛题与发表背景交叉关联。女王大学专文正文单独不能确定届次；Data Queens是团队名，不是已确认产品专名。',
    ),
    ...media,
  },
];
export type Edition = {
  year: number;
  edition: number | null;
  status: 'held' | 'record-only' | 'not-held' | 'upcoming';
  datePrecision: 'year' | 'month' | 'day' | 'unknown';
  startDate: string | null;
  endDate: string | null;
  developmentStart: string | null;
  developmentEnd: string | null;
  finalDate: string | null;
  challenge: Localized | null;
  dateNote: Localized;
  sourceRefs: SourceId[];
  media: readonly string[];
  coverImageId?: string;
  recap?: Localized;
  awardResults?: readonly {
    id: string;
    label: Localized;
    universityIds: readonly UniversityId[];
    sourceRef: SourceId;
    sourcePage?: number;
  }[];
};
const unknownDates = {
  startDate: null,
  endDate: null,
  developmentStart: null,
  developmentEnd: null,
  finalDate: null,
};
// Edition topics come from the cited historical recap, not whichever project
// happens to be first in a filtered or reordered result list.
const editionChallenges: Record<number, Localized> = {
  2018: b('Personal IPO pricing and issuance', '个人IPO定价与发行'),
  2019: b('Financial Academic Explorer', '金融学者科研探索发现平台'),
  2020: b('Explainable investment strategies', '可解释的投资策略'),
  2021: b('Enterprise risk assessment', '企业风险评估'),
  2022: b('Automated credit-risk modelling', '自动化信贷风控建模系统'),
  2023: b('Financial news analysis', '金融新闻分析'),
};
export const editions: readonly Edition[] = [
  ...[2018, 2019, 2020, 2021, 2022, 2023].map(
    (year): Edition => ({
      year,
      edition: year - 2017,
      status: 'held',
      datePrecision:
        year === 2019 || year === 2020 || year === 2023 ? 'day' : 'year',
      ...unknownDates,
      ...(year === 2018 || year === 2020 || year === 2021
        ? { awardResults: bookletAwardsByYear[year] }
        : {}),
      ...(year === 2022 ? { awardResults: confirmed2022Awards } : {}),
      ...(year === 2023 ? { awardResults: confirmed2023Awards } : {}),
      ...(year === 2018
        ? {
            recap: b(
              'Eight university teams explored personal IPO pricing and issuance. NUS developed NuShadow, connecting personal fundraising with analytics, recommendations and an investor marketplace.',
              '首届赛事汇聚八所高校团队，围绕个人IPO定价与发行展开研发。新加坡国立大学以NuShadow探索个人融资，把筹资需求、智能定价与投资者匹配连接起来。',
            ),
          }
        : {}),
      ...(year === 2020
        ? {
            recap: b(
              'The third edition moved online, with teams developing on a shared cloud platform during the 80-hour challenge. NUS won the Trailblazer Award with Pisces, exploring how investors could understand machine-learning predictions.',
              '第三届赛事转为线上开展，各队在统一云平台上完成80小时研发。新加坡国立大学凭借Pisces获得开创者奖，探索如何把机器学习预测转化为投资者能够理解的解释与图表。',
            ),
          }
        : {}),
      ...(year === 2021
        ? {
            recap: b(
              'The fourth edition combined online and on-site demonstrations around enterprise risk assessment. Tsinghua’s Panda connected data preparation, risk models and visual analysis in a prototype for regulators, managers and investors.',
              '第四届赛事采用线上与线下相结合的展示形式，聚焦企业风险评估。清华大学的Panda将数据处理、风险建模与可视化分析整合为原型，面向监管者、管理者和投资者。',
            ),
          }
        : {}),
      ...(year === 2019
        ? {
            finalDate: '2019-11-03',
            coverImageId: 'cd80-2019-01',
            awardResults: confirmed2019Awards,
            recap: b(
              'Eight university teams built visual research-discovery platforms for finance scholars, before the final demonstrations and questions at SWUFE on 3 November. HKU’s Dragon Search brought together researcher discovery, topic analysis and potential collaboration.',
              '八所高校团队围绕金融学者科研探索发现平台展开研发，并于11月3日在西财进行决赛展示与答辩。香港大学的Dragon Search把学者检索、主题分析与合作连接融为一体，获得开创者奖。',
            ),
          }
        : {}),
      ...(year === 2020
        ? { startDate: '2020-10-26', endDate: '2020-10-29' }
        : {}),
      ...(year === 2023
        ? {
            startDate: '2023-10-27',
            endDate: '2023-11-03',
            developmentStart: '2023-10-29',
            finalDate: '2023-11-02',
          }
        : {}),
      challenge: editionChallenges[year] ?? null,
      dateNote:
        year === 2019
          ? b(
              'The official review explicitly dates the final/closing ceremony to 3 November 2019. The annual detail was published on 16 November 2019; the recap page on 23 September 2020. Broader NUS/HKU schedule accounts differ, so no full event range or exact development window is asserted here.',
              '官方回顾明确决赛闭幕式为2019年11月3日；年度详情网页日期为2019年11月16日，回顾网页日期为2020年9月23日。NUS与HKU的整体行程记载存在差异，本页不合并为确定活动范围，也不推算精确开发时段。',
            )
          : year === 2023
            ? b(
                'HKU reports the broader event as 27 October–3 November. The event recap records the competition opening on 29 October and the final on 2 November. These are different schedule scopes.',
                '港大报道的整体活动为10月27日至11月3日；赛事回顾记载比赛10月29日启动、11月2日决赛。不同口径分别保留。',
              )
            : year === 2020
              ? b(
                  'NUS reports the online competition as 26–29 October. Precise development timestamps are not supplied.',
                  '新加坡国立大学记载线上比赛为10月26—29日，未提供精确开发起止时间。',
                )
              : b(
                  'Year verified; exact event, development and final dates are not established in this record.',
                  '年份已核实，本档案尚未建立活动、开发和决赛的准确日期。',
                ),
      sourceRefs:
        year === 2019
          ? ['event2019', 'recap2019', 'booklet', 'history']
          : year === 2020
            ? ['nus2020', 'booklet', 'history']
            : year === 2023
              ? ['event2023', 'hku2023']
              : year === 2022
                ? ['history', 'event2022']
                : ['booklet', 'history'],
      media:
        year === 2019
          ? Array.from(
              { length: 8 },
              (_, i) => `cd80-2019-${String(i + 1).padStart(2, '0')}`,
            )
          : [],
    }),
  ),
  {
    year: 2024,
    edition: 7,
    status: 'held',
    datePrecision: 'day',
    ...unknownDates,
    finalDate: '2024-10-30',
    challenge: b(
      'Redefining auto insurance: challenges from intelligent driving',
      '重定义汽车保险：来自智能驾驶的挑战',
    ),
    dateNote: b(
      'The seventh-edition pitch, judging and awards evening took place on 30 October 2024. SWUFE published its report on 31 October. Precise development start/end times are not supplied.',
      '第七届路演评选暨颁奖晚会于2024年10月30日举行；西财报道发表于10月31日。现有来源未给出精确开发起止时间。',
    ),
    recap: b(
      'SWUFE and Chengdu Jiaozi Financial Holding Group hosted the event. The final evening took place at Sichuan Radio and Television. Teams addressed insurance product design in the autonomous-driving era, and the event launched the Chengdu 80 incubator. Zhang Lisheng, executive vice president of the UAE Chinese Business Council, sent an invitation to host the competition by video.',
      '西南财经大学与成都交子金融控股集团联合主办，路演评选与颁奖晚会在四川广播电视台举行。参赛队伍围绕智能驾驶时代的保险产品设计展开研发，现场启动了“成都八零”孵化器。阿联酋中华工商总会常务副会长张立生通过视频发来大赛举办邀请。',
    ),
    sourceRefs: ['event2024', 'queensReport'],
    media: [
      'cd80-2024-01',
      'cd80-2024-02',
      'cd80-2024-03',
      'cd80-2024-04',
      'cd80-2024-05',
    ],
    coverImageId: 'cd80-2024-01',
    awardResults: confirmed2024Awards,
  },
  {
    ...year2025,
    datePrecision: 'unknown',
    ...unknownDates,
    challenge: null,
    dateNote: b(
      'No competition held, according to the project owner.',
      '项目负责人确认：本年度未举办。',
    ),
    sourceRefs: [],
    media: [],
  },
  {
    year: currentCompetition.year,
    edition: currentCompetition.edition,
    status: 'upcoming',
    datePrecision: currentCompetition.datePrecision,
    ...unknownDates,
    challenge: currentCompetition.challenge,
    dateNote: currentCompetition.dateLabel,
    sourceRefs: [],
    media: [],
  },
];
export const editionUniversities = (year: number) =>
  universities.filter(
    (u) =>
      u.relationshipType !== 'ecosystem' && u.participationYears.includes(year),
  );
export const projectTitle = (p: Project) =>
  p.projectName
    ? b(p.projectName, p.projectName)
    : b(`${p.teamName} — prototype record`, `${p.teamName} — 原型成果记录`);
// Preserve the internal chronology, but do not publish entries for years without an event.
export const publicEditions: readonly Edition[] = editions.filter(
  (edition) => edition.status !== 'not-held',
);
export const statusLabels = {
  held: b('Historical edition', '历史赛事'),
  'record-only': b(
    'Published report · event year unconfirmed',
    '报道档案 · 赛事年份待核',
  ),
  'not-held': b('Not held', '未举办'),
  upcoming: b('Upcoming', '即将举办'),
};
