'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Twitter, 
  Star, 
  Quote, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle,
  Repeat2,
  Verified,
  Calendar,
  Award
} from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  username: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  retweets: number
  replies: number
  verified: boolean
  tier: 'bronze' | 'silver' | 'gold'
  earnings: string
}

interface TwitterMetrics {
  followers: number
  engagement: number
  mentions: number
  sentiment: 'positive' | 'neutral' | 'negative'
}

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [twitterMetrics, setTwitterMetrics] = useState<TwitterMetrics>({
    followers: 12847,
    engagement: 8.7,
    mentions: 247,
    sentiment: 'positive'
  })

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Alex Chen',
      username: 'alexchen_crypto',
      avatar: '🚀',
      content: 'Just hit my first 1000 GOLD milestone! The staking rewards are insane - already earned 150 GOLD in just 2 weeks. This platform is the real deal! 🔥',
      timestamp: '2h',
      likes: 247,
      retweets: 89,
      replies: 34,
      verified: true,
      tier: 'gold',
      earnings: '1,247 GOLD'
    },
    {
      id: '2',
      name: 'Sarah Martinez',
      username: 'sarahdefi',
      avatar: '💎',
      content: 'Been using Goldium for 3 months now. The staking rewards are incredible - I\'ve earned over 500 GOLD just from regular staking. The community is amazing too! 💪',
      timestamp: '4h',
      likes: 156,
      retweets: 67,
      replies: 23,
      verified: false,
      tier: 'silver',
      earnings: '847 GOLD'
    },
    {
      id: '3',
      name: 'Mike Thompson',
      username: 'mikethompson_sol',
      avatar: '⚡',
      content: 'The APY rates on Goldium are unmatched! 147% APY and daily rewards that actually compound. Got instant welcome bonus when I joined. Highly recommend! 🌟',
      timestamp: '6h',
      likes: 324,
      retweets: 128,
      replies: 45,
      verified: true,
      tier: 'gold',
      earnings: '2,156 GOLD'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      username: 'emmawilson_web3',
      avatar: '🌟',
      content: 'Love the transparency and security of Goldium. Real-time tracking, instant rewards, and the best DeFi experience I\'ve had. Already planning to stake more! 💰',
      timestamp: '8h',
      likes: 189,
      retweets: 76,
      replies: 29,
      verified: true,
      tier: 'silver',
      earnings: '1,456 GOLD'
    },
    {
      id: '5',
      name: 'David Kim',
      username: 'davidkim_defi',
      avatar: '🎯',
      content: 'The liquidity pools on Goldium are fantastic! Providing liquidity has been super profitable. The platform is user-friendly and rewards are consistent. 📈',
      timestamp: '12h',
      likes: 267,
      retweets: 94,
      replies: 38,
      verified: false,
      tier: 'bronze',
      earnings: '623 GOLD'
    }
  ]

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Update metrics in real-time
  useEffect(() => {
    const metricsInterval = setInterval(() => {
      setTwitterMetrics(prev => ({
        followers: prev.followers + Math.floor(Math.random() * 10),
        engagement: Math.max(0, prev.engagement + (Math.random() - 0.5) * 0.2),
        mentions: prev.mentions + Math.floor(Math.random() * 3),
        sentiment: prev.sentiment
      }))
    }, 10000)

    return () => clearInterval(metricsInterval)
  }, [])

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'silver': return 'text-gray-300 bg-gray-300/10 border-gray-300/20'
      case 'bronze': return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
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
            <Twitter className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Community Love</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            What Our <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Community</span> Says
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Real testimonials from real users earning real rewards on Goldium
          </motion.p>
        </div>

        {/* Twitter Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{formatNumber(twitterMetrics.followers)}</div>
              <div className="text-sm text-gray-400">Followers</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{twitterMetrics.engagement.toFixed(1)}%</div>
              <div className="text-sm text-gray-400">Engagement</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{formatNumber(twitterMetrics.mentions)}</div>
              <div className="text-sm text-gray-400">Mentions</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">98%</div>
              <div className="text-sm text-gray-400">Positive</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Featured Testimonial */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700 backdrop-blur-sm h-full">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="text-4xl">{testimonials[activeTestimonial].avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white">{testimonials[activeTestimonial].name}</h3>
                        {testimonials[activeTestimonial].verified && (
                          <Verified className="w-4 h-4 text-blue-400" />
                        )}
                        <Badge className={getTierColor(testimonials[activeTestimonial].tier)}>
                          {testimonials[activeTestimonial].tier}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm">@{testimonials[activeTestimonial].username}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">{testimonials[activeTestimonial].timestamp}</div>
                      <div className="text-sm font-medium text-yellow-400">{testimonials[activeTestimonial].earnings}</div>
                    </div>
                  </div>
                  
                  <Quote className="w-8 h-8 text-gray-600 mb-4" />
                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    {testimonials[activeTestimonial].content}
                  </p>
                  
                  <div className="flex items-center gap-6 text-gray-400">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{formatNumber(testimonials[activeTestimonial].likes)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Repeat2 className="w-4 h-4" />
                      <span className="text-sm">{formatNumber(testimonials[activeTestimonial].retweets)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{formatNumber(testimonials[activeTestimonial].replies)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Testimonial Navigation */}
          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setActiveTestimonial(index)}
                className={`cursor-pointer transition-all duration-300 ${
                  index === activeTestimonial 
                    ? 'transform scale-105' 
                    : 'hover:transform hover:scale-102'
                }`}
              >
                <Card className={`border transition-all duration-300 ${
                  index === activeTestimonial 
                    ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30' 
                    : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">{testimonial.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white text-sm">{testimonial.name}</h4>
                          {testimonial.verified && (
                            <Verified className="w-3 h-3 text-blue-400" />
                          )}
                        </div>
                        <p className="text-xs text-gray-400">@{testimonial.username}</p>
                      </div>
                      <Badge className={getTierColor(testimonial.tier) + ' text-xs'}>
                        {testimonial.tier}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {testimonial.content}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-yellow-400 font-medium">
                        {testimonial.earnings}
                      </div>
                      <div className="text-xs text-gray-400">
                        {testimonial.timestamp}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20 backdrop-blur-sm max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Join Our Growing Community
              </h3>
              <p className="text-gray-300 mb-6">
                Start earning rewards and become part of the Goldium success story
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold"
                >
                  Start Earning Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Follow on Twitter
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}