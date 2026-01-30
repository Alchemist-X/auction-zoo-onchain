# Auction Zoo（中文说明）

本仓库展示一系列与拍卖理论相关的 Solidity 合约实现，重点聚焦在链上密封竞价的设计权衡。通过对不同拍卖机制的实现差异进行比较，帮助你理解理论约束如何影响工程细节，以及实现细节如何反过来影响机制性质。

## 内容概览
- 密封竞价拍卖
  - [Overcollateralized Vickrey auction](./src/sealed-bid/over-collateralized-auction/OverCollateralizedAuction.sol)
  - ["Sneaky" Vickrey auction](./src/sealed-bid/sneaky-auction/SneakyAuction.sol)
  - [Aztec Connect Vickrey auction](./src/sealed-bid/aztec-connect-auction/AztecConnectAuction.sol)

## Demo 互动游戏
`demo/` 目录下提供了可交互的多轮策略小游戏 **Auction Strategy Sprint**。你可以为提交、揭示、结算三个阶段分配 100 点专注度，进行多回合对战，并引入其他 LLM 输出作为参与者进行对比评分。

- 入口页面：`demo/index.html`
- 游戏说明（中文优先）：`demo/GAME.md`

## 项目结构
```text
├── src/        # Solidity 合约实现
├── test/       # Foundry 测试
├── demo/       # 可视化 Demo 与互动游戏
└── README.md   # 英文说明
```

## 快速开始
需要先安装 [Foundry](https://book.getfoundry.sh/getting-started/installation) 与 Node.js 18+。

```bash
# 拉取依赖
forge install
npm install

# 编译合约
forge build

# 运行测试
forge test
```

## 参考链接
- [项目英文说明](./README.md)
- [Foundry 配置](./foundry.toml)
