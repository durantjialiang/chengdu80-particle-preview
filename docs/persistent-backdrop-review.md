# CHENGDU 80 — 全页持续粒子背景

日期：2026-09-06。分支：`codex/site-completion`。
修改前基线：`20b1f0545362892b448f17d18cff3e6022d3e1a9`，当时 GitHub main、开发分支均对应这个 commit。没有回退或覆盖其他未提交修改。当前版本以包含本报告的 Git commit 为准。

## 实际入口与职责

这是现有 Vite + React + TypeScript 多页面静态预览工程，不是新建 Next.js 工程。
首页入口是 `qa/particle80-intro.tsx`；内容页是 `qa/site.tsx`；独立网络页是 `qa/global-network.tsx`。保留原构建、路由和 Vercel 项目。

```
body
├─ #root                         relative / z-index: 1
│  ├─ Intro identity + introduction
│  ├─ GlobalUniversityNetwork    保留自身 WebGL Canvas 和离屏策略
│  ├─ preview controls
│  └─ SiteFooter
└─ PersistentParticleBackdrop    portal / fixed inset: 0 / z-index: 0
   └─ Particle80                 一个品牌 Canvas / pointer-events: none
```

Intro 保留开场编排和首屏测量；portal 组件拥有渲染器。没有让所有内容进入超长 sticky，没有超高 Canvas，没有负 z-index、滚轮劫持、页面翻译位移或新动画系统。
文字子页直接使用更轻的 1,800 颗粒子两侧布局，不播放 80，不挂载 Globe。整页跳转产生新文档与新实例，不宣称跨文档保持同一个 Canvas。

## 修改文件与目的

| 文件 | 目的 |
| --- | --- |
| `components/PersistentParticleBackdrop.tsx`、`.module.css` | 新增唯一页面级 portal；支持 ambient-only 复用；统一深色底和分层 |
| `components/Particle80.tsx`、`.module.css` | 页面级运行语义、window 指针监听、当前 UI 命中保护、全视口绘制、上下文失败时顶部/侧边 SVG、开发生命周期计数 |
| `components/Particle80Intro.tsx`、`.module.css` | 移除局部 sticky 背景和负 margin；保留标题、小字、构图、原生锚点 |
| `lib/particle80-projection.ts` | 分离 Canvas 视口、首屏 composition 与侧边分布；首屏的 scale/pointScale/中心保持原公式 |
| `lib/particle-story.ts` | `heroInView`、`introInView` 只描述几何；删除 `particleStageVisibility`；独立页面运行条件和指针坐标工具 |
| `hooks/use-particle-story-scroll.ts` | 当前可见阅读区真实 left/right；监听 resize、内容变化、原生 scroll；无每帧 React state |
| `hooks/use-brand-opening.ts` | 删除 Intro 离屏对开场 hook 的运行门控；继续无限 HOLDING_80 |
| `lib/particle80-story-field.ts` | 同一 ID/seed 的两侧约束延伸到整个视口，并支持非对称阅读区 |
| `lib/particle80-debug.ts` | 诊断绘制使用与实际粒子一致的纵向投影原点 |
| `components/network/GlobalUniversityNetwork.tsx`、`Network.module.css` | 标记阅读区/Globe UI；仅移除会遮住整个背景的外层底色，保留面板和卡片 |
| `components/site/SiteChrome.tsx`、`Site.module.css` | Footer 阅读区；内容页复用 ambient 背景；保留文字面板底色 |
| `qa/particle80-intro.tsx`、`.css` | 下方控制区保留真实功能，允许其两侧看到背景 |
| `qa/global-network.tsx` | 独立网络页复用同一 ambient 组件 |
| `qa/particle-story.test.mjs`、`qa/particle80.ssr.test.mjs` | 新页面生命周期、投影、指针和非对称布局回归；portal 的 SSR 契约 |
| `qa/particle80-intro.browser.mjs`、`qa/particle80-living.browser.mjs` | 前者替换过时 handoff/卸载验收；后者仅修正 CTA role；独立 CLI 浏览器脚本本轮未运行 |
| `BRAND_OPENING.md`、`README.md`、`components/Particle80Intro.README.md`、本报告 | 更新“章节结束淡出/暂停”等过时说明 |

物理核心 `lib/particle80-field.ts`、`lib/particle80.ts`、`content/`、`package.json`、锁文件相对基线无 diff。没有增加学校、奖项、统计、规则、报名服务或依赖。

## 关键行为

- 正常模式：背景运行只依赖启用、页面可见、显式暂停、reduced-motion、上下文及已有速率/强度条件。Hero/Introduction bottom < 0 不再停画或停止交互。
- 原 `story.current.inView && particleStageVisibility > .01` 已移除。页面模式不建立局部 IntersectionObserver，也不使用 Intro 的 pointerHost。
- pointermove 为 window 的 passive 监听。根据当前 `clientX/clientY`、固定画布 rect、投影 scale/originY 转换，不叠加 scrollY；物理内部仍使用原深度投影和力学。
- 每次绘制最多一次当前元素命中查询，鼠标静止而内容滚动时也重新判断。按钮、输入、摘要、正文阅读区、选择文字、Globe 面板及弹层受到保护；没有逐粒子查 DOM。
- 保护区按可见主要内容测量，并以有界速度平滑改变。不重抽随机目标，不修改 seed/归属。
- 宽版 Globe 留白狭窄时，使用按固定粒子 ID 的局部绘制稀疏与软淡入，不改变粒子模拟数量或物理参数。手机已是 900 颗低预算，保留更多边缘可见点，避免二次稀疏后几乎不可见。
- 首页保持桌面 9,600、手机 900；DPR 上限 1.5/1，保留 backing 1800×1200 预算。背景 Canvas 不是整页文档高度；只有真正尺寸变化才改变 backing store。

## 实际验证

基线：lint、typecheck、39 tests、build 成功。修改前真实截图中，页脚位置 Intro bottom 约 -681px，粒子 `state=paused`。

本轮：lint、typecheck、43/43 tests、build 成功；静态构建审计覆盖 21 个路由和 404 文件，未发现敏感文件。保留原有 Globe bundle 超过 500KB 的构建警告，不是失败。

实际浏览器：macOS Codex 内置浏览器；桌面 CSS viewport 1440×900，手机尺寸 390×844、320×740，另测高度 760。此为桌面浏览器调整尺寸，不是 iPhone/Android 真机测试。

| 实测项目 | 结果 |
| --- | --- |
| A 顶部、B 50% 展开、C 介绍、D Globe/cards、E 下方内容、F Footer、G 返回顶部 | 均有实际截图；没有随章节结束消失 |
| 桌面顶部保持超过 60 秒 | 89 秒时仍 HOLDING_80；原 60/120 秒纯时间线测试继续通过 |
| Intro bottom < 0 的 Globe 与 Footer | `animated`，模拟时间递增；左右指针强度均达到 1.00 |
| 十次顶部/页脚往返 | 品牌 Canvas=1、engine ID 不变、单个粒子 RAF 链；绑定组没有增加 |
| 学校详情开关、中文/EN 切换 | 不重建粒子；详情打开时指针作用衰减到 0 |
| Competition FAQ 展开/收起 | 不重建 ambient 实例；该文档仅一个 Canvas，无 Globe DOM |
| 手机 844→760→844 高度变化 | 引擎 ID 不变，无横向溢出；原生页面滚动、菜单开关可用 |
| reduced-motion 开关 | 显示静态顶部/侧边场，模拟时间两次采样完全相同，pending RAF=0 |
| 无 Canvas 上下文 | 开发 fixture 返回 null，真实页面显示 SVG 与完整内容；顶部/页脚均截图 |
| Console | 已检查页面未捕获新的 error；SSR 测试确定性通过。入口实际使用 createRoot，不将其描述成 hydrateRoot 实测 |

开发调试计数只统计品牌粒子渲染器，不包含 Globe、短暂的测量 RAF 或浏览器内部监听。它不是整页堆内存/资源分析器。
跨桌面/手机宽度断点会按原质量逻辑重配粒子预算；高度改变不重建。普通语言/FAQ/详情重渲染不重配预算。

## 录屏与证据

导出目录：`../../exports/persistent-backdrop-2026-09-06/`（相对当前 repo）。

- `A-…` 到 `G-…`：桌面各滚动位置；`before-…`：基线桌面。
- `mobile-…`、`svg-fallback-…`：手机与静态降级。
- `chengdu80-persistent-background.mp4`：单次连续真实操作，采集时长 55.01 秒、编码后约 55.03 秒，0 次拼接，含真实输入位置环；从首访汇聚到 Globe、Footer 两侧拨动，再回顶部。
- `continuous-recording.json` / `video-manifest.json`：原始时间戳、动作顺序和采样说明。416 个实际浏览器截图帧，约 7.56 帧/秒；H.264 容器标为 30fps，通过重复采样帧保持原始时间，不代表网站真实 FPS。没有用静态图冒充运行录屏。
- `browser-checks.json`、`production-behavior.json`、`final-validation.log`：实际状态与构建记录。production-behavior 指本地启动最终生产构建后的实测，不是 Vercel 线上交互录制。早期定位截图的失败/重试状态保留在日志里，最终 A–G 文件已按真实位置保存。

## 未实测与边界

- 未测真实 iOS/Android、Safari/Firefox、触屏缩放/地址栏机制、GPU 驱动真实 context loss/restore、长时堆内存曲线和持续 FPS。不要将录屏流畅度当性能保证。
- 通过内置浏览器打开另一标签页没有得到可确认的文档 hidden 暂停状态；这项不标通过。页面隐藏条件的单元测试通过，实际隐藏/恢复需要标准浏览器复测。
- reduced-motion 实测使用现有预览开关；操作系统偏好订阅沿用原实现，未修改用户系统设置。
- 只保存了本轮修改前桌面顶部/页脚，未重新构建旧版本补拍手机基线。截图使用同一确定性 seed，但截图时刻不同，不能用于逐像素光学比较。
- 当前阅读区采用可见面积最大的主内容区域；多个不同宽度内容同时出现时，会向主区域平滑过渡。
- 两个独立 Playwright CLI 浏览器脚本已更新，但本轮没有通过 CLI 启动浏览器执行；上述交互实测由原生浏览器控制完成并留存 JSON/录屏。

## 本地复核

源码：`npm ci && npm run lint && npm run typecheck && npm test && npm run build`。
启动生成的静态目录：`python3 -m http.server 4178 --directory out/particle-preview`，打开 `http://127.0.0.1:4178/`。不需要环境变量、令牌或后台。

正式预览地址和 GitHub 仓库维持不变；发布后的实际 commit 与资源校验写入导出目录的 `RELEASE.md`。
