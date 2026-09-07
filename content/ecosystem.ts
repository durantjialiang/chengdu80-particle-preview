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
  milestone: { title: Localized; summary: Localized };
  hosts: OrganizationId[];
  deliveredBy: OrganizationId[];
  coOrganizers?: Localized[];
  source: EcosystemSourceId;
  note: Localized;
};
export const partnerEditions: PartnerEdition[] = [
  {
    year: 2019,
    milestone: {
      title: b(
        'International co-hosts join the second edition',
        '国际机构联合主办第二届赛事',
      ),
      summary: b(
        'The second edition brought SWUFE, Chengdu Jiaozi, UC Berkeley CDAR and State Street Bank together. Jiaozi funded the competition and organized a visit to Jiaozi Park for the teams.',
        '第二届赛事连接西财、成都交子、伯克利CDAR与美国道富银行。成都交子独家出资赞助赛事，并组织参赛团队走进交子公园。',
      ),
    },
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
    milestone: {
      title: b('Delivering the third edition', '共同承办第三届赛事'),
      summary: b(
        'SWUFE, CDAR and Chengdu Jiaozi jointly hosted the third edition, with FIC and the Chengdu Fintech Association delivering the competition.',
        '西财、CDAR与成都交子联合主办第三届赛事，FIC与成都市金融科技协会共同承办，连接学术研究、金融产业与本地金融科技社群。',
      ),
    },
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
    milestone: {
      title: b('FINTECH80x launches', 'FINTECH80x 计划启动'),
      summary: b(
        'SWUFE and Chengdu Jiaozi launched FINTECH80x. Jiaozi became the plan’s first cooperating financial enterprise, extending collaboration beyond the competition.',
        '西财与成都交子共同启动FINTECH80x，成都交子成为计划首家合作金融企业，将产学合作延伸到赛事之外。',
      ),
    },
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
    milestone: {
      title: b(
        'SWUFE and Jiaozi co-host the sixth edition',
        '西财与交子联合主办第六届赛事',
      ),
      summary: b(
        'SWUFE and Chengdu Jiaozi jointly hosted the sixth edition, supported by SWUFE schools and research platforms.',
        '西财与成都交子联合主办第六届赛事，校内多个学院与研究平台共同参与。',
      ),
    },
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
    milestone: {
      title: b('The Chengdu 80 incubator launches', '成都八零孵化器启动'),
      summary: b(
        'The seventh edition marked the launch of the Chengdu 80 incubator, with more than 20 organizations participating in the launch initiative.',
        '第七届赛事期间，成都八零孵化器正式启动，20余家单位参与启动事项。',
      ),
    },
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
    title: b('FINTECH80x', 'FINTECH80x 计划'),
    description: b(
      'SWUFE and Chengdu Jiaozi launched FINTECH80x in July 2021 to extend collaboration around Chengdu 80. The initiative introduced standards for proposing and hosting related activities, with Chengdu Jiaozi as its first financial-sector partner.',
      '2021年7月，西财与成都交子共同启动FINTECH80x计划，拓展围绕成都八零的合作。计划发布了相关活动的申请与举办标准，成都交子成为首家合作金融企业。',
    ),
    cta: b('Read the launch announcement', '阅读启动公告'),
    source: 'report2021' as const,
    locator: b(
      'Event: 2021-07-17 · report: 2021-07-26. Also in PDF page 58.',
      '发生于2021-07-17 · 报道发表于2021-07-26；专刊PDF第58页另有记录。',
    ),
  },
  {
    id: 'incubator',
    year: '2024',
    title: b('Chengdu 80 Incubator', '成都八零孵化器'),
    description: b(
      'In October 2024, more than 20 organizations from universities, industry and government joined the launch of the Chengdu 80 Incubator. The initiative was introduced to support fintech project incubation and talent development.',
      '2024年10月，来自高校、企业和政府等领域的20余家单位共同参与成都八零孵化器启动，旨在推动金融科技项目孵化与人才培养。',
    ),
    cta: b('Read the 2024 event report', '阅读2024赛事报道'),
    // 20+ counts organizations at the 2024 launch, not incubated companies,
    // current members, investment recipients or subsequent operating outcomes.
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
    person: b('Guan Xiaolan', '官晓岚'),
    role: b('Executive president, Hundsun', '恒生电子执行总裁'),
    context: b('2024 · award ceremony', '2024 · 颁奖现场'),
    detail: b(
      'Executive president Guan Xiaolan presented awards to competing teams at the 2024 ceremony.',
      '执行总裁官晓岚在2024年颁奖典礼上为参赛队伍颁奖。',
    ),
    source: 'report2024' as const,
  },
  {
    id: 'swiss-re-2024',
    name: b('Swiss Re', '瑞士再保险'),
    person: b('Li Xu', '李旭'),
    role: b('Group vice president, Swiss Re', '瑞士再保险集团副总裁'),
    context: b('2024 · award ceremony', '2024 · 颁奖现场'),
    detail: b(
      'Group vice president Li Xu presented awards to competing teams at the 2024 ceremony.',
      '集团副总裁李旭在2024年颁奖典礼上为参赛队伍颁奖。',
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
export { ficIndustry } from './fic-network';
export const sceneImageIds = [
  'cd80-2024-04',
  'cd80-2024-01',
  'cd80-2019-01',
  'cd80-2019-08',
  'cd80-2024-05',
] as const;
