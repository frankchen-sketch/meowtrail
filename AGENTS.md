# MeowTrail — Agent Rules

## 项目定位
猫主题 Akari (Light Up) 逻辑谜题游戏站。Astro 静态站 + Cloudflare Pages 部署。

## 怎么跑
```bash
pnpm install          # 安装依赖
pnpm run dev          # 本地开发 localhost:4321
pnpm run build        # 构建（含引擎编译 + pagefind 索引）
wrangler pages deploy dist --project-name=meowtrail --commit-dirty=true  # 部署
```

## 技术栈
- Astro 5.x (静态输出) + TypeScript
- 引擎：`src/lib/akari-engine.ts`（求解器+生成器）
- 引擎编译：`scripts/bundle-engine.mjs`（esbuild → `public/akari-engine.js`）
- 页面加载引擎：`<script is:inline src="/akari-engine.js">`（Astro 不打包内联 import）
- 搜索：pagefind
- 部署：Cloudflare Pages（域名 meowtrail.org）

## 目录结构
```
src/
  lib/akari-engine.ts    ← 核心引擎（唯一活跃）
  lib/step-extractor.ts  ← 关卡解法提取（生成 puzzles.json 用）
  data/puzzles.json      ← 20 关预生成数据
  pages/index.astro      ← 首页（可玩游戏）
  pages/daily.astro      ← 每日挑战（14×14 超难关 + streak + badge）
  pages/play.astro       ← 独立游戏页
  pages/solver.astro     ← 求解器工具
  pages/puzzle/[id].astro← 关卡页（动态路由）
  pages/*.astro          ← SEO 内容页（品类词、攻略、规则等共 19 页）
  components/SEOHead.astro     ← SEO 元数据组件
public/
  akari-engine.js        ← 编译后的引擎（build 自动生成）
  assets/cats/           ← 猫图标素材
  og-default.png         ← 社交分享图
  favicon.svg            ← SVG 猫脸
scripts/
  bundle-engine.mjs      ← 引擎编译脚本（build 自动调用）
```

## 关键约定
- **Astro 内联 script 的 import 不被 Vite 打包**——引擎必须用 `<script is:inline src="/akari-engine.js">` 加载
- **引擎改了必须重新编译**：`node scripts/bundle-engine.mjs`（或 `pnpm run build` 自动执行）
- **配色**：紫主 #7B6B8A / 杏桃按钮 #E8A888 / 薄荷成功 #88C8A8 / 猫 #C8A8E8
- **关卡数据**：`src/data/puzzles.json` 由 node 脚本生成，不手编
- **部署到 CF Pages**，不用 Vercel

## 当前状态
- 19 个页面（首页 + daily + play + solver + 15 个 SEO 内容页）
- 每日挑战：14×14 超难关 + streak 追踪 + badge 系统（3/7/14/30 天）
- 首页有 "🔥 Daily Challenge" 入口按钮
- og:image / favicon 已替换为真实素材
- GSC 已提交 sitemap
- GA4 事件打点：game_start / level_up / hint_click / daily_challenge_click / share_copy / share_twitter / share_reddit / daily_start
- Clarity 客户端 API：track() helper 自动同步所有事件到 Clarity（yaiysek0y6）
- Reddit 分享：预填 r/meowtrail，计时+关卡+挑战文案，html2canvas 棋盘截图到剪贴板

## 下一步
- 自定义棋盘生成器（用户创建题目 → 分享链接）
