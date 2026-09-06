import { bilingual as b } from './competition';
import type { UniversityId } from './universities';

export const edition2019Source = {
  title: b('Chengdu 80 · 2019 annual detail', '成都八零旧官网 · 2019年度详情'),
  url: 'https://cd80.swufe.edu.cn/info/1031/1091.htm',
  publishedDate: '2019-11-16',
  dateBasis: 'page-field' as const,
};
export const recap2019Source = {
  title: b(
    'Chengdu 80 · 2019 final and results review',
    '成都八零旧官网 · 2019决赛与获奖回顾',
  ),
  url: 'https://cd80.swufe.edu.cn/info/1081/1071.htm',
  publishedDate: '2020-09-23',
  dateBasis: 'page-field' as const,
  dateNote: b(
    'A later publication about the 2019 event, not a 2020 event.',
    '晚于赛事的回顾页面，不是2020年赛事。',
  ),
};
export const confirmed2019Awards = [
  {
    id: '2019-trailblazer',
    label: b('Trailblazer (2019 recap wording)', 'Trailblazer（2019回顾原文）'),
    universityIds: ['hku'] as readonly UniversityId[],
    sourceRef: 'recap2019' as const,
  },
  {
    id: '2019-pioneer',
    label: b('Pioneer (2019 recap wording)', 'Pioneer（2019回顾原文）'),
    universityIds: ['berkeley', 'nus'] as readonly UniversityId[],
    sourceRef: 'recap2019' as const,
  },
  {
    id: '2019-innovator',
    label: b('Innovator (2019 recap wording)', 'Innovator（2019回顾原文）'),
    universityIds: [
      'pku',
      'swufe',
      'tsinghua',
      'toronto',
      'sjtu',
    ] as readonly UniversityId[],
    sourceRef: 'recap2019' as const,
  },
];

export const edition2024Source = {
  title: b(
    'SWUFE News · official seventh-edition report',
    '西财新闻网 · 第七届正式报道',
  ),
  url: 'https://news.swufe.edu.cn/info/1003/109791.htm',
  publishedDate: '2024-10-31',
  dateBasis: 'page-field' as const,
};
export const confirmed2024Awards: readonly {
  id: string;
  label: ReturnType<typeof b>;
  universityIds: readonly UniversityId[];
  sourceRef: 'event2024';
}[] = [
  {
    id: '2024-kaichuangzhe',
    label: b('开创者奖 · highest award (official Chinese wording)', '开创者奖'),
    universityIds: ['queens'],
    sourceRef: 'event2024',
  },
  {
    id: '2024-lingxianzhe',
    label: b('领先者奖 (official Chinese wording)', '领先者奖'),
    universityIds: ['eth', 'tsinghua'],
    sourceRef: 'event2024',
  },
  {
    id: '2024-chuangxinzhe',
    label: b('创新者奖 (official Chinese wording)', '创新者奖'),
    universityIds: ['nus', 'hku', 'uestc', 'gatech'],
    sourceRef: 'event2024',
  },
  {
    id: '2024-special',
    label: b('特别奖 · Special award', '特别奖'),
    universityIds: ['swufe'],
    sourceRef: 'event2024',
  },
];
