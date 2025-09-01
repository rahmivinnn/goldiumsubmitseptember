"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useConnection } from "@solana/wallet-adapter-react"
import { useNetwork } from "@/components/providers/NetworkContextProvider"
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token"
import { useToast } from "@/components/ui/use-toast"

// GOLD token mint address
const GOLD_MINT_ADDRESS = "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump"

export interface WalletBalance {
  sol: number
  gold: number
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
}

export function useRealWalletBalance() {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()
  const { network } = useNetwork()
  const { toast } = useToast()

  const [balance, setBalance] = useState<WalletBalance>({
    sol: 0,
    gold: 0,
    isLoading: false,
    error: null,
    lastUpdated: null
  })

  const fetchRealBalance = useCallback(async () => {
    if (!publicKey || !connected || !connection) {
      setBalance({
        sol: 0,
        gold: 0,
        isLoading: false,
        error: null,
        lastUpdated: null
      })
      return
    }

    console.log("🔄 Fetching real wallet balance...")
    console.log("📍 Wallet:", publicKey.toString())
    console.log("🌐 Network:", network)
    console.log("🔗 RPC:", connection.rpcEndpoint)

    setBalance(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Fetch SOL balance with multiple RPC fallbacks
      console.log("💰 Fetching SOL balance...")
      let solBalance = 0
      
      const fallbackRPCs = [
        connection,
        new Connection("https://rpc.ankr.com/solana", { commitment: 'confirmed' }),
        new Connection("https://solana-mainnet.g.alchemy.com/v2/demo", { commitment: 'confirmed' }),
        new Connection("https://rpc.helius.xyz/?api-key=demo", { commitment: 'confirmed' })
      ]
      
      let lastError = null
      for (let i = 0; i < fallbackRPCs.length; i++) {
        try {
          console.log(`🔄 Trying RPC ${i + 1}/${fallbackRPCs.length}: ${fallbackRPCs[i].rpcEndpoint}`)
          const solBalanceInLamports = await Promise.race([
            fallbackRPCs[i].getBalance(publicKey, 'confirmed'),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('SOL balance fetch timeout')), 8000)
            )
          ])
          solBalance = solBalanceInLamports / LAMPORTS_PER_SOL
          console.log("✅ SOL Balance:", solBalance)
          break // Success, exit loop
        } catch (solError) {
          lastError = solError
          console.log(`⚠️ RPC ${i + 1} failed:`, solError)
          
          // If this is the last RPC, try with processed commitment
          if (i === fallbackRPCs.length - 1) {
            try {
              console.log("🔄 Final attempt with 'processed' commitment...")
              const solBalanceInLamports = await fallbackRPCs[0].getBalance(publicKey, 'processed')
              solBalance = solBalanceInLamports / LAMPORTS_PER_SOL
              console.log("✅ SOL Balance (processed):", solBalance)
              break
            } catch (finalError) {
              console.error("❌ All SOL balance fetch attempts failed:", finalError)
              throw new Error(`Failed to fetch SOL balance: ${lastError?.message || 'Unknown error'}`)
            }
          }
        }
      }

      // Fetch GOLD balance with better error handling
      console.log("🥇 Fetching GOLD balance...")
      let goldBalance = 0
      try {
        // Validate GOLD mint address first
        if (!GOLD_MINT_ADDRESS || GOLD_MINT_ADDRESS.length < 32) {
          console.log("⚠️ Invalid GOLD mint address:", GOLD_MINT_ADDRESS)
          goldBalance = 0
        } else {
          const goldMint = new PublicKey(GOLD_MINT_ADDRESS)
          console.log("🔍 GOLD Mint:", goldMint.toString())
          
          const associatedTokenAccount = await getAssociatedTokenAddress(
            goldMint, 
            publicKey,
            false, // allowOwnerOffCurve
            undefined, // programId
            undefined // associatedTokenProgramId
          )
          console.log("🔍 Associated Token Account:", associatedTokenAccount.toString())
          
          // Check if the account exists with timeout and fallback RPCs
          let accountInfo = null
          for (let i = 0; i < fallbackRPCs.length; i++) {
            try {
              console.log(`🔄 Trying RPC ${i + 1} for token account...`)
              accountInfo = await Promise.race([
                fallbackRPCs[i].getAccountInfo(associatedTokenAccount, 'confirmed'),
                new Promise<null>((_, reject) => 
                  setTimeout(() => reject(new Error('Token account fetch timeout')), 5000)
                )
              ])
              break // Success, exit loop
            } catch (tokenError) {
              console.log(`⚠️ Token account RPC ${i + 1} failed:`, tokenError)
              if (i === fallbackRPCs.length - 1) {
                console.log("⚠️ All token account fetch attempts failed, setting balance to 0")
                accountInfo = null
                break
              }
            }
          }
          
          if (accountInfo && accountInfo.data.length > 0) {
            // Try to parse token account with fallback RPCs
            let accountParsed = false
            for (let i = 0; i < fallbackRPCs.length && !accountParsed; i++) {
              try {
                console.log(`🔄 Trying to parse token account with RPC ${i + 1}...`)
                const account = await getAccount(fallbackRPCs[i], associatedTokenAccount)
                goldBalance = Number(account.amount) / Math.pow(10, 9) // GOLD has 9 decimals
                console.log("✅ GOLD Balance:", goldBalance)
                accountParsed = true
              } catch (parseError) {
                console.log(`⚠️ Token account parsing failed with RPC ${i + 1}:`, parseError)
                if (i === fallbackRPCs.length - 1) {
                  console.log("⚠️ All token account parsing attempts failed, setting balance to 0")
                  goldBalance = 0
                }
              }
            }
          } else {
            console.log("ℹ️ No GOLD token account found or account is empty")
            goldBalance = 0
          }
        }
      } catch (goldError: any) {
        console.log("⚠️ GOLD balance fetch failed:", goldError?.message || goldError)
        goldBalance = 0
        // Don't throw error, just set balance to 0
      }

      setBalance({
        sol: solBalance,
        gold: goldBalance,
        isLoading: false,
        error: null,
        lastUpdated: new Date()
      })

      console.log("🎉 Balance fetch completed successfully")
    } catch (error: any) {
      console.error("❌ Balance fetch failed:", error)
      const errorMessage = error.message || "Failed to fetch balance"
      
      setBalance(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))

      // Only show toast for critical errors, not for token balance issues
      if (!errorMessage.includes("GOLD") && !errorMessage.includes("token")) {
        toast({
          title: "Error fetching balance",
          description: errorMessage,
          variant: "destructive"
        })
      }
    }
  }, [publicKey, connected, connection, network, toast])

  // Auto-fetch balance when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchRealBalance()
    }
  }, [connected, publicKey, fetchRealBalance])

  // Auto-refresh balance every 30 seconds
  useEffect(() => {
    if (!connected || !publicKey) return

    const interval = setInterval(() => {
      fetchRealBalance()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [connected, publicKey, fetchRealBalance])

  return {
    balance,
    refreshBalance: fetchRealBalance,
    isConnected: connected,
    walletAddress: publicKey?.toString() || null
  }
}

export default useRealWalletBalance