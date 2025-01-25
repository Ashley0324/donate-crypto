"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function Page() {
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { isConnected } = useAccount()

  useEffect(() => {
    if (isConnected) {
      toast({
        title: "连接成功",
        description: "钱包已连接",
      })
      router.push("/donate")
    }
  }, [isConnected, router, toast])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-[#000000]">
      <h1 className="text-3xl md:text-4xl font-bold text-[#ffffff] mb-4">加入私募计划，与TAO一起共建新一代</h1>
      <h2 className="text-4xl md:text-5xl font-bold text-[#ffffff] mb-12">AI Agent!</h2>

      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted

          if (!ready) return null

          return (
            <Button
              size="lg"
              disabled={isConnecting}
              onClick={openConnectModal}
              className="text-lg px-8 py-6 bg-[#c6f432] hover:bg-[#c6f432]/90 text-[#000000] font-medium rounded-full"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  连接中...
                </>
              ) : (
                "连接钱包"
              )}
            </Button>
             <h4 className="text-4xl md:text-xs font-bold text-[#c6f432] mb-12">LP地址：0x858b901D85310d0706CD9F9bE395a8c46168A7F8</h4>
          )
        }}
      </ConnectButton.Custom>
    </main>
  )
}

