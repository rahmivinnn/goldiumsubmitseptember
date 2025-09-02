"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useConnection } from "@solana/wallet-adapter-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowUpRight, RefreshCw, Wallet } from "lucide-react"
import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL
} from "@solana/web3.js"

export default function TransferPage() {
  const { connected, publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()
  const { toast } = useToast()
  
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleTransfer = async () => {
    if (!connected || !publicKey || !signTransaction) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      })
      return
    }

    if (!amount || !recipient) {
      toast({
        title: "Missing Information",
        description: "Please enter amount and recipient address",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)

    try {
      const recipientPubkey = new PublicKey(recipient)
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: lamports,
        })
      )

      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      const signedTransaction = await signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize())
      
      await connection.confirmTransaction(signature, 'confirmed')

      toast({
        title: "Transfer Successful!",
        description: `Sent ${amount} SOL to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`
      })

      setAmount("")
      setRecipient("")

    } catch (error: any) {
      console.error("Transfer failed:", error)
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to send SOL",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="responsive-container">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="responsive-title font-bold text-center">REAL SOL Transfer</CardTitle>
            <CardDescription className="text-center">
              Send SOL to any Solana wallet address - REAL BLOCKCHAIN TRANSACTIONS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!connected ? (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400 mb-4">Please connect your wallet to transfer tokens</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (SOL)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Input
                    id="recipient"
                    placeholder="Enter Solana address..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>

                <Button 
                  onClick={handleTransfer}
                  disabled={isProcessing || !amount || !recipient}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Sending Real Transaction...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Send SOL (Real Blockchain)
                    </>
                  )}
                </Button>

                <div className="text-xs text-gray-500 text-center space-y-1">
                  <p>⚡ Real Solana blockchain transactions</p>
                  <p>🔍 All transactions trackable on Solscan</p>
                  <p>💰 Connected: {publicKey?.toString().slice(0, 6)}...{publicKey?.toString().slice(-4)}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}