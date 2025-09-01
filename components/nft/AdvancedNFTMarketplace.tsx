'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Heart,
  Share2,
  Filter,
  Search,
  Grid3X3,
  List,
  Star,
  Crown,
  Flame,
  Diamond,
  Clock,
  Users,
  Activity,
  ExternalLink,
  Copy,
  ShoppingCart,
  Gavel,
  Timer,
  Award,
  Sparkles,
  Image as ImageIcon,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

interface NFTCollection {
  id: string
  name: string
  symbol: string
  contractAddress: string
  blockchain: string
  floorPrice: number
  floorChange24h: number
  volume24h: number
  volumeChange24h: number
  totalSupply: number
  owners: number
  verified: boolean
  description: string
  website?: string
  twitter?: string
  discord?: string
}

interface NFTItem {
  id: string
  tokenId: string
  collectionId: string
  name: string
  description: string
  image: string
  animationUrl?: string
  price: number
  currency: string
  seller: string
  rarity: number
  rarityRank: number
  traits: { trait_type: string; value: string; rarity: number }[]
  lastSale?: number
  listingTime: number
  auctionEndTime?: number
  highestBid?: number
  bidCount: number
  views: number
  likes: number
  isAuction: boolean
  isVideo: boolean
  isAudio: boolean
}

const NFT_COLLECTIONS: NFTCollection[] = [
  {
    id: 'bayc',
    name: 'Bored Ape Yacht Club',
    symbol: 'BAYC',
    contractAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    blockchain: 'Ethereum',
    floorPrice: 23.5,
    floorChange24h: -2.3,
    volume24h: 1247.8,
    volumeChange24h: 15.7,
    totalSupply: 10000,
    owners: 6420,
    verified: true,
    description: 'A collection of 10,000 unique Bored Ape NFTs'
  },
  {
    id: 'cryptopunks',
    name: 'CryptoPunks',
    symbol: 'PUNKS',
    contractAddress: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
    blockchain: 'Ethereum',
    floorPrice: 67.2,
    floorChange24h: 5.8,
    volume24h: 892.3,
    volumeChange24h: -8.2,
    totalSupply: 10000,
    owners: 3456,
    verified: true,
    description: 'The original NFT collection on Ethereum'
  },
  {
    id: 'azuki',
    name: 'Azuki',
    symbol: 'AZUKI',
    contractAddress: '0xED5AF388653567Af2F388E6224dC7C4b3241C544',
    blockchain: 'Ethereum',
    floorPrice: 8.9,
    floorChange24h: 12.4,
    volume24h: 567.1,
    volumeChange24h: 23.6,
    totalSupply: 10000,
    owners: 5234,
    verified: true,
    description: 'A brand for the metaverse built by Chiru Labs'
  },
  {
    id: 'doodles',
    name: 'Doodles',
    symbol: 'DOODLE',
    contractAddress: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e',
    blockchain: 'Ethereum',
    floorPrice: 4.2,
    floorChange24h: -1.8,
    volume24h: 234.5,
    volumeChange24h: 7.3,
    totalSupply: 10000,
    owners: 4567,
    verified: true,
    description: 'A community-driven collectibles project'
  }
]

const SAMPLE_NFTS: NFTItem[] = [
  {
    id: 'bayc-1',
    tokenId: '1234',
    collectionId: 'bayc',
    name: 'Bored Ape #1234',
    description: 'A rare golden fur ape with laser eyes',
    image: '/placeholder.jpg',
    price: 25.5,
    currency: 'ETH',
    seller: '0x1234...5678',
    rarity: 0.05,
    rarityRank: 47,
    traits: [
      { trait_type: 'Background', value: 'Gold', rarity: 0.02 },
      { trait_type: 'Fur', value: 'Golden', rarity: 0.01 },
      { trait_type: 'Eyes', value: 'Laser Eyes', rarity: 0.03 }
    ],
    lastSale: 22.1,
    listingTime: Date.now() - 86400000,
    bidCount: 12,
    views: 1547,
    likes: 89,
    isAuction: false,
    isVideo: false,
    isAudio: false
  },
  {
    id: 'punk-1',
    tokenId: '7890',
    collectionId: 'cryptopunks',
    name: 'CryptoPunk #7890',
    description: 'Rare alien punk with mohawk',
    image: '/placeholder.jpg',
    price: 0,
    currency: 'ETH',
    seller: '0x9876...5432',
    rarity: 0.001,
    rarityRank: 12,
    traits: [
      { trait_type: 'Type', value: 'Alien', rarity: 0.001 },
      { trait_type: 'Hair', value: 'Mohawk', rarity: 0.02 }
    ],
    listingTime: Date.now() - 3600000,
    auctionEndTime: Date.now() + 7200000,
    highestBid: 71.5,
    bidCount: 28,
    views: 3421,
    likes: 156,
    isAuction: true,
    isVideo: false,
    isAudio: false
  },
  {
    id: 'azuki-1',
    tokenId: '5555',
    collectionId: 'azuki',
    name: 'Azuki #5555',
    description: 'Animated Azuki with special effects',
    image: '/placeholder.jpg',
    animationUrl: '/placeholder-video.mp4',
    price: 9.8,
    currency: 'ETH',
    seller: '0x5555...1111',
    rarity: 0.08,
    rarityRank: 234,
    traits: [
      { trait_type: 'Type', value: 'Human', rarity: 0.6 },
      { trait_type: 'Hair', value: 'Blue', rarity: 0.05 },
      { trait_type: 'Eyes', value: 'Glowing', rarity: 0.02 }
    ],
    lastSale: 8.9,
    listingTime: Date.now() - 1800000,
    bidCount: 5,
    views: 892,
    likes: 34,
    isAuction: false,
    isVideo: true,
    isAudio: false
  }
]

export default function AdvancedNFTMarketplace() {
  const [collections, setCollections] = useState<NFTCollection[]>(NFT_COLLECTIONS)
  const [nfts, setNfts] = useState<NFTItem[]>(SAMPLE_NFTS)
  const [selectedCollection, setSelectedCollection] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'price' | 'rarity' | 'recent'>('recent')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null)
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  useEffect(() => {
    // Simulate real-time floor price updates
    const updateFloorPrices = () => {
      setCollections(prev => 
        prev.map(collection => ({
          ...collection,
          floorPrice: collection.floorPrice * (1 + (Math.random() - 0.5) * 0.02),
          floorChange24h: (Math.random() - 0.5) * 10,
          volume24h: collection.volume24h * (1 + (Math.random() - 0.5) * 0.1),
          volumeChange24h: (Math.random() - 0.5) * 20
        }))
      )
    }

    const interval = setInterval(updateFloorPrices, 10000)
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount: number, currency: string = 'ETH'): string => {
    return `${amount.toFixed(2)} ${currency}`
  }

  const formatTimeLeft = (endTime: number): string => {
    const timeLeft = endTime - Date.now()
    if (timeLeft <= 0) return 'Ended'
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}h ${minutes}m`
  }

  const getRarityColor = (rarity: number): string => {
    if (rarity <= 0.01) return 'text-red-400 border-red-400'
    if (rarity <= 0.05) return 'text-orange-400 border-orange-400'
    if (rarity <= 0.1) return 'text-yellow-400 border-yellow-400'
    return 'text-green-400 border-green-400'
  }

  const getRarityLabel = (rarity: number): string => {
    if (rarity <= 0.01) return 'Legendary'
    if (rarity <= 0.05) return 'Epic'
    if (rarity <= 0.1) return 'Rare'
    return 'Common'
  }

  const handleBuyNow = (nft: NFTItem) => {
    toast({
      title: "Purchase Initiated",
      description: `Buying ${nft.name} for ${formatCurrency(nft.price, nft.currency)}`,
    })
  }

  const handlePlaceBid = (nft: NFTItem) => {
    toast({
      title: "Bid Placed",
      description: `Bid placed on ${nft.name}`,
    })
  }

  const togglePlay = (nftId: string) => {
    setIsPlaying(prev => ({ ...prev, [nftId]: !prev[nftId] }))
  }

  const filteredNFTs = nfts
    .filter(nft => {
      if (selectedCollection !== 'all' && nft.collectionId !== selectedCollection) return false
      if (nft.price < priceRange[0] || nft.price > priceRange[1]) return false
      if (searchQuery && !nft.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price': return b.price - a.price
        case 'rarity': return a.rarity - b.rarity
        case 'recent': return b.listingTime - a.listingTime
        default: return 0
      }
    })

  return (
    <div className="space-y-6">
      {/* Collections Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {collections.map((collection) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedCollection(collection.id)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{collection.name}</h3>
                    {collection.verified && (
                      <Crown className="h-4 w-4 text-blue-400" />
                    )}
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    {collection.blockchain}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Floor:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">
                        {formatCurrency(collection.floorPrice)}
                      </span>
                      {collection.floorChange24h > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Vol:</span>
                    <span className="font-semibold text-blue-400">
                      {formatCurrency(collection.volume24h)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Owners:</span>
                    <span className="font-semibold">
                      {collection.owners.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters and Controls */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search NFTs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 w-64"
                />
              </div>
              
              <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select Collection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Collections</SelectItem>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Listed</SelectItem>
                  <SelectItem value="price">Price: High to Low</SelectItem>
                  <SelectItem value="rarity">Rarity: Rare to Common</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NFT Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        : 'space-y-4'
      }>
        {filteredNFTs.map((nft) => {
          const collection = collections.find(c => c.id === nft.collectionId)
          
          return (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={viewMode === 'list' ? 'w-full' : ''}
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-all duration-300 overflow-hidden group">
                {/* NFT Image/Video */}
                <div className="relative aspect-square overflow-hidden">
                  <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
                    {nft.isVideo ? (
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 z-20 bg-black/50 hover:bg-black/70"
                          onClick={() => togglePlay(nft.id)}
                        >
                          {isPlaying[nft.id] ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <ImageIcon className="h-16 w-16 text-gray-600" />
                      </div>
                    ) : (
                      <ImageIcon className="h-16 w-16 text-gray-600" />
                    )}
                  </div>
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Rarity Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge variant="outline" className={getRarityColor(nft.rarity)}>
                      <Diamond className="h-3 w-3 mr-1" />
                      {getRarityLabel(nft.rarity)}
                    </Badge>
                  </div>
                  
                  {/* Auction Timer */}
                  {nft.isAuction && nft.auctionEndTime && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-red-500/20 text-red-400 border-red-400">
                        <Timer className="h-3 w-3 mr-1" />
                        {formatTimeLeft(nft.auctionEndTime)}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* NFT Info */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">{nft.name}</h3>
                        <span className="text-xs text-gray-400">#{nft.rarityRank}</span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{collection?.name}</p>
                    </div>
                    
                    {/* Price Info */}
                    <div className="space-y-2">
                      {nft.isAuction ? (
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Highest Bid</span>
                            <span className="font-semibold text-green-400">
                              {formatCurrency(nft.highestBid || 0, nft.currency)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">{nft.bidCount} bids</span>
                            <span className="text-xs text-gray-500">
                              Ends {formatTimeLeft(nft.auctionEndTime!)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Price</span>
                            <span className="font-semibold text-blue-400">
                              {formatCurrency(nft.price, nft.currency)}
                            </span>
                          </div>
                          {nft.lastSale && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Last Sale</span>
                              <span className="text-xs text-gray-500">
                                {formatCurrency(nft.lastSale, nft.currency)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Stats */}
                    <div className="flex justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {nft.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {nft.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {nft.rarity.toFixed(3)}%
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {nft.isAuction ? (
                        <Button 
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          onClick={() => handlePlaceBid(nft)}
                        >
                          <Gavel className="h-4 w-4 mr-2" />
                          Place Bid
                        </Button>
                      ) : (
                        <Button 
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => handleBuyNow(nft)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Buy Now
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedNFT(nft)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* NFT Detail Modal */}
      <AnimatePresence>
        {selectedNFT && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNFT(null)}
          >
            <motion.div
              className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* NFT Image */}
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-24 w-24 text-gray-600" />
                  </div>
                  
                  {/* Traits */}
                  <div>
                    <h3 className="font-semibold mb-3">Traits</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedNFT.traits.map((trait, index) => (
                        <div key={index} className="bg-gray-800/50 p-3 rounded-lg">
                          <p className="text-xs text-gray-400">{trait.trait_type}</p>
                          <p className="font-semibold">{trait.value}</p>
                          <p className="text-xs text-blue-400">{(trait.rarity * 100).toFixed(1)}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* NFT Details */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{selectedNFT.name}</h1>
                    <p className="text-gray-400 mb-4">{selectedNFT.description}</p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="outline" className={getRarityColor(selectedNFT.rarity)}>
                        <Diamond className="h-3 w-3 mr-1" />
                        {getRarityLabel(selectedNFT.rarity)}
                      </Badge>
                      <span className="text-sm text-gray-400">
                        Rank #{selectedNFT.rarityRank}
                      </span>
                    </div>
                  </div>
                  
                  {/* Price Section */}
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    {selectedNFT.isAuction ? (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Current Highest Bid</p>
                        <p className="text-3xl font-bold text-green-400 mb-2">
                          {formatCurrency(selectedNFT.highestBid || 0, selectedNFT.currency)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {selectedNFT.bidCount} bids • Ends {formatTimeLeft(selectedNFT.auctionEndTime!)}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Current Price</p>
                        <p className="text-3xl font-bold text-blue-400">
                          {formatCurrency(selectedNFT.price, selectedNFT.currency)}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Contract Info */}
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Contract Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contract Address:</span>
                        <div className="flex items-center gap-2">
                          <code className="text-blue-400">
                            {collections.find(c => c.id === selectedNFT.collectionId)?.contractAddress.slice(0, 10)}...
                          </code>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Token ID:</span>
                        <span>{selectedNFT.tokenId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Blockchain:</span>
                        <span>{collections.find(c => c.id === selectedNFT.collectionId)?.blockchain}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {selectedNFT.isAuction ? (
                      <Button 
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={() => handlePlaceBid(selectedNFT)}
                      >
                        <Gavel className="h-4 w-4 mr-2" />
                        Place Bid
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => handleBuyNow(selectedNFT)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Now
                      </Button>
                    )}
                    <Button variant="outline">
                      <Heart className="h-4 w-4 mr-2" />
                      Like
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}