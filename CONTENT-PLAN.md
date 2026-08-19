# MeowTrail Wiki — 首日 10 页内容规划

> 目标：上线当天 10 个可索引页面，覆盖核心关键词
> 域名：meowtrail.org（待注册）
> 技术栈：Astro + Cloudflare Pages
> 谜题引擎：自建 JavaScript Akari 引擎

## 关键词 → 页面映射

| # | 页面 | 目标关键词 | 搜索意图 | KD |
|---|---|---|---|---|
| 1 | 首页 | meowtrail, meowtrail game | 品牌词/信息型 | 待查 |
| 2 | /play | meowtrail online, play meowtrail | 交易型/导航型 | 待查 |
| 3 | /rules | meowtrail rules, how to play meowtrail | 信息型 | 待查 |
| 4 | /tips | meowtrail tips, meowtrail strategy | 信息型 | 待查 |
| 5 | /levels | meowtrail levels, meowtrail walkthrough | 信息型 | 待查 |
| 6 | /daily | meowtrail daily puzzle | 导航型/粘性 | 待查 |
| 7 | /akari-guide | akari puzzle rules, how to solve akari | 信息型（品类词） | 待查 |
| 8 | /vs-meowdoku | meowtrail vs meowdoku | 比较型 | 待查 |
| 9 | /cheats | meowtrail cheats, meowtrail answers | 信息型 | 待查 |
| 10 | /download | meowtrail app, meowtrail download | 交易型 | 待查 |

## 页面详细规划

### 1. 首页（/）
- Hero：MeowTrail 在线玩 CTA
- 游戏简介（3 句话）
- 功能网格：Play / Rules / Daily / Tips
- 下载链接（App Store + Google Play）
- FAQ Schema（5 个常见问题）
- Schema：WebApplication + FAQPage

### 2. 在线玩（/play）
- 自建 Akari 谜题引擎
- 难度选择：Easy / Medium / Hard / Ultra
- 棋盘尺寸：5x5 / 7x7 / 9x9
- 功能：提示、撤销、重置、检查
- 移动端友好的触控交互
- Schema：WebApplication

### 3. 规则（/rules）
- Akari/MeowTrail 完整规则说明
- 图解每个规则（SVG 棋盘截图）
- 常见错误示例
- FAQ Schema

### 4. 提示与策略（/tips）
- 初学者 5 条核心策略
- 中级技巧（标记法、排除法）
- 高级策略（链式推理）
- 每条策略配示例棋盘

### 5. 关卡攻略（/levels）
- 按难度分组的关卡索引
- 每关：难度标签 + 关键技巧提示
- 视频嵌入（如有 YouTube walkthrough）

### 6. 每日挑战（/daily）
- 基于日期种子生成的每日谜题
- 完成后显示用时和排名
- 分享结果（文本格式，类似 Wordle）
- localStorage 存储历史成绩

### 7. Akari 指南（/akari-guide）
- 品类词承接页
- Akari 历史和变体
- 与数独/Meowdoku 的区别
- 推荐 App 列表

### 8. 对比页（/vs-meowdoku）
- MeowTrail vs Meowdoku 对比表
- 玩法区别、难度、受众
- "哪个更适合你"决策树
- Schema：Article

### 9. 攻略/作弊（/cheats）
- 全关卡答案索引
- 求解器工具（输入棋盘 → 输出答案）
- 作弊指南（如何使用提示）

### 10. 下载页（/download）
- App Store + Google Play 链接
- QR 码
- 版本历史
- 用户评价汇总

## 内容生产节奏

| 阶段 | 时间 | 内容 |
|---|---|---|
| Day 0 | 今天 | 项目初始化 + 谜题引擎 + 首页 + play + rules |
| Day 1 | 明天 | tips + levels + daily + akari-guide |
| Day 2 | 后天 | vs-meowdoku + cheats + download + 部署 |
| Week 1 | 本周 | GSC 注册 + sitemap 提交 + 首批外链 |
| Week 2-4 | 观察期 | 等 Oakever 买量 → 搜索量起来 → 加深内容 |
