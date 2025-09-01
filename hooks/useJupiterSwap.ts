"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { VersionedTransaction } from "@solana/web3.js"
import { useTransaction } from "./useTransaction"
import type { Token } from "@/constants/tokens"
import { useToast } from "@/components/ui/use-toast"
import { useNetwork } from "@/components/providers/NetworkContextProvider"

interface SwapRoute {
  inAmount: string
  outAmount: string
  outAmountWithSlippage: string
  priceImpactPct: string
  marketInfos: any[]
  slippageBps: number
}

interface QuoteResponse {
  inputMint: string
  outputMint: string
  inAmount: string
  outAmount: string
  otherAmountThreshold: string
  swapMode: string
  slippageBps: number
  platformFee: any
  priceImpactPct: string
  routePlan: any[]
  contextSlot: number
  timeTaken: number
}

export function useJupiterSwap() {
  const { connection } = useConnection()
  const { publicKey, signTransaction } = useWallet()
  const { sendAndConfirmTransaction, isProcessing } = useTransaction()
  const { toast } = useToast()
  const { network } = useNetwork()

  const [routes, setRoutes] = useState<SwapRoute[]>([])
  const [selectedRoute, setSelectedRoute] = useState<SwapRoute | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [slippage, setSlippage] = useState<number>(100) // 1% default slippage (in basis points)

  // Use a ref to track active requests and prevent race conditions
  const activeRequestRef = useRef<string | null>(null)

  // Get swap routes
  const getRoutes = useCallback(
    async (
      inputToken: Token,
      outputToken: Token,
      amount: number,
      slippageBps = slippage, // Use state slippage by default
    ) => {
      if (!amount || amount <= 0) {
        setRoutes([])
        setSelectedRoute(null)
        return []
      }

      // Generate a unique request ID
      const requestId = Date.now().toString()
      activeRequestRef.current = requestId

      try {
        setIsLoading(true)
        setError(null)

        // Convert amount to input token's smallest unit
        const inputAmount = Math.floor(amount * Math.pow(10, inputToken.decimals)).toString()

        // Fetch quote from Jupiter API
        const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${inputToken.mint}&outputMint=${outputToken.mint}&amount=${inputAmount}&slippageBps=${slippageBps}`

        const response = await fetch(quoteUrl)

        // Check if this is still the active request
        if (activeRequestRef.current !== requestId) {
          return []
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
          console.error("Jupiter API error:", errorData)
          throw new Error(`Failed to fetch swap routes: ${errorData.error || "Unknown error"}`)
        }

        const data = await response.json()

        // Check if this is still the active request
        if (activeRequestRef.current !== requestId) {
          return []
        }

        if (!data.data || data.data.length === 0) {
          setRoutes([])
          setSelectedRoute(null)
          return []
        }

        // Format routes
        const formattedRoutes: SwapRoute[] = data.data.map((route: any) => ({
          inAmount: route.inAmount,
          outAmount: route.outAmount,
          outAmountWithSlippage: route.otherAmountThreshold,
          priceImpactPct: route.priceImpactPct,
          marketInfos: route.marketInfos,
          slippageBps: slippageBps,
        }))

        setRoutes(formattedRoutes)
        setSelectedRoute(formattedRoutes[0]) // Select best route by default
        return formattedRoutes
      } catch (err: any) {
        console.error("Error fetching swap routes:", err)
        setError(err.message || "Failed to fetch swap routes")
        setRoutes([])
        setSelectedRoute(null)
        return []
      } finally {
        // Only update loading state if this is still the active request
        if (activeRequestRef.current === requestId) {
          setIsLoading(false)
        }
      }
    },
    [slippage],
  )

  // Select a specific route
  const selectRoute = useCallback((route: SwapRoute) => {
    setSelectedRoute(route)
  }, [])

  // Execute swap using real Jupiter API
  const executeSwap = useCallback(
    async (inputToken: Token, outputToken: Token, route: SwapRoute) => {
      if (!publicKey || !signTransaction || !route) {
        toast({
          title: "Swap Error",
          description: "Wallet not connected or route not selected",
          variant: "destructive",
        })
        return false
      }

      try {
        setIsSwapping(true)
        setError(null)

        // Get serialized transaction from Jupiter API
        const swapResponse = await fetch("https://quote-api.jup.ag/v6/swap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quoteResponse: {
              inputMint: inputToken.mint,
              outputMint: outputToken.mint,
              inAmount: route.inAmount,
              outAmount: route.outAmount,
              otherAmountThreshold: route.outAmountWithSlippage,
              swapMode: "ExactIn",
              slippageBps: route.slippageBps,
              priceImpactPct: route.priceImpactPct,
              routePlan: route.marketInfos,
            },
            userPublicKey: publicKey.toString(),
            wrapAndUnwrapSol: true,
          }),
        })

        if (!swapResponse.ok) {
          const errorData = await swapResponse.json().catch(() => ({ error: "Unknown error" }))
          throw new Error(`Jupiter API error: ${errorData.error || "Unknown error"}`)
        }

        const { swapTransaction } = await swapResponse.json()

        // Deserialize and sign the transaction
        const swapTransactionBuf = Buffer.from(swapTransaction, "base64")
        const transaction = VersionedTransaction.deserialize(swapTransactionBuf)

        // Sign the transaction
        const signedTransaction = await signTransaction(transaction)

        // Send the transaction
        const signature = await sendAndConfirmTransaction(signedTransaction)

        if (signature) {
          const inputAmount = Number(route.inAmount) / Math.pow(10, inputToken.decimals)
          const outputAmount = Number(route.outAmount) / Math.pow(10, outputToken.decimals)

          toast({
            title: "Swap Successful",
            description: `Swapped ${inputAmount.toFixed(4)} ${inputToken.symbol} for ${outputAmount.toFixed(4)} ${outputToken.symbol}`,
          })

          return true
        } else {
          throw new Error("Transaction failed")
        }
      } catch (error: any) {
        console.error("Error executing swap:", error)
        setError(error.message || "Failed to execute swap")

        toast({
          title: "Swap Failed",
          description: error.message || "Failed to execute swap",
          variant: "destructive",
        })

        return false
      } finally {
        setIsSwapping(false)
      }
    },
    [publicKey, signTransaction, toast],
  )

  // Update routes when network changes
  useEffect(() => {
    // Clear routes when network changes
    setRoutes([])
    setSelectedRoute(null)
  }, [network])

  // Cleanup function to cancel any pending requests when component unmounts
  useEffect(() => {
    return () => {
      activeRequestRef.current = null
    }
  }, [])

  return {
    routes,
    selectedRoute,
    isLoading,
    isSwapping,
    error,
    slippage,
    getRoutes,
    executeSwap,
    setSlippage,
    selectRoute,
  }
}
