'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { 
  Coins, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Shield, 
  Users, 
  Zap, 
  Lock, 
  Unlock,
  ExternalLink,
  Copy,
  CheckCircle,
  Info,
  Calendar,
  Target,
  BarChart3,
  DollarSign,
  Gift,
  Star,
  Crown,
  Sparkles
} from 'lucide-react'

interface TokenDistribution {
  category: string
  percentage: number
  amount: number
  color: string
  description: string
  lockPeriod?: string
  vestingSchedule?: string
}

interface TokenMetric {
  label: string
  value: string
  subtext: string
  icon: string
  change?: number
}

interface UtilityFeature {
  title: string
  description: string
  icon: string
  benefits?: string[]
}

interface TokenomicsData {
  tokenDistribution: TokenDistribution[]
  tokenMetrics: TokenMetric[]
  utilityFeatures: UtilityFeature[]
  contractInfo: {
    address: string
    network: string
    standard: string
    decimals: number
    verified: boolean
    audit: {
      status: string
      firm: string
      date: string
      score: number
    }
  }
  priceInfo: {
    current: number
    currency: string
    change24h: number
    volume24h: number
    allTimeHigh: number
    allTimeLow: number
  }
}

const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: JSX.Element } = {
    supply: <Coins className="w-8 h-8" />,
    circulation: <TrendingUp className="w-8 h-8" />,
    market: <DollarSign className="w-8 h-8" />,
    holders: <Users className="w-8 h-8" />,
    governance: <Shield className="w-6 h-6" />,
    staking: <Coins className="w-6 h-6" />,
    discount: <Zap className="w-6 h-6" />,
    farming: <Gift className="w-6 h-6" />,
    nft: <Star className="w-6 h-6" />,
    premium: <Crown className="w-6 h-6" />
  }
  return iconMap[iconName] || <Sparkles className="w-6 h-6" />
}

const getIconColor = (index: number) => {
  const colors = ['text-amber-400', 'text-orange-400', 'text-yellow-400', 'text-amber-400']
  return colors[index % colors.length]
}

export default function TokenomicsSection() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('distribution')
  const [tokenomicsData, setTokenomicsData] = useState<TokenomicsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const CONTRACT_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump'
  const SOLSCAN_URL = `https://solscan.io/token/${CONTRACT_ADDRESS}`

  useEffect(() => {
    const fetchTokenomicsData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/tokenomics')
        if (!response.ok) {
          throw new Error('Failed to fetch tokenomics data')
        }
        const data = await response.json()
        setTokenomicsData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTokenomicsData()
  }, [])

  const copyContractAddress = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy contract address:', err)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-full px-6 py-2 mb-6"
          >
            <PieChartIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Tokenomics</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">GOLDIUM</span> Token Economics
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Transparent tokenomics designed for sustainable growth, fair distribution, 
            and long-term value creation in the Solana ecosystem.
          </motion.p>
        </div>

        {/* Contract Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-bold text-white">Verified Smart Contract</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    GOLDIUM is a SPL token deployed on Solana mainnet. 
                    All contract details are publicly verifiable.
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-400 block mb-1">Contract Address:</span>
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-sm bg-slate-800/50 p-2 rounded border flex-1 break-all">
                          {CONTRACT_ADDRESS}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={copyContractAddress}
                          className="border-gray-500/30 text-gray-400 hover:bg-gray-500/20"
                        >
                          {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Button
                    onClick={() => window.open(SOLSCAN_URL, '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Solscan
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://raydium.io', '_blank')}
                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Trade on Raydium
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            <p className="text-gray-300 mt-4">Loading tokenomics data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="text-red-400 mb-4">
              <Info className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-red-400">Error loading tokenomics data: {error}</p>
          </div>
        )}

        {/* Token Metrics */}
        {tokenomicsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {tokenomicsData.tokenMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-3 rounded-lg bg-slate-700/50 mb-4 ${getIconColor(index)}`}>
                      {getIconComponent(metric.icon)}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
                    <p className="text-sm font-semibold text-gray-300 mb-2">{metric.label}</p>
                    <p className="text-xs text-gray-400">{metric.subtext}</p>
                    {metric.change && (
                      <div className={`text-xs mt-2 ${metric.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(2)}% (24h)
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Token Distribution */}
        {tokenomicsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">Token Distribution</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Fair and transparent distribution designed to ensure long-term sustainability and community growth.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Distribution Chart Visualization */}
              <Card className="bg-slate-800/30 border-slate-700/30">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-6 text-center">Distribution Breakdown</h4>
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tokenomicsData.tokenDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ category, percentage }) => `${category}: ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="percentage"
                        >
                          {tokenomicsData.tokenDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any, name: any, props: any) => [
                            `${value}% (${(props.payload.amount / 1000000).toFixed(0)}M GOLD)`,
                            props.payload.category
                          ]}
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#ffffff'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {tokenomicsData.tokenDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium text-white">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">{item.percentage}%</div>
                          <div className="text-xs text-gray-400">{(item.amount / 1000000).toFixed(0)}M GOLD</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Distribution Details */}
              <div className="space-y-4">
                {tokenomicsData.tokenDistribution.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card className="bg-slate-800/30 border-slate-700/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="font-bold text-white">{item.category}</h5>
                            <p className="text-sm text-gray-300">{item.description}</p>
                          </div>
                          <Badge className="text-white border-0" style={{ backgroundColor: item.color }}>
                            {item.percentage}%
                          </Badge>
                        </div>
                        
                        {item.lockPeriod && (
                          <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-700/50">
                            <div>
                              <span className="text-xs text-gray-400 block">Lock Period:</span>
                              <span className="text-sm text-white">{item.lockPeriod}</span>
                            </div>
                            <div>
                              <span className="text-xs text-gray-400 block">Vesting:</span>
                              <span className="text-sm text-white">{item.vestingSchedule}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Utility Features */}
        {tokenomicsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">Token Utility</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                GOLD token provides multiple utilities within the ecosystem, creating real value and demand.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokenomicsData.utilityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="h-full bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-yellow-500/20">
                          <div className="text-yellow-400">
                            {getIconComponent(feature.icon)}
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                      <p className="text-sm text-gray-300 mb-4">{feature.description}</p>
                      
                      {feature.benefits && (
                        <div className="space-y-2">
                          {feature.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              <span className="text-xs text-gray-300">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Start Using GOLD Token
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Join the growing ecosystem and start earning rewards through staking, 
                providing liquidity, and participating in governance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
                  onClick={() => window.open('/defi', '_self')}
                >
                  <Coins className="w-5 h-5 mr-2" />
                  Start Staking
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                  onClick={() => window.open(SOLSCAN_URL, '_blank')}
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}