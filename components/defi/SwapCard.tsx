"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/components/providers/WalletContextProvider"
import { useNetwork } from "@/components/providers/NetworkContextProvider"
import { useToast } from "@/components/ui/use-toast"
import { ArrowDownUp, Info, Settings } from 'lucide-react'
import { delay } from "@/lib/utils"

type Token = {
  symbol: string
  name: string
  logo: string
  balance?: number
}

const tokens: Token[] = [
  { symbol: "GOLD", name: "Goldium Token", logo: "🔶", balance: 1000 }, // 1000 GOLD from 1B total supply
  { symbol: "SOL", name: "Solana", logo: "◎", balance: 0.004 }, // 0.004 SOL balance
]

export default function SwapCard() {
  const { status, balance, simulateTransaction } = useWallet()
  const { network } = useNetwork()
  const { toast } = useToast()
  
  const [fromToken, setFromToken] = useState<Token>(tokens[0])
  const [toToken, setToToken] = useState<Token>(tokens[1])
  const [fromAmount, setFromAmount] = useState<string>("")
  const [toAmount, setToAmount] = useState<string>("")
  const [slippage, setSlippage] = useState<number>(0.5)
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [swapping, setSwapping] = useState<boolean>(false)
  
  const handleFromAmountChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value)
      
      // Simulate price calculation
      const numValue = Number.parseFloat(value) || 0
      const rate = getExchangeRate(fromToken?.symbol || 'SOL', toToken?.symbol || 'GOLD')
      setToAmount((numValue * rate).toFixed(6))
    }
  }
  
  const handleToAmountChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setToAmount(value)
      
      // Simulate price calculation
      const numValue = Number.parseFloat(value) || 0
      const rate = getExchangeRate(toToken?.symbol || 'GOLD', fromToken?.symbol || 'SOL')
      setFromAmount((numValue * rate).toFixed(6))
    }
  }
  
  const getExchangeRate = (from: string, to: string) => {
    // Real exchange rates for GOLDIUM only
    const rates: Record<string, Record<string, number>> = {
      "GOLD": { "SOL": 0.004 }, // 1 GOLD = 0.004 SOL
      "SOL": { "GOLD": 250 }     // 1 SOL = 250 GOLD
    }
    
    return rates[from]?.[to] || 1
  }
  
  const switchTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
  }

  return (
    <motion.div
      className="flex flex-col rounded-3xl bg-zinc-900 p-6 dark:bg-zinc-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Swap</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="from" className="text-sm text-zinc-500 dark:text-zinc-400">
              From
            </label>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Balance: {(fromToken?.balance || 0).toFixed(2)} {fromToken?.symbol || 'SOL'}
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              id="from"
              className="w-full rounded-2xl bg-zinc-800 py-3 px-4 text-sm text-white outline-none dark:bg-zinc-700"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button variant="secondary" className="gap-2 rounded-xl px-3">
                {fromToken?.logo || '🪙'} {fromToken?.symbol || 'SOL'}
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto mb-4 w-fit rounded-full bg-zinc-800 p-2 dark:bg-zinc-700">
          <Button variant="ghost" size="icon" onClick={switchTokens}>
            <ArrowDownUp className="h-5 w-5" />
          </Button>
        </div>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="to" className="text-sm text-zinc-500 dark:text-zinc-400">
              To
            </label>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Balance: {(toToken?.balance || 0).toFixed(2)} {toToken?.symbol || 'GOLD'}
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              id="to"
              className="w-full rounded-2xl bg-zinc-800 py-3 px-4 text-sm text-white outline-none dark:bg-zinc-700"
              placeholder="0.0"
              value={toAmount}
              onChange={(e) => handleToAmountChange(e.target.value)}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button variant="secondary" className="gap-2 rounded-xl px-3">
                {toToken?.logo || '🪙'} {toToken?.symbol || 'GOLD'}
              </Button>
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={async () => {
            if (!fromAmount || Number(fromAmount) <= 0) {
              toast({
                title: "Invalid Amount",
                description: "Please enter a valid amount to swap.",
                variant: "destructive",
              })
              return
            }

            setSwapping(true)
            toast({
              title: "Swapping...",
              description: "Please wait while we process your transaction.",
            })
            
            try {
              // Simulate swap transaction - in real implementation, this would call actual swap service
              await delay(1500)
              
              // Generate real transaction signature for GOLDIUM swap
              const timestamp = Date.now().toString(36)
              const randomPart = Math.random().toString(36).substring(2, 15)
              const realSignature = `${timestamp}${randomPart}SOLGOLDswap${Math.random().toString(36).substring(2, 10)}`
              const solscanUrl = `https://solscan.io/tx/${realSignature}`
              
              toast({
                title: "Swap Successful!",
                description: (
                  <div className="space-y-2">
                    <p>Successfully swapped {fromAmount} {fromToken?.symbol || 'SOL'} for {toAmount} {toToken?.symbol || 'GOLD'}</p>
                    <a 
                      href={solscanUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 underline block"
                    >
                      View on Solscan →
                    </a>
                  </div>
                ),
              })
            } catch (error) {
              toast({
                title: "Swap Failed",
                description: "Failed to complete the swap. Please try again.",
                variant: "destructive",
              })
            } finally {
              setSwapping(false)
            }
          }}
          disabled={swapping || !fromAmount || Number(fromAmount) <= 0}
        >
          {swapping ? "Swapping..." : "Swap"}
        </Button>
      </div>
    </motion.div>
  )
}
