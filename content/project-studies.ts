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
  technicalSteps: readonly { title: Localized; description: Localized }[];
  /** Design interpretation is visibly distinguished from a documented implementation. */
  technicalInterpretation?: boolean;
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
      'NuShadow connects personal financial information with pricing, matching and portfolio tools. The design brings both sides of a personal IPO into a shared analytical workflow.',
      'NuShadow把个人财务信息与定价、撮合、组合管理连接起来，让筹资者和投资者围绕同一套分析流程完成个人IPO的探索。',
    ),
    technicalSteps: [
      {
        title: b('Build the information foundation', '建立双边信息基础'),
        description: b(
          'Fundraisers provide personal and financial information and a target share price. Investor portfolios and objectives describe the other side of the market. Spending and repayment records inform the credit analysis, while interactive charts make the inputs easier to explore.',
          '筹资者提供个人资料、财务状况与目标股价；投资者侧呈现已有组合和投资目标。消费与还款记录参与信用分析，交互图表帮助双方理解输入信息，为后续定价和匹配建立基础。',
        ),
      },
      {
        title: b(
          'Connect reference pricing and matching',
          '连接参考定价与交易匹配',
        ),
        description: b(
          'The described pricing process uses historical transactions and AI-assisted analysis to suggest prices and quantities. Bid prices, quantities and supply-and-demand relationships then support matching. These outputs are decision references rather than guaranteed returns.',
          '定价流程参考历史交易，并结合AI辅助分析，形成价格与发行数量建议。双方提交的意愿价格、数量和供需关系进一步支持匹配，使分析结果进入交易决策；这些结果是参考信息，并非收益承诺。',
        ),
      },
      {
        title: b(
          'Bring the workflow into a modular platform',
          '形成模块化产品流程',
        ),
        description: b(
          'Portfolio statistics and a risk assistant extend the experience beyond issuance. The publication describes modular microservices, distributed-ledger payments and two-factor authentication: distinct concerns that connect analysis, transaction records and account access within the prototype design.',
          '发行之外，组合统计与风险助手继续支持用户管理投资。专刊中的模块化微服务、分布式账本支付和双因素认证，分别对应服务组织、交易记录与账户访问，让分析能力与产品流程相衔接。',
        ),
      },
    ],
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
      'Dragon Search combines research retrieval, semantic analysis and collaboration workflows. Its technical design turns a search result into a starting point for discovering people, topics and potential research relationships.',
      'Dragon Search将文献检索、语义分析与合作流程结合起来，让一次搜索不止于返回结果，还能继续发现相关学者、研究主题与合作联系。',
    ),
    technicalSteps: [
      {
        title: b('Refine a query through feedback', '通过反馈逐步细化检索'),
        description: b(
          'Fuzzy search and content suggestions help users begin with an incomplete question. Citation and recency weighting allow the scoring to be adjusted; the search–results–feedback cycle then narrows the exploration toward more relevant work.',
          '模糊搜索与内容建议帮助用户从尚不完整的问题出发。引用与时效权重支持调整结果评分，再通过“搜索—结果—反馈”的循环逐步缩小范围，使探索更贴近实际研究需求。',
        ),
      },
      {
        title: b(
          'Connect researchers and research topics',
          '连接学者与研究主题',
        ),
        description: b(
          'The publication describes PCA for researcher ranking, TF-IDF for topic keywords and Word2Vec for related-word and topic recommendations. Spark and MongoDB support the data-processing design; network visualization brings these relationships into an exploratory interface.',
          '专刊以PCA支持学者排序、TF-IDF提取主题关键词、Word2Vec生成相关词和主题推荐，并使用Spark与MongoDB组织数据处理。网络可视化将这些关联呈现在界面中，帮助用户沿着学者与主题继续探索。',
        ),
      },
      {
        title: b('Extend discovery into collaboration', '让研究发现延伸到合作'),
        description: b(
          'Hyperledger-based agreement workflows support sending, receiving and signing researcher contracts. Alongside a dual-web-server load-balancing design, this extends the prototype from information retrieval toward managing a potential research collaboration.',
          '基于Hyperledger的协议流程支持研究合作合约的发送、接收与签署，双Web服务器负载均衡则服务于系统组织。由此，原型把信息发现与后续合作流程连接起来，而不只是一个文献检索页面。',
        ),
      },
    ],
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
      'Pisces places an explanation layer between a predictive model and its user. The Pisces Explanation Engine (PIE) connects the forecast, the factors behind it and an interface for exploring those factors.',
      'Pisces在预测模型与使用者之间加入解释层。Pisces Explanation Engine（PIE）将预测结果、影响因素与交互界面连接起来，让投资者进一步理解模型为何给出这样的判断。',
    ),
    technicalSteps: [
      {
        title: b('Explain model behaviour', '解释模型的判断过程'),
        description: b(
          'Surrogate models approximate complex predictions with a more interpretable model. LIME examines local behaviour by perturbing an input; partial-dependence plots examine how selected features relate to predictions, while Shapley values describe feature contributions.',
          '代理模型以更易解释的形式近似复杂预测；LIME通过扰动输入观察局部行为，部分依赖图展示特定特征与预测的关系，Shapley值用于描述特征贡献。多种解释方式共同支持对模型行为的理解。',
        ),
      },
      {
        title: b(
          'Translate explanations into visual exploration',
          '把解释结果变成可探索的图表',
        ),
        description: b(
          'Interactive stock pages offer bar charts, beeswarm plots and partial-dependence views. Users can move beyond a single prediction number to inspect the factors involved and the patterns shown by the model, choosing the representation they find most useful.',
          '股票页面提供条形图、蜂群图与部分依赖视图。用户不必只面对一个预测数字，而能查看相关因素及模型呈现的变化关系，并选择更便于自己理解的图表形式。',
        ),
      },
      {
        title: b(
          'Connect models, services and subscriptions',
          '连接模型服务与订阅市场',
        ),
        description: b(
          'The prototype links model publishing and subscription with investor-facing analysis. Its architecture describes microservices, CDN delivery and multi-region failover, alongside distributed-ledger trust mechanisms. These are system-design choices, not evidence of investment returns.',
          '原型将开发者的模型发布与订阅流程连接到投资者的分析界面。架构采用微服务、CDN分发与多地区故障切换，并引入分布式账本信任机制。这些构成平台设计，不代表模型收益已经得到验证。',
        ),
      },
    ],
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
      'Panda follows a path from data preparation to ensemble modelling and risk visualization. Data-quality, model-and-algorithm and risk-model modules connect the analytical process with an interface for monitoring enterprise risk.',
      'Panda围绕“数据准备—集成建模—风险呈现”组织技术路径，通过数据质量、模型算法和风险模型三个模块，把后台分析连接到企业风险监测界面。',
    ),
    technicalSteps: [
      {
        title: b(
          'Prepare variables and compare feature sets',
          '处理变量并比较特征方案',
        ),
        description: b(
          'The team first examined the distributions and missingness of 183 variables. Domain knowledge and KNN informed imputation and transformation. Alternative feature sets combined different filtering choices with engineered operating indicators for comparison.',
          '团队先检查183个变量的分布与缺失情况，结合领域知识和KNN进行填补与转换；再比较不同筛选方式和人工构建经营指标形成的特征组合，让后续建模建立在经过处理的数据之上。',
        ),
      },
      {
        title: b('Combine complementary learning models', '组合不同学习模型'),
        description: b(
          'XGBoost, CatBoost, LightGBM and two MLP variants modelled risk probabilities. Stacking combined model outputs, with five-fold cross-validation used in the ensemble process. The design considered both feature importance and the usefulness of the resulting risk assessment.',
          '风险概率由XGBoost、CatBoost、LightGBM及两种MLP变体建模，再通过Stacking组合模型输出，并在集成过程中使用五折交叉验证。方案同时关注特征重要性与风险结果的可用性。',
        ),
      },
      {
        title: b('Make risk changes usable', '让风险变化能够被理解和跟踪'),
        description: b(
          'Early warnings, indicator views and risk-transition graphs turn analysis into a monitoring workflow. Configurable scenarios serve different users, while responsive Bootstrap layouts support access across devices. The focus is linking a risk assessment to continued observation and analysis.',
          '风险预警、指标视图和风险转移图将分析结果转化为监测流程，可配置场景适配不同使用者，响应式Bootstrap布局支持跨设备访问。技术方案的重点是让风险评估能够被持续查看、跟踪和分析。',
        ),
      },
    ],
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
      'Giraffe can be read as a workflow linking data preparation, automated risk modelling and visual review. Its published emphasis on privacy and data–model–result visualization suggests treating model development as a process that business and technical teams can examine together.',
      '从作品亮点来看，Giraffe可以理解为连接数据准备、自动化风控建模与可视化审阅的工作流程。隐私保护和“数据—模型—结果”的多层展示，让业务与技术团队能够围绕同一过程展开讨论。',
    ),
    technicalInterpretation: true,
    technicalSteps: [
      {
        title: b('Create a clear modelling input', '整理清晰的建模输入'),
        description: b(
          'One design approach is to organize credit-related fields, missing values and data quality before modelling, while limiting access to sensitive information. Data visualization could help business users see the inputs and identify issues that need review.',
          '一种设计思路是先整理信贷相关字段、缺失情况与数据质量，并对敏感信息的访问作区分。配合数据可视化，业务人员能够理解模型将使用什么信息，以及哪些问题需要进一步核查。',
        ),
      },
      {
        title: b(
          'Make modelling a reviewable workflow',
          '让自动化建模成为可审阅流程',
        ),
        description: b(
          'An automated workflow could bring model configuration, training and evaluation into a consistent sequence. Comparable result views would help users examine alternative settings without requiring the business team to read implementation code.',
          '自动化流程可以把模型配置、训练与评估组织为连续步骤，再以统一视图比较不同方案。这样既能减少重复操作，也能让业务团队在不阅读实现代码的情况下参与结果讨论。',
        ),
      },
      {
        title: b(
          'Connect privacy and visual collaboration',
          '结合隐私与可视化协作',
        ),
        description: b(
          'A layered interface could separate sensitive records from model summaries and assessment results. Business users could review the conclusions, while modelling teams inspect the data and model views, supporting a more focused front-to-back-office conversation.',
          '界面可区分敏感记录、模型摘要与风险结果的呈现层次：业务端关注结论，建模端查看数据与模型视图。围绕共同可见的结果展开沟通，是将隐私意识与跨团队协作结合的一种方式。',
        ),
      },
    ],
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
      'The HKU Apollo team’s documented work links fake-news detection, financial-news scoring and backtesting. Read as a design pathway, these form three connected questions: is the information credible, what signal does it provide, and how does that signal behave when tested?',
      '香港大学Apollo团队已介绍的工作包括虚假新闻识别、金融新闻评分与数据回测。沿着这三项亮点，可以将方案理解为三个相互衔接的问题：信息是否可信、它提供了什么信号，以及信号在检验中如何表现。',
    ),
    technicalInterpretation: true,
    technicalSteps: [
      {
        title: b(
          'Organize the news and assess credibility',
          '整理新闻并评估可信度',
        ),
        description: b(
          'A practical design could start by organizing article text, timestamps and related entities, then applying a credibility assessment. Keeping the assessment alongside the original item would allow users to distinguish the news itself from the system’s judgement.',
          '在设计层面，可先整理新闻正文、发布时间和相关对象，再开展可信度评估。将判断结果与原始新闻并列保留，便于使用者区分“新闻说了什么”与“系统如何判断这条信息”。',
        ),
      },
      {
        title: b(
          'Turn analysis into comparable signals',
          '把分析结果转化为可比较信号',
        ),
        description: b(
          'The scoring stage could turn analysis into a consistent representation for comparing news items. Showing an explanation with each score, and allowing uncertain items to remain flagged, would make the signal easier to inspect rather than treating a number as a complete answer.',
          '评分环节可把分析结果转化为统一形式，支持新闻之间的比较。分数旁同时呈现解释，并保留不确定信息的标记，能让使用者审阅信号的含义，而不是把一个数字当作完整结论。',
        ),
      },
      {
        title: b(
          'Examine signals through time-aware backtesting',
          '通过时间顺序回测检验信号',
        ),
        description: b(
          'A sound evaluation design would replay news in publication order and compare the resulting signals with later observations. Keeping future information out of each decision point and reviewing failures separately would help distinguish a promising idea from an overstated result.',
          '合理的评估设计可按发布时间回放新闻，将当时生成的信号与后续观察相比较。每个判断时点应排除未来信息，并单独复盘失效案例，帮助辨别方案的适用范围，而非只展示表现较好的结果。',
        ),
      },
    ],
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
      'The confirmed prototype addresses autonomous-vehicle insurance for a hypothetical insurer. A useful design interpretation is to connect driving scenarios, insurance-service decisions and a demonstrable user journey, rather than treating the challenge as only a pricing model.',
      '已确认的原型围绕假设保险公司的自动驾驶汽车保险需求展开。就方案设计而言，可以把驾驶场景、保险服务决策与可演示的用户流程连接起来，而不只把赛题理解为一个定价模型。',
    ),
    technicalInterpretation: true,
    technicalSteps: [
      {
        title: b(
          'Define the scenario and its assumptions',
          '明确场景与分析假设',
        ),
        description: b(
          'A prototype could begin by defining the vehicle-use scenario, the insurer’s decision and the information available at that point. Making assumptions explicit would help distinguish an exploratory insurance concept from an assessment based on validated operating data.',
          '原型设计可先界定车辆使用场景、保险公司需要作出的决策，以及当时可获得的信息。明确这些假设，能够区分探索性的保险构想与基于真实运营数据完成的评估。',
        ),
      },
      {
        title: b(
          'Connect information with service decisions',
          '把信息连接到保险服务决策',
        ),
        description: b(
          'A service flow could show how submitted information informs a proposed assessment or service response, with the reasons visible to the user. Alternative scenarios could then be compared using the same presentation, making the concept easier to discuss and refine.',
          '服务流程可展示用户提交的信息如何支持评估或服务响应，并说明相应理由。不同场景采用一致的呈现方式进行比较，有助于把抽象的保险构想转化为能够讨论和迭代的方案。',
        ),
      },
      {
        title: b(
          'Demonstrate and test the complete journey',
          '演示并检验完整使用流程',
        ),
        description: b(
          'For an 80-hour prototype, a bounded journey from input to explanation would make the concept tangible. Scenario walkthroughs could test whether the flow is understandable and whether exception cases need revision, without implying actuarial validation or a deployed insurance product.',
          '在80小时原型阶段，可以用一条从信息输入到结果解释的完整路径呈现构想，再通过场景走查检验流程是否清晰、异常情况是否需要调整。这类演示不等同于精算验证或已经上线的保险产品。',
        ),
      },
    ],
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
