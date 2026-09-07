import { bilingual as b } from './competition';
import type { UniversityId } from './universities';

export const anniversarySource = {
  title: b('Chengdu 80 · fifth-anniversary publication', '成都八零五周年专刊'),
  url: 'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
};
const bookletAward = (
  year: number,
  key: string,
  label: ReturnType<typeof b>,
  universityIds: readonly UniversityId[],
  sourcePage: number,
) => ({
  id: `${year}-${key}`,
  label,
  universityIds,
  sourceRef: 'booklet' as const,
  sourcePage,
});
/** Annual body result pages (not the end-of-book summary), verified against the user-supplied 72-page publication.
 * Printed page = PDF page - 7 in these sections. A roster is not a project list.
 */
export const bookletAwardsByYear = {
  2018: [
    bookletAward(
      2018,
      'kaichuangzhe',
      b('Trailblazer Award', '开创者奖'),
      ['nus'],
      20,
    ),
    bookletAward(
      2018,
      'lingxianzhe',
      b('Pioneer Award', '领先者奖'),
      ['hku', 'berkeley'],
      20,
    ),
    bookletAward(
      2018,
      'chuangxinzhe',
      b('Innovator Award', '创新者奖'),
      ['gatech', 'pku', 'swufe', 'sustech', 'tsinghua'],
      20,
    ),
  ],
  2020: [
    bookletAward(
      2020,
      'kaichuangzhe',
      b('Trailblazer Award', '开创者奖'),
      ['nus'],
      46,
    ),
    bookletAward(
      2020,
      'lingxianzhe',
      b('Pioneer Award', '领先者奖'),
      ['uzh', 'swufe'],
      46,
    ),
    bookletAward(
      2020,
      'chuangxinzhe',
      b('Innovator Award', '创新者奖'),
      ['tsinghua', 'uestc', 'sustech', 'hku', 'cqu'],
      46,
    ),
  ],
  2021: [
    bookletAward(
      2021,
      'kaichuangzhe',
      b('Trailblazer Award', '开创者奖'),
      ['tsinghua'],
      56,
    ),
    bookletAward(
      2021,
      'lingxianzhe',
      b('Pioneer Award', '领先者奖'),
      ['swufe', 'uzh'],
      56,
    ),
    bookletAward(
      2021,
      'chuangxinzhe',
      b('Innovator Award', '创新者奖'),
      ['nus', 'hku', 'uestc', 'cqu', 'tau'],
      56,
    ),
  ],
};

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
    label: b('Trailblazer Award', '开创者奖'),
    universityIds: ['hku'] as readonly UniversityId[],
    sourceRef: 'booklet' as const,
    sourcePage: 36,
  },
  {
    id: '2019-pioneer',
    label: b('Pioneer Award', '领先者奖'),
    universityIds: ['berkeley', 'nus'] as readonly UniversityId[],
    sourceRef: 'booklet' as const,
    sourcePage: 36,
  },
  {
    id: '2019-innovator',
    label: b('Innovator Award', '创新者奖'),
    universityIds: [
      'pku',
      'swufe',
      'tsinghua',
      'toronto',
      'sjtu',
    ] as readonly UniversityId[],
    sourceRef: 'booklet' as const,
    sourcePage: 36,
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
// 2022's English recap inconsistently calls the highest award Pioneer/Trailblazer.
// Its Chinese title is established by SWUFE's historical project review. Keep
// Leader Award as published; do not normalize it from the anniversary glossary.
export const confirmed2022Awards = [
  {
    id: '2022-kaichuangzhe',
    label: b('Trailblazer Award / 开创者奖', '开创者奖'),
    universityIds: ['tsinghua'] as readonly UniversityId[],
    sourceRef: 'event2022' as const,
  },
  {
    id: '2022-leader',
    label: b('Leader Award', 'Leader Award'),
    universityIds: ['swufe', 'sustech'] as readonly UniversityId[],
    sourceRef: 'event2022' as const,
  },
  {
    id: '2022-innovator',
    label: b('Innovator Award', '创新者奖'),
    universityIds: ['uestc', 'hku', 'eth', 'queens'] as readonly UniversityId[],
    sourceRef: 'event2022' as const,
  },
];
// The edition recap does not map every school to an award. This is the
// independently identified HKU result, not a reconstructed complete ranking.
export const confirmed2023Awards = [
  {
    id: '2023-hku-pioneer',
    label: b('Pioneer Award (HKU)', '领先者奖（香港大学报道）'),
    universityIds: ['hku'] as readonly UniversityId[],
    sourceRef: 'hku2023' as const,
  },
];
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
