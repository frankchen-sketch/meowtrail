# MeowTrail Pages Functions — Google OAuth 登录 + 每日挑战云存档

## 架构

- 静态站不变（Astro → dist），`functions/` 目录由 CF Pages 自动识别为 Functions
- OAuth 流程：手工 Authorization Code flow（不引第三方库，避免依赖膨胀）
- 凭据：环境变量（CF Pages 项目设置里配置）
  - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`（复用 furriq 的 OAuth client，加 redirect URI）
  - `OAUTH_STATE_SECRET` — 签 HMAC 的密钥（随机 32+ 字节，别用弱值）
- 绑定：D1 `meowtrail_users`（database_id 80cc8484-7f17-43a0-96aa-14809d953c26）
- 域名：meowtrail.org（Pages 生产域），回调用 `https://meowtrail.org/api/auth/callback`

## 文件

- `functions/api/auth/login.ts` — 跳转 Google 授权页
- `functions/api/auth/callback.ts` — 交换 code、建/查用户、发 cookie
- `functions/api/auth/logout.ts` — 清 cookie
- `functions/api/auth/me.ts` — 读当前用户
- `functions/api/progress.ts` — 云存档 GET/POST（合并策略见下）
- `functions/api/leaderboard.ts` — 每日挑战排行榜 GET（按 puzzle_date 查当日成绩）
- `functions/api/_middleware.ts` — 挂 env 类型声明与公共 CORS/安全头
- `wrangler.toml` — D1 绑定声明（本地 dev 用）

## Cookie / 会话

- Cookie：`mt_session`，HttpOnly + Secure + SameSite=Lax，Path=/
- 值：`uid.exp.hmac(uid:exp)`，HMAC-SHA256 + 1 年过期，防伪造 + 可过期（exp 为 unix 秒）
- JWT 没必要——签名 cookie 就够，省下刷新复杂度
- 回调里 state 用 HttpOnly cookie + HMAC 校验（CSRF 防护）

## 数据合并策略（登录后第一次同步）

关键场景：用户匿名玩了很多天（streak 30），第一次登录，云端是空的 → 云端直接采纳本地数据，本地 streak 不丢。
反向场景：换设备登录，云端已有数据，本地少 → 本地采纳云端。
两边都有 → 取 `best_streak` 最大值、`streak` 取「last_solved_date 较新者」的值，best_time 取 min。
匿名数据上传前清空本地（避免重复合并）。

## D1 表

- users(id uuid, google_sub unique, email, name, picture, created_at)
- daily_progress(user_id PK, streak, best_streak, best_time_ms, last_solved_date, updated_at)
- daily_results(user_id+date PK, time_ms, solved_at)  ← 排行榜数据源

## 安全

- 回调 code 交换走 server-side，client_secret 不落前端
- progress POST 限制 JSON 大小（<2KB），字段白名单 + clamp
- 排行榜只暴露 name + time_ms + date，不暴露 email
- 不收集任何敏感 scope（openid / email / profile，无额外授权）

## 已知限制（接受，不修）

- 排行榜成绩由客户端上报，可被登录用户伪造 0ms 成绩。儿童向休闲游戏站接受此威胁模型；要根治需服务端签发挑战 token + 服务端计时，成本不值。
- logout 是 GET（SameSite=Lax 下可被跨站导航触发登出），影响仅限登出，非安全问题。
- 登录后 me.ts 返回的 picture 前端做了 googleusercontent.com 域名白名单。

## 本地测试

`bash scripts/test-auth-local.sh`（先起 `npx wrangler pages dev dist --port 8788`，覆盖伪造 cookie/过期/未来日期/假日历日期/排行榜写入读取）
