'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Coins, 
  ArrowUpDown, 
  Send, 
  Lock, 
  Unlock,
  TrendingUp,
  Shield,
  Zap,
  ExternalLink,
  Info,
  CheckCircle,
  AlertTriangle,
  Wallet,
  RefreshCw,
  Calculator,
  Clock,
  Target,
  BarChart3
} from 'lucide-react'

interface StakingPool {
  id: string
  name: string
  apy: number
  lockPeriod: string
  minStake: number
  totalStaked: string
  rewards: string
  status: 'active' | 'coming_soon' | 'full'
}

interface SwapPair {
  from: string
  to: string
  rate: number
  liquidity: string
  volume24h: string
}

export default function DeFiSection() {
  const [activeTab, setActiveTab] = useState('staking')
  const [stakeAmount, setStakeAmount] = useState('')
  const [swapFromAmount, setSwapFromAmount] = useState('')
  const [swapToAmount, setSwapToAmount] = useState('')
  const [sendAmount, setSendAmount] = useState('')
  const [sendAddress, setSendAddress] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [goldBalance, setGoldBalance] = useState('0')
  const [solBalance, setSolBalance] = useState('0')

  const CONTRACT_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump'
  const SOLSCAN_URL = `https://solscan.io/token/${CONTRACT_ADDRESS}`

  const stakingPools: StakingPool[] = [
    {
      id: 'flexible',
      name: 'Flexible Staking',
      apy: 8.5,
      lockPeriod: 'No lock',
      minStake: 100,
      totalStaked: '12.5M GOLD',
      rewards: '1.06M GOLD',
      status: 'active'
    },
    {
      id: '30days',
      name: '30 Days Lock',
      apy: 12.0,
      lockPeriod: '30 days',
      minStake: 500,
      totalStaked: '8.2M GOLD',
      rewards: '984K GOLD',
      status: 'active'
    },
    {
      id: '90days',
      name: '90 Days Lock',
      apy: 15.5,
      lockPeriod: '90 days',
      minStake: 1000,
      totalStaked: '15.7M GOLD',
      rewards: '2.43M GOLD',
      status: 'active'
    },
    {
      id: '365days',
      name: '1 Year Lock',
      apy: 20.0,
      lockPeriod: '365 days',
      minStake: 5000,
      totalStaked: '25.1M GOLD',
      rewards: '5.02M GOLD',
      status: 'active'
    }
  ]

  const swapPairs: SwapPair[] = [
    {
      from: 'GOLD',
      to: 'SOL',
      rate: 0.0005,
      liquidity: '$2.1M',
      volume24h: '$145K'
    },
    {
      from: 'GOLD',
      to: 'USDC',
      rate: 0.0005,
      liquidity: '$1.8M',
      volume24h: '$98K'
    },
    {
      from: 'SOL',
      to: 'GOLD',
      rate: 2000,
      liquidity: '$2.1M',
      volume24h: '$145K'
    }
  ]

  // Simulate wallet connection
  const connectWallet = async () => {
    try {
      // In real implementation, this would connect to Phantom/Solflare wallet
      setIsConnected(true)
      setWalletAddress('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU')
      setGoldBalance('15,420.50')
      setSolBalance('2.45')
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress('')
    setGoldBalance('0')
    setSolBalance('0')
  }

  // Calculate staking rewards
  const calculateStakingRewards = (amount: string, apy: number, days: number) => {
    const principal = parseFloat(amount) || 0
    const dailyRate = apy / 365 / 100
    const rewards = principal * dailyRate * days
    return rewards.toFixed(2)
  }

  // Calculate swap output
  const calculateSwapOutput = (inputAmount: string, rate: number) => {
    const input = parseFloat(inputAmount) || 0
    return (input * rate).toFixed(6)
  }

  useEffect(() => {
    if (swapFromAmount) {
      const output = calculateSwapOutput(swapFromAmount, swapPairs[0].rate)
      setSwapToAmount(output)
    } else {
      setSwapToAmount('')
    }
  }, [swapFromAmount])

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-6 py-2 mb-6"
          >
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">DeFi Platform</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">DeFi</span> Features
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Stake, swap, and send GOLD tokens with our comprehensive DeFi platform. 
            All transactions are verified on Solana blockchain.
          </motion.p>
        </div>

        {/* Wallet Connection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <Wallet className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {isConnected ? 'Wallet Connected' : 'Connect Your Wallet'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {isConnected 
                        ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`
                        : 'Connect to start using DeFi features'
                      }
                    </p>
                  </div>
                </div>
                
                {isConnected ? (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">GOLD Balance</div>
                      <div className="text-lg font-bold text-yellow-400">{goldBalance}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">SOL Balance</div>
                      <div className="text-lg font-bold text-blue-400">{solBalance}</div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={disconnectWallet}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={connectWallet}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* DeFi Features Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700/50">
              <TabsTrigger value="staking" className="data-[state=active]:bg-blue-600">
                <Lock className="w-4 h-4 mr-2" />
                Staking
              </TabsTrigger>
              <TabsTrigger value="swap" className="data-[state=active]:bg-purple-600">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Swap
              </TabsTrigger>
              <TabsTrigger value="send" className="data-[state=active]:bg-green-600">
                <Send className="w-4 h-4 mr-2" />
                Send
              </TabsTrigger>
            </TabsList>

            {/* Staking Tab */}
            <TabsContent value="staking" className="mt-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Staking Pools */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-2xl font-bold mb-6">Staking Pools</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {stakingPools.map((pool, index) => (
                      <motion.div
                        key={pool.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 * index }}
                      >
                        <Card className="bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50 transition-all duration-300">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{pool.name}</CardTitle>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                {pool.apy}% APY
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Lock Period:</span>
                                <span className="text-white">{pool.lockPeriod}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Min Stake:</span>
                                <span className="text-white">{pool.minStake.toLocaleString()} GOLD</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Total Staked:</span>
                                <span className="text-white">{pool.totalStaked}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Rewards Paid:</span>
                                <span className="text-green-400">{pool.rewards}</span>
                              </div>
                              
                              <Button 
                                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                                disabled={!isConnected}
                              >
                                <Lock className="w-4 h-4 mr-2" />
                                Stake Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Staking Calculator */}
                <div>
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Staking Calculator
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400 block mb-2">Stake Amount (GOLD)</label>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          className="bg-slate-700/50 border-slate-600/50"
                        />
                      </div>
                      
                      {stakeAmount && (
                        <div className="space-y-3 pt-4 border-t border-slate-700/50">
                          <h4 className="font-semibold text-white">Estimated Rewards:</h4>
                          {stakingPools.map((pool) => (
                            <div key={pool.id} className="flex justify-between text-sm">
                              <span className="text-gray-400">{pool.name}:</span>
                              <span className="text-green-400">
                                {calculateStakingRewards(stakeAmount, pool.apy, 30)} GOLD/month
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="pt-4">
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          disabled={!isConnected || !stakeAmount}
                        >
                          <Target className="w-4 h-4 mr-2" />
                          Calculate Rewards
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Swap Tab */}
            <TabsContent value="swap" className="mt-8">
              <div className="max-w-2xl mx-auto">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowUpDown className="w-5 h-5" />
                      Token Swap
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* From Token */}
                    <div>
                      <label className="text-sm text-gray-400 block mb-2">From</label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={swapFromAmount}
                          onChange={(e) => setSwapFromAmount(e.target.value)}
                          className="bg-slate-700/50 border-slate-600/50 pr-20"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            GOLD
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Balance: {goldBalance} GOLD
                      </div>
                    </div>
                    
                    {/* Swap Direction */}
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-slate-600/50 hover:bg-slate-700/50"
                      >
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* To Token */}
                    <div>
                      <label className="text-sm text-gray-400 block mb-2">To</label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={swapToAmount}
                          readOnly
                          className="bg-slate-700/50 border-slate-600/50 pr-20"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            SOL
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Balance: {solBalance} SOL
                      </div>
                    </div>
                    
                    {/* Swap Info */}
                    {swapFromAmount && (
                      <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Exchange Rate:</span>
                          <span className="text-white">1 GOLD = {swapPairs[0].rate} SOL</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Liquidity:</span>
                          <span className="text-white">{swapPairs[0].liquidity}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">24h Volume:</span>
                          <span className="text-white">{swapPairs[0].volume24h}</span>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                      disabled={!isConnected || !swapFromAmount}
                    >
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      Swap Tokens
                    </Button>
                    
                    <div className="text-center">
                      <Button
                        variant="link"
                        onClick={() => window.open(SOLSCAN_URL, '_blank')}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Contract on Solscan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Send Tab */}
            <TabsContent value="send" className="mt-8">
              <div className="max-w-2xl mx-auto">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Send GOLD Tokens
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm text-gray-400 block mb-2">Recipient Address</label>
                      <Input
                        placeholder="Enter Solana wallet address"
                        value={sendAddress}
                        onChange={(e) => setSendAddress(e.target.value)}
                        className="bg-slate-700/50 border-slate-600/50"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        Enter a valid Solana wallet address
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400 block mb-2">Amount (GOLD)</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        className="bg-slate-700/50 border-slate-600/50"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        Available: {goldBalance} GOLD
                      </div>
                    </div>
                    
                    {sendAmount && sendAddress && (
                      <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Network Fee:</span>
                          <span className="text-white">~0.000005 SOL</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total Amount:</span>
                          <span className="text-white">{sendAmount} GOLD</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-yellow-400">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Double-check the recipient address before sending</span>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                      disabled={!isConnected || !sendAmount || !sendAddress}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Tokens
                    </Button>
                    
                    <div className="text-center">
                      <Button
                        variant="link"
                        onClick={() => window.open('https://solscan.io', '_blank')}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Track Transaction
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Contract Verification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">Verified Smart Contract</h3>
              </div>
              
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                All DeFi operations are executed through verified smart contracts on Solana blockchain. 
                Contract address is publicly verifiable on Solscan.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.open(SOLSCAN_URL, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Verify on Solscan
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}