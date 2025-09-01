'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  TrendingUp, 
  Star, 
  Clock, 
  Shuffle,
  SortAsc,
  SortDesc,
  Sparkles,
  Crown,
  Zap
} from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useToast } from '@/components/ui/use-toast'
import EggNFTCard from './EggNFTCard'

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
}

type SortOption = 'price-asc' | 'price-desc' | 'rarity' | 'level' | 'likes' | 'recent'
type ViewMode = 'grid' | 'list'
type FilterTab = 'all' | 'hatching' | 'rare' | 'owned'

const generateMockEggNFTs = (): EggNFT[] => {
  const rarities: EggNFT['rarity'][] = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic']
  const colors = ['Golden', 'Silver', 'Crystal', 'Rainbow', 'Shadow', 'Fire', 'Ice', 'Nature']
  const patterns = ['Spotted', 'Striped', 'Swirled', 'Cracked', 'Smooth', 'Textured']
  const sizes = ['Small', 'Medium', 'Large', 'Giant']
  const glows = ['None', 'Soft', 'Bright', 'Pulsing', 'Ethereal']
  const abilities = ['Fire Breath', 'Ice Shield', 'Lightning Strike', 'Healing Aura', 'Time Warp', 'Shadow Clone', 'Crystal Armor', 'Wind Dash']
  const collections = ['Genesis Eggs', 'Mystic Eggs', 'Dragon Eggs', 'Phoenix Eggs', 'Cosmic Eggs']
  const creators = ['EggMaster', 'DragonBreeder', 'MysticCrafter', 'CosmicArtist', 'LegendarySmith']

  return Array.from({ length: 24 }, (_, i) => {
    const rarity = rarities[Math.floor(Math.random() * rarities.length)]
    const isHatching = Math.random() > 0.7
    const level = Math.floor(Math.random() * 50) + 1
    const maxExp = level * 100
    const experience = Math.floor(Math.random() * maxExp)
    
    return {
      id: `egg-${i + 1}`,
      name: `${colors[Math.floor(Math.random() * colors.length)]} Egg #${i + 1}`,
      rarity,
      level,
      experience,
      maxExperience: maxExp,
      hatchProgress: isHatching ? Math.floor(Math.random() * 100) : 0,
      price: Math.floor(Math.random() * 1000) + 50,
      lastSale: Math.floor(Math.random() * 800) + 30,
      volume24h: Math.floor(Math.random() * 5000) + 100,
      owners: Math.floor(Math.random() * 100) + 1,
      likes: Math.floor(Math.random() * 500) + 10,
      views: Math.floor(Math.random() * 2000) + 50,
      traits: {
        color: colors[Math.floor(Math.random() * colors.length)],
        pattern: patterns[Math.floor(Math.random() * patterns.length)],
        size: sizes[Math.floor(Math.random() * sizes.length)],
        glow: glows[Math.floor(Math.random() * glows.length)],
        special: Math.random() > 0.7 ? 'Enchanted' : undefined
      },
      abilities: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
        abilities[Math.floor(Math.random() * abilities.length)]
      ),
      isHatching,
      timeToHatch: isHatching ? Math.floor(Math.random() * 86400) : 0,
      creator: creators[Math.floor(Math.random() * creators.length)],
      collection: collections[Math.floor(Math.random() * collections.length)]
    }
  })
}

export default function EggNFTGallery() {
  const { connected } = useWallet()
  const { toast } = useToast()
  const [nfts, setNfts] = useState<EggNFT[]>([])
  const [filteredNfts, setFilteredNfts] = useState<EggNFT[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRarity, setSelectedRarity] = useState<string>('all')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  // Initialize NFTs
  useEffect(() => {
    const loadNFTs = async () => {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      const mockNFTs = generateMockEggNFTs()
      setNfts(mockNFTs)
      setFilteredNfts(mockNFTs)
      setIsLoading(false)
    }
    loadNFTs()
  }, [])

  // Filter and sort NFTs
  useEffect(() => {
    let filtered = [...nfts]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(nft => 
        nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.creator.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Tab filter
    switch (activeTab) {
      case 'hatching':
        filtered = filtered.filter(nft => nft.isHatching)
        break
      case 'rare':
        filtered = filtered.filter(nft => ['Epic', 'Legendary', 'Mythic'].includes(nft.rarity))
        break
      case 'owned':
        // In a real app, this would filter by user's owned NFTs
        filtered = filtered.filter(nft => Math.random() > 0.7)
        break
    }

    // Rarity filter
    if (selectedRarity !== 'all') {
      filtered = filtered.filter(nft => nft.rarity === selectedRarity)
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(nft => nft.price >= parseInt(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter(nft => nft.price <= parseInt(priceRange.max))
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rarity':
        const rarityOrder = { 'Common': 1, 'Rare': 2, 'Epic': 3, 'Legendary': 4, 'Mythic': 5 }
        filtered.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity])
        break
      case 'level':
        filtered.sort((a, b) => b.level - a.level)
        break
      case 'likes':
        filtered.sort((a, b) => b.likes - a.likes)
        break
      case 'recent':
      default:
        // Keep original order for recent
        break
    }

    setFilteredNfts(filtered)
  }, [nfts, searchQuery, sortBy, activeTab, selectedRarity, priceRange])

  const handlePurchase = (nft: EggNFT) => {
    toast({
      title: "Purchase Initiated",
      description: `Attempting to purchase ${nft.name} for ${nft.price} GOLD`,
    })
    // In a real app, this would initiate the blockchain transaction using GOLD token
  }

  const handleLike = (nft: EggNFT) => {
    setNfts(prev => prev.map(n => 
      n.id === nft.id ? { ...n, likes: n.likes + 1 } : n
    ))
  }

  const handleShare = (nft: EggNFT) => {
    toast({
      title: "Shared!",
      description: `${nft.name} link copied to clipboard`,
    })
  }

  const shuffleNFTs = () => {
    const shuffled = [...filteredNfts].sort(() => Math.random() - 0.5)
    setFilteredNfts(shuffled)
    toast({
      title: "Collection Shuffled!",
      description: "Discover new eggs in a fresh order",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <Sparkles className="w-full h-full text-yellow-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading Egg Collection...</h2>
            <p className="text-gray-400">Discovering magical eggs from across the realm</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Crown className="w-8 h-8 text-yellow-400" />
            Magical Egg Collection
            <Crown className="w-8 h-8 text-yellow-400" />
          </h1>
          <p className="text-gray-400 text-lg">Discover, collect, and hatch legendary creatures</p>
        </motion.div>

        {/* Filters and Controls */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardContent className="p-6">
            {/* Search and View Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search eggs, collections, or creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rarity">Rarity</SelectItem>
                    <SelectItem value="level">Level</SelectItem>
                    <SelectItem value="likes">Most Liked</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  onClick={shuffleNFTs}
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400"
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
                
                <div className="flex border border-gray-600 rounded-md">
                  <Button
                    onClick={() => setViewMode('grid')}
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setViewMode('list')}
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <Tabs value={activeTab} onValueChange={(value: FilterTab) => setActiveTab(value)} className="mb-4">
              <TabsList className="grid w-full grid-cols-4 bg-gray-700">
                <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
                  All Eggs ({nfts.length})
                </TabsTrigger>
                <TabsTrigger value="hatching" className="data-[state=active]:bg-yellow-600">
                  <Clock className="w-4 h-4 mr-1" />
                  Hatching
                </TabsTrigger>
                <TabsTrigger value="rare" className="data-[state=active]:bg-pink-600">
                  <Star className="w-4 h-4 mr-1" />
                  Rare+
                </TabsTrigger>
                <TabsTrigger value="owned" className="data-[state=active]:bg-green-600">
                  My Collection
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Advanced Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Rarity" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Rarities</SelectItem>
                  <SelectItem value="Common">Common</SelectItem>
                  <SelectItem value="Rare">Rare</SelectItem>
                  <SelectItem value="Epic">Epic</SelectItem>
                  <SelectItem value="Legendary">Legendary</SelectItem>
                  <SelectItem value="Mythic">Mythic</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Min Price"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-24 bg-gray-700 border-gray-600 text-white"
                  type="number"
                />
                <span className="text-gray-400">-</span>
                <Input
                  placeholder="Max Price"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-24 bg-gray-700 border-gray-600 text-white"
                  type="number"
                />
                <span className="text-gray-400 text-sm">GOLD</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400">
            Showing {filteredNfts.length} of {nfts.length} eggs
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>Floor: 45 GOLD</span>
            <span>•</span>
            <span>Volume: 12.5K GOLD</span>
          </div>
        </div>

        {/* NFT Grid */}
        <AnimatePresence mode="wait">
          {filteredNfts.length > 0 ? (
            <motion.div
              key={`${viewMode}-${activeTab}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }
            >
              {filteredNfts.map((nft, index) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <EggNFTCard
                    nft={nft}
                    onPurchase={handlePurchase}
                    onLike={handleLike}
                    onShare={handleShare}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-4 text-gray-600">
                <Search className="w-full h-full" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No eggs found</h3>
              <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedRarity('all')
                  setPriceRange({ min: '', max: '' })
                  setActiveTab('all')
                }}
                variant="outline"
                className="border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}