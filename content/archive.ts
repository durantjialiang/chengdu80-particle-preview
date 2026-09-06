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
export const sources = {
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
export type Project = {
  projectId: string;
  year: number | null;
  reportedYear?: number;
  universityId: UniversityId;
  teamName: string | null;
  projectName: string | null;
  challenge: Localized | null;
  awardId: string;
  awardLabel: Localized;
  summary: Localized;
  image: string | null;
  demoUrl: string | null;
  repositoryUrl: string | null;
  sourceRefs: SourceId[];
  verificationStatus: 'documented' | 'event-year-unconfirmed';
};
const media = { image: null, demoUrl: null, repositoryUrl: null };
const topAward = b('开创者奖 (source wording)', '开创者奖');
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
      'A personal fundraising platform connecting fundraisers and investors through analytics and recommendations.',
      '面向个人筹资的平台，通过分析与推荐连接筹资者和投资者。',
    ),
    sourceRefs: ['history'],
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
      'A search tool organizing financial research and visualizing academic connections.',
      '组织金融研究文献、展示学术关联的检索工具。',
    ),
    sourceRefs: ['history'],
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
      'An investment platform using explainable AI and blockchain to make prediction models more understandable.',
      '使用可解释AI与区块链，让投资预测模型更易理解的平台。',
    ),
    sourceRefs: ['nus2020', 'history'],
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
      'A risk-management prototype with warning and visualization functions.',
      '具有风险预警与可视化功能的风险管理原型。',
    ),
    sourceRefs: ['history'],
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
      'A credit-risk prototype using data, model and result visualization while emphasizing privacy.',
      '注重隐私，以数据、模型和结果可视化支持信贷风控的原型。',
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
    year: null,
    reportedYear: 2024,
    universityId: 'queens',
    teamName: 'Data Queens',
    projectName: null,
    challenge: b(
      'Autonomous-vehicle insurance problems',
      '自动驾驶车辆保险问题',
    ),
    awardId: 'first-place',
    awardLabel: b(
      'First place / Trailblazer’s Award (Queen’s wording)',
      '第一名 / Trailblazer’s Award（女王大学原文）',
    ),
    summary: b(
      'A prototype addressing autonomous-vehicle problems for a hypothetical insurer. Queen’s reports the Data Queens team’s first-place finish, but does not explicitly state the event year.',
      '面向假设保险公司的自动驾驶车辆问题原型。女王大学报道Data Queens团队获第一名，但未明确赛事年份。',
    ),
    sourceRefs: ['queensReport'],
    verificationStatus: 'event-year-unconfirmed',
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
  2019: b('Discovering financial academic research', '金融学者科研探索发现平台'),
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
      datePrecision: year === 2020 || year === 2023 ? 'day' : 'year',
      ...unknownDates,
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
        year === 2023
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
        year === 2020
          ? ['nus2020', 'history']
          : year === 2023
            ? ['event2023', 'hku2023']
            : year === 2022
              ? ['history', 'event2022']
              : ['history'],
      media: [],
    }),
  ),
  {
    year: 2024,
    edition: null,
    status: 'record-only',
    datePrecision: 'unknown',
    ...unknownDates,
    challenge: null,
    dateNote: b(
      'A university report was published in 2024. Its event year is not explicitly confirmed; no seventh-edition claim is made.',
      '2024年有高校报道发表，但其赛事年份未明确确认；本档案不据此推定“第七届”。',
    ),
    sourceRefs: ['queensReport'],
    media: [],
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
export const statusLabels = {
  held: b('Historical edition', '历史赛事'),
  'record-only': b(
    'Published report · event year unconfirmed',
    '报道档案 · 赛事年份待核',
  ),
  'not-held': b('Not held', '未举办'),
  upcoming: b('Upcoming', '即将举办'),
};
