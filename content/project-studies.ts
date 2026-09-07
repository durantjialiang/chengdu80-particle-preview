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
      b(
        'Personal issuance: combine profiles, financial information and historical transactions to suggest prices and quantities.',
        '个人发行：结合个人资料、财务信息与历史交易，辅助确定发行价格和数量。',
      ),
      b(
        'Investment matching: connect fundraising needs with investor preferences, with bidding and matching workflows.',
        '投资匹配：连接筹资需求与投资偏好，设计出价与撮合流程。',
      ),
      b(
        'Decision support: explore portfolio statistics, interactive charts and price, quantity and return scenarios.',
        '决策辅助：通过组合统计、交互图表及价格、数量与回报情景，帮助用户比较选择。',
      ),
    ],
    technical: b(
      'The prototype design combined AI-assisted recommendations, distributed-ledger payments, two-factor authentication and modular microservices. Credit analysis considered spending and repayment records; a risk assistant and interactive charts supported the investment workflow.',
      '原型设计结合AI辅助推荐、分布式账本支付、双因素认证与模块化微服务。信用分析考虑消费和还款记录，并以风险辅助工具及交互图表支持投资流程。',
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
      b(
        'Research discovery: use fuzzy search, suggestions and adjustable citation and recency weighting to refine results.',
        '研究发现：结合模糊检索、内容建议，以及可调整的引用和时效权重，逐步细化搜索结果。',
      ),
      b(
        'Connections made visible: map researchers, topics and related work to reveal potential collaborators.',
        '关联可视化：将学者、主题与相关研究组织成网络，帮助发现潜在合作对象。',
      ),
      b(
        'From discovery to collaboration: support sending, receiving and signing researcher agreements through a distributed-ledger contract workflow.',
        '从发现到合作：通过分布式账本合约流程，支持研究合作协议的发送、接收与签署。',
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
      b(
        'Understand a prediction: inspect the factors contributing to a model result rather than seeing only a forecast.',
        '理解一次预测：查看影响模型结果的因素，而不只是接收一个预测数字。',
      ),
      b(
        'Explore the evidence visually: combine interactive stock views with bar charts, beeswarm plots and partial-dependence views.',
        '可视化探索依据：把股票交互页面与条形图、蜂群图、部分依赖图结合，展示模型的解释结果。',
      ),
      b(
        'Connect model builders and users: publish analytical models and make them available through subscription workflows.',
        '连接开发者与使用者：设计分析模型发布与订阅流程，让投资者能够探索不同模型。',
      ),
    ],
    technical: b(
      'PIE combined surrogate models, LIME, partial-dependence plots and Shapley values. The architecture described a content-delivery network, multi-region failover and microservices, with distributed-ledger trust mechanisms. These describe the prototype design, not measured investment performance.',
      'PIE结合代理模型、LIME、部分依赖图与Shapley值。架构设计包括内容分发网络、多地区故障切换与微服务，并引入分布式账本信任机制。这些属于原型方案，不代表经过验证的投资收益。',
    ),
    evidenceUrl: `${publication}#page=48`,
    evidenceLabel: b(
      'Project description and original illustration · PDF p48 / printed p41',
      '作品说明与原始配图 · PDF第48页 / 书内第41页',
    ),
    illustrationStatus: 'permission-pending',
  },
  panda: {
    problem: b(
      'Enterprise risk signals are spread across financial and operating data. Panda sought to turn these signals into an assessment that users could explore, compare and monitor.',
      '企业风险信号分散在财务与经营数据中。Panda希望将这些信号转化为能够查看、比较和持续跟踪的风险评估。',
    ),
    users: b(
      'Regulators, company managers and investors examining enterprise risk.',
      '关注企业风险的监管者、企业管理者与投资者。',
    ),
    solution: b(
      'Panda brought data-quality management, model and algorithm management, and risk-model management into one prototype. Early warnings, visual indicators and risk-transition graphs connected the modelling process with the decisions users needed to make.',
      'Panda将数据质量管理、模型与算法管理、风险模型管理整合进同一个原型。风险预警、可视化指标与风险转移图，把建模过程连接到用户实际需要做出的判断。',
    ),
    features: [
      b(
        'Prepare the data: manage quality, handle missing values and engineer features from financial and operating variables.',
        '数据准备：管理数据质量、处理缺失值，并从财务和经营变量中构建模型特征。',
      ),
      b(
        'Compare models: combine multiple learning algorithms and configurable risk scenarios to support assessment.',
        '模型比较：组合多种学习算法，并支持可配置的风险场景，辅助企业风险评估。',
      ),
      b(
        'Make risk visible: use early warnings, risk-transition graphs and indicator views to track changes in a company.',
        '风险可视：以预警、风险转移图与指标视图，跟踪企业风险及经营表现的变化。',
      ),
    ],
    technical: b(
      'The team worked with 183 variables and used domain knowledge and KNN for missing-data processing. The described modelling approach included XGBoost, CatBoost, LightGBM and two MLP variants, combined through stacking and five-fold cross-validation. The interface used responsive Bootstrap layouts.',
      '团队围绕183个变量开展处理，使用领域知识与KNN处理缺失数据。建模方案包括XGBoost、CatBoost、LightGBM和两种MLP变体，结合Stacking与五折交叉验证；界面采用响应式Bootstrap布局。',
    ),
    evidenceUrl: `${publication}#page=60`,
    evidenceLabel: b(
      'Panda project profile · PDF pp60–61 / printed pp53–54',
      'Panda作品介绍 · PDF第60—61页 / 书内第53—54页',
    ),
    illustrationStatus: 'permission-pending',
  },
  giraffe: {
    problem: b(
      'Consumer-credit default modelling can require substantial specialist work. The challenge was to automate that process while keeping the resulting risk assessment understandable.',
      '消费信贷违约风险建模需要较多专业投入。本届挑战希望通过自动化降低建模负担，同时让风险评估结果保持可理解性。',
    ),
    users: b(
      'Financial institutions, credit-assessment agencies and enterprises working with credit-risk models.',
      '需要开展信贷风控建模的金融机构、信用评估机构与企业。',
    ),
    solution: b(
      'Giraffe approached automated credit-risk modelling as a visual, privacy-conscious workflow. By presenting data, models and results together, the prototype aimed to improve communication between front- and back-office teams.',
      'Giraffe将自动化信贷风控建模组织为重视隐私的可视化流程。通过同时呈现数据、模型与结果，原型尝试让前台业务与后台建模团队更顺畅地交流。',
    ),
    features: [
      b(
        'Automated modelling: address the workload of building models for consumer-credit default risk.',
        '自动化建模：围绕消费信贷违约风险，降低构建风控模型的工作负担。',
      ),
      b(
        'Multi-layer visualization: make data, model behaviour and output easier to inspect together.',
        '多层次可视化：从数据、模型到结果，提供能够相互参照的展示方式。',
      ),
      b(
        'Privacy and collaboration: consider information protection alongside communication between business and modelling teams.',
        '隐私与协作：在关注信息保护的同时，帮助业务端与建模端围绕结果展开沟通。',
      ),
    ],
    technical: b(
      'The published description establishes the emphasis on automation, privacy and visualization. It does not identify the algorithms, datasets or full system architecture.',
      '已公开的作品介绍明确了自动化、隐私与可视化方向，未披露具体算法、数据集或完整系统架构。',
    ),
    evidenceUrl: 'https://lab.swufe.edu.cn/info/1035/1020.htm',
    evidenceLabel: b(
      'SWUFE · Giraffe historical project review',
      '西南财经大学 · Giraffe作品回顾',
    ),
    illustrationStatus: 'not-established',
  },
  'apollo-2023': {
    problem: b(
      'Financial news moves quickly, and unreliable information complicates interpretation. The 2023 challenge explored real-time news analysis and its relationship to stock-market movements.',
      '金融新闻更新迅速，不可靠的信息也会干扰判断。2023赛题关注新闻的实时分析及其与股票市场变化之间的联系。',
    ),
    users: b(
      'People evaluating financial news and analysing its potential market relevance.',
      '需要评估金融新闻、理解其潜在市场关联的使用者。',
    ),
    solution: b(
      'HKU’s Apollo team built an 80-hour prototype combining fake-news detection with financial-news scoring. The team used backtesting on large amounts of data to examine its approach and received the Pioneer Award.',
      '香港大学Apollo团队在80小时内开发原型，将虚假新闻识别与金融新闻评分相结合，并以大量数据回测检验思路，获得领先者奖。',
    ),
    features: [
      b(
        'Identify unreliable news: develop a fake-news detection method for the financial-information setting.',
        '识别不可靠信息：在金融信息场景中开发虚假新闻识别方法。',
      ),
      b(
        'Score financial news: turn incoming reports into signals that can be examined and compared.',
        '金融新闻评分：对新闻开展评分，使信息能够被进一步分析与比较。',
      ),
      b(
        'Test the approach: use backtesting on large amounts of data to examine the proposed methods.',
        '回测检验思路：利用大量数据开展回测，检验团队提出的方法。',
      ),
    ],
    technical: b(
      'The HKU report describes detection, scoring and backtesting, without naming the models, data sources or scoring scale. Apollo is the team name; a separate product name is not published in the available report.',
      '港大报道介绍了识别、评分与回测工作，未明确模型名称、数据来源或评分尺度。Apollo为团队名称，现有报道没有给出独立产品专名。',
    ),
    evidenceUrl:
      'https://www.cs.hku.hk/news-events/news-and-announcements/20231106-chengdu80-pioneer-award-2023',
    evidenceLabel: b('HKU · Apollo team profile', '香港大学 · Apollo团队报道'),
    illustrationStatus: 'not-established',
  },
  'data-queens-report': {
    problem: b(
      'Intelligent driving changes the context of automotive insurance. The 2024 challenge asked teams to rethink insurance products for this setting.',
      '智能驾驶改变了汽车保险面对的场景。2024赛题要求团队重新思考这一背景下的保险产品。',
    ),
    users: b(
      'A hypothetical insurance company facing the challenges of autonomous vehicles—the scenario set out in the team’s account.',
      '面对自动驾驶汽车新问题的假设保险公司，这是团队报道中描述的开发场景。',
    ),
    solution: b(
      'Queen’s Data Queens team developed an insurance prototype for autonomous vehicles within 80 hours. Working from the needs of a hypothetical insurer, the team turned the challenge into a prototype and won the seventh edition’s Trailblazer Award. Data Queens is the team name; the separate product name is not established.',
      '女王大学Data Queens团队在80小时内开发了面向自动驾驶汽车的保险原型。从假设保险公司的需求出发，团队将赛题转化为原型，获得第七届开创者奖。Data Queens为团队名称，独立产品专名尚未明确。',
    ),
    features: [
      b(
        'A new insurance setting: work through the challenges autonomous vehicles present to a hypothetical insurer.',
        '新的保险场景：围绕自动驾驶汽车给假设保险公司带来的问题展开设计。',
      ),
      b(
        'From challenge to prototype: develop the proposal within the competition’s concentrated 80-hour window.',
        '从赛题到原型：在集中的80小时开发窗口内完成方案与原型。',
      ),
    ],
    technical: b(
      'The current record does not establish a complete technical architecture, public demo or repository. These fields remain open rather than being inferred from the challenge.',
      '当前记录尚未明确完整技术架构、公开演示或代码仓库，不根据赛题推测这些信息。',
    ),
    evidenceUrl:
      'https://www.cs.queensu.ca/news/2024/11/26/data-queens-brings-home-1st-place-trophy-from-the-fintech-hackathon-in-china/',
    evidenceLabel: b(
      'Queen’s · Data Queens team profile',
      '女王大学 · Data Queens团队报道',
    ),
    illustrationStatus: 'not-established',
    contextImageId: 'cd80-2024-04',
    contextNote: b(
      'Context: a computer collaboration scene in the 2024 report. The people and team are unidentified; it is not a Data Queens product screenshot or team portrait.',
      '背景影像：2024报道中的电脑协作场景。人物与具体团队未确认，不作为Data Queens产品截图或团队肖像。',
    ),
  },
};
