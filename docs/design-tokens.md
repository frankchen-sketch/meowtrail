# MeowTrail 设计 Token — 竞品 UI 提取与综合规范

> **来源站点**：meowdoku.org（猫拼图）、play2048.co（2048）、puzzle-nonograms.com（Nonograms）、primarygames.com（游戏门户）、bigduckgames.com/flowfree（Flow Free）
> **提取方式**：浏览器 CDP 实时计算样式（getComputedStyle），非截图分析
> **提取日期**：2026-08-20

---

## 〇、竞品设计风格总览

| 竞品 | 风格定位 | 背景色调 | 字体 | 圆角策略 | 适用 MeowTrail 借鉴 |
|------|---------|---------|------|---------|-------------------|
| **Meowdoku** | 治愈猫主题·暖棕调 | 奶油白 `#fffaf8` | Geist (Vercel) | 6-20px 混用 | ⭐ **主参考**：配色体系最匹配 |
| **2048** | 极简·大地色系 | 米白 `#faf8f0` | Rubik | 14px 圆润 | 间距/字号体系参考 |
| **Nonograms** | 经典·冷调 | 纯白 `#ffffff` | Tahoma | 0px（无圆角） | ❌ 风格太老，不参考 |
| **PrimaryGames** | 儿童·高饱和 | 深紫 `#361257` | Montserrat/Questrial | 4px | ❌ 太卡通，不参考 |
| **Flow Free** | 暗黑·沉浸 | 深棕 `#100806` | 系统字体 | N/A（App 引导页） | 配色深色模式参考 |

**结论**：Meowdoku 和 2048 是最值得参考的竞品——都走「温暖·克制·高可读性」路线。

---

## 一、Meowdoku 设计系统（主参考）

### 1.1 CSS 变量

```css
:root {
  --background: #fffaf8;   /* 页面主背景：微粉白 */
  --foreground: #342421;   /* 主文字：深暖棕 */
}
```

### 1.2 字体栈

```
Geist, "Geist Fallback", ui-sans-serif, system-ui, sans-serif
```

- **H1**：60px / weight 900（font-black）/ 颜色 `#342421`
- **正文**：16px / 1.5 行高 / 颜色 `#342421`
- **标签**：12px / weight 900 / 大写 + tracking

### 1.3 文字色阶（按使用频率排序）

| Token | RGB | Hex | 频率 | 用途 |
|-------|-----|-----|------|------|
| `--text-primary` | `rgb(52,36,33)` | `#342421` | 最高 | 标题、正文 |
| `--text-dark` | `rgb(61,48,44)` | `#3d302c` | 高 | 深色按钮文字、强调 |
| `--text-body` | `rgb(111,86,81)` | `#6f5651` | 高 | 正文辅助 |
| `--text-muted` | `rgb(155,114,108)` | `#9b726c` | 中 | 标签、说明 |
| `--text-icon` | `rgb(122,99,92)` | `#7a635c` | 中 | 图标、次要操作 |
| `--text-secondary` | `rgb(118,93,85)` | `#765d55` | 低 | 更次要文字 |
| `--text-on-color` | `rgb(255,255,255)` | `#ffffff` | 高 | 彩色背景上的白字 |
| `--text-on-dark` | `rgb(203,212,209)` | `#cbd4d1` | 低 | 深色背景上的文字 |

### 1.4 背景色

| Token | RGB | Hex | 用途 |
|-------|-----|-----|------|
| `--bg-page` | `rgb(255,250,248)` | `#fffaf8` | 页面主背景 |
| `--bg-card` | `rgb(255,244,240)` | `#fff4f0` | 卡片悬停 |
| `--bg-page-alt` | `rgb(248,246,239)` | `#f8f6ef` | 备用暖白背景 |
| `--bg-dark` | `rgb(61,48,44)` | `#3d302c` | 深色区域 |
| `--bg-tooltip` | `lab(13.7 -1.9 -2.1 / 0.88)` | ≈ `#1f2426` 88% | 提示/遮罩 |

### 1.5 按钮系统（从 meowdoku.org 实测）

#### 主操作按钮（Normal 模式）
```css
/* 深色实心按钮 */
background: rgb(61,48,44);        /* #3d302c */
color: white;
border-radius: 9999px;            /* pill 形 */
padding: 0 20px;
font-size: 12px;
font-weight: 900;
box-shadow: 0 4px 10px rgba(61,48,44,0.18);
text-transform: uppercase;
letter-spacing: 0.16em;
```

#### 次操作按钮（Hard/Undo/Hint/Levels）
```css
/* 白底描边按钮 */
background: white;
color: rgb(122,99,92);            /* #7a635c */
border-radius: 9999px;
padding: 0 20px;
font-size: 12-14px;
font-weight: 900;
box-shadow: 0 0 0 1px rgb(231,218,207),   /* 1px ring */
            0 4px 10px rgba(78,64,55,0.12); /* soft shadow */
```

#### 图标按钮（导航圆按钮）
```css
background: white;
border-radius: 9999px;
box-shadow: 0 0 0 1px rgb(240,223,216),
            0 4px 10px rgba(78,64,55,0.10);
```

### 1.6 游戏区域强调色（猫区域色）

| 颜色名 | Hex | 用途 |
|--------|-----|------|
| Teal（青绿） | `#67c5bf` | 第 1 区域 |
| Rose（玫瑰） | `#d896b3` | 第 2 区域 |
| Yellow（柠檬黄） | `#e8c94f` | 第 3 区域 |
| Green（草绿） | `#a9d893` | 第 4 区域 |
| Orange（橙） | `#f26a43` | 第 5 区域 |
| Blue（天蓝） | `#6cb6dc` | 第 6 区域 |
| Purple（紫罗兰） | `#9278d9` | 第 7 区域 |
| Pink（粉） | `#ec4f86` | CTA/标签 |
| Teal（标签绿） | `#2bbf98` | 章节标签 |

### 1.7 阴影系统

| 层级 | 值 | 用途 |
|------|----|------|
| `shadow-xs` | `0 0 0 1px ring-color` | 按钮描边环 |
| `shadow-sm` | `0 4px 10px rgba(78,64,55,0.10)` | 导航按钮、轻量浮起 |
| `shadow-md` | `0 4px 10px rgba(78,64,55,0.12)` | 猫图标、工具栏 |
| `shadow-lg` | `0 6px 14px rgba(78,64,55,0.12)` | 模式切换容器 |
| `shadow-xl` | `0 18px 45px rgba(66,38,32,0.12)` | 卡片 hover、游戏截图 |
| `shadow-dark` | `0 4px 10px rgba(61,48,44,0.18)` | 深色按钮 |

### 1.8 间距 & 尺寸

| 元素 | 值 | 备注 |
|------|----|------|
| 导航高度 | `64px` | `h-16` |
| 按钮高度 | `36-40px` | `min-h-9` / `min-h-10` |
| 按钮内边距 x | `16-20px` | `px-4` / `px-5` |
| 标签内边距 | `8px 12px` | |
| section 内边距 y | `56px` | `py-14` |
| 卡片内边距 | `24px` | `p-6` |
| 卡片间距 | `20px` | `gap-5` |

### 1.9 圆角

| 元素 | 值 | Tailwind |
|------|----|----------|
| 标签/小按钮 | `6px` | `rounded-md` |
| 卡片 | `8px` | `rounded-lg` |
| 容器/模式切换 | `18-20px` | `rounded-[1.15rem]` |
| 按钮（pill） | `9999px` | `rounded-full` |

### 1.10 过渡动画

| 效果 | 值 |
|------|----|
| 卡片 hover 上移 | `translate-y-(-1)` + shadow-xl |
| 图片 hover 缩放 | `scale(1.05)` 300ms |
| 通用过渡 | 150ms ease |
| 导航模糊 | `backdrop-blur` + `bg-white/92` |

---

## 二、2048 设计系统（参考）

### 2.1 字体栈

```
Rubik, Arial, system-ui, sans-serif
```

### 2.2 配色

| Token | Hex | 用途 |
|-------|-----|------|
| `--bg-page` | `#faf8f0` | 页面背景（暖米白） |
| `--text-primary` | `#756452` | 主文字（暖棕） |
| `--bg-sand` | `#eae7d9` | 工具栏/容器背景 |
| `--bg-tan` | `#a79b8b` | 次要元素、分隔线 |
| `--bg-dark` | `#33312b` | 深色按钮背景 |
| `--bg-beige` | `#e0dad1` | 弹出层背景 |

### 2.3 按钮

```css
/* 深色按钮 */
background: rgb(51,49,43);       /* #33312b */
color: white;
border-radius: 10px;
padding: 0 16px;
font-size: 16px;

/* pill 形圆角按钮 */
background: rgb(51,49,43);
color: white;
border-radius: 9999px;
```

### 2.4 游戏网格

```css
gap: 6px 4px;                    /* 网格间距 */
border-radius: 14px;             /* 游戏块圆角 */
background: rgba(186,172,154,0.3); /* 空格子半透明底 */
```

### 2.5 特色

- **Tooltip**：`bg-dark-grey` `#534f48` / 白字 / `rounded-xl`
- **Badge**：`bg-dark-grey` 圆形 `rounded-full`
- **H1**：48px / weight 700 / 颜色 `#756452`

---

## 三、MeowTrail 专用设计规范（综合提炼）

### 3.1 核心设计原则（来自竞品分析）

1. **暖色调一致**：Meowdoku 和 2048 都用暖米/棕调，MeowTrail 应延续
2. **背景极度克制**：纯淡色 + 数字，不预设颜色（MeowTrail 特有）
3. **圆角统一**：pill（9999px）用于按钮，8-14px 用于卡片/容器
4. **阴影暖色偏移**：不用纯黑 `rgba(0,0,0,x)`，用暖棕 `rgba(78,64,55,x)`
5. **字体可读性优先**：系统字体栈 > 装饰字体

### 3.2 推荐 MeowTrail CSS 变量

```css
:root {
  /* === 背景 === */
  --mt-bg-page: #fffaf8;            /* 页面主背景：微粉白 */
  --mt-bg-card: #fff4f0;            /* 卡片背景 */
  --mt-bg-grid: #f5ede3;            /* 棋盘底色（比页面深一点） */
  --mt-bg-hover: #fbf1ec;           /* 悬停态 */
  --mt-bg-dark: #3d302c;            /* 深色区域 */

  /* === 文字 === */
  --mt-text-primary: #342421;       /* 标题、最重要文字 */
  --mt-text-body: #6f5651;          /* 正文 */
  --mt-text-muted: #9b726c;         /* 辅助说明 */
  --mt-text-secondary: #8b746d;     /* 次要辅助 */
  --mt-text-icon: #7a635c;          /* 图标 */
  --mt-text-on-dark: #ffffff;       /* 深色背景上白字 */

  /* === 强调色 === */
  --mt-accent-pink: #ec4f86;        /* CTA、高亮 */
  --mt-accent-teal: #2bbf98;        /* 章节标签 */
  --mt-accent-yellow: #ffcf67;      /* 提示/警告 */
  --mt-accent-green: #559c68;       /* 成功 */

  /* === 边框 === */
  --mt-border: #f4dfdc;             /* section 分隔 */
  --mt-border-card: #f0d7d2;        /* 卡片边框 */
  --mt-ring: #e7dacf;               /* 按钮环线 */
  --mt-ring-alt: #f0dfd8;           /* 移动端环线 */
  --mt-focus: #67c5bf;              /* 焦点环 */

  /* === 棋盘（MeowTrail 核心） === */
  --mt-cell-bg: #f5ede3;            /* 空格子 */
  --mt-cell-border: #d4c8b8;        /* 格子分隔线 */
  --mt-cell-number: #3d2b1f;        /* 数字文字 */
  --mt-drag-highlight: #ffd6ba;     /* 拖拽选区高亮 */

  /* === 猫区域色 === */
  --mt-cat-purple: #c8b6e8;
  --mt-cat-red: #e87070;
  --mt-cat-yellow: #f9d75e;
  --mt-cat-blue: #7eb8d8;
  --mt-cat-orange: #f0a860;
  --mt-cat-pink: #e8a0c0;

  /* === 圆角 === */
  --mt-radius-sm: 6px;
  --mt-radius-md: 8px;
  --mt-radius-lg: 14px;
  --mt-radius-xl: 20px;
  --mt-radius-pill: 9999px;

  /* === 阴影（暖色偏移） === */
  --mt-shadow-sm: 0 4px 10px rgba(78,64,55,0.10);
  --mt-shadow-md: 0 6px 14px rgba(78,64,55,0.12);
  --mt-shadow-lg: 0 18px 45px rgba(66,38,32,0.12);
  --mt-shadow-button: 0 4px 10px rgba(61,48,44,0.18);
  --mt-ring-shadow: 0 0 0 1px var(--mt-ring), 0 4px 10px rgba(78,64,55,0.12);

  /* === 字体 === */
  --mt-font: 'Geist', 'Geist Fallback', ui-sans-serif, system-ui, sans-serif;
  --mt-font-mono: 'Geist Mono', ui-monospace, monospace;

  /* === 字号 === */
  --mt-text-xs: 11px;
  --mt-text-sm: 14px;
  --mt-text-base: 16px;
  --mt-text-lg: 18px;
  --mt-text-xl: 20px;
  --mt-text-2xl: 24px;
  --mt-text-3xl: 30px;
  --mt-text-hero: 48px;
  --mt-text-display: 60px;

  /* === 字重 === */
  --mt-weight-normal: 400;
  --mt-weight-semibold: 600;
  --mt-weight-bold: 700;
  --mt-weight-black: 900;

  /* === 间距（4px 网格） === */
  --mt-space-1: 4px;
  --mt-space-2: 8px;
  --mt-space-3: 12px;
  --mt-space-4: 16px;
  --mt-space-5: 20px;
  --mt-space-6: 24px;
  --mt-space-8: 32px;
  --mt-space-14: 56px;

  /* === 动画 === */
  --mt-transition-fast: 150ms ease;
  --mt-transition-normal: 200ms ease-out;
  --mt-transition-slow: 300ms ease;
  --mt-transition-bounce: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 3.3 按钮组件规范

```css
/* 主按钮（CTA） */
.btn-primary {
  background: var(--mt-bg-dark);
  color: var(--mt-text-on-dark);
  border-radius: var(--mt-radius-pill);
  padding: 0 20px;
  height: 40px;
  font-size: var(--mt-text-xs);
  font-weight: var(--mt-weight-black);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  box-shadow: var(--mt-shadow-button);
  transition: var(--mt-transition-fast);
}

/* 次按钮（白底描边） */
.btn-secondary {
  background: white;
  color: var(--mt-text-icon);
  border-radius: var(--mt-radius-pill);
  padding: 0 20px;
  height: 40px;
  font-size: var(--mt-text-sm);
  font-weight: var(--mt-weight-black);
  box-shadow: var(--mt-ring-shadow);
  transition: var(--mt-transition-fast);
}
.btn-secondary:hover {
  background: var(--mt-bg-hover);
  box-shadow: var(--mt-shadow-md);
}
```

### 3.4 棋盘动画规范

| 状态 | 动画 | 时长 | 缓动 |
|------|------|------|------|
| 手指经过格子 | 背景色渐变 | 200ms | ease-out |
| 猫脸出现 | `scale(0.5→1.15→1)` | 300ms | spring / bounce |
| 拖拽选区高亮 | 颜色淡入 | 150ms | ease |
| 胜利 "Cool!" | fade-in + 上浮 20px | 600ms | ease-out |
| 彩纸飘落 | translateY + rotate | 2-3s | ease-out |

---

## 四、直接可用的 HTML/CSS 组件片段

### 4.1 页面结构

```html
<body style="
  font-family: var(--mt-font);
  background: var(--mt-bg-page);
  color: var(--mt-text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
">
```

### 4.2 导航栏

```css
.navbar {
  height: 64px;
  backdrop-filter: blur(12px);
  background: rgba(255,250,248,0.92);
  border-bottom: 1px solid var(--mt-border);
}
```

### 4.3 游戏容器

```css
.game-container {
  background: var(--mt-bg-grid);
  border-radius: var(--mt-radius-lg);
  padding: var(--mt-space-4);
  box-shadow: var(--mt-shadow-lg);
}
```

### 4.4 棋盘格子

```css
.cell {
  background: var(--mt-cell-bg);
  border: 1px solid var(--mt-cell-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--mt-text-lg);
  font-weight: var(--mt-weight-bold);
  color: var(--mt-cell-number);
  transition: background var(--mt-transition-normal);
}
.cell.dragging {
  background: var(--mt-drag-highlight);
}
.cell.completed {
  background: var(--mt-cat-purple); /* 动态分配 */
}
.cell.completed .cat-emoji {
  animation: cat-pop var(--mt-transition-bounce);
}
@keyframes cat-pop {
  0% { transform: scale(0.5); }
  70% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
```

---

## 五、与现有猫脸资产色值对照

| 猫脸 | 文件名 | 填充色 | 情绪 |
|------|--------|--------|------|
| 💜 紫猫 | cat-wink-purple.png | `#c8b6e8` | 俏皮眨眼 |
| ❤️ 红猫 | cat-grumpy-red.png | `#e87070` | 生气 |
| 💛 黄猫 | cat-happy-yellow.png | `#f9d75e` | 开心 |
| 💙 蓝猫 | cat-sleepy-blue.png | `#7eb8d8` | 困倦 |
| 🧡 橙猫 | cat-smile-orange.png | `#f0a860` | 微笑 |
| 💗 粉猫 | cat-surprised-pink.png | `#e8a0c0` | 惊讶 |

颜色分配规则：相邻矩形不能同色（四色定理，6 色足够）。

---

## 六、响应式断点

| 断点 | 宽度 | 用途 |
|------|------|------|
| `sm` | 640px | 按钮变大、字号提升 |
| `md` | 768px | 导航显示、网格列数 |
| `lg` | 1024px | 双栏布局 |
| `xl` | 1280px | 最大宽度容器 |
| `2xl` | 1536px | 三栏布局 + 侧边 |

---

*最后更新：2026-08-20 | 提取源：meowdoku.org、play2048.co、puzzle-nonograms.com、primarygames.com、bigduckgames.com*
