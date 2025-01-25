"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ethers } from "ethers"
import { USDT_CONTRACT_ADDRESS, USDT_ABI, DONATION_RECIPIENT_ADDRESS } from "@/lib/wallet"

export default function DonatePage() {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function handleDonate() {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "无效金额",
        description: "请输入大于 0 的有效 USDT 金额",
      })
      return
    }

    setIsLoading(true)

    try {
      if(!window.ethereum) {
        throw new Error("请安装MetaMask或其他Web3钱包")
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, signer)

      const amountWei = ethers.parseUnits(amount, 18)

      const tx = await contract.transfer(DONATION_RECIPIENT_ADDRESS, amountWei)
      await tx.wait()

      toast({
        title: "捐赠成功",
        description: `感谢您捐赠 ${amount} USDT`,
      })

      router.push(`/thank-you?amount=${encodeURIComponent(amount)}`)
    } catch (error: any) {
      console.error("Donation error:", error)
      let errorMessage = "发生错误，请稍后再试"

      if (error.code === "INSUFFICIENT_FUNDS") {
        errorMessage = "USDT 余额不足，请确保您有足够的 USDT"
      } else if (error.code === "ACTION_REJECTED") {
        errorMessage = "您取消了交易"
      }

      toast({
        variant: "destructive",
        title: "捐赠失败",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-[#000000]">
      <h1 className="text-3xl md:text-4xl font-bold text-[#ffffff] mb-8">捐赠 USDT</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleDonate()
        }}
        className="w-full max-w-md"
      >
        <label htmlFor="amount" className="sr-only">
          USDT 金额
        </label>
        <Input
          id="amount"
          type="number"
          placeholder="输入 USDT 金额"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mb-4 text-[#000000]"
          min="0"
          step="any"
          required
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#c6f432] hover:bg-[#c6f432]/90 text-[#000000] font-medium"
        >
          {isLoading ? "处理中..." : "确认捐赠"}
        </Button>
      </form>
    </main>
  )
}

