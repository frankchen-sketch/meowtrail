# MeowTrail 算法设计 — 数独猫（类 Akari 逻辑拼图）

---

## 一、游戏规则

### 棋盘
- N×N 网格
- 部分格子有**立方体箱子**，显示数字（1-9）
- 数字 = 该箱子**周围 8 格**中有几只猫

### 操作
- **双击**空白格子 → 放一只猫
- 猫把**整行 + 整列**渲染成猫的颜色
- 每个被染色的格子留下一个**爪印**
- 箱子上的数字**不变**，不提示剩余

### 胜利条件
- 所有数字约束满足（每个数字周围 8 格的猫数 = 数字值）

### 与 Akari 的区别

| 维度 | Akari | MeowTrail |
|------|-------|-----------|
| 影响范围 | 灯泡照亮同行同列直到墙 | 猫影响整行+整列（无墙阻断） |
| 冲突规则 | 两个灯泡不能互相看见 | 两个猫不能在同一行/列 |
| 约束来源 | 数字黑格的4邻 | 数字箱子的8邻 |
| 视觉反馈 | 照亮/黑暗 | 染色+爪印 |

---

## 二、数学模型

### 约束系统

设棋盘 N×N，有 M 个数字箱子，位置 {(rₖ, cₖ, dₖ)}，k=1..M。

**变量：** 每个空白格 (i,j) 是一个布尔变量 xᵢⱼ ∈ {0, 1}（1=放猫）

**约束：**

1. **行约束：** 每行最多一只猫
   ∀i: Σⱼ xᵢⱼ ≤ 1

2. **列约束：** 每列最多一只猫
   ∀j: Σᵢ xᵢⱼ ≤ 1

3. **数字约束：** 每个数字箱子周围 8 格的猫数 = 数字值
   ∀k: Σ_{(i,j)∈neighbors(rₖ,cₖ)} xᵢⱼ = dₖ

4. **箱子格不能放猫：** 箱子位置 x_{rₖ,cₖ} = 0

### 本质
这是一个**带额外约束的 N-Queens 变体**——不是每行每列恰好一只（可以有空行/列），而是每行每列**最多**一只，加上数字约束。

---

## 三、求解器（回溯法）

### 核心思路

1. 收集所有空白格（非箱子位置）
2. 按 MRV（最少候选优先）选择下一个要决定的格子
3. 尝试放猫/不放猫 → 递归求解
4. 剪枝：行/列冲突、数字约束违反

### TypeScript 实现

```typescript
interface NumberBox {
  row: number;
  col: number;
  value: number;  // 1-9
}

interface Puzzle {
  size: number;
  boxes: NumberBox[];
  grid: boolean[][];  // true = 箱子位置（不可放猫）
}

interface Solution {
  cats: { row: number; col: number }[];
}

/**
 * 求解器：给定谜题，返回所有合法解（最多 maxSolutions 个）
 */
function solve(puzzle: Puzzle, maxSolutions = 2): Solution[] {
  const { size, boxes, grid } = puzzle;
  const solutions: Solution[] = [];
  
  // 收集所有空白格
  const blanks: { row: number; col: number }[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) blanks.push({ row: r, col: c });
    }
  }
  
  // 预计算每个数字箱子的邻居列表
  const boxNeighbors: Map<string, { row: number; col: number }[]> = new Map();
  for (const box of boxes) {
    const neighbors: { row: number; col: number }[] = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = box.row + dr;
        const nc = box.col + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && !grid[nr][nc]) {
          neighbors.push({ row: nr, col: nc });
        }
      }
    }
    boxNeighbors.set(`${box.row},${box.col}`, neighbors);
  }
  
  // 状态追踪
  const rowUsed = Array(size).fill(false);
  const colUsed = Array(size).fill(false);
  const catGrid = Array.from({ length: size }, () => Array(size).fill(false));
  const boxCatCount = new Map<string, number>();
  for (const box of boxes) {
    boxCatCount.set(`${box.row},${box.col}`, 0);
  }
  
  function backtrack(idx: number): void {
    if (solutions.length >= maxSolutions) return;
    
    // 检查所有数字约束是否已满足
    let allSatisfied = true;
    for (const box of boxes) {
      const count = boxCatCount.get(`${box.row},${box.col}`) || 0;
      if (count !== box.value) {
        allSatisfied = false;
        break;
      }
    }
    
    if (allSatisfied) {
      // 收集所有猫的位置
      const cats: { row: number; col: number }[] = [];
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (catGrid[r][c]) cats.push({ row: r, col: c });
        }
      }
      solutions.push({ cats });
      return;
    }
    
    if (idx >= blanks.length) return;
    
    const { row, col } = blanks[idx];
    const key = `${row},${col}`;
    
    // 剪枝：检查是否还有未满足的数字箱子，其剩余邻居不足以放够猫
    for (const box of boxes) {
      const bKey = `${box.row},${box.col}`;
      const count = boxCatCount.get(bKey) || 0;
      const remaining = box.value - count;
      if (remaining < 0) return;  // 超了，回溯
      
      // 计算还未决定的邻居数
      const neighbors = boxNeighbors.get(bKey)!;
      let undecided = 0;
      for (const n of neighbors) {
        if (!catGrid[n.row][n.col] && !rowUsed[n.row] && !colUsed[n.col]) {
          undecided++;
        }
      }
      if (undecided < remaining) return;  // 不够放了
    }
    
    // 选项 1：不放猫
    backtrack(idx + 1);
    
    // 选项 2：放猫（如果行/列没被占）
    if (!rowUsed[row] && !colUsed[col]) {
      // 检放猫后数字约束是否可能满足
      let canPlace = true;
      for (const box of boxes) {
        const bKey = `${box.row},${box.col}`;
        const neighbors = boxNeighbors.get(bKey)!;
        const isNeighbor = neighbors.some(n => n.row === row && n.col === col);
        if (isNeighbor) {
          const count = boxCatCount.get(bKey) || 0;
          if (count + 1 > box.value) {
            canPlace = false;
            break;
          }
        }
      }
      
      if (canPlace) {
        // 放猫
        catGrid[row][col] = true;
        rowUsed[row] = true;
        colUsed[col] = true;
        for (const box of boxes) {
          const bKey = `${box.row},${box.col}`;
          const neighbors = boxNeighbors.get(bKey)!;
          if (neighbors.some(n => n.row === row && n.col === col)) {
            boxCatCount.set(bKey, (boxCatCount.get(bKey) || 0) + 1);
          }
        }
        
        backtrack(idx + 1);
        
        // 回溯
        catGrid[row][col] = false;
        rowUsed[row] = false;
        colUsed[col] = false;
        for (const box of boxes) {
          const bKey = `${box.row},${box.col}`;
          const neighbors = boxNeighbors.get(bKey)!;
          if (neighbors.some(n => n.row === row && n.col === col)) {
            boxCatCount.set(bKey, (boxCatCount.get(bKey) || 0) - 1);
          }
        }
      }
    }
  }
  
  backtrack(0);
  return solutions;
}
```

---

## 四、唯一解校验

```typescript
function checkUnique(puzzle: Puzzle): { unique: boolean; count: number } {
  const solutions = solve(puzzle, 2);
  return {
    unique: solutions.length === 1,
    count: solutions.length,
  };
}
```

---

## 五、关卡生成器

### 生成策略

1. 随机在棋盘上放 N 只猫（满足行/列约束，类似 N-Queens）
2. 计算每个格子周围的猫数
3. 选择部分格子作为数字箱子（值 = 周围猫数）
4. 校验唯一解
5. 按箱子数量/位置分级难度

### 实现

```typescript
function generatePuzzle(size: number, catCount: number): Puzzle | null {
  // 1. 随机放猫（N-Queens 风格）
  const cats = placeRandomCats(size, catCount);
  if (!cats) return null;
  
  // 2. 计算每个格子的周围猫数
  const catCountGrid: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
  for (const { row, col } of cats) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          catCountGrid[nr][nc]++;
        }
      }
    }
  }
  
  // 3. 选择数字箱子（排除猫的位置）
  const catSet = new Set(cats.map(c => `${c.row},${c.col}`));
  const candidates: NumberBox[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!catSet.has(`${r},${c}`) && catCountGrid[r][c] > 0) {
        candidates.push({ row: r, col: c, value: catCountGrid[r][c] });
      }
    }
  }
  
  // 随机选一部分作为箱子
  shuffle(candidates);
  const boxCount = Math.max(3, Math.floor(candidates.length * 0.4));
  const boxes = candidates.slice(0, boxCount);
  
  // 4. 构建谜题并校验唯一解
  const grid = Array.from({ length: size }, () => Array(size).fill(false));
  for (const box of boxes) {
    grid[box.row][box.col] = true;  // 箱子位置不可放猫
  }
  
  const puzzle: Puzzle = { size, boxes, grid };
  const { unique } = checkUnique(puzzle);
  
  if (unique) return puzzle;
  return null;  // 重试
}

/**
 * 随机放 N 只猫（满足行/列约束）
 */
function placeRandomCats(size: number, count: number): { row: number; col: number }[] | null {
  const cats: { row: number; col: number }[] = [];
  const rowUsed = Array(size).fill(false);
  const colUsed = Array(size).fill(false);
  
  function place(idx: number): boolean {
    if (idx === count) return true;
    
    // 随机顺序尝试
    const rows = shuffleArray(Array.from({ length: size }, (_, i) => i));
    const cols = shuffleArray(Array.from({ length: size }, (_, i) => i));
    
    for (const r of rows) {
      if (rowUsed[r]) continue;
      for (const c of cols) {
        if (colUsed[c]) continue;
        cats.push({ row: r, col: c });
        rowUsed[r] = true;
        colUsed[c] = true;
        if (place(idx + 1)) return true;
        cats.pop();
        rowUsed[r] = false;
        colUsed[c] = false;
      }
    }
    return false;
  }
  
  return place(0) ? cats : null;
}
```

---

## 六、难度分级

| 难度 | 棋盘 | 猫数 | 箱子数 | 特征 |
|------|------|------|--------|------|
| Easy | 5×5 | 3 | 3-4 | 箱子密集，推理步数少 |
| Medium | 7×7 | 5 | 5-7 | 需要排除法 |
| Hard | 9×7 | 7 | 7-10 | 需要假设+验证 |
| Ultra | 9×9 | 9 | 10-14 | 复杂约束链 |

### 推理步数计算

```typescript
function countReasoningSteps(puzzle: Puzzle): number {
  // 模拟人类解题：
  // 1. 找数字约束已满的箱子（周围猫数=数字）→ 标记其余邻居不能放猫
  // 2. 找数字约束差1的箱子，只剩1个空邻居 → 那个邻居必须放猫
  // 3. 找行/列只剩1个可放位置 → 必须放猫
  // 4. 重复直到无法推导 → 剩下的需要假设
  // 返回推导步数
  // ... 实现类似 MeowBlock 的推理步数计算
}
```

---

## 七、运行时验证

### 玩家操作验证

```typescript
function validatePlayerMove(
  puzzle: Puzzle,
  catGrid: boolean[][],
  row: number,
  col: number
): { valid: boolean; reason?: string } {
  // 不能在箱子上放猫
  if (puzzle.grid[row][col]) {
    return { valid: false, reason: 'Cannot place cat on a box' };
  }
  
  // 检查行冲突
  for (let c = 0; c < puzzle.size; c++) {
    if (c !== col && catGrid[row][c]) {
      return { valid: false, reason: 'Row already has a cat' };
    }
  }
  
  // 检查列冲突
  for (let r = 0; r < puzzle.size; r++) {
    if (r !== row && catGrid[r][col]) {
      return { valid: false, reason: 'Column already has a cat' };
    }
  }
  
  return { valid: true };
}

function checkWin(puzzle: Puzzle, catGrid: boolean[][]): boolean {
  for (const box of puzzle.boxes) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = box.row + dr;
        const nc = box.col + dc;
        if (nr >= 0 && nr < puzzle.size && nc >= 0 && nc < puzzle.size) {
          if (catGrid[nr][nc]) count++;
        }
      }
    }
    if (count !== box.value) return false;
  }
  return true;
}
```

---

## 八、整体架构

```
┌─────────────────────────────────────────┐
│           Puzzle Generator              │
│  ┌─────────┐  ┌──────────┐  ┌────────┐ │
│  │ Place   │→│ Select   │→│ Unique │ │
│  │ Cats    │  │ Boxes    │  │ Check  │ │
│  │ (N-Q)   │  │          │  │        │ │
│  └─────────┘  └──────────┘  └────────┘ │
│       ↑ fail          │ unique?         │
│       └───────────────┘                 │
│                                         │
│  Output: Puzzle { size, boxes[], grid } │
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
│           Runtime                       │
│  ┌──────────┐  ┌───────────┐            │
│  │ Player   │→│ Validate  │→ win       │
│  │ Double-  │  │ Row/Col   │  /fail     │
│  │ Click    │  │ + Box     │            │
│  └──────────┘  └───────────┘            │
└─────────────────────────────────────────┘
```

---

## 九、性能估算

| 棋盘 | 猫数 | 空白格数 | 预估求解时间 |
|------|------|---------|-------------|
| 5×5 | 3 | ~20 | <10ms |
| 7×7 | 5 | ~40 | <100ms |
| 9×7 | 7 | ~50 | <500ms |
| 9×9 | 9 | ~70 | <2s |

回溯 + 剪枝（行/列/数字约束）在浏览器端跑得动。
