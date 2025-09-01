"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Crown, 
  Sparkles, 
  Star, 
  Heart, 
  Eye, 
  TrendingUp,
  ArrowRight,
  Zap,
  Gift,
  Diamond,
  Flame,
  Music,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Users,
  Award,
  Shuffle,
  Filter,
  Search,
  Baby,
  Egg
} from 'lucide-react'
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FeaturedEgg {
  id: string
  name: string
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic'
  price: number
  likes: number
  views: number
  isHatching: boolean
  hatchProgress: number
  traits: {
    color: string
    pattern: string
    glow: string
  }
  mood?: 'happy' | 'sleepy' | 'excited' | 'curious' | 'magical'
  personality?: string
  timeToHatch?: number
  creator: string
  collection: string
  abilities: string[]
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

const featuredEggs: FeaturedEgg[] = [
  {
    id: 'featured-1',
    name: 'Golden Phoenix Egg',
    rarity: 'Mythic',
    price: 847500000, // 847.5M SOL
    likes: 2847892,
    views: 15847421,
    isHatching: true,
    hatchProgress: 85,
    traits: {
      color: 'Golden',
      pattern: 'Phoenix Flames',
      glow: 'Ethereal'
    },
    mood: 'magical',
    personality: 'A majestic egg radiating ancient power',
    timeToHatch: 3600,
    creator: 'Phoenix Master',
    collection: 'Legendary Creatures',
    abilities: ['Fire Immunity', 'Rebirth', 'Flight']
  },
  {
    id: 'featured-2',
    name: 'Crystal Dragon Egg',
    rarity: 'Legendary',
    price: 425000000, // 425M SOL
    likes: 1847654,
    views: 8472156,
    isHatching: false,
    hatchProgress: 0,
    traits: {
      color: 'Crystal Blue',
      pattern: 'Dragon Scales',
      glow: 'Bright'
    },
    mood: 'curious',
    personality: 'A mysterious egg with crystalline beauty',
    timeToHatch: 7200,
    creator: 'Crystal Sage',
    collection: 'Dragon Dynasty',
    abilities: ['Ice Breath', 'Crystal Armor', 'Telepathy']
  },
  {
    id: 'featured-3',
    name: 'Shadow Wolf Egg',
    rarity: 'Epic',
    price: 284700000, // 284.7M SOL
    likes: 1284321,
    views: 5471543,
    isHatching: true,
    hatchProgress: 45,
    traits: {
      color: 'Shadow Black',
      pattern: 'Wolf Marks',
      glow: 'Pulsing'
    },
    mood: 'excited',
    personality: 'A fierce egg with untamed spirit',
    timeToHatch: 5400,
    creator: 'Shadow Hunter',
    collection: 'Wild Spirits',
    abilities: ['Shadow Step', 'Pack Leader', 'Night Vision']
  },
  {
    id: 'featured-4',
    name: 'Rainbow Unicorn Egg',
    rarity: 'Mythic',
    price: 1284000000, // 1.284B SOL
    likes: 4571205,
    views: 28474567,
    isHatching: true,
    hatchProgress: 92,
    traits: {
      color: 'Rainbow',
      pattern: 'Starlight',
      glow: 'Prismatic'
    },
    mood: 'happy',
    personality: 'A pure egg filled with rainbow magic',
    timeToHatch: 1800,
    creator: 'Rainbow Keeper',
    collection: 'Mythical Beings',
    abilities: ['Healing Light', 'Rainbow Bridge', 'Purification']
  },
  {
    id: 'featured-5',
    name: 'Thunder Eagle Egg',
    rarity: 'Legendary',
    price: 634700000, // 634.7M SOL
    likes: 2847567,
    views: 12472890,
    isHatching: false,
    hatchProgress: 0,
    traits: {
      color: 'Storm Blue',
      pattern: 'Lightning',
      glow: 'Electric'
    },
    mood: 'excited',
    personality: 'An electrifying egg crackling with energy',
    timeToHatch: 6000,
    creator: 'Storm Caller',
    collection: 'Sky Rulers',
    abilities: ['Lightning Strike', 'Storm Control', 'Sonic Flight']
  },
  {
    id: 'featured-6',
    name: 'Forest Spirit Egg',
    rarity: 'Epic',
    price: 184700000, // 184.7M SOL
    likes: 847445,
    views: 4271876,
    isHatching: true,
    hatchProgress: 67,
    traits: {
      color: 'Emerald Green',
      pattern: 'Leaf Veins',
      glow: 'Natural'
    },
    mood: 'sleepy',
    personality: 'A peaceful egg connected to nature',
    timeToHatch: 4200,
    creator: 'Forest Guardian',
    collection: 'Nature Spirits',
    abilities: ['Plant Growth', 'Healing Herbs', 'Animal Speech']
  }
]

const EggIcon = ({ egg, size = 'normal', isActive = false }: { egg: FeaturedEgg; size?: 'small' | 'normal' | 'large'; isActive?: boolean }) => {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]) 
  const [isHovering, setIsHovering] = useState(false)
  const [isWiggling, setIsWiggling] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [soundPlaying, setSoundPlaying] = useState(false)
  
  const sizeClasses = {
    small: 'w-16 h-20',
    normal: 'w-20 h-26',
    large: 'w-28 h-36'
  }

  // Generate sparkles for rare eggs
  useEffect(() => {
    if (egg.rarity === 'Legendary' || egg.rarity === 'Mythic') {
      const interval = setInterval(() => {
        setSparkles(prev => {
          const newSparkles = Array.from({ length: 2 }, (_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 100,
            y: Math.random() * 100
          }))
          return [...prev.slice(-3), ...newSparkles]
        })
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [egg.rarity])

  // Auto wiggle for active eggs
  useEffect(() => {
    if (isActive) {
      const wiggleInterval = setInterval(() => {
        setIsWiggling(true)
        setTimeout(() => setIsWiggling(false), 1000)
      }, 8000)
      return () => clearInterval(wiggleInterval)
    }
  }, [isActive])

  const handleEggClick = () => {
    setClickCount(prev => prev + 1)
    setIsWiggling(true)
    setSoundPlaying(true)
    
    setTimeout(() => {
      setSoundPlaying(false)
      setIsWiggling(false)
    }, 500)

    if (clickCount >= 3) {
      setClickCount(0)
    }
  }

  const getEggFace = () => {
    const mood = egg.mood || 'happy'
    switch (mood) {
      case 'happy':
        return (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
            </div>
            <div className="w-3 h-1 bg-orange-400 rounded-full mt-1 mx-auto" />
            <div className="w-4 h-0.5 bg-pink-400 rounded-full mt-0.5 mx-auto" />
          </div>
        )
      case 'sleepy':
        return (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-0.5 bg-black rounded-full" />
              <div className="w-2 h-0.5 bg-black rounded-full" />
            </div>
            <div className="w-2 h-0.5 bg-orange-400 rounded-full mt-1 mx-auto" />
            <div className="text-xs">💤</div>
          </div>
        )
      case 'excited':
        return (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-0.5">
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            </div>
            <div className="w-3 h-1 bg-orange-400 rounded-full mt-1 mx-auto" />
            <div className="w-5 h-1 bg-yellow-400 rounded-full mt-0.5 mx-auto animate-pulse" />
          </div>
        )
      case 'curious':
        return (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-black rounded-full" />
              <div className="w-1 h-1 bg-black rounded-full" />
            </div>
            <div className="w-2 h-0.5 bg-orange-400 rounded-full mt-1 mx-auto" />
            <div className="text-xs">?</div>
          </div>
        )
      case 'magical':
        return (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
            </div>
            <div className="w-3 h-1 bg-orange-400 rounded-full mt-1 mx-auto" />
            <div className="w-4 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-0.5 mx-auto animate-pulse" />
            <div className="text-xs animate-bounce">✨</div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} mx-auto cursor-pointer`}
      animate={{
        scale: isHovering ? 1.05 : 1,
        rotateY: isHovering ? 5 : 0,
        rotateZ: isWiggling ? [0, -2, 2, -2, 2, 0] : 0
      }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      onClick={handleEggClick}
    >
      {/* Egg Base */}
      <div className={`w-full h-full bg-gradient-to-b ${rarityColors[egg.rarity]} rounded-full relative overflow-hidden ${rarityGlow[egg.rarity]} shadow-2xl border-2 border-white/20`}>
        {/* Egg Shine */}
        <div className="absolute inset-2 bg-gradient-to-br from-white/40 via-white/20 to-transparent rounded-full" />
        
        {/* Rarity-based patterns */}
        <div className="absolute inset-3">
          {egg.rarity === 'Common' && (
            <>
              <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white/40 rounded-full" />
              <div className="absolute top-3 right-2 w-1 h-1 bg-white/40 rounded-full" />
              <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-white/40 rounded-full" />
            </>
          )}
          
          {egg.rarity === 'Rare' && (
            <>
              <div className="absolute top-2 left-1/2 w-6 h-0.5 bg-blue-200/50 rounded-full transform -translate-x-1/2 rotate-12" />
              <div className="absolute top-4 left-1/2 w-4 h-0.5 bg-blue-200/50 rounded-full transform -translate-x-1/2 -rotate-12" />
              <div className="absolute bottom-3 left-1/2 w-3 h-0.5 bg-blue-200/50 rounded-full transform -translate-x-1/2 rotate-12" />
            </>
          )}
          
          {egg.rarity === 'Epic' && (
            <>
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                <Star className="w-2 h-2 text-purple-200/60" />
              </div>
              <div className="absolute top-4 right-1">
                <Sparkles className="w-1.5 h-1.5 text-purple-200/60" />
              </div>
              <div className="absolute bottom-4 left-1">
                <Diamond className="w-1.5 h-1.5 text-purple-200/60" />
              </div>
            </>
          )}
          
          {egg.rarity === 'Legendary' && (
            <>
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                <Crown className="w-3 h-3 text-yellow-200/70" />
              </div>
              <div className="absolute top-3 right-0">
                <Flame className="w-2 h-2 text-orange-200/60" />
              </div>
              <div className="absolute bottom-3 left-0">
                <Zap className="w-2 h-2 text-yellow-200/60" />
              </div>
            </>
          )}
          
          {egg.rarity === 'Mythic' && (
            <>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-pink-200/30 via-purple-200/30 to-blue-200/30 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                <Star className="w-2 h-2 text-pink-200/80 animate-pulse" />
              </div>
              <div className="absolute top-2 right-0">
                <Sparkles className="w-1.5 h-1.5 text-purple-200/80 animate-pulse" />
              </div>
              <div className="absolute bottom-2 left-0">
                <Diamond className="w-1.5 h-1.5 text-blue-200/80 animate-pulse" />
              </div>
            </>
          )}
        </div>
        
        {/* Crack Effect for Hatching */}
        {egg.isHatching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: egg.hatchProgress / 100 }}
            className="absolute inset-0 bg-gradient-to-br from-transparent via-yellow-200/30 to-transparent"
          >
            <div className="absolute top-1/3 left-1/2 w-0.5 h-4 bg-gray-800 transform -translate-x-1/2 rotate-12" />
            <div className="absolute top-1/2 left-1/3 w-0.5 h-3 bg-gray-800 transform rotate-45" />
            <div className="absolute top-2/3 right-1/3 w-0.5 h-2 bg-gray-800 transform -rotate-12" />
            <div className="absolute bottom-1/4 left-1/2 w-0.5 h-0.5 bg-yellow-400 rounded-full animate-pulse" />
          </motion.div>
        )}
        
        {/* Glow Effect for high rarity */}
        {(egg.rarity === 'Legendary' || egg.rarity === 'Mythic') && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-yellow-300/20 to-transparent rounded-full"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
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
            className="absolute top-1 right-1"
          >
            <Volume2 className="w-3 h-3 text-white animate-pulse" />
          </motion.div>
        )}
      </div>
      
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
      
      {/* Click counter */}
      {clickCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold"
        >
          {clickCount}
        </motion.div>
      )}
      
      {/* Mood indicator */}
      {egg.mood && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs">
          {moodEmojis[egg.mood]}
        </div>
      )}
    </motion.div>
  )
}

export default function EggNFTShowcase() {
  const { connected } = useWallet()
  const { toast } = useToast()
  const [currentEgg, setCurrentEgg] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [rarityFilter, setRarityFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('price')
  const [showStats, setShowStats] = useState(false)
  const [likedEggs, setLikedEggs] = useState<Set<string>>(new Set())

  // Auto-rotate featured eggs
  useEffect(() => {
    if (!isAutoPlay) return
    
    const interval = setInterval(() => {
      setCurrentEgg(prev => (prev + 1) % featuredEggs.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlay])

  // Filter and sort eggs
  const filteredEggs = featuredEggs
    .filter(egg => {
      const matchesSearch = egg.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRarity = rarityFilter === 'all' || egg.rarity === rarityFilter
      return matchesSearch && matchesRarity
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price
        case 'likes':
          return b.likes - a.likes
        case 'rarity':
          const rarityOrder = { 'Mythic': 5, 'Legendary': 4, 'Epic': 3, 'Rare': 2, 'Common': 1 }
          return rarityOrder[b.rarity] - rarityOrder[a.rarity]
        case 'hatch':
          return b.hatchProgress - a.hatchProgress
        default:
          return 0
      }
    })

  const handleLike = (egg: FeaturedEgg) => {
    if (!connected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to like NFTs",
        variant: "destructive"
      })
      return
    }
    
    const newLikedEggs = new Set(likedEggs)
    if (likedEggs.has(egg.id)) {
      newLikedEggs.delete(egg.id)
      toast({
        title: "Unliked! 💔",
        description: `You unliked ${egg.name}`,
      })
    } else {
      newLikedEggs.add(egg.id)
      toast({
        title: "Liked! ❤️",
        description: `You liked ${egg.name}`,
      })
    }
    setLikedEggs(newLikedEggs)
  }

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * featuredEggs.length)
    setCurrentEgg(randomIndex)
    toast({
      title: "Shuffled! 🎲",
      description: "Showing a random egg",
    })
  }

  const formatTimeToHatch = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black via-purple-900/10 to-black relative overflow-hidden">
      {/* Elegant Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-600/3 via-transparent to-violet-600/3 animate-holographic" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-500/8 to-yellow-500/8 rounded-full blur-3xl animate-floating" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/8 to-purple-500/8 rounded-full blur-3xl animate-floating" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-slate-400/6 to-blue-500/6 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-amber-500/12 to-yellow-400/12 rounded-full blur-xl animate-sparkle" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-violet-500/6 to-slate-400/6 rounded-full blur-2xl animate-wave" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Super Premium Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Badge variant="outline" className="border-gold text-gold bg-gold/20 mb-4 animate-pulse backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2 animate-sparkle" />
              NFT Collection
            </Badge>
          </motion.div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Crown className="w-8 h-8 text-yellow-400" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent relative">
              Featured Magical Eggs
              <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-gold/20 to-transparent animate-shimmer" />
            </h2>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Crown className="w-8 h-8 text-yellow-400" />
            </motion.div>
          </div>
          <motion.p 
            className="text-xl premium-text max-w-2xl mx-auto mb-8 animate-floating"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Discover rare and legendary eggs waiting to hatch into powerful creatures
          </motion.p>
          
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search eggs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 bg-gray-800 border-gray-600 text-white"
              />
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            
            <Select value={rarityFilter} onValueChange={setRarityFilter}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Rarity</SelectItem>
                <SelectItem value="Common">Common</SelectItem>
                <SelectItem value="Rare">Rare</SelectItem>
                <SelectItem value="Epic">Epic</SelectItem>
                <SelectItem value="Legendary">Legendary</SelectItem>
                <SelectItem value="Mythic">Mythic</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="likes">Likes</SelectItem>
                <SelectItem value="rarity">Rarity</SelectItem>
                <SelectItem value="hatch">Hatch Progress</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="border-gray-600 text-gray-300"
              >
                {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleShuffle}
                className="border-gray-600 text-gray-300"
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStats(!showStats)}
                className="border-gray-600 text-gray-300"
              >
                <Award className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-yellow-400">{featuredEggs.length}</div>
                  <div className="text-sm text-gray-400">Total Eggs</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-green-400">{featuredEggs.filter(e => e.isHatching).length}</div>
                  <div className="text-sm text-gray-400">Hatching</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-purple-400">{featuredEggs.reduce((sum, e) => sum + e.likes, 0)}</div>
                  <div className="text-sm text-gray-400">Total Likes</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-blue-400">{featuredEggs.reduce((sum, e) => sum + e.views, 0)}</div>
                  <div className="text-sm text-gray-400">Total Views</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured Egg Carousel */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Main Featured Egg */}
          <motion.div
            key={currentEgg}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <div className="mb-8 relative">
              <EggIcon egg={featuredEggs[currentEgg]} size="large" isActive={true} />
              
              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-2 -right-2"
              >
                <Badge className={`bg-gradient-to-r ${rarityColors[featuredEggs[currentEgg].rarity]} text-white font-bold shadow-lg`}>
                  {featuredEggs[currentEgg].rarity}
                </Badge>
              </motion.div>
              
              {featuredEggs[currentEgg].isHatching && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                >
                  <Badge className="bg-yellow-500 text-black font-bold animate-pulse">
                    <Baby className="w-3 h-3 mr-1" />
                    Hatching
                  </Badge>
                </motion.div>
              )}
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-2">
              {featuredEggs[currentEgg].name}
            </h3>
            
            {featuredEggs[currentEgg].personality && (
              <p className="text-gray-400 italic mb-4">
                "{featuredEggs[currentEgg].personality}"
              </p>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <div className="text-gray-400">Color</div>
                <div className="text-white font-medium">{featuredEggs[currentEgg].traits.color}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <div className="text-gray-400">Pattern</div>
                <div className="text-white font-medium">{featuredEggs[currentEgg].traits.pattern}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <div className="text-gray-400">Glow</div>
                <div className="text-white font-medium">{featuredEggs[currentEgg].traits.glow}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <div className="text-gray-400">Price</div>
                <div className="text-gold font-bold">{(featuredEggs[currentEgg].price / 1000000).toFixed(1)}M SOL</div>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="flex gap-4 mb-6">
              <motion.div 
                className={`flex items-center gap-1 cursor-pointer transition-colors ${
                  likedEggs.has(featuredEggs[currentEgg].id) ? 'text-red-400' : 'text-pink-400'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleLike(featuredEggs[currentEgg])}
              >
                <Heart className={`w-4 h-4 ${likedEggs.has(featuredEggs[currentEgg].id) ? 'fill-current' : ''}`} />
                <span>{featuredEggs[currentEgg].likes + (likedEggs.has(featuredEggs[currentEgg].id) ? 1 : 0)}</span>
              </motion.div>
              <div className="flex items-center gap-1 text-blue-400">
                <Eye className="w-4 h-4" />
                <span>{featuredEggs[currentEgg].views}</span>
              </div>
              <div className="flex items-center gap-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span>+{Math.floor(Math.random() * 20 + 5)}%</span>
              </div>
              <div className="flex items-center gap-1 text-purple-400">
                <Users className="w-4 h-4" />
                <span>{Math.floor(Math.random() * 50 + 10)}</span>
              </div>
            </div>

            {/* Hatch Progress */}
            {featuredEggs[currentEgg].isHatching && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-yellow-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    Hatching Progress
                  </span>
                  <span>{featuredEggs[currentEgg].hatchProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${featuredEggs[currentEgg].hatchProgress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
                {featuredEggs[currentEgg].timeToHatch && (
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    Time to hatch: {formatTimeToHatch(featuredEggs[currentEgg].timeToHatch!)}
                  </div>
                )}
              </div>
            )}

            {/* Abilities */}
            <div className="mb-6">
              <h4 className="text-sm text-gray-400 mb-2">Abilities</h4>
              <div className="flex flex-wrap gap-2">
                {featuredEggs[currentEgg].abilities.map((ability, index) => (
                  <motion.div
                    key={ability}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <Badge variant="outline" className="border-purple-500 text-purple-400 bg-purple-500/10">
                      <Zap className="w-3 h-3 mr-1" />
                      {ability}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => handleLike(featuredEggs[currentEgg])}
                variant="outline"
                className={`border-pink-500 hover:bg-pink-500/10 ${
                  likedEggs.has(featuredEggs[currentEgg].id) 
                    ? 'text-red-400 border-red-500' 
                    : 'text-pink-400'
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 ${likedEggs.has(featuredEggs[currentEgg].id) ? 'fill-current' : ''}`} />
                {likedEggs.has(featuredEggs[currentEgg].id) ? 'Liked' : 'Like'}
              </Button>
              <Link href="/nft">
                <Button className={`bg-gradient-to-r ${rarityColors[featuredEggs[currentEgg].rarity]} hover:opacity-90 text-white font-bold`}>
                  <Gift className="w-4 h-4 mr-2" />
                  View Collection
                </Button>
              </Link>
            </div>
            
            {/* Creator Info */}
            <div className="mt-4 text-xs text-gray-500">
              Created by <span className="text-gold">{featuredEggs[currentEgg].creator}</span> • 
              <span className="text-gray-400">{featuredEggs[currentEgg].collection}</span>
            </div>
          </motion.div>

          {/* Enhanced Egg Grid */}
          <div className="grid grid-cols-3 gap-6">
            {filteredEggs.slice(0, 6).map((egg, index) => (
              <motion.div
                key={egg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`cursor-pointer transition-all duration-300 ${
                  index === currentEgg ? 'scale-110 z-10' : 'hover:scale-105'
                }`}
                onClick={() => setCurrentEgg(featuredEggs.findIndex(e => e.id === egg.id))}
              >
                <Card className={`bg-gray-800/50 border-2 transition-all relative overflow-hidden ${
                  index === currentEgg 
                    ? `border-${egg.rarity.toLowerCase()}-400 ${rarityGlow[egg.rarity]}` 
                    : 'border-gray-700 hover:border-gray-600'
                }`}>
                  {/* Mood indicator */}
                  {egg.mood && (
                    <div className="absolute top-2 left-2 z-10 text-xs">
                      {moodEmojis[egg.mood]}
                    </div>
                  )}
                  
                  {/* Like indicator */}
                  {likedEggs.has(egg.id) && (
                    <div className="absolute top-2 right-2 z-10">
                      <Heart className="w-4 h-4 text-red-400 fill-current" />
                    </div>
                  )}
                  
                  <CardContent className="p-4 text-center">
                    <EggIcon egg={egg} size="small" />
                    <h4 className="text-white font-bold text-sm mt-2">{egg.name}</h4>
                    <Badge className={`bg-gradient-to-r ${rarityColors[egg.rarity]} text-white text-xs mt-1`}>
                      {egg.rarity}
                    </Badge>
                    <p className="text-gold font-bold text-sm mt-2">{egg.price} GOLD</p>
                    
                    {/* Mini stats */}
                    <div className="flex justify-center gap-2 mt-2 text-xs">
                      <span className="text-pink-400 flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {egg.likes}
                      </span>
                      <span className="text-blue-400 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {egg.views}
                      </span>
                    </div>
                    
                    {/* Hatch progress mini bar */}
                    {egg.isHatching && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-700 rounded-full h-1">
                          <div 
                            className="bg-yellow-400 h-1 rounded-full transition-all duration-500"
                            style={{ width: `${egg.hatchProgress}%` }}
                          />
                        </div>
                        <div className="text-xs text-yellow-400 mt-1">{egg.hatchProgress}%</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-purple-800/50 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Collection?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of collectors in the magical world of Egg NFTs. Each egg is unique and waiting to reveal its secrets.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/nft">
                <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold px-8 py-4 text-lg">
                  <Egg className="w-5 h-5 mr-2" />
                  Explore Full Collection
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-4 text-lg">
                  <Gift className="w-5 h-5 mr-2" />
                  Visit Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}