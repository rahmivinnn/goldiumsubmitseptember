"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Volume2, 
  DollarSign, 
  Zap,
  Target,
  BarChart3,
  LineChart,
  PieChart,
  Globe,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  Layers
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface MarketTicker {
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap: number
  high24h: number
  low24h: number
  lastUpdate: number
  trend: 'up' | 'down' | 'neutral'
  volatility: number
  liquidity: number
  holders: number
}

interface GlobalStats {
  totalMarketCap: number
  totalVolume24h: number
  btcDominance: number
  activeTraders: number
  totalTransactions: number
  avgBlockTime: number
  networkHealth: number
  gasPrice: number
}

interface NewsItem {
  id: string
  title: string
  summary: string
  timestamp: number
  impact: 'bullish' | 'bearish' | 'neutral'
  source: string
}

export default function RealTimeMarketData() {
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')
  const [marketTickers, setMarketTickers] = useState<MarketTicker[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalMarketCap: 847392847,
    totalVolume24h: 89473829,
    btcDominance: 52.3,
    activeTraders: 847392,
    totalTransactions: 847392,
    avgBlockTime: 0.4,
    networkHealth: 99.8,
    gasPrice: 0.000025
  })
  const [news, setNews] = useState<NewsItem[]>([])
  const [priceAlerts, setPriceAlerts] = useState<{symbol: string, type: 'above' | 'below', price: number}[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize market data
  useEffect(() => {
    const initializeData = () => {
      const tickers: MarketTicker[] = [
        {
          symbol: 'SOL',
          name: 'Solana',
          price: 156.42,
          change24h: 3.47,
          changePercent24h: 2.27,
          volume24h: 284739284,
          marketCap: 685000000,
          high24h: 159.85,
          low24h: 151.23,
          lastUpdate: Date.now(),
          trend: 'up',
          volatility: 12.5,
          liquidity: 95.8,
          holders: 2847392
        },
        {
          symbol: 'GOLD',
          name: 'Goldium Token',
          price: 1.85,
          change24h: -0.03,
          changePercent24h: -1.59,
          volume24h: 123456789,
          marketCap: 185000000,
          high24h: 1.92,
          low24h: 1.81,
          lastUpdate: Date.now(),
          trend: 'down',
          volatility: 8.3,
          liquidity: 87.2,
          holders: 156789
        },
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          price: 43250.00,
          change24h: 1250.00,
          changePercent24h: 2.98,
          volume24h: 567890123,
          marketCap: 850000000,
          high24h: 44100.00,
          low24h: 41800.00,
          lastUpdate: Date.now(),
          trend: 'up',
          volatility: 15.2,
          liquidity: 98.5,
          holders: 45000000
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          price: 2650.00,
          change24h: -45.50,
          changePercent24h: -1.69,
          volume24h: 89012345,
          marketCap: 320000000,
          high24h: 2720.00,
          low24h: 2580.00,
          lastUpdate: Date.now(),
          trend: 'down',
          volatility: 11.8,
          liquidity: 96.3,
          holders: 120000000
        },
        {
          symbol: 'AVAX',
          name: 'Avalanche',
          price: 38.75,
          change24h: 1.25,
          changePercent24h: 3.33,
          volume24h: 567890123,
          marketCap: 150000000,
          high24h: 39.80,
          low24h: 36.90,
          lastUpdate: Date.now(),
          trend: 'up',
          volatility: 18.7,
          liquidity: 82.1,
          holders: 2500000
        }
      ]

      const newsItems: NewsItem[] = [
        {
          id: '1',
          title: 'Solana Network Upgrade Increases TPS to 65,000',
          summary: 'Latest network optimization brings significant performance improvements',
          timestamp: Date.now() - 300000,
          impact: 'bullish',
          source: 'CryptoNews'
        },
        {
          id: '2',
          title: 'Major DeFi Protocol Launches on Goldium',
          summary: 'New yield farming opportunities with up to 45% APY',
          timestamp: Date.now() - 600000,
          impact: 'bullish',
          source: 'DeFi Pulse'
        },
        {
          id: '3',
          title: 'Institutional Adoption Reaches New Highs',
          summary: 'Fortune 500 companies increasingly adopting blockchain solutions',
          timestamp: Date.now() - 900000,
          impact: 'bullish',
          source: 'Bloomberg Crypto'
        }
      ]

      setMarketTickers(tickers)
      setNews(newsItems)
    }

    initializeData()
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    const updateMarketData = () => {
      setMarketTickers(prev => prev.map(ticker => {
        const volatilityFactor = ticker.volatility / 100
        const priceChange = (Math.random() - 0.5) * 2 * volatilityFactor * ticker.price
        const newPrice = Math.max(0.01, ticker.price + priceChange)
        const change24h = newPrice - (ticker.price - ticker.change24h)
        const changePercent24h = ((change24h) / (newPrice - change24h)) * 100
        
        // Determine trend
        let trend: 'up' | 'down' | 'neutral' = 'neutral'
        if (Math.abs(priceChange) > ticker.price * 0.001) {
          trend = priceChange > 0 ? 'up' : 'down'
        }

        return {
          ...ticker,
          price: newPrice,
          change24h,
          changePercent24h,
          lastUpdate: Date.now(),
          trend,
          volume24h: ticker.volume24h * (0.95 + Math.random() * 0.1),
          liquidity: Math.max(50, Math.min(100, ticker.liquidity + (Math.random() - 0.5) * 2))
        }
      }))

      setGlobalStats(prev => ({
        ...prev,
        totalMarketCap: prev.totalMarketCap * (0.999 + Math.random() * 0.002),
        totalVolume24h: prev.totalVolume24h * (0.95 + Math.random() * 0.1),
        activeTraders: prev.activeTraders + Math.floor((Math.random() - 0.5) * 1000),
        networkHealth: Math.max(95, Math.min(100, prev.networkHealth + (Math.random() - 0.5) * 0.5)),
        gasPrice: Math.max(0.000001, prev.gasPrice * (0.98 + Math.random() * 0.04))
      }))

      setLastUpdate(Date.now())
    }

    // Simulate connection status
    const connectionSimulation = () => {
      if (Math.random() < 0.02) { // 2% chance of temporary disconnection
        setIsConnected(false)
        setTimeout(() => setIsConnected(true), 2000 + Math.random() * 3000)
      }
    }

    intervalRef.current = setInterval(() => {
      updateMarketData()
      connectionSimulation()
    }, 1000 + Math.random() * 2000) // Random interval between 1-3 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `$${price.toFixed(4)}`
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(2)}K`
    }
    return `$${volume.toFixed(2)}`
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`
    }
    return `$${marketCap.toFixed(2)}`
  }

  const formatNumber = (num: number) => {
    if (num >= 1e6) {
      return `${(num / 1e6).toFixed(1)}M`
    } else if (num >= 1e3) {
      return `${(num / 1e3).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="space-y-6">
      {/* Connection Status & Global Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900/90 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Wifi className="h-5 w-5 text-green-400" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-400" />
                )}
                <span className={`text-sm font-medium ${
                  isConnected ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isConnected ? 'Connected' : 'Reconnecting...'}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {getTimeAgo(lastUpdate)}
              </Badge>
            </div>
            <div className="mt-2">
              <div className="text-xs text-gray-400">Network Health</div>
              <div className="flex items-center gap-2">
                <Progress value={globalStats.networkHealth} className="flex-1 h-2" />
                <span className="text-xs text-white font-semibold">
                  {globalStats.networkHealth.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/90 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-400">Total Market Cap</span>
            </div>
            <div className="text-xl font-bold text-white">
              {formatMarketCap(globalStats.totalMarketCap)}
            </div>
            <div className="text-xs text-gray-400">
              BTC Dominance: {globalStats.btcDominance.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/90 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-gray-400">24h Volume</span>
            </div>
            <div className="text-xl font-bold text-white">
              {formatVolume(globalStats.totalVolume24h)}
            </div>
            <div className="text-xs text-gray-400">
              Active Traders: {formatNumber(globalStats.activeTraders)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/90 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Network Stats</span>
            </div>
            <div className="text-xl font-bold text-white">
              {globalStats.avgBlockTime.toFixed(1)}s
            </div>
            <div className="text-xs text-gray-400">
              Gas: {(globalStats.gasPrice * 1000000).toFixed(2)} μSOL
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Tickers */}
      <Card className="bg-gray-900/90 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Live Market Data
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="border-gray-600"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Badge className={`${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
                  isConnected ? 'bg-green-400' : 'bg-red-400'
                }`} />
                {isConnected ? 'Live' : 'Offline'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-400 font-medium text-sm">Asset</th>
                  <th className="text-right py-3 px-2 text-gray-400 font-medium text-sm">Price</th>
                  <th className="text-right py-3 px-2 text-gray-400 font-medium text-sm">24h Change</th>
                  <th className="text-right py-3 px-2 text-gray-400 font-medium text-sm">Volume</th>
                  <th className="text-right py-3 px-2 text-gray-400 font-medium text-sm">Market Cap</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-medium text-sm">Trend</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-medium text-sm">Liquidity</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {marketTickers.map((ticker) => (
                    <motion.tr
                      key={ticker.symbol}
                      className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm"
                            animate={{
                              scale: ticker.trend !== 'neutral' ? [1, 1.1, 1] : 1
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {ticker.symbol.charAt(0)}
                          </motion.div>
                          <div>
                            <div className="text-white font-semibold text-sm">{ticker.symbol}</div>
                            <div className="text-gray-400 text-xs">{ticker.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <motion.div
                          className="text-white font-semibold text-sm"
                          animate={{
                            color: ticker.trend === 'up' ? '#10b981' : ticker.trend === 'down' ? '#ef4444' : '#ffffff'
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {formatPrice(ticker.price)}
                        </motion.div>
                        <div className="text-gray-400 text-xs">
                          H: {formatPrice(ticker.high24h)} L: {formatPrice(ticker.low24h)}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <motion.div
                          className={`flex items-center justify-end gap-1 ${
                            ticker.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                          animate={{
                            scale: ticker.trend !== 'neutral' ? [1, 1.05, 1] : 1
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {ticker.changePercent24h >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span className="font-semibold text-sm">
                            {ticker.changePercent24h >= 0 ? '+' : ''}{ticker.changePercent24h.toFixed(2)}%
                          </span>
                        </motion.div>
                        <div className="text-gray-400 text-xs">
                          {ticker.change24h >= 0 ? '+' : ''}{formatPrice(Math.abs(ticker.change24h))}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="text-white font-semibold text-sm">{formatVolume(ticker.volume24h)}</div>
                        <div className="text-gray-400 text-xs">Vol: {ticker.volatility.toFixed(1)}%</div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="text-white font-semibold text-sm">{formatMarketCap(ticker.marketCap)}</div>
                        <div className="text-gray-400 text-xs">{formatNumber(ticker.holders)} holders</div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <motion.div
                          animate={{
                            scale: ticker.trend !== 'neutral' ? [1, 1.2, 1] : 1,
                            rotate: ticker.trend === 'up' ? [0, 10, 0] : ticker.trend === 'down' ? [0, -10, 0] : 0
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {ticker.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-400 mx-auto" />}
                          {ticker.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-400 mx-auto" />}
                          {ticker.trend === 'neutral' && <Activity className="h-4 w-4 text-gray-400 mx-auto" />}
                        </motion.div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center">
                          <Progress value={ticker.liquidity} className="w-12 h-2" />
                          <span className="text-xs text-gray-400 ml-2">
                            {ticker.liquidity.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* News Feed */}
      <Card className="bg-gray-900/90 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Market News & Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {news.map((item) => (
              <motion.div
                key={item.id}
                className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-l-yellow-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                      <Badge 
                        variant={item.impact === 'bullish' ? 'default' : item.impact === 'bearish' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {item.impact}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{item.summary}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getTimeAgo(item.timestamp)}
                      </span>
                      <span>{item.source}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}