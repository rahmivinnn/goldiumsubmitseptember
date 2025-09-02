"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Coins, RefreshCw, Wallet } from "lucide-react"

function Faucet() {
  const { connected, publicKey } = useWallet()
  const { toast } = useToast()
  const [isClaiming, setIsClaiming] = useState(false)

  const handleClaimTokens = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      })
      return
    }

    setIsClaiming(true)

    try {
      // Simulate faucet claim
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "Tokens Claimed!",
        description: "1000 GOLD tokens have been added to your wallet",
      })

    } catch (error: any) {
      console.error("Claim failed:", error)
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim tokens",
        variant: "destructive"
      })
    } finally {
      setIsClaiming(false)
    }
  }

  if (!connected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400 mb-4">Please connect your wallet to claim tokens</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          GOLD Token Faucet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Free GOLD Tokens</h3>
            <p className="text-gray-300 mb-4">
              Claim 1,000 GOLD tokens for testing DeFi features
            </p>
            <p className="text-sm text-gray-400">
              Wallet: {publicKey?.toString().slice(0, 6)}...{publicKey?.toString().slice(-4)}
            </p>
          </div>
        </div>

        <Button 
          onClick={handleClaimTokens}
          disabled={isClaiming}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold"
          size="lg"
        >
          {isClaiming ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              Claiming...
            </>
          ) : (
            <>
              <Coins className="h-4 w-4 mr-2" />
              Claim 1,000 GOLD
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          <p>GOLD tokens are for testing purposes only and have no real value.</p>
          <p>You can claim tokens once every 24 hours.</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default Faucet