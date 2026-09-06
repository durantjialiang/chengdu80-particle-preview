# 成都八零：内容与页面升级交付

日期：2026-09-06（Asia/Shanghai）。分支：`codex/site-content-upgrade`。
起点：`b2c722ca1d3d7321caa0c887d4a7481957fcfaf0`。
发布 commit 以本文件所在 Git 提交及 GitHub/Vercel 部署记录为准；导出目录另存 release.json。

## 已完成

- 首页保留 Particle80，直接显示80小时定位、全称、2026月份状态与指南/作品入口；新增组织与价值、5张真实现场/团队照片、3个精选作品入口、历史开发机制、团队故事、FINTECH80x与孵化器、3条带日期消息。
- `/about/`：2018起的赛事使命、历史赛制、SWUFE与FIC背景、历届组织者人物、委员会与历届评委分区来源入口。人物标明当时职务，不冒充2026阵容，不生成肖像。
- `/partners/`：2019、2020、2021、2023、2024组织角色；突出成都交子2019独家出资赞助/交子公园行、2021 FINTECH80x首家合作金融企业、2023/2024联合主办。未查证年份不自行补齐。
- 产业联系明确展示恒生电子（英文品牌 Hundsun）、瑞士再保险和阿联酋中华工商总会的2024参与记录。FIC更广泛的平安、建行、中投、道富、瑞再、穆迪资源网络另列，不将嘉宾任职或平台资源改称赛事赞助。
- `/winners/`保留7条原档案，新增方向筛选；NuShadow、Dragon Search、Pisces、Data Queens四篇详细案例提供问题、用户、方案、功能、可展开技术记录及原始证据。未知产品名和未存在的Demo/GitHub按钮不补造。
- `/media/`：13张现有获准公开照片，年份/类型组合筛选、原图比例查看器、键盘翻页/关闭、原始报道和图片出处；专刊、历史规则、新闻使用原站资源链接，不重新打包完整专刊。
- 首页高校模块收束为6条精选概览；其他节点仍可选并调出卡片；完整内页保留18条记录。学校→作品、学校→年度档案链接保留。
- 新增页均为中英双语，具有静态构建路由、页面标题、描述及由已批准照片生成的分享图引用。About/Partners撤下Soon。

## 重要验收边界：尚非全部任务项完成

**“至少3个匹配真实产品配图的完整作品页”尚未通过。** 已完成4篇文字案例，但现有13张批准照片没有产品截图。

- NuShadow：专刊PDF第22页（印刷15页）的配图复用授权待确认。
- Dragon Search：PDF第38页（印刷31页）配图待授权；当前2019香港大学合影明确为年度背景影像，不认定具名项目成员或产品界面。
- Pisces：PDF第48页（印刷41页）配图待授权。
- Data Queens：产品专名/产品图/完整架构/公开演示未确认；当前2024电脑协作图明确不识别团队、不冒充产品图。

本轮未增加未授权媒体，也未把“公开可访问”当转载许可。现有批准范围及出处继续由 `content/archive-media-approved.json` 和 `docs/media-authorization.md` 管理。

## 来源与用途

| 来源 | 本轮用途与限定 |
| --- | --- |
| [成都交子2019报道](https://www.cdjzjk.com/news/show?articleId=2013070358905884672) | 发布2019-11-07；独家出资赞助第二届、联合主办、11月3日交子公园行。当前站点迁移创建时间不当作比赛日期。公开文章API核得正文，前台抓取不稳定。 |
| [2020西财金融学院报道](https://jinrong.swufe.edu.cn/info/1096/1490.htm) | 发布2020-11-02；SWUFE、CDAR、交子联合主办，FIC/成都市金融科技协会承办。 |
| [2021西财金融学院报道](https://jinrong.swufe.edu.cn/info/1100/3387.htm) | 发布2021-07-26；7月17日FINTECH80x启动、首家合作金融企业、马红林当时身份。启动年份不是2022。 |
| [2023西财金融学院报道](https://jinrong.swufe.edu.cn/info/1134/4353.htm) | 发布2023-11-06；第六届联合主办、五家校内协办单位、邹进当时身份。 |
| [2024西财新闻网正式报道](https://news.swufe.edu.cn/info/1003/109791.htm) | 发布2024-10-31，路演评选/颁奖为10月30日；联合主办、产业颁奖嘉宾、王永强当时身份、孵化器启动。20余家为启动事项参与单位，不是已孵化企业数。 |
| [旧官网FIC](https://cd80.swufe.edu.cn/FIC.htm) | 2019年5月成立背景、平台资源网络；页面未标发布日期，不推断现行名单。 |
| [旧委员会](https://cd80.swufe.edu.cn/Committee.html)、[历史规则](https://cd80.swufe.edu.cn/CHENGDU_80_RULES.htm)、[介绍](https://cd80.swufe.edu.cn/ABOUT.htm) | 历史介绍和角色入口，不当作2026规则。 |
| [五周年专刊](https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf) | 项目文字、PDF页码定位与历史评委来源入口；不公开重新分发整本或提取未授权插图。 |
| [恒生电子英文官网](https://en.hundsun.com/) | 核对英文品牌 Hundsun，避免误译为 Hang Seng。 |

四个案例原有校方新闻链接继续保留，Data Queens区分西财获奖学校报道与女王大学团队报道。项目原始数据、奖项翻译边界、2025未举办及2026仅确认10月口径未改。

## 文件与实现目的

| 文件 | 目的 |
| --- | --- |
| `content/ecosystem.ts` | 双语组织、年度合作、人物、产业联系、来源与集中待补数据 |
| `content/project-studies.ts` | 可复用作品方向与4篇有来源的案例说明 |
| `components/site/EcosystemContent.tsx`、`Editorial.module.css` | 首页内容节奏、About、Partners、Media；保持深色粒子背景下可读性 |
| `components/site/EditorialMedia.tsx`、`ArchiveGallery.tsx` | 复用批准图及现有查看器；弹窗放在图库布局之外，避免关闭按钮受网格样式污染 |
| `components/site/ArchivePages.tsx` | 方向筛选、案例详情、技术折叠及背景影像限定 |
| `qa/particle80-intro.tsx`、`components/Particle80Intro.tsx` | 现有Hero中注入可直接点击的定位/入口，挂载新内容，不改变动画物理 |
| `components/network/GlobalUniversityNetwork.tsx`、`hooks/use-university-network.ts` | 首页概览、完整目录保留，新出现卡片在挂载后滚入视野 |
| `content/navigation.ts`、`content/site-routes.json`、`qa/site.tsx`、`SiteChrome.tsx`、`Site.module.css` | 新路由与导航双语标签，较长英文导航适配 |
| `hooks/use-site-language.tsx`、`scripts/finalize-particle-preview.mjs` | 静态页和客户端语言切换后的标题/描述、分享元数据 |
| `qa/site-content.test.mjs`、`qa/particle-story.test.mjs` | 来源/图片/案例契约、保持单个高校模块；计数正则兼容格式化换行 |
| `scripts/export-editorial-review.mjs` | 从同一数据导出来源CSV、素材CSV、JSON与学校待补单，不导出研究原图 |

粒子组件、物理/光学配置、Globe实现、大学/年度/项目原始事实数据、13张授权清单及媒体文件、依赖和锁文件相对起点未改变。没有添加新大型依赖。

## 实际验收

环境：macOS，Node v25.9.0，npm 11.12.1，Codex内置浏览器，2026-09-06。

| 检查 | 实际结果 |
| --- | --- |
| 类型/静态规则/测试/构建 | `npm run typecheck`、`npm run lint`、`npm test`（50/50）、`npm run build`通过 |
| 公开UI保护 | 8个JS块均无公开调参面板及状态文字 |
| 媒体/私有文件保护 | 87构建文件、22档案/内容路由、13批准照片/26衍生文件；核对13原图hash，无私有图、路径或研究URL泄漏 |
| 桌面1440×900 | 首页定位、指南/作品入口可见；About、Partners、作品、媒体页无横向溢出；真实WebGL地球加载 |
| 手机390×844、360×800 | 首页CTA分别位于屏内（bottom 816、772）；无横向溢出；360宽手机菜单可进入合作页，390宽照片弹窗宽374px，关闭按钮44px |
| 图库 | 年份2024得5图，叠加“高校团队”得0图，清除得13图；上一张、Escape关闭、焦点返回触发图均实测 |
| 作品 | 方向“可解释AI”得1条Pisces且更新URL；中英切换保留案例、更新标题；4篇详情均实开 |
| 高校 | 首页6条，点击非精选UESTC节点后7条并可打开详情；完整内页18条；HKU详情→本站Dragon Search实际跳转成功 |
| 历史 | 2024年度页实际打开、奖项及照片仍在；其余年度由静态路由/SSR和数据契约检查覆盖 |
| 减少动态/回退 | 本地DEV的 `motion=reduced&renderer=svg` 强制模式：完整文字、CTA、静态80与SVG地球；键盘可选高校。未切换操作系统设置，也未在真实无WebGL硬件测试 |
| 控制台 | 生产预览实际操作未见新增error；已有 `THREE.Clock` 弃用warning仍在。增加hook时本地热更新曾出现hook顺序错误，完整刷新后消失；发布构建重新加载无此错误 |
| 构建warning | 现有Globe约910KB块仍触发500KB体积提醒；未声称完成性能优化或FPS基准 |

没有实测真实iPhone/Android硬件、Safari/Firefox、正式报名提交、第三方AI浏览环境、所有外站在所有网络的连通性；未制作视频录屏。不用构建通过冒充这些验收。

## 运行与导出

在此仓库目录执行：

```sh
npm ci
npm run build
npm exec vite -- preview --config qa/particle80.vite.config.ts --mode public-preview --host 127.0.0.1 --port 4184 --strictPort
```

打开 `http://127.0.0.1:4184/?lang=zh`。这是现有Vite静态MPA预览，不需要服务端账户或.env；不改变框架来凑合打包。

```sh
node scripts/export-editorial-review.mjs /absolute/path/to/review-export
```

导出 `sources.csv`、`materials.csv`、`source-and-material-map.json`、`school-requests.md`。本轮另在工作区外层 `exports/site-content-upgrade-2026-09-06/` 保存实测截图及发布记录。

学校待补集中于媒体页 `#requests` 与导出的清单：当届赛事、国际参与、人物、产业/孵化、作品与媒体、持续运营。当前不放无目标报名按钮，不编造联系人、倒计时、孵化/就业承诺。
