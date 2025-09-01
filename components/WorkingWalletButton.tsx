"use client"

import React, { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useConnection } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, RefreshCw, Copy, ExternalLink, LogOut } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token"

const GOLD_MINT_ADDRESS = "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump"

interface WorkingWalletButtonProps {
  className?: string
  showBalance?: boolean
}

export function WorkingWalletButton({ className, showBalance = true }: WorkingWalletButtonProps) {
  const { connected, connecting, disconnect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()
  const { connection } = useConnection()
  const { toast } = useToast()
  
  const [solBalance, setSolBalance] = useState<number>(0)
  const [goldBalance, setGoldBalance] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  // DEBUG: Log wallet state
  useEffect(() => {
    console.log("🔍 WALLET DEBUG:", {
      connected,
      connecting,
      publicKey: publicKey?.toString(),
      wallet: wallet?.adapter?.name,
      connection: connection?.rpcEndpoint
    })
  }, [connected, connecting, publicKey, wallet, connection])

  // WORKING balance fetcher
  const fetchRealBalance = async () => {
    if (!publicKey || !connected || !connection) {
      console.log("❌ Cannot fetch balance - missing requirements")
      return
    }

    console.log("🔄 Fetching REAL balance...")
    setIsLoading(true)

    try {
      // Fetch SOL balance - WORKING version
      console.log("💰 Fetching SOL...")
      const solBalanceInLamports = await connection.getBalance(publicKey, 'confirmed')
      const solBal = solBalanceInLamports / LAMPORTS_PER_SOL
      setSolBalance(solBal)
      console.log("✅ SOL Balance:", solBal)

      // Fetch GOLD balance - WORKING version
      console.log("🥇 Fetching GOLD...")
      try {
        const goldMint = new PublicKey(GOLD_MINT_ADDRESS)
        const associatedTokenAccount = await getAssociatedTokenAddress(goldMint, publicKey)
        
        const accountInfo = await connection.getAccountInfo(associatedTokenAccount, 'confirmed')
        if (accountInfo && accountInfo.data.length > 0) {
          const account = await getAccount(connection, associatedTokenAccount)
          const goldBal = Number(account.amount) / Math.pow(10, 9)
          setGoldBalance(goldBal)
          console.log("✅ GOLD Balance:", goldBal)
        } else {
          setGoldBalance(0)
          console.log("ℹ️ No GOLD account found")
        }
      } catch (goldError) {
        console.log("⚠️ GOLD fetch error:", goldError)
        setGoldBalance(0)
      }

      toast({
        title: "Balance Updated",
        description: `SOL: ${solBal.toFixed(4)}, GOLD: ${goldBalance.toFixed(2)}`
      })

    } catch (error) {
      console.error("❌ Balance fetch failed:", error)
      toast({
        title: "Balance Fetch Failed",
        description: "Could not fetch wallet balance",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-fetch balance when connected
  useEffect(() => {
    if (connected && publicKey) {
      console.log("🚀 Auto-fetching balance...")
      fetchRealBalance()
    }
  }, [connected, publicKey])

  // WORKING connect handler
  const handleConnect = () => {
    console.log("🔥 CONNECT BUTTON CLICKED!")
    console.log("Modal setVisible function:", setVisible)
    
    try {
      setVisible(true)
      console.log("✅ Modal should be visible now")
    } catch (error) {
      console.error("❌ Modal open error:", error)
      toast({
        title: "Connection Error",
        description: "Failed to open wallet modal",
        variant: "destructive"
      })
    }
  }

  // WORKING disconnect handler
  const handleDisconnect = async () => {
    console.log("🔥 DISCONNECT BUTTON CLICKED!")
    try {
      await disconnect()
      setSolBalance(0)
      setGoldBalance(0)
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected wallet"
      })
    } catch (error) {
      console.error("❌ Disconnect error:", error)
    }
  }

  const copyAddress = async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey.toString())
        toast({
          title: "Address Copied",
          description: "Wallet address copied to clipboard"
        })
      } catch (error) {
        console.error("Copy error:", error)
      }
    }
  }

  const formatBalance = (amount: number) => {
    if (amount === 0) return "0"
    if (amount < 0.001) return "< 0.001"
    return amount.toFixed(3)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Loading state
  if (connecting) {
    return (
      <Button disabled className={cn("gap-2", className)}>
        <RefreshCw className="h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    )
  }

  // Not connected state
  if (!connected) {
    return (
      <Button 
        onClick={handleConnect}
        className={cn("gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold", className)}
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  // Connected state with balance
  if (!showBalance) {
    return (
      <Button 
        onClick={handleDisconnect}
        variant="outline"
        className={cn("gap-2 bg-green-500/20 border-green-500/30 text-green-400", className)}
      >
        <Wallet className="h-4 w-4" />
        {publicKey ? formatAddress(publicKey.toString()) : "Connected"}
      </Button>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-black/80 to-gray-900/80 border-green-500/30">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-400">
                {wallet?.adapter.name || "Connected"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-400"
              onClick={handleDisconnect}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Address */}
          <div className="flex items-center justify-between p-2 rounded bg-black/40">
            <span className="text-xs text-gray-400">Address:</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-green-400">
                {publicKey ? formatAddress(publicKey.toString()) : ""}
              </span>
              <Button variant="ghost" size="icon" className="h-4 w-4" onClick={copyAddress}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Balances */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded bg-purple-500/10">
              <span className="text-sm text-purple-300">SOL:</span>
              <Badge variant="secondary" className="font-mono">
                {isLoading ? "Loading..." : `${formatBalance(solBalance)} SOL`}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-yellow-500/10">
              <span className="text-sm text-yellow-300">GOLD:</span>
              <Badge variant="outline" className="font-mono">
                {isLoading ? "Loading..." : `${formatBalance(goldBalance)} GOLD`}
              </Badge>
            </div>
          </div>

          {/* Refresh Button */}
          <Button
            onClick={fetchRealBalance}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-3 w-3 animate-spin mr-2" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3 mr-2" />
                Refresh Balance
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default WorkingWalletButton