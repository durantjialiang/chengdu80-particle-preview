import { bilingual as b, type Localized } from './competition';

export type PressCategory = 'university' | 'media' | 'community';
export type PressReport = {
  id: string;
  category: PressCategory;
  publisher: Localized;
  title: Localized;
  summary: Localized;
  url: string;
  language: 'en' | 'zh-Hans' | 'zh-Hant';
  publishedAt: string | null;
  eventYear: number;
  originalPublishedAt?: string;
};

export const pressCategories: readonly {
  id: PressCategory;
  label: Localized;
}[] = [
  { id: 'university', label: b('University reports', '高校报道') },
  { id: 'media', label: b('Media coverage', '媒体报道') },
  { id: 'community', label: b('Team stories', '参赛团队分享') },
];

// Publication dates refer to the linked source. See docs/press-coverage-sources.json.
export const pressReports: readonly PressReport[] = [
  {
    id: 'queens-computing-2024-trailblazer',
    category: 'university',
    publisher: {
      en: 'Queen’s University · School of Computing',
      zh: '加拿大女王大学 · 计算机学院',
    },
    title: {
      en: '“Data Queens” Brings Home 1st Place Trophy from the FinTech Hackathon in China!',
      zh: 'Data Queens团队在成都八零金融科技黑客松中获得第一名',
    },
    summary: {
      en: 'Queen’s celebrates Data Queens’ Trailblazer Award for an 80-hour prototype addressing insurance challenges posed by autonomous vehicles.',
      zh: '女王大学报道Data Queens队获得开创者奖，团队围绕自动驾驶汽车保险问题完成80小时原型开发。',
    },
    url: 'https://www.cs.queensu.ca/news/2024/11/26/data-queens-brings-home-1st-place-trophy-from-the-fintech-hackathon-in-china/',
    language: 'en',
    publishedAt: null,
    eventYear: 2024,
  },
  {
    id: 'hku-cs-2023-pioneer-award',
    category: 'university',
    publisher: {
      en: 'The University of Hong Kong · Computer Science',
      zh: '香港大学 · 计算机科学',
    },
    title: {
      en: 'HKU Team Won Pioneer Award at FinTech80 Chengdu Hackathon 2023',
      zh: '香港大学团队获2023成都八零领先者奖',
    },
    summary: {
      en: 'HKU celebrates its Apollo team’s Pioneer Award and the news-analysis prototype developed by five undergraduates during the 80-hour challenge.',
      zh: '香港大学报道Apollo队获得领先者奖，五名本科生在80小时内完成面向财经新闻分析的产品原型。',
    },
    url: 'https://www.cs.hku.hk/news-events/news-and-announcements/20231106-chengdu80-pioneer-award-2023',
    language: 'en',
    publishedAt: '2023-11-06',
    eventYear: 2023,
  },
  {
    id: 'nus-msba-2023-runner-up',
    category: 'university',
    publisher: {
      en: 'National University of Singapore · MSBA',
      zh: '新加坡国立大学 · 商业分析硕士项目',
    },
    title: {
      en: 'NUS MSBA Students Clinches First Runner Up at FinTech80 Chengdu Hackathon',
      zh: '新加坡国立大学MSBA学生获成都八零金融科技黑客松亚军',
    },
    summary: {
      en: 'The NUS Finovaters team shares its first-runner-up achievement and NUSight, a news-analysis tool for financial analysts.',
      zh: 'NUS Finovaters团队获得亚军，作品NUSight面向金融分析师，提供新闻分析、摘要与风险评估。',
    },
    url: 'https://msba.nus.edu.sg/news/nus-msba-students-clinches-first-runner-up-at-fintech80-chengdu-hackathon/',
    language: 'en',
    publishedAt: '2023-11-09',
    eventYear: 2023,
  },
  {
    id: 'nus-computing-2019-runner-up',
    category: 'university',
    publisher: {
      en: 'NUS Computing',
      zh: '新加坡国立大学计算机学院',
    },
    title: {
      en: 'MSBA students win first runners up title at Chengdu 80 FinTech Competition 2019',
      zh: '新加坡国立大学学生获2019成都八零领先者奖',
    },
    summary: {
      en: 'NUS reports on its 2019 Pioneer Award and ProScope, a tool designed to help researchers find academic collaborators.',
      zh: '新加坡国立大学报道2019年团队获得领先者奖，介绍帮助研究者寻找学术合作伙伴的ProScope作品。',
    },
    url: 'https://www.comp.nus.edu.sg/news/2019-chengdu80/',
    language: 'en',
    publishedAt: '2019-12-05',
    eventYear: 2019,
  },
  {
    id: 'people-sichuan-2024-opening',
    category: 'media',
    publisher: {
      en: "People's Daily Online, Sichuan Channel",
      zh: '人民网四川频道',
    },
    title: {
      en: 'The seventh Chengdu 80 global fintech product design and development competition opens in Chengdu',
      zh: '第七届“成都八零”全球金融科技产品设计与研发大赛在蓉启幕',
    },
    summary: {
      zh: '人民网四川频道报道第七届成都八零在宽窄巷子启幕，八支高校队伍围绕智能驾驶汽车保险开展80小时挑战。',
      en: "People's Daily Online's Sichuan channel reports the 2024 opening, where eight university teams began an 80-hour challenge on auto insurance for intelligent driving.",
    },
    url: 'https://sc.people.com.cn/n2/2024/1029/c345167-41024132.html',
    language: 'zh-Hans',
    publishedAt: '2024-10-29',
    eventYear: 2024,
  },
  {
    id: 'hkcd-2022',
    category: 'media',
    publisher: {
      en: 'Hong Kong Commercial Daily',
      zh: '香港商报',
    },
    title: {
      en: 'Fifth Chengdu 80 fintech design and development competition opens',
      zh: '第五屆「成都八零」全球金融科技產品設計與研發大賽正式開賽',
    },
    summary: {
      en: 'A report on the 2022 launch, the eight university teams and the 80-hour design and development challenge.',
      zh: '报道2022年第五届赛事开幕、八所高校参赛情况，以及80小时产品设计与研发挑战。',
    },
    url: 'https://www.hkcd.com/content_143547_6_37.html',
    language: 'zh-Hant',
    publishedAt: '2022-11-05',
    eventYear: 2022,
  },
  {
    id: 'sichuan-online-2021-f80x',
    category: 'media',
    publisher: {
      en: 'Sichuan Online',
      zh: '四川在线',
    },
    title: {
      en: '80-hour challenge and the first FINTECH 80 x plan: the fourth Chengdu 80 competition opens',
      zh: '80小时限时挑战，首次发布“FINTECH 80 x”计划！第四届“成都80”大赛正式开赛',
    },
    summary: {
      zh: '四川在线报道第四届成都80开赛及FINTECH 80 x计划发布，八支高校队伍开展80小时金融科技挑战。',
      en: 'Sichuan Online covers the 2021 opening, the launch of FINTECH 80 x, and eight university teams beginning an 80-hour fintech challenge.',
    },
    url: 'https://sichuan.scol.com.cn/ggxw/202107/58216916.html',
    language: 'zh-Hans',
    publishedAt: '2021-07-17',
    eventYear: 2021,
  },
  {
    id: 'phoenix-2021-final',
    category: 'media',
    publisher: {
      en: 'Phoenix · Huaxia Morning Post',
      zh: '凤凰网 · 华夏早报',
    },
    title: {
      en: 'The fourth Chengdu 80 competition concludes in Chengdu; Tsinghua wins the Trailblazer Award',
      zh: '第四届“成都八零”大赛在蓉落幕 清华大学获得开创者奖',
    },
    summary: {
      zh: '凤凰网报道第四届成都八零决赛，清华大学获开创者奖，并首次发布面向产学研交流的FINTECH 80 x计划。',
      en: 'Phoenix reports the 2021 final: Tsinghua won the Trailblazer Award, while Chengdu 80 introduced FINTECH 80 x for industry-academia exchange.',
    },
    url: 'https://baby.ifeng.com/c/887AiK962v5',
    language: 'zh-Hans',
    publishedAt: '2021-07-23',
    eventYear: 2021,
  },
  {
    id: 'china-daily-2020-online-final',
    category: 'media',
    publisher: {
      en: 'China Daily website',
      zh: '中国日报网',
    },
    title: {
      en: "Chengdu 80: The fintech hackathon's first online showdown",
      zh: '“成都八零”大赛：“金融科技黑客马拉松”首次线上对决',
    },
    summary: {
      en: 'China Daily looks back at the 2020 final and how university teams joined the fintech challenge online.',
      zh: '中国日报回顾2020年决赛，介绍高校队伍在线参与金融科技产品设计与研发挑战的经历。',
    },
    url: 'https://sc.chinadaily.com.cn/a/202011/03/WS5fa1493ea3101e7ce972d2fa.html',
    language: 'zh-Hans',
    publishedAt: '2020-11-03',
    eventYear: 2020,
  },
  {
    id: 'chinadaily-2019',
    category: 'media',
    publisher: {
      en: 'China Daily',
      zh: '中国日报网',
    },
    title: {
      en: 'Second International FinTech Forum and Chengdu 80 competition conclude',
      zh: '第二届国际金融科技论坛“成都八零”金融科技产品设计与研发大赛圆满结束',
    },
    summary: {
      en: 'Coverage of the 2019 final, the Academic Explorer challenge and awards received by the eight university teams.',
      zh: '回顾2019年决赛、金融学者科研探索平台赛题，以及八支高校队伍的展示与获奖情况。',
    },
    url: 'https://sc.chinadaily.com.cn/a/201911/04/WS5dbfd4f8a31099ab995e9c37.html',
    language: 'zh-Hans',
    publishedAt: '2019-11-04',
    eventYear: 2019,
  },
  {
    id: 'datapi-tsinghua-2021',
    category: 'community',
    publisher: {
      en: 'DataPi THU · Tencent Cloud Community',
      zh: '数据派THU · 腾讯云开发者社区',
    },
    title: {
      en: 'Tsinghua team takes the Trailblazer Award at Chengdu 80',
      zh: '开创者奖！协会代表队征战“成都80”荣获最高奖项',
    },
    summary: {
      en: 'A team account of Tsinghua’s Random Walker and its Panda risk-assessment project at the 2021 competition.',
      zh: '参赛团队分享清华大学Random Walker队在2021年赛事中的经历，介绍企业风险评估作品Panda。',
    },
    url: 'https://cloud.tencent.com.cn/developer/article/2249269',
    language: 'zh-Hans',
    publishedAt: '2023-03-29',
    originalPublishedAt: '2021-07-26',
    eventYear: 2021,
  },
];
