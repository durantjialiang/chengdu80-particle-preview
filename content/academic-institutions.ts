import { bilingual as b } from './competition';

// Affiliations connected through the dated activities below, requested by the
// project owner on 2026-09-10. Historical co-hosts remain in partner-brands.ts.
// Individual visits do not establish university-wide agreements or sponsorship.
export const academicInstitutions = [
  {
    id: 'uchicago-exchange',
    universityId: 'uchicago',
    years: [2019],
    collaboratorId: 'lars-peter-hansen',
    name: b('University of Chicago', '芝加哥大学'),
    unit: b(
      'Departments of Economics and Statistics · Booth School of Business',
      '经济系、统计系 · 布斯商学院',
    ),
    relationship: b(
      'Keynote lecture & academic exchange',
      '主旨演讲与学术交流',
    ),
    period: '2019',
    summary: b(
      'Lars Peter Hansen delivered a keynote at the 2019 SWUFE–CDAR International FinTech Forum, held alongside the second Chengdu 80 competition, and joined academic conversations on site.',
      '拉尔斯·彼得·汉森在与第二届成都八零同期举行的2019 SWUFE–CDAR国际金融科技论坛发表主旨演讲，并参与现场学术交流。',
    ),
    websites: [
      {
        label: b('University website', '学校官网'),
        url: 'https://www.uchicago.edu/',
      },
    ],
    source: 'https://cd80.swufe.edu.cn/info/1051/1121.htm',
  },
  {
    id: 'ucsd-exchange',
    universityId: 'ucsd',
    years: [2019],
    collaboratorId: 'joel-sobel',
    name: b('University of California San Diego', '加州大学圣迭戈分校'),
    unit: b('Department of Economics', '经济系'),
    relationship: b('Invited talk & forum exchange', '特邀报告与论坛交流'),
    period: '2019',
    summary: b(
      'Joel Sobel was an invited speaker at the 2019 SWUFE–CDAR International FinTech Forum, sharing perspectives on academic publishing and joining the publishing panel and on-site discussions.',
      '乔尔·索拜尔受邀参加2019 SWUFE–CDAR国际金融科技论坛，分享学术出版经验，并参与出版圆桌及现场讨论。',
    ),
    websites: [
      {
        label: b('University website', '学校官网'),
        url: 'https://www.ucsd.edu/',
      },
    ],
    source: 'https://cd80.swufe.edu.cn/info/1051/1121.htm',
  },
  {
    id: 'berkeley-exchange',
    universityId: 'berkeley',
    years: [2019, 2021],
    collaboratorId: 'robert-anderson',
    name: b('University of California, Berkeley', '加州大学伯克利分校'),
    unit: b(
      'Consortium for Data Analytics in Risk (CDAR) · Center for Risk Management Research',
      '国际风险数据分析联盟（CDAR）· 风险管理研究中心',
    ),
    relationship: b(
      'Forum collaboration & academic exchange',
      '论坛合作与学术交流',
    ),
    period: '2019 · 2021',
    summary: b(
      'Robert M. Anderson, CDAR Co-Director, delivered welcome remarks for CDAR in 2019 and a keynote at the 2021 SWUFE–CDAR forum. CDAR also co-hosted Chengdu 80 in 2019, 2020 and 2021.',
      'CDAR联席主任罗伯特·安德森于2019年代表CDAR致欢迎辞，并在2021年SWUFE–CDAR论坛发表主旨演讲。CDAR亦联合主办了2019、2020、2021年成都八零赛事。',
    ),
    websites: [
      {
        label: b('University website', '学校官网'),
        url: 'https://www.berkeley.edu/',
      },
      {
        label: b('CDAR website', 'CDAR官网'),
        url: 'https://cdar.econ.berkeley.edu/',
      },
    ],
    source: 'https://jinrong.swufe.edu.cn/info/1100/3386.htm',
  },
  {
    id: 'numberphile-exchange',
    universityId: null,
    years: [2019],
    collaboratorId: 'brady-haran',
    name: b('Numberphile · Periodic Videos', 'Numberphile · Periodic Videos'),
    unit: b(
      'Science communication projects by Brady Haran',
      '布雷迪·哈兰创作的科学传播项目',
    ),
    relationship: b(
      'Creator visit & science communication',
      '创作者来访与科学传播交流',
    ),
    period: '2019',
    summary: b(
      'Brady Haran visited SWUFE to give “I love Numbers” at the Jiazi Innovation Forum, sharing his experience in making mathematics films. The lecture series led into the International FinTech Forum.',
      '布雷迪·哈兰来到西财，在甲子创新论坛带来“I love Numbers”讲座，分享数学影像创作经验。该系列讲座为国际金融科技论坛预热。',
    ),
    websites: [
      {
        label: b('Numberphile', 'Numberphile官网'),
        url: 'https://www.numberphile.com/',
      },
      {
        label: b('Periodic Videos', 'Periodic Videos官网'),
        url: 'https://www.periodicvideos.com/',
      },
    ],
    source: 'https://fife.swufe.edu.cn/info/1311/2341.htm',
  },
] as const;

export const academicInstitutionForUniversity = (id: string) =>
  academicInstitutions.find((institution) => institution.universityId === id);
