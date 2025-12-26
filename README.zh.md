# Auction Zoo 中文说明

Auction Zoo 收集了多种密封竞价拍卖（基于 ERC-721、以太坊原生出价）的智能合约示例，用于展示拍卖理论在链上实现时的细节与权衡。本文件提供中文版概览、架构图、核心流程说明以及常用命令，方便中文读者快速上手。

## 架构总览
系统按职责拆分为 Solidity 合约、Foundry 测试与脚本工具三层：

```mermaid
flowchart TD
  U[竞拍参与者 / 合约部署者]
  CLI[Foundry CLI (forge / cast)]
  Scripts[getBalanceProof.js 等脚本]
  Contracts[密封竞价拍卖合约\n(OverCollateralized, Sneaky, Aztec Connect)]
  Tests[Foundry 测试套件]
  Chain[以太坊主网/本地节点]

  U -->|部署/调用| CLI
  CLI -->|构建/交互| Contracts
  Scripts -->|生成证明或输入| Contracts
  Tests -->|状态模拟和断言| Contracts
  Contracts -->|状态变更| Chain
```

- **Contracts**：`src/sealed-bid/` 下的拍卖实现，覆盖超额抵押 Vickrey、"Sneaky" Vickrey 以及 Aztec Connect 版本。
- **Scripts**：如 `getBalanceProof.js` 帮助生成 Aztec 余额证明。
- **Tests**：`test/` 中的 Foundry 测试验证竞拍流程、惩罚与结算逻辑。

## 核心流程（以密封竞价为例）
1. **提交/锁定抵押**：竞拍者调用 `commitBid` 或等价入口，将哈希化的出价与抵押金锁定到合约。
2. **揭示出价**：在揭示期内调用 `revealBid`，提供明文出价与随机盐，合约校验哈希并记录有效出价。
3. **确定胜者与价格**：在结算阶段，合约选取最高有效出价作为获胜者，支付价格按 Vickrey 二价或特定规则结算。
4. **清算/罚没**：若未按规则揭示或支付，合约可罚没抵押，并向守约者返还多余资金。

### 关键公式
- **Vickrey 二价**：设最高有效出价为 \(b_1\)，第二高为 \(b_2\)，保留价为 \(r\)，则获胜者支付
  $$p = \max(b_2, r)$$
- **超额抵押比例**：提交时需抵押 \(c\)；若设抵押系数 \(\alpha > 1\) 且宣称出价为 \(\tilde{b}\)，则要求
  $$c \ge \alpha \cdot \tilde{b}$$
- **违约罚没**（示例）：未揭示或未按时支付时，罚没比例 \(\gamma\) 的抵押，返还其余部分 \(c - \gamma c\) 给相关方。

## 项目结构
```text
├── src/
│   └── sealed-bid/
│       ├── aztec-connect-auction/        # Aztec Connect Vickrey
│       ├── over-collateralized-auction/  # 超额抵押 Vickrey
│       └── sneaky-auction/               # "Sneaky" Vickrey
├── test/                                 # Foundry 测试
├── lib/                                  # 依赖（forge install）
├── getBalanceProof.js                    # Aztec 证明脚本
├── foundry.toml                          # Foundry 配置
└── package.json                          # JavaScript 依赖与脚本
```

## 快速开始
1. 安装依赖
   ```bash
   forge install
   npm install
   ```
2. 构建与测试
   ```bash
   forge build
   forge test
   ```
3. 运行脚本（示例）
   ```bash
   node getBalanceProof.js --help
   ```

## 设计要点与扩展思路
- 合约默认处理单件 ERC-721 拍卖，出价为 ETH。可扩展为批量、ERC-20 出价或不同结算规则。
- 实验新机制时需评估：存储写入泄露、Gas 成本、抵押罚没边界条件、跨链或隐私层交互安全性。

## 免责声明
本仓库代码“按原样”提供，未经过审计，使用风险自担。请在遵守当地法律与合约安全实践的前提下使用。
