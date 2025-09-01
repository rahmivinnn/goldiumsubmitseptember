'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Crown,
  Sparkles,
  Star
} from 'lucide-react'
import PageLayout from '@/components/PageLayout'
import AdvancedNFTMarketplace from '@/components/nft/AdvancedNFTMarketplace'
import EggNFTGallery from '@/components/nft/EggNFTGallery'

export default function MarketplacePage() {
  const [activeCollection, setActiveCollection] = useState<'advanced' | 'eggs'>('eggs')

  return (
    <PageLayout>
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">NFT Marketplace</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover, collect, and trade unique digital assets including magical egg creatures
          </p>
        </div>

        {/* Collection Selector */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 border border-gray-700">
              <Button
                variant={activeCollection === 'eggs' ? 'default' : 'ghost'}
                onClick={() => setActiveCollection('eggs')}
                className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeCollection === 'eggs'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Crown className="w-5 h-5 mr-2" />
                Magical Egg Collection
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant={activeCollection === 'advanced' ? 'default' : 'ghost'}
                onClick={() => setActiveCollection('advanced')}
                className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeCollection === 'advanced'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Star className="w-5 h-5 mr-2" />
                Advanced Collection
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Collection Content */}
        <motion.div
          key={activeCollection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeCollection === 'eggs' ? (
            <EggNFTGallery />
          ) : (
            <AdvancedNFTMarketplace />
          )}
        </motion.div>
      </div>
    </PageLayout>
  )
}