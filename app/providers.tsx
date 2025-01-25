'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css'
import {
  RainbowKitProvider,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { bsc } from 'wagmi/chains'

const config = createConfig({
  chains: [bsc],
  transports: {
    [bsc.id]: http(),
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}