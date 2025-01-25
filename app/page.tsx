"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { connectWallet, type WalletType } from "@/lib/wallet"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function Page() {
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function handleConnect(type: WalletType) {
    setIsConnecting(true)
    try {
      const account = await connectWallet(type)
      toast({
        title: "连接成功",
        description: `钱包地址: ${account.slice(0, 6)}...${account.slice(-4)}`,
      })
      router.push("/donate")
    } catch (error: any) {
      console.error("Wallet connection error:", error)
      toast({
        variant: "destructive",
        title: "连接失败",
        description: error.message || "无法连接钱包，请稍后再试",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-[#000000]">
      <h1 className="text-3xl md:text-4xl font-bold text-[#ffffff] mb-4">与TAO一起共建新一代</h1>
      <h2 className="text-4xl md:text-5xl font-bold text-[#ffffff] mb-12">AI Agent!</h2>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="lg"
            disabled={isConnecting}
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
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">选择钱包</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Button
              variant="outline"
              className="text-lg py-6"
              onClick={() => handleConnect("metamask")}
              disabled={isConnecting}
            >
              MetaMask
              {isConnecting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
            <Button
              variant="outline"
              className="text-lg py-6"
              onClick={() => handleConnect("tp")}
              disabled={isConnecting}
            >
              TokenPocket
              {isConnecting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

