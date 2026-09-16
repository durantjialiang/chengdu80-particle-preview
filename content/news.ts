import { type Localized } from './competition';

export type NewsCategory = 'exchange';

export type NewsArticle = {
  id: string;
  category: NewsCategory;
  title: Localized;
  summary: Localized;
  dateLabel: Localized;
  publishedAt: string;
  historical: boolean;
  cover: {
    src: string;
    alt: Localized;
    width: number;
    height: number;
  };
  paragraphs: readonly Localized[];
  links: readonly {
    label: Localized;
    url: string;
  }[];
};

// Guest retrospectives remain separate from external press coverage.
export const newsCategories: readonly { id: NewsCategory; label: Localized }[] =
  [{ id: 'exchange', label: { en: 'Guest retrospectives', zh: '嘉宾回顾' } }];

export const newsArticles: readonly NewsArticle[] = [
  {
    id: 'hansen-2019',
    category: 'exchange',
    title: {
      en: 'Lars Peter Hansen at the 2019 International FinTech Forum',
      zh: '诺奖学者汉森参加2019国际金融科技论坛',
    },
    summary: {
      en: 'The Nobel laureate joined international researchers and practitioners in Chengdu for a forum held alongside the second Chengdu 80.',
      zh: '诺贝尔经济学奖得主汉森与国际学者、行业人士相聚成都，参与与第二届成都八零同期举行的论坛。',
    },
    dateLabel: {
      en: '1–3 November 2019',
      zh: '2019年11月1—3日',
    },
    publishedAt: '2026-09-15',
    historical: true,
    cover: {
      src: '/history-media/collaborators/collab-2019-hansen-portrait-full.webp',
      alt: {
        en: 'Lars Peter Hansen speaking at the 2019 forum',
        zh: 'Lars Peter Hansen在2019论坛发言',
      },
      width: 2400,
      height: 1597,
    },
    paragraphs: [
      {
        en: 'From 1 to 3 November 2019, Lars Peter Hansen joined the SWUFE–CDAR International FinTech Forum as a keynote guest. The forum took place alongside the second Chengdu 80.',
        zh: '2019年11月1—3日，Lars Peter Hansen以主题演讲嘉宾身份参加SWUFE–CDAR国际金融科技论坛。论坛与第二届成都八零同期举行。',
      },
      {
        en: 'A University of Chicago economist and recipient of the 2013 Nobel Prize in Economic Sciences, Hansen was an invited keynote speaker. The photographs show his talk and exchanges with the forum audience.',
        zh: '汉森来自芝加哥大学，是2013年诺贝尔经济学奖得主，受邀担任论坛主题演讲嘉宾。现场照片记录了他的分享及与听众的交流。',
      },
      {
        en: 'The forum brought academic and industry participants together around risk management, financial technology and market developments. The links below lead to Hansen’s profile and the available forum film.',
        zh: '论坛围绕风险管理、金融科技与金融市场发展等议题，连接学术研究与行业实践。下方可继续查看汉森的人物介绍与相关论坛影像。',
      },
    ],
    links: [
      {
        label: {
          en: 'Official 2019 forum report',
          zh: '2019年官方论坛报道',
        },
        url: 'https://cd80.swufe.edu.cn/info/1051/1121.htm',
      },
      {
        label: {
          en: 'Lars Peter Hansen profile',
          zh: 'Lars Peter Hansen人物档案',
        },
        url: '/partners/#lars-peter-hansen',
      },
      {
        label: {
          en: 'Watch the forum video',
          zh: '观看论坛视频',
        },
        url: 'https://www.bilibili.com/video/BV1wEen6nEXe/',
      },
    ],
  },
  {
    id: 'anderson-2019',
    category: 'exchange',
    title: {
      en: 'Robert Anderson: Scenes from the 2019 FinTech Forum',
      zh: 'Robert Anderson：2019国际金融科技论坛现场',
    },
    summary: {
      en: 'Revisit Robert Anderson’s welcome remarks for CDAR and the academic exchanges at the 2019 forum in Chengdu.',
      zh: '回看Robert Anderson代表CDAR致欢迎辞的现场，以及2019年论坛在成都展开的学术交流。',
    },
    dateLabel: {
      en: '1–3 November 2019',
      zh: '2019年11月1—3日',
    },
    publishedAt: '2026-09-15',
    historical: true,
    cover: {
      src: '/history-media/collaborators/collab-2019-anderson-portrait-full.webp',
      alt: {
        en: 'Robert M. Anderson addressing the 2019 forum',
        zh: 'Robert M. Anderson在2019论坛发言',
      },
      width: 2400,
      height: 1597,
    },
    paragraphs: [
      {
        en: 'From 1 to 3 November 2019, Robert M. Anderson joined the SWUFE–CDAR International FinTech Forum and delivered welcome remarks on behalf of CDAR.',
        zh: '2019年11月1—3日，Robert M. Anderson参加SWUFE–CDAR国际金融科技论坛，并代表CDAR致欢迎辞。',
      },
      {
        en: 'With risk as its annual theme, the forum connected financial technology with questions facing researchers and practitioners. Anderson’s remarks formed part of the opening exchange.',
        zh: '论坛以风险为年度主题，将金融科技与学界、业界共同关注的问题联系起来。Anderson的致辞是现场交流的一部分。',
      },
      {
        en: 'The event video includes his remarks and scenes from the forum. His collaborator profile offers further photographs, academic background and a later exchange recorded in 2021.',
        zh: '现场视频收录了他的发言与会场片段。人物档案中还可查看更多照片、学术背景，以及2021年的交流记录。',
      },
    ],
    links: [
      {
        label: {
          en: 'Official 2019 forum report',
          zh: '2019年官方论坛报道',
        },
        url: 'https://cd80.swufe.edu.cn/info/1051/1121.htm',
      },
      {
        label: {
          en: 'Robert M. Anderson profile',
          zh: 'Robert M. Anderson人物档案',
        },
        url: '/partners/#robert-anderson',
      },
      {
        label: {
          en: 'Watch the forum video',
          zh: '观看论坛视频',
        },
        url: 'https://www.bilibili.com/video/BV12Qen6oE3f/',
      },
    ],
  },
];
