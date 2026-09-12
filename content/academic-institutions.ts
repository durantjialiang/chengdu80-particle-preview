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
    relationship: b('Faculty visit', '学者来访'),
    period: '2019',
    conciseSummary: b(
      '2019 · Hansen gave the SWUFE–CDAR forum keynote in Chengdu.',
      '2019年 · 汉森在成都SWUFE–CDAR论坛发表主题演讲。',
    ),
    summary: b(
      'Lars Peter Hansen delivered a keynote at the Second International FinTech Forum — SWUFE & CDAR (2019), held alongside the second Chengdu 80 competition, and joined academic conversations on site.',
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
    relationship: b('Faculty visit', '学者来访'),
    period: '2019',
    conciseSummary: b(
      '2019 · Sobel joined the SWUFE–CDAR forum as an invited speaker.',
      '2019年 · 索拜尔作为特邀嘉宾参加SWUFE–CDAR论坛。',
    ),
    summary: b(
      'Joel Sobel was an invited speaker at the Second International FinTech Forum — SWUFE & CDAR (2019), sharing perspectives on academic publishing and joining the publishing panel and on-site discussions.',
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
    relationship: b('CDAR forum unit', 'CDAR论坛合作单位'),
    period: '2019 · 2021',
    conciseSummary: b(
      'Robert M. Anderson delivered CDAR welcome remarks in 2019 and a forum keynote in 2021.',
      '罗伯特·安德森于2019年代表CDAR致辞，并于2021年发表论坛主旨演讲。',
    ),
    summary: b(
      'Robert M. Anderson, CDAR Co-Director, delivered welcome remarks for CDAR in 2019 and a keynote at the 2021 SWUFE–CDAR forum. CDAR also co-hosted Chengdu 80 in 2019, 2020 and 2021.',
      'CDAR联合主任罗伯特·安德森于2019年代表CDAR致欢迎辞，并在2021年SWUFE–CDAR论坛发表主旨演讲。CDAR亦联合主办了2019、2020、2021年成都八零赛事。',
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
    relationship: b('Guest speaker', '讲座嘉宾'),
    period: '2019',
    conciseSummary: b(
      '2019 · “I love Numbers” at SWUFE’s Jiaozi Innovation Forum.',
      '2019年 · 在西财交子创新讲坛分享“I love Numbers”。',
    ),
    summary: b(
      'Brady Haran visited SWUFE to give “I love Numbers” at the Jiaozi Innovation Forum, sharing his experience in making mathematics films. The lecture series led into the International FinTech Forum.',
      '布雷迪·哈兰来到西财，在交子创新讲坛带来“I love Numbers”讲座，分享数学影像创作经验。该系列讲座为国际金融科技论坛预热。',
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
