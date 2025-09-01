'use client'

import PageLayout from '@/components/PageLayout'
import RealContractManager from '@/components/contracts/RealContractManager'

export default function ContractsPage() {
  return (
    <PageLayout>
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Real Contract Addresses</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore and interact with real smart contracts across multiple blockchains with live data and verification
          </p>
        </div>

        {/* Real Contract Manager Component */}
        <RealContractManager />
      </div>
    </PageLayout>
  )
}