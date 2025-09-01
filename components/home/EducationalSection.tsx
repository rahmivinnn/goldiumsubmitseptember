'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Code, 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  Coins, 
  Award, 
  Target,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Info,
  Globe,
  Lock,
  Cpu,
  Database
} from 'lucide-react'

interface EducationalCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  gradient: string
  topics: string[]
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
}

interface TechFeature {
  title: string
  description: string
  icon: React.ReactNode
  benefits: string[]
}

export default function EducationalSection() {
  const [activeTab, setActiveTab] = useState('defi')

  const educationalCards: EducationalCard[] = [
    {
      id: 'defi-basics',
      title: 'DeFi Fundamentals',
      description: 'Learn the core concepts of Decentralized Finance and how it revolutionizes traditional banking.',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'text-blue-400',
      gradient: 'from-blue-400 to-cyan-500',
      topics: ['Smart Contracts', 'Liquidity Pools', 'Yield Farming', 'Automated Market Makers'],
      difficulty: 'Beginner'
    },
    {
      id: 'solana-tech',
      title: 'Solana Blockchain',
      description: 'Understand Solana\'s high-performance blockchain architecture and its advantages.',
      icon: <Cpu className="w-6 h-6" />,
      color: 'text-purple-400',
      gradient: 'from-purple-400 to-pink-500',
      topics: ['Proof of History', 'Tower BFT', 'Turbine', 'Gulf Stream'],
      difficulty: 'Intermediate'
    },
    {
      id: 'staking-guide',
      title: 'Staking Mechanisms',
      description: 'Deep dive into staking protocols, rewards calculation, and risk management.',
      icon: <Shield className="w-6 h-6" />,
      color: 'text-green-400',
      gradient: 'from-green-400 to-emerald-500',
      topics: ['Validator Selection', 'Slashing Conditions', 'Reward Distribution', 'Delegation'],
      difficulty: 'Intermediate'
    },
    {
      id: 'tokenomics',
      title: 'Token Economics',
      description: 'Analyze token distribution, utility, and economic models in DeFi protocols.',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-yellow-400',
      gradient: 'from-yellow-400 to-orange-500',
      topics: ['Supply Mechanics', 'Utility Functions', 'Governance Rights', 'Value Accrual'],
      difficulty: 'Advanced'
    }
  ]

  const techFeatures: TechFeature[] = [
    {
      title: 'High Performance',
      description: 'Solana processes 65,000+ transactions per second with sub-second finality.',
      icon: <Zap className="w-5 h-5" />,
      benefits: ['Fast transactions', 'Low fees', 'Scalable infrastructure']
    },
    {
      title: 'Security First',
      description: 'Built with cryptographic security and decentralized validator network.',
      icon: <Lock className="w-5 h-5" />,
      benefits: ['Cryptographic proofs', 'Decentralized consensus', 'Audited smart contracts']
    },
    {
      title: 'Developer Friendly',
      description: 'Comprehensive tools and documentation for building DeFi applications.',
      icon: <Code className="w-5 h-5" />,
      benefits: ['Rich ecosystem', 'Open source', 'Active community']
    },
    {
      title: 'Interoperability',
      description: 'Seamless integration with other blockchains and DeFi protocols.',
      icon: <Globe className="w-5 h-5" />,
      benefits: ['Cross-chain bridges', 'Multi-protocol support', 'Composable DeFi']
    }
  ]

  const CONTRACT_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump'
  const SOLSCAN_URL = `https://solscan.io/token/${CONTRACT_ADDRESS}`

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
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
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Educational Hub</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Learn <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">DeFi Technology</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Understand the technology behind decentralized finance, blockchain infrastructure, 
            and how GOLDIUM token operates within the Solana ecosystem.
          </motion.p>
        </div>

        {/* Contract Verification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-green-400">Verified Contract</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-300 mb-4">
                    GOLDIUM token is deployed on Solana mainnet with full transparency. 
                    Verify the contract details on Solscan.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Contract Address:</span>
                    </div>
                    <div className="font-mono text-sm bg-slate-800/50 p-3 rounded border break-all">
                      {CONTRACT_ADDRESS}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <Button
                    onClick={() => window.open(SOLSCAN_URL, '_blank')}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Solscan
                  </Button>
                  
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Verify token details, holders, and transactions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Educational Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {educationalCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="h-full bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${card.gradient}/20`}>
                      <div className={card.color}>
                        {card.icon}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {card.difficulty}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-300 mb-4">{card.description}</p>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Topics Covered:</p>
                    <div className="space-y-1">
                      {card.topics.map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          <span className="text-xs text-gray-300">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Technology Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              Why <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">Solana</span>?
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Solana provides the high-performance infrastructure needed for modern DeFi applications.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full bg-slate-800/30 border-slate-700/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <div className="text-purple-400">
                          {feature.icon}
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-300 mb-4">{feature.description}</p>
                    
                    <div className="space-y-1">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-gray-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Explore DeFi?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Start your journey into decentralized finance with GOLDIUM. 
                Experience staking, swapping, and earning in a transparent, secure environment.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  onClick={() => window.open('/defi', '_self')}
                >
                  <Coins className="w-5 h-5 mr-2" />
                  Explore DeFi Features
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  onClick={() => window.open('https://docs.solana.com', '_blank')}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}