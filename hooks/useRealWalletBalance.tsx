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
      // Fetch SOL balance
      console.log("💰 Fetching SOL balance...")
      const solBalanceInLamports = await connection.getBalance(publicKey, 'confirmed')
      const solBalance = solBalanceInLamports / LAMPORTS_PER_SOL
      console.log("✅ SOL Balance:", solBalance)

      // Fetch GOLD balance
      console.log("🥇 Fetching GOLD balance...")
      let goldBalance = 0
      try {
        // Validate GOLD mint address first
        if (!GOLD_MINT_ADDRESS || GOLD_MINT_ADDRESS.length < 32) {
          console.log("⚠️ Invalid GOLD mint address:", GOLD_MINT_ADDRESS)
          throw new Error("Invalid GOLD mint address")
        }

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
        
        // Check if the account exists
        const accountInfo = await connection.getAccountInfo(associatedTokenAccount, 'confirmed')
        if (accountInfo && accountInfo.data.length > 0) {
          try {
            const account = await getAccount(connection, associatedTokenAccount)
            goldBalance = Number(account.amount) / Math.pow(10, 9) // GOLD has 9 decimals
            console.log("✅ GOLD Balance:", goldBalance)
          } catch (parseError) {
            console.log("⚠️ Failed to parse token account:", parseError)
            goldBalance = 0
          }
        } else {
          console.log("ℹ️ No GOLD token account found or account is empty")
          goldBalance = 0
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

      toast({
        title: "Error fetching balance",
        description: errorMessage,
        variant: "destructive"
      })
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