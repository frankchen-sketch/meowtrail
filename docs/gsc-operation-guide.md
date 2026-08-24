# Google Search Console 操作指南 — MeowTrail

## 📋 操作清单

### 第一步：添加 meowtrail.org 属性

1. **打开 GSC**：https://searchconsole.google.com
2. **点击「添加属性」**（左上角下拉菜单）
3. **选择「网址前缀」**
4. **输入**：`https://meowtrail.org`
5. **验证所有权**（推荐 DNS 验证）：
   - 复制提供的 TXT 记录
   - 登录 Cloudflare → DNS → 添加记录
   - 类型：TXT
   - 名称：`@`
   - 内容：粘贴的 TXT 值
   - 保存后回到 GSC 点击「验证」

---

### 第二步：提交 Sitemap

1. **在 GSC 左侧菜单点击「站点地图」**
2. **输入**：`sitemap-index.xml`
3. **点击「提交」**
4. **等待状态更新**（通常 1-2 天）

**验证**：提交后应显示「成功」状态，无错误

---

### 第三步：地址更改（从 .app 迁移到 .org）

**⚠️ 前提**：确保 meowtrail.app 已有 GSC 属性

1. **切换到 meowtrail.app 属性**
2. **点击左下角「设置」**
3. **点击「地址更改」**
4. **选择新属性**：meowtrail.org
5. **按提示完成验证**
6. **确认迁移**

**注意**：
- 迁移后 .app 的数据会逐步转移到 .org
- 301 重定向必须保持（已确认 ✅）
- 迁移过程可能需要 180 天完成

---

### 第四步：验证 sitemap 域名

**检查 sitemap 是否正确**：

```bash
curl -s https://meowtrail.org/sitemap-index.xml
```

**应显示**：
```xml
<loc>https://meowtrail.org/sitemap-0.xml</loc>
```

**不应显示**：
```xml
<loc>https://meowtrail.app/sitemap-0.xml</loc>  ❌
```

---

### 第五步：提交新页面到索引

**手动请求索引**（每天最多 10 个 URL）：

1. **在 GSC 顶部点击「URL 检查」**
2. **输入 URL**：`https://meowtrail.org/daily/`
3. **点击「请求编入索引」**
4. **等待确认**

**优先提交的页面**：
- `https://meowtrail.org/`（首页）
- `https://meowtrail.org/daily/`（每日挑战）
- `https://meowtrail.org/play/`（游戏页）
- `https://meowtrail.org/rules/`（规则页）
- `https://meowtrail.org/tips/`（技巧页）

---

### 第六步：监控索引状态

**检查索引覆盖率**：

1. **在 GSC 左侧菜单点击「索引」→「网页」**
2. **查看状态**：
   - ✅ 已编入索引：正常
   - ⚠️ 已发现 - 尚未编入索引：等待中
   - ❌ 未找到 (404)：需要修复

**常见问题**：
- 「已发现 - 尚未编入索引」：正常，Google 需要时间爬取
- 「网页会自动被 robots.txt 阻止」：检查 robots.txt 配置
- 「重复网页」：检查 canonical 标签

---

### 第七步：查看搜索表现

**查看关键词数据**：

1. **在 GSC 左侧菜单点击「搜索结果」**
2. **设置时间范围**：最近 28 天
3. **查看指标**：
   - 总点击次数
   - 总展示次数
   - 平均 CTR
   - 平均排名

**优化建议**：
- 高展示 + 低 CTR = 优化标题和描述
- 低展示 + 高排名 = 扩展关键词覆盖

---

## 🔍 验证清单

### 立即检查（今天）

- [ ] meowtrail.org 属性已添加
- [ ] DNS 验证已完成
- [ ] sitemap-index.xml 已提交
- [ ] 地址更改已启动（从 .app 到 .org）

### 本周检查

- [ ] sitemap 状态显示「成功」
- [ ] 首页已编入索引
- [ ] 每日挑战页已编入索引
- [ ] 无 404 错误

### 持续监控

- [ ] 每周查看搜索表现
- [ ] 监控 CTR 变化
- [ ] 检查新页面索引状态
- [ ] 优化高展示低 CTR 页面

---

## 📊 关键指标目标

| 指标 | 目标 | 当前状态 |
|------|------|----------|
| 索引页面数 | 43+ | 待检查 |
| 平均 CTR | >3% | 待检查 |
| 平均排名 | <20 | 待检查 |
| 404 错误 | 0 | 待检查 |

---

## 🚨 常见问题解决

### 问题 1：sitemap 提交失败

**原因**：sitemap 格式错误或无法访问

**解决**：
```bash
# 检查 sitemap 是否可访问
curl -s https://meowtrail.org/sitemap-index.xml

# 检查 sitemap-0.xml
curl -s https://meowtrail.org/sitemap-0.xml
```

### 问题 2：页面未编入索引

**原因**：Google 还没爬取或被阻止

**解决**：
1. 使用「URL 检查」工具
2. 点击「请求编入索引」
3. 等待 1-2 周

### 问题 3：地址更改卡住

**原因**：301 重定向未正确配置

**解决**：
```bash
# 检查重定向
curl -I https://meowtrail.app

# 应显示：
# HTTP/2 301
# location: https://meowtrail.org/
```

---

## 📞 需要帮助？

如果遇到问题：
1. 检查 GSC 帮助中心
2. 查看 Google 搜索状态信息中心
3. 在 Google 搜索中心社区提问

---

## 🎯 下一步行动

**今天**：
1. 完成 GSC 属性添加和验证
2. 提交 sitemap
3. 启动地址更改

**本周**：
1. 提交 5 个重要页面到索引
2. 监控索引状态
3. 查看搜索表现数据

**下周**：
1. 分析 CTR 数据
2. 优化低 CTR 页面
3. 继续提交新页面

**MeowTrail 的 SEO 基础已就绪，现在是收获的时候了！** 🚀
