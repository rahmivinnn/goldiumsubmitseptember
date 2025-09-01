"use client"

import React from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Wallet, RefreshCw, Copy, ExternalLink } from "lucide-react"
import { useRealWalletBalance } from "@/hooks/useRealWalletBalance"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface ConnectWalletButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  showBalance?: boolean
}

export function ConnectWalletButton({ 
  className, 
  variant = "default", 
  size = "default",
  showBalance = true 
}: ConnectWalletButtonProps) {
  const { connected, connecting, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const { balance, refreshBalance, isConnected, walletAddress } = useRealWalletBalance()
  const { toast } = useToast()

  const handleConnect = () => {
    setVisible(true)
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
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress)
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
    if (walletAddress) {
      window.open(`https://solscan.io/account/${walletAddress}`, '_blank')
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const formatBalance = (amount: number) => {
    if (amount === 0) return "0"
    if (amount < 0.001) return "< 0.001"
    return amount.toFixed(3)
  }

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

  if (!connected || !isConnected) {
    return (
      <Button 
        onClick={handleConnect}
        variant={variant} 
        size={size}
        className={cn("gap-2", className)}
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  if (!showBalance) {
    return (
      <Button 
        onClick={handleDisconnect}
        variant={variant} 
        size={size}
        className={cn("gap-2", className)}
      >
        <Wallet className="h-4 w-4" />
        {walletAddress ? formatAddress(walletAddress) : "Connected"}
      </Button>
    )
  }

  return (
    <Card className="w-auto">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Wallet Address */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">
                {walletAddress ? formatAddress(walletAddress) : "Connected"}
              </span>
            </div>
            <div className="flex items-center gap-1">
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
          </div>

          <Separator />

          {/* Balances */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">SOL Balance:</span>
              <Badge variant="secondary" className="font-mono">
                {balance.isLoading ? "Loading..." : `${formatBalance(balance.sol)} SOL`}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">GOLD Balance:</span>
              <Badge variant="outline" className="font-mono">
                {balance.isLoading ? "Loading..." : `${formatBalance(balance.gold)} GOLD`}
              </Badge>
            </div>
          </div>

          {/* Error Display */}
          {balance.error && (
            <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
              Error: {balance.error}
            </div>
          )}

          {/* Last Updated */}
          {balance.lastUpdated && (
            <div className="text-xs text-muted-foreground text-center">
              Updated: {balance.lastUpdated.toLocaleTimeString()}
            </div>
          )}

          <Separator />

          {/* Disconnect Button */}
          <Button 
            onClick={handleDisconnect}
            variant="outline" 
            size="sm"
            className="w-full"
          >
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ConnectWalletButton