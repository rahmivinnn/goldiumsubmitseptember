'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ThreeJSBackground from '@/components/ThreeJSBackground'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Zap, 
  Activity, 
  Globe, 
  Star,
  Award,
  Target,
  Coins
} from 'lucide-react'

interface LiveStat {
  id: string
  label: string
  value: number
  displayValue: string
  change: number
  changePercent: number
  icon: React.ReactNode
  color: string
  gradient: string
  prefix?: string
  suffix?: string
  trend: 'up' | 'down' | 'stable'
}

export default function LiveStatsSection() {
  const [stats, setStats] = useState<LiveStat[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real data from API
  const fetchLiveStats = async () => {
    try {
      const response = await fetch('/api/live-stats')
      const data = await response.json()
      
      if (data.error) {
        console.error('API Error:', data.error)
        return
      }
      
      const newStats: LiveStat[] = [
        {
          id: 'tvl',
          label: 'Total Value Locked',
          value: data.tvl.value,
          displayValue: data.tvl.displayValue,
          change: data.tvl.value * (data.tvl.change24h / 100),
          changePercent: data.tvl.change24h,
          icon: <DollarSign className="w-6 h-6" />,
          color: 'text-amber-400',
          gradient: 'from-amber-400 to-orange-500',
          prefix: '$',
          trend: data.tvl.trend as 'up' | 'down' | 'stable'
        },
        {
          id: 'users',
          label: 'Active Users',
          value: data.activeUsers.value,
          displayValue: data.activeUsers.displayValue,
          change: data.activeUsers.value * (data.activeUsers.change24h / 100),
          changePercent: data.activeUsers.change24h,
          icon: <Users className="w-6 h-6" />,
          color: 'text-orange-400',
          gradient: 'from-orange-400 to-amber-500',
          trend: data.activeUsers.trend as 'up' | 'down' | 'stable'
        },
        {
          id: 'rewards',
          label: 'Rewards Claimed',
          value: data.rewardsClaimed.value,
          displayValue: data.rewardsClaimed.displayValue,
          change: data.rewardsClaimed.value * (data.rewardsClaimed.change24h / 100),
          changePercent: data.rewardsClaimed.change24h,
          icon: <Award className="w-6 h-6" />,
          color: 'text-yellow-400',
          gradient: 'from-yellow-400 to-orange-500',
          suffix: ' GOLD',
          trend: data.rewardsClaimed.trend as 'up' | 'down' | 'stable'
        },
        {
          id: 'apy',
          label: 'Average APY',
          value: data.averageAPY.value,
          displayValue: data.averageAPY.displayValue,
          change: data.averageAPY.value * (data.averageAPY.change24h / 100),
          changePercent: data.averageAPY.change24h,
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'text-yellow-400',
          gradient: 'from-yellow-400 to-amber-500',
          suffix: '%',
          trend: data.averageAPY.trend as 'up' | 'down' | 'stable'
        },
        {
          id: 'transactions',
          label: '24h Transactions',
          value: data.transactions24h.value,
          displayValue: data.transactions24h.displayValue,
          change: data.transactions24h.value * (data.transactions24h.change24h / 100),
          changePercent: data.transactions24h.change24h,
          icon: <Activity className="w-6 h-6" />,
          color: 'text-amber-400',
          gradient: 'from-amber-400 to-yellow-500',
          trend: data.transactions24h.trend as 'up' | 'down' | 'stable'
        },
        {
          id: 'staked',
          label: 'Total Staked',
          value: data.totalStaked.value,
          displayValue: data.totalStaked.displayValue,
          change: data.totalStaked.value * (data.totalStaked.change24h / 100),
          changePercent: data.totalStaked.change24h,
          icon: <Coins className="w-6 h-6" />,
          color: 'text-orange-400',
          gradient: 'from-orange-400 to-red-500',
          suffix: ' GOLD',
          trend: data.totalStaked.trend as 'up' | 'down' | 'stable'
        }
      ]
      
      setStats(newStats)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching live stats:', error)
      setLoading(false)
    }
  }

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchLiveStats()
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchLiveStats()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const [recentActivities, setRecentActivities] = useState([
    { user: '0x7a2f...8b4c', action: 'Staked 1,500 GOLD', reward: '+75 GOLD', time: '2s ago' },
    { user: '0x9e1d...3f7a', action: 'Claimed rewards', reward: '+247 GOLD', time: '5s ago' },
    { user: '0x4c8b...9e2d', action: 'Joined platform', reward: '+100 GOLD', time: '8s ago' },
    { user: '0x1f5a...7c9e', action: 'Swapped 0.5 SOL', reward: '+12 GOLD', time: '12s ago' },
    { user: '0x8d3c...4a1f', action: 'Added liquidity', reward: '+89 GOLD', time: '15s ago' }
  ])

  // Update recent activities
  useEffect(() => {
    const activityInterval = setInterval(() => {
      const newActivities = [
        { user: '0x7a2f...8b4c', action: 'Staked 1,500 GOLD', reward: '+75 GOLD', time: '2s ago' },
        { user: '0x9e1d...3f7a', action: 'Claimed rewards', reward: '+247 GOLD', time: '5s ago' },
        { user: '0x4c8b...9e2d', action: 'Joined platform', reward: '+100 GOLD', time: '8s ago' },
        { user: '0x1f5a...7c9e', action: 'Swapped 0.5 SOL', reward: '+12 GOLD', time: '12s ago' },
        { user: '0x8d3c...4a1f', action: 'Added liquidity', reward: '+89 GOLD', time: '15s ago' }
      ]
      
      // Randomly update one activity
      const randomIndex = Math.floor(Math.random() * newActivities.length)
      const actions = ['Staked', 'Claimed rewards', 'Swapped', 'Added liquidity', 'Joined platform']
      const rewards = ['+75 GOLD', '+247 GOLD', '+500 GOLD', '+12 GOLD', '+89 GOLD', '+156 GOLD', '+324 GOLD']
      
      newActivities[randomIndex] = {
        user: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        reward: rewards[Math.floor(Math.random() * rewards.length)],
        time: 'Just now'
      }
      
      setRecentActivities(newActivities)
    }, 5000)

    return () => clearInterval(activityInterval)
  }, [])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toFixed(0)
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Three.js Background */}
      <div className="absolute inset-0">
        <ThreeJSBackground />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
            <Activity className="w-4 h-4 mr-2" />
            Live Data
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 relative">
            <span className="holographic-text animate-neon-glow">
              Real-Time Platform
            </span>
            <br />
            <span className="holographic-text animate-neon-glow">
              Statistics
            </span>
            <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-gold/20 to-transparent animate-shimmer" />
          </h2>
          <motion.p 
            className="text-xl premium-text max-w-2xl mx-auto animate-floating"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Watch our ecosystem grow in real-time. Join thousands of users earning rewards every second.
          </motion.p>
        </motion.div>

        {/* Super Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotateY: 5, z: 50 }}
              className="relative group perspective-1000"
            >
              {/* Card */}
              <Card className="relative backdrop-blur-xl border border-slate-700/50 bg-slate-900/80 overflow-hidden">
                {/* Subtle Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 to-slate-800/95" />
                
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <div className={`${stat.color}`}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                      <span className="text-xs text-amber-400">Live</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm premium-text font-medium animate-floating">{stat.label}</h3>
                    <motion.div 
                      className={`text-3xl font-bold holographic-text animate-neon-glow ${stat.color}`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                    >
                      {stat.displayValue}
                    </motion.div>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 text-sm ${
                        stat.trend === 'up' ? 'text-amber-400' : 
                        stat.trend === 'down' ? 'text-orange-600' : 'text-gray-400'
                      }`}>
                        {stat.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : stat.trend === 'down' ? (
                          <TrendingUp className="w-4 h-4 rotate-180" />
                        ) : (
                          <Target className="w-4 h-4" />
                        )}
                        <span>+{Math.abs(stat.changePercent).toFixed(1)}%</span>
                      </div>
                      <span className="text-xs text-gray-500">24h</span>
                    </div>
                  </div>
                </CardContent>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-bold text-purple-400">Live Activity Feed</h3>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2" />
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-gray-700/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-gray-300">{activity.user}</span>
                          <span className="text-gray-400">{activity.action}</span>
                        </div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-semibold">
                      {activity.reward}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <Zap className="w-4 h-4 mr-2" />
                  {stats.length > 1 ? formatNumber(stats[1].value) : '0'} users earning rewards right now
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}