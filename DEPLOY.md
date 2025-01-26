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
- 准备一个有足够 BNB 的 BSC 钱包地址（用于部署合约）
- 准备一个提取 USDT 的钱包地址（用于后续提取用户支付的 USDT）
- 导出部署账户的私钥（注意不要泄露给他人）

3. 配置环境变量
```bash
cd nft-contracts
cp .env.example .env
```

编辑 `.env` 文件：
```env
PRIVATE_KEY=你的私钥（需要带0x前缀）
USDT_ADDRESS=0x55d398326f99059fF775485246999027B3197955
WITHDRAWAL_ADDRESS=提取USDT的钱包地址
BSC_RPC_URL=https://bsc-dataseed.binance.org/
```

### 部署合约

1. 编译合约
```bash
forge build
```

2. 部署合约
```bash
forge script script/DeployTAONFT.s.sol --rpc-url bsc --broadcast --verify \
    --etherscan-api-key $BSCSCAN_API_KEY \
    --verifier etherscan \
    --verifier-url https://api.bscscan.com/api
```

部署成功后，你会在控制台看到以下信息：
```
NFT contract deployed to: 0x...
USDT address: 0x...
Withdrawal address: 0x...
```

请保存 NFT 合约地址，后面需要用到。

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
forge verify-contract <合约地址> TAONFT --chain-id 56 --watch --constructor-args $(cast abi-encode "constructor(address,address)" "<USDT地址>" "<提取地址>")
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
- Prepare a BSC wallet address with sufficient BNB (for contract deployment)
- Prepare a wallet address for USDT withdrawal (for collecting user payments)
- Export the deployment account's private key (keep it secure)

3. Configure Environment Variables
```bash
cd nft-contracts
cp .env.example .env
```

Edit `.env` file:
```env
PRIVATE_KEY=your_private_key_here (with 0x prefix)
USDT_ADDRESS=0x55d398326f99059fF775485246999027B3197955
WITHDRAWAL_ADDRESS=address_for_usdt_withdrawal
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

After successful deployment, you'll see the following information in the console:
```
NFT contract deployed to: 0x...
USDT address: 0x...
Withdrawal address: 0x...
```

Save the NFT contract address for later use.

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
forge verify-contract <contract_address> TAONFT --chain-id 56 --watch --constructor-args $(cast abi-encode "constructor(address,address)" "<USDT_ADDRESS>" "<WITHDRAWAL_ADDRESS>")
```

## 合约功能说明 / Contract Features

### 中文说明

该 NFT 合约具有以下特点：
1. 支持使用 USDT 铸造 NFT
2. 每个 NFT 都记录了铸造时支付的 USDT 金额
3. NFT 图片使用固定的 IPFS 地址：`ipfs://QmZFTnWLjPDMSzesTfxugFhsktVyf6i2GJstecAEXyqtYm?filename=taoai.png`
4. NFT 名称为 "TAO Private Placement"，符号为 "TAO"
5. 支持指定地址提取合约中的 USDT（只有部署时指定的地址可以提取）

### English Description

The NFT contract has the following features:
1. Supports minting NFTs using USDT
2. Each NFT records the USDT amount paid during minting
3. NFT image uses a fixed IPFS address: `ipfs://QmZFTnWLjPDMSzesTfxugFhsktVyf6i2GJstecAEXyqtYm?filename=taoai.png`
4. NFT name is "TAO Private Placement" with symbol "TAO"
5. Supports USDT withdrawal to a designated address (only the address specified during deployment can withdraw)

## 常见问题 / FAQ

### 中文

Q: 为什么部署失败？
A: 请检查：
1. 私钥是否正确配置
2. 账户是否有足够的 BNB
3. RPC 节点是否可用
4. 提取地址是否正确配置

Q: 如何查看已部署的合约？
A: 可以在 BSCScan (https://bscscan.com) 上搜索合约地址

Q: 如何提取合约中的 USDT？
A: 使用部署时指定的提取地址调用合约的 `withdrawUSDT` 函数即可

### English

Q: Why does deployment fail?
A: Please check:
1. If private key is correctly configured
2. If account has sufficient BNB
3. If RPC node is available
4. If withdrawal address is correctly configured

Q: How to view deployed contract?
A: You can search the contract address on BSCScan (https://bscscan.com)

Q: How to withdraw USDT from the contract?
A: Call the `withdrawUSDT` function using the withdrawal address specified during deployment