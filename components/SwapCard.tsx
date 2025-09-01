"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { ArrowDownUp, Loader2, AlertCircle, Settings, TrendingUp, Zap, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import TokenSelector from "./TokenSelector"
import QuoteDisplay from "./QuoteDisplay"
import { getQuote, executeSwap } from "@/utils/jupiter"
import { SOL_TOKEN, GOLD_TOKEN } from "@/constants/tokens"
import { useWalletBalance } from "@/hooks/useWalletBalance"
import { useTransactions, useTheme, useLanguage } from "@/components/providers/WalletContextProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"

export default function SwapCard() {
  const { connected, publicKey } = useWallet()
  const { connection } = useConnection()
  const [inputAmount, setInputAmount] = useState("")
  const [slippage, setSlippage] = useState(1)
  const [fromToken, setFromToken] = useState(SOL_TOKEN)
  const [toToken, setToToken] = useState(GOLD_TOKEN)
  const [quote, setQuote] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSwapping, setIsSwapping] = useState(false)
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [autoAdjustSlippage, setAutoAdjustSlippage] = useState(false)
  const [gasEstimate, setGasEstimate] = useState("0.000005")
  const [priceImpact, setPriceImpact] = useState("< 0.01%")
  const [totalVolume, setTotalVolume] = useState("$2.85B")
  const [dailyVolume, setDailyVolume] = useState("$847M")
  const [swapProgress, setSwapProgress] = useState(0)
  const [swapStatus, setSwapStatus] = useState<'idle' | 'preparing' | 'signing' | 'confirming' | 'success' | 'error'>('idle')
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral')
  const [lastPrice, setLastPrice] = useState<number | null>(null)
  const { refreshBalances } = useWalletBalance()
  const { addTransaction, updateTransaction } = useTransactions()
  const { toast } = useToast()
  const { theme } = useTheme()
  const { t } = useLanguage()
  const isDarkTheme = theme === "dark"

  // Ref to track if component is mounted
  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Price direction tracking
  useEffect(() => {
    if (quote && quote.outAmount) {
      const currentPrice = Number(quote.outAmount) / 10 ** (toToken?.decimals || 9)
      if (lastPrice !== null) {
        if (currentPrice > lastPrice) {
          setPriceDirection('up')
        } else if (currentPrice < lastPrice) {
          setPriceDirection('down')
        } else {
          setPriceDirection('neutral')
        }
      }
      setLastPrice(currentPrice)
    }
  }, [quote, toToken, lastPrice])

  const fetchQuote = useCallback(async () => {
    if (!inputAmount || Number.parseFloat(inputAmount) <= 0) {
      setQuote(null)
      return
    }

    // Check if tokens are properly defined
    if (!fromToken?.mint || !toToken?.mint) {
      setError("Token information not available")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const amount = Number.parseFloat(inputAmount) * 10 ** (fromToken?.decimals || 9)
      const quoteResponse = await getQuote({
        inputMint: fromToken?.mint || '',
        outputMint: toToken?.mint || '',
        amount: amount.toString(),
        slippageBps: slippage * 100, // Convert percentage to basis points
      })

      if (isMounted.current) {
        setQuote(quoteResponse)

        // Calculate price impact from the quote response
        if (quoteResponse.priceImpactPct) {
          const impact = Number.parseFloat(quoteResponse.priceImpactPct)
          if (impact < 0.01) {
            setPriceImpact("< 0.01%")
          } else if (impact < 0.1) {
            setPriceImpact("< 0.1%")
          } else if (impact < 1) {
            setPriceImpact(`~${impact.toFixed(2)}%`)
          } else {
            setPriceImpact(`${impact.toFixed(2)}%`)
          }
        } else {
          // Fallback calculation if priceImpactPct is not provided
          const inAmount = Number(quoteResponse.inAmount) / 10 ** (fromToken?.decimals || 9)
          const outAmount = Number(quoteResponse.outAmount) / 10 ** (toToken?.decimals || 9)
          const marketPrice = inAmount / outAmount
          const executionPrice = inAmount / (outAmount * (1 - slippage / 100))
          const impact = ((executionPrice - marketPrice) / marketPrice) * 100

          if (impact < 0.01) {
            setPriceImpact("< 0.01%")
          } else if (impact < 0.1) {
            setPriceImpact("< 0.1%")
          } else if (impact < 1) {
            setPriceImpact(`~${impact.toFixed(2)}%`)
          } else {
            setPriceImpact(`${impact.toFixed(2)}%`)
          }
        }

        // Auto-adjust slippage if enabled
        if (autoAdjustSlippage) {
          let recommendedSlippage = 0.5
          const impact = Number.parseFloat(quoteResponse.priceImpactPct || "0")
          if (impact > 1) recommendedSlippage = 1.5
          if (impact > 3) recommendedSlippage = 3
          if (impact > 5) recommendedSlippage = 5

          if (recommendedSlippage !== slippage) {
            setSlippage(recommendedSlippage)
          }
        }

        // Estimate gas cost
        setGasEstimate("0.000005") // Fixed estimate for now
      }
    } catch (err) {
      console.error("Error fetching quote:", err)
      if (isMounted.current) {
        setError("Failed to fetch quote. Please try again.")
        setQuote(null)
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }
  }, [inputAmount, fromToken, toToken, slippage, autoAdjustSlippage])

  useEffect(() => {
    if (connected && inputAmount && Number.parseFloat(inputAmount) > 0) {
      const debounce = setTimeout(() => {
        fetchQuote()
      }, 500)

      return () => clearTimeout(debounce)
    } else {
      setQuote(null)
    }
  }, [connected, inputAmount, fromToken, toToken, slippage, fetchQuote])

  const handleSwapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setInputAmount("")
    setQuote(null)
  }

  const handleInputChange = (value: string) => {
    // Only allow numbers and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInputAmount(value)
    }
  }

  const handleMaxClick = () => {
    if (fromToken?.balance && fromToken?.mint) {
      // Set max amount with a small buffer for transaction fees if SOL
      const maxAmount = (fromToken?.mint || '') === SOL_TOKEN.mint ? Math.max(0, (fromToken?.balance || 0) - 0.01) : (fromToken?.balance || 0)
      setInputAmount(maxAmount.toString())
    }
  }

  const simulateSwapProgress = () => {
    setSwapProgress(0)
    setSwapStatus('preparing')
    
    // Simulate progress steps
    const steps = [
      { progress: 25, status: 'preparing', delay: 500 },
      { progress: 50, status: 'signing', delay: 1000 },
      { progress: 75, status: 'confirming', delay: 1500 },
      { progress: 100, status: 'success', delay: 2000 }
    ]
    
    steps.forEach(({ progress, status, delay }) => {
      setTimeout(() => {
        setSwapProgress(progress)
        setSwapStatus(status as any)
      }, delay)
    })
  }

  const handleSwap = async () => {
    if (!connected || !publicKey || !quote) return

    setIsSwapping(true)
    setError("")
    simulateSwapProgress()

    // Create a transaction record
    const txId = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const txRecord = {
      id: txId,
      fromToken: fromToken?.symbol || 'SOL',
      toToken: toToken?.symbol || 'GOLD',
      fromAmount: Number(inputAmount),
      toAmount: Number(quote.outAmount) / 10 ** (toToken?.decimals || 9),
      status: "pending" as const,
      timestamp: Date.now(),
    }

    // Add to transaction history
    addTransaction(txRecord)

    try {
      // Execute the swap
      const result = await executeSwap({
        inputMint: fromToken?.mint || '',
        outputMint: toToken?.mint || '',
        amount: (Number.parseFloat(inputAmount) * 10 ** (fromToken?.decimals || 9)).toString(),
        slippageBps: slippage * 100,
        userPublicKey: publicKey.toString(),
        quote,
      }, publicKey)

      if (result.success && result.signature) {
        // Update transaction status
        updateTransaction(txId, {
          status: "completed",
          signature: result.signature,
        })

        // Show success toast
        toast({
          title: "Swap Successful",
          description: (
            <div className="space-y-1">
              <p>Swapped {inputAmount} {fromToken?.symbol || 'Token'} to{" "}
              {(Number(quote.outAmount) / 10 ** (toToken?.decimals || 9)).toFixed(4)} {toToken?.symbol || 'Token'}</p>
              <p className="text-xs text-gray-500">Signature: {result.signature?.slice(0, 8)}...{result.signature?.slice(-8)}</p>
            </div>
          ),
        })

        // Reset form
        setInputAmount("")
        setQuote(null)

        // Refresh balances
        refreshBalances()
      } else {
        // Update transaction status
        updateTransaction(txId, {
          status: "failed",
          error: result.error || "Unknown error",
        })

        throw new Error(result.error || "Swap failed")
      }
    } catch (err: any) {
      console.error("Swap error:", err)
      setSwapStatus('error')
      
      // Update transaction status
      updateTransaction(txId, {
        status: "failed",
        error: err.message || "Unknown error",
      })

      toast({
        variant: "destructive",
        title: "Swap Failed",
        description: err.message || "Failed to execute swap. Please try again.",
      })

      setError(err.message || "Failed to execute swap. Please try again.")
    } finally {
      setTimeout(() => {
        setIsSwapping(false)
        setSwapProgress(0)
        setSwapStatus('idle')
      }, 1000)
    }
  }

  const insufficientBalance = fromToken?.balance && Number(inputAmount) > (fromToken?.balance || 0)
  const canSwap =
    connected &&
    inputAmount &&
    Number.parseFloat(inputAmount) > 0 &&
    quote &&
    !insufficientBalance &&
    !isLoading &&
    !isSwapping

  const getStatusIcon = () => {
    switch (swapStatus) {
      case 'preparing': return <Clock className="h-4 w-4" />
      case 'signing': return <Zap className="h-4 w-4" />
      case 'confirming': return <Loader2 className="h-4 w-4 animate-spin" />
      case 'success': return <CheckCircle className="h-4 w-4" />
      case 'error': return <AlertTriangle className="h-4 w-4" />
      default: return null
    }
  }

  const getStatusText = () => {
    switch (swapStatus) {
      case 'preparing': return 'Preparing transaction...'
      case 'signing': return 'Please sign the transaction'
      case 'confirming': return 'Confirming on blockchain...'
      case 'success': return 'Swap completed successfully!'
      case 'error': return 'Swap failed'
      default: return ''
    }
  }

  const getPriceDirectionColor = () => {
    switch (priceDirection) {
      case 'up': return 'text-green-400'
      case 'down': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="w-full max-w-md mx-auto relative"
    >
      {/* Elegant Background Effects */}
      <div className="absolute -inset-4 bg-gradient-to-r from-amber-600/12 via-violet-600/12 to-slate-400/12 rounded-3xl blur-xl opacity-60 animate-pulse" />
      <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-purple-400 to-slate-400 rounded-2xl blur opacity-40 animate-rotate-glow" />
      
      <div className="relative super-premium-card border cyber-border bg-gradient-to-br from-slate-900/95 via-violet-900/20 to-slate-900/95 overflow-hidden rounded-2xl shadow-2xl border-amber-500/20">
        {/* Animated Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-500/3 to-transparent animate-holographic" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent animate-shimmer" />
        
        <div className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <motion.h2 
              className="text-xl font-bold holographic-text animate-neon-glow"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <span className="bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent">
                {t("swap")}
              </span>
            </motion.h2>
            <Dialog>
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold to-purple-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300" />
                  <Button variant="ghost" size="icon" className="relative rounded-full cyber-border bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gold/20 hover:to-purple-500/20">
                    <Settings className="h-4 w-4 text-gold animate-sparkle" />
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="super-premium-card border cyber-border bg-gradient-to-br from-gray-900/98 via-purple-900/35 to-gray-900/98">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gold/5 to-transparent animate-holographic" />
                <DialogHeader className="relative z-10">
                  <DialogTitle className="holographic-text animate-neon-glow text-xl font-bold">
                    <span className="bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent">
                      Swap Settings
                    </span>
                  </DialogTitle>
                  <DialogDescription className="premium-text animate-floating">
                    Customize your swap experience
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <Label className={`text-sm font-medium ${isDarkTheme ? "text-white" : "text-gray-900"}`}>
                      Slippage Tolerance: {slippage}%
                    </Label>
                    <div className="mt-2">
                      <Slider
                        value={[slippage]}
                        onValueChange={(value) => setSlippage(value[0])}
                        max={10}
                        min={0.1}
                        step={0.1}
                        className="w-full"
                        disabled={autoAdjustSlippage}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.1%</span>
                        <span>10%</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {[0.5, 1, 2, 5].map((value) => (
                          <button
                            key={value}
                            onClick={() => setSlippage(value)}
                            className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                              slippage === value
                                ? "bg-gold text-black border-gold"
                                : isDarkTheme
                                ? "bg-gray-800 text-white border-gray-700 hover:border-gray-600"
                                : "bg-gray-100 text-gray-900 border-gray-300 hover:border-gray-400"
                            }`}
                            disabled={autoAdjustSlippage}
                          >
                            {value}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="auto-slippage" checked={autoAdjustSlippage} onCheckedChange={setAutoAdjustSlippage} />
                    <Label htmlFor="auto-slippage" className={isDarkTheme ? "text-white" : "text-gray-900"}>
                      Auto-Adjust Slippage
                    </Label>
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <motion.div 
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TokenSelector
              selectedToken={fromToken}
              onSelectToken={setFromToken}
              balance={fromToken?.balance}
              onMaxClick={handleMaxClick}
              label={t("pay_with")}
            />
            <div className="relative flex justify-center my-2">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -translate-y-1/2 rounded-full shadow-md border border-gold/30 hover:border-gold/50 transition-colors bg-gradient-to-r from-gold/10 to-yellow-400/10"
                  onClick={handleSwapTokens}
                >
                  <ArrowDownUp className="h-5 w-5 text-gold" />
                </Button>
              </motion.div>
            </div>
            <TokenSelector selectedToken={toToken} onSelectToken={setToToken} label={t("you_receive")} />
            <div className="relative mt-2">
              <Input
                type="text"
                placeholder="0.0"
                value={inputAmount}
                onChange={(e) => handleInputChange(e.target.value)}
                className="text-right pr-16"
              />
              {quote && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 ${getPriceDirectionColor()}`}
                >
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">
                    {((Number(quote.outAmount) / 10 ** (toToken?.decimals || 9)) / Number(inputAmount)).toFixed(4)}
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {insufficientBalance && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-sm text-red-500 mt-2"
              >
                <AlertCircle className="h-4 w-4" />
                {t("insufficient_balance")}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-sm text-red-500 mt-2"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {quote && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <div className={`p-3 rounded-lg ${isDarkTheme ? "bg-gray-800/50" : "bg-gray-50"} space-y-2`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Rate</span>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-medium ${getPriceDirectionColor()}`}>
                      1 {fromToken?.symbol} = {((Number(quote.outAmount) / 10 ** (toToken?.decimals || 9)) / Number(inputAmount)).toFixed(4)} {toToken?.symbol}
                    </span>
                    <TrendingUp className={`h-3 w-3 ${getPriceDirectionColor()}`} />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Price Impact</span>
                  <Badge variant={priceImpact.includes('<') ? 'default' : 'destructive'} className="text-xs">
                    {priceImpact}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Network Fee</span>
                  <span className="text-sm font-medium">{gasEstimate} SOL</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Swap Progress */}
          <AnimatePresence>
            {isSwapping && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 rounded-lg bg-gradient-to-r from-gold/10 to-yellow-400/10 border border-gold/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon()}
                  <span className="text-sm font-medium text-gold">{getStatusText()}</span>
                </div>
                <Progress value={swapProgress} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">{swapProgress}% complete</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Volume Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-4 p-4 rounded-xl premium-card border border-yellow-500/30"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">24h Volume</div>
                <div className="text-lg font-bold premium-text">{dailyVolume}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Total Volume</div>
                <div className="text-lg font-bold premium-text">{totalVolume}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-green-400">
              <TrendingUp className="h-3 w-3" />
              <span>+284.7% from last month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600 hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-500 text-black font-bold shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-400/50 transition-all duration-300 transform hover:scale-105 border-2 border-yellow-300/50 hover:border-yellow-200" 
              onClick={handleSwap} 
              disabled={!canSwap}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("getting_quote")}
                </>
              ) : isSwapping ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("swapping")}
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  {t("swap")}
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
