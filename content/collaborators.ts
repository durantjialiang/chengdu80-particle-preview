import { bilingual as b, type Localized } from './competition';
export { publicCollaboratorImages } from './collaborator-media';

export type CollaboratorActivity = {
  year: number;
  event: Localized;
  format: Localized;
  source: { label: Localized; url: string };
};

export type Collaborator = {
  id: string;
  shortName: string;
  name: Localized;
  affiliation: Localized;
  role: Localized;
  distinction: Localized;
  biography: Localized;
  highlights: readonly Localized[];
  activities: readonly CollaboratorActivity[];
  connection: Localized;
  photoIds: readonly string[];
  sources: readonly { label: Localized; url: string }[];
};

// Current titles checked against institutional profiles on 2026-09-10.
// Historical event roles remain dated; no competition judging or advisory post is inferred.
export const collaborators: readonly Collaborator[] = [
  {
    id: 'lars-peter-hansen',
    shortName: 'Lars Peter Hansen',
    name: b('Lars Peter Hansen', '拉尔斯·彼得·汉森'),
    affiliation: b('University of Chicago', '芝加哥大学'),
    role: b(
      'David Rockefeller Distinguished Service Professor',
      '大卫·洛克菲勒杰出服务教授',
    ),
    distinction: b(
      '2013 Nobel laureate in Economic Sciences',
      '2013年诺贝尔经济学奖得主',
    ),
    biography: b(
      'An economist working across economics, statistics and the Booth School of Business, Hansen studies macro-finance, asset pricing and uncertainty. His econometric methods help connect economic models with financial-market evidence.',
      '任教于芝加哥大学经济学系、统计学系与布斯商学院，研究宏观金融、资产定价与不确定性。他发展的计量方法，为连接经济模型与金融市场实证研究提供了重要工具。',
    ),
    highlights: [
      b(
        'Director of the Macro Finance Research Program at the University of Chicago.',
        '芝加哥大学宏观金融研究计划（MFR）负责人。',
      ),
      b(
        '2010 BBVA Foundation Frontiers of Knowledge Award in Economics, Finance and Management.',
        '2010年BBVA基金会知识前沿奖（经济、金融与管理领域）得主。',
      ),
    ],
    activities: [
      {
        year: 2019,
        event: b(
          'Second International FinTech Forum — SWUFE & CDAR (2019)',
          '第二届国际金融科技论坛—SWUFE & CDAR（2019）',
        ),
        format: b('Keynote speaker', '主题演讲嘉宾'),
        source: {
          label: b('Official 2019 forum page', '2019论坛官方页面'),
          url: 'https://cd80.swufe.edu.cn/info/1051/1121.htm',
        },
      },
    ],
    connection: b(
      'Keynote speaker at the SWUFE–CDAR International FinTech Forum, held in Chengdu on 1–3 November 2019 alongside the second Chengdu 80. The photographs capture his talk and exchanges with the forum audience.',
      '受邀担任2019年11月1—3日SWUFE–CDAR国际金融科技论坛主题演讲嘉宾。论坛与第二届成都八零同期举办，照片记录了他的演讲及与论坛听众的交流。',
    ),
    photoIds: [
      'collab-2019-hansen-portrait',
      'collab-2019-hansen-forum',
      'collab-2019-hansen-exchange',
      'collab-2019-hansen-discussion',
    ],
    sources: [
      {
        label: b('University profile', '芝加哥大学主页'),
        url: 'https://www.chicagobooth.edu/faculty/directory/h/lars-hansen',
      },
      {
        label: b('Nobel Prize', '诺贝尔奖资料'),
        url: 'https://www.nobelprize.org/prizes/economic-sciences/2013/hansen/facts/',
      },
      {
        label: b('2019 forum', '2019论坛资料'),
        url: 'https://cd80.swufe.edu.cn/info/1051/1121.htm',
      },
    ],
  },
  {
    id: 'joel-sobel',
    shortName: 'Joel Sobel',
    name: b('Joel Sobel', '乔尔·索拜尔'),
    affiliation: b('University of California San Diego', '加州大学圣迭戈分校'),
    role: b('Professor Emeritus of Economics', '经济学荣休教授'),
    distinction: b(
      'Fellow, American Academy of Arts and Sciences',
      '美国艺术与科学学院院士',
    ),
    biography: b(
      'Sobel studies game theory, strategic communication and information. His work explores how people share information, establish credibility and make decisions when their interests and knowledge differ.',
      '研究博弈论、战略沟通与信息，关注人们在利益与信息不对称的情况下如何传递信息、建立可信性并作出决策。',
    ),
    highlights: [
      b(
        'Fellow of the Econometric Society, elected in 1990; elected to the American Academy of Arts and Sciences in 2010.',
        '1990年当选计量经济学会会士，2010年当选美国艺术与科学学院院士。',
      ),
      b(
        'Editor of Econometrica, 2015–2019.',
        '2015—2019年任《Econometrica》编辑。',
      ),
    ],
    activities: [
      {
        year: 2019,
        event: b(
          'Second International FinTech Forum — SWUFE & CDAR (2019)',
          '第二届国际金融科技论坛—SWUFE & CDAR（2019）',
        ),
        format: b('Invited speaker', '特邀嘉宾'),
        source: {
          label: b('Official 2019 forum page', '2019论坛官方页面'),
          url: 'https://cd80.swufe.edu.cn/info/1051/1121.htm',
        },
      },
    ],
    connection: b(
      'Invited speaker at the SWUFE–CDAR 2019 International FinTech Forum, held alongside Chengdu 80. His visit included a talk on academic publishing, a panel discussion and conversations with participants.',
      '2019年SWUFE–CDAR国际金融科技论坛受邀嘉宾，参与成都八零同期学术交流。现场素材记录了他分享学术发表经验、参与圆桌讨论并与参会者交流的场景。',
    ),
    photoIds: [
      'collab-2019-sobel-portrait',
      'collab-2019-sobel-forum',
      'collab-2019-sobel-exchange',
      'collab-2019-sobel-panel',
    ],
    sources: [
      {
        label: b('University faculty directory', '圣迭戈分校教师目录'),
        url: 'https://economics.ucsd.edu/faculty-and-research/faculty-profiles/index.html',
      },
      {
        label: b('Academy profile', '学院人物档案'),
        url: 'https://www.amacad.org/person/joel-sobel',
      },
      {
        label: b('Academic CV', '学术履历'),
        url: 'https://econweb.ucsd.edu/~jsobel/cv.pdf',
      },
      {
        label: b('2019 forum', '2019论坛资料'),
        url: 'https://cd80.swufe.edu.cn/info/1051/1121.htm',
      },
    ],
  },
  {
    id: 'robert-anderson',
    shortName: 'Robert M. Anderson',
    name: b('Robert M. Anderson', '罗伯特·安德森'),
    affiliation: b('University of California, Berkeley', '加州大学伯克利分校'),
    role: b(
      'Distinguished Professor Emeritus of Economics and Mathematics',
      '经济学与数学杰出荣休教授',
    ),
    distinction: b('Co-Director, Berkeley CDAR', '伯克利CDAR联合主任'),
    biography: b(
      'Anderson works at the intersection of economics and mathematics, with research in financial economics, mathematical economics and portfolio risk. He connects these fields through Berkeley’s research in risk management and data analytics.',
      '研究横跨经济学与数学，涵盖金融经济学、数学经济学及投资组合风险，并通过伯克利的风险管理与数据分析研究推动跨学科交流。',
    ),
    highlights: [
      b(
        'Coleman Fung Professor Emeritus of Risk Management at UC Berkeley.',
        '伯克利Coleman Fung风险管理荣休教授。',
      ),
      b(
        'Director of Berkeley’s Center for Risk Management Research.',
        '伯克利风险管理研究中心主任。',
      ),
    ],
    activities: [
      {
        year: 2019,
        event: b(
          'Second International FinTech Forum — SWUFE & CDAR (2019)',
          '第二届国际金融科技论坛—SWUFE & CDAR（2019）',
        ),
        format: b('CDAR representative; welcome remarks', 'CDAR代表；欢迎致辞'),
        source: {
          label: b('Official 2019 forum page', '2019论坛官方页面'),
          url: 'https://cd80.swufe.edu.cn/info/1051/1121.htm',
        },
      },
      {
        year: 2021,
        event: b(
          'Fourth International FinTech Forum — SWUFE & CDAR (2021)',
          '第四届国际金融科技论坛—SWUFE & CDAR（2021）',
        ),
        format: b(
          'Keynote speaker as CDAR co-director',
          'CDAR联合主任、主题演讲嘉宾',
        ),
        source: {
          label: b('Official 2021 forum report', '2021论坛官方报道'),
          url: 'https://jinrong.swufe.edu.cn/info/1100/3386.htm',
        },
      },
    ],
    connection: b(
      'The 2019 photographs record Anderson delivering CDAR welcome remarks and joining forum discussions. He also participated as a CDAR co-director and keynote speaker in the 2021 SWUFE–CDAR forum, held alongside the fourth Chengdu 80.',
      '2019现场照片记录了他代表CDAR致辞、参与论坛讨论及与参会者交流。2021年，他再次以CDAR联合主任及主题演讲嘉宾身份，参与第四届成都八零同期举办的SWUFE–CDAR论坛。',
    ),
    photoIds: [
      'collab-2019-anderson-portrait',
      'collab-2019-anderson-forum',
      'collab-2019-anderson-exchange',
      'collab-2019-anderson-panel',
    ],
    sources: [
      {
        label: b('Berkeley profile', '伯克利大学主页'),
        url: 'https://econ.berkeley.edu/profile/robert-m-anderson',
      },
      {
        label: b('CDAR profile', 'CDAR人物介绍'),
        url: 'https://cdar.econ.berkeley.edu/people/robert-anderson.html',
      },
      {
        label: b('2021 forum report', '2021论坛报道'),
        url: 'https://jinrong.swufe.edu.cn/info/1100/3386.htm',
      },
    ],
  },
  {
    id: 'brady-haran',
    shortName: 'Brady Haran',
    name: b('Brady Haran', '布雷迪·哈兰'),
    affiliation: b(
      'Numberphile · Periodic Videos',
      'Numberphile · Periodic Videos',
    ),
    role: b(
      'Science communicator and independent filmmaker',
      '科学传播者、独立影片制作人',
    ),
    distinction: b('Creator of Numberphile', 'Numberphile创作者'),
    biography: b(
      'Haran brings mathematics, science and the people behind them to audiences through educational films. His projects include Numberphile, Periodic Videos, Sixty Symbols and Computerphile, connecting research with public curiosity.',
      '通过教育影像向公众讲述数学、科学及研究者的故事。他的项目包括Numberphile、Periodic Videos、Sixty Symbols及Computerphile，让研究与公众的好奇心相遇。',
    ),
    highlights: [
      b(
        '2024 Christopher Zeeman Medal for excellence in communicating mathematics, awarded by the LMS and IMA.',
        '2024年获LMS与IMA联合颁发的Christopher Zeeman数学传播奖章。',
      ),
      b(
        'Honorary Doctor of Letters, University of Nottingham, 2016.',
        '2016年获诺丁汉大学荣誉文学博士学位。',
      ),
    ],
    activities: [
      {
        year: 2019,
        event: b(
          'Jiaozi Innovation Forum · second session: “I love Numbers”',
          '交子创新讲坛·第二届主题：“I love Numbers”',
        ),
        format: b('Science-communication guest speaker', '科学传播讲座嘉宾'),
        source: {
          label: b('Official SWUFE talk page', '西财讲座官方页面'),
          url: 'https://fife.swufe.edu.cn/info/1311/2341.htm',
        },
      },
    ],
    connection: b(
      'Visited SWUFE in November 2019 to give “I love Numbers” at the Jiaozi Innovation Forum. SWUFE describes this lecture series as a lead-in to the International FinTech Forum; his contribution brought science communication into the wider exchange around Chengdu 80.',
      '2019年11月到访西财，在交子创新讲坛分享“I love Numbers”。该讲坛是国际金融科技论坛的前导活动，他将科学传播的视角带入了成都八零相关交流活动。',
    ),
    photoIds: [
      'collab-2019-haran-portrait',
      'collab-2019-haran-science',
      'collab-2019-haran-forum',
      'collab-2019-haran-audience',
    ],
    sources: [
      {
        label: b('Numberphile', 'Numberphile官方介绍'),
        url: 'https://www.numberphile.com/about',
      },
      {
        label: b('2024 Zeeman Medal', '2024数学传播奖章'),
        url: 'https://www.lms.ac.uk/news/brady-haran-2024-christopher-zeeman-medal',
      },
      {
        label: b('SWUFE talk', '西财讲座资料'),
        url: 'https://fife.swufe.edu.cn/info/1311/2341.htm',
      },
      {
        label: b('Jiaozi Innovation Forum', '交子创新讲坛'),
        url: 'https://fife.swufe.edu.cn/info/1311/2371.htm',
      },
    ],
  },
];
