"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseUnits } from "viem"
import { USDT_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS, USDT_ABI, NFT_ABI } from "@/lib/wallet"

const USDT_CONTRACT = {
  address: USDT_CONTRACT_ADDRESS as `0x${string}`,
  abi: USDT_ABI,
} as const

const NFT_CONTRACT = {
  address: NFT_CONTRACT_ADDRESS as `0x${string}`,
  abi: NFT_ABI,
} as const

export default function MintPage() {
  const [amount, setAmount] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const { isConnected } = useAccount()

  // USDT Approval
  const {
    data: approvalHash,
    error: approvalError,
    isPending: isApproving,
    writeContract: writeApproval
  } = useWriteContract()

  // NFT Minting
  const {
    data: mintHash,
    error: mintError,
    isPending: isMinting,
    writeContract: writeMint
  } = useWriteContract()

  // Transaction receipts
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalSuccess } = useWaitForTransactionReceipt({
    hash: approvalHash,
  })

  const { isLoading: isMintConfirming, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({
    hash: mintHash,
  })

  async function handleMint() {
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
      // First approve USDT spending
      writeApproval({
        ...USDT_CONTRACT,
        functionName: 'approve',
        args: [NFT_CONTRACT_ADDRESS as `0x${string}`, parseUnits(amount, 18)],
      })

      toast({
        title: "授权请求已发送",
        description: "请在钱包中确认 USDT 授权",
      })
    } catch (err: any) {
      console.error("Approval error:", err)
      let errorMessage = "发生错误，请稍后再试"

      if (err.message.includes("insufficient")) {
        errorMessage = "USDT 余额不足，请确保您有足够的 USDT"
      } else if (err.message.includes("rejected")) {
        errorMessage = "您取消了授权"
      }

      toast({
        variant: "destructive",
        title: "授权失败",
        description: errorMessage,
      })
    }
  }

  // Watch for approval success and trigger mint
  useEffect(() => {
    if (isApprovalSuccess && approvalHash) {
      try {
        writeMint({
          ...NFT_CONTRACT,
          functionName: 'mint',
          args: [parseUnits(amount, 18)],
        })

        toast({
          title: "铸造请求已发送",
          description: "请在钱包中确认 NFT 铸造",
        })
      } catch (err: any) {
        console.error("Mint error:", err)
        toast({
          variant: "destructive",
          title: "铸造失败",
          description: err.message || "铸造 NFT 时发生错误",
        })
      }
    }
  }, [isApprovalSuccess, approvalHash, amount, writeMint, toast])

  // Watch for mint success
  useEffect(() => {
    if (isMintSuccess && mintHash) {
      toast({
        title: "铸造成功",
        description: `感谢您支付 ${amount} USDT 铸造 TAO NFT`,
      })
      router.push(`/thank-you?amount=${encodeURIComponent(amount)}`)
    }
  }, [isMintSuccess, mintHash, amount, router, toast])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-[#000000]">
      <h1 className="text-3xl md:text-4xl font-bold text-[#ffffff] mb-8">铸造 TAO NFT</h1>
      <div className="mb-8">
        <ConnectButton />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleMint()
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
          disabled={isApproving || isMinting || isApprovalConfirming || isMintConfirming}
          className="w-full bg-[#c6f432] hover:bg-[#c6f432]/90 text-[#000000] font-medium"
        >
          {isApproving || isApprovalConfirming
            ? "授权中..."
            : isMinting || isMintConfirming
            ? "铸造中..."
            : "铸造 NFT"}
        </Button>
        {(approvalError || mintError) && (
          <div className="mt-2 text-red-500">
            错误: {(approvalError || mintError)?.message}
          </div>
        )}
      </form>
    </main>
  )
}


