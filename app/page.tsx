'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import SplashScreen from '@/components/SplashScreen'
import ViralHeroSection from '@/components/home/ViralHeroSection'
import LiveStatsSection from '@/components/home/LiveStatsSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import EducationalSection from '@/components/home/EducationalSection'
import TokenomicsSection from '@/components/home/TokenomicsSection'
import DeFiSection from '@/components/home/DeFiSection'
import TransparencySection from '@/components/home/TransparencySection'
import WalletCTASection from '@/components/home/WalletCTASection'
import Footer from '@/components/Footer'

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <main className="flex min-h-screen flex-col bg-black text-white">
        <Navbar />
        <ViralHeroSection />
        <LiveStatsSection />
        <EducationalSection />
        <TokenomicsSection />
        <div id="defi-section">
          <DeFiSection />
        </div>
        <HowItWorksSection />
        <TransparencySection />
        <WalletCTASection />
        <Footer />
      </main>
    </>
  )
}
