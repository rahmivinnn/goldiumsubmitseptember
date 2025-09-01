'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Wallet, 
  ArrowRight, 
  Coins, 
  TrendingUp, 
  Gift, 
  Users, 
  Zap,
  CheckCircle,
  Star,
  Target,
  Sparkles
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Step {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
  gradient: string
  benefits: string[]
  cta: string
  action: () => void
}

export default function HowItWorksSection() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)

  const steps: Step[] = [
    {
      id: 1,
      title: "Connect Your Wallet",
      description: "Securely connect your Solana wallet to access DeFi features on the GOLDIUM platform.",
      icon: <Wallet className="w-8 h-8" />,
      color: "text-blue-400",
      gradient: "from-blue-400 to-cyan-500",
      benefits: [
        "Support for Phantom, Solflare, and other Solana wallets",
        "Secure connection with industry-standard encryption",
        "Non-custodial - you control your keys"
      ],
      cta: "Connect Wallet",
      action: () => router.push('/defi')
    },
    {
      id: 2,
      title: "Acquire GOLDIUM Tokens",
      description: "Purchase GOLDIUM tokens through verified DEXs or swap your existing Solana tokens.",
      icon: <Coins className="w-8 h-8" />,
      color: "text-purple-400",
      gradient: "from-purple-400 to-pink-500",
      benefits: [
        "Trade on Raydium and other verified DEXs",
        "Swap directly from SOL or USDC",
        "Transparent pricing with no hidden fees"
      ],
      cta: "Get GOLDIUM",
      action: () => router.push('/defi?tab=swap')
    },
    {
      id: 3,
      title: "Stake for DeFi Rewards",
      description: "Participate in DeFi staking to earn yield while supporting network security.",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "text-yellow-400",
      gradient: "from-yellow-400 to-orange-500",
      benefits: [
        "Transparent staking rewards from protocol fees",
        "Flexible staking periods (7, 30, 90 days)",
        "Compound your rewards automatically"
      ],
      cta: "Start Staking",
      action: () => router.push('/defi?tab=stake')
    }
  ]



  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Simple Process
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              How DeFi
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Works on Solana
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Learn how to participate in decentralized finance with GOLDIUM in 3 simple steps.
          </p>
        </motion.div>

        {/* Steps Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4 p-2 bg-black/50 rounded-full border border-gray-700">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.button
                  onClick={() => setActiveStep(step.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeStep === step.id
                      ? `bg-gradient-to-r ${step.gradient} text-white`
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="font-bold">{step.id}</span>
                </motion.button>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-600 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Step Content */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-16"
        >
          {steps.map((step) => (
            activeStep === step.id && (
              <Card key={step.id} className={`bg-gradient-to-br ${step.gradient}/10 border-${step.color.split('-')[1]}-500/30`}>
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${step.gradient} ${step.color}`}>
                          {step.icon}
                        </div>
                        <div>
                          <Badge className={`bg-${step.color.split('-')[1]}-500/20 text-${step.color.split('-')[1]}-400 border-${step.color.split('-')[1]}-500/30 mb-2`}>
                            Step {step.id}
                          </Badge>
                          <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-lg mb-6">
                        {step.description}
                      </p>
                      
                      <div className="space-y-3 mb-8">
                        {step.benefits.map((benefit, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <CheckCircle className={`w-5 h-5 ${step.color}`} />
                            <span className="text-gray-300">{benefit}</span>
                          </motion.div>
                        ))}
                      </div>
                      
                      <Button
                        onClick={step.action}
                        className={`bg-gradient-to-r ${step.gradient} hover:opacity-90 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105`}
                      >
                        {step.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                    
                    <div className="relative">
                      {/* Visual representation based on step */}
                      {step.id === 1 && (
                        <div className="relative">
                          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 border border-blue-500/30">
                            <div className="text-center">
                              <Wallet className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                              <div className="bg-black/50 rounded-lg p-4 mb-4">
                                <p className="text-xs text-gray-400 mb-2">Wallet Security</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-green-400 font-semibold text-sm">
                                    Non-custodial & Secure
                                  </span>
                                </div>
                              </div>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Your Keys, Your Crypto
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {step.id === 2 && (
                        <div className="relative">
                          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-500/30">
                            <div className="text-center">
                              <Coins className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-black/50 rounded-lg p-3">
                                  <p className="text-xs text-gray-400">Token Price</p>
                                  <p className="text-purple-400 font-bold">$0.0024</p>
                                </div>
                                <div className="bg-black/50 rounded-lg p-3">
                                  <p className="text-xs text-gray-400">Liquidity</p>
                                  <p className="text-green-400 font-bold">$2.4M</p>
                                </div>
                              </div>
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Verified on Solscan
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {step.id === 3 && (
                        <div className="relative">
                          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-8 border border-yellow-500/30">
                            <div className="text-center">
                              <TrendingUp className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                              <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between bg-black/50 rounded-lg p-3">
                                  <span className="text-gray-300">Staking APY</span>
                                  <span className="text-yellow-400 font-bold">8.5%</span>
                                </div>
                                <div className="flex items-center justify-between bg-black/50 rounded-lg p-3">
                                  <span className="text-gray-300">Lock Period</span>
                                  <span className="text-green-400 font-bold">Flexible</span>
                                </div>
                              </div>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Audited Smart Contract
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h4 className="text-xl font-bold text-green-400 mb-2">Secure & Audited</h4>
              <p className="text-gray-400">Smart contracts verified by security experts</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h4 className="text-xl font-bold text-yellow-400 mb-2">Fast & Cheap</h4>
              <p className="text-gray-400">Low fees on Solana blockchain</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h4 className="text-xl font-bold text-purple-400 mb-2">Transparent</h4>
              <p className="text-gray-400">All transactions verifiable on-chain</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}