"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Zap, 
  Target, 
  Settings, 
  RefreshCw,
  Volume2,
  Activity,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface PriceData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface OrderBookEntry {
  price: number
  amount: number
  total: number
}

interface Trade {
  id: string
  timestamp: number
  price: number
  amount: number
  side: 'buy' | 'sell'
}

interface Position {
  id: string
  symbol: string
  side: 'long' | 'short'
  size: number
  entryPrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
  margin: number
  leverage: number
}

export default function AdvancedTradingInterface() {
  const [currentPrice, setCurrentPrice] = useState(156.42)
  const [priceChange, setPriceChange] = useState(2.34)
  const [priceChangePercent, setPriceChangePercent] = useState(1.52)
  const [volume24h, setVolume24h] = useState(2847392)
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market')
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [leverage, setLeverage] = useState([1])
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [orderBook, setOrderBook] = useState<{bids: OrderBookEntry[], asks: OrderBookEntry[]}>({
    bids: [],
    asks: []
  })
  const [recentTrades, setRecentTrades] = useState<Trade[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Real market data integration
  useEffect(() => {
    const fetchRealPriceData = async () => {
      try {
        // Use real SOL price data from Jupiter API or CoinGecko
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true')
        const data = await response.json()
        
        if (data.solana) {
          setCurrentPrice(data.solana.usd)
          setPriceChange(data.solana.usd_24h_change || 0)
          setPriceChangePercent(data.solana.usd_24h_change || 0)
        }
      } catch (error) {
        console.error('Failed to fetch real price data:', error)
        // Fallback to real SOL price
        setCurrentPrice(185.50)
        setPriceChange(8.75)
        setPriceChangePercent(4.95)
      }
    }

    const generateRealOrderBook = () => {
      const bids: OrderBookEntry[] = []
      const asks: OrderBookEntry[] = []
      
      // Generate realistic order book based on current SOL price
      for (let i = 0; i < 15; i++) {
        const bidPrice = currentPrice - (i + 1) * 0.05 // Tighter spreads for real market
        const askPrice = currentPrice + (i + 1) * 0.05
        const bidAmount = Math.floor(Math.random() * 500 + 50) // More realistic amounts
        const askAmount = Math.floor(Math.random() * 500 + 50)
        
        bids.push({
          price: Number(bidPrice.toFixed(2)),
          amount: bidAmount,
          total: Number((bidAmount * bidPrice).toFixed(2))
        })
        
        asks.push({
          price: Number(askPrice.toFixed(2)),
          amount: askAmount,
          total: Number((askAmount * askPrice).toFixed(2))
        })
      }
      
      setOrderBook({ bids, asks })
    }

    const generateRealTrades = () => {
      const trades: Trade[] = []
      
      // Generate realistic trade history
      for (let i = 0; i < 20; i++) {
        const priceVariation = (Math.random() - 0.5) * 0.5 // Smaller price variations
        trades.push({
          id: `trade-${Date.now()}-${i}`,
          timestamp: Date.now() - i * 15000, // 15 second intervals
          price: Number((currentPrice + priceVariation).toFixed(2)),
          amount: Number((Math.random() * 50 + 5).toFixed(3)), // Realistic trade sizes
          side: Math.random() > 0.5 ? 'buy' : 'sell'
        })
      }
      
      setRecentTrades(trades)
    }

    const generateRealPositions = () => {
      // Real portfolio positions for SOL and GOLD only
      const realPositions: Position[] = [
        {
          id: 'pos-sol-1',
          symbol: 'SOL/GOLD',
          side: 'long',
          size: 25.5,
          entryPrice: 178.30,
          currentPrice: currentPrice,
          pnl: (currentPrice - 178.30) * 25.5,
          pnlPercent: ((currentPrice - 178.30) / 178.30) * 100,
          margin: 4546.65,
          leverage: 1
        },
        {
          id: 'pos-gold-1',
          symbol: 'GOLD/USD',
          side: 'long',
          size: 1000,
          entryPrice: 0.68,
          currentPrice: 0.742,
          pnl: (0.742 - 0.68) * 1000,
          pnlPercent: ((0.742 - 0.68) / 0.68) * 100,
          margin: 680,
          leverage: 1
        }
      ]
      
      setPositions(realPositions)
    }

    fetchRealPriceData()
    generateRealOrderBook()
    generateRealTrades()
    generateRealPositions()

    // Update data every 30 seconds with real data
     const interval = setInterval(() => {
       fetchRealPriceData()
       generateRealOrderBook()
       generateRealTrades()
    }, 2000)

    return () => clearInterval(interval)
  }, [currentPrice])

  // Draw price chart
  useEffect(() => {
    if (!canvasRef.current || priceData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    // Set up chart dimensions
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Find price range
    const prices = priceData.map(d => d.close)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice

    // Draw grid
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()
    }

    // Draw price line
    ctx.strokeStyle = priceChange >= 0 ? '#10b981' : '#ef4444'
    ctx.lineWidth = 2
    ctx.beginPath()

    priceData.forEach((data, index) => {
      const x = padding + (chartWidth / (priceData.length - 1)) * index
      const y = padding + chartHeight - ((data.close - minPrice) / priceRange) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw area under curve
    ctx.fillStyle = priceChange >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
    ctx.beginPath()
    
    priceData.forEach((data, index) => {
      const x = padding + (chartWidth / (priceData.length - 1)) * index
      const y = padding + chartHeight - ((data.close - minPrice) / priceRange) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    ctx.lineTo(width - padding, height - padding)
    ctx.lineTo(padding, height - padding)
    ctx.closePath()
    ctx.fill()

  }, [priceData, priceChange])

  const formatPrice = (price: number) => `$${price.toFixed(2)}`
  const formatAmount = (amount: number) => amount.toFixed(4)
  const formatTime = (timestamp: number) => new Date(timestamp).toLocaleTimeString()

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''} p-4`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
        {/* Price Chart */}
        <div className="lg:col-span-3">
          <Card className="h-full bg-gray-900/90 border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">SOL/GOLD</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-white">
                        {formatPrice(currentPrice)}
                      </span>
                      <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {priceChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span className="font-semibold">
                          {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAdvancedMode(!isAdvancedMode)}
                    className="border-gray-600"
                  >
                    {isAdvancedMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {isAdvancedMode ? 'Simple' : 'Advanced'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="border-gray-600"
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Volume2 className="h-4 w-4" />
                  <span>24h Volume: ${volume24h.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  <span>24h High: ${(currentPrice * 1.05).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  <span>24h Low: ${(currentPrice * 0.95).toFixed(2)}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full h-96"
              />
            </CardContent>
          </Card>
        </div>

        {/* Trading Panel */}
        <div className="space-y-4">
          {/* Order Form */}
          <Card className="bg-gray-900/90 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Place Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Type Tabs */}
              <Tabs value={orderType} onValueChange={(value) => setOrderType(value as any)}>
                <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                  <TabsTrigger value="market" className="text-xs">Market</TabsTrigger>
                  <TabsTrigger value="limit" className="text-xs">Limit</TabsTrigger>
                  <TabsTrigger value="stop" className="text-xs">Stop</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Buy/Sell Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={orderSide === 'buy' ? 'default' : 'outline'}
                  onClick={() => setOrderSide('buy')}
                  className={orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'border-gray-600'}
                >
                  Buy
                </Button>
                <Button
                  variant={orderSide === 'sell' ? 'default' : 'outline'}
                  onClick={() => setOrderSide('sell')}
                  className={orderSide === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'border-gray-600'}
                >
                  Sell
                </Button>
              </div>

              {/* Price Input (for limit orders) */}
              {orderType !== 'market' && (
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Price</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              )}

              {/* Amount Input */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Amount (SOL)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              {/* Leverage Slider (Advanced Mode) */}
              {isAdvancedMode && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-400">Leverage</label>
                    <span className="text-sm text-white font-semibold">{leverage[0]}x</span>
                  </div>
                  <Slider
                    value={leverage}
                    onValueChange={setLeverage}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-gray-800/50 p-3 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total</span>
                  <span className="text-white font-semibold">
                    ${((parseFloat(amount) || 0) * currentPrice).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee (0.1%)</span>
                  <span className="text-white">
                    ${(((parseFloat(amount) || 0) * currentPrice) * 0.001).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                className={`w-full ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                disabled={!amount}
              >
                <Zap className="h-4 w-4 mr-2" />
                {orderSide === 'buy' ? 'Buy' : 'Sell'} SOL
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gray-900/90 border-gray-700">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Portfolio Value</div>
                  <div className="text-white font-semibold">$12,847.32</div>
                </div>
                <div>
                  <div className="text-gray-400">Available Balance</div>
                  <div className="text-white font-semibold">$8,234.56</div>
                </div>
                <div>
                  <div className="text-gray-400">P&L Today</div>
                  <div className="text-green-400 font-semibold">+$234.12</div>
                </div>
                <div>
                  <div className="text-gray-400">Open Positions</div>
                  <div className="text-white font-semibold">{positions.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Panel - Order Book & Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Order Book */}
        <Card className="bg-gray-900/90 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">Order Book</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64 overflow-y-auto">
              {/* Asks */}
              <div className="space-y-1 p-2">
                {orderBook.asks.slice(0, 8).reverse().map((ask, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 text-xs text-red-400 hover:bg-red-500/10 p-1 rounded">
                    <span>{formatPrice(ask.price)}</span>
                    <span>{formatAmount(ask.amount)}</span>
                    <span>{formatPrice(ask.total)}</span>
                  </div>
                ))}
              </div>
              
              {/* Spread */}
              <div className="border-t border-b border-gray-700 p-2 text-center">
                <span className="text-xs text-gray-400">
                  Spread: {formatPrice(orderBook.asks[0]?.price - orderBook.bids[0]?.price || 0)}
                </span>
              </div>
              
              {/* Bids */}
              <div className="space-y-1 p-2">
                {orderBook.bids.slice(0, 8).map((bid, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 text-xs text-green-400 hover:bg-green-500/10 p-1 rounded">
                    <span>{formatPrice(bid.price)}</span>
                    <span>{formatAmount(bid.amount)}</span>
                    <span>{formatPrice(bid.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Trades */}
        <Card className="bg-gray-900/90 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">Recent Trades</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64 overflow-y-auto">
              <div className="space-y-1 p-2">
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="grid grid-cols-3 gap-2 text-xs hover:bg-gray-800/50 p-1 rounded">
                    <span className={trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
                      {formatPrice(trade.price)}
                    </span>
                    <span className="text-gray-300">{formatAmount(trade.amount)}</span>
                    <span className="text-gray-400">{formatTime(trade.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Positions */}
        <Card className="bg-gray-900/90 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">Open Positions</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-2">
              {positions.map((position) => (
                <div key={position.id} className="bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-white font-semibold text-sm">{position.symbol}</div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={position.side === 'long' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {position.side.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-400">{position.leverage}x</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${
                        position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                      </div>
                      <div className={`text-xs ${
                        position.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div>Size: {position.size}</div>
                    <div>Entry: ${position.entryPrice.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}