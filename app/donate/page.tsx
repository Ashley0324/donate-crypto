"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError
} from 'wagmi'
import { parseUnits, formatUnits } from "viem"
import { USDT_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS, USDT_ABI, NFT_ABI } from "@/lib/wallet"
import type { Hex } from 'viem'

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
  const [formattedBalance, setFormattedBalance] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const { address, isConnected } = useAccount()

  // Check USDT balance
  const { data: balance } = useReadContract({
    ...USDT_CONTRACT,
    functionName: 'balanceOf',
    args: address ? [address as Hex] : undefined,
    query: {
      enabled: Boolean(address),
    }
  })

  // Update formatted balance when balance changes
  useEffect(() => {
    if (typeof balance === 'bigint') {
      const formatted = Number(formatUnits(balance, 18)).toLocaleString()
      setFormattedBalance(formatted)
    } else {
      setFormattedBalance("")
    }
  }, [balance])

  // USDT Approval
  const { writeContractAsync: writeApproval, isPending: isApproving } = useWriteContract()

  // NFT Minting
  const { writeContractAsync: writeMint, isPending: isMinting } = useWriteContract()

  // Transaction states
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>()
  const [mintHash, setMintHash] = useState<`0x${string}` | undefined>()

  // Transaction receipts
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalSuccess } = useWaitForTransactionReceipt({
    hash: approvalHash,
  })

  const { isLoading: isMintConfirming, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({
    hash: mintHash,
  })

  // Watch for approval success and trigger mint
  useEffect(() => {
    if (isApprovalSuccess && approvalHash) {
      console.log("Approval successful, proceeding to mint")
      handleMint()
    }
  }, [isApprovalSuccess, approvalHash])

  async function handleApprove() {
    console.log("handleApprove called")
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "无效金额",
        description: "请输入大于 0 的有效 USDT 金额",
        duration: 3000,
      })
      return
    }

    if (!isConnected || !address) {
      toast({
        variant: "destructive",
        title: "未连接钱包",
        description: "请先连接钱包",
        duration: 3000,
      })
      return
    }

    try {
      const amountInWei = parseUnits(amount, 18)
      const userBalance = (balance as bigint) || BigInt(0)

      // Check if user has enough balance
      if (userBalance < amountInWei) {
        toast({
          variant: "destructive",
          title: "余额不足",
          description: `您的 USDT 余额为 ${formattedBalance}，不足以支付 ${amount} USDT`,
          duration: 3000,
        })
        return
      }

      toast({
        title: "通知",
        description: "请在钱包中确认授权交易",
        duration: 5000,
      })

      const hash = await writeApproval({
        address: USDT_CONTRACT_ADDRESS as Hex,
        abi: USDT_ABI,
        functionName: 'approve',
        args: [NFT_CONTRACT_ADDRESS as Hex, amountInWei],
      })
      console.log("Approval hash:", hash)
      setApprovalHash(hash)

      toast({
        title: "交易已发送",
        description: "授权交易已提交到区块链，请等待确认",
        duration: 5000,
      })
    } catch (err: BaseError | any) {
      console.error("Approval error:", err)
      let errorMessage = "授权时发生错误"

      if (err.message.includes("insufficient funds")) {
        errorMessage = "钱包余额不足以支付 Gas 费用"
      } else if (err.message.includes("rejected")) {
        errorMessage = "您取消了交易"
      } else if (err.message.includes("internal error")) {
        errorMessage = "网络拥堵，请稍后重试"
      }

      toast({
        variant: "destructive",
        title: "授权失败",
        description: errorMessage,
        duration: 5000,
      })
    }
  }

  async function handleMint() {
    console.log("handleMint called")
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "无效金额",
        description: "请输入大于 0 的有效 USDT 金额",
        duration: 3000,
      })
      return
    }

    if (!isConnected || !address) {
      toast({
        variant: "destructive",
        title: "未连接钱包",
        description: "请先连接钱包",
        duration: 3000,
      })
      return
    }

    try {
      toast({
        title: "通知",
        description: "请在钱包中确认铸造交易",
        duration: 5000,
      })

      const amountInWei = parseUnits(amount, 18)
      const hash = await writeMint({
        address: NFT_CONTRACT_ADDRESS as Hex,
        abi: NFT_ABI,
        functionName: 'mint',
        args: [amountInWei],
      })
      console.log("Mint hash:", hash)
      setMintHash(hash)

      toast({
        title: "交易已发送",
        description: "铸造交易已提交到区块链，请等待确认",
        duration: 5000,
      })
    } catch (err: BaseError | any) {
      console.error("Mint error:", err)
      let errorMessage = "铸造时发生错误"

      if (err.message.includes("insufficient funds")) {
        errorMessage = "钱包余额不足以支付 Gas 费用"
      } else if (err.message.includes("rejected")) {
        errorMessage = "您取消了交易"
      } else if (err.message.includes("internal error")) {
        errorMessage = "网络拥堵，请稍后重试"
      }

      toast({
        variant: "destructive",
        title: "铸造失败",
        description: errorMessage,
        duration: 5000,
      })
    }
  }

  // Watch for mint success
  useEffect(() => {
    if (isMintSuccess && mintHash) {
      toast({
        title: "铸造成功",
        description: `感谢您支付 ${amount} USDT 铸造 TAO NFT`,
        duration: 5000,
      })
      router.push(`/thank-you?amount=${encodeURIComponent(amount)}`)
    }
  }, [isMintSuccess, mintHash, amount, router, toast])

  const isLoading = isApproving || isApprovalConfirming || isMinting || isMintConfirming

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-[#000000]">
        <h1 className="text-3xl md:text-4xl font-bold text-[#ffffff] mb-8">铸造 TAO NFT</h1>
        <div className="mb-8">
          <ConnectButton />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleApprove()
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
            className="mb-4"
            min="0"
            step="any"
            required
          />
          {formattedBalance && (
            <div className="mb-4 text-sm text-gray-400">
              <div>余额: {formattedBalance} USDT</div>
            </div>
          )}
          <Button
            type="submit"
            disabled={!isConnected || !address || isLoading || !amount}
            className="w-full bg-[#c6f432] hover:bg-[#c6f432]/90 text-[#000000] font-medium"
          >
            {isLoading
              ? (isApprovalConfirming
                ? "授权中..."
                : "铸造中...")
              : "铸造 NFT"}
          </Button>
        </form>
      </main>
      <Toaster />
    </>
  )
}


