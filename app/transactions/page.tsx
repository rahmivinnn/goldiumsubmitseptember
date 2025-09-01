"use client"

import PageLayout from "@/components/PageLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useWallet } from "@solana/wallet-adapter-react"
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Repeat, 
  Clock, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Copy
} from "lucide-react"
import { useState } from "react"

interface Transaction {
  id: string
  type: 'send' | 'receive' | 'swap' | 'stake' | 'unstake' | 'bridge'
  status: 'pending' | 'confirmed' | 'failed'
  amount: number
  token: string
  toAmount?: number
  toToken?: string
  from?: string
  to?: string
  timestamp: string
  txHash: string
  fee: number
  feeToken: string
}

export default function TransactionsPage() {
  const { connected, publicKey } = useWallet()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "swap",
      status: "confirmed",
      amount: 100,
      token: "GOLD",
      toAmount: 0.45,
      toToken: "SOL",
      timestamp: "2024-01-15T10:30:00Z",
      txHash: "5KJp7z8X9vN2qR4mT6wE3sL1nH8pQ9rY7uI2oP4kM6jN3xV1cB",
      fee: 0.000005,
      feeToken: "SOL"
    },
    {
      id: "2",
      type: "receive",
      status: "confirmed",
      amount: 50,
      token: "GOLD",
      from: "7xKp2m9N4qR8sT5wE1nH6pQ3rY9uI7oP2kM4jN8xV5cB1zL",
      timestamp: "2024-01-14T15:45:00Z",
      txHash: "8NmQ4r7Y2pL9sK6wE5nH1pQ8rY3uI9oP7kM2jN4xV8cB5zL",
      fee: 0.000005,
      feeToken: "SOL"
    },
    {
      id: "3",
      type: "send",
      status: "confirmed",
      amount: 25,
      token: "GOLD",
      to: "9PqR5s8Y3pL2sK9wE8nH4pQ1rY6uI2oP9kM7jN1xV2cB8zL",
      timestamp: "2024-01-13T09:20:00Z",
      txHash: "2LmP6r9Y5pL8sK3wE2nH7pQ4rY1uI5oP3kM9jN6xV1cB4zL",
      fee: 0.000005,
      feeToken: "SOL"
    },
    {
      id: "4",
      type: "stake",
      status: "confirmed",
      amount: 1000,
      token: "GOLD",
      timestamp: "2024-01-12T14:10:00Z",
      txHash: "6QrS7t0Y8pL5sK2wE9nH3pQ7rY4uI8oP6kM3jN9xV4cB7zL",
      fee: 0.000005,
      feeToken: "SOL"
    },
    {
      id: "5",
      type: "swap",
      status: "pending",
      amount: 0.5,
      token: "SOL",
      toAmount: 110,
      toToken: "GOLD",
      timestamp: "2024-01-15T16:00:00Z",
      txHash: "3MnQ8r1Y9pL6sK5wE3nH2pQ9rY7uI1oP8kM6jN2xV7cB3zL",
      fee: 0.000005,
      feeToken: "SOL"
    },
    {
      id: "6",
      type: "bridge",
      status: "failed",
      amount: 200,
      token: "GOLD",
      timestamp: "2024-01-11T11:30:00Z",
      txHash: "4NoR9s2Y1pL7sK8wE6nH5pQ2rY8uI4oP1kM8jN5xV8cB6zL",
      fee: 0.000005,
      feeToken: "SOL"
    }
  ]

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return <ArrowUpRight className="h-4 w-4" />
      case 'receive': return <ArrowDownLeft className="h-4 w-4" />
      case 'swap': return <Repeat className="h-4 w-4" />
      case 'stake': case 'unstake': case 'bridge': return <Repeat className="h-4 w-4" />
      default: return <Repeat className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'send': return 'text-red-400'
      case 'receive': return 'text-green-400'
      case 'swap': return 'text-blue-400'
      case 'stake': return 'text-purple-400'
      case 'unstake': return 'text-orange-400'
      case 'bridge': return 'text-cyan-400'
      default: return 'text-gray-400'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`
  }

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (tx.toToken && tx.toToken.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = selectedFilter === 'all' || tx.type === selectedFilter || tx.status === selectedFilter
    
    return matchesSearch && matchesFilter
  })

  return (
    <PageLayout>
      <div className="container mx-auto max-w-7xl px-4 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Transactions
            </span>
          </h1>
          <p className="text-lg text-gray-300">
            Track all your transactions and activities on the Goldium platform
          </p>
        </div>

        {!connected ? (
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Connect Your Wallet</h3>
              <p className="text-gray-400 mb-4">
                Connect your wallet to view your transaction history
              </p>
              <p className="text-sm text-gray-500">
                All your transactions will be displayed here once connected
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by transaction hash, token..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                >
                  <option value="all">All Types</option>
                  <option value="send">Send</option>
                  <option value="receive">Receive</option>
                  <option value="swap">Swap</option>
                  <option value="stake">Stake</option>
                  <option value="bridge">Bridge</option>
                </select>
                <select 
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="defi">DeFi Activities</TabsTrigger>
                <TabsTrigger value="transfers">Transfers</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <div className="space-y-4">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <Card key={tx.id} className="bg-gray-900 border-gray-800 hover:border-yellow-500/50 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-full bg-gray-800 ${getTypeColor(tx.type)}`}>
                                {getTransactionIcon(tx.type)}
                              </div>
                              
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-white capitalize">
                                    {tx.type === 'swap' && tx.toToken 
                                      ? `${tx.token} → ${tx.toToken}` 
                                      : tx.type
                                    }
                                  </h3>
                                  <Badge className={`${getStatusColor(tx.status)} text-white`}>
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(tx.status)}
                                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                    </div>
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                  <span>Hash:</span>
                                  <span className="font-mono">{truncateHash(tx.txHash)}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-4 w-4 p-0"
                                    onClick={() => copyToClipboard(tx.txHash)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-4 w-4 p-0"
                                    onClick={() => window.open(`https://solscan.io/tx/${tx.txHash}`, '_blank')}
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex flex-col items-end">
                                <p className="text-lg font-semibold text-white">
                                  {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.token}
                                </p>
                                {tx.toAmount && tx.toToken && (
                                  <p className="text-sm text-gray-400">
                                    → {tx.toAmount} {tx.toToken}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  Fee: {tx.fee} {tx.feeToken}
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right text-sm text-gray-400">
                              <p>{new Date(tx.timestamp).toLocaleDateString()}</p>
                              <p>{new Date(tx.timestamp).toLocaleTimeString()}</p>
                            </div>
                          </div>
                          
                          {(tx.from || tx.to) && (
                            <div className="mt-4 pt-4 border-t border-gray-800">
                              <div className="flex justify-between text-sm">
                                {tx.from && (
                                  <div>
                                    <span className="text-gray-400">From: </span>
                                    <span className="font-mono text-gray-300">{truncateHash(tx.from)}</span>
                                  </div>
                                )}
                                {tx.to && (
                                  <div>
                                    <span className="text-gray-400">To: </span>
                                    <span className="font-mono text-gray-300">{truncateHash(tx.to)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="bg-gray-900 border-gray-800">
                      <CardContent className="p-12 text-center">
                        <div className="text-gray-400 mb-4">
                          <Repeat className="h-16 w-16 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No Transactions Found</h3>
                          <p>No transactions match your current filters</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="defi" className="mt-6">
                <div className="space-y-4">
                  {filteredTransactions.filter(tx => ['swap', 'stake', 'unstake', 'bridge'].includes(tx.type)).map((tx) => (
                    <Card key={tx.id} className="bg-gray-900 border-gray-800">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full bg-gray-800 ${getTypeColor(tx.type)}`}>
                              {getTransactionIcon(tx.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-white capitalize">{tx.type}</h3>
                              <p className="text-sm text-gray-400">{truncateHash(tx.txHash)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-white">
                              {tx.amount} {tx.token}
                            </p>
                            <p className="text-sm text-gray-400">
                              {new Date(tx.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="transfers" className="mt-6">
                <div className="space-y-4">
                  {filteredTransactions.filter(tx => ['send', 'receive'].includes(tx.type)).map((tx) => (
                    <Card key={tx.id} className="bg-gray-900 border-gray-800">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full bg-gray-800 ${getTypeColor(tx.type)}`}>
                              {getTransactionIcon(tx.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-white capitalize">{tx.type}</h3>
                              <p className="text-sm text-gray-400">{truncateHash(tx.txHash)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-white">
                              {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.token}
                            </p>
                            <p className="text-sm text-gray-400">
                              {new Date(tx.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="mt-6">
                <div className="space-y-4">
                  {filteredTransactions.filter(tx => tx.status === 'pending').map((tx) => (
                    <Card key={tx.id} className="bg-gray-900 border-gray-800 border-yellow-500/30">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full bg-gray-800 ${getTypeColor(tx.type)}`}>
                              {getTransactionIcon(tx.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-white capitalize">{tx.type}</h3>
                              <p className="text-sm text-gray-400">{truncateHash(tx.txHash)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-white">
                              {tx.amount} {tx.token}
                            </p>
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Clock className="h-3 w-3" />
                              <span className="text-sm">Pending</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </PageLayout>
  )
}