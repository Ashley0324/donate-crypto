import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'TAO AI Agent',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains: [mainnet],
  ssr: true,
})