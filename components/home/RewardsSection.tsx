'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Gift, 
  Crown, 
  Star, 
  Zap, 
  TrendingUp, 
  Users, 
  Coins, 
  Award, 
  Target,
  Sparkles,
  Timer,
  ArrowRight,
  Copy,
  CheckCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface RewardTier {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  gradient: string
  requirements: string
  benefits: string[]
  multiplier: string
  badge: string
}

interface LimitedOffer {
  id: string
  title: string
  description: string
  reward: string
  timeLeft: number
  claimed: number
  total: number
  urgent: boolean
}

export default function RewardsSection() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  })

  const rewardTiers: RewardTier[] = [
    {
      id: 'bronze',
      name: 'Bronze Tier',
      icon: <Award className="w-6 h-6" />,
      color: 'text-orange-400',
      gradient: 'from-orange-400 to-amber-500',
      requirements: '100+ GOLD Staked',
      benefits: [
        '500 GOLD Welcome Bonus',
        '10% Staking Bonus',
        'Basic Pool Access',
        'Community Discord Access'
      ],
      multiplier: '1.1x',
      badge: 'Starter'
    },
    {
      id: 'silver',
      name: 'Silver Tier',
      icon: <Star className="w-6 h-6" />,
      color: 'text-gray-300',
      gradient: 'from-gray-300 to-gray-400',
      requirements: '1,000+ GOLD Staked',
      benefits: [
        '1,500 GOLD Tier Bonus',
        '15% Staking Bonus',
        'Premium Staking Pools',
        'Priority Support',
        'Monthly Airdrops'
      ],
      multiplier: '1.25x',
      badge: 'Rising'
    },
    {
      id: 'gold',
      name: 'Gold Tier',
      icon: <Crown className="w-6 h-6" />,
      color: 'text-yellow-400',
      gradient: 'from-yellow-400 to-orange-500',
      requirements: '10,000+ GOLD Staked',
      benefits: [
        '5,000 GOLD Elite Bonus',
        '25% Staking Bonus',
        'Exclusive VIP Pools',
        'Personal Account Manager',
        'Weekly Exclusive Rewards',
        'Early Access to Features'
      ],
      multiplier: '1.5x',
      badge: 'Elite'
    }
  ]

  const limitedOffers: LimitedOffer[] = [
    {
      id: '1',
      title: 'Early Staker Bonus',
      description: 'Stake 1,000+ GOLD in the first 24 hours',
      reward: '2,000 GOLD',
      timeLeft: 86400,
      claimed: 847,
      total: 1000,
      urgent: true
    },
    {
      id: '2',
      title: 'Liquidity Provider Reward',
      description: 'Provide liquidity to GOLD/SOL pool',
      reward: '1,500 GOLD',
      timeLeft: 172800,
      claimed: 234,
      total: 500,
      urgent: false
    },
    {
      id: '3',
      title: 'Community Champion',
      description: 'Join our Discord and complete verification',
      reward: '500 GOLD',
      timeLeft: 259200,
      claimed: 1247,
      total: 2000,
      urgent: false
    }
  ]

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
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

  const formatTime = (time: number) => time.toString().padStart(2, '0')

  const handleGetStarted = () => {
    router.push('/defi')
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-full px-6 py-2 mb-6"
          >
            <Gift className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Reward System</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Earn <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Massive Rewards</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Stake your GOLD tokens and unlock exclusive rewards with our tier-based system
          </motion.p>
        </div>

        {/* Limited Time Offers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Limited Time Offers</h3>
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Timer className="w-5 h-5" />
              <span className="text-lg font-mono">
                {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
              </span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {limitedOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`relative overflow-hidden ${
                  offer.urgent 
                    ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30' 
                    : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20'
                }`}>
                  {offer.urgent && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded-bl-lg font-semibold">
                      URGENT
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-bold text-white mb-2">{offer.title}</h4>
                      <p className="text-gray-400 text-sm mb-4">{offer.description}</p>
                      <div className="text-2xl font-bold text-yellow-400 mb-2">{offer.reward}</div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{offer.claimed}/{offer.total}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(offer.claimed / offer.total) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleGetStarted}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold"
                    >
                      Claim Reward
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reward Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Staking Reward Tiers</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The more you stake, the higher your tier and the better your rewards
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {rewardTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${index === 1 ? 'md:scale-110 md:z-10' : ''}`}
              >
                <Card className={`relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-2 ${
                  index === 1 
                    ? 'border-yellow-500/50 shadow-2xl shadow-yellow-500/20' 
                    : 'border-gray-700'
                }`}>
                  {index === 1 && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-4 py-1">
                        MOST POPULAR
                      </Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${tier.gradient} mb-6`}>
                      <div className="text-white">
                        {tier.icon}
                      </div>
                    </div>
                    
                    <h4 className="text-2xl font-bold text-white mb-2">{tier.name}</h4>
                    <p className="text-gray-400 mb-4">{tier.requirements}</p>
                    
                    <div className="mb-6">
                      <div className={`text-3xl font-bold ${tier.color} mb-2`}>{tier.multiplier}</div>
                      <div className="text-sm text-gray-400">Reward Multiplier</div>
                    </div>
                    
                    <div className="space-y-3 mb-8">
                      {tier.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-3 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={handleGetStarted}
                      className={`w-full ${
                        index === 1 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black' 
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      } font-semibold`}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">847K</div>
              <div className="text-sm text-gray-400">Total Staked</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">12.8K</div>
              <div className="text-sm text-gray-400">Active Stakers</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">147%</div>
              <div className="text-sm text-gray-400">Max APY</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">950K</div>
              <div className="text-sm text-gray-400">Rewards Paid</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20 backdrop-blur-sm max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Start Earning?
              </h3>
              <p className="text-gray-300 mb-6">
                Join thousands of users already earning passive income with Goldium staking
              </p>
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-8"
              >
                Start Staking Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}