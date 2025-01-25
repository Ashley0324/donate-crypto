import type { InjectedWindow } from "@metamask/providers"

declare global {
  interface Window extends InjectedWindow {
    TokenPocket?: any
  }
}

export type WalletType = "metamask" | "tp"

const BSC_CHAIN_ID = "0x38" // BSC Mainnet

export async function connectWallet(type: WalletType): Promise<string> {
  let provider: any

  if (type === "metamask") {
    if (!window.ethereum) {
      throw new Error("请先安装 MetaMask")
    }
    provider = window.ethereum
  } else if (type === "tp") {
    if (!window.TokenPocket) {
      throw new Error("请先安装 TokenPocket")
    }
    provider = window.TokenPocket
  } else {
    throw new Error("不支持的钱包类型")
  }

  try {
    const accounts = await provider.request({
      method: "eth_requestAccounts",
    })

    await switchToBSCNetwork(provider)

    return accounts[0]
  } catch (error: any) {
    throw new Error(error.message || "连接钱包失败")
  }
}

async function switchToBSCNetwork(provider: any) {
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BSC_CHAIN_ID }],
    })
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: BSC_CHAIN_ID,
              chainName: "Binance Smart Chain",
              nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18,
              },
              rpcUrls: ["https://bsc-dataseed.binance.org/"],
              blockExplorerUrls: ["https://bscscan.com/"],
            },
          ],
        })
      } catch (addError) {
        throw new Error("无法添加或切换到 BSC 网络")
      }
    } else {
      throw switchError
    }
  }
}

export const USDT_CONTRACT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955" // BSC USDT
export const DONATION_RECIPIENT_ADDRESS = "0x858b901D85310d0706CD9F9bE395a8c46168A7F8" // 接收捐赠的地址

export const USDT_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
] as const

