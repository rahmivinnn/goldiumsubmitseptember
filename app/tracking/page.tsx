"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  ExternalLink, 
  Copy, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Send,
  ArrowRightLeft,
  Wallet
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// REAL GOLD Contract Address for client verification
const GOLD_CONTRACT_ADDRESS = "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump"

interface Transaction {
  id: string
  type: 'send' | 'swap' | 'stake'
  signature: string
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: number
  details: any
  explorerUrl: string
}

export default function TrackingPage() {
  const { connected, publicKey } = useWallet()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [searchSignature, setSearchSignature] = useState("")

  // Load all transactions
  useEffect(() => {
    const saved = localStorage.getItem('goldium_transactions')
    if (saved) {
      setTransactions(JSON.parse(saved))
    }
  }, [])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: `${label} Copied`,
      description: `${label} copied to clipboard`
    })
  }

  const searchTransaction = () => {
    if (searchSignature) {
      window.open(`https://solscan.io/tx/${searchSignature}`, '_blank')
    }
  }

  return (
    <div className="container mx-auto px-2 py-4">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold text-center">
              🔍 GOLDIUM Transaction Tracker
            </CardTitle>
            <p className="text-center text-gray-300">
              All DeFi transactions are REAL and trackable on Solana blockchain
            </p>
          </CardHeader>
        </Card>

        {/* Contract Address Info */}
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold text-yellow-400">GOLD Token Contract Address</h3>
              <div className="bg-black/40 p-3 rounded-lg">
                <p className="font-mono text-sm break-all text-yellow-300">{GOLD_CONTRACT_ADDRESS}</p>
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                <Button 
                  onClick={() => copyToClipboard(GOLD_CONTRACT_ADDRESS, "Contract Address")}
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy CA
                </Button>
                <Button 
                  onClick={() => window.open(`https://solscan.io/token/${GOLD_CONTRACT_ADDRESS}`, '_blank')}
                  variant="outline"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Token on Solscan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter transaction signature..."
                value={searchSignature}
                onChange={(e) => setSearchSignature(e.target.value)}
                className="font-mono"
              />
              <Button onClick={searchTransaction} disabled={!searchSignature}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Info */}
        {connected && (
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-green-400">Wallet Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-green-300">
                    {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(publicKey?.toString() || "", "Wallet Address")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://solscan.io/account/${publicKey?.toString()}`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Your DeFi Transaction History</CardTitle>
            <p className="text-sm text-gray-400">
              {transactions.length} total transactions • All trackable on Solscan
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-lg">No transactions yet</p>
                    <p className="text-sm">Start trading to see your transaction history</p>
                  </div>
                </div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {tx.type === 'send' && <Send className="h-5 w-5 text-blue-400" />}
                        {tx.type === 'swap' && <ArrowRightLeft className="h-5 w-5 text-green-400" />}
                        {tx.type === 'stake' && <TrendingUp className="h-5 w-5 text-yellow-400" />}
                        <div>
                          <h4 className="font-semibold capitalize">{tx.type} Transaction</h4>
                          <p className="text-sm text-gray-400">
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {tx.status === 'confirmed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {tx.status === 'pending' && <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />}
                        {tx.status === 'failed' && <AlertCircle className="h-5 w-5 text-red-500" />}
                        <Badge 
                          variant={
                            tx.status === 'confirmed' ? 'default' : 
                            tx.status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {tx.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="bg-gray-800/50 p-3 rounded space-y-2">
                      {tx.type === 'send' && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Amount:</span>
                            <span className="font-mono">{tx.details.amount} SOL</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">To:</span>
                            <span className="font-mono text-blue-300">
                              {tx.details.to.slice(0, 8)}...{tx.details.to.slice(-8)}
                            </span>
                          </div>
                        </>
                      )}

                      {tx.type === 'swap' && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">From:</span>
                            <span className="font-mono">{tx.details.fromAmount} {tx.details.fromToken}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">To:</span>
                            <span className="font-mono text-yellow-300">{tx.details.toAmount} {tx.details.toToken}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Rate:</span>
                            <span className="text-green-300">{tx.details.rate}</span>
                          </div>
                        </>
                      )}

                      {tx.type === 'stake' && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Amount:</span>
                            <span className="font-mono text-yellow-300">{tx.details.amount} GOLD</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">APY:</span>
                            <span className="text-green-300 font-semibold">{tx.details.apy}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Contract:</span>
                            <span className="font-mono text-yellow-300 text-xs">
                              {GOLD_CONTRACT_ADDRESS.slice(0, 12)}...
                            </span>
                          </div>
                        </>
                      )}

                      {/* Transaction Signature */}
                      <div className="pt-2 border-t border-gray-700">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Signature:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-gray-300">
                              {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(tx.signature, "Signature")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(tx.explorerUrl, '_blank')}
                        className="flex-1"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View on Solscan
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(tx.signature, "Transaction Signature")}
                        className="flex-1"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Signature
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}