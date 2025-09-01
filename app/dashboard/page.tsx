"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Activity, Zap, Target, Settings, Bell } from "lucide-react"
import PageLayout from "@/components/PageLayout"
import RealTimeMarketData from "@/components/market/RealTimeMarketData"
import SolanaDashboard from "@/components/SolanaDashboard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Monitor your portfolio and track your DeFi activities</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        {stat.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                        )}
                        <span className={`text-sm ${stat.color}`}>{stat.change}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg bg-gray-800 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="solana">Solana DeFi</TabsTrigger>
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
          
          <TabsContent value="solana" className="mt-6">
            <SolanaDashboard wallet={publicKey ? { publicKey } : null} />
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
      </div>
    </PageLayout>
  )
}
