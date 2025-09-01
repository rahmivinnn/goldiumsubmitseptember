"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Percent,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface PortfolioMetrics {
  totalValue: number
  dayChange: number
  dayChangePercent: number
  weekChange: number
  weekChangePercent: number
  monthChange: number
  monthChangePercent: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
  avgTradeSize: number
  totalTrades: number
  profitableTrades: number
}

interface AssetAllocation {
  symbol: string
  name: string
  value: number
  percentage: number
  change24h: number
  price: number
  amount: number
  color: string
}

interface RiskMetric {
  label: string
  value: number
  maxValue: number
  status: 'low' | 'medium' | 'high'
  description: string
}

export default function AdvancedPortfolioAnalytics() {
  const [timeframe, setTimeframe] = useState('24h')
  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalValue: 12847.32,
    dayChange: 234.56,
    dayChangePercent: 1.89,
    weekChange: 1456.78,
    weekChangePercent: 12.8,
    monthChange: 2345.67,
    monthChangePercent: 22.3,
    sharpeRatio: 2.34,
    maxDrawdown: -8.23,
    winRate: 68.5,
    avgTradeSize: 847.32,
    totalTrades: 156,
    profitableTrades: 107
  })

  const [allocations, setAllocations] = useState<AssetAllocation[]>([
    {
      symbol: 'SOL',
      name: 'Solana',
      value: 5781.29,
      percentage: 45,
      change24h: 2.34,
      price: 156.42,
      amount: 36.98,
      color: '#9945FF'
    },
    {
      symbol: 'GOLD',
      name: 'Goldium Token',
      value: 3854.20,
      percentage: 30,
      change24h: -1.23,
      price: 1.85,
      amount: 2083.35,
      color: '#FFD700'
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      value: 1927.10,
      percentage: 15,
      change24h: 0.89,
      price: 43250.00,
      amount: 0.0446,
      color: '#F7931A'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      value: 1284.73,
      percentage: 10,
      change24h: 0.01,
      price: 1.00,
      amount: 1284.73,
      color: '#2775CA'
    }
  ])

  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([
    {
      label: 'Concentration Risk',
      value: 45,
      maxValue: 100,
      status: 'medium',
      description: 'SOL allocation is 45% of portfolio'
    },
    {
      label: 'Volatility Risk',
      value: 32,
      maxValue: 100,
      status: 'low',
      description: 'Portfolio volatility is within acceptable range'
    },
    {
      label: 'Liquidity Risk',
      value: 15,
      maxValue: 100,
      status: 'low',
      description: 'High liquidity across all positions'
    },
    {
      label: 'Correlation Risk',
      value: 68,
      maxValue: 100,
      status: 'high',
      description: 'High correlation between crypto assets'
    }
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalValue: prev.totalValue + (Math.random() - 0.5) * 100,
        dayChange: prev.dayChange + (Math.random() - 0.5) * 10,
        dayChangePercent: prev.dayChangePercent + (Math.random() - 0.5) * 0.5
      }))

      setAllocations(prev => prev.map(asset => ({
        ...asset,
        change24h: asset.change24h + (Math.random() - 0.5) * 0.5,
        price: asset.price * (1 + (Math.random() - 0.5) * 0.01)
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getRiskColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getRiskIcon = (status: string) => {
    switch (status) {
      case 'low': return CheckCircle
      case 'medium': return Clock
      case 'high': return AlertTriangle
      default: return Activity
    }
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gray-900/90 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Portfolio Performance
                </CardTitle>
                <div className="flex gap-2">
                  {['24h', '7d', '30d', '1y'].map((period) => (
                    <Button
                      key={period}
                      variant={timeframe === period ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTimeframe(period)}
                      className={timeframe === period 
                        ? 'bg-yellow-500 text-black' 
                        : 'border-gray-600 text-gray-300'
                      }
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Total Value */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <p className="text-3xl font-bold text-white">
                        ${metrics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <div className="flex items-center gap-2">
                        {metrics.dayChange >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        )}
                        <span className={`text-sm font-semibold ${
                          metrics.dayChange >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {metrics.dayChange >= 0 ? '+' : ''}${metrics.dayChange.toFixed(2)} ({metrics.dayChangePercent.toFixed(2)}%)
                        </span>
                        <span className="text-gray-400 text-sm">24h</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Chart Placeholder */}
                  <div className="h-48 bg-gray-800/50 rounded-lg flex items-center justify-center border border-gray-700">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400">Portfolio Performance Chart</p>
                      <p className="text-gray-500 text-sm">Real-time data visualization</p>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-400 text-sm">Sharpe Ratio</p>
                    <p className="text-white font-bold text-lg">{metrics.sharpeRatio}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-400 text-sm">Max Drawdown</p>
                    <p className="text-red-400 font-bold text-lg">{metrics.maxDrawdown}%</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-400 text-sm">Win Rate</p>
                    <p className="text-green-400 font-bold text-lg">{metrics.winRate}%</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-400 text-sm">Total Trades</p>
                    <p className="text-white font-bold text-lg">{metrics.totalTrades}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Asset Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gray-900/90 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Asset Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Pie Chart Placeholder */}
                <div className="h-48 bg-gray-800/50 rounded-lg flex items-center justify-center border border-gray-700 mb-4">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400">Asset Distribution</p>
                  </div>
                </div>

                {/* Asset List */}
                <div className="space-y-3">
                  {allocations.map((asset, index) => (
                    <motion.div
                      key={asset.symbol}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: asset.color }}
                        />
                        <div>
                          <div className="text-white font-semibold text-sm">{asset.symbol}</div>
                          <div className="text-gray-400 text-xs">{asset.amount.toFixed(4)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold text-sm">{asset.percentage}%</div>
                        <div className={`text-xs ${
                          asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Risk Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-gray-900/90 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {riskMetrics.map((risk, index) => {
                const Icon = getRiskIcon(risk.status)
                return (
                  <motion.div
                    key={risk.label}
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${getRiskColor(risk.status)}`} />
                        <span className="text-white font-semibold">{risk.label}</span>
                      </div>
                      <Badge 
                        variant={risk.status === 'low' ? 'default' : risk.status === 'medium' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {risk.status.toUpperCase()}
                      </Badge>
                    </div>
                    <Progress 
                      value={risk.value} 
                      className="h-2"
                    />
                    <p className="text-gray-400 text-sm">{risk.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trading Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="bg-gray-900/90 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Trading Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total Trades', value: metrics.totalTrades, icon: Activity },
                { label: 'Profitable', value: metrics.profitableTrades, icon: TrendingUp },
                { label: 'Win Rate', value: `${metrics.winRate}%`, icon: Target },
                { label: 'Avg Trade', value: `$${metrics.avgTradeSize}`, icon: DollarSign },
                { label: 'Best Trade', value: '+$456.78', icon: TrendingUp },
                { label: 'Worst Trade', value: '-$89.23', icon: TrendingDown }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <stat.icon className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-white font-bold text-lg">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}