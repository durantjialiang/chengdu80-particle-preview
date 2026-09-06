import { bilingual as b, type Localized } from './competition';

export const projectDirections = {
  funding: b('Funding & markets', '融资与市场'),
  research: b('Research discovery', '研究发现'),
  explainability: b('Explainable AI', '可解释AI'),
  risk: b('Risk management', '风险管理'),
  information: b('Financial information', '金融信息'),
  insurance: b('Insurance innovation', '保险创新'),
};
export const projectDirectionById: Record<
  string,
  keyof typeof projectDirections
> = {
  nushadow: 'funding',
  'dragon-search': 'research',
  pisces: 'explainability',
  panda: 'risk',
  giraffe: 'risk',
  'apollo-2023': 'information',
  'data-queens-report': 'insurance',
};
export type ProjectStudy = {
  problem: Localized;
  users: Localized;
  solution: Localized;
  features: Localized[];
  technical: Localized;
  evidenceUrl: string;
  evidenceLabel: Localized;
  contextImageId?: string;
  contextNote?: Localized;
  illustrationStatus: 'permission-pending' | 'not-established';
};
const publication =
  'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf';
/** Editorial summaries of historical prototypes, not endorsements or live products. */
export const projectStudies: Record<string, ProjectStudy> = {
  nushadow: {
    problem: b(
      'The project explored an alternative to slow, restrictive personal borrowing: could individual fundraising connect people with investors through a personal IPO?',
      '作品探索个人融资的另一种路径：当传统借款手续繁复、获取资金不易时，能否通过个人IPO连接筹资者与投资者？',
    ),
    users: b(
      'Individuals seeking funding, and investors considering personal fundraising opportunities.',
      '需要资金的个人筹资者，以及考虑个人融资机会的投资者。',
    ),
    solution: b(
      'NuShadow combined a personal fundraising marketplace with analysis and recommendations. Personal and financial information, target prices and transaction history informed suggested issuance prices and quantities.',
      'NuShadow把个人筹资市场与分析推荐结合起来。平台综合个人和财务信息、目标价格与交易历史，辅助建议发行价格及数量。',
    ),
    features: [
      b('Analytics and interactive visualizations', '数据分析与交互图表'),
      b('Funding and investment recommendations', '筹资与投资推荐'),
      b('Portfolio statistics and risk assistance', '投资组合统计与风险辅助'),
    ],
    technical: b(
      'The anniversary record describes AI-assisted recommendations, distributed-ledger payments, two-factor authentication and a microservice architecture. These are the historical prototype’s described design, not a current service guarantee.',
      '专刊描述了AI辅助推荐、分布式账本支付、双因素认证与微服务架构。这些是历史原型的设计记录，不代表当前在线服务承诺。',
    ),
    evidenceUrl: `${publication}#page=22`,
    evidenceLabel: b(
      'Project description and original illustration · PDF p22 / printed p15',
      '作品说明与原始配图 · PDF第22页 / 书内第15页',
    ),
    illustrationStatus: 'permission-pending',
  },
  'dragon-search': {
    problem: b(
      'Smaller companies may lack the connections and resources to find relevant academic work. Financial research needs a path from scattered publications to useful relationships and ideas.',
      '中小企业可能缺少接触学术研究的渠道与资源。分散的金融研究文献，需要变成能够发现、理解并建立联系的信息。',
    ),
    users: b(
      'Companies looking for research expertise, and researchers in finance.',
      '寻找研究资源的企业，以及金融领域的研究者。',
    ),
    solution: b(
      'Dragon Search organized research discovery as an iterative search, results, feedback and refinement process. Search suggestions and adjustable scoring helped users explore researchers and related work.',
      'Dragon Search把研究发现组织为“搜索—结果—反馈—细化”的循环。搜索建议与可调整评分，帮助用户探索学者及其相关研究。',
    ),
    features: [
      b('Fuzzy search and content suggestions', '模糊搜索与内容建议'),
      b('Researcher ranking and topic discovery', '学者排序与主题发现'),
      b(
        'Network visualization and research connections',
        '网络可视化与研究关联',
      ),
    ],
    technical: b(
      'The publication describes PCA ranking, TF-IDF topic extraction, Word2Vec recommendations, Spark and MongoDB, and Hyperledger-based contract workflows.',
      '专刊提及PCA排序、TF-IDF主题提取、Word2Vec推荐、Spark与MongoDB，以及基于Hyperledger的合约流程。',
    ),
    evidenceUrl: `${publication}#page=38`,
    evidenceLabel: b(
      'Project description and original illustration · PDF p38 / printed p31',
      '作品说明与原始配图 · PDF第38页 / 书内第31页',
    ),
    illustrationStatus: 'permission-pending',
    contextImageId: 'cd80-2019-05',
    contextNote: b(
      'Context: HKU’s 2019 team photograph from the annual page. The source does not identify this as a Dragon Search product image or a named project-team portrait.',
      '背景影像：年度页面中的2019香港大学团队合影。来源没有把它标为Dragon Search产品图或具名项目成员肖像。',
    ),
  },
  pisces: {
    problem: b(
      'A prediction is hard to trust when its reasoning is hidden. Pisces explored how investors could understand what a machine-learning model was using and why it produced a result.',
      '当预测背后的依据不可见，理解模型与风险就更困难。Pisces探索如何让投资者看懂机器学习模型使用了什么信息、为何产生某个结果。',
    ),
    users: b(
      'Investors seeking interpretable model outputs, and developers making analytical models available to others.',
      '希望理解模型输出的投资者，以及希望向他人提供分析模型的开发者。',
    ),
    solution: b(
      'The Pisces Explanation Engine (PIE) added explanations and visualizations around model predictions. The prototype also described a subscription model marketplace and blockchain-based trust mechanisms.',
      'Pisces Explanation Engine（PIE）围绕模型预测提供解释与可视化。原型还设计了订阅式模型市场及区块链信任机制。',
    ),
    features: [
      b('Interactive stock and prediction views', '股票与预测的交互页面'),
      b(
        'Visual explanations of model contributions',
        '模型影响因素的可视化解释',
      ),
      b('Model deployment and subscription workflows', '模型部署与订阅流程'),
    ],
    technical: b(
      'The record describes surrogate models, LIME, partial-dependence plots and Shapley values, with bar and beeswarm visualizations. No investment-performance claim is inferred.',
      '专刊记录了代理模型、LIME、部分依赖图与Shapley值，以及条形图和蜂群图等呈现方式。不据此推断投资收益或有效性。',
    ),
    evidenceUrl: `${publication}#page=48`,
    evidenceLabel: b(
      'Project description and original illustration · PDF p48 / printed p41',
      '作品说明与原始配图 · PDF第48页 / 书内第41页',
    ),
    illustrationStatus: 'permission-pending',
  },
  'data-queens-report': {
    problem: b(
      'Intelligent driving changes the context of automotive insurance. The 2024 challenge asked teams to rethink insurance products for this setting.',
      '智能驾驶改变了汽车保险面对的场景。2024赛题要求团队重新思考这一背景下的保险产品。',
    ),
    users: b(
      'The automotive-insurance setting was confirmed by the challenge. More specific customer segments are not established in this record.',
      '赛题明确面向汽车保险场景；更具体的客户划分尚未在本档案中得到确认。',
    ),
    solution: b(
      'Queen’s Data Queens team developed an autonomous-vehicle insurance prototype within the 80-hour challenge. The university report identifies the team; SWUFE’s official report confirms the highest award. A separate product name has not been established.',
      '女王大学Data Queens团队在80小时挑战中开发了自动驾驶汽车保险原型。校方报道提供团队名称，西财正式报道核实最高奖项；独立产品专名尚未确认。',
    ),
    features: [
      b(
        'An insurance prototype for autonomous vehicles',
        '面向自动驾驶汽车的保险原型',
      ),
      b('An 80-hour product development challenge', '80小时产品开发挑战'),
      b('A documented seventh-edition award', '有据可查的第七届获奖记录'),
    ],
    technical: b(
      'The current record does not establish a complete technical architecture, public demo or repository. These fields remain open rather than being inferred from the challenge.',
      '当前记录尚未明确完整技术架构、公开演示或代码仓库，不根据赛题推测这些信息。',
    ),
    evidenceUrl: 'https://news.swufe.edu.cn/info/1003/109791.htm',
    evidenceLabel: b('Seventh-edition original report', '第七届原始报道'),
    illustrationStatus: 'not-established',
    contextImageId: 'cd80-2024-04',
    contextNote: b(
      'Context: a computer collaboration scene in the 2024 report. The people and team are unidentified; it is not a Data Queens product screenshot or team portrait.',
      '背景影像：2024报道中的电脑协作场景。人物与具体团队未确认，不作为Data Queens产品截图或团队肖像。',
    ),
  },
};
