'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Wallet, 
  Zap, 
  Gift, 
  TrendingUp, 
  Shield, 
  Clock, 
  ArrowRight,
  CheckCircle,
  Star,
  Coins,
  Users,
  Target,
  Sparkles
} from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/navigation'

interface Benefit {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

interface CountdownTimer {
  hours: number
  minutes: number
  seconds: number
}

export default function WalletCTASection() {
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const router = useRouter()
  const [countdown, setCountdown] = useState<CountdownTimer>({
    hours: 23,
    minutes: 45,
    seconds: 30
  })

  const benefits: Benefit[] = [
    {
      id: 'instant-bonus',
      icon: <Gift className="w-6 h-6" />,
      title: 'Welcome Bonus',
      description: 'Get rewarded immediately upon wallet connection and first stake',
      color: 'text-yellow-400'
    },
    {
      id: 'high-apy',
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Up to 147% APY',
      description: 'Industry-leading staking rewards with daily compound interest',
      color: 'text-green-400'
    },
    {
      id: 'secure',
      icon: <Shield className="w-6 h-6" />,
      title: 'Bank-Grade Security',
      description: 'Your funds are protected by advanced blockchain security',
      color: 'text-blue-400'
    },
    {
      id: 'instant-access',
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Access',
      description: 'Start earning rewards immediately after connecting your wallet',
      color: 'text-purple-400'
    }
  ]

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleConnectWallet = () => {
    if (connected) {
      router.push('/defi')
    } else {
      setVisible(true)
    }
  }

  const formatTime = (time: number) => time.toString().padStart(2, '0')

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-4">
            <Wallet className="w-4 h-4 mr-2" />
            Connect & Earn
          </Badge>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Start
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
              Earning Rewards?
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Connect your Solana wallet now and unlock exclusive staking rewards with Goldium DeFi.
          </p>
        </motion.div>

        {/* Limited Time Offer Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-12"
        >
          <Card className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 border-red-500/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-yellow-500/10 animate-pulse" />
            <CardContent className="p-6 relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/20 rounded-full">
                    <Clock className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Limited Time Offer!</h3>
                    <p className="text-gray-300">Early staker bonus expires soon</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">Time Left</div>
                    <div className="font-mono text-xl font-bold text-red-400">
                      {formatTime(countdown.hours)}:{formatTime(countdown.minutes)}:{formatTime(countdown.seconds)}
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleConnectWallet}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 animate-pulse"
                  >
                    Claim Now!
                    <Zap className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-3 rounded-full bg-gray-800 mb-4 ${benefit.color}`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mb-16"
        >
          <Card className="bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-yellow-500/20 border-purple-500/30 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/5 to-yellow-500/5" />
              <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl animate-bounce" />
              <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s' }} />
            </div>
            
            <CardContent className="p-8 lg:p-12 relative z-10">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-lg px-4 py-2">
                      Premium Access
                    </Badge>
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                    Connect Your Wallet &
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent block">
                      Start Earning Today
                    </span>
                  </h3>
                  
                  <p className="text-xl text-gray-300 mb-8">
                    Join thousands of users already earning passive income with our industry-leading DeFi platform.
                  </p>
                  
                  {/* Welcome Bonus Display */}
                  <div className="bg-black/50 rounded-xl p-4 mb-8 border border-yellow-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Welcome Bonus</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        New Users
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-yellow-400 font-bold text-2xl">
                        500 GOLD
                      </div>
                      <div className="text-gray-400 text-sm">
                        + Up to 147% APY on staking
                      </div>
                    </div>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleConnectWallet}
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 flex-1"
                    >
                      {connected ? (
                        <>
                          Go to DeFi Hub
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      ) : (
                        <>
                          Connect Wallet
                          <Wallet className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                    
                    {!connected && (
                      <Button
                        variant="outline"
                        className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 px-8 py-4 rounded-xl font-semibold text-lg"
                        onClick={() => router.push('/defi')}
                      >
                        Explore Platform
                        <Target className="w-5 h-5 ml-2" />
                      </Button>
                    )}
                  </div>
                  
                  {connected && publicKey && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
                    >
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Wallet Connected!</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Address: {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                      </p>
                    </motion.div>
                  )}
                </div>
                
                {/* Stats Section */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-black/30 border-gray-700 backdrop-blur-sm">
                      <CardContent className="p-4 text-center">
                        <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">12.8K+</div>
                        <div className="text-sm text-gray-400">Active Users</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black/30 border-gray-700 backdrop-blur-sm">
                      <CardContent className="p-4 text-center">
                        <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">847K</div>
                        <div className="text-sm text-gray-400">GOLD Staked</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black/30 border-gray-700 backdrop-blur-sm">
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">147%</div>
                        <div className="text-sm text-gray-400">Max APY</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black/30 border-gray-700 backdrop-blur-sm">
                      <CardContent className="p-4 text-center">
                        <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">100%</div>
                        <div className="text-sm text-gray-400">Secure</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Trust Indicators */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-gray-700">
                      <Shield className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">Audited Smart Contracts</div>
                        <div className="text-xs text-gray-400">Verified by leading security firms</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-gray-700">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">Community Trusted</div>
                        <div className="text-xs text-gray-400">4.9/5 rating from 2,000+ reviews</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-gray-700">
                      <Zap className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">Lightning Fast</div>
                        <div className="text-xs text-gray-400">Instant transactions on Solana</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-white mb-2">$950K+</div>
              <div className="text-gray-400">Total Value Locked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">0%</div>
              <div className="text-gray-400">Hidden Fees</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}