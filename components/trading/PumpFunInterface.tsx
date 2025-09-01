"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  TrendingUp, 
  TrendingDown, 
  Copy,
  ExternalLink,
  RefreshCw,
  Volume2,
  Activity,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Search,
  Filter,
  Star,
  BarChart3,
  Zap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface TokenData {
  symbol: string
  name: string
  contractAddress: string
  price: number
  priceChange24h: number
  priceChangePercent: number
  volume24h: number
  marketCap: number
  holders: number
  liquidity: number
  age: string
  creator: string
  isVerified: boolean
  riskLevel: 'low' | 'medium' | 'high'
  bondingCurveProgress: number
  description?: string
  website?: string
  twitter?: string
  telegram?: string
}

interface Trade {
  id: string
  timestamp: number
  type: 'buy' | 'sell'
  amount: number
  price: number
  trader: string
  txHash: string
}

interface Holder {
  address: string
  percentage: number
  amount: number
  isCreator?: boolean
}

export default function PumpFunInterface() {
  const [tokens, setTokens] = useState<TokenData[]>([])
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null)
  const [trades, setTrades] = useState<Trade[]>([])
  const [holders, setHolders] = useState<Holder[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'marketCap' | 'volume' | 'age' | 'price'>('marketCap')
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const chartRef = useRef<HTMLCanvasElement>(null)

  // Real contract addresses from the project
  const REAL_TOKENS: TokenData[] = [
    {
      symbol: 'GOLD',
      name: 'Goldium Token',
      contractAddress: 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump',
      price: 0.742,
      priceChange24h: 0.045,
      priceChangePercent: 6.45,
      volume24h: 2847392,
      marketCap: 742000000,
      holders: 15420,
      liquidity: 285000,
      age: '29 days ago',
      creator: '7g7Aj5...kzMBp',
      isVerified: true,
      riskLevel: 'low',
      bondingCurveProgress: 85.2,
      description: 'Revolutionary DeFi token with real utility and governance features',
      website: 'https://goldium.finance',
      twitter: '@GoldiumDeFi'
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      contractAddress: 'So11111111111111111111111111111111111111112',
      price: 185.50,
      priceChange24h: 8.75,
      priceChangePercent: 4.95,
      volume24h: 125000000,
      marketCap: 850000000,
      holders: 2500000,
      liquidity: 45000000,
      age: '4 years ago',
      creator: 'Solana Labs',
      isVerified: true,
      riskLevel: 'low',
      bondingCurveProgress: 100,
      description: 'High-performance blockchain supporting builders around the world',
      website: 'https://solana.com'
    }
  ]

  // Generate realistic trading data
  useEffect(() => {
    const generateTrades = (token: TokenData): Trade[] => {
      const trades: Trade[] = []
      const now = Date.now()
      
      for (let i = 0; i < 50; i++) {
        const timestamp = now - (i * 30000) // 30 seconds apart
        const type = Math.random() > 0.5 ? 'buy' : 'sell'
        const amount = Math.random() * 10000 + 100
        const priceVariation = (Math.random() - 0.5) * 0.02 // ±1% price variation
        const price = token.price * (1 + priceVariation)
        
        trades.push({
          id: `trade-${i}`,
          timestamp,
          type,
          amount,
          price,
          trader: `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
          txHash: `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 8)}`
        })
      }
      
      return trades.sort((a, b) => b.timestamp - a.timestamp)
    }

    const generateHolders = (token: TokenData): Holder[] => {
      const holders: Holder[] = []
      let remainingPercentage = 100
      
      // Creator/team allocation
      const creatorPercentage = Math.random() * 15 + 5 // 5-20%
      holders.push({
        address: token.creator,
        percentage: creatorPercentage,
        amount: (token.marketCap / token.price) * (creatorPercentage / 100),
        isCreator: true
      })
      remainingPercentage -= creatorPercentage
      
      // Top holders
      for (let i = 0; i < 10; i++) {
        const percentage = Math.random() * (remainingPercentage / 10)
        holders.push({
          address: `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
          percentage,
          amount: (token.marketCap / token.price) * (percentage / 100)
        })
        remainingPercentage -= percentage
      }
      
      return holders.sort((a, b) => b.percentage - a.percentage)
    }

    setTokens(REAL_TOKENS)
    setSelectedToken(REAL_TOKENS[0])
    setTrades(generateTrades(REAL_TOKENS[0]))
    setHolders(generateHolders(REAL_TOKENS[0]))
  }, [])

  // Separate useEffect for periodic updates
  useEffect(() => {
    const generateTrades = (token: TokenData): Trade[] => {
      const trades: Trade[] = []
      const now = Date.now()
      
      for (let i = 0; i < 50; i++) {
        const timestamp = now - (i * 30000)
        const type = Math.random() > 0.5 ? 'buy' : 'sell'
        const amount = Math.random() * 10000 + 100
        const priceVariation = (Math.random() - 0.5) * 0.02
        const price = token.price * (1 + priceVariation)
        
        trades.push({
          id: `trade-${i}`,
          timestamp,
          type,
          amount,
          price,
          trader: `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
          txHash: `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 8)}`
        })
      }
      
      return trades.sort((a, b) => b.timestamp - a.timestamp)
    }

    // Update data every 5 seconds
    const interval = setInterval(() => {
      setTokens(prevTokens => 
        prevTokens.map(token => ({
          ...token,
          price: token.price * (1 + (Math.random() - 0.5) * 0.01),
          volume24h: token.volume24h * (1 + (Math.random() - 0.5) * 0.1),
          priceChange24h: token.priceChange24h + (Math.random() - 0.5) * 0.1
        }))
      )
      
      if (selectedToken) {
        setTrades(generateTrades(selectedToken))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [selectedToken])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Contract address copied successfully"
    })
  }

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toFixed(2)}`
    }
    return `$${price.toFixed(6)}`
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `$${(volume / 1000000000).toFixed(1)}B`
    }
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`
    }
    return `$${(volume / 1000).toFixed(0)}K`
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(1)}B`
    }
    return `$${(marketCap / 1000000).toFixed(0)}M`
  }

  const filteredTokens = tokens
    .filter(token => 
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.contractAddress.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(token => filterRisk === 'all' || token.riskLevel === filterRisk)
    .sort((a, b) => {
      switch (sortBy) {
        case 'marketCap':
          return b.marketCap - a.marketCap
        case 'volume':
          return b.volume24h - a.volume24h
        case 'price':
          return b.priceChangePercent - a.priceChangePercent
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-black text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-purple-700 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                🥇 Goldium Pump
              </h1>
              <Badge className="bg-green-500/20 text-green-400 border-green-500">
                Live
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tokens, CA, or creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 bg-gray-900/50 border-gray-600 text-white"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 text-white"
              >
                <option value="marketCap">Market Cap</option>
                <option value="volume">Volume 24h</option>
                <option value="price">Price Change</option>
                <option value="age">Age</option>
              </select>
              
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value as any)}
                className="bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 text-white"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Token List */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/90 border-purple-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-yellow-400" />
                  Live Tokens ({filteredTokens.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredTokens.map((token) => (
                    <motion.div
                      key={token.contractAddress}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedToken?.contractAddress === token.contractAddress
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:border-purple-500'
                      }`}
                      onClick={() => setSelectedToken(token)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-black">
                            {token.symbol.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{token.name}</h3>
                              <span className="text-gray-400">${token.symbol}</span>
                              {token.isVerified && (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              )}
                              <Badge 
                                className={`text-xs ${
                                  token.riskLevel === 'low' ? 'bg-green-500/20 text-green-400' :
                                  token.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}
                              >
                                {token.riskLevel.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <span>CA: {token.contractAddress.slice(0, 8)}...{token.contractAddress.slice(-6)}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyToClipboard(token.contractAddress)
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold">{formatPrice(token.price)}</div>
                          <div className={`text-sm flex items-center gap-1 ${
                            token.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {token.priceChangePercent >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {token.priceChangePercent.toFixed(2)}%
                          </div>
                          <div className="text-xs text-gray-400">
                            Vol: {formatVolume(token.volume24h)}
                          </div>
                          <div className="text-xs text-gray-400">
                            MC: {formatMarketCap(token.marketCap)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Bonding Curve Progress */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                          <span>Bonding Curve Progress</span>
                          <span>{token.bondingCurveProgress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-yellow-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${token.bondingCurveProgress}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Token Details */}
          <div className="space-y-6">
            {selectedToken && (
              <>
                {/* Token Info */}
                <Card className="bg-gray-900/90 border-purple-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-black text-sm">
                        {selectedToken.symbol.charAt(0)}
                      </div>
                      {selectedToken.name}
                      {selectedToken.isVerified && (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold">{formatPrice(selectedToken.price)}</div>
                      <div className={`flex items-center gap-1 ${
                        selectedToken.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {selectedToken.priceChangePercent >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {selectedToken.priceChangePercent >= 0 ? '+' : ''}{selectedToken.priceChangePercent.toFixed(2)}%
                        <span className="text-gray-400">24h</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Market Cap</div>
                        <div className="font-semibold">{formatMarketCap(selectedToken.marketCap)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Volume 24h</div>
                        <div className="font-semibold">{formatVolume(selectedToken.volume24h)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Holders</div>
                        <div className="font-semibold">{selectedToken.holders.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Liquidity</div>
                        <div className="font-semibold">{formatVolume(selectedToken.liquidity)}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-gray-400 text-sm mb-2">Contract Address</div>
                      <div className="flex items-center gap-2 p-2 bg-gray-800 rounded text-sm font-mono">
                        <span className="flex-1 truncate">{selectedToken.contractAddress}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(selectedToken.contractAddress)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => window.open(`https://solscan.io/token/${selectedToken.contractAddress}`, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-gray-400 text-sm mb-2">Creator</div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono">{selectedToken.creator}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(selectedToken.creator)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {selectedToken.description && (
                      <div>
                        <div className="text-gray-400 text-sm mb-2">Description</div>
                        <p className="text-sm">{selectedToken.description}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {selectedToken.website && (
                        <Button size="sm" variant="outline" className="border-gray-600">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Website
                        </Button>
                      )}
                      {selectedToken.twitter && (
                        <Button size="sm" variant="outline" className="border-gray-600">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Twitter
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Trades */}
                <Card className="bg-gray-900/90 border-purple-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-yellow-400" />
                      Recent Trades
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {trades.slice(0, 10).map((trade) => (
                        <div key={trade.id} className="flex items-center justify-between text-sm p-2 rounded bg-gray-800/50">
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${
                              trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {trade.type.toUpperCase()}
                            </Badge>
                            <span className="font-mono text-gray-400">{trade.trader}</span>
                          </div>
                          <div className="text-right">
                            <div>{formatPrice(trade.price)}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(trade.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Holders */}
                <Card className="bg-gray-900/90 border-purple-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-yellow-400" />
                      Top Holders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {holders.slice(0, 5).map((holder, index) => (
                        <div key={holder.address} className="flex items-center justify-between text-sm p-2 rounded bg-gray-800/50">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">#{index + 1}</span>
                            <span className="font-mono">{holder.address}</span>
                            {holder.isCreator && (
                              <Badge className="text-xs bg-purple-500/20 text-purple-400">
                                Creator
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{holder.percentage.toFixed(2)}%</div>
                            <div className="text-xs text-gray-400">
                              {formatVolume(holder.amount * selectedToken.price)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}