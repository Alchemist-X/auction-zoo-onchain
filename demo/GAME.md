# 互动游戏说明（中文）

## 概览
Auction Strategy Sprint 是一个多轮互动游戏，用来模拟密封竞价拍卖在 **提交 / 揭示 / 结算** 三个阶段中的资源分配策略。每一轮都需要分配 **100 点专注度**，系统会根据该拍卖类型的理想权重计算得分并累计到排行榜。

## 玩法步骤
1. **选择拍卖类型**：决定本场比赛的评估目标。
2. **设置回合数**：每场比赛支持 1～10 轮。
3. **分配 100 点**：拖动滑杆分配 Commit / Reveal / Finalize。
4. **运行回合**：点击 “Run round” 计算得分并进入下一轮。
5. **查看排行榜**：累计得分会展示在 Leaderboard 中。

## LLM 参与者接入
你可以把其他 LLM 的输出作为参与者插入比赛。只要在 “LLM strategy JSON” 输入框中粘贴 JSON 即可。

### 支持的 JSON 格式
**按回合指定：**
```json
{
  "name": "LLM Alpha",
  "rounds": [
    { "commit": 45, "reveal": 35, "finalize": 20 },
    { "commit": 40, "reveal": 40, "finalize": 20 }
  ]
}
```

**使用固定权重：**
```json
{
  "name": "LLM Beta",
  "weights": { "commit": 30, "reveal": 50, "finalize": 20 }
}
```

> 系统会自动把权重归一化为 100 点。

## 评分方式
系统会根据拍卖类型的目标分配（Target）计算分数。越接近目标分配，得分越高。每轮得分会累积到排行榜。

---

# Game Guide (English)

## Overview
Auction Strategy Sprint is a **multi-round** interactive game that simulates how to allocate focus across **Commit / Reveal / Finalize** phases for sealed-bid auctions. Each round assigns **100 focus points**, scores the allocation against the auction’s ideal profile, and accumulates points on the leaderboard.

## How to Play
1. **Choose an auction type** to define the target profile.
2. **Set total rounds** (1–10).
3. **Allocate 100 points** across Commit / Reveal / Finalize.
4. **Run each round** to score and advance.
5. **Review the leaderboard** for cumulative scores.

## LLM Participant Integration
You can insert external LLMs as participants by pasting JSON into the “LLM strategy JSON” field.

### Supported JSON formats
**Per-round allocations:**
```json
{
  "name": "LLM Alpha",
  "rounds": [
    { "commit": 45, "reveal": 35, "finalize": 20 },
    { "commit": 40, "reveal": 40, "finalize": 20 }
  ]
}
```

**Fixed weights:**
```json
{
  "name": "LLM Beta",
  "weights": { "commit": 30, "reveal": 50, "finalize": 20 }
}
```

> The game automatically normalizes weights to 100 points.

## Scoring
Scores are calculated by comparing allocations to the auction’s target profile. Closer matches yield higher scores. Scores accumulate across rounds on the leaderboard.
