"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from "viem"
import { USDT_CONTRACT_ADDRESS, DONATION_RECIPIENT_ADDRESS, USDT_ABI } from "@/lib/wallet"

const USDT_CONTRACT = {
  address: USDT_CONTRACT_ADDRESS as `0x${string}`,
  abi: USDT_ABI,
} as const

export default function DonatePage() {
  const [amount, setAmount] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const { isConnected } = useAccount()

  const {
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  async function handleDonate() {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "无效金额",
        description: "请输入大于 0 的有效 USDT 金额",
      })
      return
    }

    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "未连接钱包",
        description: "请先连接钱包",
      })
      return
    }

    try {
      writeContract({
        ...USDT_CONTRACT,
        functionName: 'transfer',
        args: [DONATION_RECIPIENT_ADDRESS as `0x${string}`, parseUnits(amount, 18)], // BSC USDT uses 18 decimals
      })

      toast({
        title: "交易已发送",
        description: "请在钱包中确认交易",
      })
    } catch (err: any) {
      console.error("Donation error:", err)
      let errorMessage = "发生错误，请稍后再试"

      if (err.message.includes("insufficient")) {
        errorMessage = "USDT 余额不足，请确保您有足够的 USDT"
      } else if (err.message.includes("rejected")) {
        errorMessage = "您取消了交易"
      }

      toast({
        variant: "destructive",
        title: "支付失败",
        description: errorMessage,
      })
    }
  }

  useEffect(() => {
    if (isSuccess && hash) {
      toast({
        title: "支付成功",
        description: `感谢您支付 ${amount} USDT`,
      })
      router.push(`/thank-you?amount=${encodeURIComponent(amount)}`)
    }
  }, [isSuccess, hash, amount, router, toast])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-[#000000]">
      <h1 className="text-3xl md:text-4xl font-bold text-[#ffffff] mb-8">支付 USDT</h1>
      <div className="mb-8">
        <ConnectButton />
      </div>
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
          disabled={isPending || isConfirming}
          className="w-full bg-[#c6f432] hover:bg-[#c6f432]/90 text-[#000000] font-medium"
        >
          {isPending || isConfirming ? "处理中..." : "确认捐赠"}
        </Button>
        {error && (
          <div className="mt-2 text-red-500">
            错误: {error.message}
          </div>
        )}
      </form>
    </main>
  )
}


