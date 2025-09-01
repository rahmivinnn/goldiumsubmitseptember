'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Percent,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Star,
  Flame,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Lock,
  Unlock,
  RefreshCw,
  ExternalLink,
  Plus,
  Minus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'

interface YieldPool {
  id: string
  name: string
  protocol: string
  tokens: string[]
  apy: number
  apyChange24h: number
  tvl: number
  userStaked: number
  rewards: number
  lockPeriod: number
  riskLevel: 'low' | 'medium' | 'high'
  isActive: boolean
  contractAddress: string
  blockchain: string
  multiplier: number
  endDate?: number
}

interface UserPosition {
  poolId: string
  amount: number
  rewards: number
  entryDate: number
  lockEndDate?: number
}

const YIELD_POOLS: YieldPool[] = [
  {
    id: 'eth-usdc-uni',
    name: 'ETH/USDC',
    protocol: 'Uniswap V3',
    tokens: ['ETH', 'USDC'],
    apy: 24.67,
    apyChange24h: 2.34,
    tvl: 84739284,
    userStaked: 0,
    rewards: 0,
    lockPeriod: 0,
    riskLevel: 'low',
    isActive: true,
    contractAddress: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640',
    blockchain: 'Ethereum',
    multiplier: 1.0
  },
  {
    id: 'wbtc-eth-sushi',
    name: 'WBTC/ETH',
    protocol: 'SushiSwap',
    tokens: ['WBTC', 'ETH'],
    apy: 45.23,
    apyChange24h: -1.87,
    tvl: 23456789,
    userStaked: 0,
    rewards: 0,
    lockPeriod: 30,
    riskLevel: 'medium',
    isActive: true,
    contractAddress: '0xCEfF51756c56CeFFCA006cD410B03FFC46dd3a58',
    blockchain: 'Ethereum',
    multiplier: 2.5
  },
  {
    id: 'aave-comp-curve',
    name: 'AAVE/COMP',
    protocol: 'Curve Finance',
    tokens: ['AAVE', 'COMP'],
    apy: 67.89,
    apyChange24h: 5.67,
    tvl: 156789123,
    userStaked: 0,
    rewards: 0,
    lockPeriod: 90,
    riskLevel: 'high',
    isActive: true,
    contractAddress: '0xDeBF20617708857ebe4F679508E7b7863a8A8EeE',
    blockchain: 'Ethereum',
    multiplier: 4.0
  },
  {
    id: 'matic-usdc-quick',
    name: 'MATIC/USDC',
    protocol: 'QuickSwap',
    tokens: ['MATIC', 'USDC'],
    apy: 89.45,
    apyChange24h: 12.34,
    tvl: 89456789,
    userStaked: 0,
    rewards: 0,
    lockPeriod: 14,
    riskLevel: 'high',
    isActive: true,
    contractAddress: '0x6e7a5FAFcec6BB1e78bAE2A1F0B612012BF14827',
    blockchain: 'Polygon',
    multiplier: 3.2
  },
  {
    id: 'cake-bnb-pancake',
    name: 'CAKE/BNB',
    protocol: 'PancakeSwap',
    tokens: ['CAKE', 'BNB'],
    apy: 156.78,
    apyChange24h: -8.92,
    tvl: 34567890,
    userStaked: 0,
    rewards: 0,
    lockPeriod: 365,
    riskLevel: 'high',
    isActive: true,
    contractAddress: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    blockchain: 'BSC',
    multiplier: 8.5
  },
  {
    id: 'joe-avax-trader',
    name: 'JOE/AVAX',
    protocol: 'TraderJoe',
    tokens: ['JOE', 'AVAX'],
    apy: 234.56,
    apyChange24h: 45.67,
    tvl: 67890123,
    userStaked: 0,
    rewards: 0,
    lockPeriod: 180,
    riskLevel: 'high',
    isActive: true,
    contractAddress: '0x454E67025631C065d3cFAD6d71E6892f74487a15',
    blockchain: 'Avalanche',
    multiplier: 12.0
  }
]

export default function AdvancedYieldFarming() {
  const [pools, setPools] = useState<YieldPool[]>(YIELD_POOLS)
  const [userPositions, setUserPositions] = useState<UserPosition[]>([])
  const [selectedPool, setSelectedPool] = useState<YieldPool | null>(null)
  const [stakeAmount, setStakeAmount] = useState('')
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [sortBy, setSortBy] = useState<'apy' | 'tvl' | 'rewards'>('apy')
  const [isLoading, setIsLoading] = useState(false)
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0)
  const [totalRewards, setTotalRewards] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate real-time APY updates
    const updateAPYs = () => {
      setPools(prevPools => 
        prevPools.map(pool => ({
          ...pool,
          apy: pool.apy + (Math.random() - 0.5) * 2,
          apyChange24h: (Math.random() - 0.5) * 10,
          tvl: pool.tvl * (1 + (Math.random() - 0.5) * 0.02)
        }))
      )
    }

    const interval = setInterval(updateAPYs, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Calculate portfolio totals
    const portfolioValue = userPositions.reduce((total, position) => {
      const pool = pools.find(p => p.id === position.poolId)
      return total + position.amount
    }, 0)
    
    const rewardsValue = userPositions.reduce((total, position) => {
      return total + position.rewards
    }, 0)
    
    setTotalPortfolioValue(portfolioValue)
    setTotalRewards(rewardsValue)
  }, [userPositions, pools])

  const formatCurrency = (amount: number): string => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(2)}K`
    return `$${amount.toFixed(2)}`
  }

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'low': return 'text-green-400 border-green-400'
      case 'medium': return 'text-yellow-400 border-yellow-400'
      case 'high': return 'text-red-400 border-red-400'
      default: return 'text-gray-400 border-gray-400'
    }
  }

  const getBlockchainColor = (blockchain: string): string => {
    switch (blockchain) {
      case 'Ethereum': return 'bg-blue-500/20 text-blue-400'
      case 'Polygon': return 'bg-purple-500/20 text-purple-400'
      case 'BSC': return 'bg-yellow-500/20 text-yellow-400'
      case 'Avalanche': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const handleStake = async (pool: YieldPool) => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid stake amount",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const amount = parseFloat(stakeAmount)
    const newPosition: UserPosition = {
      poolId: pool.id,
      amount,
      rewards: 0,
      entryDate: Date.now(),
      lockEndDate: pool.lockPeriod > 0 ? Date.now() + (pool.lockPeriod * 24 * 60 * 60 * 1000) : undefined
    }
    
    setUserPositions(prev => [...prev, newPosition])
    setPools(prev => prev.map(p => 
      p.id === pool.id 
        ? { ...p, userStaked: p.userStaked + amount, tvl: p.tvl + amount }
        : p
    ))
    
    setStakeAmount('')
    setSelectedPool(null)
    setIsLoading(false)
    
    toast({
      title: "Staking Successful!",
      description: `Successfully staked ${formatCurrency(amount)} in ${pool.name}`,
    })
  }

  const handleUnstake = async (position: UserPosition) => {
    const pool = pools.find(p => p.id === position.poolId)
    if (!pool) return

    if (position.lockEndDate && Date.now() < position.lockEndDate) {
      toast({
        title: "Position Locked",
        description: "This position is still in lock period",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setUserPositions(prev => prev.filter(p => p !== position))
    setPools(prev => prev.map(p => 
      p.id === position.poolId 
        ? { ...p, userStaked: Math.max(0, p.userStaked - position.amount) }
        : p
    ))
    
    setIsLoading(false)
    
    toast({
      title: "Unstaking Successful!",
      description: `Successfully unstaked ${formatCurrency(position.amount + position.rewards)}`,
    })
  }

  const filteredPools = pools
    .filter(pool => filterRisk === 'all' || pool.riskLevel === filterRisk)
    .sort((a, b) => {
      switch (sortBy) {
        case 'apy': return b.apy - a.apy
        case 'tvl': return b.tvl - a.tvl
        case 'rewards': return b.rewards - a.rewards
        default: return 0
      }
    })

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Staked</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalPortfolioValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Total Rewards</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalRewards)}</p>
              </div>
              <Star className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Active Positions</p>
                <p className="text-2xl font-bold text-white">{userPositions.length}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">Avg APY</p>
                <p className="text-2xl font-bold text-white">
                  {userPositions.length > 0 
                    ? `${(userPositions.reduce((sum, pos) => {
                        const pool = pools.find(p => p.id === pos.poolId)
                        return sum + (pool?.apy || 0)
                      }, 0) / userPositions.length).toFixed(2)}%`
                    : '0.00%'
                  }
                </p>
              </div>
              <Percent className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={filterRisk === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRisk('all')}
              >
                All Pools
              </Button>
              <Button
                variant={filterRisk === 'low' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRisk('low')}
                className={filterRisk === 'low' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Low Risk
              </Button>
              <Button
                variant={filterRisk === 'medium' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRisk('medium')}
                className={filterRisk === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
              >
                Medium Risk
              </Button>
              <Button
                variant={filterRisk === 'high' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRisk('high')}
                className={filterRisk === 'high' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                High Risk
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'apy' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('apy')}
              >
                Sort by APY
              </Button>
              <Button
                variant={sortBy === 'tvl' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('tvl')}
              >
                Sort by TVL
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yield Pools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPools.map((pool) => (
          <motion.div
            key={pool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-all duration-300 h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{pool.name}</CardTitle>
                    <p className="text-sm text-gray-400">{pool.protocol}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={getBlockchainColor(pool.blockchain)}>
                      {pool.blockchain}
                    </Badge>
                    <Badge variant="outline" className={getRiskColor(pool.riskLevel)}>
                      {pool.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* APY Display */}
                <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 p-4 rounded-lg border border-green-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Current APY</span>
                    <div className="flex items-center gap-1">
                      {pool.apyChange24h > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      )}
                      <span className={`text-xs ${
                        pool.apyChange24h > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {pool.apyChange24h > 0 ? '+' : ''}{pool.apyChange24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-400">
                    {pool.apy.toFixed(2)}%
                  </div>
                  {pool.multiplier > 1 && (
                    <div className="flex items-center gap-1 mt-2">
                      <Flame className="h-4 w-4 text-orange-400" />
                      <span className="text-sm text-orange-400">
                        {pool.multiplier}x Multiplier
                      </span>
                    </div>
                  )}
                </div>

                {/* Pool Stats */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400">TVL</p>
                    <p className="font-semibold">{formatCurrency(pool.tvl)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Your Stake</p>
                    <p className="font-semibold text-blue-400">
                      {formatCurrency(pool.userStaked)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Lock Period</p>
                    <p className="font-semibold">
                      {pool.lockPeriod === 0 ? 'No Lock' : `${pool.lockPeriod} days`}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Rewards</p>
                    <p className="font-semibold text-green-400">
                      {formatCurrency(pool.rewards)}
                    </p>
                  </div>
                </div>

                {/* Contract Address */}
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Contract</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-blue-400 flex-1 truncate">
                      {pool.contractAddress}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`https://etherscan.io/address/${pool.contractAddress}`, '_blank')}
                      className="h-6 w-6 p-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => setSelectedPool(pool)}
                  disabled={!pool.isActive}
                >
                  {pool.isActive ? (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Stake Tokens
                    </>
                  ) : (
                    'Pool Inactive'
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* User Positions */}
      {userPositions.length > 0 && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              Your Active Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userPositions.map((position, index) => {
                const pool = pools.find(p => p.id === position.poolId)
                if (!pool) return null
                
                const isLocked = position.lockEndDate && Date.now() < position.lockEndDate
                const lockTimeLeft = position.lockEndDate ? Math.max(0, position.lockEndDate - Date.now()) : 0
                const daysLeft = Math.ceil(lockTimeLeft / (24 * 60 * 60 * 1000))
                
                return (
                  <motion.div
                    key={index}
                    className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{pool.name}</h3>
                          <Badge className={getBlockchainColor(pool.blockchain)}>
                            {pool.blockchain}
                          </Badge>
                          {isLocked && (
                            <Badge variant="outline" className="text-orange-400 border-orange-400">
                              <Lock className="h-3 w-3 mr-1" />
                              {daysLeft} days left
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Staked</p>
                            <p className="font-semibold">{formatCurrency(position.amount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Rewards</p>
                            <p className="font-semibold text-green-400">
                              {formatCurrency(position.rewards)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">APY</p>
                            <p className="font-semibold text-blue-400">{pool.apy.toFixed(2)}%</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Entry Date</p>
                            <p className="font-semibold">
                              {new Date(position.entryDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnstake(position)}
                        disabled={isLocked || isLoading}
                        className="ml-4"
                      >
                        {isLocked ? (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Locked
                          </>
                        ) : (
                          <>
                            <Minus className="h-4 w-4 mr-2" />
                            Unstake
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stake Modal */}
      <AnimatePresence>
        {selectedPool && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPool(null)}
          >
            <motion.div
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Stake in {selectedPool.name}</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Current APY</span>
                    <span className="text-green-400 font-semibold">
                      {selectedPool.apy.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Lock Period</span>
                    <span className="text-blue-400">
                      {selectedPool.lockPeriod === 0 ? 'No Lock' : `${selectedPool.lockPeriod} days`}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Amount to Stake</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedPool(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => handleStake(selectedPool)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4 mr-2" />
                    )}
                    {isLoading ? 'Staking...' : 'Stake Now'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}