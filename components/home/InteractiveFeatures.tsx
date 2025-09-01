"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Wallet, 
  Coins, 
  BarChart3, 
  ShoppingCart, 
  Zap, 
  Shield, 
  Globe, 
  TrendingUp,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  Target,
  Rocket,
  Star,
  ChevronRight
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { generateDeterministicParticles } from "@/utils/deterministic"

interface Feature {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  longDescription: string
  benefits: string[]
  stats: { label: string; value: string }[]
  color: string
  gradient: string
  bgGradient: string
  category: 'defi' | 'nft' | 'security' | 'innovation'
  comingSoon?: boolean
  popular?: boolean
  navigationPath?: string
  learnMorePath?: string
}

interface FloatingParticle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
  moveX: number
  moveY: number
}

export default function InteractiveFeatures() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [particles, setParticles] = useState<FloatingParticle[] | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 })
  const router = useRouter()

  const features: Feature[] = [
    {
      id: 'multi-wallet',
      icon: <Wallet className="h-8 w-8" />,
      title: "Multi-Wallet Support",
      description: "Connect with any Solana wallet seamlessly",
      longDescription: "Experience the ultimate flexibility with support for all major Solana wallets including Phantom, Solflare, Backpack, and more. Our advanced wallet integration ensures secure, fast, and reliable connections.",
      benefits: [
        "Support for 15+ wallet providers",
        "One-click connection",
        "Advanced security protocols",
        "Cross-device synchronization"
      ],
      stats: [
        { label: "Supported Wallets", value: "15+" },
        { label: "Connection Speed", value: "<2s" },
        { label: "Security Score", value: "A+" }
      ],
      color: 'text-blue-400',
      gradient: 'from-blue-400 to-cyan-600',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
      category: 'security',
      navigationPath: '/dashboard',
      learnMorePath: '/dashboard'
    },
    {
      id: 'defi-ecosystem',
      icon: <Coins className="h-8 w-8" />,
      title: "Advanced DeFi Suite",
      description: "Complete DeFi ecosystem with cutting-edge features",
      longDescription: "Access a comprehensive suite of DeFi tools including automated yield farming, flash loans, cross-chain swaps, and advanced trading strategies powered by AI.",
      benefits: [
        "Automated yield optimization",
        "Flash loan integration",
        "Cross-chain compatibility",
        "AI-powered strategies"
      ],
      stats: [
        { label: "Total APY", value: "up to 45%" },
        { label: "Supported Chains", value: "8" },
        { label: "Trading Volume", value: "$950K" }
      ],
      color: 'text-green-400',
      gradient: 'from-green-400 to-emerald-600',
      bgGradient: 'from-green-500/20 to-emerald-500/20',
      category: 'defi',
      popular: true,
      navigationPath: '/defi',
      learnMorePath: '/defi'
    },
    {
      id: 'yield-farming',
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Smart Yield Farming",
      description: "AI-optimized yield farming strategies",
      longDescription: "Maximize your returns with our proprietary AI algorithms that automatically optimize your yield farming positions across multiple protocols and chains.",
      benefits: [
        "AI-driven optimization",
        "Auto-compounding rewards",
        "Risk management tools",
        "Real-time rebalancing"
      ],
      stats: [
        { label: "Average APY", value: "28.5%" },
        { label: "Auto-compound", value: "24/7" },
        { label: "Risk Score", value: "Low" }
      ],
      color: 'text-purple-400',
      gradient: 'from-purple-400 to-pink-600',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
      category: 'defi',
      navigationPath: '/defi',
      learnMorePath: '/defi'
    },
    {
      id: 'nft-marketplace',
      icon: <ShoppingCart className="h-8 w-8" />,
      title: "Premium NFT Marketplace",
      description: "Trade exclusive NFTs with zero fees",
      longDescription: "Discover, buy, and sell unique digital assets in our premium marketplace featuring exclusive collections, zero trading fees, and advanced analytics.",
      benefits: [
        "Zero trading fees",
        "Exclusive collections",
        "Advanced analytics",
        "Instant settlements"
      ],
      stats: [
        { label: "Trading Fees", value: "0%" },
        { label: "Collections", value: "500+" },
        { label: "Floor Price", value: "2.5 SOL" }
      ],
      color: 'text-orange-400',
      gradient: 'from-orange-400 to-red-600',
      bgGradient: 'from-orange-500/20 to-red-500/20',
      category: 'nft',
      navigationPath: '/marketplace',
      learnMorePath: '/marketplace'
    },
    {
      id: 'lightning-swaps',
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast Swaps",
      description: "Sub-second token swaps with minimal slippage",
      longDescription: "Experience the fastest token swaps in DeFi with our advanced routing algorithms that find the best prices across multiple DEXs in milliseconds.",
      benefits: [
        "Sub-second execution",
        "Minimal slippage",
        "Best price routing",
        "MEV protection"
      ],
      stats: [
        { label: "Swap Speed", value: "<500ms" },
        { label: "Slippage", value: "<0.1%" },
        { label: "DEX Sources", value: "12" }
      ],
      color: 'text-yellow-400',
      gradient: 'from-yellow-400 to-orange-600',
      bgGradient: 'from-yellow-500/20 to-orange-500/20',
      category: 'defi',
      navigationPath: '/trading',
      learnMorePath: '/trading'
    },
    {
      id: 'security-vault',
      icon: <Shield className="h-8 w-8" />,
      title: "Security Vault",
      description: "Military-grade security for your assets",
      longDescription: "Protect your digital assets with our state-of-the-art security infrastructure featuring multi-signature wallets, hardware security modules, and insurance coverage.",
      benefits: [
        "Multi-signature protection",
        "Hardware security modules",
        "Insurance coverage",
        "24/7 monitoring"
      ],
      stats: [
        { label: "Security Score", value: "99.9%" },
        { label: "Insurance", value: "$1M" },
        { label: "Uptime", value: "99.99%" }
      ],
      color: 'text-emerald-400',
      gradient: 'from-emerald-400 to-teal-600',
      bgGradient: 'from-emerald-500/20 to-teal-500/20',
      category: 'security',
      navigationPath: '/dashboard',
      learnMorePath: '/dashboard'
    },
    {
      id: 'cross-chain',
      icon: <Globe className="h-8 w-8" />,
      title: "Cross-Chain Bridge",
      description: "Seamless asset transfers across blockchains",
      longDescription: "Move your assets freely across multiple blockchains with our secure and efficient cross-chain bridge supporting Ethereum, BSC, Polygon, and more.",
      benefits: [
        "8 supported chains",
        "Instant transfers",
        "Low fees",
        "Secure protocols"
      ],
      stats: [
        { label: "Supported Chains", value: "8" },
        { label: "Transfer Time", value: "<5min" },
        { label: "Success Rate", value: "99.8%" }
      ],
      color: 'text-cyan-400',
      gradient: 'from-cyan-400 to-blue-600',
      bgGradient: 'from-cyan-500/20 to-blue-500/20',
      category: 'innovation',
      navigationPath: '/bridge',
      learnMorePath: '/bridge'
    },
    {
      id: 'ai-trading',
      icon: <Rocket className="h-8 w-8" />,
      title: "AI Trading Bot",
      description: "Automated trading with machine learning",
      longDescription: "Let our advanced AI trading algorithms work for you 24/7, analyzing market patterns and executing optimal trades based on your risk preferences.",
      benefits: [
        "24/7 automated trading",
        "Machine learning algorithms",
        "Risk management",
        "Backtested strategies"
      ],
      stats: [
        { label: "Win Rate", value: "78%" },
        { label: "Max Drawdown", value: "<5%" },
        { label: "Sharpe Ratio", value: "2.4" }
      ],
      color: 'text-pink-400',
      gradient: 'from-pink-400 to-rose-600',
      bgGradient: 'from-pink-500/20 to-rose-500/20',
      category: 'innovation',
      comingSoon: true,
      navigationPath: '/trading',
      learnMorePath: '/trading'
    }
  ]

  const categories = [
    { id: 'all', label: 'All Features', icon: <Layers className="h-4 w-4" /> },
    { id: 'defi', label: 'DeFi', icon: <Coins className="h-4 w-4" /> },
    { id: 'nft', label: 'NFT', icon: <ShoppingCart className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'innovation', label: 'Innovation', icon: <Rocket className="h-4 w-4" /> }
  ]

  // Generate floating particles
  useEffect(() => {
    // Generate particles only on client to avoid hydration mismatch
    const generatedParticles = generateDeterministicParticles(
      50,
      "interactive-features-particles",
      {
        xRange: [0, 100],
        yRange: [0, 100],
        sizeRange: [1, 4],
        opacityRange: [0.3, 0.8],
        durationRange: [5, 15]
      }
    )
    setParticles(generatedParticles)
  }, [])

  // Handle mouse movement
  const handleMouseMove = (event: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      mouseX.set(event.clientX - rect.left)
      mouseY.set(event.clientY - rect.top)
    }
  }

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === activeCategory)

  const rotateX = useTransform(springY, [0, 400], [10, -10])
  const rotateY = useTransform(springX, [0, 400], [-10, 10])

  return (
    <section 
      ref={containerRef}
      className="py-20 relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        {/* Floating Particles */}
        {particles && particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-yellow-400"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              filter: 'blur(1px)'
            }}
            animate={{
              x: [0, particle.moveX, 0],
              y: [0, particle.moveY, 0],
              opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Gradient Orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-blue-500/20 to-transparent rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-purple-500/20 to-transparent rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{
            duration: 5,
            repeat: Infinity
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{ rotateX, rotateY }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
              Revolutionary Features
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Experience the next generation of DeFi with cutting-edge technology and unparalleled user experience
          </motion.p>

          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  ${activeCategory === category.id 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-none' 
                    : 'border-gray-600 text-gray-300 hover:border-yellow-500 hover:text-yellow-400'
                  }
                  transition-all duration-300 group
                `}
              >
                <span className="mr-2 group-hover:scale-110 transition-transform">
                  {category.icon}
                </span>
                {category.label}
              </Button>
            ))}
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="wait">
            {filteredFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 50
                }}
                onHoverStart={() => setHoveredFeature(feature.id)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="group cursor-pointer"
                onClick={() => setSelectedFeature(feature.id)}
              >
                <Card className={`
                  h-full bg-gradient-to-br from-gray-900/90 to-gray-800/90 
                  border-gray-700/50 backdrop-blur-sm 
                  hover:border-yellow-500/50 transition-all duration-500
                  overflow-hidden relative
                  ${hoveredFeature === feature.id ? 'shadow-2xl shadow-yellow-500/20' : ''}
                `}>
                  {/* Animated Background Gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    initial={false}
                    animate={{
                      background: hoveredFeature === feature.id 
                        ? `linear-gradient(135deg, ${feature.bgGradient})` 
                        : 'transparent'
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex gap-2 z-20">
                    {feature.popular && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {feature.comingSoon && (
                      <Badge variant="outline" className="border-purple-500 text-purple-400 text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Soon
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-6 relative z-10 h-full flex flex-col">
                    {/* Icon */}
                    <motion.div
                      className={`${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {feature.icon}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Stats Preview */}
                      <div className="space-y-2 mb-4">
                        {feature.stats.slice(0, 2).map((stat, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="text-gray-500">{stat.label}</span>
                            <span className={`font-semibold ${feature.color}`}>{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.div
                      className="mt-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href={feature.learnMorePath || '/dashboard'}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full border-gray-600 text-gray-300 hover:border-yellow-500 hover:text-yellow-400 group-hover:bg-yellow-500/10 transition-all duration-300"
                        >
                          Learn More
                          <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Feature Detail Modal */}
        <AnimatePresence>
          {selectedFeature && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
            >
              <motion.div
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const feature = features.find(f => f.id === selectedFeature)
                  if (!feature) return null

                  return (
                    <div>
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`${feature.color} p-3 bg-gray-800 rounded-xl`}>
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFeature(null)}
                          className="text-gray-400 hover:text-white"
                        >
                          ✕
                        </Button>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Overview</h4>
                          <p className="text-gray-300 leading-relaxed">{feature.longDescription}</p>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Key Benefits</h4>
                          <ul className="space-y-2">
                            {feature.benefits.map((benefit, i) => (
                              <li key={i} className="flex items-center gap-3 text-gray-300">
                                <div className={`w-2 h-2 rounded-full ${feature.color.replace('text-', 'bg-')}`} />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Statistics</h4>
                          <div className="grid grid-cols-3 gap-4">
                            {feature.stats.map((stat, i) => (
                              <div key={i} className="text-center p-4 bg-gray-800/50 rounded-lg">
                                <div className={`text-xl font-bold ${feature.color}`}>{stat.value}</div>
                                <div className="text-sm text-gray-400">{stat.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Link href={feature.navigationPath || '/dashboard'} className="flex-1">
                            <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-600 hover:to-orange-600">
                              Get Started
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                          <Link href={feature.learnMorePath || '/dashboard'}>
                            <Button variant="outline" className="border-gray-600 text-gray-300 hover:border-yellow-500 hover:text-yellow-400">
                              Learn More
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })()
                }
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}