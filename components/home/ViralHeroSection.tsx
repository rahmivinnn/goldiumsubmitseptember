'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import ThreeJSBackground from '@/components/ThreeJSBackground'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Rocket, 
  Zap, 
  TrendingUp, 
  Users, 
  Timer, 
  Gift, 
  Star, 
  Crown, 
  Target,
  ArrowRight,
  Copy,
  CheckCircle,
  Sparkles,
  DollarSign,
  Award,
  Coins,
  Activity,
  Flame,
  Clock,
  Gamepad2,
  Trophy,
  Sword,
  Shield,
  Joystick
} from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/navigation'
import WalletDisplay from '@/components/WalletDisplay'

// Three.js Background Component
const Background3D = () => {
  return (
    <ThreeJSBackground className="opacity-80" />
  )
}

interface LiveStat {
  label: string
  value: number
  displayValue: string
  icon: React.ReactNode
  color: string
  change: string
}

interface CountdownTimer {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const GOLDIUM_GAME_URL = 'https://games.goldium.io'
const CONTRACT_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump'

export default function ViralHeroSection() {
  const [copied, setCopied] = useState(false)
  const [playersOnline, setPlayersOnline] = useState(12500)
  const [gamesPlayed, setGamesPlayed] = useState(850000)
  const [tokensEarned, setTokensEarned] = useState(1000000)

  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const router = useRouter()



  // Live gaming stats updates
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setPlayersOnline(prev => prev + Math.floor(Math.random() * 50) - 25)
      setGamesPlayed(prev => prev + Math.floor(Math.random() * 100))
      setTokensEarned(prev => prev + Math.floor(Math.random() * 5000))
    }, 2000)

    return () => clearInterval(statsInterval)
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

  const handlePlayNow = () => {
    if (connected) {
      // Open goldium.io game in new tab
      window.open(GOLDIUM_GAME_URL, '_blank')
    } else {
      setVisible(true)
    }
  }

  const handlePlay2D = () => {
    if (connected) {
      // Redirect to 2D games page
      router.push('/games')
    } else {
      setVisible(true)
    }
  }



  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-purple-900/20 to-black matrix-bg">
      {/* Simple Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl" />
      </div>
      
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Background3D />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 z-10" />
      


      {/* Main Content */}
      <div className="relative z-30 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Gaming Alert Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2 text-sm font-medium">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Web3 Gaming Universe Now Live!
            </Badge>
          </motion.div>

          {/* Premium Hero Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 relative z-10">
              GOLDIUM
            </span>
            </h1>
            <motion.p 
              className="text-xl md:text-2xl premium-text mb-8 max-w-3xl mx-auto animate-floating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Advanced DeFi Platform on Solana
            </motion.p>
          </motion.div>

          {/* Super Premium Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <motion.div 
              className="super-premium-card rounded-xl p-6 text-center animate-floating cyber-border bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-amber-500/20"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl font-bold text-white mb-2">
                {(playersOnline / 1000).toFixed(1)}K
              </div>
              <div className="premium-text text-sm uppercase tracking-wider text-slate-300 opacity-70">Players Online</div>
              <div className="mt-2 flex justify-center">
                <div className="w-8 h-1 bg-gradient-to-r from-gray-400/40 via-white/40 to-gray-400/40 rounded-full" />
              </div>
            </motion.div>
            
            <motion.div 
              className="super-premium-card rounded-xl p-6 text-center animate-floating cyber-border bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-amber-500/20"
              whileHover={{ scale: 1.05, rotateY: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{animationDelay: '0.5s'}}
            >
              <div className="text-4xl font-bold text-white mb-2">
                {(gamesPlayed / 1000).toFixed(0)}K
              </div>
              <div className="premium-text text-sm uppercase tracking-wider text-slate-300 opacity-70">Games Played</div>
              <div className="mt-2 flex justify-center">
                <div className="w-8 h-1 bg-gradient-to-r from-gray-400/40 via-white/40 to-gray-400/40 rounded-full" />
              </div>
            </motion.div>
            
            <motion.div 
              className="super-premium-card rounded-xl p-6 text-center animate-floating cyber-border bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-amber-500/20"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{animationDelay: '1s'}}
            >
              <div className="text-4xl font-bold text-white mb-2">
                {(tokensEarned / 1000000).toFixed(0)}M
              </div>
              <div className="premium-text text-sm uppercase tracking-wider text-slate-300 opacity-70">Tokens Earned</div>
              <div className="mt-2 flex justify-center">
                <div className="w-8 h-1 bg-gradient-to-r from-gray-400/40 via-white/40 to-gray-400/40 rounded-full" />
              </div>
            </motion.div>
          </motion.div>



          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero Content */}
            <div className="space-y-8">
              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Web3 Gaming Ecosystem
                  </Badge>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    GOLDIUM
                  </span>
                  <br />
                  <span className="text-white">DeFi Platform</span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    on Solana
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 leading-relaxed">
                  Discover the power of decentralized finance on Solana blockchain. GOLDIUM provides 
                  <span className="text-green-400 font-bold">transparent staking protocols</span>, secure token swaps, and verified smart contracts powered by the 
                  <span className="text-yellow-400 font-bold">GOLD token</span>. Build wealth through audited DeFi mechanisms, 
                  participate in governance, and earn sustainable rewards through our verified platform.
                </p>
              </motion.div>

              {/* Gaming Features Highlight */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 font-semibold">DeFi Features</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">Secure Staking (Up to 20% APY)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Token Swap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Verified Contract</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">Audited & Secure</span>
                  </div>
                </div>
                  
                  {/* DeFi Links */}
                  <div className="mt-3 space-y-2">
                    <div className="p-3 bg-gray-500/10 border border-gray-500/30 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-gray-400 text-sm font-medium">Solscan Verification:</span>
                          <div className="text-blue-400 text-sm mt-1 hover:underline cursor-pointer" onClick={() => window.open('https://solscan.io/token/' + CONTRACT_ADDRESS, '_blank')}>View on Solscan</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open('https://solscan.io/token/' + CONTRACT_ADDRESS, '_blank')}
                          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                        >
                          <Rocket className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-500/10 border border-gray-500/30 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-gray-400 text-sm font-medium">Token Contract:</span>
                          <div className="font-mono text-xs text-gray-300 mt-1 break-all">{CONTRACT_ADDRESS}</div>
                        </div>
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
              </motion.div>

              {/* Super Premium CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-6"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotateX: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/60 via-purple-400/60 to-slate-400/60 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse" />
                  <Button
                    size="lg"
                    onClick={() => window.open('https://solscan.io/token/' + CONTRACT_ADDRESS, '_blank')}
                    className="relative super-premium-card text-white font-bold text-lg px-8 py-4 rounded-xl border-0 overflow-hidden bg-gradient-to-r from-amber-600/80 to-amber-500/80 hover:from-amber-700/80 hover:to-amber-600/80 shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      <span className="text-white font-semibold">Verify Contract</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </span>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, rotateX: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/60 via-amber-500/60 to-slate-500/60 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse" />
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => window.open('#defi', '_self')}
                    className="relative cyber-border premium-text font-bold text-lg px-8 py-4 rounded-xl bg-transparent hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-violet-500/15 transition-all duration-300 border-2 border-amber-500/30 text-white"
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    <span className="text-white font-semibold">Start Staking</span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Gaming Indicators */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-wrap gap-6 text-sm text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>Smart Contract Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Audited & Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span>Solana Mainnet</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Live Gaming Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Live DeFi Stats Card */}
              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 font-semibold">Live DeFi Stats</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        20%
                      </div>
                      <div className="text-sm text-gray-400">Max APY</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-400">
                        {(gamesPlayed / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-gray-400">Transactions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {(tokensEarned / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-gray-400">Total Staked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        100%
                      </div>
                      <div className="text-sm text-gray-400">Uptime</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* DeFi Performance */}
              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-green-400">Token Analytics</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Supply</span>
                      <span className="text-green-400 font-bold">1B GOLD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Circulating Supply</span>
                      <span className="text-green-400 font-bold">847K GOLD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Contract Address</span>
                      <span className="text-green-400 font-bold text-xs">APkBg8k...4pump</span>
                    </div>
                    <div className="border-t border-green-500/30 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">Token Price</span>
                        <span className="text-green-400 font-bold text-lg">$0.0005</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Status */}
              <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 font-semibold">Platform Status</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    All DeFi features are <span className="text-green-400 font-bold">fully operational</span>. 
                    Start staking and earning rewards on our verified Solana platform!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>


    </section>
  )
}