"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, Activity, Users, DollarSign, Zap, Globe, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatData {
  id: string
  label: string
  value: number
  displayValue: string
  change: number
  changePercent: number
  icon: React.ReactNode
  color: string
  gradient: string
  trend: 'up' | 'down' | 'stable'
  sparklineData: number[]
}

interface LiveMetric {
  timestamp: number
  tvl: number
  users: number
  transactions: number
  volume24h: number
  apy: number
  goldPrice: number
  networkHealth: number
  gasPrice: number
}

export default function RealTimeStats() {
  const [stats, setStats] = useState<StatData[]>([])
  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [selectedStat, setSelectedStat] = useState<string | null>(null)
  const [isAutoUpdate, setIsAutoUpdate] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  // Simulate real-time data updates
  const generateLiveData = (): LiveMetric => {
    const now = Date.now()
    const baseMetrics = liveMetrics.length > 0 ? liveMetrics[liveMetrics.length - 1] : {
      tvl: 1000000000,
      users: 245230,
      transactions: 12345678,
      volume24h: 45600000,
      apy: 15.8,
      goldPrice: 2.45,
      networkHealth: 99.8,
      gasPrice: 0.000005
    }

    return {
      timestamp: now,
      tvl: baseMetrics.tvl + (Math.random() - 0.5) * 500000,
      users: baseMetrics.users + Math.floor(Math.random() * 50),
      transactions: baseMetrics.transactions + Math.floor(Math.random() * 500),
      volume24h: baseMetrics.volume24h + (Math.random() - 0.5) * 1000000,
      apy: Math.max(8, Math.min(20, baseMetrics.apy + (Math.random() - 0.5) * 0.5)),
      goldPrice: Math.max(1, baseMetrics.goldPrice + (Math.random() - 0.5) * 0.1),
      networkHealth: Math.max(95, Math.min(100, baseMetrics.networkHealth + (Math.random() - 0.5) * 0.5)),
      gasPrice: Math.max(0.000001, baseMetrics.gasPrice + (Math.random() - 0.5) * 0.000002)
    }
  }

  // Calculate trend and change
  const calculateTrend = (current: number, previous: number): { change: number, changePercent: number, trend: 'up' | 'down' | 'stable' } => {
    const change = current - previous
    const changePercent = previous !== 0 ? (change / previous) * 100 : 0
    const trend = Math.abs(changePercent) < 0.1 ? 'stable' : changePercent > 0 ? 'up' : 'down'
    return { change, changePercent, trend }
  }

  // Format numbers with appropriate suffixes
  const formatNumber = (num: number, type: 'currency' | 'number' | 'percentage' | 'decimal' = 'number'): string => {
    if (type === 'currency') {
      if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
      if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
      if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`
      return `$${num.toFixed(2)}`
    }
    if (type === 'percentage') return `${num.toFixed(2)}%`
    if (type === 'decimal') return num.toFixed(6)
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
    return num.toLocaleString()
  }

  // Generate sparkline data
  const generateSparkline = (metrics: LiveMetric[], key: keyof LiveMetric): number[] => {
    return metrics.slice(-20).map(m => m[key] as number)
  }

  // Update stats from live metrics
  const updateStats = () => {
    if (liveMetrics.length < 2) return

    const current = liveMetrics[liveMetrics.length - 1]
    const previous = liveMetrics[liveMetrics.length - 2]

    const newStats: StatData[] = [
      {
        id: 'tvl',
        label: 'Total Value Locked',
        value: current.tvl,
        displayValue: formatNumber(current.tvl, 'currency'),
        ...calculateTrend(current.tvl, previous.tvl),
        icon: <DollarSign className="h-6 w-6" />,
        color: 'text-green-400',
        gradient: 'from-green-400 to-emerald-600',
        sparklineData: generateSparkline(liveMetrics, 'tvl')
      },
      {
        id: 'users',
        label: 'Active Users',
        value: current.users,
        displayValue: formatNumber(current.users),
        ...calculateTrend(current.users, previous.users),
        icon: <Users className="h-6 w-6" />,
        color: 'text-blue-400',
        gradient: 'from-blue-400 to-cyan-600',
        sparklineData: generateSparkline(liveMetrics, 'users')
      },
      {
        id: 'transactions',
        label: 'Total Transactions',
        value: current.transactions,
        displayValue: formatNumber(current.transactions),
        ...calculateTrend(current.transactions, previous.transactions),
        icon: <Activity className="h-6 w-6" />,
        color: 'text-purple-400',
        gradient: 'from-purple-400 to-pink-600',
        sparklineData: generateSparkline(liveMetrics, 'transactions')
      },
      {
        id: 'volume',
        label: '24h Volume',
        value: current.volume24h,
        displayValue: formatNumber(current.volume24h, 'currency'),
        ...calculateTrend(current.volume24h, previous.volume24h),
        icon: <TrendingUp className="h-6 w-6" />,
        color: 'text-yellow-400',
        gradient: 'from-yellow-400 to-orange-600',
        sparklineData: generateSparkline(liveMetrics, 'volume24h')
      },
      {
        id: 'apy',
        label: 'Average APY',
        value: current.apy,
        displayValue: formatNumber(current.apy, 'percentage'),
        ...calculateTrend(current.apy, previous.apy),
        icon: <Zap className="h-6 w-6" />,
        color: 'text-orange-400',
        gradient: 'from-orange-400 to-red-600',
        sparklineData: generateSparkline(liveMetrics, 'apy')
      },
      {
        id: 'goldPrice',
        label: 'GOLD Price',
        value: current.goldPrice,
        displayValue: `$${current.goldPrice.toFixed(4)}`,
        ...calculateTrend(current.goldPrice, previous.goldPrice),
        icon: <Globe className="h-6 w-6" />,
        color: 'text-yellow-500',
        gradient: 'from-yellow-500 to-yellow-600',
        sparklineData: generateSparkline(liveMetrics, 'goldPrice')
      },
      {
        id: 'networkHealth',
        label: 'Network Health',
        value: current.networkHealth,
        displayValue: formatNumber(current.networkHealth, 'percentage'),
        ...calculateTrend(current.networkHealth, previous.networkHealth),
        icon: <Shield className="h-6 w-6" />,
        color: 'text-green-500',
        gradient: 'from-green-500 to-teal-600',
        sparklineData: generateSparkline(liveMetrics, 'networkHealth')
      },
      {
        id: 'gasPrice',
        label: 'Gas Price',
        value: current.gasPrice,
        displayValue: formatNumber(current.gasPrice, 'decimal'),
        ...calculateTrend(current.gasPrice, previous.gasPrice),
        icon: <Activity className="h-6 w-6" />,
        color: 'text-cyan-400',
        gradient: 'from-cyan-400 to-blue-600',
        sparklineData: generateSparkline(liveMetrics, 'gasPrice')
      }
    ]

    setStats(newStats)
    setLastUpdate(new Date())
  }

  // Mini sparkline component
  const Sparkline = ({ data, color }: { data: number[], color: string }) => {
    if (data.length < 2) return null

    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    }).join(' ')

    return (
      <svg className="w-16 h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={`url(#gradient-${color})`}
          strokeWidth="2"
          points={points}
        />
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  // Initialize and start real-time updates
  useEffect(() => {
    // Generate initial data
    const initialMetrics: LiveMetric[] = []
    for (let i = 0; i < 20; i++) {
      initialMetrics.push(generateLiveData())
    }
    setLiveMetrics(initialMetrics)
    setIsLoading(false)

    // Start real-time updates
    const updateInterval = () => {
      if (isAutoUpdate) {
        setLiveMetrics(prev => {
          const newMetric = generateLiveData()
          const updated = [...prev, newMetric].slice(-50) // Keep last 50 data points
          return updated
        })
      }
    }
    
    intervalRef.current = setInterval(updateInterval, 2000) // Update every 2 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  // Update stats when metrics change
  useEffect(() => {
    if (liveMetrics.length >= 2) {
      updateStats()
    }
  }, [liveMetrics])

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="bg-gray-900/50 border-gray-800 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/10 via-transparent to-blue-500/10 animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-radial from-purple-500/20 to-transparent rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-radial from-green-500/20 to-transparent rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
              Live Network Stats
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-4">
            Real-time metrics from the Goldium ecosystem
          </p>
          <motion.div
            className="flex items-center justify-center gap-2 text-sm text-gray-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedStat(selectedStat === stat.id ? null : stat.id)}
                className="group cursor-pointer"
              >
                <Card className={`bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700/50 backdrop-blur-sm hover:border-yellow-500/50 transition-all duration-300 overflow-hidden relative ${
                  selectedStat === stat.id ? 'ring-2 ring-yellow-500/50 border-yellow-500' : ''
                }`}>
                  {/* Animated border */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent transition-opacity duration-300 animate-pulse ${
                    selectedStat === stat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}></div>
                  
                  {/* Pulse effect for selected */}
                  {selectedStat === stat.id && (
                    <motion.div
                      className="absolute inset-0 bg-yellow-500/10 rounded-lg"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                        {stat.icon}
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkline data={stat.sparklineData} color={stat.color.replace('text-', '')} />
                        {stat.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-400" />}
                        {stat.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-400" />}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <motion.div
                        className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.gradient}`}
                        key={stat.displayValue}
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {stat.displayValue}
                      </motion.div>
                      
                      <div className="text-sm text-gray-400 font-medium">
                        {stat.label}
                      </div>
                      
                      <motion.div
                        className={`text-xs flex items-center gap-1 ${
                          stat.trend === 'up' ? 'text-green-400' : 
                          stat.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                        }`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {stat.trend !== 'stable' && (
                          <span className="font-semibold">
                            {stat.changePercent > 0 ? '+' : ''}{stat.changePercent.toFixed(2)}%
                          </span>
                        )}
                        <span className="text-gray-500">vs last update</span>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Interactive Controls */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => setIsAutoUpdate(!isAutoUpdate)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isAutoUpdate 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30' 
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/50 hover:bg-gray-500/30'
            }`}
          >
            {isAutoUpdate ? '🟢 Auto Update ON' : '⏸️ Auto Update OFF'}
          </button>
          
          <button
            onClick={() => {
              const newMetric = generateLiveData()
              setLiveMetrics(prev => [...prev.slice(-19), newMetric])
            }}
            className="px-4 py-2 rounded-lg font-medium bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30 transition-all duration-300"
          >
            🔄 Refresh Now
          </button>
          
          {selectedStat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-sm"
            >
              📊 {stats.find(s => s.id === selectedStat)?.label} selected
            </motion.div>
          )}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-gray-500">
            💡 Click on any stat card to highlight it • Data updates every 2 seconds • Powered by Goldium Network
          </p>
        </motion.div>
      </div>
    </section>
  )
}