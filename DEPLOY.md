# MeowTrail 部署指南

> 域名：meowtrail.app（已购买）
> 项目：~/workspace/meowtrail
> 技术栈：Astro + Cloudflare Pages

## 明早你要做的（1 分钟）

### 1. Wrangler 授权

```bash
cd ~/workspace/meowtrail
wrangler login
```

浏览器会弹出 Cloudflare 授权页面，点「Allow」即可。

### 2. 创建 CF Pages 项目并部署

```bash
pnpm build
wrangler pages deploy dist --project-name meowtrail
```

### 3. 绑定域名

在 Cloudflare Dashboard → Pages → meowtrail → Custom Domains → 添加 `meowtrail.app`

DNS 会自动配置（CNAME 到 Pages）。

### 4. GSC 注册

去 https://search.google.com/search-console → 添加资源 → 输入 `https://meowtrail.app` → 验证（DNS 或 HTML 文件） → 提交 sitemap `https://meowtrail.app/sitemap-index.xml`

## 项目状态

| 项 | 状态 |
|---|---|
| 域名 | ✅ meowtrail.app 已购买 |
| 代码 | ✅ git committed（最新 commit: 按哥飞 SOP 重构首页） |
| 构建 | ✅ `pnpm build` 通过（6 页 + pagefind） |
| 预览 | ✅ `localhost:4321` 跑着 |
| 部署 | ⏳ 等 wrangler login 授权 |
| GSC | ⏳ 等部署后注册 |

## 首页架构（哥飞 SOP）

```
┌──────────────────────────────┐
│ 🐱 MeowTrail (H1)           │ ← 品牌词 = 游戏名
│ nav: Rules / Tips / Daily    │
├──────────────────────────────┤
│ [Size] [Difficulty] [New...] │ ← 游戏控制栏
│ ┌────────────────────────┐   │
│ │    可玩棋盘（Akari）    │   │ ← 首页直接可玩
│ │    💡 实时照明 + 冲突   │   │
│ └────────────────────────┘   │
├──────────────────────────────┤
│ What is MeowTrail?           │ ← 游戏介绍
│ How to Play                  │ ← 玩法说明
│ FAQ (FAQPage Schema)         │ ← SEO 内容
│ Download Links               │ ← App Store/Google Play
├──────────────────────────────┤
│ Footer: fan site disclaimer  │
└──────────────────────────────┘
```

## 文件结构

```
~/workspace/meowtrail/
├── src/
│   ├── components/SEOHead.astro    ← 可复用 SEO 组件
│   ├── lib/puzzle-engine.ts        ← 1046 行 Akari 引擎
│   └── pages/
│       ├── index.astro             ← 首页（可玩+SEO）
│       ├── play.astro              ← 独立游戏页
│       ├── rules.astro             ← 规则页
│       ├── tips.astro              ← 策略页
│       ├── daily.astro             ← 每日挑战
│       └── cheats.astro            ← 求解器
├── public/
│   ├── robots.txt                  ← AI 爬虫白名单
│   ├── llms.txt                    ← AI 搜索引用
│   └── favicon.svg
└── astro.config.mjs                ← sitemap + site URL
```
