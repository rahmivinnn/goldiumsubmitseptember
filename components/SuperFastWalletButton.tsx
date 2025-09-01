"use client"

import React, { useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Wallet, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface SuperFastWalletButtonProps {
  className?: string
  children?: React.ReactNode
}

export function SuperFastWalletButton({ className, children }: SuperFastWalletButtonProps) {
  const { connected, connecting } = useWallet()
  const { setVisible } = useWalletModal()

  // Ultra-fast connect with zero delays
  const handleConnect = useCallback(() => {
    // Immediately show modal - no async, no delays, no error handling overhead
    setVisible(true)
  }, [setVisible])

  // Loading state
  if (connecting) {
    return (
      <Button 
        disabled 
        variant="outline"
        className={cn("gap-2 pointer-events-none", className)}
      >
        <RefreshCw className="h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    )
  }

  // Connected state
  if (connected) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {children || (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-green-400 font-medium">Connected</span>
          </div>
        )}
      </div>
    )
  }

  // Not connected - INSTANT response
  return (
    <Button 
      onClick={handleConnect}
      className={cn(
        "instant-wallet-button instant-response",
        "gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold",
        "focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2",
        className
      )}
      // Remove any potential delays
      style={{ 
        transitionDelay: '0ms',
        animationDelay: '0ms'
      }}
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  )
}

export default SuperFastWalletButton