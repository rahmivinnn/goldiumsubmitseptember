'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Sparkles, 
  Heart, 
  Star, 
  Zap, 
  Crown, 
  Gift, 
  Flame, 
  Diamond,
  Eye,
  Share2,
  ShoppingCart,
  TrendingUp,
  Award,
  Clock,
  Users,
  Volume2,
  Music,
  Smile,
  Baby,
  Egg
} from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useToast } from '@/components/ui/use-toast'

interface EggNFT {
  id: string
  name: string
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic'
  level: number
  experience: number
  maxExperience: number
  hatchProgress: number
  price: number
  lastSale: number
  volume24h: number
  owners: number
  likes: number
  views: number
  traits: {
    color: string
    pattern: string
    size: string
    glow: string
    special?: string
  }
  abilities: string[]
  isHatching: boolean
  timeToHatch: number
  creator: string
  collection: string
  mood?: 'happy' | 'sleepy' | 'excited' | 'curious' | 'magical'
  personality?: string
}

interface EggNFTCardProps {
  nft: EggNFT
  onPurchase?: (nft: EggNFT) => void
  onLike?: (nft: EggNFT) => void
  onShare?: (nft: EggNFT) => void
}

const rarityColors = {
  Common: 'from-gray-400 to-gray-600',
  Rare: 'from-blue-400 to-blue-600',
  Epic: 'from-purple-400 to-purple-600',
  Legendary: 'from-yellow-400 to-orange-500',
  Mythic: 'from-pink-400 to-red-500'
}

const rarityGlow = {
  Common: 'shadow-gray-500/20',
  Rare: 'shadow-blue-500/30',
  Epic: 'shadow-purple-500/40',
  Legendary: 'shadow-yellow-500/50',
  Mythic: 'shadow-pink-500/60'
}

const moodEmojis = {
  happy: '😊',
  sleepy: '😴',
  excited: '🤩',
  curious: '🤔',
  magical: '✨'
}

const eggPatterns = {
  Common: [
    { type: 'dots', color: 'bg-white/30' },
    { type: 'stripes', color: 'bg-white/20' }
  ],
  Rare: [
    { type: 'swirls', color: 'bg-blue-200/40' },
    { type: 'waves', color: 'bg-cyan-200/30' }
  ],
  Epic: [
    { type: 'stars', color: 'bg-purple-200/40' },
    { type: 'lightning', color: 'bg-violet-200/30' }
  ],
  Legendary: [
    { type: 'crown', color: 'bg-yellow-200/50' },
    { type: 'flames', color: 'bg-orange-200/40' }
  ],
  Mythic: [
    { type: 'galaxy', color: 'bg-pink-200/50' },
    { type: 'rainbow', color: 'bg-gradient-to-r from-red-200/30 via-yellow-200/30 to-blue-200/30' }
  ]
}

export default function EggNFTCard({ nft, onPurchase, onLike, onShare }: EggNFTCardProps) {
  const { connected } = useWallet()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(false)
  const [currentLikes, setCurrentLikes] = useState(nft.likes)
  const [isHovering, setIsHovering] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [hatchAnimation, setHatchAnimation] = useState(false)
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]) 
  const [isWiggling, setIsWiggling] = useState(false)
  const [showHeartFloat, setShowHeartFloat] = useState(false)
  const [eggMood, setEggMood] = useState<'happy' | 'sleepy' | 'excited' | 'curious' | 'magical'>(nft.mood || 'happy')
  const [soundPlaying, setSoundPlaying] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [magicalParticles, setMagicalParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]) 
  const [isGlowing, setIsGlowing] = useState(false)
  const [eggTemperature, setEggTemperature] = useState(0)
  const [specialEffect, setSpecialEffect] = useState<'rainbow' | 'fire' | 'ice' | 'lightning' | null>(null)
  const [petLevel, setPetLevel] = useState(1)
  const [happiness, setHappiness] = useState(50)

  // Generate sparkle effects for rare eggs
  useEffect(() => {
    if (nft.rarity === 'Legendary' || nft.rarity === 'Mythic') {
      const interval = setInterval(() => {
        setSparkles(prev => {
          const newSparkles = Array.from({ length: 3 }, (_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 100,
            y: Math.random() * 100
          }))
          return [...prev.slice(-5), ...newSparkles]
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [nft.rarity])

  // Hatch animation effect
  useEffect(() => {
    if (nft.isHatching && nft.hatchProgress > 90) {
      const interval = setInterval(() => {
        setHatchAnimation(true)
        setTimeout(() => setHatchAnimation(false), 500)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [nft.isHatching, nft.hatchProgress])

  // Random mood changes
  useEffect(() => {
    const moodInterval = setInterval(() => {
      const moods: Array<'happy' | 'sleepy' | 'excited' | 'curious' | 'magical'> = ['happy', 'sleepy', 'excited', 'curious', 'magical']
      setEggMood(moods[Math.floor(Math.random() * moods.length)])
    }, 10000)
    return () => clearInterval(moodInterval)
  }, [])

  // Wiggle animation
  useEffect(() => {
    const wiggleInterval = setInterval(() => {
      setIsWiggling(true)
      setTimeout(() => setIsWiggling(false), 1000)
    }, 15000)
    return () => clearInterval(wiggleInterval)
  }, [])

  // Magical particle effects
  useEffect(() => {
    if (nft.rarity === 'Mythic' || specialEffect) {
      const particleInterval = setInterval(() => {
        const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff']
        setMagicalParticles(prev => {
          const newParticles = Array.from({ length: 5 }, (_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 120,
            y: Math.random() * 120,
            color: colors[Math.floor(Math.random() * colors.length)]
          }))
          return [...prev.slice(-10), ...newParticles]
        })
      }, 800)
      return () => clearInterval(particleInterval)
    }
  }, [nft.rarity, specialEffect])

  // Temperature and glow effects
  useEffect(() => {
    if (clickCount > 3) {
      setEggTemperature(prev => Math.min(prev + 10, 100))
      setIsGlowing(true)
      if (clickCount > 7) {
        setSpecialEffect('fire')
      }
    } else {
      setEggTemperature(prev => Math.max(prev - 5, 0))
      setIsGlowing(false)
      setSpecialEffect(null)
    }
  }, [clickCount])

  // Happiness system
  useEffect(() => {
    const happinessInterval = setInterval(() => {
      setHappiness(prev => {
        if (clickCount > 0) {
          return Math.min(prev + 2, 100)
        }
        return Math.max(prev - 1, 0)
      })
    }, 2000)
    return () => clearInterval(happinessInterval)
  }, [clickCount])

  const handleLike = () => {
    if (!connected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to like NFTs",
        variant: "destructive"
      })
      return
    }
    
    setIsLiked(!isLiked)
    setCurrentLikes(prev => isLiked ? prev - 1 : prev + 1)
    setShowHeartFloat(true)
    setTimeout(() => setShowHeartFloat(false), 1000)
    onLike?.(nft)
  }

  const handlePurchase = () => {
    if (!connected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to purchase NFTs",
        variant: "destructive"
      })
      return
    }
    onPurchase?.(nft)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this amazing ${nft.rarity} Egg NFT: ${nft.name}! 🥚✨`)
    toast({
      title: "Link Copied! 🎉",
      description: "NFT link copied to clipboard"
    })
    onShare?.(nft)
  }

  const handleEggClick = () => {
    setClickCount(prev => prev + 1)
    setIsWiggling(true)
    setSoundPlaying(true)
    setHappiness(prev => Math.min(prev + 5, 100))
    
    // Play cute sound effect (simulated)
    setTimeout(() => {
      setSoundPlaying(false)
      setIsWiggling(false)
    }, 500)

    // Progressive special effects based on clicks
    if (clickCount >= 2) {
      setEggMood('happy')
    }
    if (clickCount >= 4) {
      setEggMood('excited')
      setShowHeartFloat(true)
      setSpecialEffect('rainbow')
    }
    if (clickCount >= 6) {
      setEggMood('magical')
      setSpecialEffect('lightning')
    }
    if (clickCount >= 8) {
      setSpecialEffect('fire')
      setPetLevel(prev => prev + 1)
      toast({
        title: "🎉 Level Up!",
        description: `Your magical egg reached level ${petLevel + 1}! It's getting more powerful!`,
      })
    }
    if (clickCount >= 10) {
      setEggMood('magical')
      setSpecialEffect('ice')
      toast({
        title: "✨ Magical Transformation!",
        description: "Your egg is radiating with incredible magical energy!",
      })
      setTimeout(() => {
        setShowHeartFloat(false)
        setClickCount(0)
        setSpecialEffect(null)
      }, 3000)
    }
  }

  const formatTimeToHatch = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getEggFace = () => {
    switch (eggMood) {
      case 'happy':
        return (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
            </div>
            <div className="w-4 h-2 bg-orange-400 rounded-full mt-1 mx-auto" />
            <div className="w-6 h-1 bg-pink-400 rounded-full mt-1 mx-auto" />
          </div>
        )
      case 'sleepy':
        return (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1 bg-black rounded-full" />
              <div className="w-3 h-1 bg-black rounded-full" />
            </div>
            <div className="w-3 h-1 bg-orange-400 rounded-full mt-2 mx-auto" />
            <div className="text-xs">💤</div>
          </div>
        )
      case 'excited':
        return (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            </div>
            <div className="w-4 h-2 bg-orange-400 rounded-full mt-1 mx-auto" />
            <div className="w-8 h-2 bg-yellow-400 rounded-full mt-1 mx-auto animate-pulse" />
          </div>
        )
      case 'curious':
        return (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-black rounded-full" />
              <div className="w-1.5 h-1.5 bg-black rounded-full" />
            </div>
            <div className="w-3 h-1 bg-orange-400 rounded-full mt-1 mx-auto" />
            <div className="text-xs">?</div>
          </div>
        )
      case 'magical':
        return (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            </div>
            <div className="w-4 h-2 bg-orange-400 rounded-full mt-1 mx-auto" />
            <div className="w-6 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-1 mx-auto animate-pulse" />
            <div className="text-xs animate-bounce">✨</div>
          </div>
        )
      default:
        return null
    }
  }

  const EggIcon = () => (
    <motion.div
      className={`relative w-28 h-36 mx-auto mb-4 cursor-pointer ${
        hatchAnimation ? 'animate-bounce' : ''
      } ${
        isWiggling ? 'animate-pulse' : ''
      }`}
      animate={{
        scale: isHovering ? 1.1 : 1,
        rotateY: isHovering ? 10 : 0,
        rotateZ: isWiggling ? [0, -2, 2, -2, 2, 0] : 0
      }}
      transition={{ duration: 0.3 }}
      onClick={handleEggClick}
    >
      {/* Egg Base */}
      <div className={`w-full h-full bg-gradient-to-b ${rarityColors[nft.rarity]} rounded-full relative overflow-hidden ${rarityGlow[nft.rarity]} shadow-2xl border-2 border-white/20`}>
        {/* Egg Shine */}
        <div className="absolute inset-2 bg-gradient-to-br from-white/40 via-white/20 to-transparent rounded-full" />
        
        {/* Egg Pattern based on rarity */}
        <div className="absolute inset-4">
          {nft.rarity === 'Common' && (
            <>
              <div className="absolute top-2 left-2 w-2 h-2 bg-white/40 rounded-full" />
              <div className="absolute top-6 right-3 w-1.5 h-1.5 bg-white/40 rounded-full" />
              <div className="absolute bottom-4 left-3 w-1 h-1 bg-white/40 rounded-full" />
            </>
          )}
          
          {nft.rarity === 'Rare' && (
            <>
              <div className="absolute top-3 left-1/2 w-8 h-0.5 bg-blue-200/50 rounded-full transform -translate-x-1/2 rotate-12" />
              <div className="absolute top-6 left-1/2 w-6 h-0.5 bg-blue-200/50 rounded-full transform -translate-x-1/2 -rotate-12" />
              <div className="absolute bottom-6 left-1/2 w-4 h-0.5 bg-blue-200/50 rounded-full transform -translate-x-1/2 rotate-12" />
            </>
          )}
          
          {nft.rarity === 'Epic' && (
            <>
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                <Star className="w-3 h-3 text-purple-200/60" />
              </div>
              <div className="absolute top-8 right-2">
                <Sparkles className="w-2 h-2 text-purple-200/60" />
              </div>
              <div className="absolute bottom-8 left-2">
                <Diamond className="w-2 h-2 text-purple-200/60" />
              </div>
            </>
          )}
          
          {nft.rarity === 'Legendary' && (
            <>
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                <Crown className="w-4 h-4 text-yellow-200/70" />
              </div>
              <div className="absolute top-6 right-1">
                <Flame className="w-3 h-3 text-orange-200/60" />
              </div>
              <div className="absolute bottom-6 left-1">
                <Zap className="w-3 h-3 text-yellow-200/60" />
              </div>
            </>
          )}
          
          {nft.rarity === 'Mythic' && (
            <>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-pink-200/30 via-purple-200/30 to-blue-200/30 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                <Star className="w-3 h-3 text-pink-200/80 animate-pulse" />
              </div>
              <div className="absolute top-4 right-0">
                <Sparkles className="w-2 h-2 text-purple-200/80 animate-pulse" />
              </div>
              <div className="absolute bottom-4 left-0">
                <Diamond className="w-2 h-2 text-blue-200/80 animate-pulse" />
              </div>
            </>
          )}
        </div>
        
        {/* Crack Effect for Hatching */}
        {nft.isHatching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: nft.hatchProgress / 100 }}
            className="absolute inset-0 bg-gradient-to-br from-transparent via-yellow-200/30 to-transparent"
          >
            <div className="absolute top-1/3 left-1/2 w-0.5 h-8 bg-gray-800 transform -translate-x-1/2 rotate-12" />
            <div className="absolute top-1/2 left-1/3 w-0.5 h-6 bg-gray-800 transform rotate-45" />
            <div className="absolute top-2/3 right-1/3 w-0.5 h-4 bg-gray-800 transform -rotate-12" />
            <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" />
          </motion.div>
        )}
        
        {/* Enhanced Glow Effect */}
        {(nft.rarity === 'Legendary' || nft.rarity === 'Mythic' || isGlowing) && (
          <motion.div
            className={`absolute inset-0 rounded-full ${
              specialEffect === 'fire' ? 'bg-gradient-to-b from-red-400/30 to-orange-400/30' :
              specialEffect === 'ice' ? 'bg-gradient-to-b from-blue-400/30 to-cyan-400/30' :
              specialEffect === 'lightning' ? 'bg-gradient-to-b from-purple-400/30 to-yellow-400/30' :
              specialEffect === 'rainbow' ? 'bg-gradient-to-b from-pink-400/30 via-purple-400/30 to-blue-400/30' :
              'bg-gradient-to-b from-yellow-300/20 to-transparent'
            }`}
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              scale: isGlowing ? [1, 1.05, 1] : [1, 1.02, 1]
            }}
            transition={{ duration: specialEffect ? 1 : 2, repeat: Infinity }}
          />
        )}
        
        {/* Temperature indicator */}
        {eggTemperature > 30 && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-red-400/20 to-transparent rounded-full"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
        
        {/* Cute Face */}
        {getEggFace()}
        
        {/* Sound indicator */}
        {soundPlaying && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-2 right-2"
          >
            <Volume2 className="w-4 h-4 text-white animate-pulse" />
          </motion.div>
        )}
      </div>
      
      {/* Floating Hearts */}
      <AnimatePresence>
        {showHeartFloat && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 0 }}
            animate={{ opacity: 0, y: -20, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2"
          >
            <Heart className="w-6 h-6 text-red-400 fill-current" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sparkles */}
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
          />
        ))}
      </AnimatePresence>
      
      {/* Magical Particles */}
      <AnimatePresence>
        {magicalParticles.map(particle => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0, 1.5, 0],
              y: [-20, -40, -60],
              rotate: [0, 180, 360]
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full"
            style={{ 
              left: `${particle.x}%`, 
              top: `${particle.y}%`,
              backgroundColor: particle.color,
              boxShadow: `0 0 10px ${particle.color}`
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* Click counter */}
      {clickCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
        >
          {clickCount}
        </motion.div>
      )}
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      className="group"
    >
      <Card className={`relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border-2 transition-all duration-300 ${
        isHovering 
          ? `border-${nft.rarity.toLowerCase()}-400 ${rarityGlow[nft.rarity]} transform scale-105` 
          : 'border-gray-700'
      }`}>
        {/* Rarity Badge */}
        <div className="absolute top-2 right-2 z-10">
          <Badge className={`bg-gradient-to-r ${rarityColors[nft.rarity]} text-white font-bold shadow-lg`}>
            {nft.rarity}
          </Badge>
        </div>
        
        {/* Level Badge */}
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="outline" className="bg-black/50 text-white border-gray-600">
            Lv.{petLevel}
          </Badge>
        </div>
        
        {/* Happiness Indicator */}
        {happiness > 50 && (
          <div className="absolute top-12 right-2 z-10">
            <Badge variant="outline" className="bg-pink-500/20 text-pink-400 border-pink-500">
              <Heart className="w-3 h-3 mr-1" />
              {happiness}%
            </Badge>
          </div>
        )}

        {/* Mood Indicator */}
        <div className="absolute top-12 left-2 z-10">
          <div className="bg-black/50 rounded-full p-1 text-xs">
            {moodEmojis[eggMood]}
          </div>
        </div>
        
        {/* Temperature Indicator */}
        {eggTemperature > 30 && (
          <div className="absolute bottom-2 left-2 z-10">
            <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500">
              🌡️ {eggTemperature}°C
            </Badge>
          </div>
        )}
        
        {/* Special Effect Indicator */}
        {specialEffect && (
          <div className="absolute bottom-2 right-2 z-10">
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500">
              ✨ {specialEffect}
            </Badge>
          </div>
        )}

        <CardHeader className="pb-2">
          <EggIcon />
          <CardTitle className="text-center text-lg font-bold text-white">
            {nft.name}
          </CardTitle>
          
          {/* Personality */}
          {nft.personality && (
            <p className="text-center text-sm text-gray-400 italic">
              "{nft.personality}"
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Experience Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Experience</span>
              <span>{nft.experience}/{nft.maxExperience} XP</span>
            </div>
            <Progress 
              value={(nft.experience / nft.maxExperience) * 100} 
              className="h-2"
            />
          </div>

          {/* Hatch Progress */}
          {nft.isHatching && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-yellow-400">
                <span className="flex items-center gap-1">
                  <Baby className="w-4 h-4" />
                  Hatching Progress
                </span>
                <span>{nft.hatchProgress}%</span>
              </div>
              <Progress 
                value={nft.hatchProgress} 
                className="h-3 bg-gray-700"
              />
              <div className="text-xs text-gray-400 text-center">
                <Clock className="w-3 h-3 inline mr-1" />
                Time to hatch: {formatTimeToHatch(nft.timeToHatch)}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Price</span>
              <span className="text-gold font-bold">{nft.price} GOLD</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Owners</span>
              <span className="text-white">{nft.owners}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleLike}
              variant="outline"
              size="sm"
              className={`flex-1 ${isLiked ? 'bg-red-500/20 border-red-500' : 'border-gray-600'}`}
            >
              <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              {currentLikes}
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="border-gray-600"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-600">
                  <Eye className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Egg className="w-5 h-5 text-gold" />
                    {nft.name} Details
                  </DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="stats" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="traits">Traits</TabsTrigger>
                    <TabsTrigger value="abilities">Abilities</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="stats" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">Pet Level</div>
                        <div className="text-lg font-bold text-gold">{petLevel}</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">Happiness</div>
                        <div className="text-lg font-bold text-pink-400">{happiness}%</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">Temperature</div>
                        <div className="text-lg font-bold text-red-400">{eggTemperature}°C</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">Mood</div>
                        <div className="text-lg font-bold">{moodEmojis[eggMood]} {eggMood}</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">Last Sale</div>
                        <div className="text-lg font-bold text-gold">{nft.lastSale} GOLD</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">24h Volume</div>
                        <div className="text-lg font-bold text-green-400">{nft.volume24h} GOLD</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">Views</div>
                        <div className="text-lg font-bold text-blue-400">{nft.views}</div>
                      </div>
                      {specialEffect && (
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <div className="text-sm text-gray-400">Special Effect</div>
                          <div className="text-lg font-bold text-purple-400">✨ {specialEffect}</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Interactive Tips */}
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-400 mb-2">💡 Interactive Tips</h4>
                      <ul className="text-xs text-gray-400 space-y-1">
                        <li>• Click the egg to increase happiness and trigger special effects</li>
                        <li>• Reach 10 clicks for magical transformation</li>
                        <li>• Higher happiness levels unlock new moods and abilities</li>
                        <li>• Temperature rises with activity - watch for special indicators!</li>
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="traits" className="space-y-2">
                    {Object.entries(nft.traits).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                        <span className="capitalize text-gray-400">{key}</span>
                        <span className="text-white font-medium">{value}</span>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="abilities" className="space-y-2">
                    {nft.abilities.map((ability, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="font-medium">{ability}</span>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>

          {/* Purchase Button */}
          <Button
            onClick={handlePurchase}
            className="w-full bg-gradient-to-r from-gold to-yellow-400 hover:from-gold/90 hover:to-yellow-400/90 text-black font-bold"
            disabled={!connected}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {connected ? `Buy for ${nft.price} GOLD` : 'Connect Wallet'}
          </Button>
          
          {/* Creator Info */}
          <div className="text-xs text-gray-500 text-center">
            Created by <span className="text-gold">{nft.creator}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}