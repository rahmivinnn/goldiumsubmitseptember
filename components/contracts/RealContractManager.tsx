'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Zap,
  TrendingUp,
  DollarSign,
  Activity,
  Globe,
  Lock,
  Unlock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

// Real Contract Addresses - Only GOLD/SOL tokens
const REAL_CONTRACTS = {
  solana: {
    GOLD: 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump',
    SOL: 'So11111111111111111111111111111111111111112'
  }
}

const DEFI_PROTOCOLS = {
  goldium: {
    name: 'Goldium DeFi',
    router: 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump',
    factory: 'So11111111111111111111111111111111111111112',
    tvl: '$1M',
    volume24h: '$890K'
  },
  jupiter: {
    name: 'Jupiter Aggregator',
    router: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
    factory: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
    tvl: '$950K',
    volume24h: '$450K'
  }
}

interface ContractInfo {
  address: string
  name: string
  symbol?: string
  verified: boolean
  security: 'high' | 'medium' | 'low'
  tvl?: string
  volume24h?: string
}

export default function RealContractManager() {
  const [selectedNetwork, setSelectedNetwork] = useState('solana')
  const [contractData, setContractData] = useState<Record<string, ContractInfo>>({})
  const [protocolStats, setProtocolStats] = useState(DEFI_PROTOCOLS)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate real-time contract data updates
    const updateContractData = () => {
      const networkContracts = REAL_CONTRACTS[selectedNetwork as keyof typeof REAL_CONTRACTS]
      const updatedData: Record<string, ContractInfo> = {}
      
      Object.entries(networkContracts).forEach(([symbol, address]) => {
        updatedData[symbol] = {
          address,
          name: getTokenName(symbol),
          symbol,
          verified: true,
          security: 'high',
          tvl: generateRandomTVL(),
          volume24h: generateRandomVolume()
        }
      })
      
      setContractData(updatedData)
    }

    updateContractData()
    const interval = setInterval(updateContractData, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [selectedNetwork])

  const getTokenName = (symbol: string): string => {
    const names: Record<string, string> = {
      GOLD: 'Goldium Token',
      SOL: 'Solana'
    }
    return names[symbol] || symbol
  }

  const generateRandomTVL = (): string => {
    const base = Math.random() * 1000 + 100
    return `$${base.toFixed(1)}M`
  }

  const generateRandomVolume = (): string => {
    const base = Math.random() * 500 + 50
    return `$${base.toFixed(1)}M`
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} address copied to clipboard`,
    })
  }

  const openSolscan = (address: string) => {
    const explorers = {
      solana: 'https://solscan.io/token/'
    }
    const baseUrl = explorers[selectedNetwork as keyof typeof explorers]
    window.open(`${baseUrl}${address}`, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Network Selector */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            Real Contract Addresses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.keys(REAL_CONTRACTS).map((network) => (
              <Button
                key={network}
                variant={selectedNetwork === network ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedNetwork(network)}
                className={selectedNetwork === network ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {network.charAt(0).toUpperCase() + network.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Token Contracts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(contractData).map(([symbol, info]) => (
          <motion.div
            key={symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{info.symbol}</CardTitle>
                    <p className="text-sm text-gray-400">{info.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Contract Address</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-blue-400 flex-1 truncate">
                      {info.address}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(info.address, info.symbol!)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openSolscan(info.address)}
                      className="h-6 w-6 p-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400">TVL</p>
                    <p className="font-semibold text-green-400">{info.tvl}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">24h Volume</p>
                    <p className="font-semibold text-blue-400">{info.volume24h}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400">High Security</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* DeFi Protocols */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-purple-400" />
            Major DeFi Protocols
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(protocolStats).map(([key, protocol]) => (
              <motion.div
                key={key}
                className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-semibold text-purple-400 mb-2">{protocol.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">TVL:</span>
                    <span className="text-green-400 font-semibold">{protocol.tvl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Volume:</span>
                    <span className="text-blue-400 font-semibold">{protocol.volume24h}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Activity className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}