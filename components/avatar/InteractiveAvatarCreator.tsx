'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shuffle, 
  RotateCcw, 
  Download, 
  Sparkles, 
  Zap, 
  Crown, 
  Eye, 
  Palette, 
  Camera, 
  Share2, 
  Heart, 
  Star, 
  Wand2, 
  Rocket,
  Gem,
  Shield,
  Flame,
  Snowflake,
  Volume2,
  VolumeX
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import AvatarCanvas from '@/components/avatar/AvatarCanvas'

export type AvatarOptions = {
  skin: 'gold' | 'lava' | 'crystal' | 'void' | 'rainbow' | 'diamond'
  eyes: 'glow' | 'cute' | 'cyber' | 'laser' | 'galaxy' | 'fire'
  helmet: 'eth' | 'sol' | 'btc' | 'ada' | 'dot' | 'none'
  backdrop: 'nebula' | 'jungle' | 'ruins' | 'space' | 'matrix' | 'none'
  accessories: 'crown' | 'glasses' | 'earrings' | 'necklace' | 'none'
  aura: 'golden' | 'electric' | 'mystic' | 'fire' | 'ice' | 'none'
}

interface RevolutionaryFeature {
  id: string
  name: string
  icon: any
  description: string
  action: () => void
  unlocked: boolean
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  cost?: number
}

export default function InteractiveAvatarCreator() {
  const { toast } = useToast()
  const [options, setOptions] = useState<AvatarOptions>({
    skin: 'gold',
    eyes: 'glow',
    helmet: 'eth',
    backdrop: 'nebula',
    accessories: 'none',
    aura: 'none'
  })
  
  const [isAnimating, setIsAnimating] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [goldCoins, setGoldCoins] = useState(1000)
  const [experience, setExperience] = useState(0)
  const [level, setLevel] = useState(1)
  const [unlockedFeatures, setUnlockedFeatures] = useState<string[]>(['basic-randomize', 'basic-reset'])
  const [selectedCategory, setSelectedCategory] = useState<keyof AvatarOptions>('skin')
  const [animationSpeed, setAnimationSpeed] = useState([1])
  const [showParticles, setShowParticles] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [favoriteAvatars, setFavoriteAvatars] = useState<AvatarOptions[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSound = (type: 'click' | 'unlock' | 'level' | 'magic') => {
    if (!soundEnabled) return
    // Simulate sound effects
    console.log(`Playing ${type} sound effect`)
  }

  const gainExperience = (amount: number) => {
    setExperience(prev => {
      const newExp = prev + amount
      const newLevel = Math.floor(newExp / 100) + 1
      if (newLevel > level) {
        setLevel(newLevel)
        playSound('level')
        toast({
          title: "Level Up!",
          description: `You reached level ${newLevel}! New features unlocked!`,
        })
        // Unlock new features based on level
        if (newLevel === 2) setUnlockedFeatures(prev => [...prev, 'rainbow-skin', 'galaxy-eyes'])
        if (newLevel === 3) setUnlockedFeatures(prev => [...prev, 'diamond-skin', 'laser-eyes'])
        if (newLevel === 5) setUnlockedFeatures(prev => [...prev, 'legendary-aura', 'cosmic-backdrop'])
      }
      return newExp
    })
  }

  const spendCoins = (amount: number) => {
    if (goldCoins >= amount) {
      setGoldCoins(prev => prev - amount)
      return true
    }
    toast({
      title: "Insufficient GOLD Coins",
      description: "You need more GOLD coins for this feature!",
      variant: "destructive"
    })
    return false
  }

  const revolutionaryFeatures: RevolutionaryFeature[] = [
    {
      id: 'magic-randomize',
      name: 'Magic Randomize',
      icon: Wand2,
      description: 'Randomize with magical effects and particles',
      rarity: 'rare',
      cost: 50,
      unlocked: unlockedFeatures.includes('magic-randomize'),
      action: () => {
        if (!spendCoins(50)) return
        playSound('magic')
        setIsAnimating(true)
        
        // Magical randomization with delay for effect
        setTimeout(() => {
          handleRandomize()
          gainExperience(25)
          setIsAnimating(false)
        }, 1500)
      }
    },
    {
      id: 'cosmic-transformation',
      name: 'Cosmic Transformation',
      icon: Rocket,
      description: 'Transform into a cosmic being with special effects',
      rarity: 'legendary',
      cost: 200,
      unlocked: level >= 5,
      action: () => {
        if (!spendCoins(200)) return
        playSound('magic')
        setOptions({
          skin: 'rainbow',
          eyes: 'galaxy',
          helmet: 'none',
          backdrop: 'space',
          accessories: 'crown',
          aura: 'mystic'
        })
        gainExperience(100)
        toast({
          title: "Cosmic Transformation Complete!",
          description: "You have become a cosmic entity!",
        })
      }
    },
    {
      id: 'diamond-upgrade',
      name: 'Diamond Upgrade',
      icon: Gem,
      description: 'Upgrade to premium diamond skin with sparkle effects',
      rarity: 'epic',
      cost: 150,
      unlocked: level >= 3,
      action: () => {
        if (!spendCoins(150)) return
        playSound('unlock')
        setOptions(prev => ({ ...prev, skin: 'diamond', aura: 'golden' }))
        gainExperience(75)
        toast({
          title: "Diamond Upgrade Activated!",
          description: "Your avatar now shines with diamond brilliance!",
        })
      }
    },
    {
      id: 'elemental-fusion',
      name: 'Elemental Fusion',
      icon: Flame,
      description: 'Combine fire and ice elements for unique appearance',
      rarity: 'epic',
      cost: 120,
      unlocked: level >= 4,
      action: () => {
        if (!spendCoins(120)) return
        playSound('magic')
        setOptions(prev => ({ 
          ...prev, 
          skin: 'lava', 
          eyes: 'fire', 
          aura: 'fire',
          backdrop: 'matrix'
        }))
        gainExperience(60)
        toast({
          title: "Elemental Fusion Complete!",
          description: "Fire and ice energies now flow through your avatar!",
        })
      }
    },
    {
      id: 'nft-mint',
      name: 'Mint as NFT',
      icon: Camera,
      description: 'Mint your avatar as a unique NFT on the blockchain',
      rarity: 'legendary',
      cost: 500,
      unlocked: level >= 10,
      action: () => {
        if (!spendCoins(500)) return
        playSound('unlock')
        toast({
          title: "NFT Minting Initiated!",
          description: "Your avatar is being minted as a unique NFT!",
        })
        gainExperience(200)
      }
    },
    {
      id: 'share-gallery',
      name: 'Share to Gallery',
      icon: Share2,
      description: 'Share your creation to the community gallery',
      rarity: 'common',
      cost: 10,
      unlocked: true,
      action: () => {
        if (!spendCoins(10)) return
        playSound('click')
        toast({
          title: "Shared to Gallery!",
          description: "Your avatar has been shared to the community gallery!",
        })
        gainExperience(15)
      }
    },
    {
      id: 'save-favorite',
      name: 'Save as Favorite',
      icon: Heart,
      description: 'Save current avatar to your favorites collection',
      rarity: 'common',
      cost: 5,
      unlocked: true,
      action: () => {
        if (!spendCoins(5)) return
        playSound('click')
        setFavoriteAvatars(prev => [...prev, { ...options }])
        toast({
          title: "Added to Favorites!",
          description: "Avatar saved to your favorites collection!",
        })
        gainExperience(10)
      }
    },
    {
      id: 'legendary-aura',
      name: 'Legendary Aura',
      icon: Crown,
      description: 'Activate the most powerful aura effect',
      rarity: 'legendary',
      cost: 300,
      unlocked: level >= 8,
      action: () => {
        if (!spendCoins(300)) return
        playSound('magic')
        setOptions(prev => ({ ...prev, aura: 'mystic' }))
        gainExperience(150)
        toast({
          title: "Legendary Aura Activated!",
          description: "Your avatar radiates with legendary power!",
        })
      }
    }
  ]

  const categories = [
    {
      name: 'Skin',
      key: 'skin' as keyof AvatarOptions,
      icon: Palette,
      options: [
        { value: 'gold', label: 'Gold', unlocked: true },
        { value: 'lava', label: 'Lava', unlocked: true },
        { value: 'crystal', label: 'Crystal', unlocked: true },
        { value: 'void', label: 'Void', unlocked: level >= 2 },
        { value: 'rainbow', label: 'Rainbow', unlocked: level >= 3 },
        { value: 'diamond', label: 'Diamond', unlocked: level >= 5 },
      ],
    },
    {
      name: 'Eyes',
      key: 'eyes' as keyof AvatarOptions,
      icon: Eye,
      options: [
        { value: 'glow', label: 'Glow', unlocked: true },
        { value: 'cute', label: 'Cute', unlocked: true },
        { value: 'cyber', label: 'Cyber', unlocked: true },
        { value: 'laser', label: 'Laser', unlocked: level >= 3 },
        { value: 'galaxy', label: 'Galaxy', unlocked: level >= 4 },
        { value: 'fire', label: 'Fire', unlocked: level >= 5 },
      ],
    },
    {
      name: 'Helmet',
      key: 'helmet' as keyof AvatarOptions,
      icon: Shield,
      options: [
        { value: 'eth', label: 'ETH Crown', unlocked: true },
        { value: 'sol', label: 'SOL Cap', unlocked: true },
        { value: 'btc', label: 'BTC Helmet', unlocked: level >= 2 },
        { value: 'ada', label: 'ADA Crown', unlocked: level >= 3 },
        { value: 'dot', label: 'DOT Visor', unlocked: level >= 4 },
        { value: 'none', label: 'None', unlocked: true },
      ],
    },
    {
      name: 'Backdrop',
      key: 'backdrop' as keyof AvatarOptions,
      icon: Star,
      options: [
        { value: 'nebula', label: 'Nebula', unlocked: true },
        { value: 'jungle', label: 'Jungle', unlocked: true },
        { value: 'ruins', label: 'Golden Ruins', unlocked: true },
        { value: 'space', label: 'Deep Space', unlocked: level >= 2 },
        { value: 'matrix', label: 'Matrix', unlocked: level >= 4 },
        { value: 'none', label: 'None', unlocked: true },
      ],
    },
    {
      name: 'Accessories',
      key: 'accessories' as keyof AvatarOptions,
      icon: Gem,
      options: [
        { value: 'crown', label: 'Royal Crown', unlocked: level >= 2 },
        { value: 'glasses', label: 'Cyber Glasses', unlocked: level >= 3 },
        { value: 'earrings', label: 'Gold Earrings', unlocked: level >= 4 },
        { value: 'necklace', label: 'Diamond Necklace', unlocked: level >= 5 },
        { value: 'none', label: 'None', unlocked: true },
      ],
    },
    {
      name: 'Aura',
      key: 'aura' as keyof AvatarOptions,
      icon: Sparkles,
      options: [
        { value: 'golden', label: 'Golden Glow', unlocked: level >= 2 },
        { value: 'electric', label: 'Electric', unlocked: level >= 3 },
        { value: 'mystic', label: 'Mystic', unlocked: level >= 5 },
        { value: 'fire', label: 'Fire Aura', unlocked: level >= 4 },
        { value: 'ice', label: 'Ice Aura', unlocked: level >= 4 },
        { value: 'none', label: 'None', unlocked: true },
      ],
    },
  ]

  const handleOptionChange = (category: keyof AvatarOptions, value: string) => {
    playSound('click')
    setOptions(prev => ({ ...prev, [category]: value }))
    gainExperience(5)
  }

  const handleRandomize = () => {
    playSound('click')
    const newOptions: AvatarOptions = {
      skin: categories[0].options[Math.floor(Math.random() * categories[0].options.length)].value as any,
      eyes: categories[1].options[Math.floor(Math.random() * categories[1].options.length)].value as any,
      helmet: categories[2].options[Math.floor(Math.random() * categories[2].options.length)].value as any,
      backdrop: categories[3].options[Math.floor(Math.random() * categories[3].options.length)].value as any,
      accessories: categories[4].options[Math.floor(Math.random() * categories[4].options.length)].value as any,
      aura: categories[5].options[Math.floor(Math.random() * categories[5].options.length)].value as any,
    }
    setOptions(newOptions)
    gainExperience(10)
  }

  const handleReset = () => {
    playSound('click')
    setOptions({
      skin: 'gold',
      eyes: 'glow',
      helmet: 'eth',
      backdrop: 'nebula',
      accessories: 'none',
      aura: 'none'
    })
    gainExperience(5)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 bg-gray-500/10'
      case 'rare': return 'border-blue-500 bg-blue-500/10'
      case 'epic': return 'border-purple-500 bg-purple-500/10'
      case 'legendary': return 'border-yellow-500 bg-yellow-500/10'
      default: return 'border-gray-500 bg-gray-500/10'
    }
  }

  useEffect(() => {
    // Auto-save functionality
    if (autoSave) {
      localStorage.setItem('goldium-avatar', JSON.stringify(options))
    }
  }, [options, autoSave])

  useEffect(() => {
    // Load saved avatar on mount
    const saved = localStorage.getItem('goldium-avatar')
    if (saved) {
      try {
        setOptions(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load saved avatar')
      }
    }
  }, [])

  return (
    <div className="space-y-8">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-yellow-900/50 to-yellow-800/50 border-yellow-500/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-200">GOLD Coins</p>
                <p className="text-2xl font-bold text-yellow-400">{goldCoins.toLocaleString()}</p>
              </div>
              <Gem className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-blue-500/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">Level</p>
                <p className="text-2xl font-bold text-blue-400">{level}</p>
              </div>
              <Star className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-900/50 to-green-800/50 border-green-500/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-200">Experience</p>
                <p className="text-2xl font-bold text-green-400">{experience}</p>
              </div>
              <Zap className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 border-purple-500/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-200">Favorites</p>
                <p className="text-2xl font-bold text-purple-400">{favoriteAvatars.length}</p>
              </div>
              <Heart className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Panel */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            Avatar Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Sound Effects</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Show Particles</span>
              <Switch checked={showParticles} onCheckedChange={setShowParticles} />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto Save</span>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>
          </div>
          
          <div className="space-y-2">
            <span className="text-sm">Animation Speed: {animationSpeed[0]}x</span>
            <Slider
              value={animationSpeed}
              onValueChange={setAnimationSpeed}
              max={3}
              min={0.5}
              step={0.5}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Avatar Canvas */}
        <div className="order-2 lg:order-1">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="relative">
                <AvatarCanvas options={options} />
                {isAnimating && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-12 w-12 text-yellow-400" />
                    </motion.div>
                  </div>
                )}
                {showParticles && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                        animate={{
                          x: [0, Math.random() * 400],
                          y: [0, Math.random() * 400],
                          opacity: [1, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                        style={{
                          left: Math.random() * 100 + '%',
                          top: Math.random() * 100 + '%',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="order-1 lg:order-2 space-y-6">
          {/* Category Selector */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle>Customize Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <motion.button
                      key={category.key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedCategory === category.key
                          ? 'border-yellow-500 bg-yellow-500/20'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                      onClick={() => {
                        setSelectedCategory(category.key)
                        playSound('click')
                      }}
                    >
                      <Icon className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-xs">{category.name}</span>
                    </motion.button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Options for Selected Category */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const category = categories.find(c => c.key === selectedCategory)
                  const IconComponent = category?.icon || Palette
                  return <IconComponent className="h-5 w-5" />
                })()}
                {categories.find(c => c.key === selectedCategory)?.name} Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {categories.find(c => c.key === selectedCategory)?.options.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: option.unlocked ? 1.05 : 1 }}
                    whileTap={{ scale: option.unlocked ? 0.95 : 1 }}
                    className={`p-3 rounded-lg border text-sm transition-all relative ${
                      options[selectedCategory] === option.value
                        ? 'border-yellow-500 bg-yellow-500/20'
                        : option.unlocked
                        ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        : 'border-gray-800 bg-gray-900/50 opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (option.unlocked) {
                        handleOptionChange(selectedCategory, option.value)
                      } else {
                        toast({
                          title: "Locked Feature",
                          description: `Reach level ${Math.ceil(Math.random() * 5) + level} to unlock this option!`,
                          variant: "destructive"
                        })
                      }
                    }}
                    disabled={!option.unlocked}
                  >
                    {option.label}
                    {!option.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Basic Controls */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle>Basic Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-yellow-600 text-white hover:bg-yellow-900/30"
                  onClick={handleRandomize}
                >
                  <Shuffle className="h-4 w-4" />
                  Randomize
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-yellow-600 text-white hover:bg-yellow-900/30"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>

                <Button
                  className="col-span-2 flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 text-black"
                  onClick={() => {
                    const canvas = document.getElementById('avatar-canvas') as HTMLCanvasElement
                    if (canvas) {
                      const link = document.createElement('a')
                      link.download = 'goldium-avatar.png'
                      link.href = canvas.toDataURL('image/png')
                      link.click()
                      gainExperience(20)
                      playSound('click')
                    }
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download Avatar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Revolutionary Features */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-purple-400" />
            Revolutionary Features
            <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500">
              Interactive
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {revolutionaryFeatures.map((feature) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: feature.unlocked ? 1.05 : 1 }}
                    className={`relative`}
                  >
                    <Card className={`h-full transition-all cursor-pointer ${
                      feature.unlocked 
                        ? `${getRarityColor(feature.rarity)} hover:shadow-lg` 
                        : 'bg-gray-900/30 border-gray-800 opacity-50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            feature.unlocked 
                              ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20' 
                              : 'bg-gray-800/50'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              feature.unlocked ? 'text-purple-400' : 'text-gray-500'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-semibold text-sm ${
                                feature.unlocked ? 'text-white' : 'text-gray-500'
                              }`}>
                                {feature.name}
                              </h3>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getRarityColor(feature.rarity)}`}
                              >
                                {feature.rarity}
                              </Badge>
                            </div>
                            <p className={`text-xs mb-3 ${
                              feature.unlocked ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {feature.description}
                            </p>
                            {feature.cost && (
                              <div className="flex items-center gap-1 mb-3">
                                <Gem className="h-3 w-3 text-yellow-400" />
                                <span className="text-xs text-yellow-400">{feature.cost}</span>
                              </div>
                            )}
                            <Button
                              size="sm"
                              className={`w-full text-xs ${
                                feature.unlocked
                                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                                  : 'bg-gray-700 cursor-not-allowed'
                              }`}
                              onClick={() => {
                                if (feature.unlocked) {
                                  feature.action()
                                } else {
                                  toast({
                                    title: "Feature Locked",
                                    description: "Level up to unlock this revolutionary feature!",
                                    variant: "destructive"
                                  })
                                }
                              }}
                              disabled={!feature.unlocked}
                            >
                              {feature.unlocked ? 'Activate' : 'Locked'}
                            </Button>
                          </div>
                        </div>
                        {!feature.unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                            <Shield className="h-8 w-8 text-gray-500" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}