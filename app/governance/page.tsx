"use client"

import PageLayout from "@/components/PageLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletBalance } from "@/hooks/useWalletBalance"
import { Vote, Clock, Users, TrendingUp, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useState } from "react"

interface Proposal {
  id: string
  title: string
  description: string
  status: 'active' | 'passed' | 'rejected' | 'pending'
  votesFor: number
  votesAgainst: number
  totalVotes: number
  endDate: string
  proposer: string
  category: string
}

export default function GovernancePage() {
  const { connected, publicKey } = useWallet()
  const { balances } = useWalletBalance()
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null)

  // Mock governance data
  const proposals: Proposal[] = [
    {
      id: "1",
      title: "Increase Staking Rewards by 2%",
      description: "Proposal to increase the annual staking rewards from 8% to 10% to incentivize more token holders to participate in staking and governance.",
      status: "active",
      votesFor: 1250000,
      votesAgainst: 340000,
      totalVotes: 1590000,
      endDate: "2024-02-15",
      proposer: "GoldiumDAO",
      category: "Economic"
    },
    {
      id: "2",
      title: "Increase SOL-GOLD Pool Rewards",
      description: "Proposal to increase rewards for SOL-GOLD liquidity providers to boost pool participation and trading volume.",
      status: "active",
      votesFor: 2850000,
      votesAgainst: 450000,
      totalVotes: 3300000,
      endDate: "2024-02-20",
      proposer: "0x789...def",
      category: "Protocol"
    },
    {
      id: "3",
      title: "Treasury Allocation for Marketing",
      description: "Allocate 500,000 GOLD tokens from treasury for marketing campaigns to increase platform adoption.",
      status: "passed",
      votesFor: 2100000,
      votesAgainst: 450000,
      totalVotes: 2550000,
      endDate: "2024-01-30",
      proposer: "Marketing Team",
      category: "Treasury"
    },
    {
      id: "4",
      title: "Implement Cross-Chain Bridge",
      description: "Proposal to implement a cross-chain bridge to Ethereum network for increased interoperability.",
      status: "rejected",
      votesFor: 650000,
      votesAgainst: 1200000,
      totalVotes: 1850000,
      endDate: "2024-01-25",
      proposer: "Technical Team",
      category: "Technical"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />
      case 'passed': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500'
      case 'passed': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const votingPower = connected ? (balances.GOLD || 0) : 0
  const totalSupply = 1000000000 // 1B GOLD total supply
  const votingPowerPercentage = totalSupply > 0 ? (votingPower / totalSupply) * 100 : 0

  return (
    <PageLayout>
      <div className="container mx-auto max-w-7xl px-4 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Governance
            </span>
          </h1>
          <p className="text-lg text-gray-300">
            Participate in Goldium DAO governance and shape the future of the platform
          </p>
        </div>

        {!connected ? (
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Connect Your Wallet</h3>
              <p className="text-gray-400 mb-4">
                Connect your wallet to participate in governance and vote on proposals
              </p>
              <p className="text-sm text-gray-500">
                You need GOLD tokens to participate in governance
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Your Voting Power</h3>
                  <Vote className="h-5 w-5 text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-yellow-400 mb-2">
                  {votingPower.toLocaleString()} GOLD
                </p>
                <p className="text-sm text-gray-400">
                  {votingPowerPercentage.toFixed(4)}% of total supply
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Active Proposals</h3>
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-blue-400 mb-2">
                  {proposals.filter(p => p.status === 'active').length}
                </p>
                <p className="text-sm text-gray-400">
                  Proposals awaiting votes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Total Participants</h3>
                  <Users className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-green-400 mb-2">
                  1,234
                </p>
                <p className="text-sm text-gray-400">
                  Active governance participants
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="proposals" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="history">Voting History</TabsTrigger>
            <TabsTrigger value="create">Create Proposal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="proposals" className="mt-6">
            <div className="space-y-6">
              {proposals.map((proposal) => {
                const votePercentage = proposal.totalVotes > 0 ? (proposal.votesFor / proposal.totalVotes) * 100 : 0
                
                return (
                  <Card key={proposal.id} className="bg-gray-900 border-gray-800 hover:border-yellow-500/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-white">{proposal.title}</CardTitle>
                            <Badge className={`${getStatusColor(proposal.status)} text-white`}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(proposal.status)}
                                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                              </div>
                            </Badge>
                          </div>
                          <CardDescription className="text-gray-400">
                            {proposal.description}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>By: {proposal.proposer}</span>
                        <span>Category: {proposal.category}</span>
                        <span>Ends: {new Date(proposal.endDate).toLocaleDateString()}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Votes For: {proposal.votesFor.toLocaleString()}</span>
                            <span className="text-gray-400">Votes Against: {proposal.votesAgainst.toLocaleString()}</span>
                          </div>
                          <Progress value={votePercentage} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{votePercentage.toFixed(1)}% For</span>
                            <span>{(100 - votePercentage).toFixed(1)}% Against</span>
                          </div>
                        </div>
                        
                        {proposal.status === 'active' && connected && votingPower > 0 && (
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => setSelectedProposal(proposal.id)}
                            >
                              Vote For
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                              onClick={() => setSelectedProposal(proposal.id)}
                            >
                              Vote Against
                            </Button>
                          </div>
                        )}
                        
                        {proposal.status === 'active' && (!connected || votingPower === 0) && (
                          <div className="text-center py-2">
                            <p className="text-sm text-gray-400">
                              {!connected ? 'Connect wallet to vote' : 'You need GOLD tokens to vote'}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-yellow-400">Your Voting History</CardTitle>
                <CardDescription>Track your participation in governance decisions</CardDescription>
              </CardHeader>
              <CardContent>
                {connected ? (
                  <div className="text-center py-12">
                    <Vote className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">No Voting History</h3>
                    <p className="text-gray-400 mb-4">
                      You haven't participated in any votes yet
                    </p>
                    <p className="text-sm text-gray-500">
                      Start voting on active proposals to build your history
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400">Connect your wallet to view voting history</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="create" className="mt-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-yellow-400">Create New Proposal</CardTitle>
                <CardDescription>Submit a new proposal for community voting</CardDescription>
              </CardHeader>
              <CardContent>
                {connected && votingPower >= 10000 ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Proposal Title
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        placeholder="Enter proposal title..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea 
                        rows={4}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        placeholder="Describe your proposal in detail..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category
                      </label>
                      <select className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white">
                        <option value="economic">Economic</option>
                        <option value="technical">Technical</option>
                        <option value="treasury">Treasury</option>
                        <option value="governance">Governance</option>
                      </select>
                    </div>
                    
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                      Submit Proposal
                    </Button>
                    
                    <div className="text-sm text-gray-400 text-center">
                      <p>Proposal submission requires 10,000 GOLD tokens minimum</p>
                      <p>Your current balance: {votingPower.toLocaleString()} GOLD</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">
                      {!connected ? 'Connect Your Wallet' : 'Insufficient GOLD Balance'}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {!connected 
                        ? 'Connect your wallet to create proposals'
                        : 'You need at least 10,000 GOLD tokens to create a proposal'
                      }
                    </p>
                    {connected && (
                      <p className="text-sm text-gray-500">
                        Current balance: {votingPower.toLocaleString()} GOLD
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  )
}