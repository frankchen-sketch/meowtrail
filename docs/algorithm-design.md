# MeowTrail 算法设计 — 矩形分割拼图

---

## 一、数学性质

### 基本约束

给定 W×H 网格，N 个数字 d₁...dₙ 散布在格子中，需将网格分割为 N 个矩形，使得：
1. 每个矩形面积 = 包含的数字值
2. 每个矩形恰好包含一个数字
3. 矩形不重叠
4. 矩形并集 = 整个网格（无遗漏）

### 必要条件

- Σdᵢ = W × H（面积守恒）
- 每个数字 d 的因数分解必须能 fit 进网格：d 的可能矩形形状 = {(a,b) | a×b=d, a≤W, b≤H}
- 数字位置约束：数字在 (r,c)，矩形必须覆盖 (r,c)

### 数字的形状空间

| 数字 | 可能形状 (W×H) |
|------|---------------|
| 2 | 1×2, 2×1 |
| 3 | 1×3, 3×1 |
| 4 | 1×4, 2×2, 4×1 |
| 5 | 1×5, 5×1 |
| 6 | 1×6, 2×3, 3×2, 6×1 |
| 8 | 1×8, 2×4, 4×2, 8×1 |
| 9 | 1×9, 3×3, 9×1 |
| 10 | 1×10, 2×5, 5×2, 10×1 |

**大数字形状更少 → 约束更强 → 更容易确定位置。**

---

## 二、求解器（回溯法）

### 核心思路

1. 找到当前最受约束的未放置数字（候选矩形最少的那个）
2. 枚举该数字的所有合法矩形
3. 尝试放置 → 递归求解剩余
4. 冲突时回溯

### TypeScript 实现

```typescript
interface Rect {
  top: number;    // 行索引（0-based）
  left: number;   // 列索引（0-based）
  height: number;
  width: number;
  value: number;  // 数字值
}

interface NumberCell {
  row: number;
  col: number;
  value: number;
}

interface Puzzle {
  width: number;
  height: number;
  numbers: NumberCell[];
}

/**
 * 求解器：给定谜题，返回所有合法解
 */
function solve(puzzle: Puzzle): Rect[][] {
  const { width, height, numbers } = puzzle;
  const grid: boolean[][] = Array.from({ length: height }, () =>
    Array(width).fill(false)  // false = 未覆盖
  );
  const solutions: Rect[][] = [];
  
  backtrack(numbers, 0, grid, [], solutions, width, height);
  return solutions;
}

function backtrack(
  numbers: NumberCell[],
  idx: number,
  grid: boolean[][],
  placed: Rect[],
  solutions: Rect[][],
  W: number,
  H: number
): void {
  // 所有数字都已放置
  if (idx === numbers.length) {
    // 检查是否全覆盖
    if (grid.every(row => row.every(cell => cell))) {
      solutions.push([...placed]);
    }
    return;
  }

  const num = numbers[idx];
  const candidates = getCandidateRects(num, grid, W, H);
  
  // MRV 启发式：如果有数字 0 个候选，直接回溯
  if (candidates.length === 0) return;
  
  for (const rect of candidates) {
    // 尝试放置
    placeRect(rect, grid);
    placed.push(rect);
    
    backtrack(numbers, idx + 1, grid, placed, solutions, W, H);
    
    // 回溯
    removeRect(rect, grid);
    placed.pop();
    
    // 如果只需要找一个解，找到了就返回
    if (solutions.length >= 1) return;
  }
}

/**
 * 获取一个数字的所有合法矩形候选
 * 矩形必须：
 *   1. 包含数字所在格
 *   2. 面积 = 数字值
 *   3. 不超出网格
 *   4. 不覆盖已占用的格子
 */
function getCandidateRects(
  num: NumberCell,
  grid: boolean[][],
  W: number,
  H: number
): Rect[] {
  const { row, col, value } = num;
  const candidates: Rect[] = [];
  
  // 枚举所有因数对 (a, b) where a * b = value
  for (let a = 1; a <= value; a++) {
    if (value % a !== 0) continue;
    const b = value / a;
    
    // a = height, b = width 或 a = width, b = height
    for (const [rh, rw] of [[a, b], [b, a]]) {
      // 枚举所有可能的左上角位置，使得矩形覆盖 (row, col)
      // 矩形覆盖 (row, col) 的条件：
      //   top <= row < top + rh
      //   left <= col < left + rw
      // 所以：
      //   top ∈ [max(0, row - rh + 1), min(row, H - rh)]
      //   left ∈ [max(0, col - rw + 1), min(col, W - rw)]
      
      const topMin = Math.max(0, row - rh + 1);
      const topMax = Math.min(row, H - rh);
      const leftMin = Math.max(0, col - rw + 1);
      const leftMax = Math.min(col, W - rw);
      
      if (topMin > topMax || leftMin > leftMax) continue;
      
      for (let top = topMin; top <= topMax; top++) {
        for (let left = leftMin; left <= leftMax; left++) {
          const rect: Rect = { top, left, height: rh, width: rw, value };
          
          // 检查是否与已放置的矩形冲突
          if (canPlace(rect, grid, W, H)) {
            candidates.push(rect);
          }
        }
      }
    }
  }
  
  return candidates;
}

function canPlace(rect: Rect, grid: boolean[][], W: number, H: number): boolean {
  for (let r = rect.top; r < rect.top + rect.height; r++) {
    for (let c = rect.left; c < rect.left + rect.width; c++) {
      if (r >= H || c >= W || grid[r][c]) return false;
    }
  }
  return true;
}

function placeRect(rect: Rect, grid: boolean[][]): void {
  for (let r = rect.top; r < rect.top + rect.height; r++) {
    for (let c = rect.left; c < rect.left + rect.width; c++) {
      grid[r][c] = true;
    }
  }
}

function removeRect(rect: Rect, grid: boolean[][]): void {
  for (let r = rect.top; r < rect.top + rect.height; r++) {
    for (let c = rect.left; c < rect.left + rect.width; c++) {
      grid[r][c] = false;
    }
  }
}
```

### MRV 优化（最少候选优先）

在 `backtrack` 开始时，不按固定顺序处理数字，而是**动态选择候选矩形最少的数字**先处理：

```typescript
function backtrackMRV(
  numbers: NumberCell[],
  remaining: Set<number>,  // 未放置数字的索引
  grid: boolean[][],
  placed: Rect[],
  solutions: Rect[][],
  W: number,
  H: number
): void {
  if (remaining.size === 0) {
    if (grid.every(row => row.every(cell => cell))) {
      solutions.push([...placed]);
    }
    return;
  }
  
  // MRV：找候选最少的数字
  let bestIdx = -1;
  let bestCandidates: Rect[] = [];
  let minOptions = Infinity;
  
  for (const idx of remaining) {
    const candidates = getCandidateRects(numbers[idx], grid, W, H);
    if (candidates.length < minOptions) {
      minOptions = candidates.length;
      bestIdx = idx;
      bestCandidates = candidates;
      if (minOptions === 0) return;  // 死路，立即回溯
    }
  }
  
  remaining.delete(bestIdx);
  
  for (const rect of bestCandidates) {
    placeRect(rect, grid);
    placed.push(rect);
    backtrackMRV(numbers, remaining, grid, placed, solutions, W, H);
    removeRect(rect, grid);
    placed.pop();
    if (solutions.length >= 2) break;  // 只需知道是否有 0/1/2+ 个解
  }
  
  remaining.add(bestIdx);
}
```

---

## 三、唯一解校验

```typescript
/**
 * 检查谜题是否有唯一解
 * 返回: { unique: boolean, count: number }
 */
function checkUnique(puzzle: Puzzle): { unique: boolean; count: number } {
  const { width, height, numbers } = puzzle;
  const grid = Array.from({ length: height }, () => Array(width).fill(false));
  const solutions: Rect[][] = [];
  const remaining = new Set(numbers.map((_, i) => i));
  
  backtrackMRV(numbers, remaining, grid, [], solutions, width, height);
  
  return {
    unique: solutions.length === 1,
    count: solutions.length,
  };
}
```

**关键：只找最多 2 个解就够了——知道不唯一就停止。**

---

## 四、关卡生成器

### 生成策略

1. 先生成一个合法的矩形分割（正向生成）
2. 从每个矩形中选一个格子作为数字
3. 打乱数字顺序
4. 校验唯一解

### 正向生成（确保一定有解）

```typescript
/**
 * 生成一个 W×H 网格的合法矩形分割
 * 使用递归分割法
 */
function generatePartition(W: number, H: number): Rect[] {
  if (W === 0 || H === 0) return [];
  if (W * H === 1) return [{ top: 0, left: 0, height: 1, width: 1, value: 1 }];
  
  // 随机选择一个分割方向和位置
  const rects: Rect[] = [];
  
  if (W >= H && W > 1) {
    // 垂直分割：在随机位置切一刀
    const cut = 1 + Math.floor(Math.random() * (W - 1));
    const leftRects = generatePartitionRects(0, 0, H, cut);
    const rightRects = generatePartitionRects(0, cut, H, W - cut);
    return [...leftRects, ...rightRects];
  } else if (H > 1) {
    // 水平分割
    const cut = 1 + Math.floor(Math.random() * (H - 1));
    const topRects = generatePartitionRects(0, 0, cut, W);
    const bottomRects = generatePartitionRects(cut, 0, H - cut, W);
    return [...topRects, ...bottomRects];
  }
  
  return rects;
}

/**
 * 在指定区域内递归生成矩形分割
 */
function generatePartitionRects(
  topOffset: number,
  leftOffset: number,
  H: number,
  W: number
): Rect[] {
  // 基础情况：1×1
  if (H === 1 && W === 1) {
    return [{ top: topOffset, left: leftOffset, height: 1, width: 1, value: 1 }];
  }
  
  // 随机决定是否继续分割或合并为一个矩形
  // 小区域（面积 ≤ 6）直接作为一个矩形
  if (W * H <= 6) {
    return [{ top: topOffset, left: leftOffset, height: H, width: W, value: W * H }];
  }
  
  // 继续分割
  if (W >= H && W > 1) {
    const cut = 1 + Math.floor(Math.random() * (W - 1));
    return [
      ...generatePartitionRects(topOffset, leftOffset, H, cut),
      ...generatePartitionRects(topOffset, leftOffset + cut, H, W - cut),
    ];
  } else if (H > 1) {
    const cut = 1 + Math.floor(Math.random() * (H - 1));
    return [
      ...generatePartitionRects(topOffset, leftOffset, cut, W),
      ...generatePartitionRects(topOffset + cut, leftOffset, H - cut, W),
    ];
  }
  
  return [{ top: topOffset, left: leftOffset, height: H, width: W, value: W * H }];
}
```

### 完整生成流程

```typescript
function generatePuzzle(W: number, H: number): Puzzle | null {
  // 1. 生成合法分割
  const rects = generatePartitionRects(0, 0, H, W);
  
  // 2. 从每个矩形中随机选一个格子作为数字位置
  const numbers: NumberCell[] = rects.map(rect => {
    const r = rect.top + Math.floor(Math.random() * rect.height);
    const c = rect.left + Math.floor(Math.random() * rect.width);
    return { row: r, col: c, value: rect.value };
  });
  
  // 3. 校验唯一解
  const puzzle: Puzzle = { width: W, height: H, numbers };
  const { unique } = checkUnique(puzzle);
  
  if (unique) return puzzle;
  
  // 不唯一则重试（或调整数字位置）
  return null;  // 重试
}
```

---

## 五、难度分级

### 推理步骤分析

一个谜题的难度取决于**人类解题需要多少步推理**：

| 难度 | 推理步数 | 特征 |
|------|---------|------|
| Easy | 1-3 步 | 有明显的「必须放这里」的数字（角落/边缘大数字） |
| Medium | 4-7 步 | 需要排除法，先确定几个再推导其余 |
| Hard | 8+ 步 | 需要假设+验证，多个数字互相约束 |

### 推理步数计算

```typescript
/**
 * 计算谜题的推理步数（模拟人类解题过程）
 * 返回: 步数（越大越难）
 */
function countReasoningSteps(puzzle: Puzzle): number {
  const { width, height, numbers } = puzzle;
  const grid = Array.from({ length: height }, () => Array(width).fill(false));
  const remaining = new Set(numbers.map((_, i) => i));
  let steps = 0;
  
  while (remaining.size > 0) {
    // 找候选数 = 1 的数字（唯一确定的）
    let forced = false;
    for (const idx of remaining) {
      const candidates = getCandidateRects(numbers[idx], grid, width, height);
      if (candidates.length === 1) {
        // 唯一确定，直接放置
        placeRect(candidates[0], grid);
        remaining.delete(idx);
        steps++;
        forced = true;
        break;
      }
    }
    
    if (!forced) {
      // 没有唯一确定的数字，需要更复杂的推理
      // 找候选最少的，作为「推理步」
      let bestIdx = -1;
      let minOptions = Infinity;
      for (const idx of remaining) {
        const candidates = getCandidateRects(numbers[idx], grid, width, height);
        if (candidates.length < minOptions) {
          minOptions = candidates.length;
          bestIdx = idx;
        }
      }
      if (bestIdx >= 0) {
        // 用求解器找到正确答案中的那个
        const solution = solve(puzzle)[0];
        const correctRect = solution.find(r => r.value === numbers[bestIdx].value);
        if (correctRect) {
          placeRect(correctRect, grid);
          remaining.delete(bestIdx);
          steps++;
        }
      }
    }
  }
  
  return steps;
}
```

---

## 六、整体架构

```
┌─────────────────────────────────────────┐
│           Puzzle Generator              │
│  ┌─────────┐  ┌──────────┐  ┌────────┐ │
│  │ Partition│→│ Place    │→│ Unique │ │
│  │ Creator  │  │ Numbers  │  │ Check  │ │
│  └─────────┘  └──────────┘  └────────┘ │
│       ↑ fail          │ unique?         │
│       └───────────────┘                 │
│                                         │
│  Output: Puzzle { width, height,        │
│                   numbers[] }           │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│           Difficulty Grader             │
│  ┌──────────┐  ┌───────────┐            │
│  │ Solve    │→│ Count     │→ easy/     │
│  │ (unique) │  │ Steps     │  medium/   │
│  └──────────┘  └───────────┘  hard      │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│           Runtime Solver                │
│  ┌──────────┐  ┌───────────┐            │
│  │ Player   │→│ Validate  │→ win/fail  │
│  │ Drag     │  │ Coverage  │            │
│  └──────────┘  └───────────┘            │
└─────────────────────────────────────────┘
```

---

## 七、性能估算

| 网格 | 数字数 | 预估候选矩形总数 | 求解时间 |
|------|--------|----------------|---------|
| 5×5 | 5-6 | ~50-100 | <10ms |
| 6×6 | 8-10 | ~200-500 | <100ms |
| 7×7 | 10-12 | ~500-2000 | <1s |
| 8×8 | 12-15 | ~2000-5000 | <5s |

MRV 启发式 + 早期回溯可大幅剪枝，实际远快于上界。

---

## 八、下一步

1. [ ] 实现 TypeScript 求解器
2. [ ] 实现正向生成器
3. [ ] 跑批量测试：5×5 ~ 8×8，生成 100 个关卡验证唯一解率
4. [ ] 实现推理步数计算器
5. [ ] 集成到游戏运行时（玩家拖拽验证）
