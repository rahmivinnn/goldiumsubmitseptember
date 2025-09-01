"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Activity, Zap, Target, Settings, Bell } from "lucide-react"
import PageLayout from "@/components/PageLayout"
import RealTimeMarketData from "@/components/market/RealTimeMarketData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletBalance } from "@/hooks/useWalletBalance"

export default function DashboardPage() {
  const { connected, publicKey } = useWallet()
  const { balances, isLoading } = useWalletBalance()
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')

  const stats = [
    {
      title: "Total Portfolio Value",
      value: "$12,847.32",
      change: "+2.34%",
      icon: DollarSign,
      color: "text-green-400",
      trend: "up"
    },
    {
      title: "Active Positions",
      value: "8",
      change: "+1",
      icon: Activity,
      color: "text-blue-400",
      trend: "up"
    },
    {
      title: "24h P&L",
      value: "+$234.56",
      change: "+1.89%",
      icon: TrendingUp,
      color: "text-green-400",
      trend: "up"
    },
    {
      title: "Total Trades",
      value: "156",
      change: "+12",
      icon: BarChart3,
      color: "text-purple-400",
      trend: "up"
    }
  ]

  const recentTrades = [
    { pair: "SOL/GOLD", type: "BUY", amount: "5.67 SOL", price: "$185.50", time: "2 min ago", profit: "+$23.45", status: "completed" },
    { pair: "SOL/GOLD", type: "SELL", amount: "234.56 GOLD", price: "$0.742", time: "15 min ago", profit: "-$12.34", status: "completed" },
    { pair: "SOL/GOLD", type: "BUY", amount: "2.34 SOL", price: "$185.50", time: "1 hour ago", profit: "+$45.67", status: "completed" },
    { pair: "SOL/GOLD", type: "SWAP", amount: "1250 GOLD", price: "$0.742", time: "2 hours ago", profit: "+$125.50", status: "completed" }
  ]

  const portfolioAllocation = [
    { asset: "SOL", percentage: 0.4, value: "$0.74", amount: "0.004 SOL" },
    { asset: "GOLD", percentage: 99.6, value: "$742.00", amount: "1,000 GOLD" }
  ]

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Dashboard
            </span>
          </h1>
          <p className="text-lg text-gray-300">
            Monitor your portfolio and track your DeFi activities
          </p>
        </div>

        {!connected ? (
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Connect Your Wallet</h3>
              <p className="text-gray-400 mb-4">
                Connect your wallet to view your dashboard and portfolio information
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                        <Icon className="h-8 w-8 text-yellow-400" />
                      </div>
                      <div className="mt-4">
                        <span className={`text-sm ${
                          stat.change.startsWith('+') ? 'text-green-400' :
                          stat.change.startsWith('-') ? 'text-red-400' :
                          'text-gray-400'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-400 ml-1">from last week</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="positions">Positions</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-yellow-400">Portfolio Overview</CardTitle>
                      <CardDescription>Your current holdings and performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">SOL Balance</span>
                          <span className="text-white font-semibold">{balances.SOL || 0} SOL</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">GOLD Balance</span>
                          <span className="text-white font-semibold">{balances.GOLD || 0} GOLD</span>
                        </div>
                        <div className="border-t border-gray-700 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Total Value</span>
                            <span className="text-yellow-400 font-bold">$0.00</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-yellow-400">Recent Activity</CardTitle>
                      <CardDescription>Your latest transactions and activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No recent activity</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Start trading to see your activity here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="positions" className="mt-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-yellow-400">Active Positions</CardTitle>
                    <CardDescription>Your current DeFi positions and investments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <TrendingUp className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">No Active Positions</h3>
                      <p className="text-gray-400 mb-4">
                        You don't have any active positions yet
                      </p>
                      <p className="text-sm text-gray-500">
                        Start by providing liquidity or staking tokens
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-yellow-400">Transaction History</CardTitle>
                    <CardDescription>All your past transactions and activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Activity className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">No Transaction History</h3>
                      <p className="text-gray-400 mb-4">
                        Your transaction history will appear here
                      </p>
                      <p className="text-sm text-gray-500">
                        Make your first transaction to get started
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-yellow-400">Portfolio Analytics</CardTitle>
                    <CardDescription>Detailed analytics and performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <TrendingUp className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">Analytics Coming Soon</h3>
                      <p className="text-gray-400 mb-4">
                        Detailed portfolio analytics will be available soon
                      </p>
                      <p className="text-sm text-gray-500">
                        Track your performance, gains, and losses
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </PageLayout>
  )
}