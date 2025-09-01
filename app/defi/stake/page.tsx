'use client'

import { Suspense } from "react"
import { WalletContextProvider } from "@/components/providers/WalletContextProvider"
import Header from "@/components/Header"
import StakingInterface from "@/components/StakingInterface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function StakePage() {
  return (
    <WalletContextProvider>
      <main className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <div className="max-w-7xl mx-auto w-full px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent mb-2">
              Goldium Staking
            </h1>
            <p className="text-gray-400">
              Stake your GOLD tokens to earn rewards and participate in governance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Staking Interface */}
            <div className="space-y-6">
              <Suspense fallback={
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6 flex justify-center items-center h-64">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-t-transparent border-amber-500 rounded-full animate-spin mb-4"></div>
                      <p className="text-sm text-gray-400">Loading staking interface...</p>
                    </div>
                  </CardContent>
                </Card>
              }>
                <StakingInterface />
              </Suspense>
            </div>

            {/* Staking Information */}
            <div className="space-y-6">
              {/* Benefits Card */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-amber-400">Staking Benefits</CardTitle>
                  <CardDescription>Why stake your GOLD tokens?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-white">Earn Passive Income</h4>
                        <p className="text-sm text-gray-400">Get competitive APY rewards on your staked tokens</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-white">Governance Rights</h4>
                        <p className="text-sm text-gray-400">Participate in protocol decisions and voting</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-white">Reduced Fees</h4>
                        <p className="text-sm text-gray-400">Lower trading fees across the platform</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-white">Priority Access</h4>
                        <p className="text-sm text-gray-400">Early access to new features and products</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How It Works Card */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-amber-400">How Staking Works</CardTitle>
                  <CardDescription>Simple steps to start earning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Connect Wallet</h4>
                        <p className="text-sm text-gray-400">Connect your Solana wallet to get started</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Stake GOLD</h4>
                        <p className="text-sm text-gray-400">Choose amount and stake your GOLD tokens</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Earn Rewards</h4>
                        <p className="text-sm text-gray-400">Watch your rewards grow over time</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Claim & Unstake</h4>
                        <p className="text-sm text-gray-400">Claim rewards anytime, unstake after lock period</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Important Notes Card */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-amber-400">Important Notes</CardTitle>
                  <CardDescription>Things to keep in mind</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-sm text-amber-200">
                      <strong>Lock Period:</strong> Staked tokens are locked for 7 days minimum
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-blue-200">
                      <strong>Rewards:</strong> Claim your rewards anytime without affecting your stake
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-200">
                      <strong>APY:</strong> Rates vary by network - higher on testnet for testing
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </WalletContextProvider>
  )
}