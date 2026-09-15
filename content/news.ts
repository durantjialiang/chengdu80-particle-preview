import { type Localized } from './competition';

export type NewsCategory = 'events' | 'exchange' | 'projects' | 'media';

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

// Historical activity dates and website publication dates are kept separate.
export const newsCategories: readonly { id: NewsCategory; label: Localized }[] =
  [
    {
      id: 'events',
      label: {
        en: 'Competition news',
        zh: '赛事动态',
      },
    },
    {
      id: 'exchange',
      label: {
        en: 'Academic exchange',
        zh: '国际学术交流',
      },
    },
    {
      id: 'projects',
      label: {
        en: 'Projects and cooperation',
        zh: '项目与合作',
      },
    },
    {
      id: 'media',
      label: {
        en: 'Media features',
        zh: '媒体报道',
      },
    },
  ];

export const newsArticles: readonly NewsArticle[] = [
  {
    id: 'competition-2024',
    category: 'events',
    title: {
      en: '2024 Chengdu 80: Redefining auto insurance',
      zh: '2024成都八零：重定义汽车保险',
    },
    summary: {
      en: 'University teams explored insurance for intelligent driving at the seventh Chengdu 80, culminating in the final pitches and awards on 30 October.',
      zh: '第七届赛事聚焦智能驾驶时代的汽车保险，高校团队于10月30日展开路演与答辩，迎来评选与颁奖。',
    },
    dateLabel: {
      en: '30 October 2024',
      zh: '2024年10月30日',
    },
    publishedAt: '2026-09-15',
    historical: true,
    cover: {
      src: '/history-media/cd80-2024-01-full.webp',
      alt: {
        en: 'Teams on the 2024 Chengdu 80 ceremony stage',
        zh: '2024成都八零颁奖晚会舞台上的参赛团队',
      },
      width: 1800,
      height: 1200,
    },
    paragraphs: [
      {
        en: 'On 30 October 2024, the seventh Chengdu 80 held its pitches, judging and awards evening at Sichuan Radio and Television. The edition was jointly hosted by SWUFE and Chengdu Jiaozi Financial Holdings Group.',
        zh: '2024年10月30日，第七届成都八零在四川广播电视台举行路演、评选与颁奖晚会。本届赛事由西南财经大学与成都交子金融控股集团联合主办。',
      },
      {
        en: 'Teams explored auto insurance product design in the era of intelligent driving, bringing their analysis and proposals from the 80-hour challenge to the stage.',
        zh: '参赛团队围绕智能驾驶时代的汽车保险产品设计展开80小时挑战，把分析与方案带到现场展示。',
      },
      {
        en: 'Queen’s University received the Trailblazer Award; ETH Zurich and Tsinghua University received Pioneer Awards. Visit the annual archive for photographs and further competition records.',
        zh: '女王大学获得开创者奖，苏黎世联邦理工学院与清华大学获得领先者奖。年度档案中还可查看本届赛事的现场照片与相关记录。',
      },
    ],
    links: [
      {
        label: {
          en: 'Official 2024 report',
          zh: '2024年官方报道',
        },
        url: 'https://news.swufe.edu.cn/info/1003/109791.htm',
      },
      {
        label: {
          en: '2024 edition archive',
          zh: '2024赛事档案',
        },
        url: '/history/2024/',
      },
    ],
  },
  {
    id: 'incubator-2024',
    category: 'projects',
    title: {
      en: 'Chengdu 80 Incubator launches at the 2024 final',
      zh: '成都八零孵化器在2024决赛现场启动',
    },
    summary: {
      en: 'Universities, industry and public-sector organizations launched an initiative focused on fintech projects and talent development.',
      zh: '高校、企业与公共部门共同参与，围绕金融科技项目成长与人才培养启动新的合作倡议。',
    },
    dateLabel: {
      en: '30 October 2024',
      zh: '2024年10月30日',
    },
    publishedAt: '2026-09-15',
    historical: true,
    cover: {
      src: '/history-media/cd80-2024-05-full.webp',
      alt: {
        en: 'Chengdu 80 Incubator launch ceremony',
        zh: '成都八零孵化器启动仪式',
      },
      width: 1800,
      height: 1200,
    },
    paragraphs: [
      {
        en: 'The Chengdu 80 Incubator was jointly launched at the seventh edition’s awards evening on 30 October 2024.',
        zh: '2024年10月30日，成都八零孵化器在第七届赛事颁奖晚会现场联合启动。',
      },
      {
        en: 'More than 20 organizations participated, including Tsinghua University and Chengdu Jiaozi Financial Holdings Group.',
        zh: '清华大学、成都交子金融控股集团等20余家单位参与启动，将高校、产业与公共部门的力量汇聚到赛事合作之中。',
      },
      {
        en: 'Its announced focus was project incubation and talent development across fintech and technology finance, extending the programme’s interest in ideas beyond the final presentation.',
        zh: '该倡议以金融科技和科技金融领域的项目孵化、人才培养为方向，让赛事对创新创意的关注延伸到决赛展示之后。',
      },
    ],
    links: [
      {
        label: {
          en: 'Official 2024 report',
          zh: '2024年官方报道',
        },
        url: 'https://news.swufe.edu.cn/info/1003/109791.htm',
      },
      {
        label: {
          en: 'Partnerships and initiatives',
          zh: '合作与项目',
        },
        url: '/partners/',
      },
      {
        label: {
          en: '2024 edition archive',
          zh: '2024赛事档案',
        },
        url: '/history/2024/',
      },
    ],
  },
  {
    id: 'discoverer-feature',
    category: 'media',
    title: {
      en: 'Inside Chengdu 80: The Discoverer feature',
      zh: '走进成都八零：《发现者》专题',
    },
    summary: {
      en: 'Shared by FIC, The Discoverer looks behind the scenes of Chengdu 80 through team preparation, collaboration and project showcases.',
      zh: '由FIC分享的《发现者》专题，带观众走进团队备赛、协作与项目展示，了解成都八零的台前幕后。',
    },
    dateLabel: {
      en: 'Feature shared 15 September 2026',
      zh: '专题分享于2026年9月15日',
    },
    publishedAt: '2026-09-15',
    historical: false,
    cover: {
      src: '/video-posters/behind-the-scenes.jpg',
      alt: {
        en: 'Cover image for the Inside Chengdu 80 feature',
        zh: '《走进成都八零》专题封面',
      },
      width: 1920,
      height: 1080,
    },
    paragraphs: [
      {
        en: 'The Discoverer feature follows young teams as they prepare, collaborate, exchange ideas and present their projects. FIC shares the programme through its video account.',
        zh: '《发现者》专题走进成都八零台前幕后，记录青年团队备赛、协作、交流与展示项目的过程。FIC通过视频账号分享了这部节目。',
      },
      {
        en: 'Including scenes from the 2024 edition, the film also looks at the organizational work and academic exchange that support the event, giving viewers a wider view of the competition.',
        zh: '片中包含2024年赛事画面，也呈现赛事背后的组织工作与学术交流，让观众从更多角度了解成都八零。',
      },
      {
        en: 'The full feature is available on Bilibili through the link below. Visit Photos and Videos for more forum footage, competition retrospectives and annual photo collections.',
        zh: '点击下方B站链接即可观看完整专题。“照片与视频”栏目还收录了论坛现场影像、历届回顾与年度相册。',
      },
    ],
    links: [
      {
        label: {
          en: 'Watch the feature on Bilibili',
          zh: '在哔哩哔哩观看专题',
        },
        url: 'https://www.bilibili.com/video/BV13Fen6YEXj/',
      },
      {
        label: {
          en: 'Media and video library',
          zh: '媒体与视频资料',
        },
        url: '/media/#videos',
      },
    ],
  },
  {
    id: 'competition-2023',
    category: 'events',
    title: {
      en: '2023 Chengdu 80: Eight teams analyse financial news',
      zh: '2023成都八零：八支队伍分析财经新闻',
    },
    summary: {
      en: 'The sixth edition reached its 2 November final after an 80-hour challenge focused on financial-news analysis.',
      zh: '第六届赛事于11月2日举行决赛，八支队伍完成了聚焦财经新闻分析的80小时挑战。',
    },
    dateLabel: {
      en: '2 November 2023',
      zh: '2023年11月2日',
    },
    publishedAt: '2026-09-15',
    historical: true,
    cover: {
      src: '/history-media/cd80-2023-owner-yfy-3743-full.webp',
      alt: {
        en: 'Final group photograph at the 2023 Chengdu 80',
        zh: '2023成都八零决赛合影',
      },
      width: 3200,
      height: 2133,
    },
    paragraphs: [
      {
        en: 'The sixth Chengdu 80 concluded its final on 2 November 2023. The challenge, announced at the 29 October opening, asked teams to develop a financial-news analysis system in 80 hours.',
        zh: '第六届成都八零于2023年11月2日举行决赛。10月29日开幕式公布赛题后，参赛团队需要在80小时内研发财经新闻分析系统。',
      },
      {
        en: 'Eight university teams reached the final, including ETH Zurich, Queen’s University, the National University of Singapore and the University of Hong Kong, alongside four universities from mainland China.',
        zh: '苏黎世联邦理工学院、女王大学、新加坡国立大学、香港大学，与清华大学、南方科技大学、电子科技大学、西南财经大学的八支代表队晋级决赛。',
      },
      {
        en: 'Teams demonstrated their prototypes, explained their design choices and answered judges’ questions. The challenge connected financial knowledge with tools such as artificial intelligence and data analysis.',
        zh: '决赛通过现场演示、讲解与答辩展示研发成果，让金融知识与人工智能、数据分析等技术在实际问题中相遇。',
      },
    ],
    links: [
      {
        label: {
          en: 'Official 2023 report',
          zh: '2023年官方报道',
        },
        url: 'https://jinrong.swufe.edu.cn/info/1134/4353.htm',
      },
      {
        label: {
          en: '2023 edition archive',
          zh: '2023赛事档案',
        },
        url: '/history/2023/',
      },
    ],
  },
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
