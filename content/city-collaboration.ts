import { bilingual as b, type Localized } from './competition';

/** Relationship evidence is retained for editors, not rendered as page footnotes. */
export const cityCollaborationSources = {
  cityVisit2023: {
    url: 'https://www.swufe.edu.cn/info/1048/23222.htm',
    published: '2023-11-03',
    eventDate: '2023-10-31',
  },
  forum2022: {
    url: 'https://fic.swufe.edu.cn/info/1027/1003.htm',
    published: '2022-11-11',
    eventDate: '2022-11-05',
  },
  forum2023: {
    url: 'https://www.swufe.edu.cn/info/1048/23202.htm',
    published: '2023-11-02',
    eventDate: '2023-10-28',
    eventEnd: '2023-10-29',
  },
  qingyang2021: {
    url: 'https://www.swufe.edu.cn/info/1048/29662.htm',
    published: '2021-10-27',
    eventDate: '2021-10-22',
  },
  qingyang2024: {
    url: 'https://www.swufe.edu.cn/info/1048/20632.htm',
    published: '2024-06-07',
    eventDate: '2024-06-06',
  },
  competition2024: {
    url: 'https://news.swufe.edu.cn/info/1003/109791.htm',
    published: '2024-10-31',
    eventDate: '2024-10-30',
  },
} as const;

export type CityInstitution = {
  id: string;
  name: Localized;
  role: Localized;
  summary: Localized;
  relationship:
    | 'co-building'
    | 'forum-co-host'
    | 'district-collaboration'
    | 'event-engagement';
  website: string | null;
  sourceIds: readonly (keyof typeof cityCollaborationSources)[];
};

/** These are distinct city relationships, not a competition host/sponsor roster. */
export const cityInstitutions: readonly CityInstitution[] = [
  {
    id: 'chengdu-municipal-government',
    name: b("Chengdu Municipal People's Government", '成都市人民政府'),
    role: b('University–city collaboration', '政校共建'),
    summary: b(
      'Chengdu and SWUFE jointly established FIC, connecting fintech research, talent and the city. In 2023, city representatives visited the laboratory and met teams at Chengdu 80.',
      '与西南财经大学共建金融科技国际联合实验室，连接金融科技研究、人才培养与城市发展。市政府代表曾走进实验室与成都八零赛场，与参赛团队交流。',
    ),
    relationship: 'co-building',
    website: 'https://www.chengdu.gov.cn/',
    sourceIds: ['cityVisit2023'],
  },
  {
    id: 'wenjiang-district-government',
    name: b("Wenjiang District People's Government", '成都市温江区人民政府'),
    role: b('International Fintech Forum co-host', '国际金融科技论坛联合主办'),
    summary: b(
      'Co-hosted the 2022 and 2023 International Fintech Forums with SWUFE and the municipal financial regulator, bringing academic and industry exchange to Wenjiang.',
      '与西财、市级金融监管部门联合主办2022、2023年国际金融科技论坛，让学术研究与产业交流在温江相遇。',
    ),
    relationship: 'forum-co-host',
    website: 'https://www.wenjiang.gov.cn/',
    sourceIds: ['forum2022', 'forum2023'],
  },
  {
    id: 'qingyang-district-government',
    name: b("Qingyang District People's Government", '成都市青羊区人民政府'),
    role: b('University–district collaboration', '校地合作'),
    summary: b(
      'Worked with SWUFE on the financial innovation district around the university, research translation and talent development. District representatives also joined the seventh-edition awards ceremony.',
      '携手西财推进环财大财经智谷建设，深化科研成果转化与人才培养；区政府代表亦参与第七届成都八零颁奖活动。',
    ),
    relationship: 'district-collaboration',
    website: 'https://www.cdqingyang.gov.cn/',
    sourceIds: ['qingyang2021', 'qingyang2024', 'competition2024'],
  },
  {
    id: 'chengdu-financial-regulatory-bureau',
    name: b(
      'Chengdu Municipal Financial Regulatory Bureau',
      '成都市地方金融监督管理局',
    ),
    role: b('International Fintech Forum co-host', '国际金融科技论坛联合主办'),
    summary: b(
      'Under its name at the time, co-hosted the 2022 and 2023 International Fintech Forums, connecting financial-sector dialogue with academic research.',
      '以当时的机构名称，联合主办2022、2023年国际金融科技论坛，推动金融行业与学术研究的交流。',
    ),
    relationship: 'forum-co-host',
    website: null,
    sourceIds: ['forum2022', 'forum2023'],
  },
  {
    id: 'chengdu-financial-work-office',
    name: b(
      'Office of the Chengdu Municipal Financial Work Commission',
      '中共成都市委金融工作委员会办公室',
    ),
    role: b('Competition engagement', '赛事交流'),
    summary: b(
      'Representatives addressed the seventh Chengdu 80 competition and presented awards, engaging with the teams and their fintech prototypes.',
      '代表出席第七届成都八零路演评选暨颁奖活动并致辞、颁奖，与高校团队围绕金融科技创新展开交流。',
    ),
    relationship: 'event-engagement',
    website: null,
    sourceIds: ['competition2024'],
  },
];

/** Approved general event scenes; no image is attributed to a specific institution. */
export const citySceneImageIds = ['cd80-2024-01', 'cd80-2024-04'] as const;
