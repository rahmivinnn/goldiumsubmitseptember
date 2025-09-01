'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Crown,
  Sparkles,
  Star
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import NFTGallery from '@/components/NFTGallery'
import EggNFTGallery from '@/components/nft/EggNFTGallery'

export default function NFTPage() {
  const [activeCollection, setActiveCollection] = useState<'original' | 'eggs'>('eggs')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <div className="pt-20">
        {/* Collection Selector */}
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700">
              <div className="flex gap-2">
                <Button
                  onClick={() => setActiveCollection('eggs')}
                  variant={activeCollection === 'eggs' ? 'default' : 'ghost'}
                  className={`flex items-center gap-2 ${activeCollection === 'eggs' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'text-gray-400 hover:text-white'}`}
                >
                  <Crown className="w-4 h-4" />
                  Magical Eggs Collection
                  <Sparkles className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setActiveCollection('original')}
                  variant={activeCollection === 'original' ? 'default' : 'ghost'}
                  className={`flex items-center gap-2 ${activeCollection === 'original' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'text-gray-400 hover:text-white'}`}
                >
                  <Star className="w-4 h-4" />
                  Original Collection
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Collection Content */}
        {activeCollection === 'eggs' ? (
          <EggNFTGallery />
        ) : (
          <div className="max-w-7xl mx-auto px-6">
            <NFTGallery />
          </div>
        )}
      </div>
    </div>
  )
}
