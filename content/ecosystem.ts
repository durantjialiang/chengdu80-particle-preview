import { bilingual as b, type Localized } from './competition';

/** Historical roles only. None of these records establishes a 2026 appointment. */
export const ecosystemSources = {
  jiaozi2019: {
    title: b(
      'Chengdu Jiaozi · 2019 competition report',
      '成都交子官网 · 2019赛事报道',
    ),
    url: 'https://www.cdjzjk.com/news/show?articleId=2013070358905884672',
    published: '2019-11-07',
  },
  rules: {
    title: b('Historical competition rules', '旧官网历史规则'),
    url: 'https://cd80.swufe.edu.cn/CHENGDU_80_RULES.htm',
    published: null,
  },
  about: {
    title: b('Historical introduction', '旧官网赛事介绍'),
    url: 'https://cd80.swufe.edu.cn/ABOUT.htm',
    published: null,
  },
  fic: {
    title: b('Fintech Innovation Center', '金融科技创新中心介绍'),
    url: 'https://cd80.swufe.edu.cn/FIC.htm',
    published: null,
  },
  committee: {
    title: b('Historical committee', '旧官网委员会'),
    url: 'https://cd80.swufe.edu.cn/Committee.html',
    published: null,
  },
  report2020: {
    title: b(
      'SWUFE School of Finance · 2020 report',
      '西财金融学院 · 2020赛事报道',
    ),
    url: 'https://jinrong.swufe.edu.cn/info/1096/1490.htm',
    published: '2020-11-02',
  },
  report2023: {
    title: b(
      'SWUFE School of Finance · sixth edition',
      '西财金融学院 · 第六届赛事报道',
    ),
    url: 'https://jinrong.swufe.edu.cn/info/1134/4353.htm',
    published: '2023-11-06',
  },
  report2021: {
    title: b(
      'SWUFE · FINTECH80x launch in 2021',
      '西财金融学院 · 2021 FINTECH80x启动',
    ),
    url: 'https://jinrong.swufe.edu.cn/info/1100/3387.htm',
    published: '2021-07-26',
  },
  report2024: {
    title: b('SWUFE News · seventh edition', '西财新闻网 · 第七届赛事报道'),
    url: 'https://news.swufe.edu.cn/info/1003/109791.htm',
    published: '2024-10-31',
  },
  anniversary: {
    title: b(
      'Fifth-anniversary publication · original PDF',
      '五周年专刊 · 原站PDF',
    ),
    url: 'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
    published: null,
  },
} as const;
export type EcosystemSourceId = keyof typeof ecosystemSources;
export const organizations = {
  stateStreet: {
    name: b('State Street Bank', '美国道富银行'),
    short: b('State Street', '道富银行'),
    kind: b('Financial institution', '金融机构'),
  },
  swufe: {
    name: b('Southwestern University of Finance and Economics', '西南财经大学'),
    short: b('SWUFE', '西南财经大学'),
    kind: b('Academic institution', '学术机构'),
  },
  jiaozi: {
    name: b('Chengdu Jiaozi Financial Holding Group', '成都交子金融控股集团'),
    short: b('Chengdu Jiaozi', '成都交子'),
    kind: b('Financial holding group', '金融控股集团'),
  },
  cdar: {
    name: b(
      'UC Berkeley Consortium for Data Analytics in Risk',
      '加州大学伯克利分校国际风险数据分析联盟（CDAR）',
    ),
    short: b('UC Berkeley CDAR', '伯克利 CDAR'),
    kind: b('Research center', '研究中心'),
  },
  fic: {
    name: b('Fintech Innovation Center', '金融科技创新中心（FIC）'),
    short: b('FIC', 'FIC'),
    kind: b('Research & exchange', '研究与交流'),
  },
  association: {
    name: b('Chengdu Fintech Association', '成都市金融科技协会'),
    short: b('Chengdu Fintech Association', '成都市金融科技协会'),
    kind: b('Industry association', '行业协会'),
  },
} as const;
export type OrganizationId = keyof typeof organizations;
export type PartnerEdition = {
  year: number;
  hosts: OrganizationId[];
  deliveredBy: OrganizationId[];
  coOrganizers?: Localized[];
  source: EcosystemSourceId;
  note: Localized;
};
export const partnerEditions: PartnerEdition[] = [
  {
    year: 2019,
    hosts: ['swufe', 'jiaozi', 'cdar', 'stateStreet'],
    deliveredBy: [],
    source: 'jiaozi2019',
    note: b(
      'Chengdu Jiaozi’s own report explicitly records its exclusive funding sponsorship of the second edition, as well as a Jiaozi Park visit it organized for the teams on 3 November. This sponsorship claim applies to 2019 only.',
      '成都交子官网明确记载其独家出资赞助第二届赛事，并于11月3日举办参赛团队交子公园行活动。独家出资赞助这一身份仅对应2019年。',
    ),
  },
  {
    year: 2020,
    hosts: ['swufe', 'cdar', 'jiaozi'],
    deliveredBy: ['fic', 'association'],
    source: 'report2020',
    note: b(
      'The third edition connected academic research, finance and the local fintech community.',
      '第三届赛事把学术研究、金融产业与本地金融科技社群连接起来。',
    ),
  },
  {
    year: 2021,
    hosts: ['swufe', 'cdar', 'jiaozi'],
    deliveredBy: [],
    source: 'report2021',
    note: b(
      'At the fourth-edition launch on 17 July, SWUFE and Chengdu Jiaozi announced FINTECH80x. Jiaozi became its first cooperating financial enterprise.',
      '7月17日第四届启动仪式上，西财与成都交子宣布启动FINTECH80x，成都交子成为计划首家合作金融企业。',
    ),
  },
  {
    year: 2023,
    hosts: ['swufe', 'jiaozi'],
    deliveredBy: [],
    coOrganizers: [
      b('SWUFE School of Finance', '西财金融学院'),
      b('Institute of Chinese Financial Studies', '中国金融研究院'),
      b('FIC', '金融科技创新中心'),
      b(
        'Economics & Management Experimental Teaching Center',
        '经济管理实验教学中心',
      ),
      b(
        'Sichuan Key Laboratory of Financial Intelligence & Financial Engineering',
        '金融智能与金融工程四川省重点实验室',
      ),
    ],
    source: 'report2023',
    note: b(
      'The sixth edition continued the joint organization by SWUFE and Chengdu Jiaozi.',
      '第六届延续西财与成都交子的联合主办合作。',
    ),
  },
  {
    year: 2024,
    hosts: ['swufe', 'jiaozi'],
    deliveredBy: [],
    source: 'report2024',
    note: b(
      'The seventh edition also marked the launch of the Chengdu 80 incubator.',
      '第七届赛事期间，成都八零孵化器正式启动。',
    ),
  },
];
export const impactStories = [
  {
    id: 'fintech80x',
    year: '2021',
    title: b('FINTECH80x begins', 'FINTECH80x 计划启动'),
    description: b(
      'SWUFE and Chengdu Jiaozi launched FINTECH80x on 17 July 2021. Jiaozi became the plan’s first cooperating financial enterprise, extending the competition’s academic–industry connection.',
      '2021年7月17日，西财与成都交子共同启动FINTECH80x。成都交子成为计划首家合作金融企业，将赛事的产学联系延伸到比赛之外。',
    ),
    source: 'report2021' as const,
    locator: b(
      'Event: 2021-07-17 · report: 2021-07-26. Also in PDF page 58.',
      '发生于2021-07-17 · 报道发表于2021-07-26；专刊PDF第58页另有记录。',
    ),
  },
  {
    id: 'incubator',
    year: '2024',
    title: b('A bridge beyond the prototype', '从赛场原型，走向更广阔的合作'),
    description: b(
      'The Chengdu 80 incubator was launched at the seventh edition. The official report records participation by more than 20 organizations in the launch initiative. This is a launch milestone, not a count of incubated companies.',
      '第七届赛事启动成都八零孵化器，正式报道记录了20余家单位参与这一启动事项。这是已发生的合作起点，并非已孵化企业数量。',
    ),
    source: 'report2024' as const,
    locator: b('Seventh-edition report', '第七届正式报道'),
  },
];
export const featuredProjectIds = [
  'dragon-search',
  'pisces',
  'data-queens-report',
] as const;
export const historicalPeople = [
  {
    id: 'ma-honglin-2021',
    name: b('Ma Honglin', '马红林'),
    year: 2021,
    role: b(
      'Chengdu Jiaozi · Party Committee member and deputy general manager, as reported in 2021',
      '成都交子党委委员、副总经理（2021报道时职务）',
    ),
    story: b(
      'Spoke at the fourth-edition opening about connecting government, industry, universities, research and application.',
      '在第四届启动活动中，谈及通过赛事打通政产学研用通道。',
    ),
    source: 'report2021' as const,
  },
  {
    id: 'zou-jin-2023',
    name: b('Zou Jin', '邹进'),
    year: 2023,
    role: b(
      'Chengdu Jiaozi · deputy general manager, as reported in 2023',
      '成都交子副总经理（2023报道时职务）',
    ),
    story: b(
      'Addressed the sixth edition as a representative of a host organization.',
      '作为主办单位代表，在第六届赛事活动中致辞。',
    ),
    source: 'report2023' as const,
  },
  {
    id: 'wang-yongqiang-2024',
    name: b('Wang Yongqiang', '王永强'),
    year: 2024,
    role: b(
      'Chengdu Jiaozi · chairman, as reported in 2024',
      '成都交子董事长（2024报道时职务）',
    ),
    story: b(
      'Attended the seventh-edition ceremony and presented awards to participating teams.',
      '出席第七届路演评选暨颁奖晚会，并为参赛团队颁奖。',
    ),
    source: 'report2024' as const,
  },
];
export const industryConnections = [
  {
    id: 'hengsheng-2024',
    // Official English brand: https://en.hundsun.com/ (not Hang Seng Bank).
    name: b('Hundsun', '恒生电子'),
    context: b('2024 · award ceremony', '2024 · 颁奖现场'),
    detail: b(
      'Executive president Guan Xiaolan presented awards to teams, as recorded in SWUFE’s report.',
      '西财报道记载，执行总裁官晓岚为参赛队伍颁奖。',
    ),
    source: 'report2024' as const,
  },
  {
    id: 'swiss-re-2024',
    name: b('Swiss Re', '瑞士再保险'),
    context: b('2024 · award ceremony', '2024 · 颁奖现场'),
    detail: b(
      'Group vice president Li Xu presented awards to teams, as recorded in SWUFE’s report.',
      '西财报道记载，集团副总裁李旭为参赛队伍颁奖。',
    ),
    source: 'report2024' as const,
  },
  {
    id: 'uae-2024',
    name: b('UAE Chinese Business Council', '阿联酋中华工商总会'),
    context: b('2024 · video invitation', '2024 · 视频交流'),
    detail: b(
      'Executive vice president Zhang Lisheng sent a video invitation to host the competition. It was an invitation, not a confirmed subsequent edition.',
      '常务副会长张立生通过视频发来大赛举办邀请。这是邀请记录，不代表后续届次已确认落地。',
    ),
    source: 'report2024' as const,
  },
];
export const ficIndustry = [
  b('Ping An Group', '平安集团'),
  b('China Construction Bank', '中国建设银行'),
  b('China Investment Corporation', '中投公司'),
  b('State Street Bank', '道富银行'),
  b('Swiss Re', '瑞士再保险'),
  b('Moody’s', '穆迪'),
];
export const sceneImageIds = [
  'cd80-2024-04',
  'cd80-2024-01',
  'cd80-2019-01',
  'cd80-2019-08',
  'cd80-2024-05',
] as const;
export const schoolRequests = [
  {
    id: 'edition',
    title: b('2026 competition', '2026当届赛事'),
    text: b(
      'Confirmed organizing roles, exact dates and venue, entry process, team eligibility, judging, awards and deliverables.',
      '正式主办、承办与协办名单，准确日期地点，邀请或报名机制，队伍条件，评审、奖项及交付要求。',
    ),
  },
  {
    id: 'international',
    title: b('International participation', '国际参与'),
    text: b(
      'Working language, travel and accommodation, costs, on-site arrangements and a current consultation contact.',
      '工作语言、交通住宿、费用支持、来华与现场安排，以及有效咨询人和邮箱。',
    ),
  },
  {
    id: 'people',
    title: b('People', '赛事人物'),
    text: b(
      'Confirmed current committee, judges and mentors; dated roles, approved portraits and biographies.',
      '本届委员会、评委与导师确认名单，准确职务、获准公开的肖像与简介。',
    ),
  },
  {
    id: 'industry',
    title: b('Industry & incubation', '产业与孵化'),
    text: b(
      'Current Jiaozi and industry participation, incubator operating status and publishable follow-up projects or collaboration cases.',
      '交子及产业单位的当届参与方式，孵化器实际运行情况，可公开的项目进展与对接案例。',
    ),
  },
  {
    id: 'media',
    title: b('Project images & media', '作品与媒体素材'),
    text: b(
      'Project-matched screenshots and demo footage with rights clearance; high-resolution event photos, interviews and usage scope.',
      '能够对应具体作品的产品界面图与演示视频及使用授权；高清现场照片、访谈与使用范围。',
    ),
  },
  {
    id: 'operations',
    title: b('Ongoing updates', '持续运营'),
    text: b(
      'Official contact channels, public social accounts, editorial owner and publication process.',
      '官方联系渠道、公众号等有效账号，以及内容更新负责人和发布流程。',
    ),
  },
];
