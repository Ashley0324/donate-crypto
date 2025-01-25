'use client'

import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { WagmiConfig } from 'wagmi'
import { config } from '@/lib/rainbow'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider theme={darkTheme()}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}