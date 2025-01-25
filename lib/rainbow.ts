import '@rainbow-me/rainbowkit/styles.css'
import {
  getDefaultConfig,
  RainbowKitProvider,
  Chain,
} from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DEFAULT_NETWORK } from './config'
import { http, createConfig } from 'wagmi'

// 根据环境决定支持的链
const isDev = process.env.NODE_ENV === 'development'
const isTestnet = DEFAULT_NETWORK === 'testnet'
console.log('RainbowKit Environment:', { isDev, isTestnet, DEFAULT_NETWORK })

// 确保类型正确
const chains = [isDev && isTestnet ? bscTestnet : bsc] as const

// 为每个链配置 transport
const transports = Object.fromEntries(
  chains.map((chain) => [chain.id, http()])
)

export const config = getDefaultConfig({
    appName: 'TAO AI Agent',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'tao-ai-agent',
    chains,
    transports,
    ssr: true,
})