# 历届获奖作品完善 · 2026-09-07

## 本轮范围

在原有网站中补全七个年度的已建档作品，中英双语共用数据；保留粒子、地球、历史路线、筛选、图片授权机制及 2025/2026 口径。新增年度作品展示组件与奖项高校校徽列表，不重新设计网站，不新增动画或依赖。

- 历届列表：年份、赛题、校徽、奖项、作品摘要、年度作品深链。
- 年度详情：学校与作品身份、方案、问题、用户、分项亮点、可展开技术方案、完整项目入口，以及分组获奖学校。
- 项目详情：复用同一份案例数据，不复制互相漂移的介绍。
- 原有时间精度与冲突说明完整保留在年度“资料来源与说明”，不再用审计文字充当列表主内容。

## 五周年专刊核验

用户提供文件：`chengdoubalingwuzhounianzhuankan.pdf`，72 个物理页。

SHA-256：`e43398043604eeb4be0bb19bdb61b110620cd618d3bd7028b0fa13617ff7b218`

官方原始入口：<https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf>

| 年份 | 详细作品 | 作品 PDF 页 / 书内页 | 年度结果 PDF 页 / 书内页 |
| --- | --- | --- | --- |
| 2018 | NUS · NuShadow | 22 / 15 | 20 / 13 |
| 2019 | HKU · Dragon Search | 38 / 31 | 36 / 29 |
| 2020 | NUS · Pisces | 48 / 41 | 46 / 39 |
| 2021 | Tsinghua · Panda | 60–61 / 53–54 | 56 / 49 |

文本提取与对应页面图像交叉检查；正文结果与末尾 PDF 68–69 页汇总表交叉核对。代码 sourcePage 指年度正文结果页，不是末尾汇总表。

每年八所获奖高校的三组结果，按原文顺序：

- 2018：NUS；HKU、Berkeley；Georgia Tech、Peking、SWUFE、SUSTech、Tsinghua。
- 2019：HKU；Berkeley、NUS；Peking、SWUFE、Tsinghua、Toronto、SJTU。
- 2020：NUS；Zurich、SWUFE；Tsinghua、UESTC、SUSTech、HKU、Chongqing。
- 2021：Tsinghua；SWUFE、Zurich；NUS、HKU、UESTC、Chongqing、Tel Aviv。

专刊双语表中的三组名称为 Trailblazer / 开创者、Pioneer / 领先者、Innovator / 创新者。2019 同时保留旧官网年度详情和决赛回顾作为辅助来源。

作品介绍采用编辑性归纳，不照抄整页。NuShadow 的无限扩容、安全、性能倍数等宣传性表述未作为本站保证；Pisces 未添加收益承诺；Panda 的来源异常术语未擅自展开。未从照片认人、猜学校或推断其他作品。

## 2022—2024 延续资料

- 2022 Giraffe：西财历史作品回顾 <https://lab.swufe.edu.cn/info/1035/1020.htm>；第五届回顾 <https://cd80.swufe.edu.cn/info/1081/1831.htm>。补充自动化信贷违约风控、隐私、多层可视化与业务/建模协作；未新增未公开算法。
- 2022 结果：Tsinghua 为开创者；SWUFE、SUSTech 为原文 Leader Award；UESTC、HKU、ETH、Queen’s 为 Innovator。英文回顾对最高奖称呼存在 Pioneer/Trailblazer 混用，不套用为跨年度统一名次。emlyon 仅确认参赛，不列入获奖组。
- 2023 Apollo：香港大学 <https://www.cs.hku.hk/news-events/news-and-announcements/20231106-chengdu80-pioneer-award-2023>；年度回顾 <https://cd80.swufe.edu.cn/info/1081/1821.htm>。补充虚假新闻识别、金融新闻评分和数据回测。Apollo 是团队名，不是确认的产品专名。
- 2023 年度回顾未建立全部学校与奖项的映射。本轮仅展示已有独立校方证据的 HKU Pioneer 结果，不反推其余学校的奖项。NUS 的名次报道应另行按其措辞整理，不能自动变成同名奖项。
- 2024 Data Queens：西财正式报道 <https://news.swufe.edu.cn/info/1003/109791.htm>；女王大学团队报道 <https://www.cs.queensu.ca/news/2024/11/26/data-queens-brings-home-1st-place-trophy-from-the-fintech-hackathon-in-china/>。按学校、奖项、保险赛题和发表背景交叉关联，保留已有日期边界；Data Queens 是团队名。仅补假设保险公司与自动驾驶保险原型场景，不补造保险功能或技术架构。

## 仍待补齐

- 其他获奖团队的产品名、作品说明、功能演示或技术材料。奖项名单不等于作品清单；本轮仅对七个已建档项目做详细介绍。
- 2022 完整算法/系统材料；2023、2024 独立产品专名及技术详情。
- 2023 全部获奖高校与奖项对应关系的一手材料。
- 作品原始界面图的可用文件及新版官网公开复用授权。本轮未把普通现场照充当产品图。

## 公开内容与素材

仅复用原有高校校徽和已批准媒体。未复制或上传整份专刊，未新增 PDF 截图资产、个人资料或未授权图片；官方专刊以原始出处链接提供。内部核验说明不作为网页主体文案。

## 实际验收

- `npm run typecheck`、`npm run lint`：通过。
- `npm test`：57 项通过，包括全部七个项目中英 SSR、年度/作品深链、学校 ID、来源页码、唯一 DOM ID、日期边界及现有粒子/地球回归。
- `npm run build`：通过，静态路由输出到既有 `out/particle-preview`。存在原有 Globe 大分包提示，非构建错误。
- `git diff --check`：通过。
- 本地年度页面 HTTP 200；移动布局通过响应式 CSS 与结构检查（42rem 单列、文本换行、键盘焦点、图片预留宽高）。
- 未进行本轮真实浏览器点击、分辨率截图或视觉录屏；SSR/物理回归不能替代浏览器交互和帧率测量。

本轮基于 `codex/site-content-upgrade` 的 `6ae1951`，实际发布提交以 Git 历史和 Vercel 部署 SHA 为准。
