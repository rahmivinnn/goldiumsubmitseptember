"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, BarChart3, Activity, Target, Zap, Bell, Settings } from "lucide-react"
import PageLayout from "@/components/PageLayout"
import AdvancedTradingInterface from "@/components/trading/AdvancedTradingInterface"
import LiveTradingSignals from "@/components/trading/LiveTradingSignals"
import PumpFunInterface from "@/components/trading/PumpFunInterface"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
}

export default function TradingPage() {
  const [selectedPair, setSelectedPair] = useState('SOL/GOLD')
  const [watchlist, setWatchlist] = useState<string[]>(['SOL/GOLD'])
  const [activeTab, setActiveTab] = useState('pump')

  const marketData: MarketData[] = [
    {
      symbol: 'SOL/GOLD',
      price: 250.13,
      change: 12.45,
      changePercent: 5.24,
      volume: 125000000,
      marketCap: 850000000
    }
  ]

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString()}`
    }
    return `$${price.toFixed(2)}`
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`
    }
    return `$${(volume / 1000).toFixed(0)}K`
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(1)}B`
    }
    return `$${(marketCap / 1000000).toFixed(0)}M`
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Header */}
        <motion.div
          className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 p-6 mt-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                    Professional Trading Hub
                  </span>
                </h1>
                <p className="text-gray-400">
                  Advanced trading tools, real-time signals, and market analysis
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" className="border-gray-600 text-gray-300">
                  <Bell className="h-4 w-4 mr-2" />
                  Alerts
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="container mx-auto p-6 pt-12">
          {/* Quick Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {[
              { label: "Total Portfolio", value: "$5,288.65", change: "+6.2%", icon: Target },
              { label: "24h P&L", value: "+$312.45", change: "+6.28%", icon: TrendingUp },
              { label: "Active Positions", value: "2", change: "SOL+GOLD", icon: Activity },
              { label: "Win Rate", value: "85.2%", change: "+4.3%", icon: BarChart3 }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-gray-900/90 border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className={`text-sm ${
                          stat.change.startsWith('+') ? 'text-green-400' : 
                          stat.change.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {stat.change}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-800 text-yellow-400">
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gray-800 border border-gray-700">
              <TabsTrigger value="pump" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                🥇 Pump Style
              </TabsTrigger>
              <TabsTrigger value="trading" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                <BarChart3 className="h-4 w-4 mr-2" />
                Advanced Trading
              </TabsTrigger>
              <TabsTrigger value="signals" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                <Zap className="h-4 w-4 mr-2" />
                Live Signals
              </TabsTrigger>
              <TabsTrigger value="markets" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                <TrendingUp className="h-4 w-4 mr-2" />
                Markets
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                <Target className="h-4 w-4 mr-2" />
                Portfolio
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pump" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <PumpFunInterface />
              </motion.div>
            </TabsContent>

            <TabsContent value="trading" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <AdvancedTradingInterface />
              </motion.div>
            </TabsContent>

            <TabsContent value="signals" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <LiveTradingSignals />
              </motion.div>
            </TabsContent>

            <TabsContent value="markets" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-gray-900/90 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Market Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Pair</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-medium">Price</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-medium">24h Change</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-medium">24h Volume</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-medium">Market Cap</th>
                            <th className="text-center py-3 px-4 text-gray-400 font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marketData.map((market) => (
                            <motion.tr
                              key={market.symbol}
                              className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
                              whileHover={{ scale: 1.01 }}
                              onClick={() => setSelectedPair(market.symbol)}
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                                    {market.symbol.split('/')[0].charAt(0)}
                                  </div>
                                  <div>
                                    <div className="text-white font-semibold">{market.symbol}</div>
                                    <div className="text-gray-400 text-sm">{market.symbol.split('/')[0]}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="text-white font-semibold">{formatPrice(market.price)}</div>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className={`flex items-center justify-end gap-1 ${
                                  market.change >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {market.change >= 0 ? (
                                    <TrendingUp className="h-4 w-4" />
                                  ) : (
                                    <TrendingUp className="h-4 w-4 rotate-180" />
                                  )}
                                  <span className="font-semibold">
                                    {market.change >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
                                  </span>
                                </div>
                                <div className="text-gray-400 text-sm">
                                  {market.change >= 0 ? '+' : ''}{formatPrice(Math.abs(market.change))}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="text-white font-semibold">{formatVolume(market.volume)}</div>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="text-white font-semibold">{formatMarketCap(market.marketCap)}</div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-600 hover:to-orange-600"
                                >
                                  <Zap className="h-4 w-4 mr-1" />
                                  Trade
                                </Button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Portfolio Summary */}
                <Card className="bg-gray-900/90 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Portfolio Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-3xl font-bold text-white">$5,288.65</div>
                        <div className="flex items-center gap-2 text-green-400">
                          <TrendingUp className="h-4 w-4" />
                          <span className="font-semibold">+$312.45 (6.28%)</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">SOL Holdings</span>
                          <span className="text-white font-semibold">$4,546.65</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">GOLD Holdings</span>
                          <span className="text-white font-semibold">$742.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total P&L</span>
                          <span className="text-green-400 font-semibold">+$374.00</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Holdings */}
                <Card className="bg-gray-900/90 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Holdings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { symbol: 'SOL', amount: 25.5, value: 4546.65, change: 4.95 },
                        { symbol: 'GOLD', amount: 1000, value: 742.00, change: 6.45 }
                      ].map((holding) => (
                        <div key={holding.symbol} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                              {holding.symbol.charAt(0)}
                            </div>
                            <div>
                              <div className="text-white font-semibold">{holding.symbol}</div>
                              <div className="text-gray-400 text-sm">{holding.amount.toFixed(2)}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold">${holding.value.toFixed(2)}</div>
                            <div className={`text-sm ${
                              holding.change >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {holding.change >= 0 ? '+' : ''}{holding.change.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-gray-900/90 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { type: 'buy', symbol: 'SOL', amount: 5.67, price: 156.42, time: '2 min ago' },
                        { type: 'sell', symbol: 'GOLD', amount: 234.56, price: 1.85, time: '15 min ago' },
                        { type: 'buy', symbol: 'SOL', amount: 2.34, price: 154.78, time: '1 hour ago' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.type === 'buy' ? 'bg-green-400' : 'bg-red-400'
                            }`} />
                            <div>
                              <div className="text-white font-semibold">
                                {activity.type.toUpperCase()} {activity.symbol}
                              </div>
                              <div className="text-gray-400 text-sm">{activity.time}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold">{activity.amount}</div>
                            <div className="text-gray-400 text-sm">@${activity.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  )
}