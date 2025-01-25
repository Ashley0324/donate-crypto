# TAO NFT 部署指南 / TAO NFT Deployment Guide

## 中文指南

### 准备工作

1. 安装依赖
```bash
# 安装 Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 安装项目依赖
cd nft-contracts
forge install OpenZeppelin/openzeppelin-contracts
```

2. 准备部署账户
- 准备一个有足够 BNB 的 BSC 钱包地址
- 导出私钥（注意不要泄露给他人）

3. 配置环境变量
```bash
cd nft-contracts
cp .env.example .env
```

编辑 `.env` 文件：
```env
PRIVATE_KEY=你的私钥（不要带0x前缀）
USDT_ADDRESS=0x55d398326f99059fF775485246999027B3197955
BSC_RPC_URL=https://bsc-dataseed.binance.org/
```

### 部署合约

1. 编译合约
```bash
forge build
```

2. 部署合约
```bash
forge script script/DeployTAONFT.s.sol --rpc-url bsc --broadcast
```

部署成功后，你会在控制台看到合约地址，类似：
```
Deployed to: 0x...
```

请保存这个地址，后面需要用到。

### 更新前端配置

1. 修改 `lib/wallet.ts` 文件中的 NFT 合约地址：
```typescript
export const NFT_CONTRACT_ADDRESS = "你的合约地址" // 替换为实际部署的地址
```

2. 重新构建前端
```bash
pnpm build
```

### 验证合约（可选）

在 BSCScan 上验证合约代码：
```bash
forge verify-contract <合约地址> TAONFT --chain-id 56 --watch
```

## English Guide

### Prerequisites

1. Install Dependencies
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install project dependencies
cd nft-contracts
forge install OpenZeppelin/openzeppelin-contracts
```

2. Prepare Deployment Account
- Prepare a BSC wallet address with sufficient BNB
- Export the private key (keep it secure)

3. Configure Environment Variables
```bash
cd nft-contracts
cp .env.example .env
```

Edit `.env` file:
```env
PRIVATE_KEY=your_private_key_here (without 0x prefix)
USDT_ADDRESS=0x55d398326f99059fF775485246999027B3197955
BSC_RPC_URL=https://bsc-dataseed.binance.org/
```

### Deploy Contract

1. Compile Contract
```bash
forge build
```

2. Deploy Contract
```bash
forge script script/DeployTAONFT.s.sol --rpc-url bsc --broadcast
```

After successful deployment, you'll see the contract address in the console:
```
Deployed to: 0x...
```

Save this address for later use.

### Update Frontend Configuration

1. Modify the NFT contract address in `lib/wallet.ts`:
```typescript
export const NFT_CONTRACT_ADDRESS = "your_contract_address" // Replace with actual deployed address
```

2. Rebuild Frontend
```bash
pnpm build
```

### Verify Contract (Optional)

Verify contract code on BSCScan:
```bash
forge verify-contract <contract_address> TAONFT --chain-id 56 --watch
```

## 合约功能说明 / Contract Features

### 中文说明

该 NFT 合约具有以下特点：
1. 支持使用 USDT 铸造 NFT
2. 每个 NFT 都记录了铸造时支付的 USDT 金额
3. NFT 图片使用固定的 IPFS 地址：`ipfs://QmZFTnWLjPDMSzesTfxugFhsktVyf6i2GJstecAEXyqtYm?filename=taoai.png`
4. NFT 名称为 "TAO Private Placement"，符号为 "TAO"

### English Description

The NFT contract has the following features:
1. Supports minting NFTs using USDT
2. Each NFT records the USDT amount paid during minting
3. NFT image uses a fixed IPFS address: `ipfs://QmZFTnWLjPDMSzesTfxugFhsktVyf6i2GJstecAEXyqtYm?filename=taoai.png`
4. NFT name is "TAO Private Placement" with symbol "TAO"

## 常见问题 / FAQ

### 中文

Q: 为什么部署失败？
A: 请检查：
1. 私钥是否正确配置
2. 账户是否有足够的 BNB
3. RPC 节点是否可用

Q: 如何查看已部署的合约？
A: 可以在 BSCScan (https://bscscan.com) 上搜索合约地址

### English

Q: Why does deployment fail?
A: Please check:
1. If private key is correctly configured
2. If account has sufficient BNB
3. If RPC node is available

Q: How to view deployed contract?
A: You can search the contract address on BSCScan (https://bscscan.com)