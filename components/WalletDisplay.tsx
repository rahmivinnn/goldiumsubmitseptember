"use client"

import React, { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Wallet, 
  RefreshCw, 
  Copy, 
  ExternalLink, 
  LogOut,
  ChevronDown,
  ChevronUp,
  Coins
} from "lucide-react"
import { useRealWalletBalance } from "@/hooks/useRealWalletBalance"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface WalletDisplayProps {
  className?: string
  showFullDetails?: boolean
}

export function WalletDisplay({ className, showFullDetails = true }: WalletDisplayProps) {
  const { connected, connecting, disconnect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()
  const { balance, refreshBalance } = useRealWalletBalance()
  const { toast } = useToast()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleConnect = () => {
    try {
      setVisible(true)
    } catch (error) {
      console.error("Error opening wallet modal:", error)
      toast({
        title: "Connection Error",
        description: "Failed to open wallet selection. Please refresh and try again.",
        variant: "destructive"
      })
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected successfully."
      })
    } catch (error) {
      console.error("Disconnect error:", error)
      toast({
        title: "Disconnect Error",
        description: "Failed to disconnect wallet.",
        variant: "destructive"
      })
    }
  }

  const copyAddress = async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey.toString())
        toast({
          title: "Address Copied",
          description: "Wallet address copied to clipboard."
        })
      } catch (error) {
        console.error("Copy error:", error)
        toast({
          title: "Copy Failed",
          description: "Failed to copy address to clipboard.",
          variant: "destructive"
        })
      }
    }
  }

  const openInExplorer = () => {
    if (publicKey) {
      window.open(`https://solscan.io/account/${publicKey.toString()}`, '_blank')
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (amount: number) => {
    if (amount === 0) return "0"
    if (amount < 0.001) return "< 0.001"
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M`
    if (amount >= 1000) return `${(amount / 1000).toFixed(2)}K`
    return amount.toFixed(3)
  }

  const walletAddress = publicKey?.toString() || null

  // Loading state
  if (connecting) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("inline-flex items-center", className)}
      >
        <Button 
          disabled 
          variant="outline"
          className="gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 text-yellow-400"
        >
          <RefreshCw className="h-4 w-4 animate-spin" />
          Connecting...
        </Button>
      </motion.div>
    )
  }

  // Not connected state
  if (!connected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("inline-flex items-center", className)}
      >
        <Button 
          onClick={handleConnect}
          className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </motion.div>
    )
  }

  // Connected state - compact view
  if (!showFullDetails) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("inline-flex items-center", className)}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
        >
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-green-500" />
            <span className="font-mono text-sm">
              {formatBalance(balance.sol)} SOL
            </span>
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </div>
        </Button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 z-50"
            >
              <Card className="bg-black/90 border-green-500/30 backdrop-blur-sm">
                <CardContent className="p-3 space-y-2 min-w-[200px]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Address:</span>
                    <span className="font-mono text-green-400">
                      {walletAddress ? formatAddress(walletAddress) : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">GOLD:</span>
                    <span className="font-mono text-yellow-400">
                      {formatBalance(balance.gold)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={copyAddress}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={openInExplorer}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-red-400"
                      onClick={handleDisconnect}
                    >
                      <LogOut className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // Connected state - full details view
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("", className)}
    >
      <Card className="bg-gradient-to-br from-black/80 to-gray-900/80 border-green-500/30 shadow-lg shadow-green-500/10 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-green-500/20">
                  <Wallet className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Wallet Connected</h3>
                  <p className="text-xs text-gray-400">
                    {wallet?.adapter.name || "Unknown Wallet"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={handleDisconnect}
                title="Disconnect Wallet"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Address */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-black/40">
              <span className="text-sm text-gray-400">Address:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-green-400">
                  {walletAddress ? formatAddress(walletAddress) : ""}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={copyAddress}
                  title="Copy Address"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={openInExplorer}
                  title="View in Explorer"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Separator className="bg-gray-700/50" />

            {/* Balances */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white flex items-center gap-2">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  Balances
                </h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={refreshBalance}
                  disabled={balance.isLoading}
                  title="Refresh Balance"
                >
                  <RefreshCw className={cn("h-3 w-3", balance.isLoading && "animate-spin")} />
                </Button>
              </div>

              {/* SOL Balance */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-400">SOL</span>
                  </div>
                  <span className="text-sm text-gray-300">Solana</span>
                </div>
                <Badge variant="secondary" className="font-mono bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {balance.isLoading ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    `${formatBalance(balance.sol)} SOL`
                  )}
                </Badge>
              </div>

              {/* GOLD Balance */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-400">GOLD</span>
                  </div>
                  <span className="text-sm text-gray-300">Goldium Token</span>
                </div>
                <Badge variant="outline" className="font-mono bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  {balance.isLoading ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    `${formatBalance(balance.gold)} GOLD`
                  )}
                </Badge>
              </div>
            </div>

            {/* Error Display */}
            {balance.error && (
              <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                Error: {balance.error}
              </div>
            )}

            {/* Last Updated */}
            {balance.lastUpdated && (
              <div className="text-xs text-gray-500 text-center">
                Updated: {balance.lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default WalletDisplay