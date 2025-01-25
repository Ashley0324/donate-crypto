"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

// 创建一个客户端专用组件
function ClientContent() {
  const searchParams = useSearchParams()
  const amount = searchParams?.get("amount") || "未知数量的"
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (showConfetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#c6f432", "#ffffff", "#979797"],
      })
    }
  }, [showConfetti])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="text-4xl md:text-5xl font-bold text-[#ffffff] mb-8">感谢您的捐赠！</h1>
      <p className="text-xl md:text-2xl text-[#979797] mb-8">您捐赠了 {amount} USDT 来支持 TAO AI Agent 的发展。</p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setShowConfetti(true)}
          className="text-lg px-8 py-4 bg-[#c6f432] hover:bg-[#c6f432]/90 text-[#000000] font-medium rounded-full"
        >
          庆祝一下！
        </Button>
      </motion.div>
    </motion.div>
  )
}

// 主页面组件
export default function ThankYouPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-[#000000]">
      {!isClient ? (
        <div className="text-[#ffffff]">加载中...</div>
      ) : (
        <ClientContent />
      )}
    </main>
  )
}

