"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Target, 
  Zap, 
  BarChart3,
  Activity,
  Bell,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface TradingSignal {
  id: string
  symbol: string
  type: 'BUY' | 'SELL' | 'HOLD'
  strength: number // 1-100
  confidence: number // 1-100
  timeframe: string
  price: number
  targetPrice: number
  stopLoss: number
  riskReward: number
  timestamp: Date
  indicators: string[]
  description: string
  status: 'active' | 'triggered' | 'expired'
}

interface MarketSentiment {
  symbol: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  score: number // -100 to 100
  volume: number
  volatility: number
  momentum: number
}

interface TechnicalIndicator {
  name: string
  value: number
  signal: 'buy' | 'sell' | 'neutral'
  strength: number
}

export default function LiveTradingSignals() {
  const [signals, setSignals] = useState<TradingSignal[]>([
    {
      id: '1',
      symbol: 'SOL/GOLD',
      type: 'BUY',
      strength: 88,
      confidence: 94,
      timeframe: '4H',
      price: 250.13,
      targetPrice: 268.75,
      stopLoss: 235.20,
      riskReward: 1.42,
      timestamp: new Date(),
      indicators: ['RSI Recovery', 'MACD Bullish Cross', 'Volume Breakout'],
      description: 'Strong bullish momentum with SOL gaining against GOLD',
      status: 'active'
    }
  ])

  const [sentiment, setSentiment] = useState<MarketSentiment[]>([
    {
      symbol: 'SOL',
      sentiment: 'bullish',
      score: 78,
      volume: 1450000,
      volatility: 11.2,
      momentum: 9.1
    },
    {
      symbol: 'GOLD',
      sentiment: 'bullish',
      score: 65,
      volume: 920000,
      volatility: 7.8,
      momentum: 6.4
    }
  ])

  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([
    { name: 'RSI (14)', value: 45.2, signal: 'neutral', strength: 60 },
    { name: 'MACD', value: 0.85, signal: 'buy', strength: 75 },
    { name: 'Bollinger Bands', value: 0.65, signal: 'buy', strength: 70 },
    { name: 'Stochastic', value: 35.8, signal: 'neutral', strength: 55 },
    { name: 'Williams %R', value: -25.4, signal: 'buy', strength: 80 },
    { name: 'CCI', value: 125.6, signal: 'sell', strength: 65 }
  ])

  const [alertCount, setAlertCount] = useState(0)

  // Simulate real-time signal updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update signal strengths
      setSignals(prev => prev.map(signal => ({
        ...signal,
        strength: Math.max(0, Math.min(100, signal.strength + (Math.random() - 0.5) * 10)),
        confidence: Math.max(0, Math.min(100, signal.confidence + (Math.random() - 0.5) * 5)),
        price: signal.price * (1 + (Math.random() - 0.5) * 0.02)
      })))

      // Update sentiment scores
      setSentiment(prev => prev.map(s => ({
        ...s,
        score: Math.max(-100, Math.min(100, s.score + (Math.random() - 0.5) * 20)),
        volume: s.volume * (1 + (Math.random() - 0.5) * 0.1),
        volatility: Math.max(0, s.volatility + (Math.random() - 0.5) * 2),
        momentum: s.momentum + (Math.random() - 0.5) * 2
      })))

      // Update technical indicators
      setIndicators(prev => prev.map(indicator => ({
        ...indicator,
        value: indicator.value + (Math.random() - 0.5) * 5,
        strength: Math.max(0, Math.min(100, indicator.strength + (Math.random() - 0.5) * 10))
      })))

      // Random new alert
      if (Math.random() > 0.8) {
        setAlertCount(prev => prev + 1)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getSignalColor = (type: string) => {
    switch (type) {
      case 'BUY': return 'text-green-400'
      case 'SELL': return 'text-red-400'
      case 'HOLD': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'BUY': return ArrowUp
      case 'SELL': return ArrowDown
      case 'HOLD': return Minus
      default: return Activity
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400'
      case 'bearish': return 'text-red-400'
      case 'neutral': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getIndicatorSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy': return 'text-green-400'
      case 'sell': return 'text-red-400'
      case 'neutral': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Alert Counter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              Live Trading Signals
            </span>
          </h2>
          <p className="text-gray-400">AI-powered market analysis and trading recommendations</p>
        </div>
        
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
            <Bell className="h-4 w-4 text-yellow-400" />
            <span className="text-white font-semibold">{alertCount}</span>
            <span className="text-gray-400 text-sm">New Alerts</span>
          </div>
          <Button 
            variant="outline" 
            className="border-gray-600 text-gray-300"
            onClick={() => setAlertCount(0)}
          >
            Clear All
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Signals */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-gray-900/90 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Active Trading Signals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {signals.map((signal, index) => {
                    const SignalIcon = getSignalIcon(signal.type)
                    return (
                      <motion.div
                        key={signal.id}
                        className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-yellow-500/50 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-gray-700 ${getSignalColor(signal.type)}`}>
                              <SignalIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-white font-semibold">{signal.symbol}</h4>
                                <Badge 
                                  variant={signal.type === 'BUY' ? 'default' : signal.type === 'SELL' ? 'destructive' : 'secondary'}
                                  className="text-xs"
                                >
                                  {signal.type}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {signal.timeframe}
                                </Badge>
                              </div>
                              <p className="text-gray-400 text-sm mt-1">{signal.description}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-white font-semibold">${signal.price.toFixed(2)}</div>
                            <div className="text-gray-400 text-sm">
                              {new Date(signal.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="text-center p-2 bg-gray-700/50 rounded">
                            <p className="text-gray-400 text-xs">Strength</p>
                            <p className="text-white font-semibold">{signal.strength}%</p>
                          </div>
                          <div className="text-center p-2 bg-gray-700/50 rounded">
                            <p className="text-gray-400 text-xs">Confidence</p>
                            <p className="text-white font-semibold">{signal.confidence}%</p>
                          </div>
                          <div className="text-center p-2 bg-gray-700/50 rounded">
                            <p className="text-gray-400 text-xs">Target</p>
                            <p className="text-green-400 font-semibold">${signal.targetPrice.toFixed(2)}</p>
                          </div>
                          <div className="text-center p-2 bg-gray-700/50 rounded">
                            <p className="text-gray-400 text-xs">Stop Loss</p>
                            <p className="text-red-400 font-semibold">${signal.stopLoss.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {signal.indicators.map((indicator, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {indicator}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">R/R:</span>
                            <span className="text-yellow-400 font-semibold">{signal.riskReward.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Execute Trade
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-600">
                            Set Alert
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-600">
                            Analyze
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Sentiment & Technical Indicators */}
        <div className="space-y-6">
          {/* Market Sentiment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gray-900/90 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Market Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sentiment.map((s, index) => (
                    <motion.div
                      key={s.symbol}
                      className="p-3 bg-gray-800/50 rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{s.symbol}</span>
                          <Badge 
                            variant={s.sentiment === 'bullish' ? 'default' : s.sentiment === 'bearish' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {s.sentiment}
                          </Badge>
                        </div>
                        <span className={`font-bold ${getSentimentColor(s.sentiment)}`}>
                          {s.score > 0 ? '+' : ''}{s.score}
                        </span>
                      </div>
                      
                      <Progress 
                        value={Math.abs(s.score)} 
                        className="h-2 mb-2"
                      />
                      
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <p className="text-gray-400">Volume</p>
                          <p className="text-white">{(s.volume / 1000000).toFixed(1)}M</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400">Volatility</p>
                          <p className="text-white">{s.volatility.toFixed(1)}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400">Momentum</p>
                          <p className={s.momentum >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {s.momentum.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Technical Indicators */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gray-900/90 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Technical Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {indicators.map((indicator, index) => (
                    <motion.div
                      key={indicator.name}
                      className="flex items-center justify-between p-2 bg-gray-800/50 rounded"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div>
                        <div className="text-white text-sm font-semibold">{indicator.name}</div>
                        <div className="text-gray-400 text-xs">{indicator.value.toFixed(2)}</div>
                      </div>
                      
                      <div className="text-right">
                        <Badge 
                          variant={indicator.signal === 'buy' ? 'default' : indicator.signal === 'sell' ? 'destructive' : 'secondary'}
                          className="text-xs mb-1"
                        >
                          {indicator.signal.toUpperCase()}
                        </Badge>
                        <div className="text-gray-400 text-xs">{indicator.strength}%</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Signal Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gray-900/90 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Signal Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-green-500/10 rounded border border-green-500/20">
                    <span className="text-green-400 font-semibold">Bullish Signals</span>
                    <span className="text-green-400 font-bold">12</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-red-500/10 rounded border border-red-500/20">
                    <span className="text-red-400 font-semibold">Bearish Signals</span>
                    <span className="text-red-400 font-bold">8</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                    <span className="text-yellow-400 font-semibold">Neutral Signals</span>
                    <span className="text-yellow-400 font-bold">5</span>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400 font-semibold">Market Outlook</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Overall market sentiment is moderately bullish with strong momentum in SOL and mixed signals in other assets.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}