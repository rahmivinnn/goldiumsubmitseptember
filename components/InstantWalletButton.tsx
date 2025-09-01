"use client"

import React from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Wallet, RefreshCw } from "lucide-react"
import { useRealWalletBalance } from "@/hooks/useRealWalletBalance"
import { cn } from "@/lib/utils"

interface InstantWalletButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
}

export function InstantWalletButton({ 
  className, 
  variant = "default", 
  size = "default"
}: InstantWalletButtonProps) {
  const { connected, connecting, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const { balance } = useRealWalletBalance()

  // INSTANT connect - no delays, no try/catch overhead
  const handleConnect = () => {
    setVisible(true)
  }

  const formatBalance = (amount: number) => {
    if (amount === 0) return "0"
    if (amount < 0.001) return "< 0.001"
    return amount.toFixed(3)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  // Loading state - minimal UI
  if (connecting) {
    return (
      <Button 
        disabled 
        variant={variant} 
        size={size}
        className={cn("gap-2", className)}
      >
        <RefreshCw className="h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    )
  }

  // Not connected - INSTANT response
  if (!connected) {
    return (
      <Button 
        onClick={handleConnect}
        variant={variant} 
        size={size}
        className={cn("instant-wallet-button instant-response gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold", className)}
        style={{ transitionDelay: '0ms', animationDelay: '0ms' }}
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  // Connected - show balance
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-sm font-mono text-green-400">
          {formatBalance(balance.sol)} SOL
        </span>
        {balance.gold > 0 && (
          <span className="text-sm font-mono text-yellow-400">
            {formatBalance(balance.gold)} GOLD
          </span>
        )}
      </div>
      {publicKey && (
        <span className="text-xs font-mono text-gray-400">
          {formatAddress(publicKey.toString())}
        </span>
      )}
    </div>
  )
}

export default InstantWalletButton